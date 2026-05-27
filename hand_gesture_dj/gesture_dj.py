from __future__ import annotations

import math
import random
import time
import wave
from dataclasses import dataclass, field
from pathlib import Path

try:
    import cv2
    import mediapipe as mp
    import numpy as np
    import pygame
except ImportError as error:
    raise SystemExit(
        "Missing packages. Run this first:\n"
        "  pip install -r requirements.txt\n\n"
        f"Original error: {error}"
    ) from error


WINDOW_NAME = "Hand Gesture DJ"
CAMERA_INDEX = 0
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

SAMPLE_RATE = 44100
PINCH_DISTANCE = 44
CURSOR_RADIUS = 22
PAD_COOLDOWN = 0.28
SMOOTHING = 0.34

CYAN = (255, 255, 0)
PINK = (190, 80, 255)
YELLOW = (0, 245, 255)
GREEN = (90, 255, 100)
RED = (70, 80, 255)
WHITE = (245, 245, 245)
ORANGE = (0, 170, 255)
PURPLE = (255, 90, 200)
BLUE = (255, 160, 70)


@dataclass
class Pad:
    name: str
    sound_name: str
    rect: tuple[int, int, int, int]
    color: tuple[int, int, int]
    last_hit: float = 0.0
    glow_until: float = 0.0


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
        self.vx *= 0.965
        self.vy *= 0.965
        self.life -= dt


@dataclass
class Ring:
    x: float
    y: float
    radius: float
    life: float
    color: tuple[int, int, int]

    def update(self, dt: float) -> None:
        self.radius += 330 * dt
        self.life -= dt


@dataclass
class DjState:
    pads: list[Pad]
    score: int = 0
    combo: int = 0
    dance_lights: bool = True
    particles: list[Particle] = field(default_factory=list)
    rings: list[Ring] = field(default_factory=list)
    last_pad_name: str = ""
    last_status: str = "Touch the glowing pads with your index finger."
    status_until: float = field(default_factory=lambda: time.time() + 4)


def write_wav(path: Path, samples: np.ndarray) -> None:
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)

    with wave.open(str(path), "wb") as sound_file:
        sound_file.setnchannels(1)
        sound_file.setsampwidth(2)
        sound_file.setframerate(SAMPLE_RATE)
        sound_file.writeframes(int_samples.tobytes())


def envelope(length: int, decay: float = 7.0) -> np.ndarray:
    return np.exp(-np.linspace(0, decay, length))


def make_kick() -> np.ndarray:
    duration = 0.42
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    frequency = 95 * np.exp(-t * 8) + 38
    phase = 2 * np.pi * np.cumsum(frequency) / SAMPLE_RATE
    body = np.sin(phase) * np.exp(-t * 9)
    click = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 90) * 0.25
    return body * 0.95 + click


def make_snare() -> np.ndarray:
    duration = 0.28
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    noise = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 18)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 14)
    return noise * 0.55 + tone * 0.35


def make_clap() -> np.ndarray:
    duration = 0.32
    length = int(SAMPLE_RATE * duration)
    sound = np.zeros(length)
    for start in (0.0, 0.035, 0.07, 0.12):
        start_index = int(start * SAMPLE_RATE)
        burst_length = min(int(0.06 * SAMPLE_RATE), length - start_index)
        burst_t = np.linspace(0, 0.06, burst_length, False)
        burst = np.random.uniform(-1, 1, burst_length) * np.exp(-burst_t * 35)
        sound[start_index : start_index + burst_length] += burst
    return sound * 0.65


def make_hat() -> np.ndarray:
    duration = 0.12
    length = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, length, False)
    noise = np.random.uniform(-1, 1, length)
    shimmer = np.sin(2 * np.pi * 8000 * t) * 0.35
    return (noise + shimmer) * np.exp(-t * 45) * 0.45


def make_tom() -> np.ndarray:
    duration = 0.38
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    frequency = 170 * np.exp(-t * 4.0) + 75
    phase = 2 * np.pi * np.cumsum(frequency) / SAMPLE_RATE
    return np.sin(phase) * np.exp(-t * 8) * 0.85


def make_crash() -> np.ndarray:
    duration = 0.65
    length = int(SAMPLE_RATE * duration)
    t = np.linspace(0, duration, length, False)
    noise = np.random.uniform(-1, 1, length)
    shimmer = np.sin(2 * np.pi * 6200 * t) + np.sin(2 * np.pi * 9100 * t)
    return (noise * 0.75 + shimmer * 0.12) * np.exp(-t * 4.5) * 0.55


