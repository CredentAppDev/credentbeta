# AI Air Painter Lessons: Kid Builder Edition

This lesson is for kids who are building the AI Air Painter project.

The goal is not to memorize big computer words. The goal is to understand what
the app is doing, one small idea at a time.

By the end, you will understand how this project works:

- Python gives the computer instructions.
- OpenCV reads the camera and draws shapes.
- MediaPipe finds your hand.
- Your index finger becomes a paint brush.
- A canvas stores your drawing.
- Gestures choose tools, erase, clear, and make fireworks.
- The app can save your picture as an image file.

Think of the computer like a very fast helper. It is fast, but it is not wise.
It only does exactly what your instructions say.

---

## How To Use These Lessons

Each lesson has five parts:

1. **Big idea** - the new thing you are learning.
2. **Kid meaning** - a simple explanation.
3. **Real-life example** - something you already understand.
4. **Try it** - a small piece of code.
5. **Air Painter connection** - how it helps the real app.

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
4. Find your fingertip.
5. Decide which gesture you are making.
6. Draw, erase, select a tool, make fireworks, or wait.
7. Draw the new screen.
8. Check if you pressed a key.
9. Repeat.

That is the whole app loop.

Kid meaning: An app loop is like a song chorus that keeps coming back.

---

## Lesson 1: What Is Python?

### Big Idea

Python is a language for giving instructions to a computer.

### Kid Meaning

Python is like writing a very clear list of chores:

```text
Open the camera.
Look for a hand.
Draw where the finger moves.
Show the screen.
```

The computer follows instructions like that, but written in Python.

### Real-Life Example

If you tell a friend:

```text
Pick up the marker.
Draw a line.
Change colors.
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
print("Hello, Air Painter!")
```

### What Happened?

`print` means "show this on the screen."

### Air Painter Connection

The real app prints messages when something happens, like when you save a
drawing:

```python
print(f"Saved {filename}")
```

### Check Your Brain

What does `print` do?

Answer: It shows something on the screen.

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

### Air Painter Connection

The brush thickness is a number:

```python
DRAW_THICKNESS = 8
```

Python can use that number to draw a thicker or thinner line.

### Tiny Challenge

What should this print?

```python
print(1280 * 720)
```

Answer: `921600`

That is how many pixels are in a 1280 by 720 camera picture.

---

## Lesson 3: Variables Are Boxes

### Big Idea

A variable stores something so the computer can remember it.

### Kid Meaning

A variable is like a labeled box.

```python
selected_tool = "pen"
```

This means:

```text
Make a box called selected_tool.
Put "pen" inside it.
```

### Real-Life Example

Imagine a pencil case with a label on it.

The label stays the same, but the thing inside can change.

Variables work like that. The name stays the same, but the value inside can
change.

### Try It

```python
tool = "pen"
print(tool)

tool = "eraser"
print(tool)
```

### What Happened?

The tool started as `pen`.
Then it changed to `eraser`.

### Air Painter Connection

The real app remembers the current tool:

```python
selected_tool = "pen"
```

Later, the app can change it:

```python
selected_tool = "eraser"
```

### Check Your Brain

If `selected_tool` is `"eraser"`, what should one finger do?

Answer: It should erase instead of draw.

---

## Lesson 4: Files Are Saved Instructions

### Big Idea

Typing in Python one line at a time is useful, but an app needs a file.

### Kid Meaning

A Python file is like a recipe page. The computer reads it from top to bottom.

### Real-Life Example

A recipe does not say:

```text
Make lunch.
```

It says:

```text
Get bread.
Add cheese.
Heat the sandwich.
Serve it.
```

An app file is the recipe for the app.

### Try It

Create a file named `paint_message.py`.

Put this inside:

```python
color = "cyan"
tool = "pen"

print("Color:", color)
print("Tool:", tool)
```

Run it:

Mac:

```bash
python3 paint_message.py
```

Windows:

```bash
python paint_message.py
```

### Air Painter Connection

The real project file is named:

```text
air_draw.py
```

That file is the recipe for the full air painting app.

---

## Lesson 5: Loops Do Repeating Jobs

### Big Idea

