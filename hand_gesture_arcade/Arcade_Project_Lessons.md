# Hand Gesture Arcade Lessons: Kid Builder Edition

This lesson is for kids who are building the Hand Gesture Arcade game.

The goal is not to memorize big computer words. The goal is to understand what
the game is doing, one small idea at a time.

By the end, you will understand how this project works:

- Python gives the computer instructions.
- OpenCV reads the camera and draws the game.
- MediaPipe finds your hand.
- Your index finger controls the player cursor.
- Stars and gems give points.
- Bombs take away hearts.
- An open palm makes a shield.
- A pinch makes a blast.
- The game ends when time runs out or hearts reach zero.

Think of the computer like a very fast helper. It is fast, but it is not wise.
It only does exactly what your instructions say.

---

## How To Use These Lessons

Each lesson has five parts:

1. **Big idea** - the new thing you are learning.
2. **Kid meaning** - a simple explanation.
3. **Real-life example** - something you already understand.
4. **Try it** - a small piece of code.
5. **Arcade connection** - how it helps the real game.

Rules for learning:

- Type the code yourself. Typing helps your brain learn.
- If you get an error, read it slowly. Errors are clues.
- Change one thing at a time.
- Run the code often.
- Explain what you built out loud, like you are teaching a friend.

---

## Project Picture

Before we code, imagine the full game.

The computer has to do these jobs again and again:

1. Look at the camera.
2. Find your hand.
3. Put a player cursor on your index fingertip.
4. Drop stars, gems, and bombs from the top.
5. Move all falling items.
6. Check if the cursor touched an item.
7. Add points or remove hearts.
8. Check for shield and blast gestures.
9. Draw the new screen.
10. Repeat.

That is the whole game loop.

Kid meaning: A game loop is like a song chorus that keeps coming back.

---

## Lesson 1: What Is Python?

### Big Idea

Python is a language for giving instructions to a computer.

### Kid Meaning

Python is like writing a very clear list of game rules:

```text
Open the camera.
Find the hand.
Move the player.
Drop a star.
Add points when the player catches it.
```

The computer follows instructions like that, but written in Python.

### Real-Life Example

If you tell a friend:

```text
Stand under the ball.
Catch it.
Get one point.
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
print("Hello, Arcade Builder!")
```

### What Happened?

`print` means "show this on the screen."

### Arcade Connection

The real game shows text on the game screen, like:

```text
SCORE 100
HEARTS |||
GAME OVER
```

The idea is still simple: tell the computer what to show.

---

## Lesson 2: Text And Numbers

### Big Idea

Python treats words and numbers differently.

### Kid Meaning

Words need quotation marks. Numbers do not.

### Real-Life Example

If you write `"10"` with quotes, Python sees it like a label.
If you write `10` without quotes, Python sees it like a number for math.

### Try It

```python
print("10 + 25")
print(10 + 25)
```

### What Happened?

The first line shows the text:

```text
10 + 25
```

The second line does the math:

```text
35
```

### Arcade Connection

The score uses numbers:

```python
state.score += gained
```

Kid meaning:

```text
Add the points you earned to the score.
```

---

## Lesson 3: Variables Are Boxes

### Big Idea

A variable stores something so the computer can remember it.

### Kid Meaning

A variable is like a labeled box.

```python
score = 0
```

This means:

```text
Make a box called score.
Put 0 inside it.
```

### Real-Life Example

Imagine a scorecard with a number on it.

The card is still the scorecard, but the number can change.

### Try It

```python
score = 0
print(score)

score = score + 10
print(score)

score = score + 25
print(score)
```

### What Happened?

The score started at 0.
Then it became 10.
Then it became 35.

### Arcade Connection

The game remembers:

```python
score
hearts
combo
items
game_over
```

Those are all values the game needs while you play.

---

## Lesson 4: Files Are Saved Instructions

### Big Idea

Typing in Python one line at a time is useful, but a game needs a file.

### Kid Meaning

A Python file is like a recipe page. The computer reads it from top to bottom.

### Real-Life Example

A game rule sheet does not just say:

```text
Play.
```

It says:

```text
Start with 3 hearts.
Catch stars.
Avoid bombs.
Play for 60 seconds.
```

### Try It

Create a file named `arcade_score.py`.

Put this inside:

```python
score = 0
score = score + 10
score = score + 25
print(score)
```

Run it:

Mac:

```bash
python3 arcade_score.py
```

