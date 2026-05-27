from __future__ import annotations

import math
import time
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


WINDOW_NAME = "Hand Gesture Name Writer"
CAMERA_INDEX = 0
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

TOP_BAR_HEIGHT = 92
DRAW_THICKNESS = 8
ERASER_RADIUS = 42
PINCH_DISTANCE = 45
SMOOTHING = 0.35

CYAN = (255, 255, 0)
PINK = (180, 80, 255)
YELLOW = (0, 245, 255)
GREEN = (80, 255, 100)
WHITE = (245, 245, 245)
BLACK = (0, 0, 0)


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
    cv2.line(image, start, end, WHITE, max(2, thickness // 3), cv2.LINE_AA)


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


def draw_writing_box(image, show_box: bool) -> None:
    height, width = image.shape[:2]
    if not show_box:
        return

    box_top = TOP_BAR_HEIGHT + 54
    box_bottom = height - 78
    box_mid = (box_top + box_bottom) // 2

    cv2.rectangle(image, (42, box_top), (width - 42, box_bottom), (42, 44, 58), 2)
    cv2.line(image, (60, box_mid + 78), (width - 60, box_mid + 78), (55, 60, 72), 2, cv2.LINE_AA)


def draw_hud(
    image,
    mode: str,
    show_box: bool,
    status_message: str,
    status_until: float,
) -> None:
    height, width = image.shape[:2]
    overlay = image.copy()
    cv2.rectangle(overlay, (0, 0), (width, TOP_BAR_HEIGHT), (13, 14, 22), -1)
    cv2.addWeighted(overlay, 0.76, image, 0.24, 0, image)

    cv2.putText(
        image,
        "Write your name with hand gestures",
        (24, 34),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.86,
        WHITE,
        2,
        cv2.LINE_AA,
    )
    cv2.putText(
        image,
        f"Mode: {mode}   Box: {'on' if show_box else 'off'}",
        (24, 70),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.62,
        CYAN if mode == "write" else YELLOW if mode == "erase" else GREEN,
        2,
        cv2.LINE_AA,
    )

    controls = "Index writes | Open palm pauses | Pinch erases | C clear | S save | B box | V background | Q quit"
    cv2.putText(image, controls, (360, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.54, WHITE, 2, cv2.LINE_AA)

    if time.time() < status_until:
        cv2.putText(
            image,
            status_message,
            (24, height - 28),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.72,
            WHITE,
            2,
            cv2.LINE_AA,
        )


def save_canvas(canvas) -> Path:
    output_dir = Path("saved_names")
    output_dir.mkdir(exist_ok=True)
    filename = output_dir / f"hand_written_name_{time.strftime('%Y%m%d_%H%M%S')}.png"
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
    previous_point: tuple[int, int] | None = None
    smoothed_point: tuple[int, int] | None = None
    show_camera_background = False
    show_box = True
    status_message = "Use one index finger to write any name."
    status_until = time.time() + 4
    mode = "pause"

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
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)

            if show_camera_background:
                display = cv2.addWeighted(frame, 0.24, np.zeros_like(frame), 0.76, 0)
            else:
                display = np.zeros_like(frame)

            draw_writing_box(display, show_box)

            glow = cv2.GaussianBlur(canvas, (0, 0), 9)
            display = cv2.addWeighted(display, 1.0, glow, 0.72, 0)
            display = cv2.addWeighted(display, 1.0, canvas, 1.0, 0)

            hand_seen = False
            if result.multi_hand_landmarks:
                hand_seen = True
                landmarks = result.multi_hand_landmarks[0].landmark
                draw_hand_skeleton(display, landmarks, width, height)

                index_tip = landmark_point(landmarks, 8, width, height)
                thumb_tip = landmark_point(landmarks, 4, width, height)
                fingers = get_fingers(landmarks)
                pinching = distance(index_tip, thumb_tip) < PINCH_DISTANCE
                open_palm = all(fingers.values())
                index_only = fingers["index"] and not fingers["middle"] and not fingers["ring"] and not fingers["pinky"]

                if smoothed_point is None:
                    smoothed_point = index_tip
                else:
                    smoothed_point = (
                        int(smoothed_point[0] * (1 - SMOOTHING) + index_tip[0] * SMOOTHING),
                        int(smoothed_point[1] * (1 - SMOOTHING) + index_tip[1] * SMOOTHING),
                    )

                if pinching:
                    mode = "erase"
                    previous_point = None
                    cv2.circle(display, smoothed_point, ERASER_RADIUS, WHITE, 2, cv2.LINE_AA)
                    cv2.circle(canvas, smoothed_point, ERASER_RADIUS, BLACK, -1, cv2.LINE_AA)
                elif open_palm:
                    mode = "pause"
                    previous_point = None
                    cv2.circle(display, smoothed_point, 24, GREEN, 2, cv2.LINE_AA)
                elif index_only and smoothed_point[1] > TOP_BAR_HEIGHT:
                    mode = "write"
                    if previous_point is not None:
                        draw_glow_line(canvas, previous_point, smoothed_point, CYAN, DRAW_THICKNESS)
                    cv2.circle(display, smoothed_point, 12, CYAN, -1, cv2.LINE_AA)
                    previous_point = smoothed_point
                else:
                    mode = "pause"
                    previous_point = None
                    cv2.circle(display, smoothed_point, 12, YELLOW, 2, cv2.LINE_AA)

            if not hand_seen:
                mode = "pause"
                previous_point = None
                smoothed_point = None

            draw_hud(display, mode, show_box, status_message, status_until)
            cv2.imshow(WINDOW_NAME, display)
            key = cv2.waitKey(1) & 0xFF

            if key in (27, ord("q")):
                break
            if key == ord("c"):
                canvas[:] = 0
                status_message = "Cleared. Try writing again."
                status_until = time.time() + 1.5
            if key == ord("s"):
                filename = save_canvas(canvas)
                status_message = f"Saved {filename}"
                status_until = time.time() + 2.5
            if key == ord("b"):
                show_box = not show_box
                status_message = "Writing box on" if show_box else "Writing box off"
                status_until = time.time() + 1.4
            if key == ord("v"):
                show_camera_background = not show_camera_background
                status_message = "Camera background on" if show_camera_background else "Black background on"
                status_until = time.time() + 1.4

    camera.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