A loop repeats code.

### Kid Meaning

A loop means "do this again."

### Real-Life Example

If your teacher says:

```text
Draw 5 stars.
```

They do not need to say:

```text
Draw a star.
Draw a star.
Draw a star.
Draw a star.
Draw a star.
```

The instruction "5 stars" is the loop.

### Try It

```python
for number in range(5):
    print("Drawing!")
```

Important: the second line is indented. In Python, indentation tells the
computer what belongs inside the loop.

### What Happened?

Python printed the same message 5 times.

### Air Painter Connection

The real app uses a loop that keeps running while you paint:

```python
while True:
    # read camera
    # find hand
    # draw screen
```

Kid meaning: `while True` means "keep going until we tell you to stop."

### Tiny Challenge

Change `range(5)` to `range(10)`.

What changes?

Answer: It prints 10 times.

---

## Lesson 6: If Statements Make Choices

### Big Idea

An `if` statement lets the computer choose what to do.

### Kid Meaning

`if` means "check something."

### Real-Life Example

```text
If the marker is blue, draw water.
If the marker is green, draw grass.
```

Apps think like that too.

### Try It

```python
fingers_up = 1

if fingers_up == 1:
    print("Draw")
else:
    print("Wait")
```

### Air Painter Connection

The app asks questions like:

```python
if selected_tool == "eraser":
    # erase
else:
    # draw
```

Kid meaning:

```text
If the eraser tool is selected, erase.
Otherwise, draw.
```

### Check Your Brain

What should happen if two fingers are up?

Answer: The app should select a color or tool from the top bar.

---

## Lesson 7: True And False Are Yes And No

### Big Idea

Python uses `True` and `False` for yes-or-no ideas.

### Kid Meaning

`True` means yes.
`False` means no.

### Real-Life Example

```text
Is your hand open? True.
Is your finger pinched? False.
```

### Try It

```python
hand_seen = True

if hand_seen:
    print("I see your hand")
else:
    print("Show your hand")
```

### Air Painter Connection

The app remembers whether a pinch happened:

```python
last_pinched = False
```

Kid meaning:

```text
At the start, the user is not pinching.
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

Think about a treasure map.

You may go 3 steps right and 2 steps down.

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

### Air Painter Connection

The app turns a hand landmark into a screen point:

```python
return int(landmark.x * width), int(landmark.y * height)
```

Kid meaning:

```text
Change the hand dot from camera math into a real screen address.
```

### Quick Picture

```text
(0,0)      top-left corner
  |
  v
y gets bigger as you go down

x gets bigger as you go right
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

### What Happened?

The screen has `921600` tiny dots.

### Air Painter Connection

The project uses:

```python
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720
```

Kid meaning:

```text
Ask the camera for a picture that is 1280 pixels wide and 720 pixels tall.
```

---

## Lesson 10: Lists Hold Many Things

### Big Idea

A list stores many values in order.

### Kid Meaning

A list is like a row of paint cups.

The first cup is at the front. The last cup is at the end.

### Real-Life Example

```python
colors = ["cyan", "pink", "yellow"]
```

That list has three color names.

### Try It

```python
colors = ["cyan", "pink", "yellow"]
print(colors[0])
print(colors[1])
print(colors[-1])
```

### What Happened?

`colors[0]` is the first color.
`colors[-1]` is the last color.

Computers often start counting at 0, not 1.

### Air Painter Connection

The painter has a list of colors:

```python
COLORS = [
    ("cyan", (255, 255, 0)),
    ("pink", (180, 80, 255)),
    ("yellow", (0, 255, 255)),
]
```

The toolbar is built from this list.

---

## Lesson 11: Tuples Keep Groups Together

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

### Air Painter Connection

OpenCV colors are written as:

```python
(blue, green, red)
```

That is different from many paint apps, which say red, green, blue.

For example:

```python
("cyan", (255, 255, 0))
```

Kid meaning:

```text
The color is named cyan.
Its OpenCV color number is 255 blue, 255 green, 0 red.
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
def say_tool(tool):
    print("Current tool:", tool)

say_tool("pen")
say_tool("eraser")
```

### Air Painter Connection