def make_laser() -> np.ndarray:
    duration = 0.36
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    frequency = 760 * np.exp(-t * 5.2) + 95
    phase = 2 * np.pi * np.cumsum(frequency) / SAMPLE_RATE
    return np.sin(phase) * np.exp(-t * 4) * 0.75


def make_chime() -> np.ndarray:
    duration = 0.7
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    sound = (
        np.sin(2 * np.pi * 523.25 * t)
        + np.sin(2 * np.pi * 659.25 * t) * 0.75
        + np.sin(2 * np.pi * 783.99 * t) * 0.55
    )
    return sound * np.exp(-t * 3.5) * 0.38


def ensure_sound_files() -> dict[str, Path]:
    sound_dir = Path("sounds")
    sound_dir.mkdir(exist_ok=True)
    makers = {
        "kick": make_kick,
        "snare": make_snare,
        "clap": make_clap,
        "hat": make_hat,
        "tom": make_tom,
        "crash": make_crash,
        "laser": make_laser,
        "chime": make_chime,
    }

    paths: dict[str, Path] = {}
    for name, maker in makers.items():
        path = sound_dir / f"{name}.wav"
        if not path.exists():
            write_wav(path, maker())
        paths[name] = path
    return paths


def load_sounds() -> dict[str, pygame.mixer.Sound]:
    paths = ensure_sound_files()
    pygame.mixer.pre_init(SAMPLE_RATE, -16, 1, 256)
    pygame.mixer.init()
    return {name: pygame.mixer.Sound(str(path)) for name, path in paths.items()}


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


def point_in_rect(point: tuple[int, int], rect: tuple[int, int, int, int]) -> bool:
    return rect[0] <= point[0] <= rect[2] and rect[1] <= point[1] <= rect[3]


def rect_center(rect: tuple[int, int, int, int]) -> tuple[int, int]:
    return (rect[0] + rect[2]) // 2, (rect[1] + rect[3]) // 2


