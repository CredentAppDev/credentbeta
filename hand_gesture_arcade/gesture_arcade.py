from __future__ import annotations

import math
import random
import time
from dataclasses import dataclass, field

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


WINDOW_NAME = "Hand Gesture Arcade"
CAMERA_INDEX = 0
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

GAME_SECONDS = 60
PLAYER_RADIUS = 28
PINCH_DISTANCE = 45
BLAST_RADIUS = 165
BLAST_COOLDOWN = 1.25
SMOOTHING = 0.34

CYAN = (255, 255, 0)
PINK = (190, 80, 255)
YELLOW = (0, 245, 255)
GREEN = (90, 255, 100)
RED = (70, 80, 255)
WHITE = (245, 245, 245)
ORANGE = (0, 170, 255)
PURPLE = (255, 90, 200)


@dataclass
class FallingItem:
    x: float
    y: float
    vy: float
    radius: int
    kind: str
    color: tuple[int, int, int]
    points: int
    wobble: float
    age: float = 0.0

    def update(self, dt: float) -> None:
        self.age += dt
        self.y += self.vy * dt
        self.x += math.sin(self.age * 5.0 + self.wobble) * 0.9


@dataclass
class Particle:
    x: float
    y: float
    vx: float
    vy: float
    life: float
    color: tuple[int, int, int]
    size: int

    def update(self, dt: float) -> None:
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.vx *= 0.96
        self.vy *= 0.96
        self.life -= dt


@dataclass
class FloatingText:
    text: str
    x: float
    y: float
    life: float
    color: tuple[int, int, int]

    def update(self, dt: float) -> None:
        self.y -= 36 * dt
        self.life -= dt


@dataclass
class Shockwave:
    x: float
    y: float
    radius: float
    life: float
    color: tuple[int, int, int]

    def update(self, dt: float) -> None:
        self.radius += 520 * dt
        self.life -= dt


@dataclass
class GameState:
    width: int
    height: int
    score: int = 0
    hearts: int = 3
    combo: int = 0
    started_at: float = field(default_factory=time.time)
    last_spawn: float = field(default_factory=time.time)
    blast_ready_at: float = 0.0
    game_over: bool = False
    items: list[FallingItem] = field(default_factory=list)
    particles: list[Particle] = field(default_factory=list)
    texts: list[FloatingText] = field(default_factory=list)
    shockwaves: list[Shockwave] = field(default_factory=list)