The project has functions like:

```python
def draw_toolbar(image, selected_color_index, selected_tool):
    ...

def point_in_rect(point, rect):
    ...

def save_canvas(canvas):
    ...
```

Each function has one job.

### Kid Meanings

`draw_toolbar` means:

```text
Draw the color and tool buttons at the top.
```

`point_in_rect` means:

```text
Check if the finger is inside a button box.
```

`save_canvas` means:

```text
Save the painting as a picture file.
```

---

## Lesson 13: Dictionaries Are Labeled Backpacks

### Big Idea

A dictionary stores many labeled values.

### Kid Meaning

A dictionary is like a backpack with labeled pockets.

### Real-Life Example

```python
student = {
    "name": "Mia",
    "favorite_color": "green",
}
```

Each label points to one value.

### Try It

```python
gesture = {
    "index": True,
    "middle": False,
    "ring": False,
    "pinky": False,
}

print(gesture["index"])
```

### Air Painter Connection

The app uses a dictionary for fingers:

```python
return {
    "index": finger_up(landmarks, 8, 6),
    "middle": finger_up(landmarks, 12, 10),
    "ring": finger_up(landmarks, 16, 14),
    "pinky": finger_up(landmarks, 20, 18),
}
```

Kid meaning:

```text
Make labeled pockets that say which fingers are up.
```

---

## Lesson 14: The Camera Is A Fast Photo Machine

### Big Idea

A camera video is many pictures shown quickly.

### Kid Meaning

The camera gives Python one picture, then another, then another.

### Real-Life Example

A flipbook looks like motion because each page is a slightly different drawing.

A video works like that too.

### Air Painter Connection

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

## Lesson 15: Drawing With OpenCV

### Big Idea

OpenCV helps Python draw images and show windows.

### Kid Meaning

OpenCV is like a box of drawing tools for Python.

### Real-Life Example

If paper is the screen, OpenCV gives us markers:

- draw a line
- draw a rectangle
- draw a circle
- write text
- show the picture

### Project Drawing Tools

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
line      -> draw a line
rectangle -> draw a box
circle    -> draw a dot or brush cursor
putText   -> write words
imshow    -> show the window
```

### Air Painter Connection

A brush stroke is drawn with lines:

```python
cv2.line(image, start, end, color, thickness, cv2.LINE_AA)
```

Kid meaning:

```text
Draw a line from the old finger position to the new finger position.
```

---

## Lesson 16: The Canvas Remembers The Painting

### Big Idea

The app needs a canvas so the drawing does not disappear.

### Kid Meaning

The canvas is the paper.

The camera frame changes every moment, but the canvas keeps the paint marks.

### Real-Life Example

If you wave a flashlight, the light moves away.

If you draw with a marker on paper, the mark stays.

The canvas is what makes the mark stay.

### Air Painter Connection

The app creates a black canvas:

```python
canvas = np.zeros((height, width, 3), dtype=np.uint8)
```

Do not worry if that looks big.

Kid meaning:

```text
Make a blank image the same size as the camera.
Each pixel starts as black.
```

### Try It

```python
width = 4
height = 3
print(width * height)
```

Answer: `12`

That tiny pretend canvas would have 12 pixels.

---

## Lesson 17: Blending Puts Pictures Together

### Big Idea

The app can combine two images.

### Kid Meaning

Blending is like putting clear plastic sheets on top of each other.

### Real-Life Example

Imagine one clear sheet has a background.
Another clear sheet has your drawing.
Put them together and you see both.

### Air Painter Connection

The app puts the canvas on the display:

```python
display = cv2.addWeighted(display, 1.0, canvas, 1.0, 0)
```

Kid meaning:

```text
Show the screen background plus the painting.
```

The app also makes a soft glow:

```python
glow = cv2.GaussianBlur(canvas, (0, 0), 9)
```

Kid meaning:

```text
Make a blurry copy of the painting, then put it behind the sharp painting.
```

---

## Lesson 18: MediaPipe Finds Your Hand

### Big Idea

MediaPipe is a tool that can find hand points in a camera picture.

### Kid Meaning

MediaPipe puts invisible sticker dots on your hand.

### Real-Life Example

Imagine drawing dots on your knuckles and fingertips in a photo.

If the computer knows where the dots are, it knows where your hand is.

### Air Painter Connection

The app asks MediaPipe to process the camera picture:

```python
result = hands.process(rgb)
```

Then it checks if a hand was found:

```python
if result.multi_hand_landmarks:
    landmarks = hand_landmarks.landmark