def create_pads(width: int, height: int) -> list[Pad]:
    margin_x = 54
    margin_top = 112
    gap = 24
    columns = 4
    rows = 2
    pad_width = (width - margin_x * 2 - gap * (columns - 1)) // columns
    pad_height = min(150, (height - margin_top - 110 - gap * (rows - 1)) // rows)

    pad_specs = [
        ("KICK", "kick", CYAN),
        ("SNARE", "snare", PINK),
        ("CLAP", "clap", YELLOW),
        ("HAT", "hat", GREEN),
        ("TOM", "tom", ORANGE),
        ("CRASH", "crash", RED),
        ("LASER", "laser", BLUE),
        ("CHIME", "chime", PURPLE),
    ]

    pads: list[Pad] = []
    for index, (name, sound_name, color) in enumerate(pad_specs):
        row = index // columns
        column = index % columns
        x1 = margin_x + column * (pad_width + gap)
        y1 = margin_top + row * (pad_height + gap)
        x2 = x1 + pad_width
        y2 = y1 + pad_height
        pads.append(Pad(name=name, sound_name=sound_name, rect=(x1, y1, x2, y2), color=color))

    return pads


def add_burst(
    state: DjState,
    center: tuple[int, int],
    color: tuple[int, int, int],
    amount: int = 34,
) -> None:
    for _ in range(amount):
        angle = random.uniform(0, math.tau)
        speed = random.uniform(90, 420)
        state.particles.append(
            Particle(
                x=center[0],
                y=center[1],
                vx=math.cos(angle) * speed,
                vy=math.sin(angle) * speed,
                life=random.uniform(0.28, 0.9),
                color=color,
                size=random.randint(2, 5),
            )
        )
    state.rings.append(Ring(center[0], center[1], 8, 0.52, color))


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


def draw_dance_lights(image, beat: float) -> None:
    height, width = image.shape[:2]
    overlay = image.copy()
    colors = [CYAN, PINK, YELLOW, GREEN, PURPLE, ORANGE]

    for index in range(8):
        x = int((index + 0.5) * width / 8)
        beam_width = int(80 + 28 * math.sin(beat * 2.1 + index))
        color = colors[index % len(colors)]
        points = np.array(
            [
                (x - 18, 0),
                (x + 18, 0),
                (x + beam_width, height),
                (x - beam_width, height),
            ],
            dtype=np.int32,
        )
        cv2.fillPoly(overlay, [points], color)

    cv2.addWeighted(overlay, 0.08, image, 0.92, 0, image)


def draw_pads(image, state: DjState, cursor: tuple[int, int] | None) -> None:
    now = time.time()

    for pad in state.pads:
        x1, y1, x2, y2 = pad.rect
        hovered = cursor is not None and point_in_rect(cursor, pad.rect)
        glowing = now < pad.glow_until or hovered
        overlay = image.copy()
        fill_alpha = 0.35 if glowing else 0.18
        border_thickness = 5 if glowing else 2

        cv2.rectangle(overlay, (x1, y1), (x2, y2), pad.color, -1)
        cv2.addWeighted(overlay, fill_alpha, image, 1 - fill_alpha, 0, image)

        if glowing:
            for offset in (12, 7):
                cv2.rectangle(image, (x1 - offset, y1 - offset), (x2 + offset, y2 + offset), pad.color, 2, cv2.LINE_AA)

        cv2.rectangle(image, (x1, y1), (x2, y2), WHITE if hovered else pad.color, border_thickness, cv2.LINE_AA)

        text_size = cv2.getTextSize(pad.name, cv2.FONT_HERSHEY_SIMPLEX, 1.0, 2)[0]
        text_x = x1 + (x2 - x1 - text_size[0]) // 2
        text_y = y1 + (y2 - y1 + text_size[1]) // 2
        cv2.putText(image, pad.name, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 1.0, WHITE, 2, cv2.LINE_AA)


def draw_particles(image, state: DjState, dt: float) -> None:
    for particle in state.particles:
        particle.update(dt)
    state.particles = [particle for particle in state.particles if particle.life > 0][-500:]

    for ring in state.rings:
        ring.update(dt)
    state.rings = [ring for ring in state.rings if ring.life > 0]

    for ring in state.rings:
        alpha = max(0.0, min(1.0, ring.life / 0.52))
        color = tuple(int(channel * alpha) for channel in ring.color)
        cv2.circle(image, (int(ring.x), int(ring.y)), int(ring.radius), color, 3, cv2.LINE_AA)

    for particle in state.particles:
        alpha = max(0.0, min(1.0, particle.life / 0.9))
        color = tuple(int(channel * alpha) for channel in particle.color)
        cv2.circle(image, (int(particle.x), int(particle.y)), particle.size, color, -1, cv2.LINE_AA)


def draw_cursor(image, cursor: tuple[int, int] | None, pinching: bool, palm_mode: bool) -> None:
    if cursor is None:
        return

    color = GREEN if palm_mode else PINK if pinching else CYAN
    cv2.circle(image, cursor, CURSOR_RADIUS + 18, color, 2, cv2.LINE_AA)
    cv2.circle(image, cursor, CURSOR_RADIUS, color, -1, cv2.LINE_AA)
    cv2.circle(image, cursor, 7, WHITE, -1, cv2.LINE_AA)

    if pinching:
        cv2.circle(image, cursor, CURSOR_RADIUS + 46, PINK, 3, cv2.LINE_AA)


def draw_hud(image, state: DjState, hand_seen: bool) -> None:
    height, width = image.shape[:2]
    overlay = image.copy()
    cv2.rectangle(overlay, (0, 0), (width, 88), (12, 12, 18), -1)
    cv2.rectangle(overlay, (0, height - 64), (width, height), (12, 12, 18), -1)
    cv2.addWeighted(overlay, 0.75, image, 0.25, 0, image)

    lights = "ON" if state.dance_lights else "OFF"
    cv2.putText(image, "HAND GESTURE DJ", (28, 38), cv2.FONT_HERSHEY_SIMPLEX, 1.0, WHITE, 2, cv2.LINE_AA)
    cv2.putText(image, f"SCORE {state.score}", (380, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.82, YELLOW, 2, cv2.LINE_AA)
    cv2.putText(image, f"COMBO x{state.combo}", (570, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.82, CYAN, 2, cv2.LINE_AA)
    cv2.putText(image, f"LIGHTS {lights}", (780, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.82, GREEN, 2, cv2.LINE_AA)

    if not hand_seen:
        guide = "Show your hand to the camera."
    elif time.time() < state.status_until:
        guide = state.last_status
    else:
        guide = "Touch pads to play. Pinch for sparkle. Open palm toggles dance lights. R resets. Q quits."

    cv2.putText(image, guide, (28, height - 24), cv2.FONT_HERSHEY_SIMPLEX, 0.65, WHITE, 2, cv2.LINE_AA)


def trigger_pad(
    state: DjState,
    pad: Pad,
    sounds: dict[str, pygame.mixer.Sound],
) -> None:
    now = time.time()
    if now - pad.last_hit < PAD_COOLDOWN:
        return

    pad.last_hit = now
    pad.glow_until = now + 0.24
    state.combo = state.combo + 1 if state.last_pad_name != pad.name else max(1, state.combo)
    state.score += 5 + min(state.combo * 2, 30)
    state.last_pad_name = pad.name
    state.last_status = f"{pad.name}!"
    state.status_until = now + 0.7
    sounds[pad.sound_name].play()
    add_burst(state, rect_center(pad.rect), pad.color, 34)


def reset_effects(state: DjState) -> None:
    state.score = 0
    state.combo = 0
    state.particles.clear()
    state.rings.clear()
    state.last_pad_name = ""
    state.last_status = "Reset. Make a new beat."
    state.status_until = time.time() + 1.5


def main() -> None:
    sounds = load_sounds()
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
    state = DjState(pads=create_pads(width, height))
    show_camera_background = True
    smoothed_cursor: tuple[int, int] | None = None
    was_pinching = False
    palm_was_open = False
    last_frame_time = time.time()

    with mp_hands.Hands(
        max_num_hands=1,
        model_complexity=1,
        min_detection_confidence=0.65,
        min_tracking_confidence=0.65,
    ) as hands:
        while True:
            now = time.time()
            dt = min(0.05, now - last_frame_time)
            last_frame_time = now

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

            beat = time.time() * 2.4
            if state.dance_lights:
                draw_dance_lights(display, beat)

            cursor: tuple[int, int] | None = None
            hand_seen = False
            pinching_now = False
            palm_open = False

            if result.multi_hand_landmarks:
                hand_seen = True
                landmarks = result.multi_hand_landmarks[0].landmark
                draw_hand_skeleton(display, landmarks, width, height)

                index_tip = landmark_point(landmarks, 8, width, height)
                thumb_tip = landmark_point(landmarks, 4, width, height)
                fingers = get_fingers(landmarks)
                palm_open = all(fingers.values())
                pinching_now = distance(index_tip, thumb_tip) < PINCH_DISTANCE

                if smoothed_cursor is None:
                    smoothed_cursor = index_tip
                else:
                    smoothed_cursor = (
                        int(smoothed_cursor[0] * (1 - SMOOTHING) + index_tip[0] * SMOOTHING),
                        int(smoothed_cursor[1] * (1 - SMOOTHING) + index_tip[1] * SMOOTHING),
                    )
                cursor = smoothed_cursor

                if palm_open and not palm_was_open:
                    state.dance_lights = not state.dance_lights
                    state.last_status = "Dance lights on" if state.dance_lights else "Dance lights off"
                    state.status_until = time.time() + 1.0
                palm_was_open = palm_open

                if pinching_now and not was_pinching:
                    sounds["chime"].play()
                    add_burst(state, cursor, PINK, 58)
                    state.last_status = "Sparkle blast!"
                    state.status_until = time.time() + 0.9
                was_pinching = pinching_now

                for pad in state.pads:
                    if cursor is not None and point_in_rect(cursor, pad.rect):
                        trigger_pad(state, pad, sounds)
                        break
            else:
                smoothed_cursor = None
                was_pinching = False
                palm_was_open = False

            draw_pads(display, state, cursor)
            draw_particles(display, state, dt)
            draw_cursor(display, cursor, pinching_now, palm_open)
            draw_hud(display, state, hand_seen)

            cv2.imshow(WINDOW_NAME, display)
            key = cv2.waitKey(1) & 0xFF

            if key in (27, ord("q")):
                break
            if key == ord("r"):
                reset_effects(state)
            if key == ord("v"):
                show_camera_background = not show_camera_background

    camera.release()
    cv2.destroyAllWindows()
    pygame.mixer.quit()


if __name__ == "__main__":
    main()