Windows:

```bash
python arcade_score.py
```

### Arcade Connection

The real project file is named:

```text
gesture_arcade.py
```

That file is the recipe for the full game.

---

## Lesson 5: Loops Do Repeating Jobs

### Big Idea

A loop repeats code.

### Kid Meaning

A loop means "do this again."

### Real-Life Example

If your teacher says:

```text
Bounce the ball 5 times.
```

They do not need to say:

```text
Bounce.
Bounce.
Bounce.
Bounce.
Bounce.
```

The instruction "5 times" is the loop.

### Try It

```python
for number in range(5):
    print("A star is falling!")
```

Important: the second line is indented. In Python, indentation tells the
computer what belongs inside the loop.

### Arcade Connection

The real game uses a loop that keeps running while you play:

```python
while True:
    # read camera
    # update game
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
If you catch a star, get points.
If you touch a bomb, lose a heart.
```

Games think like that too.

### Try It

```python
item = "star"

if item == "star":
    print("+10 points")
else:
    print("No points")
```

### Arcade Connection

The game checks item types:

```python
if item.kind == "bomb":
    if shield_active:
        state.score += 5
    else:
        state.hearts -= 1
else:
    state.score += gained
```

Kid meaning:

```text
If it is a bomb and shield is on, get a small reward.
If it is a bomb and shield is off, lose a heart.
Otherwise, collect points from a star or gem.
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
Is the game over? False.
Is the shield active? True.
```

### Try It

```python
shield_active = True

if shield_active:
    print("Bombs are safer!")
else:
    print("Avoid bombs!")
```

### Arcade Connection

The game uses:

```python
game_over = False
```

Kid meaning:

```text
At the start, the game is not over.
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

You may go 5 steps right and 3 steps down.

The screen works in a similar way.

### Try It

```python
player = (300, 200)
print(player[0])
print(player[1])
```

### What Happened?

`player[0]` is the x address.
`player[1]` is the y address.

### Arcade Connection

The player cursor follows the index fingertip:

```python
index_tip = landmark_point(landmarks, 8, width, height)
```

Kid meaning:

```text
Find the screen address of the index fingertip.
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

### Arcade Connection

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

## Lesson 10: Lists Hold Many Things

### Big Idea

A list stores many values in order.

### Kid Meaning

A list is like a line of falling objects.

### Real-Life Example

```python
items = ["star", "gem", "bomb"]
```

That list has three item names.

### Try It

```python
items = ["star", "gem", "bomb"]
print(items[0])
print(items[-1])
```

### What Happened?

`items[0]` is the first item.
`items[-1]` is the last item.

### Arcade Connection

The game stores falling objects in a list:

```python
items: list[FallingItem] = field(default_factory=list)
```

Kid meaning:

```text
Keep a list of all the stars, gems, and bombs currently falling.
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

### Arcade Connection

The game asks which fingers are up:

```python
fingers = get_fingers(landmarks)
```

Then it can check:

```python
shield_active = all(fingers.values())
```

Kid meaning:

```text
If the index, middle, ring, and pinky pockets all say True, the shield is active.
```

---

## Lesson 12: Functions Are Mini Machines

### Big Idea

A function is a named set of instructions.

### Kid Meaning

A function is like a small machine. You give it something, it does a job, and
sometimes it gives something back.

### Real-Life Example

A ticket machine is like a function:

```text
Input: money
Job: make a ticket
Output: ticket
```

### Try It

```python
def add_points(score, points):
    return score + points

score = 0
score = add_points(score, 10)
print(score)
```

### Arcade Connection

The project has functions like:

```python
def spawn_item(state):
    ...

def collect_item(state, item, shield_active):
    ...

def update_game(state, dt, cursor, shield_active, pinch_started):
    ...
```

Each function has one job.

### Kid Meanings

`spawn_item` means:

```text
Create a new falling star, gem, or bomb.
```

`collect_item` means:

```text
Handle what happens when the player touches an item.
```

`update_game` means:

```text
Move the whole game forward one tiny step.
```

---

## Lesson 13: Classes Make Game Object Blueprints

### Big Idea

A class is a blueprint for making objects.

### Kid Meaning

A class says what an object has and what it can do.

### Real-Life Example

A cookie cutter is a blueprint for cookies.

Every cookie has the same shape, but each cookie can be decorated differently.

### Arcade Connection

The game has a blueprint for falling items:

```python
@dataclass
class FallingItem:
    x: float
    y: float
    vy: float
    radius: int
    kind: str
    color: tuple[int, int, int]
    points: int
    wobble: float
    age: float = 0.0
