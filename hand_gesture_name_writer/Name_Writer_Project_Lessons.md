# Hand Gesture Name Writer Lessons: Kid Builder Edition

This lesson is for kids who are building the Hand Gesture Name Writer project.

The goal is not to memorize big computer words. The goal is to understand what
the app is doing, one small idea at a time.

By the end, you will understand how this project works:

- Python gives the computer instructions.
- OpenCV reads the camera and draws the screen.
- MediaPipe finds your hand.
- Your index finger writes on a canvas.
- A pinch erases around your finger.
- An open palm pauses writing.
- A writing box helps you keep your name neat.
- The app can save your name as a PNG image.

Think of the computer like a very fast helper. It is fast, but it is not wise.
It only does exactly what your instructions say.

---

## How To Use These Lessons

Each lesson has five parts:

1. **Big idea** - the new thing you are learning.
2. **Kid meaning** - a simple explanation.
3. **Real-life example** - something you already understand.
4. **Try it** - a small piece of code.
5. **Name Writer connection** - how it helps the real app.

Rules for learning:

- Type the code yourself. Typing helps your brain learn.
- If you get an error, read it slowly. Errors are clues.
- Change one thing at a time.
- Run the code often.
- Explain what you built out loud, like you are teaching a friend.

---

## Project Picture

Before we code, imagine the full app.

The computer has to do these jobs again and again:

1. Open the camera.
2. Read one camera picture.
3. Find your hand.
4. Find your index fingertip.
5. Decide if you are writing, erasing, or pausing.
6. Draw your name on the canvas.
7. Draw the writing box, hand skeleton, and top bar.
8. Check keyboard keys.
9. Repeat.

That is the whole app loop.

Kid meaning: An app loop is like a song chorus that keeps coming back.

---

## Lesson 1: What Is Python?

### Big Idea

Python is a language for giving instructions to a computer.

### Kid Meaning

Python is like writing a very clear list of instructions:

```text
Open the camera.
Find the hand.
Find the fingertip.
Draw where the fingertip moves.
Save the picture.
```

The computer follows instructions like that, but written in Python.

### Real-Life Example

If you tell a friend:

```text
Pick up the pencil.
Write your name.
Lift the pencil.
Erase a mistake.
```

That is a set of instructions. Code is also a set of instructions.

### Try It

Open Terminal or Command Prompt and start Python:

Mac:

```bash
python3
```

Windows:

```bash
python
```

Then type:

```python
print("Hello, Name Writer!")
```

### What Happened?

`print` means "show this on the screen."

### Name Writer Connection

The real app shows a message on the screen when you save:

```python
status_message = f"Saved {filename}"
```

In this project, messages are shown inside the app window instead of the
terminal.

---

## Lesson 2: Text And Numbers

### Big Idea

Python treats words and numbers differently.

### Kid Meaning

Words need quotation marks. Numbers do not.

### Real-Life Example

If you write `"8"` with quotes, Python sees it like a word label.
If you write `8` without quotes, Python sees it like a number for math.

### Try It

```python
print("8 + 4")
print(8 + 4)
```

### What Happened?

The first line shows the text:

```text
8 + 4
```

The second line does the math:

```text
12
```

### Name Writer Connection

The brush thickness is a number:

```python
DRAW_THICKNESS = 8
```

Python can use that number to draw a thicker or thinner writing line.

---

## Lesson 3: Variables Are Boxes

### Big Idea

A variable stores something so the computer can remember it.

### Kid Meaning

A variable is like a labeled box.

```python
mode = "pause"
```

This means:

```text
Make a box called mode.
Put "pause" inside it.
```

### Real-Life Example

Imagine a name tag that says what you are doing:

```text
writing
erasing
paused
```

The name tag can change.

### Try It

```python
mode = "pause"
print(mode)

mode = "write"
print(mode)

mode = "erase"
print(mode)
```

### Name Writer Connection

The real app remembers the current mode:

```python
mode = "pause"
```

Then it changes the mode when your hand changes:

```python
mode = "write"
mode = "erase"
mode = "pause"
```

---