```

Kid meaning:

```text
If you see a hand, get the hand dots.
```

The app uses dot number 8 for the index fingertip:

```python
index_tip = landmark_point(landmarks, 8, width, height)
```

Kid meaning:

```text
Use the fingertip as the brush.
```

---

## Lesson 19: Finger Up Detection

### Big Idea

The app needs to know which fingers are raised.

### Kid Meaning

The computer compares two dots on a finger.

If the fingertip dot is higher than the middle finger-joint dot, that finger is
probably up.

### Real-Life Example

If your fingertip is above your knuckle, your finger is pointing up.

If your fingertip is below your knuckle, your finger is folded down.

### Air Painter Connection

The app checks a finger like this:

```python
def finger_up(landmarks, tip, pip):
    return landmarks[tip].y < landmarks[pip].y - 0.015
```

Kid meaning:

```text
Is the fingertip higher than the finger joint?
```

### Important Detail

On screens, smaller `y` means higher.

That is why the code uses:

```python
<
```

instead of:

```python
>
```

---

## Lesson 20: Gestures Become Actions

### Big Idea

The app turns hand shapes into commands.

### Kid Meaning

A gesture is a hand signal.

The app watches your signal and chooses what to do.

### Air Painter Gestures

```text
One index finger up       -> draw
Index and middle fingers  -> select a color or tool
Open palm                 -> erase
Thumb and index pinch     -> make a firework
```

### Air Painter Connection

The app checks gestures with `if`, `elif`, and `else`:

```python
if fingers["index"] and fingers["middle"]:
    # select
elif raised_count >= 4:
    # erase
elif fingers["index"]:
    # draw
else:
    # wait
```

Kid meaning:

```text
Check the hand shape.
Pick the matching action.
```

### Important

Order matters.

The app checks two fingers before one finger because two fingers also includes
the index finger.

---

## Lesson 21: Smoothing Stops Jumpy Drawing

### Big Idea

Hand tracking can wiggle, so the app smooths the point.

### Kid Meaning

Smoothing makes the brush follow your finger more gently.

### Real-Life Example

Imagine walking a small toy car by pulling it with a string.

If your hand shakes a little, the car does not instantly jump everywhere. It
follows more smoothly.

### Air Painter Connection

The app uses:

```python
SMOOTHING = 0.35
```

And mixes the old point with the new point:

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

### Do Not Worry Yet

The math looks long, but the idea is simple:

```text
Smooth the brush so the line is less shaky.
```

---

## Lesson 22: The Toolbar Is A Row Of Buttons

### Big Idea

The toolbar lets the user choose colors and tools.

### Kid Meaning

The toolbar is the row of paint cups and tool buttons at the top.

### Real-Life Example

In a drawing app, you tap a color square to choose a color.

This app does the same thing, but your two fingers do the tapping.

### Air Painter Connection

The app draws the toolbar:

```python
toolbar_items = draw_toolbar(display, selected_color_index, selected_tool)
```

The function gives back items like:

```python
("cyan", (255, 255, 0), rect)
```

Kid meaning:

```text
This button is named cyan.
It has this color.
It lives inside this rectangle.
```

---

## Lesson 23: Rectangles Help With Tapping

### Big Idea

The app checks if your fingertip is inside a button rectangle.

### Kid Meaning

A rectangle is a button box.

If your finger point is inside the box, you tapped that button.

### Real-Life Example

If your finger lands inside a square on a tablet screen, that button gets
pressed.

### Air Painter Connection

The app uses:

```python
def point_in_rect(point, rect):
    return rect[0] <= point[0] <= rect[2] and rect[1] <= point[1] <= rect[3]