```

Kid meanings:

```text
x, y   -> where the item is
vy     -> how fast it falls
radius -> how big it is
kind   -> star, gem, or bomb
color  -> what color it is
points -> how many points it gives
wobble -> how it wiggles left and right
age    -> how long it has existed
```

---

## Lesson 14: GameState Is The Game Backpack

### Big Idea

The game needs one place to store important information.

### Kid Meaning

`GameState` is the backpack for the whole game.

### Real-Life Example

For a board game, you may need to remember:

```text
score
lives
time left
pieces on the board
whose turn it is
```

### Arcade Connection

The arcade game stores:

```python
score: int = 0
hearts: int = 3
combo: int = 0
started_at: float = field(default_factory=time.time)
last_spawn: float = field(default_factory=time.time)
blast_ready_at: float = 0.0
game_over: bool = False
items: list[FallingItem] = field(default_factory=list)
particles: list[Particle] = field(default_factory=list)
texts: list[FloatingText] = field(default_factory=list)
shockwaves: list[Shockwave] = field(default_factory=list)
```

Kid meaning:

```text
The game backpack stores score, hearts, combo, timers, whether the game is over,
falling items, spark effects, floating words, and blast circles.
```

---

## Lesson 15: Random Makes The Game Different

### Big Idea

Random means the computer picks without following the same pattern every time.

### Kid Meaning

Random is like pulling a card from a shuffled deck.

### Real-Life Example

If you close your eyes and pick a crayon, the color is random.

### Try It

```python
import random

items = ["star", "gem", "bomb"]
print(random.choice(items))
```

Run it several times. You may get a different item.

### Arcade Connection

The game uses random numbers to create falling items:

```python
roll = random.random()
```

Kid meaning:

```text
Pick a random number and use it to decide what falls next.
```

---

## Lesson 16: Spawning Means Creating

### Big Idea

Spawning means making a new game object appear.

### Kid Meaning

When the game spawns an item, it creates a new star, gem, or bomb.

### Real-Life Example

Imagine a teacher dropping one new ball from the top of a slide.

Each new ball is like a spawned item.

### Arcade Connection

The game spawns items with:

```python
def spawn_item(state):
    ...
    state.items.append(FallingItem(...))
```

Kid meaning:

```text
Make a new falling item and add it to the list of items.
```

### Item Chances

The project uses:

```text
24 out of 100 items are bombs
18 out of 100 items are gems
58 out of 100 items are stars
```

This keeps the game exciting.

---

## Lesson 17: Time Controls Speed

### Big Idea

Games use time to move things smoothly.

### Kid Meaning

The game needs to know how much time passed since the last frame.

### Real-Life Example

If you walk for 1 second, you move a little.
If you walk for 10 seconds, you move farther.

Time matters.

### Arcade Connection

The game uses:

```python
dt = min(0.05, now - last_frame_time)
```

Kid meaning:

```text
dt means delta time.
It is the little amount of time since the last frame.
```

Falling items move with:

```python
self.y += self.vy * dt
self.x += math.sin(self.age * 5.0 + self.wobble) * 0.9
```

Kid meaning:

```text
Move down based on speed and time.
Also wiggle a tiny bit left and right.
```

---

## Lesson 18: The Camera Is A Fast Photo Machine

### Big Idea

A camera video is many pictures shown quickly.

### Kid Meaning

The camera gives Python one picture, then another, then another.

### Real-Life Example

A flipbook looks like motion because each page is a slightly different drawing.

A video works like that too.

### Arcade Connection

The game reads the camera:

```python
ok, frame = camera.read()
```

Kid meaning:

```text
ok    -> Did the camera give us a picture?
frame -> The picture from the camera.
```

Then the game flips it:

```python
frame = cv2.flip(frame, 1)
```

Kid meaning:

```text
Make the camera feel like a mirror.
```

---

## Lesson 19: MediaPipe Finds Your Hand

### Big Idea

MediaPipe is a tool that can find hand points in a camera picture.

### Kid Meaning

MediaPipe puts invisible sticker dots on your hand.

### Real-Life Example

Imagine drawing dots on your knuckles and fingertips in a photo.

If the computer knows where the dots are, it knows where your hand is.

### Arcade Connection

The game asks MediaPipe to process the camera picture:

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

The game uses dot number 8:

```python
index_tip = landmark_point(landmarks, 8, width, height)
```

Kid meaning:

```text
Use the index fingertip as the player cursor.
```

---

## Lesson 20: Finger Detection Makes Gestures

### Big Idea

The game needs to know which fingers are raised.

### Kid Meaning

The computer compares hand dots to decide if a finger is up.

### Arcade Connection

The game checks a finger like this:

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
Index fingertip -> move player
Open palm       -> shield
Pinch           -> blast
```