## Lesson 4: Files Are Saved Instructions

### Big Idea

Typing in Python one line at a time is useful, but an app needs a file.

### Kid Meaning

A Python file is like a recipe page. The computer reads it from top to bottom.

### Real-Life Example

A handwriting activity does not just say:

```text
Write.
```

It says:

```text
Start with blank paper.
Use a pencil.
Write your name.
Erase mistakes.
Save your best version.
```

### Try It

Create a file named `name_message.py`.

Put this inside:

```python
name = "Ava"
mode = "write"

print("Name:", name)
print("Mode:", mode)
```

Run it:

Mac:

```bash
python3 name_message.py
```

Windows:

```bash
python name_message.py
```

### Name Writer Connection

The real project file is named:

```text
name_writer.py
```

That file is the recipe for the full name writing app.

---

## Lesson 5: Loops Do Repeating Jobs

### Big Idea

A loop repeats code.

### Kid Meaning

A loop means "do this again."

### Real-Life Example

If your teacher says:

```text
Practice the letter A 5 times.
```

They do not need to say:

```text
Write A.
Write A.
Write A.
Write A.
Write A.
```

The instruction "5 times" is the loop.

### Try It

```python
for number in range(5):
    print("Writing practice")
```

Important: the second line is indented. In Python, indentation tells the
computer what belongs inside the loop.

### Name Writer Connection

The real app uses a loop that keeps running while you write:

```python
while True:
    # read camera
    # find hand
    # draw screen
```

Kid meaning: `while True` means "keep going until we tell you to stop."

---

## Lesson 6: If Statements Make Choices

### Big Idea

An `if` statement lets the computer choose what to do.

### Kid Meaning

`if` means "check something."

### Real-Life Example

```text
If one finger is up, write.
If thumb and finger pinch, erase.
If palm is open, pause.
```

Apps think like that too.

### Try It

```python
mode = "write"

if mode == "write":
    print("Draw a line")
elif mode == "erase":
    print("Erase a circle")
else:
    print("Pause")
```

### Name Writer Connection

The app checks gestures:

```python
if pinching:
    mode = "erase"
elif open_palm:
    mode = "pause"
elif index_only:
    mode = "write"
else:
    mode = "pause"
```

Kid meaning:

```text
Look at the hand shape.
Choose writing, erasing, or pausing.
```

---

## Lesson 7: True And False Are Yes And No

### Big Idea

Python uses `True` and `False` for yes-or-no ideas.

### Kid Meaning

`True` means yes.
`False` means no.

### Real-Life Example

```text
Is the writing box showing? True.
Is the camera background showing? False.
```

### Try It

```python
show_box = True

if show_box:
    print("Show the writing box")
else:
    print("Hide the writing box")
```

### Name Writer Connection

The app starts with:

```python
show_box = True
show_camera_background = False
```

Kid meaning:

```text
Show the writing box.
Start with a black background.
```

---

## Lesson 8: Coordinates Are Screen Addresses

### Big Idea

The screen uses coordinates to know where things are.

### Kid Meaning

A coordinate is an address on the screen.

In this project, a point looks like this:

```python
(x, y)
```

`x` means left and right.
`y` means up and down.

### Real-Life Example

Think about a notebook page.

Your pencil can be near the left side, right side, top, or bottom.

The screen works in a similar way.

### Try It

```python
point = (350, 200)
print(point[0])
print(point[1])
```

### What Happened?

`point[0]` is the x address.
`point[1]` is the y address.

### Name Writer Connection

The app turns a hand landmark into a screen point:

```python
return int(landmark.x * width), int(landmark.y * height)
```

Kid meaning:

```text
Change the hand dot from camera math into a real screen address.
```

---

## Lesson 9: Pixels Are Tiny Dots

### Big Idea

A screen picture is made of tiny dots called pixels.

### Kid Meaning

A pixel is one tiny square of color.

### Real-Life Example

Think of a picture made with tiny building blocks.

One block is not the whole picture, but many blocks together make the picture.

### Try It

```python
width = 1280
height = 720
pixels = width * height
print(pixels)
```

Answer: `921600`

