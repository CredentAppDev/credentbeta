# Snake Project Lessons: Kid Builder Edition

This lesson is for kids who are building the hand-gesture Snake game.

The goal is not to memorize big computer words. The goal is to understand what
the game is doing, one small idea at a time.

By the end, you will understand how this project works:

- Python gives the computer instructions.
- OpenCV draws the game and reads the camera.
- MediaPipe finds your hand.
- The snake moves on a grid.
- Food appears in a random empty spot.
- The score grows when the snake eats food.
- The game ends when the snake crashes.

Think of the computer like a very fast helper. It is fast, but it is not wise.
It only does exactly what your instructions say.

---

## How To Use These Lessons

Each lesson has five parts:

1. **Big idea** - the new thing you are learning.
2. **Kid meaning** - a simple explanation.
3. **Real-life example** - something you already understand.
4. **Try it** - a small piece of code.
5. **Snake connection** - how it helps the real game.

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
3. Decide if your hand is left, right, up, or down.
4. Move the snake one square.
5. Check if the snake ate food.
6. Check if the snake crashed.
7. Draw the new screen.
8. Repeat.

That is the whole game loop.

Kid meaning: A game loop is like a song chorus that keeps coming back.

---

## Lesson 1: What Is Python?

### Big Idea

Python is a language for giving instructions to a computer.

### Kid Meaning

Python is like writing a very clear list of chores:

```text
Pick up the pencil.
Open the notebook.
Write your name.
Close the notebook.
```

The computer follows instructions like that, but written in Python.

### Real-Life Example

If you tell a friend:

```text
Go to the kitchen.
Open the fridge.
Take out the apple.
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
print("Hello, Snake Builder!")
```

### What Happened?

`print` means "show this on the screen."

### Snake Connection

Later, the game will show things like:

```python
SCORE 30
GAME OVER
```

The game is still just telling the computer what to show.

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

If you write `"10"` with quotes, Python sees it like a label on a box.
If you write `10` without quotes, Python sees it like a number for math.

### Try It

```python
print("10 + 5")
print(10 + 5)
```

### What Happened?

The first line shows the text:

```text
10 + 5
```

The second line does the math:

```text
15
```

### Snake Connection

The score uses numbers, not text:

```python
score = score + 10
```

If score is a number, Python can add to it.

### Tiny Challenge

The snake gets 10 points for each food. What should this print?

```python
print(5 * 10)
```

Answer: `50`

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

Imagine a lunchbox with your name on it.

The label says who it belongs to. The food inside can change.

Variables work like that. The name stays the same, but the value inside can
change.

### Try It

```python
score = 0
print(score)

score = score + 10
print(score)

score = score + 10
print(score)
```

### What Happened?

The score started at 0.
Then it became 10.
Then it became 20.

### Snake Connection

Every time the snake eats food, the game does this:

```python
game["score"] += 10
```

That is a shorter way to say:

```python
game["score"] = game["score"] + 10
```

### Check Your Brain

If the score is 20 and the snake eats food, what is the next score?

Answer: `30`

---

## Lesson 4: Files Are Saved Instructions

### Big Idea

Typing in Python one line at a time is useful, but a game needs a file.

### Kid Meaning

A Python file is like a recipe book page. The computer reads it from top to
bottom.

### Real-Life Example

A cake recipe does not say:

```text
Bake cake.
```

It says:

```text
Mix flour.
Add sugar.
Add eggs.
Bake.
```

A game file is the recipe for the game.

### Try It

Create a file named `snake_score.py`.

Put this inside:

```python
score = 0
score = score + 10
score = score + 10
score = score + 10
print(score)
```

Run it:

Mac:

```bash
python3 snake_score.py
```

Windows:

```bash
python snake_score.py
```

### Snake Connection

The real project file is named:

```text
snake.py
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
Clap 5 times.
```

They do not need to say:

```text
Clap.
Clap.
Clap.
Clap.
Clap.
```

The instruction "5 times" is the loop.

### Try It

```python
for number in range(5):
    print("Snake ate food!")
```

Important: the second line is indented. In Python, indentation tells the
computer what belongs inside the loop.

### What Happened?

Python printed the same message 5 times.

### Snake Connection

The real game uses a loop that keeps running while you play:

```python
while True:
    # read camera
    # move snake
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
If it is raining, take an umbrella.
If it is sunny, wear sunglasses.
```

That is how games think too.

### Try It

```python
score = 30

if score >= 50:
    print("Great job!")
else:
    print("Keep eating food!")
```

### Snake Connection

The game asks questions like:

```python
if new_head == game["food"]:
    game["score"] += 10
```

Kid meaning:

```text
If the snake's head is on the food, add 10 points.
```

### Check Your Brain

What should happen if the snake hits the wall?

Answer: The game should end.

---

## Lesson 7: Coordinates Are Map Addresses

### Big Idea

The snake moves on a grid using coordinates.

### Kid Meaning

A coordinate is an address on a game board.

In this project, a cell looks like this:

```python
(x, y)
```

`x` means left and right.
`y` means up and down.

### Real-Life Example

Think about a classroom seating chart.

Seat `(0, 0)` could mean:

```text
First column, first row.
```

Seat `(3, 2)` could mean:

```text
Fourth column, third row.
```

Computers often start counting at 0, not 1.

### Try It

```python
head = (5, 4)
direction = (1, 0)

new_head = (head[0] + direction[0], head[1] + direction[1])
print(new_head)
```

### What Happened?

The snake moved from `(5, 4)` to `(6, 4)`.

Because `(1, 0)` means:

```text
Move 1 step right.
Move 0 steps down.
```

### Snake Connection

The real game has directions like this:

```python
(1, 0)   # right
(-1, 0)  # left
(0, 1)   # down
(0, -1)  # up
```

### Quick Picture

```text
(0,0) (1,0) (2,0)
(0,1) (1,1) (2,1)
(0,2) (1,2) (2,2)
```

Going right makes `x` bigger.
Going down makes `y` bigger.

---

## Lesson 8: Lists Hold Many Things

### Big Idea

A list stores many values in order.

### Kid Meaning

A list is like a line of students.

The first person is at the front. The last person is at the back.

### Real-Life Example

```python
students = ["Ava", "Ben", "Mia"]
```

That list has three names.

### Try It

```python
snake = [(5, 4), (4, 4), (3, 4)]
print(snake[0])
print(snake[-1])
```

### What Happened?

`snake[0]` is the first piece. That is the head.

`snake[-1]` is the last piece. That is the tail.

### Snake Connection

The snake is a list of grid cells:

```python
snake = [(16, 9), (15, 9), (14, 9)]
```

The head is first. The body follows behind it.

### How The Snake Moves

To move forward:

1. Add a new head at the front.
2. Remove the old tail at the back.

Like this:

```python
snake.insert(0, new_head)
snake.pop()
```

Kid meaning:

```text
New square joins the front.
Last square leaves the back.
```

---

## Lesson 9: Growing The Snake

### Big Idea

The snake grows by keeping its tail.

### Kid Meaning

Normal move:

```text
Add new head.
Remove tail.
Same length.
```

Eating food:

```text
Add new head.
Do not remove tail.
Longer snake.
```

### Real-Life Example

Imagine a train.

If a new train car joins the front and one leaves the back, the train stays the
same length.

If a new train car joins the front and none leave, the train gets longer.

### Try It

```python
snake = [(5, 4), (4, 4), (3, 4)]
new_head = (6, 4)

snake.insert(0, new_head)
print(snake)
```

The snake now has four pieces because we did not pop the tail.

### Snake Connection

In the real game:

```python
if new_head == game["food"]:
    game["score"] += 10
else:
    snake.pop()
```

Kid meaning:

```text
If food was eaten, grow.
If food was not eaten, move normally.
```

---

## Lesson 10: Functions Are Mini Machines

### Big Idea

A function is a named set of instructions.

### Kid Meaning

A function is like a small machine. You give it something, it does a job, and
sometimes it gives something back.

### Real-Life Example

A toaster is like a function:

```text
Input: bread
Job: heat it
Output: toast
```

### Try It

```python
def add_points(score):
    score = score + 10
    return score

score = 0
score = add_points(score)
print(score)
```

### Snake Connection

The project has functions like:

```python
def draw_grid(image):
    ...

def draw_snake(image, snake, direction):
    ...

def step_game(game):
    ...
```

Each function has one job.

### Kid Meanings

`draw_grid` means:

```text
Draw the board lines.
```

`draw_snake` means:

```text
Draw every square of the snake.
```

`step_game` means:

```text
Move the game forward by one step.
```

---

## Lesson 11: Dictionaries Are Labeled Backpacks

### Big Idea

A dictionary stores many labeled values.

### Kid Meaning

A dictionary is like a backpack with labeled pockets.

### Real-Life Example

```python
student = {
    "name": "Mia",
    "age": 10,
    "favorite_color": "green",
}
```

Each label points to one value.

### Try It