Important: the project tracks index, middle, ring, and pinky for the open-palm
shield. The thumb is used separately for the pinch blast.

---

## Lesson 21: Smoothing Stops Jumpy Controls

### Big Idea

Hand tracking can wiggle, so the game smooths the cursor.

### Kid Meaning

Smoothing makes the player follow your finger more gently.

### Real-Life Example

Imagine pulling a toy by a string.

If your hand shakes a little, the toy does not instantly jump everywhere. It
follows more smoothly.

### Arcade Connection

The game uses:

```python
SMOOTHING = 0.34
```

And mixes the old cursor with the new fingertip point:

```python
smoothed_cursor = (
    int(smoothed_cursor[0] * (1 - SMOOTHING) + index_tip[0] * SMOOTHING),
    int(smoothed_cursor[1] * (1 - SMOOTHING) + index_tip[1] * SMOOTHING),
)
```

Kid meaning:

```text
Do not jump all the way to the new finger spot.
Move part of the way there.
```

---

## Lesson 22: Collision Means Touching

### Big Idea

Collision means two things touch or crash.

### Kid Meaning

In this game, collision happens when the player cursor touches a falling item.

### Real-Life Example

If your hand catches a falling ball, your hand and the ball touched.

### Try It

```python
import math

player = (100, 100)
item = (120, 100)
distance = math.hypot(player[0] - item[0], player[1] - item[1])
print(distance)
```

### Arcade Connection

The game checks:

```python
if distance(cursor, (int(item.x), int(item.y))) <= PLAYER_RADIUS + item.radius:
    collect_item(state, item, shield_active)
```

Kid meaning:

```text
If the player circle and item circle touch, collect the item.
```

---

## Lesson 23: Stars, Gems, And Bombs

### Big Idea

Different items do different things.

### Kid Meaning

Not everything falling from the top is good.

### Item Meanings

```text
Star -> gives points
Gem  -> gives more points
Bomb -> removes a heart, unless shield is active
```

### Arcade Connection

The game handles bombs first:

```python
if item.kind == "bomb":
    if shield_active:
        state.score += 5
    else:
        state.hearts -= 1
        state.combo = 0
    return
```

Kid meaning:

```text
If shield is on, a bomb gives a tiny reward.
If shield is off, a bomb hurts the player.
```

---

## Lesson 24: Combo Rewards Streaks

### Big Idea

A combo rewards the player for catching good items in a row.

### Kid Meaning

The more good catches you make without messing up, the better your bonus gets.

### Real-Life Example

In some games, scoring three times in a row gives a bonus.

That is a combo.

### Arcade Connection

The game uses:

```python
state.combo += 1
combo_bonus = min(25, state.combo * 2)
gained = item.points + combo_bonus
state.score += gained
```

Kid meaning:

```text
Make the combo bigger.
Give bonus points.
Do not let the bonus grow forever.
```

### When Combo Stops

If you hit a bomb without a shield or miss a good item, the combo resets.

---

## Lesson 25: Shield Uses An Open Palm

### Big Idea

An open palm turns on shield mode.

### Kid Meaning

When all fingers are up, the game protects you from bombs.

### Real-Life Example

Holding up your hand like a stop sign means:

```text
Stop!
```

In the game, it means:

```text
Shield!
```

### Arcade Connection

The game checks:

```python
shield_active = all(fingers.values())
```

Kid meaning:

```text
If index, middle, ring, and pinky are all up, shield is active.
```

When shield is active, the cursor gets a bigger green ring.

---

## Lesson 26: Pinch Makes A Blast

### Big Idea

A pinch can clear nearby objects.

### Kid Meaning

If your thumb and index finger touch, the game makes a blast around the cursor.

### Real-Life Example

Imagine tapping a magic button that pushes nearby things away.

### Arcade Connection

The game checks:

```python
pinching_now = distance(index_tip, thumb_tip) < PINCH_DISTANCE
pinch_started = pinching_now and not was_pinching
```

Kid meaning:

```text
Are the thumb and index finger close?
Did the pinch just start?
```

The game uses `pinch_started` so holding a pinch does not blast every frame.

### Blast Cooldown

The project has:

```python
BLAST_COOLDOWN = 1.25
```

Kid meaning:

```text
After a blast, wait a little before blasting again.
```

---

## Lesson 27: Particles, Text, And Shockwaves

### Big Idea

Small effects make the game feel alive.

### Kid Meaning

Particles are sparks.
Floating text is a quick message.
A shockwave is a growing circle.

### Arcade Connection

The game has effect blueprints:

```python
@dataclass
class Particle:
    ...

@dataclass
class FloatingText:
    ...

@dataclass
class Shockwave:
    ...
```

Kid meanings:

```text
Particle     -> one tiny spark
FloatingText -> "+10" or "-1 heart"
Shockwave    -> blast circle
```

### Example

When you collect a star:

```python
add_text(state, f"+{gained}", center, item.color)
add_burst(state, center, item.color, 26)
```

Kid meaning:

```text
Show the points.
Make little sparks.
```

---

## Lesson 28: Drawing With OpenCV

### Big Idea

OpenCV helps Python draw images and show windows.

### Kid Meaning

OpenCV is like a box of drawing tools for Python.

### Drawing Tools

The game uses:

```python
cv2.circle(...)
cv2.line(...)
cv2.fillPoly(...)
cv2.polylines(...)
cv2.putText(...)
cv2.imshow(...)
```

Kid meanings:

```text
circle    -> draw the player, bombs, sparks, and rings
line      -> draw hand skeleton lines
fillPoly  -> fill a star or gem shape
polylines -> outline a shape
putText   -> write score and messages
imshow    -> show the window
```

### Arcade Connection

Stars are drawn with points:

```python
draw_star(image, center, item.radius, item.color)
```

Gems are drawn like diamonds:

```python
draw_gem(image, center, item.radius, item.color)
```

Bombs are drawn as red circles:

```python
draw_bomb(image, center, item.radius)
```

---

## Lesson 29: The HUD Shows Game Info

### Big Idea

HUD means the information on top of the game.

### Kid Meaning

The HUD is the scoreboard and helper text.

### Real-Life Example

In a sports game, the scoreboard shows:

```text
score
time
period
```

This game has a scoreboard too.

### Arcade Connection

The game draws:

```python
SCORE
HEARTS
TIME
COMBO
```

using:

```python
draw_hud(display, state, hand_seen)
```

Kid meaning:

```text
Draw the score, hearts, timer, combo, and controls.
```

---

## Lesson 30: Game Over

### Big Idea

The game needs a clear ending.

### Kid Meaning

The game ends when you run out of time or hearts.

### Arcade Connection

The game checks:

```python
remaining = GAME_SECONDS - (now - state.started_at)
if remaining <= 0 or state.hearts <= 0:
    state.game_over = True
```

Kid meaning:

```text
If time is gone or hearts are gone, the game is over.
```

When the game is over, it draws:

```python
draw_game_over(display, state)
```

### Controls

```text
R -> restart
Q -> quit
```

---

## Lesson 31: The Whole Game Step

### Big Idea

`update_game` moves the game forward one tiny step.

### Kid Meaning

One game step is like one turn in a fast board game.

### What Happens In One Step?

1. Check if the game is already over.
2. Check the time and hearts.
3. Spawn new items when enough time has passed.
4. If a pinch started, use the blast.
5. Move every falling item.
6. Check if the player touched an item.
7. Remove items that were collected or fell off screen.
8. Update particles, floating text, and shockwaves.

### Arcade Connection

This is the heart of the game:

```python
update_game(state, dt, cursor, shield_active, pinch_started)
```

Kid meaning:

```text
Use the current state, time, player cursor, shield, and pinch to update the
game.
```

---

## Lesson 32: Run The Real Project

### Step 1: Open The Project Folder

Go into the folder:

```bash
cd hand_gesture_arcade
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

### Step 4: Run The Game

Mac:

```bash
python3 gesture_arcade.py
```

Windows:

```bash
python gesture_arcade.py
```

### Controls

```text
Move index finger       -> move the player cursor
Touch stars and gems    -> collect points
Touch bombs             -> lose hearts unless shield is active
Open palm               -> shield mode
Pinch thumb and index   -> blast nearby objects
R key                   -> restart
V key                   -> show or hide camera background
Q key or Esc            -> quit
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
Make a new GameState
  |
  v