### Name Writer Connection

The project asks the camera for this size:

```python
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720
```

Kid meaning:

```text
Use a camera picture that is 1280 pixels wide and 720 pixels tall.
```

---

## Lesson 10: Tuples Keep Groups Together

### Big Idea

A tuple stores a small group of values together.

### Kid Meaning

A tuple is like a small sealed pack.

It is useful when values belong together.

### Real-Life Example

A point needs two numbers:

```python
(x, y)
```

A color needs three numbers:

```python
(blue, green, red)
```

### Try It

```python
cyan = (255, 255, 0)
point = (100, 200)

print(cyan)
print(point)
```

### Name Writer Connection

OpenCV colors are written as:

```python
(blue, green, red)
```

The app has colors like:

```python
CYAN = (255, 255, 0)
BLACK = (0, 0, 0)
```

---

## Lesson 11: Dictionaries Are Labeled Backpacks

### Big Idea

A dictionary stores many labeled values.

### Kid Meaning

A dictionary is like a backpack with labeled pockets.

### Real-Life Example

```python
fingers = {
    "index": True,
    "middle": False,
}
```

Each label points to one value.

### Try It

```python
fingers = {
    "index": True,
    "middle": False,
    "ring": False,
    "pinky": False,
}

print(fingers["index"])
```

### Name Writer Connection

The app asks which fingers are up:

```python
fingers = get_fingers(landmarks)
```

Then it can check:

```python
index_only = fingers["index"] and not fingers["middle"] and not fingers["ring"] and not fingers["pinky"]
```

Kid meaning:

```text
If only the index finger is up, the app can write.
```

---

## Lesson 12: Functions Are Mini Machines

### Big Idea

A function is a named set of instructions.

### Kid Meaning

A function is like a small machine. You give it something, it does a job, and
sometimes it gives something back.

### Real-Life Example

A pencil sharpener is like a function:

```text
Input: dull pencil
Job: sharpen it
Output: sharp pencil
```

### Try It

```python
def say_mode(mode):
    print("Mode:", mode)

say_mode("write")
say_mode("erase")
```

### Name Writer Connection

The project has functions like:

```python
def draw_writing_box(image, show_box):
    ...

def draw_hud(image, mode, show_box, status_message, status_until):
    ...

def save_canvas(canvas):
    ...
```

Each function has one job.

### Kid Meanings

`draw_writing_box` means:

```text
Draw the guide box and baseline.
```

`draw_hud` means:

```text
Draw the top bar, mode, controls, and status messages.
```

`save_canvas` means:

```text
Save the name drawing as a picture file.
```

---

## Lesson 13: The Camera Is A Fast Photo Machine

### Big Idea

A camera video is many pictures shown quickly.

### Kid Meaning

The camera gives Python one picture, then another, then another.

### Real-Life Example

A flipbook looks like motion because each page is a slightly different drawing.

A video works like that too.

### Name Writer Connection

The app reads the camera:

```python
ok, frame = camera.read()
```

Kid meaning:

```text
ok    -> Did the camera give us a picture?
frame -> The picture from the camera.
```

Then the app flips it:

```python
frame = cv2.flip(frame, 1)
```

Kid meaning:

```text
Make the camera feel like a mirror.
```

Without the flip, moving your hand right can look like left on the screen.

---

## Lesson 14: MediaPipe Finds Your Hand

### Big Idea

MediaPipe is a tool that can find hand points in a camera picture.

### Kid Meaning

MediaPipe puts invisible sticker dots on your hand.

### Real-Life Example

Imagine drawing dots on your knuckles and fingertips in a photo.

If the computer knows where the dots are, it knows where your hand is.

### Name Writer Connection

The app asks MediaPipe to process the camera picture:

```python
result = hands.process(rgb)
```

Then it checks if a hand was found:

```python
if result.multi_hand_landmarks:
    landmarks = result.multi_hand_landmarks[0].landmark
```

Kid meaning:

```text
If you see a hand, get the hand dots.
```

The app uses dot number 8:

```python
index_tip = landmark_point(landmarks, 8, width, height)
```

Kid meaning:

```text
Use the index fingertip as the pen tip.
```

---

## Lesson 15: Finger Detection Makes Gestures

### Big Idea

The app needs to know which fingers are raised.

### Kid Meaning

The computer compares hand dots to decide if a finger is up.

### Name Writer Connection

The app checks a finger like this:

```python
def finger_up(landmarks, tip, pip):
    return landmarks[tip].y < landmarks[pip].y - 0.015
```

Kid meaning:

```text
Is the fingertip higher than the finger joint?
```

Then it stores the answers:

```python
fingers = get_fingers(landmarks)
```

### Gesture Meanings

```text
Index finger only       -> write
Index and thumb pinch   -> erase
Index, middle, ring, pinky up -> pause
```

Important: the project tracks index, middle, ring, and pinky for the open-palm
pause. The thumb is used separately for pinch erasing.

---

## Lesson 16: Distance Finds A Pinch

### Big Idea

The app can measure how far apart two points are.

### Kid Meaning

If your thumb tip and index tip are close, you are pinching.

### Real-Life Example

If two magnets are far apart, they are not touching.
If they are very close, they can click together.

### Try It

```python
import math

thumb = (10, 10)
finger = (13, 14)

distance = math.hypot(thumb[0] - finger[0], thumb[1] - finger[1])
print(distance)
```

### Name Writer Connection

The app checks:

```python
pinching = distance(index_tip, thumb_tip) < PINCH_DISTANCE
```

Kid meaning:

```text
If thumb and index finger are close enough, erase.
```

---

## Lesson 17: Smoothing Stops Jumpy Writing

### Big Idea

Hand tracking can wiggle, so the app smooths the point.

### Kid Meaning

Smoothing makes the pen follow your finger more gently.

### Real-Life Example

Imagine pulling a toy by a string.

If your hand shakes a little, the toy does not instantly jump everywhere. It
follows more smoothly.

### Name Writer Connection

The app uses:

```python
SMOOTHING = 0.35
```

And mixes the old point with the new fingertip point:

```python
smoothed_point = (
    int(smoothed_point[0] * (1 - SMOOTHING) + index_tip[0] * SMOOTHING),
    int(smoothed_point[1] * (1 - SMOOTHING) + index_tip[1] * SMOOTHING),
)
```

Kid meaning:

```text
Do not jump all the way to the new finger spot.
Move part of the way there.
```

---

## Lesson 18: The Canvas Remembers The Name

### Big Idea

The app needs a canvas so the writing does not disappear.

### Kid Meaning

The canvas is the paper.

The camera frame changes every moment, but the canvas keeps the writing marks.

### Real-Life Example

If you wave a pencil in the air, no mark stays.

If you draw on paper, the mark stays.

The canvas is what makes the mark stay.

### Name Writer Connection

The app creates a black canvas:

```python
canvas = np.zeros((height, width, 3), dtype=np.uint8)
```

Kid meaning:

```text
Make a blank image the same size as the camera.
Each pixel starts as black.
```

---

## Lesson 19: Drawing With OpenCV

### Big Idea

OpenCV helps Python draw images and show windows.

### Kid Meaning

OpenCV is like a box of drawing tools for Python.

### Drawing Tools

The app uses:

```python
cv2.line(...)
cv2.rectangle(...)
cv2.circle(...)
cv2.putText(...)
cv2.imshow(...)
```

Kid meanings:

```text
line      -> draw writing and hand skeleton lines
rectangle -> draw the writing box and top bar
circle    -> draw the pen tip or eraser circle
putText   -> write mode and controls
imshow    -> show the window
```

### Name Writer Connection

The writing line is drawn with:

```python
draw_glow_line(canvas, previous_point, smoothed_point, CYAN, DRAW_THICKNESS)
```

Kid meaning:

```text
Draw a glowing line from the old finger position to the new finger position.
```

---

## Lesson 20: The Writing Box Helps You Aim

### Big Idea

The writing box gives a guide area for writing a name.

### Kid Meaning

The box is like handwriting paper.

It helps you keep your name in one area.

### Real-Life Example

