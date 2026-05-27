from __future__ import annotations

import math
import random
import time

try:
    import cv2
    import mediapipe as mp
    import numpy as np
except ImportError as error:
    raise SystemExit(
        "Missing packages. Run this first:\n"
        "  pip install -r requirements.txt\n\n"
        f"Original error: {error}"
    ) from error


WINDOW_NAME = "Hand Gesture Snake"
CAMERA_INDEX = 0
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

GRID_COLS = 32
GRID_ROWS = 18
CELL_SIZE = CAMERA_WIDTH // GRID_COLS  # 40 px per cell
TOP_BAR = CAMERA_HEIGHT - GRID_ROWS * CELL_SIZE  # leftover pixels go to HUD

TICK_INTERVAL_START = 0.22
TICK_INTERVAL_MIN = 0.08
SPEED_UP_EVERY = 4  # foods eaten before speeding up
DEAD_ZONE = 0.12   # fraction from center before a tilt counts

CYAN = (255, 255, 0)
PINK = (190, 80, 255)
YELLOW = (0, 245, 255)
GREEN = (90, 255, 100)
RED = (70, 80, 255)
WHITE = (245, 245, 245)
DARK = (18, 20, 28)
GRID_COLOR = (40, 44, 60)


def cell_to_pixel(cell: tuple[int, int]) -> tuple[int, int]:
    """Top-left pixel of a grid cell."""
    cx, cy = cell
    return cx * CELL_SIZE, TOP_BAR + cy * CELL_SIZE


def desired_direction(
    hand_x: float, hand_y: float, current: tuple[int, int]
) -> tuple[int, int]:
    """Pick the new snake direction from the hand position (0..1 fractions).

    The hand offset from the centre tells us which way to tilt. We snap to the
    biggest axis (horizontal vs vertical). 180-degree reversals are blocked so
    the snake cannot drive directly into its own neck.
    """
    dx = hand_x - 0.5
    dy = hand_y - 0.5
    if abs(dx) < DEAD_ZONE and abs(dy) < DEAD_ZONE:
        return current  # too centred — keep going

    if abs(dx) > abs(dy):
        new = (1 if dx > 0 else -1, 0)
    else:
        new = (0, 1 if dy > 0 else -1)

    # Block reversal: if the new direction is the exact opposite of current,
    # ignore it. Otherwise the snake instantly eats itself.
    if (new[0] + current[0], new[1] + current[1]) == (0, 0):
        return current
    return new


def random_food(occupied: set[tuple[int, int]]) -> tuple[int, int]:
    """Pick a free cell for the next food."""
    free = [
        (x, y)
        for x in range(GRID_COLS)
        for y in range(GRID_ROWS)
        if (x, y) not in occupied
    ]
    return random.choice(free) if free else (0, 0)


def draw_grid(image) -> None:
    for col in range(GRID_COLS + 1):
        x = col * CELL_SIZE
        cv2.line(image, (x, TOP_BAR), (x, CAMERA_HEIGHT), GRID_COLOR, 1)
    for row in range(GRID_ROWS + 1):
        y = TOP_BAR + row * CELL_SIZE
        cv2.line(image, (0, y), (GRID_COLS * CELL_SIZE, y), GRID_COLOR, 1)


def draw_cell(image, cell, color, inset: int = 3) -> None:
    x, y = cell_to_pixel(cell)
    cv2.rectangle(
        image,
        (x + inset, y + inset),
        (x + CELL_SIZE - inset, y + CELL_SIZE - inset),
        color,
        -1,
        cv2.LINE_AA,
    )


