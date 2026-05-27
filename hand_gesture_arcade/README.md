# Hand Gesture Arcade

This is a different hand-gesture project from the air drawing app.
Students use their hand as a game controller.

## Game Idea

Move your index finger to catch stars and gems.
Avoid bombs.
Use hand gestures for power moves.

## Setup

Use Python 3.11 or 3.12. On this Mac, do not use Python 3.14 because
MediaPipe does not provide a compatible package for it yet.

If Python 3.11 is not installed:

```bash
brew install python@3.11
```

```bash
cd "hand_gesture_arcade"
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python gesture_arcade.py
```

On Windows:

```bash
.venv\Scripts\activate
```

## Controls

- Move index finger: move the magic cursor
- Touch stars/gems: collect points
- Avoid bombs: bombs remove hearts
- Open palm: shield mode
- Pinch thumb and index finger: blast nearby objects
- `r`: restart
- `v`: switch camera background on/off
- `q` or `Esc`: quit

## Teaching Ideas

- Let students change the speed.
- Let students add new falling objects.
- Let students design a new gesture.
- Let students change the scoring system.
- Let students add sound effects later.