```

Kid meaning:

```text
Is the point between the left and right sides?
Is the point between the top and bottom sides?
If yes, the point is inside the button.
```

### Try It

```python
point_x = 50
left = 20
right = 80

print(left <= point_x <= right)
```

Answer: `True`

---

## Lesson 24: Erasing And Clearing

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

### Air Painter Connection

Open palm erases a circle:

```python
cv2.circle(canvas, smoothed_point, ERASER_RADIUS, (0, 0, 0), -1, cv2.LINE_AA)
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

## Lesson 25: Distance Finds A Pinch

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

### Air Painter Connection

The app checks:

```python
pinch_now = distance(index_tip, thumb_tip) < PINCH_DISTANCE
```

Kid meaning:

```text
If thumb and index finger are close enough, that is a pinch.
```

### Why Use `last_pinched`?

The app uses:

```python
if pinch_now and not last_pinched:
    create_firework(particles, smoothed_point, color)
```

Kid meaning:

```text
Make one firework when the pinch starts.
Do not make a new firework every single frame while the pinch is held.
```

---

## Lesson 26: Particles Make Fireworks

### Big Idea

A firework is many tiny moving dots.

### Kid Meaning

Each particle is one little spark.

Many sparks together look like an explosion.

### Real-Life Example

A party popper shoots many small pieces in different directions.

A particle firework does the same thing with dots on the screen.

### Air Painter Connection

The app has a particle class:

```python
@dataclass
class Particle:
    x: float
    y: float
    vx: float
    vy: float
    life: int
    color: tuple[int, int, int]
```

Kid meanings:

```text
x, y -> where the spark is
vx, vy -> how it moves
life -> how long it stays alive
color -> what color it is
```

### How A Particle Moves

```python
def update(self):
    self.x += self.vx
    self.y += self.vy
    self.vx *= 0.96
    self.vy *= 0.96
    self.life -= 1
```

Kid meaning:

```text
Move the spark.
Slow it down a little.
Make its life shorter.
```

---

## Lesson 27: Saving The Drawing

### Big Idea

The app can save the canvas as a PNG image.

### Kid Meaning

Saving means turning your painting into a file you can open later.

### Real-Life Example

When you save a drawing in a tablet app, it goes into your photos or files.

This project saves into a folder named `saved_drawings`.

### Air Painter Connection

The app has:

```python
def save_canvas(canvas):
    output_dir = Path("saved_drawings")
    output_dir.mkdir(exist_ok=True)
    filename = output_dir / f"air_painting_{time.strftime('%Y%m%d_%H%M%S')}.png"
    cv2.imwrite(str(filename), canvas)
    return filename
```

Kid meaning:

```text
Make a saved_drawings folder.
Make a filename using the current date and time.
Write the canvas to that PNG file.
Give the filename back.
```

### Air Painter Control

Press:

```text
S
```

to save your painting.

---

## Lesson 28: Keyboard Shortcuts

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

### Air Painter Connection

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
```

The app also uses:

```text
V -> show or hide the camera background
E -> switch pen and eraser
```

---

## Lesson 29: The Whole App Loop

### Big Idea

The main loop runs the painter one frame at a time.

### Kid Meaning

One frame is one quick turn of the app.

### What Happens In One Frame?

1. Read the camera picture.
2. Flip it like a mirror.
3. Ask MediaPipe to find hands.
4. Make a display screen.
5. Add the old painting from the canvas.
6. Draw the toolbar.
7. If a hand is seen, find the fingertip.
8. Smooth the fingertip point.
9. Check gestures.
10. Draw, erase, select, clear, or make fireworks.
11. Draw status messages.
12. Show the window.
13. Check keyboard keys.

### Air Painter Connection

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

## Lesson 30: Polish Makes The App Feel Alive

### Big Idea

Small details make the painter more fun to use.

### Kid Meaning

Polish is like decorating a project after it works.

### Project Polish

The app has:

- a hand skeleton drawn on top of your hand
- a glowing brush line
- a color toolbar
- an eraser tool
- a clear button
- pinch fireworks
- saved image files
- short status messages
- a camera background toggle

### Example: Status Message

```python
status_message = "Canvas cleared"
status_until = time.time() + 1.2
```

Kid meaning:

```text
Show this message for a little while.
```

### Example: Camera Background

```python
show_camera_background = not show_camera_background
```

Kid meaning:

```text
Flip the setting.
If it was off, turn it on.
If it was on, turn it off.
```

---

## Lesson 31: Run The Real Project

### Step 1: Open The Project Folder

Go into the folder:

```bash
cd hand_tracking_painter
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
python3 air_draw.py
```

Windows:

```bash
python air_draw.py
```

### Controls

```text
One index finger up      -> draw
Two fingers up           -> select a color or tool
Open palm                -> erase
Pinch thumb and index    -> firework
C key                    -> clear
S key                    -> save
V key                    -> show or hide camera background
E key                    -> switch pen and eraser
Q key or Esc             -> quit
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
  +--> If hand is seen, find fingertip and fingers
  |
  +--> If one finger is up, draw or erase
  |
  +--> If two fingers are up, choose toolbar item
  |
  +--> If palm is open, erase
  |
  +--> If pinch starts, make fireworks
  |
  +--> Draw canvas, toolbar, hand skeleton, messages
  |
  +--> Check keys: C clear, S save, V background, E eraser, Q quit
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