def draw_snake(image, snake: list[tuple[int, int]], direction: tuple[int, int]) -> None:
    # Tail to body to head — the head gets eyes so the player can see where
    # it is heading.
    for index, cell in enumerate(snake):
        if index == 0:
            color = CYAN
        else:
            # Fade the body slightly toward the tail so it reads as a chain.
            fade = max(0.55, 1.0 - index * 0.02)
            color = tuple(int(channel * fade) for channel in CYAN)
        draw_cell(image, cell, color, inset=2)

    head_x, head_y = cell_to_pixel(snake[0])
    center = (head_x + CELL_SIZE // 2, head_y + CELL_SIZE // 2)
    eye_offset = CELL_SIZE // 5
    dx, dy = direction
    perp = (-dy, dx)
    left_eye = (center[0] + dx * 4 + perp[0] * eye_offset, center[1] + dy * 4 + perp[1] * eye_offset)
    right_eye = (center[0] + dx * 4 - perp[0] * eye_offset, center[1] + dy * 4 - perp[1] * eye_offset)
    cv2.circle(image, (int(left_eye[0]), int(left_eye[1])), 4, WHITE, -1, cv2.LINE_AA)
    cv2.circle(image, (int(right_eye[0]), int(right_eye[1])), 4, WHITE, -1, cv2.LINE_AA)


def draw_food(image, food: tuple[int, int], beat: float) -> None:
    x, y = cell_to_pixel(food)
    pulse = 1 + 0.18 * math.sin(beat * 5)
    radius = int((CELL_SIZE // 2 - 4) * pulse)
    cv2.circle(image, (x + CELL_SIZE // 2, y + CELL_SIZE // 2), radius, PINK, -1, cv2.LINE_AA)
    cv2.circle(image, (x + CELL_SIZE // 2, y + CELL_SIZE // 2), radius, WHITE, 2, cv2.LINE_AA)


def draw_hud(image, score: int, length: int, alive: bool, hand_seen: bool) -> None:
    cv2.rectangle(image, (0, 0), (CAMERA_WIDTH, TOP_BAR), DARK, -1)
    cv2.putText(image, f"SCORE {score}", (24, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.9, WHITE, 2, cv2.LINE_AA)
    cv2.putText(image, f"LENGTH {length}", (240, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.8, YELLOW, 2, cv2.LINE_AA)
    status = "Move your hand to steer." if hand_seen else "Show your hand to the camera."
    cv2.putText(image, status, (470, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.6, WHITE, 2, cv2.LINE_AA)
    cv2.putText(image, "Q quit  R restart", (CAMERA_WIDTH - 240, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.6, WHITE, 2, cv2.LINE_AA)

    if not alive:
        overlay = image.copy()
        cv2.rectangle(overlay, (0, TOP_BAR), (CAMERA_WIDTH, CAMERA_HEIGHT), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.55, image, 0.45, 0, image)
        cv2.putText(image, "GAME OVER", (CAMERA_WIDTH // 2 - 220, CAMERA_HEIGHT // 2 - 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.8, PINK, 4, cv2.LINE_AA)
        cv2.putText(image, "press R to play again", (CAMERA_WIDTH // 2 - 200, CAMERA_HEIGHT // 2 + 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, WHITE, 2, cv2.LINE_AA)


def new_game() -> dict:
    start_x = GRID_COLS // 2
    start_y = GRID_ROWS // 2
    snake = [(start_x - i, start_y) for i in range(3)]  # head at the right
    food = random_food(set(snake))
    return {
        "snake": snake,
        "direction": (1, 0),  # moving right
        "food": food,
        "score": 0,
        "alive": True,
        "last_tick": time.time(),
        "tick_interval": TICK_INTERVAL_START,
        "foods_eaten": 0,
    }


def step_game(game: dict) -> None:
    snake = game["snake"]
    head = snake[0]
    dx, dy = game["direction"]
    new_head = (head[0] + dx, head[1] + dy)

    # Wall collision
    if not (0 <= new_head[0] < GRID_COLS and 0 <= new_head[1] < GRID_ROWS):
        game["alive"] = False
        return

    # Self collision (tail will move away unless we are about to grow, so check
    # against everything except the current tail tip)
    body_without_tail = set(snake[:-1])
    if new_head in body_without_tail:
        game["alive"] = False
        return

    snake.insert(0, new_head)
    if new_head == game["food"]:
        game["score"] += 10
        game["foods_eaten"] += 1
        game["food"] = random_food(set(snake))
        if game["foods_eaten"] % SPEED_UP_EVERY == 0:
            game["tick_interval"] = max(TICK_INTERVAL_MIN, game["tick_interval"] - 0.018)
    else:
        snake.pop()  # no growth — drop the tail


def main() -> None:
    mp_hands = mp.solutions.hands
    camera = cv2.VideoCapture(CAMERA_INDEX)
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)

    if not camera.isOpened():
        raise SystemExit("Could not open webcam. Check camera permission or CAMERA_INDEX.")

    game = new_game()

    with mp_hands.Hands(
        max_num_hands=1,
        model_complexity=1,
        min_detection_confidence=0.65,
        min_tracking_confidence=0.65,
    ) as hands:
        while True:
            ok, frame = camera.read()
            if not ok:
                break

            frame = cv2.flip(frame, 1)
            display = np.zeros_like(frame)
            display[:] = (10, 12, 18)
            # Faint mirror of the camera in the play area so the player can
            # still see themself behind the grid.
            mirror = cv2.addWeighted(frame, 0.18, np.zeros_like(frame), 0.82, 0)
            display[TOP_BAR:, :] = mirror[TOP_BAR:, :]

            draw_grid(display)

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)

            hand_seen = False
            if result.multi_hand_landmarks and game["alive"]:
                hand_seen = True
                landmarks = result.multi_hand_landmarks[0].landmark
                # Use landmark 9 (palm centre) — feels more natural for "tilt"
                # control than the index fingertip.
                game["direction"] = desired_direction(
                    landmarks[9].x, landmarks[9].y, game["direction"]
                )

            now = time.time()
            if game["alive"] and now - game["last_tick"] >= game["tick_interval"]:
                step_game(game)
                game["last_tick"] = now

            draw_food(display, game["food"], now)
            draw_snake(display, game["snake"], game["direction"])
            draw_hud(display, game["score"], len(game["snake"]), game["alive"], hand_seen)

            cv2.imshow(WINDOW_NAME, display)
            key = cv2.waitKey(1) & 0xFF

            if key in (27, ord("q")):
                break
            if key == ord("r"):
                game = new_game()

    camera.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
