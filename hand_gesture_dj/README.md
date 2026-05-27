# Hand Gesture DJ

This is a hand-gesture music project.
Students use their hand like an air DJ controller.

## What It Does

- Move your index finger over glowing pads.
- Touch a pad to play a drum or sound effect.
- Pinch thumb and index finger to trigger a sparkle blast.
- Open palm turns the dance-light mode on and off.
- The app creates its own sound files the first time it runs.

## Setup

Use Python 3.11 or 3.12. On this Mac, do not use Python 3.14 because
MediaPipe does not provide a compatible package for it yet.

If Python 3.11 is not installed:

```bash
brew install python@3.11
```

```bash
cd "hand_gesture_dj"
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python gesture_dj.py
```

On Windows:

```bash
.venv\Scripts\activate
```

## Controls

- Index finger: move the cursor
- Touch pad: play sound
- Pinch: sparkle blast
- Open palm: toggle dance lights
- `r`: reset effects
- `v`: switch camera background on/off
- `q` or `Esc`: quit

## Classroom Ideas

- Let students rename the pads.
- Let students change pad colors.
- Let students change the generated sounds.
- Let students add a new pad.
- Let students perform a short hand-gesture beat.