### List

Many things stored in order.

### Tuple

A small group of values that belong together.

### Dictionary

Many labeled values stored together.

### Coordinate

An address on the screen, like `(x, y)`.

### Pixel

A tiny dot on the screen.

### Frame

One camera picture.

### Canvas

The image that stores the painting.

### Landmark

A hand point found by MediaPipe.

### Gesture

A hand shape that means a command.

### Particle

One tiny moving dot used for fireworks.

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

### Problem: Drawing Is Shaky

Try these:

- Move more slowly.
- Use better lighting.
- Change `SMOOTHING = 0.35` to `SMOOTHING = 0.20`.

Smaller smoothing can look steadier, but it may also feel a little slower.

### Problem: The App Runs Slowly

Try smaller camera size in `air_draw.py`:

```python
CAMERA_WIDTH = 960
CAMERA_HEIGHT = 540
```

---

## Mini Experiments

Change only one thing at a time.

### Make The Brush Thicker

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
ERASER_RADIUS = 45
```

Try:

```python
ERASER_RADIUS = 80
```

### Add A New Color

Find the `COLORS` list.

Add a new color:

```python
("orange", (0, 140, 255)),
```

Remember: OpenCV uses blue, green, red.

### Make Bigger Fireworks

Find:

```python
for _ in range(34):
```

Try:

```python
for _ in range(80):
```

### Make Pinching Harder

Find:

```python
PINCH_DISTANCE = 45
```

Try:

```python
PINCH_DISTANCE = 30
```

Now your fingers must be closer together to make fireworks.

---

## Build Challenge Path

After the main app works, try these in order.

### Challenge 1: Add A Purple Color

Add a purple swatch to the `COLORS` list.

Hint:

```python
("purple", (200, 80, 180)),
```

### Challenge 2: Add A Smaller Brush Mode

New idea:

```text
Press 1 for small brush.
Press 2 for normal brush.
Press 3 for big brush.
```

### Challenge 3: Add An Undo Key

New idea:

```text
Save old copies of the canvas in a list.
Press U to go back one step.
```

### Challenge 4: Add Sound

New idea:

```text
Play one sound when saving.
Play another sound when fireworks happen.
```

### Challenge 5: Two-Hand Mode

New idea:

```text
One hand draws.
The other hand chooses colors.
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

### After Lesson 16

Ask:

```text
Why do we need a canvas?
```

Good answer:

```text
So the painting stays even when the camera picture changes.
```

### After Lesson 18

Ask:

```text
What does MediaPipe find?
```

Good answer:

```text
Hand landmarks, which are points on the hand.
```

### After Lesson 20

Ask:

```text
What does one finger do? What do two fingers do?
```

Good answer:

```text
One finger draws. Two fingers select a color or tool.
```

### After Lesson 25

Ask:

```text
How does the app know you pinched?
```

Good answer:

```text
It checks if the thumb tip and index tip are close together.
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
lists
tuples
functions
dictionaries
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
