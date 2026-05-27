# AI Air Painter

This is a webcam hand-tracking drawing app for the class project.

## Setup

Use Python 3.11 or 3.12. On this Mac, do not use Python 3.14 because
MediaPipe does not provide a compatible package for it yet.

If Python 3.11 is not installed:

```bash
brew install python@3.11
```

```bash
cd "hand_tracking_painter"
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python air_draw.py
```

On Windows, activate the environment with:

```bash
.venv\Scripts\activate
```

## Controls

- One index finger up: draw
- Two fingers up: select a color/tool from the top bar
- Open palm: erase
- Pinch thumb and index finger: create a small firework
- `c`: clear the drawing
- `s`: save the drawing
- `v`: switch between black background and camera background
- `q` or `Esc`: quit

## Classroom Ideas

- Ask students to change the colors.
- Ask students to add a new gesture.
- Ask students to add sound effects.
- Ask students to make a final drawing and save it.
