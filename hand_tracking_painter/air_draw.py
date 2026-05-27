from __future__ import annotations

import math
import random
import time
from dataclasses import dataclass
from pathlib import Path

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


WINDOW_NAME = "AI Air Painter"
CAMERA_INDEX = 0
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

DRAW_THICKNESS = 8
ERASER_RADIUS = 45
PINCH_DISTANCE = 45
SMOOTHING = 0.35

TOP_BAR_HEIGHT = 86
SWATCH_SIZE = 54
SWATCH_GAP = 16


COLORS = [
    ("cyan", (255, 255, 0)),
    ("pink", (180, 80, 255)),
    ("yellow", (0, 255, 255)),
    ("green", (80, 255, 80)),
    ("blue", (255, 150, 40)),
    ("white", (255, 255, 255)),
]


@dataclass
class Particle:
    x: float
    y: float
    vx: float
    vy: float
    life: int
    color: tuple[int, int, int]

    def update(self) -> None:
        self.x += self.vx
        self.y += self.vy
        self.vx *= 0.96
        self.vy *= 0.96
        self.life -= 1


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


def draw_glow_line(
    image,
    start: tuple[int, int],
    end: tuple[int, int],
    color: tuple[int, int, int],
    thickness: int,
) -> None:
    cv2.line(image, start, end, color, thickness + 14, cv2.LINE_AA)
    cv2.line(image, start, end, color, thickness + 6, cv2.LINE_AA)
    cv2.line(image, start, end, (255, 255, 255), max(2, thickness // 3), cv2.LINE_AA)


def draw_hand_skeleton(image, landmarks, width: int, height: int) -> None:
    cyan = (255, 255, 0)
    hot = (170, 80, 255)

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
        cv2.line(image, start, end, cyan, 3, cv2.LINE_AA)

    for index in range(21):
        point = landmark_point(landmarks, index, width, height)
        radius = 5 if index in (4, 8, 12, 16, 20) else 3
        cv2.circle(image, point, radius, hot, -1, cv2.LINE_AA)


def create_firework(
    particles: list[Particle],
    center: tuple[int, int],
    color: tuple[int, int, int],
) -> None:
    for _ in range(34):
        angle = random.uniform(0, math.tau)
        speed = random.uniform(2.0, 8.0)
        particles.append(
            Particle(
                x=center[0],
                y=center[1],
                vx=math.cos(angle) * speed,
                vy=math.sin(angle) * speed,
                life=random.randint(18, 34),
                color=color,
            )
        )


def draw_particles(image, particles: list[Particle]) -> None:
    alive: list[Particle] = []

    for particle in particles:
        particle.update()
        if particle.life <= 0:
            continue

        alive.append(particle)
        alpha = max(0.15, particle.life / 34)
        color = tuple(int(channel * alpha) for channel in particle.color)
        cv2.circle(
            image,
            (int(particle.x), int(particle.y)),
            3,
            color,
            -1,
            cv2.LINE_AA,
        )

    particles[:] = alive[-220:]


def draw_toolbar(
    image,
    selected_color_index: int,
    selected_tool: str,
) -> list[tuple[str, tuple[int, int, int], tuple[int, int, int, int]]]:
    height, width = image.shape[:2]
    overlay = image.copy()
    cv2.rectangle(overlay, (0, 0), (width, TOP_BAR_HEIGHT), (16, 16, 18), -1)
    cv2.addWeighted(overlay, 0.72, image, 0.28, 0, image)

    items: list[tuple[str, tuple[int, int, int], tuple[int, int, int, int]]] = []
    x = 22
    y = 16

    for index, (name, color) in enumerate(COLORS):
        rect = (x, y, x + SWATCH_SIZE, y + SWATCH_SIZE)
        items.append((name, color, rect))
        border = (255, 255, 255) if index == selected_color_index else (90, 90, 90)
        cv2.rectangle(image, (rect[0], rect[1]), (rect[2], rect[3]), color, -1)
        cv2.rectangle(image, (rect[0], rect[1]), (rect[2], rect[3]), border, 3)
        x += SWATCH_SIZE + SWATCH_GAP

    eraser_rect = (x + 10, y, x + 10 + SWATCH_SIZE, y + SWATCH_SIZE)
    items.append(("eraser", (0, 0, 0), eraser_rect))
    eraser_border = (255, 255, 255) if selected_tool == "eraser" else (90, 90, 90)
    cv2.rectangle(image, (eraser_rect[0], eraser_rect[1]), (eraser_rect[2], eraser_rect[3]), (35, 35, 35), -1)
    cv2.rectangle(image, (eraser_rect[0], eraser_rect[1]), (eraser_rect[2], eraser_rect[3]), eraser_border, 3)
    cv2.line(image, (eraser_rect[0] + 14, eraser_rect[3] - 14), (eraser_rect[2] - 14, eraser_rect[1] + 14), (255, 255, 255), 5, cv2.LINE_AA)

    clear_rect = (eraser_rect[2] + SWATCH_GAP, y, eraser_rect[2] + SWATCH_GAP + SWATCH_SIZE, y + SWATCH_SIZE)
    items.append(("clear", (0, 0, 0), clear_rect))
    cv2.rectangle(image, (clear_rect[0], clear_rect[1]), (clear_rect[2], clear_rect[3]), (35, 35, 35), -1)
    cv2.rectangle(image, (clear_rect[0], clear_rect[1]), (clear_rect[2], clear_rect[3]), (90, 90, 90), 3)
    cv2.line(image, (clear_rect[0] + 15, clear_rect[1] + 15), (clear_rect[2] - 15, clear_rect[3] - 15), (255, 255, 255), 4, cv2.LINE_AA)
    cv2.line(image, (clear_rect[2] - 15, clear_rect[1] + 15), (clear_rect[0] + 15, clear_rect[3] - 15), (255, 255, 255), 4, cv2.LINE_AA)

    return items


def point_in_rect(point: tuple[int, int], rect: tuple[int, int, int, int]) -> bool:
    return rect[0] <= point[0] <= rect[2] and rect[1] <= point[1] <= rect[3]


def save_canvas(canvas) -> Path:
    output_dir = Path("saved_drawings")
    output_dir.mkdir(exist_ok=True)
    filename = output_dir / f"air_painting_{time.strftime('%Y%m%d_%H%M%S')}.png"
    cv2.imwrite(str(filename), canvas)
    return filename


def main() -> None:
    mp_hands = mp.solutions.hands

    camera = cv2.VideoCapture(CAMERA_INDEX)
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)

    if not camera.isOpened():
        raise SystemExit("Could not open the webcam. Check camera permission or CAMERA_INDEX.")

    ok, frame = camera.read()
    if not ok:
        raise SystemExit("The webcam opened, but no frame was received.")

    frame = cv2.flip(frame, 1)
    height, width = frame.shape[:2]
    canvas = np.zeros((height, width, 3), dtype=np.uint8)
    selected_color_index = 0
    selected_tool = "pen"
    previous_point: tuple[int, int] | None = None
    smoothed_point: tuple[int, int] | None = None
    show_camera_background = False
    particles: list[Particle] = []
    last_pinched = False
    status_message = "One finger draws. Two fingers select. Open palm erases."
    status_until = time.time() + 4

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

            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)

            if show_camera_background:
                display = cv2.addWeighted(frame, 0.24, np.zeros_like(frame), 0.76, 0)
            else:
                display = np.zeros_like(frame)

            glow = cv2.GaussianBlur(canvas, (0, 0), 9)
            display = cv2.addWeighted(display, 1.0, glow, 0.75, 0)
            display = cv2.addWeighted(display, 1.0, canvas, 1.0, 0)

            toolbar_items = draw_toolbar(display, selected_color_index, selected_tool)
            active_hand_found = False

            if result.multi_hand_landmarks:
                for hand_landmarks in result.multi_hand_landmarks:
                    landmarks = hand_landmarks.landmark
                    draw_hand_skeleton(display, landmarks, width, height)

                    index_tip = landmark_point(landmarks, 8, width, height)
                    thumb_tip = landmark_point(landmarks, 4, width, height)
                    fingers = get_fingers(landmarks)
                    raised_count = sum(fingers.values())

                    if smoothed_point is None:
                        smoothed_point = index_tip
                    else:
                        smoothed_point = (
                            int(smoothed_point[0] * (1 - SMOOTHING) + index_tip[0] * SMOOTHING),
                            int(smoothed_point[1] * (1 - SMOOTHING) + index_tip[1] * SMOOTHING),
                        )

                    active_hand_found = True
                    color = COLORS[selected_color_index][1]
                    pinch_now = distance(index_tip, thumb_tip) < PINCH_DISTANCE

                    if pinch_now and not last_pinched:
                        create_firework(particles, smoothed_point, color)
                        status_message = "Firework!"
                        status_until = time.time() + 1.0
                    last_pinched = pinch_now

                    if fingers["index"] and fingers["middle"] and not fingers["ring"] and not fingers["pinky"]:
                        previous_point = None
                        cv2.circle(display, smoothed_point, 13, color, 2, cv2.LINE_AA)

                        for item_name, item_color, rect in toolbar_items:
                            if point_in_rect(smoothed_point, rect):
                                if item_name == "eraser":
                                    selected_tool = "eraser"
                                    status_message = "Eraser selected"
                                elif item_name == "clear":
                                    canvas[:] = 0
                                    status_message = "Canvas cleared"
                                else:
                                    selected_tool = "pen"
                                    for index, (color_name, _) in enumerate(COLORS):
                                        if color_name == item_name:
                                            selected_color_index = index
                                            status_message = f"{item_name.title()} selected"
                                            break
                                status_until = time.time() + 1.2

                    elif raised_count >= 4:
                        previous_point = None
                        selected_tool = "eraser"
                        cv2.circle(display, smoothed_point, ERASER_RADIUS, (255, 255, 255), 2, cv2.LINE_AA)
                        cv2.circle(canvas, smoothed_point, ERASER_RADIUS, (0, 0, 0), -1, cv2.LINE_AA)

                    elif fingers["index"] and not fingers["middle"] and not fingers["ring"] and not fingers["pinky"]:
                        if selected_tool == "eraser":
                            cv2.circle(display, smoothed_point, ERASER_RADIUS, (255, 255, 255), 2, cv2.LINE_AA)
                            cv2.circle(canvas, smoothed_point, ERASER_RADIUS, (0, 0, 0), -1, cv2.LINE_AA)
                        else:
                            if previous_point is not None and smoothed_point[1] > TOP_BAR_HEIGHT:
                                draw_glow_line(canvas, previous_point, smoothed_point, color, DRAW_THICKNESS)
                            cv2.circle(display, smoothed_point, 11, color, -1, cv2.LINE_AA)
                        previous_point = smoothed_point

                    else:
                        previous_point = None

            if not active_hand_found:
                previous_point = None
                smoothed_point = None
                last_pinched = False

            draw_particles(display, particles)

            if time.time() < status_until:
                cv2.putText(
                    display,
                    status_message,
                    (22, height - 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.75,
                    (230, 230, 230),
                    2,
                    cv2.LINE_AA,
                )

            cv2.imshow(WINDOW_NAME, display)
            key = cv2.waitKey(1) & 0xFF

            if key in (27, ord("q")):
                break
            if key == ord("c"):
                canvas[:] = 0
                status_message = "Canvas cleared"
                status_until = time.time() + 1.2
            if key == ord("s"):
                filename = save_canvas(canvas)
                status_message = f"Saved {filename}"
                status_until = time.time() + 2.0
            if key == ord("v"):
                show_camera_background = not show_camera_background
                status_message = "Camera background on" if show_camera_background else "Black background on"
                status_until = time.time() + 1.2
            if key == ord("e"):
                selected_tool = "pen" if selected_tool == "eraser" else "eraser"
                status_message = f"{selected_tool.title()} selected"
                status_until = time.time() + 1.2

    camera.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