```python
game = {
    "score": 0,
    "alive": True,
    "direction": (1, 0),
}

print(game["score"])
game["score"] = game["score"] + 10
print(game["score"])
```

### Snake Connection

The real game keeps important things in one dictionary:

```python
game = {
    "snake": snake,
    "direction": (1, 0),
    "food": food,
    "score": 0,
    "alive": True,
}
```

Kid meaning:

```text
The game backpack stores the snake, food, score, direction, and whether the
player is still alive.
```

---

## Lesson 12: True And False Are Yes And No

### Big Idea

Python uses `True` and `False` for yes-or-no ideas.

### Kid Meaning

`True` means yes.
`False` means no.

### Real-Life Example

```text
Is the light on? True.
Is your backpack empty? False.
```

### Try It

```python
alive = True

if alive:
    print("Keep playing")
else:
    print("Game over")
```

### Snake Connection

The game uses:

```python
game["alive"] = False
```

Kid meaning:

```text
The snake crashed. Stop moving the snake.
```

---

## Lesson 13: Random Food

### Big Idea

Random means the computer picks without following the same pattern every time.

### Kid Meaning

Random is like pulling a card from a shuffled deck.

### Real-Life Example

If you close your eyes and pick a crayon from a box, the color is random.

### Try It

```python
import random

foods = ["apple", "banana", "cookie"]
print(random.choice(foods))
```

Run it several times. You may get a different food.

### Snake Connection

The game picks a food cell that is not inside the snake:

```python
def random_food(occupied):
    free = [
        (x, y)
        for x in range(GRID_COLS)
        for y in range(GRID_ROWS)
        if (x, y) not in occupied
    ]
    return random.choice(free)
```

Kid meaning:

```text
Make a list of all empty squares.
Pick one empty square.
Put food there.
```

### Do Not Worry Yet

That code looks big because it makes the list quickly. The idea is simple:

```text
Food should not appear inside the snake.
```

---

## Lesson 14: Collision Means Bumping

### Big Idea

Collision means two things touch or crash.

### Kid Meaning

In Snake, a crash happens when:

- the snake hits a wall
- the snake hits itself

### Real-Life Example

If a toy car drives off the table, it crashed.
If it runs into another toy car, it crashed.

### Try It

```python
GRID_COLS = 10
GRID_ROWS = 8
new_head = (10, 4)

if not (0 <= new_head[0] < GRID_COLS and 0 <= new_head[1] < GRID_ROWS):
    print("Wall crash!")
```

### What Happened?

The x position is `10`, but a 10-column grid has x positions `0` through `9`.
So `(10, 4)` is outside the board.

### Snake Connection

The real game checks the wall:

```python
if not (0 <= new_head[0] < GRID_COLS and 0 <= new_head[1] < GRID_ROWS):
    game["alive"] = False
```

Kid meaning:

```text
If the new head is outside the board, game over.
```

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

### Project Drawing Tools

The game uses:

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
circle    -> draw food or eyes
putText   -> write score words
imshow    -> show the window
```

### Snake Connection

A snake body square is drawn with a rectangle:

```python
cv2.rectangle(image, top_left, bottom_right, color, -1, cv2.LINE_AA)
```

Kid meaning:

```text
Draw a filled box on the screen.
```

### Helpful Detail

OpenCV colors are written as:

```python
(blue, green, red)
```

That is different from many paint apps, which say red, green, blue.

---

## Lesson 16: Pixels And Grid Cells

### Big Idea

The game uses grid cells, but the screen uses pixels.

### Kid Meaning

A grid cell is a big square on the board.
A pixel is a tiny dot on the screen.

### Real-Life Example

Think of a floor made of tiles.

Each tile is one grid cell.
But each tile is made of lots of tiny grains. Those tiny grains are like
pixels.

### Snake Connection

The game converts a grid cell to a screen position:

```python
def cell_to_pixel(cell):
    cx, cy = cell
    return cx * CELL_SIZE, TOP_BAR + cy * CELL_SIZE
```

Kid meaning:

```text
If a cell is 40 pixels wide:
cell 0 starts at pixel 0.
cell 1 starts at pixel 40.
cell 2 starts at pixel 80.
```

### Try It

```python
CELL_SIZE = 40
cell_x = 3
pixel_x = cell_x * CELL_SIZE
print(pixel_x)
```

Answer: `120`

---

## Lesson 17: Time Controls Speed

### Big Idea

The snake should not move as fast as the computer can run.

### Kid Meaning

The computer is too fast, so we make it wait a little before each move.

### Real-Life Example

If a teacher says "walk," you walk step by step.
You do not teleport across the room.

The snake needs steps too.

### Snake Connection

The project uses:

```python
TICK_INTERVAL_START = 0.22
TICK_INTERVAL_MIN = 0.08
```

Kid meaning:

```text
Move about every 0.22 seconds at the start.
Never move faster than 0.08 seconds per step.
```

### Important Word

A tick is one game step.

One tick means:

```text
Move the snake once.
Check food.
Check crash.
Draw again.
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