Repeat forever
  |
  +--> Read camera picture
  |
  +--> Ask MediaPipe: do you see a hand?
  |
  +--> If hand is seen, move cursor to index fingertip
  |
  +--> If palm is open, turn on shield
  |
  +--> If pinch just started, blast nearby items
  |
  +--> Spawn stars, gems, and bombs
  |
  +--> Move falling items
  |
  +--> If cursor touches item, collect it
  |
  +--> Update sparks, text, and shockwaves
  |
  +--> Draw game screen and HUD
  |
  +--> Check keys: R restart, V background, Q quit
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

### Dictionary

Many labeled values stored together.

### Class

A blueprint for making objects.

### Dataclass

A class that is mostly used to store data.

### Coordinate

An address on the screen, like `(x, y)`.

### Pixel

A tiny dot on the screen.

### Frame

One camera picture.

### Landmark

A hand point found by MediaPipe.

### Gesture

A hand shape that means a command.

### Collision

When two things touch.

### Spawn

Create a new game object.

### Particle

One tiny moving dot used for spark effects.

### HUD

The score and information shown on top of the game.

### Cooldown

A waiting time before a power can be used again.

### Game Loop

The repeating cycle that keeps the game running.

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

### Problem: The Game Does Not See Your Hand

Try these:

- Use a brighter room.
- Keep your hand open at first.
- Use a plain background.
- Move slowly.
- Make sure your whole hand is inside the camera picture.

### Problem: Cursor Is Shaky

Try these:

- Move more slowly.
- Use better lighting.
- Change `SMOOTHING = 0.34` to `SMOOTHING = 0.20`.

Smaller smoothing can look steadier, but it may also feel a little slower.

### Problem: Game Runs Slowly

Try smaller camera size in `gesture_arcade.py`:

```python
CAMERA_WIDTH = 960
CAMERA_HEIGHT = 540
```

---

## Mini Experiments

Change only one thing at a time.

### Make The Game Longer

Find:

```python
GAME_SECONDS = 60
```

Try:

```python
GAME_SECONDS = 90
```

### Give More Hearts

Find:

```python
hearts: int = 3
```

Try:

```python
hearts: int = 5
```

### Make The Player Bigger

Find:

```python
PLAYER_RADIUS = 28
```

Try:

```python
PLAYER_RADIUS = 38
```

This makes catching easier.

### Make The Blast Bigger

Find:

```python
BLAST_RADIUS = 165
```

Try:

```python
BLAST_RADIUS = 230
```

### Make Blasts Reload Faster

Find:

```python
BLAST_COOLDOWN = 1.25
```

Try:

```python
BLAST_COOLDOWN = 0.75
```

---

## Build Challenge Path

After the main game works, try these in order.

### Challenge 1: Change Star Colors

Find:

```python
random.choice([YELLOW, CYAN, GREEN])
```

Add another color to the list.

### Challenge 2: Make Gems Worth More

Find where gems are created:

```python
points = 25
```

Try:

```python
points = 40
```

### Challenge 3: Add A New Falling Item

New idea:

```text
Add a heart item that gives one heart back.
```

### Challenge 4: Add A High Score

New idea:

```text
Save the best score in a file.
Read it when the game starts.
Write it when the player beats it.
```

### Challenge 5: Add Sound

New idea:

```text
Play one sound when collecting a star.
Play another sound when touching a bomb.
Play a bigger sound when blasting.
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

### After Lesson 14

Ask:

```text
What is GameState for?
```

Good answer:

```text
It stores the important game information like score, hearts, items, and effects.
```

### After Lesson 22

Ask:

```text
How does the game know the player caught an item?
```

Good answer:

```text
It checks if the player circle and item circle are close enough to touch.
```

### After Lesson 25

Ask:

```text
What does an open palm do?
```

Good answer:

```text
It turns on shield mode.
```

### After Lesson 26

Ask:

```text
Why does the game use a cooldown for blasts?
```

Good answer:

```text
So the player cannot blast every single frame.
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
dictionaries
classes
coordinates
camera frames
hand landmarks
gestures
collisions
timers
drawing
particles
```

That is programming: small pieces working together.

Keep building. Run the game. Break it a little. Fix it. Change it. Explain it.
That is how kids become real builders.
