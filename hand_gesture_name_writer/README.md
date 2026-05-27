# Hand Gesture Name Writer

This project lets a student write their name in the air using hand gestures.

The app opens a blank writing space, then lets the student write any name with
their index finger.

## Setup

Use Python 3.11 or 3.12. On this Mac, do not use Python 3.14 because
MediaPipe does not provide a compatible package for it yet.

If Python 3.11 is not installed:

```bash
brew install python@3.11
```

```bash
cd "hand_gesture_name_writer"
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python name_writer.py
```

## Hand Controls

- One index finger up: write
- Open palm: lift the pen and pause writing
- Pinch thumb and index finger: erase around the finger

## Keyboard Controls

- `c`: clear and try again
- `s`: save the name drawing
- `b`: show/hide the writing box and baseline
- `v`: switch camera background on/off
- `q` or `Esc`: quit

## Classroom Ideas

- Let each student write their own name.
- Let students save their best version.
- Let students change the pen color.
- Let students add a celebration effect when they finish.
- Let students compare hand movement to x/y coordinates.