In school, handwriting paper has lines so letters do not float everywhere.

### Name Writer Connection

The app draws the guide box:

```python
draw_writing_box(display, show_box)
```

Inside that function, the app draws:

```python
cv2.rectangle(...)
cv2.line(...)
```

Kid meaning:

```text
Draw a box.
Draw a baseline for letters.
```

### Keyboard Control

Press:

```text
B
```

to show or hide the writing box.

---

## Lesson 21: Erasing And Clearing

### Big Idea

Erasing means drawing black on the canvas. Clearing means making the whole
canvas black.

### Kid Meaning

The eraser paints with the background color.

Clear wipes the whole paper.

### Real-Life Example

Eraser:

```text
Rub out one spot.
```

Clear:

```text
Throw away the paper and start with a blank one.
```

### Name Writer Connection

Pinching erases a circle:

```python
cv2.circle(canvas, smoothed_point, ERASER_RADIUS, BLACK, -1, cv2.LINE_AA)
```

Pressing `c` clears everything:

```python
canvas[:] = 0
```

Kid meaning:

```text
Set every pixel on the canvas back to black.
```

---

## Lesson 22: Blending Makes Glow

### Big Idea

The app can combine images to make the writing glow.

### Kid Meaning

Blending is like putting clear plastic sheets on top of each other.

### Real-Life Example

Imagine one clear sheet has a blurry glow.
Another clear sheet has sharp writing.

Put them together and the writing looks bright.

### Name Writer Connection

The app makes a blurry copy:

```python
glow = cv2.GaussianBlur(canvas, (0, 0), 9)
```

Then it blends the glow and the real canvas:

```python
display = cv2.addWeighted(display, 1.0, glow, 0.72, 0)
display = cv2.addWeighted(display, 1.0, canvas, 1.0, 0)
```

Kid meaning:

```text
Put the soft glow behind the sharp writing.
```

---

## Lesson 23: The HUD Shows Mode And Controls

### Big Idea

HUD means the information on top of the app.

### Kid Meaning

The HUD is the top bar and helper text.

### Real-Life Example

A drawing app may show:

```text
current tool
save button
eraser button
```

This app shows its information with text.

### Name Writer Connection

The app draws:

```python
Write your name with hand gestures
Mode: write
Box: on
Index writes | Open palm pauses | Pinch erases
```

using:

```python
draw_hud(display, mode, show_box, status_message, status_until)
```

Kid meaning:

```text
Draw the title, current mode, box setting, controls, and status message.
```

---

## Lesson 24: Status Messages

### Big Idea

Status messages tell the user what just happened.

### Kid Meaning

A status message is a quick note on the screen.

### Real-Life Example

When a tablet says:

```text
Saved!
```

that is a status message.

### Name Writer Connection

The app starts with:

```python
status_message = "Use one index finger to write any name."
status_until = time.time() + 4
```

Kid meaning:

```text
Show this message for 4 seconds.
```

When the user clears, saves, or toggles the box, the message changes.

---

## Lesson 25: Saving The Name

### Big Idea

The app can save the canvas as a PNG image.

### Kid Meaning

Saving means turning your name drawing into a file you can open later.

### Real-Life Example

When you save a drawing in a tablet app, it goes into your photos or files.

This project saves into a folder named `saved_names`.

### Name Writer Connection

The app has:

```python
def save_canvas(canvas):
    output_dir = Path("saved_names")
    output_dir.mkdir(exist_ok=True)
    filename = output_dir / f"hand_written_name_{time.strftime('%Y%m%d_%H%M%S')}.png"
    cv2.imwrite(str(filename), canvas)
    return filename
```

Kid meaning:

```text
Make a saved_names folder.
Make a filename using the current date and time.
Write the canvas to that PNG file.
Give the filename back.
```

### Keyboard Control

Press:

```text
S
```

to save your name.

---

## Lesson 26: Keyboard Shortcuts

### Big Idea

The app can listen for keyboard keys.

### Kid Meaning

A key press is another kind of command.

### Real-Life Example

In many apps:

```text
Ctrl+S saves.
Esc closes.
```