def distance(a: tuple[int, int], b: tuple[int, int]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def landmark_point(landmarks, index: int, width: int, height: int) -> tuple[int, int]:
    landmark = landmarks[index]
    return int(landmark.x * width), int(landmark.y * height)


def finger_up(landmarks, tip: int, pip: int) -> bool:
    return landmarks[tip].y < landmarks[pip].y - 0.015


def get_fingers(landmarks) -> dict[str, bool]:
    return {
        "index": finger_up(landmarks, 8, 6),
        "middle": finger_up(landmarks, 12, 10),
        "ring": finger_up(landmarks, 16, 14),
        "pinky": finger_up(landmarks, 20, 18),
    }


def draw_hand_skeleton(image, landmarks, width: int, height: int) -> None:
    connections = [
        (0, 1),
        (1, 2),
        (2, 3),
        (3, 4),
        (0, 5),
        (5, 6),
        (6, 7),
        (7, 8),
        (0, 9),
        (9, 10),
        (10, 11),
        (11, 12),
        (0, 13),
        (13, 14),
        (14, 15),
        (15, 16),
        (0, 17),
        (17, 18),
        (18, 19),
        (19, 20),
        (5, 9),
        (9, 13),
        (13, 17),
    ]

    for start_index, end_index in connections:
        start = landmark_point(landmarks, start_index, width, height)
        end = landmark_point(landmarks, end_index, width, height)
        cv2.line(image, start, end, CYAN, 3, cv2.LINE_AA)

    for index in range(21):
        point = landmark_point(landmarks, index, width, height)
        radius = 5 if index in (4, 8, 12, 16, 20) else 3
        cv2.circle(image, point, radius, PINK, -1, cv2.LINE_AA)


def draw_star(image, center: tuple[int, int], radius: int, color: tuple[int, int, int]) -> None:
    points = []
    for index in range(10):
        angle = -math.pi / 2 + index * math.pi / 5
        r = radius if index % 2 == 0 else radius * 0.45
        points.append((int(center[0] + math.cos(angle) * r), int(center[1] + math.sin(angle) * r)))

    polygon = np.array(points, dtype=np.int32)
    glow = image.copy()
    cv2.fillPoly(glow, [polygon], color)
    cv2.addWeighted(glow, 0.35, image, 0.65, 0, image)
    cv2.polylines(image, [polygon], True, WHITE, 2, cv2.LINE_AA)


def draw_gem(image, center: tuple[int, int], radius: int, color: tuple[int, int, int]) -> None:
    x, y = center
    points = np.array(
        [
            (x, y - radius),
            (x + radius, y),
            (x, y + radius),
            (x - radius, y),
        ],
        dtype=np.int32,
    )
    cv2.fillPoly(image, [points], color)
    cv2.polylines(image, [points], True, WHITE, 2, cv2.LINE_AA)
    cv2.line(image, (x - radius // 2, y), (x + radius // 2, y), WHITE, 1, cv2.LINE_AA)


def draw_bomb(image, center: tuple[int, int], radius: int) -> None:
    x, y = center
    cv2.circle(image, center, radius, RED, -1, cv2.LINE_AA)
    cv2.circle(image, center, radius, WHITE, 2, cv2.LINE_AA)
    cv2.line(image, (x - radius // 2, y - radius // 2), (x + radius // 2, y + radius // 2), WHITE, 3, cv2.LINE_AA)
    cv2.line(image, (x + radius // 2, y - radius // 2), (x - radius // 2, y + radius // 2), WHITE, 3, cv2.LINE_AA)
    cv2.line(image, (x, y - radius), (x + 12, y - radius - 18), ORANGE, 3, cv2.LINE_AA)


def draw_item(image, item: FallingItem) -> None:
    center = (int(item.x), int(item.y))
    if item.kind == "star":
        draw_star(image, center, item.radius, item.color)
    elif item.kind == "gem":
        draw_gem(image, center, item.radius, item.color)
    else:
        draw_bomb(image, center, item.radius)


def spawn_item(state: GameState) -> None:
    elapsed = time.time() - state.started_at
    speed_boost = min(140, elapsed * 2.5)
    roll = random.random()

    if roll < 0.24:
        kind = "bomb"
        color = RED
        points = 0
        radius = random.randint(24, 34)
        vy = random.uniform(145, 250) + speed_boost
    elif roll < 0.42:
        kind = "gem"
        color = PURPLE
        points = 25
        radius = random.randint(22, 30)
        vy = random.uniform(155, 245) + speed_boost
    else:
        kind = "star"
        color = random.choice([YELLOW, CYAN, GREEN])
        points = 10
        radius = random.randint(25, 36)
        vy = random.uniform(130, 230) + speed_boost

    state.items.append(
        FallingItem(
            x=random.randint(70, state.width - 70),
            y=-50,
            vy=vy,
            radius=radius,
            kind=kind,
            color=color,
            points=points,
            wobble=random.uniform(0, math.tau),
        )
    )


def add_burst(
    state: GameState,
    center: tuple[int, int],
    color: tuple[int, int, int],
    amount: int = 28,
) -> None:
    for _ in range(amount):
        angle = random.uniform(0, math.tau)
        speed = random.uniform(80, 360)
        state.particles.append(
            Particle(
                x=center[0],
                y=center[1],
                vx=math.cos(angle) * speed,
                vy=math.sin(angle) * speed,
                life=random.uniform(0.25, 0.75),
                color=color,
                size=random.randint(2, 5),
            )
        )


def add_text(
    state: GameState,
    text: str,
    center: tuple[int, int],
    color: tuple[int, int, int],
) -> None:
    state.texts.append(FloatingText(text=text, x=center[0], y=center[1], life=0.75, color=color))


def collect_item(state: GameState, item: FallingItem, shield_active: bool) -> None:
    center = (int(item.x), int(item.y))

    if item.kind == "bomb":
        if shield_active:
            state.score += 5
            add_text(state, "+5 shield", center, CYAN)
            add_burst(state, center, CYAN, 20)
        else:
            state.hearts -= 1
            state.combo = 0
            add_text(state, "-1 heart", center, RED)
            add_burst(state, center, RED, 36)
        return

    state.combo += 1
    combo_bonus = min(25, state.combo * 2)
    gained = item.points + combo_bonus
    state.score += gained
    add_text(state, f"+{gained}", center, item.color)
    add_burst(state, center, item.color, 26)


def use_blast(state: GameState, center: tuple[int, int]) -> None:
    now = time.time()
    if now < state.blast_ready_at:
        return

    state.blast_ready_at = now + BLAST_COOLDOWN
    state.shockwaves.append(Shockwave(center[0], center[1], 8, 0.45, CYAN))
    add_burst(state, center, CYAN, 48)

    kept_items: list[FallingItem] = []
    blasted = 0
    for item in state.items:
        item_center = (int(item.x), int(item.y))
        if distance(center, item_center) <= BLAST_RADIUS + item.radius:
            blasted += 1
            if item.kind == "bomb":
                state.score += 3
                add_text(state, "+3", item_center, CYAN)
            else:
                state.score += item.points
                add_text(state, f"+{item.points}", item_center, item.color)
            add_burst(state, item_center, item.color, 18)
        else:
            kept_items.append(item)

    state.items = kept_items
    if blasted:
        state.combo += blasted


def update_game(
    state: GameState,
    dt: float,
    cursor: tuple[int, int] | None,
    shield_active: bool,
    pinch_started: bool,
) -> None:
    if state.game_over:
        return

    now = time.time()
    remaining = GAME_SECONDS - (now - state.started_at)
    if remaining <= 0 or state.hearts <= 0:
        state.game_over = True
        return

    spawn_delay = max(0.28, 0.75 - (now - state.started_at) * 0.006)
    if now - state.last_spawn >= spawn_delay:
        spawn_item(state)
        state.last_spawn = now

    if pinch_started and cursor is not None:
        use_blast(state, cursor)

    kept_items: list[FallingItem] = []
    for item in state.items:
        item.update(dt)

        if item.y > state.height + 70:
            if item.kind in ("star", "gem"):
                state.combo = 0
            continue

        if cursor is not None and distance(cursor, (int(item.x), int(item.y))) <= PLAYER_RADIUS + item.radius:
            collect_item(state, item, shield_active)
            continue

        kept_items.append(item)

    state.items = kept_items

    for particle in state.particles:
        particle.update(dt)
    state.particles = [particle for particle in state.particles if particle.life > 0][-420:]

    for floating_text in state.texts:
        floating_text.update(dt)
    state.texts = [floating_text for floating_text in state.texts if floating_text.life > 0]

    for shockwave in state.shockwaves:
        shockwave.update(dt)
    state.shockwaves = [shockwave for shockwave in state.shockwaves if shockwave.life > 0]


def draw_particles(image, state: GameState) -> None:
    for shockwave in state.shockwaves:
        alpha = max(0.0, min(1.0, shockwave.life / 0.45))
        color = tuple(int(channel * alpha) for channel in shockwave.color)
        cv2.circle(image, (int(shockwave.x), int(shockwave.y)), int(shockwave.radius), color, 3, cv2.LINE_AA)

    for particle in state.particles:
        alpha = max(0.0, min(1.0, particle.life / 0.75))
        color = tuple(int(channel * alpha) for channel in particle.color)
        cv2.circle(image, (int(particle.x), int(particle.y)), particle.size, color, -1, cv2.LINE_AA)

    for floating_text in state.texts:
        alpha = max(0.0, min(1.0, floating_text.life / 0.75))
        color = tuple(int(channel * alpha) for channel in floating_text.color)
        cv2.putText(
            image,
            floating_text.text,
            (int(floating_text.x - 32), int(floating_text.y)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.72,
            color,
            2,
            cv2.LINE_AA,
        )


def draw_cursor(
    image,
    cursor: tuple[int, int] | None,
    shield_active: bool,
    blast_ready_ratio: float,
) -> None:
    if cursor is None:
        return

    color = GREEN if shield_active else CYAN
    cv2.circle(image, cursor, PLAYER_RADIUS + 18, color, 2, cv2.LINE_AA)
    cv2.circle(image, cursor, PLAYER_RADIUS, color, -1, cv2.LINE_AA)
    cv2.circle(image, cursor, 8, WHITE, -1, cv2.LINE_AA)

    if shield_active:
        cv2.circle(image, cursor, PLAYER_RADIUS + 54, GREEN, 3, cv2.LINE_AA)

    if blast_ready_ratio < 1.0:
        start_angle = -90
        end_angle = int(-90 + 360 * blast_ready_ratio)
        cv2.ellipse(image, cursor, (PLAYER_RADIUS + 34, PLAYER_RADIUS + 34), 0, start_angle, end_angle, PINK, 4)


def draw_hud(image, state: GameState, hand_seen: bool) -> None:
    height, width = image.shape[:2]
    overlay = image.copy()
    cv2.rectangle(overlay, (0, 0), (width, 82), (12, 12, 18), -1)
    cv2.rectangle(overlay, (0, height - 58), (width, height), (12, 12, 18), -1)
    cv2.addWeighted(overlay, 0.72, image, 0.28, 0, image)

    remaining = max(0, int(GAME_SECONDS - (time.time() - state.started_at)))
    hearts_text = "HEARTS " + "|" * max(0, state.hearts)
    combo_text = f"COMBO x{state.combo}" if state.combo else "COMBO x0"

    cv2.putText(image, f"SCORE {state.score}", (24, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.86, WHITE, 2, cv2.LINE_AA)
    cv2.putText(image, hearts_text, (250, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.78, RED, 2, cv2.LINE_AA)
    cv2.putText(image, f"TIME {remaining}", (500, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.78, YELLOW, 2, cv2.LINE_AA)
    cv2.putText(image, combo_text, (680, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.78, CYAN, 2, cv2.LINE_AA)

    guide = "Index finger moves. Catch stars and gems. Avoid bombs. Open palm shields. Pinch blasts. R restarts. Q quits."
    if not hand_seen:
        guide = "Show your hand to the camera to start controlling the game."

    cv2.putText(image, guide, (24, height - 22), cv2.FONT_HERSHEY_SIMPLEX, 0.62, WHITE, 2, cv2.LINE_AA)


def draw_game_over(image, state: GameState) -> None:
    height, width = image.shape[:2]
    overlay = image.copy()
    cv2.rectangle(overlay, (0, 0), (width, height), (0, 0, 0), -1)
    cv2.addWeighted(overlay, 0.58, image, 0.42, 0, image)

    title = "GAME OVER"
    subtitle = f"Final Score: {state.score}"
    prompt = "Press R to play again or Q to quit"
    cv2.putText(image, title, (width // 2 - 180, height // 2 - 68), cv2.FONT_HERSHEY_SIMPLEX, 1.6, PINK, 4, cv2.LINE_AA)
    cv2.putText(image, subtitle, (width // 2 - 150, height // 2), cv2.FONT_HERSHEY_SIMPLEX, 1.0, WHITE, 2, cv2.LINE_AA)
    cv2.putText(image, prompt, (width // 2 - 245, height // 2 + 52), cv2.FONT_HERSHEY_SIMPLEX, 0.8, CYAN, 2, cv2.LINE_AA)


def main() -> None:
    mp_hands = mp.solutions.hands

    camera = cv2.VideoCapture(CAMERA_INDEX)
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)

    if not camera.isOpened():
        raise SystemExit("Could not open webcam. Check camera permission or CAMERA_INDEX.")

    ok, frame = camera.read()
    if not ok:
        raise SystemExit("The webcam opened, but no frame was received.")

    frame = cv2.flip(frame, 1)
    height, width = frame.shape[:2]
    state = GameState(width=width, height=height)
    show_camera_background = True
    smoothed_cursor: tuple[int, int] | None = None
    was_pinching = False
    last_frame_time = time.time()

    with mp_hands.Hands(
        max_num_hands=2,
        model_complexity=1,
        min_detection_confidence=0.65,
        min_tracking_confidence=0.65,
    ) as hands:
        while True:
            ok, frame = camera.read()
            if not ok:
                break

            now = time.time()
            dt = min(0.05, now - last_frame_time)
            last_frame_time = now

            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)

            if show_camera_background:
                display = cv2.addWeighted(frame, 0.26, np.zeros_like(frame), 0.74, 0)
            else:
                display = np.zeros_like(frame)

            cursor: tuple[int, int] | None = None
            hand_seen = False
            shield_active = False
            pinching_now = False

            if result.multi_hand_landmarks:
                hand_seen = True
                hand_landmarks = result.multi_hand_landmarks[0]
                landmarks = hand_landmarks.landmark
                draw_hand_skeleton(display, landmarks, width, height)

                index_tip = landmark_point(landmarks, 8, width, height)
                thumb_tip = landmark_point(landmarks, 4, width, height)
                fingers = get_fingers(landmarks)
                shield_active = all(fingers.values())
                pinching_now = distance(index_tip, thumb_tip) < PINCH_DISTANCE

                if smoothed_cursor is None:
                    smoothed_cursor = index_tip
                else:
                    smoothed_cursor = (
                        int(smoothed_cursor[0] * (1 - SMOOTHING) + index_tip[0] * SMOOTHING),
                        int(smoothed_cursor[1] * (1 - SMOOTHING) + index_tip[1] * SMOOTHING),
                    )
                cursor = smoothed_cursor
            else:
                smoothed_cursor = None

            pinch_started = pinching_now and not was_pinching
            was_pinching = pinching_now

            update_game(state, dt, cursor, shield_active, pinch_started)

            for item in state.items:
                draw_item(display, item)

            draw_particles(display, state)

            blast_ready_ratio = min(1.0, max(0.0, 1.0 - (state.blast_ready_at - time.time()) / BLAST_COOLDOWN))
            draw_cursor(display, cursor, shield_active, blast_ready_ratio)
            draw_hud(display, state, hand_seen)

            if state.game_over:
                draw_game_over(display, state)

            cv2.imshow(WINDOW_NAME, display)
            key = cv2.waitKey(1) & 0xFF

            if key in (27, ord("q")):
                break
            if key == ord("r"):
                state = GameState(width=width, height=height)
                smoothed_cursor = None
                was_pinching = False
            if key == ord("v"):
                show_camera_background = not show_camera_background

    camera.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
