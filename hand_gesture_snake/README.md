# Hand Gesture Snake

The classic Snake game, but you steer with your hand instead of arrow keys.
Tilt your hand left to turn left, right to turn right, up to go up, down to
go down. Eat food, grow longer, do not crash into your own tail.

## Setup

Use Python 3.11 or 3.12. On this Mac, do not use Python 3.14 because
MediaPipe does not provide a compatible package for it yet.

If Python 3.11 is not installed:

```bash
brew install python@3.11
```

```bash
cd "hand_gesture_snake"
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python snake.py
```

On Windows, activate the environment with:

```bat
.venv\Scripts\activate
```

## Controls

| Action       | How                                            |
|--------------|------------------------------------------------|
| Turn LEFT    | Hand on the left side of the camera frame      |
| Turn RIGHT   | Hand on the right side of the camera frame     |
| Turn UP      | Hand high in the frame                         |
| Turn DOWN    | Hand low in the frame                          |
| Restart      | R key                                          |
| Quit         | Q key (or Esc)                                 |

The snake cannot reverse directly. If you are moving right, tilting LEFT does
nothing until you first go up or down.