This project has its own simple keys.

### Name Writer Connection

The app reads a key:

```python
key = cv2.waitKey(1) & 0xFF
```

Then it checks the key:

```python
if key in (27, ord("q")):
    break
if key == ord("c"):
    canvas[:] = 0
if key == ord("s"):
    filename = save_canvas(canvas)
```

Kid meanings:

```text
Q or Esc -> quit
C        -> clear
S        -> save
B        -> show or hide writing box
V        -> show or hide camera background
```

---

## Lesson 27: The Whole App Loop

### Big Idea

The main loop runs the name writer one frame at a time.

### Kid Meaning

One frame is one quick turn of the app.

### What Happens In One Frame?

1. Read the camera picture.
2. Flip it like a mirror.
3. Ask MediaPipe to find a hand.
4. Make a display screen.
5. Draw the writing box.
6. Add the old writing from the canvas.
7. If a hand is seen, find the fingertip.
8. Smooth the fingertip point.
9. Check for pinch, open palm, or index-only writing.
10. Write, erase, or pause.
11. Draw the HUD.
12. Show the window.
13. Check keyboard keys.

### Name Writer Connection

This is the heart of the app:

```python
while True:
    ok, frame = camera.read()
    if not ok:
        break
```

Kid meaning:

```text
Keep getting camera pictures until the camera stops or the user quits.
```

---

## Lesson 28: Run The Real Project

### Step 1: Open The Project Folder

Go into the folder:

```bash
cd hand_gesture_name_writer
```

### Step 2: Use The Right Python Version

Use Python 3.11 or 3.12 for this project.

If you use a virtual environment, create it like this:

Mac:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
```

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

### Step 3: Install The Needed Packages

```bash
python -m pip install -r requirements.txt
```

### Step 4: Run The App

Mac:

```bash
python3 name_writer.py
```

Windows:

```bash
python name_writer.py
```

### Controls

```text
One index finger up       -> write
Open palm                 -> pause writing
Pinch thumb and index     -> erase around the finger
C key                     -> clear
S key                     -> save
B key                     -> show or hide writing box
V key                     -> show or hide camera background
Q key or Esc              -> quit
```

### Camera Permission

If your computer asks if Terminal, Command Prompt, or Python can use the
camera, choose yes.

---

## Full Project Map

Here is the whole project in kid words.

```text
Start
  |
  v
Open camera
  |
  v
Make a blank canvas
  |
  v
Repeat forever
  |
  +--> Read camera picture
  |
  +--> Ask MediaPipe: do you see a hand?
  |
  +--> If hand is seen, find index fingertip and thumb tip
  |
  +--> If pinch, erase
  |
  +--> Else if open palm, pause
  |
  +--> Else if only index finger is up, write
  |
  +--> Draw writing box, canvas, hand skeleton, and HUD
  |
  +--> Check keys: C clear, S save, B box, V background, Q quit