### Snake Connection

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

Without the flip, moving your hand right can look like left on the screen.

---

## Lesson 19: MediaPipe Finds Your Hand

### Big Idea

MediaPipe is a tool that can find hand points in a camera picture.

### Kid Meaning

MediaPipe puts invisible sticker dots on your hand.

### Real-Life Example

Imagine drawing dots on your knuckles and palm in a photo.
If the computer knows where the dots are, it knows where your hand is.

### Snake Connection

The game asks MediaPipe to process the camera picture:

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

The project uses dot number 9:

```python
landmarks[9].x
landmarks[9].y
```

Kid meaning:

```text
Use the palm center to steer the snake.
```

---

## Lesson 20: Turning Hand Position Into Direction

### Big Idea

The game looks at where your hand is compared to the center of the camera.

### Kid Meaning

Pretend the camera picture has a plus sign in the middle.

```text
          up
           |
left ------+------ right
           |
         down
```

If your hand is far to the right, the snake turns right.
If your hand is far up, the snake turns up.

### Snake Connection

The game uses:

```python
dx = hand_x - 0.5
dy = hand_y - 0.5
```

Kid meaning:

```text
0.5 is the center.
More than 0.5 means right or down.
Less than 0.5 means left or up.
```

### The Dead Zone

The project has:

```python
DEAD_ZONE = 0.12
```

Kid meaning:

```text
If your hand is near the middle, do not turn yet.
```

This stops the snake from wiggling too much when your hand shakes a little.

### No Backwards Rule

The snake cannot turn straight backward.

If the snake is moving right, it cannot instantly turn left.
It must go up or down first.

Kid reason:

```text
If it turns straight backward, it crashes into its own neck.
```

---

## Lesson 21: The Whole Game Step

### Big Idea

`step_game(game)` moves the game forward one step.

### Kid Meaning

One game step is like one turn in a board game.

### What Happens In One Step?

1. Look at the snake head.
2. Look at the direction.
3. Make a new head position.
4. Check wall crash.
5. Check body crash.
6. Add the new head.
7. If food was eaten, add score and new food.
8. If food was not eaten, remove the tail.

### Snake Connection

This is the heart of the game:

```python
def step_game(game):
    snake = game["snake"]
    head = snake[0]
    dx, dy = game["direction"]
    new_head = (head[0] + dx, head[1] + dy)
```

Kid meaning:

```text
Find the head.
Find the direction.
Make the next head square.
```

### Check Your Brain

If the snake head is `(4, 3)` and direction is `(0, 1)`, what is the new head?

Answer: `(4, 4)`

---

## Lesson 22: Drawing The Final Screen

### Big Idea

Every frame, the game draws everything again.

### Kid Meaning

The screen is like a dry-erase board.

Each moment:

1. Wipe the board.
2. Draw the camera background.
3. Draw the grid.
4. Draw the food.
5. Draw the snake.
6. Draw the score.

### Snake Connection

The project does this:

```python
draw_grid(display)
draw_food(display, game["food"], now)
draw_snake(display, game["snake"], game["direction"])
draw_hud(display, game["score"], len(game["snake"]), game["alive"], hand_seen)
```

Kid meanings:

```text
draw_grid  -> draw the board
draw_food  -> draw the food
draw_snake -> draw the snake
draw_hud   -> draw score and messages
```

### Important

Games look like they are moving because they redraw very quickly.

Like a cartoon.

---

## Lesson 23: Polish Makes The Game Feel Alive

### Big Idea

Small details make a game more fun.

### Kid Meaning

Polish is like decorating a project after it works.

### Project Polish

The game has:

- snake eyes
- fading snake body
- pulsing food
- speed-up after eating food
- game over message
- restart key

### Example: Pulsing Food

```python
pulse = 1 + 0.18 * math.sin(beat * 5)
```

Kid meaning:

```text
Make a number wiggle up and down.
Use that number to make the food grow and shrink a little.
```

Do not worry if the math looks fancy. The idea is:

```text
The food breathes bigger and smaller.
```

### Example: Speed Up

```python
if game["foods_eaten"] % SPEED_UP_EVERY == 0:
    game["tick_interval"] = max(TICK_INTERVAL_MIN, game["tick_interval"] - 0.018)
```

Kid meaning:

```text
Every few foods, make the snake a little faster.
But never make it impossible.
```

---

## Lesson 24: Run The Real Project

### Step 1: Open The Project Folder

Go into the folder:

```bash
cd hand_gesture_snake
```

### Step 2: Install The Needed Packages

If you have not installed the packages yet:

```bash
pip install -r requirements.txt
```

On some computers, use:

```bash
python -m pip install -r requirements.txt
```

Mac may use:

```bash
python3 -m pip install -r requirements.txt
```

### Step 3: Run The Game

Windows:

```bash
python snake.py
```

Mac:

```bash
python3 snake.py
```

### Controls

```text
Move hand left  -> snake turns left
Move hand right -> snake turns right
Move hand up    -> snake turns up
Move hand down  -> snake turns down
R key           -> restart
Q key or Esc    -> quit
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
Make new game
  |
  v
Repeat forever
  |
  +--> Read camera picture
  |
  +--> Ask MediaPipe: do you see a hand?
  |
  +--> If hand is seen, choose direction
  |
  +--> If enough time passed, move snake one step
  |
  +--> If snake hits wall or body, game over
  |
  +--> If snake eats food, grow and add score
  |
  +--> Draw grid, food, snake, and score
  |
  +--> Check keys: Q quit, R restart
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

### Coordinate

An address on the grid, like `(x, y)`.

### Pixel

A tiny dot on the screen.

### Frame

One camera picture.

### Landmark

A hand point found by MediaPipe.

### Collision

A crash or bump.

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
pip install -r requirements.txt
```

### Problem: Camera Does Not Open

Try these:

- Close Zoom, Teams, or other camera apps.
- Give camera permission.
- Restart the program.
- Change `CAMERA_INDEX = 0` to `CAMERA_INDEX = 1` if you have another camera.

### Problem: Snake Does Not Follow Your Hand

Try these:

- Put your hand farther from the center.
- Use a brighter room.
- Keep your hand open.
- Use a plain background.
- Move slowly at first.

### Problem: Game Runs Slowly

Try smaller camera size in `snake.py`:

```python
CAMERA_WIDTH = 960
CAMERA_HEIGHT = 540
```

---

## Mini Experiments

Change only one thing at a time.

### Make The Snake Green

Find:

```python
CYAN = (255, 255, 0)
```

Try:

```python
CYAN = (0, 255, 0)
```

OpenCV uses blue, green, red, so this makes green.

### Make The Game Easier

Find:

```python
TICK_INTERVAL_START = 0.22
```

Try:

```python
TICK_INTERVAL_START = 0.30
```

Bigger time means slower snake.

### Make The Snake Speed Up Less Often

Find:

```python
SPEED_UP_EVERY = 4
```

Try:

```python
SPEED_UP_EVERY = 6
```

Now the snake speeds up after every 6 foods instead of every 4.

### Make Hand Steering Less Sensitive

Find:

```python
DEAD_ZONE = 0.12
```

Try:

```python
DEAD_ZONE = 0.18
```

Bigger dead zone means your hand must move farther before turning.

---

## Build Challenge Path

After the main game works, try these in order.

### Challenge 1: Change The Food Color

Find:

```python
PINK = (190, 80, 255)
```

Try a new color.

### Challenge 2: Change The Score

Can you make each food worth 5 points instead of 10?

Hint: Search for:

```python
game["score"] += 10
```

### Challenge 3: Change The Starting Snake Length

Find:

```python
snake = [(start_x - i, start_y) for i in range(3)]
```

Try:

```python
snake = [(start_x - i, start_y) for i in range(5)]
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
Play one sound when food is eaten.
Play another sound on game over.
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

### After Lesson 7

Ask:

```text
If the snake is at (2, 5) and moves right, where is it next?
```

Good answer:

```text
(3, 5)
```

### After Lesson 8

Ask:

```text
Why is the snake a list?
```

Good answer:

```text
Because the snake has many body squares in order.
```

### After Lesson 14

Ask:

```text
What are the two crashes in Snake?
```

Good answer:

```text
Wall crash and body crash.
```

### After Lesson 20

Ask:

```text
Why do we need a dead zone?
```

Good answer:

```text
So tiny hand shakes do not make the snake turn by accident.
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
functions
dictionaries
coordinates
camera frames
hand landmarks
drawing
```

That is programming: small pieces working together.

Keep building. Run the game. Break it a little. Fix it. Change it. Explain it.
That is how kids become real builders.