```

---

## Words You Now Know

### Python

A language for giving instructions to a computer.

### Variable

A labeled box that stores a value.

### Loop

Instructions that repeat.

### If Statement

A choice the computer makes after checking something.

### Function

A named mini machine that does one job.

### Dictionary

Many labeled values stored together.

### Tuple

A small group of values that belong together.

### Coordinate

An address on the screen, like `(x, y)`.

### Pixel

A tiny dot on the screen.

### Frame

One camera picture.

### Canvas

The image that stores the writing.

### Landmark

A hand point found by MediaPipe.

### Gesture

A hand shape that means a command.

### HUD

The mode and helper information shown on the screen.

### Status Message

A short note that tells what just happened.

### App Loop

The repeating cycle that keeps the app running.

---

## Kid-Friendly Debugging Guide

Debugging means finding and fixing problems.

### Problem: Python Says "command not found"

Kid meaning:

```text
The computer does not know where Python is.
```

Try:

```bash
python --version
```

or:

```bash
python3 --version
```

### Problem: Missing Packages

If you see an error about `cv2`, `mediapipe`, or `numpy`, install the packages:

```bash
python -m pip install -r requirements.txt
```

### Problem: MediaPipe Will Not Install

Try Python 3.11 or 3.12.

Kid meaning:

```text
Some packages only work with certain Python versions.
```

### Problem: Camera Does Not Open

Try these:

- Close Zoom, Teams, or other camera apps.
- Give camera permission.
- Restart the program.
- Change `CAMERA_INDEX = 0` to `CAMERA_INDEX = 1` if you have another camera.

### Problem: The App Does Not See Your Hand

Try these:

- Use a brighter room.
- Keep your hand open at first.
- Use a plain background.
- Move slowly.
- Make sure your whole hand is inside the camera picture.

### Problem: Writing Is Shaky

Try these:

- Move more slowly.
- Use better lighting.
- Change `SMOOTHING = 0.35` to `SMOOTHING = 0.20`.

Smaller smoothing can look steadier, but it may also feel a little slower.

### Problem: You Draw In The Top Bar

The app already blocks writing above:

```python
TOP_BAR_HEIGHT
```

If you want more space at the top, increase:

```python
TOP_BAR_HEIGHT = 92
```

### Problem: App Runs Slowly

Try smaller camera size in `name_writer.py`:

```python
CAMERA_WIDTH = 960
CAMERA_HEIGHT = 540
```

---

## Mini Experiments

Change only one thing at a time.

### Make The Writing Thicker

Find:

```python
DRAW_THICKNESS = 8
```

Try:

```python
DRAW_THICKNESS = 14
```

### Make The Eraser Bigger

Find:

```python
ERASER_RADIUS = 42
```

Try:

```python
ERASER_RADIUS = 70
```

### Change The Pen Color

Find:

```python
CYAN = (255, 255, 0)
```

Try:

```python
CYAN = (0, 255, 255)
```

OpenCV uses blue, green, red, so this changes the pen color.

### Make Pinching Harder

Find:

```python
PINCH_DISTANCE = 45
```

Try:

```python
PINCH_DISTANCE = 30
```

Now your fingers must be closer together to erase.

### Start With Camera Background On

Find:

```python
show_camera_background = False
```

Try:

```python
show_camera_background = True
```

---

## Build Challenge Path

After the main app works, try these in order.

### Challenge 1: Change The Writing Box Color

Find the colors inside `draw_writing_box`.

Try brighter or softer colors.

### Challenge 2: Add A Finish Message

New idea:

```text
Press F when the name is finished.
Show "Great job!" on the screen.
```

### Challenge 3: Add More Pen Colors

New idea:

```text
Press 1 for cyan.
Press 2 for yellow.
Press 3 for green.
```

### Challenge 4: Add Undo

New idea:

```text
Save old copies of the canvas in a list.
Press U to go back one step.
```

### Challenge 5: Add A Celebration

New idea:

```text
When the name is saved, show sparkles around the screen.
```

---

## Teacher Notes

Use these questions to check understanding.

### After Lesson 3

Ask:

```text
What is a variable?
```

Good answer:

```text
A labeled box that stores something.
```

### After Lesson 8

Ask:

```text
What does (x, y) mean?
```

Good answer:

```text
It is a screen address. x goes left and right, y goes up and down.
```

### After Lesson 15

Ask:

```text
What does one index finger do?
```

Good answer:

```text
It writes.
```

### After Lesson 16

Ask:

```text
How does the app know you are pinching?
```

Good answer:

```text
It checks if the thumb tip and index tip are close together.
```

### After Lesson 18

Ask:

```text
Why does the app need a canvas?
```

Good answer:

```text
So the writing stays even when the camera picture changes.
```

### After Lesson 25

Ask:

```text
Where does the saved name go?
```

Good answer:

```text
Into the saved_names folder as a PNG file.
```

---

## Final Encouragement

If you understand the simple version, you can understand the real code.

The real project may look big, but it is made from small pieces:

```text
print
variables
loops
if statements
dictionaries
tuples
functions
coordinates
pixels
camera frames
hand landmarks
gestures
drawing
saving files
```

That is programming: small pieces working together.

Keep building. Run the app. Break it a little. Fix it. Change it. Explain it.
That is how kids become real builders.
