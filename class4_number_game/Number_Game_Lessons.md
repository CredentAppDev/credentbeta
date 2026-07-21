# Magic Number Game Lessons: Class 4 Edition (Graphics Version)

Build your very own **Magic Number Game** — but this time you can SEE it! The
computer secretly picks a number, and you try to guess it. A tall glowing
**thermometer** fills up to your guess and turns **red when you're too high**,
**blue when you're too low**, and bursts into **⭐ stars** when you finally get
it right. Everything happens in a real window that pops up on your screen — not
just words in a black box.

This project is for **Class 4** (beginners, around 9–10 years old). It uses Python
on a normal school computer with **tkinter**, the drawing kit that comes free
inside Python — nothing to install. You start from absolutely zero — no
experience needed. Every single line of code is explained in simple words so you
truly understand it, not just copy it.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Game Connection** — how this fits our Magic Number Game.
- **The Code** — the actual Python to type (it draws something you can see!).
- **What You'll See** — the picture or motion that appears in the window.
- **Line by Line** — every important line explained.
- **Do It in VS Code** — the exact steps to type, save, and run it.
- **Your Turn** — a small task YOU do to practise (this is the most important part!).
- **📸 Show Emrys** — send a screenshot of your window so Emrys can check it.
- **Check Your Brain** — quick questions to make sure it stuck.
- **More Examples** — extra runnable programs that stretch the idea further.
- **Common Mistakes** — the real errors beginners hit, with the exact fix.
- **Level Up 🚀** — a pro-feel challenge for fast finishers.

### Your Workshop Is VS Code 🛠️

All code in this course is typed, saved, and run in **Visual Studio Code
(VS Code)** with the Python extension — the same editor professional
programmers use every day. The rhythm for every piece of code is always:

1. Open your project file in VS Code (or **File → New File**, saved as `name.py`).
2. Type the code in the editor.
3. Save: **Ctrl+S** (Windows) or **Cmd+S** (Mac).
4. Run: press the **▶ Run** button at the top-right.
5. A **window pops up** showing your drawing. Look at it! (When you're done,
   click the window's **X** to close it.)

Because our programs draw pictures, the exciting part is the **window**, not the
terminal. But keep an eye on the terminal too — if something goes wrong, Python
prints a red error message there, and errors are just clues.

You never run code inside Emrys's chat — Emrys is your teacher; VS Code is
your workbench.

### Show Emrys Your Work 📸

After EVERY "Your Turn" task, show Emrys the proof: **take a screenshot of the
window your program drew** and send it to Emrys. Emrys will check it, celebrate
what's right, and help fix anything that isn't. If something errored, paste the
red error message from the terminal too — errors are clues, and Emrys reads them
like a detective. No skipping this step: real coders always show their output.

Teach one lesson at a time. Explain the idea first, then the code, then let
students type it and run it themselves. **Always do "Your Turn" — that is where
the learning happens.** Do not rush; it is better to truly understand one lesson
than to copy five.

**This course takes about 4 months** (roughly two lessons a week). It has three
parts:

- **Part 1 — First Pictures (Lessons 1–8):** open a window, draw shapes and text,
  store things in variables, do maths, and get numbers from the player.
- **Part 2 — Making Choices & Motion (Lessons 9–16):** colours that change with
  `if`, drawing lots of things with loops, random numbers, and functions.
- **Part 3 — Building the Game (Lessons 17–24):** put it all together into the
  full glowing thermometer Magic Number Game.

---

# PART 1 — FIRST PICTURES

## Lesson 1: What Is Code? Opening a Window

### Big Idea
Code is a list of instructions we give the computer, one line at a time — and
those instructions can draw a real window on the screen.

### Kid Meaning
A recipe tells a cook what to do step by step. Code tells the computer what to do
step by step. The computer does EXACTLY what you say — nothing more, nothing less.
Today we tell it: "Open a window and write hello inside it."

### Game Connection
Our whole game lives inside a window with a thermometer in it. Before we can
build the thermometer, we must learn how to make a window appear at all.

### The Code
```python
import tkinter as tk

root = tk.Tk()
root.title("My First Window")
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()

canvas.create_text(200, 200, text="Hello! I am your computer.", fill="white")

root.mainloop()
```

### What You'll See
A black window titled **"My First Window"** pops up, with the white words
**"Hello! I am your computer."** floating right in the middle.

### Line by Line
- `import tkinter as tk` — brings in Python's drawing kit and gives it the short
  nickname `tk` so we type less. Think of it as opening your box of crayons.
- `root = tk.Tk()` — makes the window itself. `root` is the name we'll use to
  talk to that window.
- `root.title("My First Window")` — writes the title at the top of the window.
- `canvas = tk.Canvas(root, width=400, height=400, bg="black")` — puts a black
  drawing sheet, 400 wide and 400 tall, inside the window. `canvas` is our paper.
- `canvas.pack()` — actually places the canvas into the window (without this, the
  paper stays hidden).
- `canvas.create_text(200, 200, text="...", fill="white")` — writes text at the
  spot 200 across and 200 down (the middle), in white.
- `root.mainloop()` — the magic word that keeps the window open and waiting.
  Without it, the window would blink and vanish.

### Do It in VS Code 🛠️
1. **File → New File** → name it `window.py` → save it on your Desktop.
2. Type the code above yourself (don't copy-paste — typing teaches your fingers).
3. Save: **Ctrl+S** (make the white "unsaved" dot on the tab disappear).
4. Press the **▶ Run** button. A black window should pop up!
5. Look at your window. Then close it by clicking the **X**.

### Your Turn
1. Change the message to your own name, like `text="My name is Ama."`.
2. Change `fill="white"` to `fill="yellow"`. Run again — different colour!
3. Change the title to `"Ama's Window"`.
4. BEFORE you run: predict out loud what will be different. Then run. Right?

### 📸 Show Emrys
Take a screenshot of your window with your name in it and **send it to Emrys**.
Say: "Lesson 1 done!" Emrys will give you your first ✅ of the course.

### Check Your Brain
- What does `import tkinter as tk` bring us?
- Which line makes the window actually appear and stay open?
- What do the two numbers in `create_text(200, 200, ...)` mean?
- What does `fill` change?

### More Examples
Try each — predict what you'll see BEFORE you run it:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="navy")
canvas.pack()
canvas.create_text(200, 100, text="Top", fill="white")
canvas.create_text(200, 300, text="Bottom", fill="pink")
root.mainloop()
```

Bigger words — add a font:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()
canvas.create_text(200, 200, text="BIG!", fill="lime", font=("Arial", 40))
root.mainloop()
```

### Common Mistakes
- **Forgetting `root.mainloop()`:** the window flashes and disappears. **Fix:** add
  it as the LAST line.
- **Forgetting `canvas.pack()`:** the window opens but is empty. **Fix:** add
  `canvas.pack()` after making the canvas.
- **Capital letters wrong:** `Import` or `Canvas()` with the wrong case →
  `NameError`. Python is picky — copy the spelling exactly.

### Level Up 🚀
Write THREE lines of text at three different heights (y = 100, 200, 300) in three
different colours. Can you make a tiny poster?

---

## Lesson 2: How to Run Python (and Draw a Shape)

### Big Idea
We type code in a file, save it, and then "run" it to see the window appear.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when things actually happen and the window pops up.

### Game Connection
You will run your game again and again as you build it, checking the window each
time to see your thermometer grow.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="white")
canvas.pack()

canvas.create_rectangle(100, 100, 300, 300, fill="red")

root.mainloop()
```

### What You'll See
A white window with a big **red square** in the middle.

### Line by Line
- `create_rectangle(100, 100, 300, 300, fill="red")` — draws a rectangle. The
  first two numbers `(100, 100)` are the **top-left corner**, the next two
  `(300, 300)` are the **bottom-right corner**. `fill="red"` paints the inside.
- The rest is the same window-and-canvas setup from Lesson 1 — you'll use it at
  the top of every program.

### The Screen Map 🗺️ — where do the numbers point?
Every spot on the canvas has two numbers: **x** (how far ACROSS) and **y** (how
far DOWN). Here is the big surprise that trips up almost everyone:

- The corner **(0, 0) is the TOP-LEFT**, not the middle and not the bottom.
- **x** gets bigger as you go **right** → (like normal).
- **y** gets bigger as you go **DOWN** ↓ — this is BACKWARDS from maths class,
  where up is the big direction! On the screen, **down is the big direction.**

Picture the canvas like reading a book: you start at the top-left and your eyes
travel right and then down. So:

```text
(0,0) ─────────► x gets bigger →
  │  •(100,50)  ← a bit right, near the top
  │
  ▼            •(200,200) ← the middle of a 400×400 canvas
y gets
bigger        •(50,350) ← near the bottom-left
  ↓
```

Remember this and shapes go exactly where you expect. Forget it and your circle
ends up "upside down" from where you pictured it — that's not a bug, it's just
the screen map. (This is also the secret behind the thermometer later: to draw
HIGHER up we use a SMALLER y.)

### Slow Motion 🔬 — writing vs running
There are TWO different moments, and mixing them up confuses every beginner:

- **Writing** = typing the code into the editor. Nothing happens yet.
- **Saving** = Ctrl+S. Your words are safely on the disk. STILL nothing happens.
- **Running** = pressing **▶**. NOW Python reads your file and the window pops up.

The biggest trap: changing the code and running WITHOUT saving — the computer
runs the OLD version and you wonder why nothing changed. Burn this rhythm into
your fingers: **type → Ctrl+S → ▶ → look at the window.** Every time. Forever.

### Do It in VS Code 🛠️
1. **File → New File** → name it `shape.py` → save on your Desktop.
2. Type the code above.
3. **Ctrl+S** — watch the white "unsaved" dot disappear.
4. Press **▶ Run**. Your red square window appears.
5. Change `fill="red"` to `fill="blue"` but DON'T save. Run. Still red? That's
   the save lesson! Now save and run — blue. Save first, always.

### Your Turn
1. Make the square smaller: try `create_rectangle(150, 150, 250, 250, ...)`.
2. Change its colour to `"green"`.
3. Add a second rectangle somewhere else in a different colour.
4. Predict where each shape will land BEFORE you run.

### 📸 Show Emrys
Screenshot your two-shape window and send it to Emrys. Tell Emrys which way you
ran it — the ▶ button. Emrys will confirm your setup is rock solid.

### Check Your Brain
- What are the four numbers in `create_rectangle` for?
- Why must you SAVE before you run?
- What does `fill` do to a shape?

### More Examples
A circle uses `create_oval` with the same four corner numbers:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()
canvas.create_oval(100, 100, 300, 300, fill="orange")
root.mainloop()
```

A straight line goes from one point to another:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="white")
canvas.pack()
canvas.create_line(0, 0, 400, 400, fill="purple", width=5)
root.mainloop()
```

### Common Mistakes
- **Running the wrong file:** make sure the file you edited is the one you ran
  (its name shows on the tab). **Fix:** click the correct tab, then ▶.
- **Corners backwards:** if the second corner is smaller than the first, the shape
  can vanish. **Fix:** first pair = top-left, second pair = bottom-right.

### Level Up 🚀
Draw a simple face: a big circle for the head, two small circles for eyes, and a
line for the mouth. Colours are up to you!

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that remembers a value so we can use it again.

### Kid Meaning
A box with a label. You write `x = 200` and now the box called `x` holds 200.
Whenever you say `x`, the computer looks in the box and uses what's inside.

### Game Connection
Our game must remember lots of things: where the thermometer is, how wide it is,
the secret number. Variables are how the computer remembers.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()

x = 200
y = 200
size = 60

canvas.create_oval(x - size, y - size, x + size, y + size, fill="cyan")

root.mainloop()
```

### What You'll See
A cyan circle in the middle of a black window. Its position and size come from
the boxes `x`, `y`, and `size`.

### Line by Line
- `x = 200` — makes a box named `x` and puts 200 inside. This is the circle's
  left-right centre.
- `y = 200` — the circle's up-down centre.
- `size = 60` — how far the circle reaches from its centre (its radius).
- `create_oval(x - size, y - size, x + size, y + size, ...)` — instead of typing
  numbers, we use the boxes. `x - size` is the left edge, `x + size` the right,
  and so on. Change one box and the whole circle moves or grows.

### Do It in VS Code 🛠️
1. New file `circle.py`. Type the code.
2. Save and run — see the cyan circle.
3. Change `x = 200` to `x = 100`. Save, run. The circle jumped LEFT.
4. Change `size = 60` to `size = 120`. Save, run. It got BIGGER.

### Your Turn
1. Move the circle to the top of the window (make `y` smaller, like 80).
2. Make it tiny (`size = 20`) and then huge (`size = 150`).
3. Change `fill` to your favourite colour.
4. Predict each change before you run it.

### 📸 Show Emrys
Send a screenshot of your circle in a NEW position (not the middle). Tell Emrys
which variable you changed to move it.

### Check Your Brain
- What is a variable?
- Which variable moves the circle up and down?
- Why is `x - size` the left edge of the circle?

### More Examples
Two variables sharing one value:

```python
x = 150
y = x        # y is now also 150
```

Using a variable for colour too:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()
my_color = "magenta"
canvas.create_rectangle(100, 100, 300, 300, fill=my_color)
root.mainloop()
```

### Common Mistakes
- **Using a box before filling it:** `print(score)` before `score = 0` →
  `NameError`. **Fix:** create the box (give it a value) first.
- **Spelling the name differently:** `size` vs `Size` are two different boxes.
  **Fix:** keep names exactly the same everywhere.

### Level Up 🚀
Make TWO circles using variables `x1, y1` and `x2, y2`. Move them so they sit
side by side like a pair of eyes.

---

## Lesson 4: Numbers and Simple Maths

### Big Idea
Python can do maths, and we use maths to figure out where things go on screen.

### Kid Meaning
Python is a super-fast calculator. `+ - * /` mean add, subtract, multiply,
divide. We use them to place shapes exactly where we want.

### Game Connection
The middle of our window is `WIDTH / 2`. The thermometer's mercury height comes
from maths. Getting positions right is all arithmetic.

### The Code
```python
import tkinter as tk

WIDTH = 400
HEIGHT = 400

root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="black")
canvas.pack()

center_x = WIDTH / 2
center_y = HEIGHT / 2

canvas.create_oval(center_x - 50, center_y - 50,
                   center_x + 50, center_y + 50, fill="gold")
canvas.create_text(center_x, center_y, text="Middle!", fill="black")

root.mainloop()
```

### What You'll See
A gold circle sitting EXACTLY in the middle of the window, with the word
"Middle!" on top of it.

### Line by Line
- `WIDTH = 400` and `HEIGHT = 400` — boxes holding the window size. We use them
  everywhere so the maths always fits the window.
- `center_x = WIDTH / 2` — half of 400 is 200, the left-right middle.
- `center_y = HEIGHT / 2` — the up-down middle.
- The shape uses `center_x` and `center_y`, so it's always centred even if we
  change `WIDTH` later.

### Do It in VS Code 🛠️
1. New file `maths.py`. Type the code.
2. Save, run — the gold circle sits dead centre.
3. Change `WIDTH = 400` to `WIDTH = 600`. Save, run. The circle STILL centres,
   because the maths did the work.

### Your Turn
1. Make a circle one-QUARTER of the way across: use `WIDTH / 4` for its x.
2. Try `WIDTH * 3 / 4` for a circle three-quarters across.
3. Print a sum to the terminal to check Python's maths:
   `print(10 + 5, 10 - 5, 10 * 5, 10 / 5)`.

### 📸 Show Emrys
Screenshot a window with a shape placed using maths (like `WIDTH / 4`). Tell
Emrys the maths you used.

### Check Your Brain
- What do `*` and `/` mean?
- What is `WIDTH / 2` when `WIDTH` is 400?
- Why is it smart to use `WIDTH` instead of typing 400 everywhere?

### More Examples
Maths right inside the numbers:

```python
canvas.create_rectangle(10, 10, 10 + 100, 10 + 50, fill="teal")
```

The `%` sign gives the remainder (great for patterns later):

```python
print(17 % 5)   # shows 2, because 17 = 3*5 + 2
```

### Common Mistakes
- **Whole vs decimal:** `400 / 2` gives `200.0` (a decimal). tkinter is fine with
  that. If you need a whole number, use `//`: `400 // 2` gives `200`.
- **Forgetting order:** Python does `*` and `/` before `+` and `-`, just like in
  school. Use brackets to be sure: `(WIDTH + 10) / 2`.

### Level Up 🚀
Draw a shape that is always 50 pixels in from every edge of the window, using
`WIDTH` and `HEIGHT` maths — so it resizes correctly when you change the window
size.

---

## Lesson 5: Making Things Move by Changing a Variable

### Big Idea
If we change a variable a little bit again and again, our shape can MOVE.

### Kid Meaning
Add 5 to `x`, redraw, add 5 again, redraw… and the shape slides across the
screen. That's animation — just fast redrawing.

### Game Connection
When you win, stars and mercury will animate. Movement is the same trick every
time: change a number, redraw, repeat.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()

x = 50
ball = canvas.create_oval(x - 20, 190, x + 20, 230, fill="red")

def move():
    global x
    x = x + 5
    canvas.coords(ball, x - 20, 190, x + 20, 230)
    root.after(30, move)

move()
root.mainloop()
```

### What You'll See
A red ball slides smoothly from the left side across the window.

### Line by Line
- `ball = canvas.create_oval(...)` — we SAVE the shape in a box called `ball` so
  we can move it later.
- `def move():` — makes a reusable machine (a function) named `move`.
- `global x` — tells Python "use the outside box `x`, don't make a new one."
- `x = x + 5` — take what's in `x`, add 5, put it back. The ball's centre shifts
  right by 5.
- `canvas.coords(ball, ...)` — moves the ball to the new position.
- `root.after(30, move)` — "in 30 milliseconds, run `move` again." That repeat is
  what makes it keep sliding.
- `move()` — starts the whole thing off once.

### Do It in VS Code 🛠️
1. New file `move.py`. Type the code carefully (the indenting matters!).
2. Save, run — watch the ball glide.
3. Change `x = x + 5` to `x = x + 2` (slower) or `x = x + 15` (faster).

### Your Turn
1. Make the ball move DOWN instead of across (change the y numbers each time,
   not x).
2. Change the ball's colour and size.
3. Predict: what happens if you add a BIG number like 40 each step?

### 📸 Show Emrys
Screenshot your moving ball (or describe the motion) and tell Emrys which
direction it moves and how fast.

### Check Your Brain
- What does `x = x + 5` do to the box `x`?
- What does `root.after(30, move)` do?
- Why do we save the shape in a box called `ball`?

### More Examples
Counting in the terminal (same "add to a variable" idea, no drawing):

```python
count = 0
count = count + 1
count = count + 1
print(count)   # shows 2
```

### Common Mistakes
- **Forgetting `global x`:** the ball won't move because Python makes a fresh,
  separate `x` inside the function. **Fix:** add `global x` at the top of `move`.
- **Wrong indenting:** everything inside `def move():` must be indented the same.
  **Fix:** use 4 spaces, line them up.

### Level Up 🚀
Make the ball STOP when it reaches the right edge (hint: only call
`root.after(...)` again `if x < 400`).

---

## Lesson 6: Talking to the Player with an Entry Box

### Big Idea
An Entry box lets the player TYPE something, and a Button lets them send it.

### Kid Meaning
In a game you need to ask the player a question. The Entry box is where they
type their answer; the Button is the "send" key that hands it to your code.

### Game Connection
This is HUGE: the player will type their guess into an Entry box and press
**Guess!** to send it. This is how they play our game.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="black")
canvas.pack()

def show_it():
    message = entry.get()
    canvas.delete("all")
    canvas.create_text(200, 150, text=message, fill="lime", font=("Arial", 24))

entry = tk.Entry(root, font=("Arial", 18))
entry.pack()
button = tk.Button(root, text="Show it!", command=show_it)
button.pack()

root.mainloop()
```

### What You'll See
A black window with a typing box and a button. Type anything, press the button,
and your words appear in big green letters on the canvas.

### Line by Line
- `def show_it():` — the machine that runs when the button is pressed.
- `message = entry.get()` — `entry.get()` reads whatever the player typed and
  stores it in the box `message`.
- `canvas.delete("all")` — wipes the canvas clean so old text doesn't pile up.
- `canvas.create_text(...)` — draws the player's words.
- `entry = tk.Entry(root, ...)` — makes the typing box.
- `button = tk.Button(root, text="Show it!", command=show_it)` — makes a button.
  `command=show_it` means "when clicked, run `show_it`." (No brackets after
  `show_it` here — we're naming the machine, not running it yet.)

### Do It in VS Code 🛠️
1. New file `entry.py`. Type the code.
2. Save, run. Type your name, press **Show it!** — your name appears big.
3. Type something new and press again — it replaces the old one (thanks to
   `canvas.delete("all")`).

### Your Turn
1. Change the button text to `"Say it!"`.
2. Change the drawn text colour and font size.
3. Predict: what shows if you press the button with the box EMPTY?

### 📸 Show Emrys
Screenshot your window showing YOUR typed word on the canvas. Tell Emrys what you
typed.

### Check Your Brain
- What does `entry.get()` give you?
- What does `command=show_it` do?
- Why do we call `canvas.delete("all")` before drawing new text?

### More Examples
Two things at once — greet AND draw a circle:

```python
def greet():
    name = entry.get()
    canvas.delete("all")
    canvas.create_text(200, 80, text="Hi " + name + "!", fill="white",
                       font=("Arial", 20))
    canvas.create_oval(150, 120, 250, 220, fill="pink")
```

### Common Mistakes
- **Adding brackets:** `command=show_it()` runs it INSTANTLY (wrong). **Fix:** no
  brackets — `command=show_it`.
- **Text piles up:** forgetting `canvas.delete("all")` stacks new text on old.
  **Fix:** clear before you redraw.

### Level Up 🚀
Make TWO buttons: one that shows the text in red, one that shows it in blue
(hint: two little functions, one per button).

---

## Lesson 7: Words vs Numbers — int() and f-strings

### Big Idea
The Entry box always gives us WORDS. To do maths we must turn words into numbers
with `int()`. And f-strings let us mix words and numbers neatly.

### Kid Meaning
`"42"` (with quotes) is the WORD forty-two — you can't do maths with it. `42`
(no quotes) is the NUMBER. `int("42")` changes the word into the number.

### Game Connection
The player types their guess as words. We must `int()` it into a real number
before we can compare it to the secret number.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="black")
canvas.pack()

def double_it():
    text = entry.get()
    number = int(text)
    answer = number * 2
    canvas.delete("all")
    canvas.create_text(200, 150, text=f"{number} doubled is {answer}!",
                       fill="cyan", font=("Arial", 20))

entry = tk.Entry(root, font=("Arial", 18))
entry.pack()
tk.Button(root, text="Double it!", command=double_it).pack()

root.mainloop()
```

### What You'll See
Type a number, press **Double it!**, and the window shows, e.g., "7 doubled is
14!"

### Line by Line
- `text = entry.get()` — gets the typed WORDS, e.g. `"7"`.
- `number = int(text)` — turns the word `"7"` into the number `7`.
- `answer = number * 2` — real maths now works.
- `f"{number} doubled is {answer}!"` — an f-string. The `f` before the quotes
  lets us drop boxes inside `{ }` and Python fills in their values.

### Do It in VS Code 🛠️
1. New file `double.py`. Type the code.
2. Save, run. Type `7`, press the button — "7 doubled is 14!"
3. Try `50`, then `100`.

### Your Turn
1. Change it to TRIPLE the number (`* 3`) and update the message.
2. Show the number plus 10 instead.
3. Type letters instead of a number and press the button. Read the red error in
   the terminal — that's a clue we'll fix in Lesson 20.

### 📸 Show Emrys
Screenshot your window doubling a number. Tell Emrys what number you typed and
what it showed.

### Check Your Brain
- What is the difference between `"42"` and `42`?
- What does `int(text)` do?
- What does the `f` in `f"..."` let you do?

### More Examples
f-strings mixing several boxes:

```python
name = "Ama"
score = 3
print(f"{name} has {score} points!")   # Ama has 3 points!
```

### Common Mistakes
- **Doing maths on words:** `entry.get() * 2` repeats the WORD ("77") instead of
  doubling. **Fix:** `int(entry.get()) * 2`.
- **Forgetting the `f`:** `"{number} doubled"` prints the braces literally. **Fix:**
  put `f` right before the opening quote.

### Level Up 🚀
Ask for a number and draw a square whose SIZE is that number (bigger number →
bigger square). Use `int()` to get the size.

---

## Lesson 8: Mini-Project — A Greeting Machine

### Big Idea
Put together windows, Entry, buttons, variables, and f-strings into one small
finished program.

### Kid Meaning
This is your first real mini-app: the player types their name and it greets them
in style. You already know every piece — now we assemble them.

### Game Connection
This is a tiny rehearsal for the game: type something, press a button, see the
window react. The Magic Number Game is this same shape, just bigger.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 400, 300

root = tk.Tk()
root.title("Greeting Machine")
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#101030")
canvas.pack()

def greet():
    name = entry.get()
    canvas.delete("all")
    canvas.create_text(WIDTH/2, 100, text=f"Hello, {name}!",
                       fill="gold", font=("Arial", 28, "bold"))
    canvas.create_text(WIDTH/2, 160, text="Welcome to Python!",
                       fill="white", font=("Arial", 16))
    canvas.create_oval(WIDTH/2 - 40, 200, WIDTH/2 + 40, 280, fill="deeppink")

entry = tk.Entry(root, font=("Arial", 18), justify="center")
entry.pack(pady=8)
tk.Button(root, text="Greet me!", font=("Arial", 14), command=greet).pack()

root.mainloop()
```

### What You'll See
Type your name, press **Greet me!**, and the window shows a golden "Hello, [your
name]!", a welcome line, and a pink circle.

### Line by Line
- The setup and `greet` function combine everything from Lessons 1–7.
- `justify="center"` centres the text you type in the box.
- `pady=8` adds a little space above and below the Entry so it looks tidy.
- Notice how `WIDTH/2` keeps everything centred using maths.

### Do It in VS Code 🛠️
1. New file `greeting.py`. Type the whole program.
2. Save, run. Type your name, press the button, admire your greeting!
3. Show a friend and let them type THEIR name.

### Your Turn
1. Change the colours and the welcome message.
2. Add a THIRD line of text (maybe today's day).
3. Add a second shape (a rectangle) somewhere.

### 📸 Show Emrys
Screenshot your finished Greeting Machine with a name in it. Tell Emrys: "Part 1
mini-project done!"

### Check Your Brain
- Which line reads what the player typed?
- How does `f"Hello, {name}!"` build the greeting?
- What does `canvas.delete("all")` prevent?

### More Examples
Make the greeting change colour based on nothing yet — but next Part we'll make
colours change based on the guess. For now, try adding an emoji:

```python
canvas.create_text(WIDTH/2, 240, text="🎉", font=("Arial", 40))
```

### Common Mistakes
- **Widgets not showing:** every widget (Entry, Button) needs `.pack()`. **Fix:**
  add `.pack()` to each.
- **Old greeting stays:** clear with `canvas.delete("all")` at the start of
  `greet`.

### Level Up 🚀
Add a "Clear" button that wipes the canvas back to empty (hint: a tiny function
that just calls `canvas.delete("all")`).

---

# PART 2 — MAKING CHOICES & MOTION

## Lesson 9: Making Decisions with if

### Big Idea
`if` lets the program CHOOSE what to do based on a condition.

### Kid Meaning
"IF it is raining, take an umbrella." The computer checks — is it true? — and
only then does the action. `if` is how programs make choices.

### Game Connection
IF your guess is too big, paint the thermometer red. IF it's too small, paint it
blue. `if` is the heart of hot-and-cold.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="black")
canvas.pack()

def check():
    guess = int(entry.get())
    canvas.delete("all")
    if guess > 50:
        canvas.create_rectangle(50, 50, 350, 250, fill="red")
        canvas.create_text(200, 150, text="Big number!", fill="white")

entry = tk.Entry(root, font=("Arial", 18))
entry.pack()
tk.Button(root, text="Check", command=check).pack()

root.mainloop()
```

### What You'll See
Type a number over 50 and press Check — a red box with "Big number!" appears.
Type a small number — nothing happens (yet — we add that next lesson).

### Line by Line
- `if guess > 50:` — checks: is the guess bigger than 50? The `:` starts the
  "then do this" block.
- The indented lines under `if` ONLY run when the check is true.
- `>` means "greater than." Later we'll use `<` (less than) and `==` (equal to).

### Do It in VS Code 🛠️
1. New file `decide.py`. Type the code.
2. Save, run. Try `80` (red box appears), then `20` (nothing).

### Your Turn
1. Change `> 50` to `> 90` and test.
2. Change the colour and message inside the `if`.
3. Predict which numbers make the box appear.

### 📸 Show Emrys
Screenshot the red box that appears for a big number. Tell Emrys the number you
typed.

### Check Your Brain
- What does `if` do?
- What does `>` mean?
- When do the indented lines under `if` run?

### More Examples
Comparing with less-than:

```python
if guess < 10:
    canvas.create_text(200, 150, text="Tiny!", fill="cyan")
```

### Common Mistakes
- **Forgetting the colon:** `if guess > 50` (no `:`) → `SyntaxError`. **Fix:** add
  the `:`.
- **Not indenting:** the lines under `if` must be indented (4 spaces). **Fix:**
  indent them so Python knows they belong to the `if`.

### Level Up 🚀
Make the box a DIFFERENT colour for numbers over 100 vs numbers over 50 (hint:
two `if` checks).

---

## Lesson 10: if, else, and elif — More Choices

### Big Idea
`if / elif / else` handles several possibilities: this, or that, otherwise this.

### Kid Meaning
"IF too high, say so. ELSE IF too low, say so. ELSE (only one left) you got it!"
Python checks them top to bottom and does the FIRST one that's true.

### Game Connection
This is EXACTLY our game's brain: too high → red, too low → blue, equal → win.
Three outcomes, three branches.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="black")
canvas.pack()

secret = 50

def check():
    guess = int(entry.get())
    canvas.delete("all")
    if guess > secret:
        canvas.create_text(200, 150, text="Too high!", fill="red",
                           font=("Arial", 24))
    elif guess < secret:
        canvas.create_text(200, 150, text="Too low!", fill="cyan",
                           font=("Arial", 24))
    else:
        canvas.create_text(200, 150, text="You got it!", fill="lime",
                           font=("Arial", 24))

entry = tk.Entry(root, font=("Arial", 18))
entry.pack()
tk.Button(root, text="Guess", command=check).pack()

root.mainloop()
```

### What You'll See
The secret is 50. Guess 80 → "Too high!" in red. Guess 20 → "Too low!" in cyan.
Guess 50 → "You got it!" in green. This is basically the whole game already!

### Line by Line
- `secret = 50` — a fixed secret for now (Lesson 14 makes it random).
- `if guess > secret:` — first check. If true, do this and SKIP the rest.
- `elif guess < secret:` — "else if" — only checked if the first was false.
- `else:` — the leftover case (must be equal), so it's a win.

### Do It in VS Code 🛠️
1. New file `three_ways.py`. Type the code.
2. Save, run. Try guesses above, below, and exactly 50.

### Your Turn
1. Change `secret` to a different number and test all three outcomes.
2. Change the win message and colour.
3. Predict what happens if you guess exactly the secret.

### 📸 Show Emrys
Screenshot all three results (three screenshots, or one of the win). Tell Emrys
the secret you used.

### Check Your Brain
- What is the difference between `if` and `elif`?
- When does `else` run?
- Why is exactly one of the three branches always chosen?

### More Examples
A grader with elif chains:

```python
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
```

### Common Mistakes
- **Using many `if`s instead of `elif`:** separate `if`s can all run and stack
  messages. **Fix:** use `elif`/`else` so only one runs.
- **`=` vs `==`:** `if guess = secret` is an error. **Fix:** use `==` to compare.

### Level Up 🚀
Add a fourth branch: if the guess is WAY too high (more than 20 above secret),
say "WAY too high!" (hint: an extra `elif` before the plain "too high").

---

## Lesson 11: True and False (Booleans)

### Big Idea
Every check is either True or False — those two values are called Booleans.

### Kid Meaning
A light switch is on or off. A check is True or False. `guess == secret` is a
question Python answers with True or False.

### Game Connection
"Have they won yet?" is a True/False fact. We can store it in a box like
`won = (guess == secret)` and use it to decide whether to celebrate.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=200, bg="black")
canvas.pack()

secret = 7

def check():
    guess = int(entry.get())
    won = (guess == secret)
    canvas.delete("all")
    if won:
        canvas.create_text(200, 100, text="TRUE — you win!", fill="lime")
    else:
        canvas.create_text(200, 100, text="FALSE — try again", fill="orange")

entry = tk.Entry(root)
entry.pack()
tk.Button(root, text="Check", command=check).pack()

root.mainloop()
```

### What You'll See
Guess 7 → "TRUE — you win!" Any other number → "FALSE — try again."

### Line by Line
- `won = (guess == secret)` — Python answers the question `guess == secret` with
  True or False and stores the answer in `won`.
- `if won:` — since `won` is already True or False, we can use it directly.
- `==` means "is equal to" (two equals signs — one equals sign means "put into a
  box").

### Do It in VS Code 🛠️
1. New file `boolean.py`. Type the code.
2. Save, run. Try the secret and a wrong number.
3. Add `print(won)` inside `check` and watch True/False appear in the terminal.

### Your Turn
1. Change the secret and test.
2. Add another Boolean: `is_big = (guess > 100)` and print it.
3. Predict the True/False result before each guess.

### 📸 Show Emrys
Screenshot the TRUE win message, and paste the True/False lines from your
terminal. Tell Emrys the secret.

### Check Your Brain
- What two values can a Boolean be?
- What is the difference between `=` and `==`?
- What does `won = (guess == secret)` store?

### More Examples
Booleans from comparisons:

```python
print(10 > 3)      # True
print(5 == 5)      # True
print(2 < 1)       # False
```

### Common Mistakes
- **One equals sign to compare:** `if guess = secret` → error. **Fix:** `==`.
- **Quoting True:** `won = "True"` makes a WORD, not a Boolean. **Fix:** `won =
  True` (no quotes).

### Level Up 🚀
Combine two checks with `and`: `if guess > 0 and guess < 100:` to accept only
numbers in range. Show a message when it's outside.

---

## Lesson 12: Repeating with a for Loop (Drawing the Scale)

### Big Idea
A `for` loop repeats an action many times — perfect for drawing rows of marks.

### Kid Meaning
Instead of writing 11 almost-identical lines, a loop says "do this 11 times,
counting as you go." The counter changes each time so each mark lands in a new
spot.

### Game Connection
Our thermometer needs a scale: little marks and numbers from 0 to 100 up the
side. A loop draws them all with just a few lines.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=200, height=440, bg="black")
canvas.pack()

for n in range(0, 101, 10):
    y = 420 - n * 4          # 0 at bottom, 100 near the top
    canvas.create_line(60, y, 80, y, fill="white")
    canvas.create_text(110, y, text=str(n), fill="white")

root.mainloop()
```

### What You'll See
A neat vertical scale: short white marks with the numbers 0, 10, 20 … 100 climbing
up the window.

### Line by Line
- `for n in range(0, 101, 10):` — count `n` from 0 up to (not including) 101, in
  steps of 10 → 0, 10, 20 … 100.
- `y = 420 - n * 4` — turns the number into a height. Bigger `n` → smaller `y` →
  higher up the window.
- `create_line` and `create_text` — draw one mark and its number. The loop repeats
  them for every `n`.
- `str(n)` — turns the number into text so `create_text` can show it.

### Do It in VS Code 🛠️
1. New file `scale.py`. Type the code.
2. Save, run — see the whole scale drawn by ONE loop.
3. Change the step to `range(0, 101, 5)` for twice as many marks.

### Your Turn
1. Make the marks longer (change `80` to `100`).
2. Colour the numbers yellow.
3. Predict how many marks `range(0, 101, 20)` draws.

### 📸 Show Emrys
Screenshot your scale. Tell Emrys how many marks it drew and the step you used.

### Check Your Brain
- What does a `for` loop do?
- What three numbers go inside `range(start, stop, step)`?
- Why does `str(n)` matter for `create_text`?

### More Examples
A row of coloured dots:

```python
colors = ["red", "orange", "yellow", "green", "blue"]
for i in range(5):
    canvas.create_oval(20 + i*40, 20, 50 + i*40, 50, fill=colors[i])
```

### Common Mistakes
- **`range(0, 100, 10)` misses 100:** the stop number is NOT included. **Fix:** use
  `range(0, 101, 10)` to include 100.
- **Forgetting the colon** after `for ...`. **Fix:** add `:` and indent the body.

### Level Up 🚀
Draw 20 stars scattered up the window using a loop and different heights. (Peek
ahead: Lesson 14 will make their positions random!)

---

## Lesson 13: Buttons Instead of Loops — the Event Model

### Big Idea
In a window app, we don't loop-and-wait for the player. We let BUTTON CLICKS run
our code, again and again.

### Kid Meaning
In the terminal you'd write `while True: ask again`. But in a window that would
FREEZE everything. Instead, each button click is one turn. The player controls
the pace by clicking.

### Game Connection
"Keep guessing" in our game is just "let them press the Guess button as many
times as they like." Every click checks their newest guess. No while-loop needed.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=200, bg="black")
canvas.pack()

clicks = 0

def press():
    global clicks
    clicks = clicks + 1
    canvas.delete("all")
    canvas.create_text(200, 100, text=f"You clicked {clicks} times",
                       fill="lime", font=("Arial", 20))

tk.Button(root, text="Press me", command=press).pack()

root.mainloop()
```

### What You'll See
Each time you click **Press me**, the count goes up: "You clicked 1 times", "2
times", "3 times"… The window never freezes because it just waits for your next
click.

### Line by Line
- `clicks = 0` — memory that survives between clicks (it lives OUTSIDE the
  function).
- `global clicks` — lets the function change that outside box.
- `clicks = clicks + 1` — one more click each press.
- The window sits patiently between clicks — that waiting IS the loop, handled by
  `mainloop()` for us.

### Do It in VS Code 🛠️
1. New file `clicker.py`. Type the code.
2. Save, run. Click many times and watch the number climb.

### Your Turn
1. Add 5 per click instead of 1.
2. Show a different message when `clicks` reaches 10 (use an `if`).
3. Predict the count after 7 clicks.

### 📸 Show Emrys
Screenshot your counter after several clicks. Tell Emrys how many times you
clicked.

### Check Your Brain
- Why don't we use a `while True` loop to keep asking in a window?
- Where must `clicks` live so it remembers between clicks?
- What does each button click do?

### More Examples
Two buttons, one counter up, one down:

```python
def up():
    global n
    n = n + 1
    show()
def down():
    global n
    n = n - 1
    show()
```

### Common Mistakes
- **Putting the count inside the function:** `def press(): clicks = 0` resets to 0
  every time. **Fix:** define `clicks = 0` OUTSIDE and use `global`.
- **A `while True` loop in a window app:** it freezes the window. **Fix:** use
  button clicks (the event model).

### Level Up 🚀
Add a "Reset" button that sets `clicks` back to 0 and redraws.

---

## Lesson 14: Random Numbers

### Big Idea
`random` lets the computer pick a surprise number we can't predict.

### Kid Meaning
Like rolling a dice — you don't know what you'll get. `random.randint(1, 100)`
rolls a number from 1 to 100.

### Game Connection
This is the SECRET of the Magic Number Game: the computer picks a random secret
number each game so it's different every time.

### The Code
```python
import tkinter as tk
import random

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=200, bg="black")
canvas.pack()

def roll():
    number = random.randint(1, 100)
    canvas.delete("all")
    canvas.create_text(200, 100, text=str(number), fill="gold",
                       font=("Arial", 60, "bold"))

tk.Button(root, text="Roll!", command=roll).pack()

root.mainloop()
```

### What You'll See
Press **Roll!** and a big random number from 1 to 100 flashes up — a new surprise
each click.

### Line by Line
- `import random` — brings in Python's dice kit.
- `random.randint(1, 100)` — picks a whole number from 1 to 100 (both ends
  included).
- Each click calls `roll` again, so you get a fresh number every time.

### Do It in VS Code 🛠️
1. New file `dice.py`. Type the code.
2. Save, run. Click Roll a bunch — different numbers each time.
3. Change the range to `random.randint(1, 6)` for a real dice.

### Your Turn
1. Make it roll 1 to 10.
2. Pick a random COLOUR too: `random.choice(["red","lime","cyan","gold"])`.
3. Predict: can `randint(1, 100)` ever give 100? (Yes!)

### 📸 Show Emrys
Screenshot a random roll. Tell Emrys the range you used.

### Check Your Brain
- What does `random.randint(1, 100)` do?
- Why does the number change each click?
- What does `random.choice([...])` pick from?

### More Examples
A random position for a star:

```python
x = random.randint(0, 400)
y = random.randint(0, 400)
canvas.create_text(x, y, text="⭐")
```

### Common Mistakes
- **Forgetting `import random`:** `NameError: name 'random' is not defined`. **Fix:**
  add the import at the top.
- **Expecting 0:** `randint(1, 100)` never gives 0. **Fix:** use `randint(0, 100)`
  if you want 0 possible.

### Level Up 🚀
Roll a random number AND draw a circle whose size is that number, so bigger rolls
draw bigger circles.

---

## Lesson 15: Functions — Reusable Machines

### Big Idea
A function is a named machine: define it once, then run it whenever you like.

### Kid Meaning
A blender is a machine — you don't rebuild it each time, you just press the
button. A function is code you name once and reuse by "pressing its button"
(calling it).

### Game Connection
We'll make machines like `draw_thermometer()` and `celebrate()` and call them
whenever we need them — instead of copying the same drawing code over and over.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()

def draw_star_burst():
    canvas.delete("all")
    canvas.create_text(200, 200, text="⭐⭐⭐", font=("Arial", 40))
    canvas.create_text(200, 260, text="Winner!", fill="lime",
                       font=("Arial", 24))

tk.Button(root, text="Celebrate!", command=draw_star_burst).pack()

root.mainloop()
```

### What You'll See
Press **Celebrate!** and stars plus "Winner!" appear. The machine `draw_star_burst`
does the work every time it's called.

### Line by Line
- `def draw_star_burst():` — defines the machine. Nothing happens yet — we're just
  building it.
- The indented lines are what the machine DOES when called.
- `command=draw_star_burst` — the button "presses the machine's button" on click.

### Do It in VS Code 🛠️
1. New file `machine.py`. Type the code.
2. Save, run. Click Celebrate — the burst appears.
3. Call the machine yourself at the bottom before `mainloop()`:
   `draw_star_burst()` — now it also runs once at startup.

### Your Turn
1. Add more to the machine (a coloured rectangle behind the stars).
2. Make a SECOND machine `clear_all()` that wipes the canvas, and a button for it.
3. Predict what happens if you call `draw_star_burst()` twice.

### 📸 Show Emrys
Screenshot your celebration. Tell Emrys the name of your function.

### Check Your Brain
- What does `def` do?
- What is the difference between DEFINING a function and CALLING it?
- Why are functions better than copying the same code twice?

### More Examples
A function you call by name:

```python
def hello():
    print("Hi there!")

hello()   # runs it
hello()   # runs it again
```

### Common Mistakes
- **Defining but never calling:** the machine exists but nothing runs it. **Fix:**
  call it (`draw_star_burst()`) or wire it to a button.
- **Wrong indenting inside `def`:** lines must be indented under it. **Fix:** 4
  spaces.

### Level Up 🚀
Make a `draw_face()` function and call it from two different buttons that draw the
face in two different spots (peek: parameters in Lesson 16 make this cleaner!).

---

## Lesson 16: Functions That Take Information (Parameters)

### Big Idea
Parameters let us hand information INTO a function so it can do different things.

### Kid Meaning
A vending machine does different things depending on which button you press. A
parameter is the "which button" — you give the function a value and it uses it.

### Game Connection
Our `draw_thermometer(level, color)` will take how HIGH to fill and what COLOUR
to use — one machine that draws red-too-high or blue-too-low depending on what we
pass it.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=200, height=440, bg="black")
canvas.pack()

def draw_bar(level, color):
    canvas.delete("all")
    top = 420 - level * 4          # higher level → taller bar
    canvas.create_rectangle(70, top, 130, 420, fill=color)
    canvas.create_text(100, 30, text=str(level), fill="white",
                       font=("Arial", 20))

draw_bar(30, "cyan")

root.mainloop()
```

### What You'll See
A cyan bar filled to level 30, with "30" written at the top. Change the call to
`draw_bar(80, "red")` and it fills higher in red.

### Line by Line
- `def draw_bar(level, color):` — `level` and `color` are parameters — empty
  boxes waiting to be filled when we call the function.
- Inside, we USE `level` and `color` like normal variables.
- `draw_bar(30, "cyan")` — calls the machine and fills `level` with 30 and
  `color` with "cyan".

### Do It in VS Code 🛠️
1. New file `param.py`. Type the code.
2. Save, run — cyan bar to 30.
3. Change the call to `draw_bar(90, "red")`. Save, run — tall red bar.
4. Add a second call `draw_bar(10, "gold")` and see which one wins (the last one,
   because we `delete("all")` first!).

### Your Turn
1. Call `draw_bar` with three different levels and colours (one at a time).
2. Add a THIRD parameter for the bar's width.
3. Predict the bar height for `draw_bar(50, ...)`.

### 📸 Show Emrys
Screenshot a red bar filled high and a blue bar filled low (two shots). Tell
Emrys the levels you passed.

### Check Your Brain
- What is a parameter?
- How do the values get INTO the parameters?
- Why is one `draw_bar` better than writing separate red-bar and blue-bar code?

### More Examples
A greet function with a parameter:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Ama")
greet("Kofi")
```

### Common Mistakes
- **Wrong number of values:** `draw_bar(30)` when it expects two → error. **Fix:**
  pass both, e.g. `draw_bar(30, "cyan")`.
- **Order matters:** `draw_bar("red", 30)` mixes them up. **Fix:** level first,
  colour second — match the `def` order.

### Level Up 🚀
Write `draw_bar(level, color)` so that if `level` is over 100 it CAPS at 100 (hint:
an `if level > 100:` at the top of the function).

---

# PART 3 — BUILDING THE GAME

## Lesson 17: The Secret Number and the First Guess

### Big Idea
Start the real game: draw the thermometer tube, pick a secret, and read the
player's first guess.

### Kid Meaning
Now we glue our pieces together. The window has a thermometer. The computer hides
a secret. The player types a guess and we fill the mercury to it.

### Game Connection
This IS the game's opening — everything from here builds the finished Magic
Number Game.

### The Code
```python
import tkinter as tk
import random

WIDTH, HEIGHT = 320, 560
root = tk.Tk()
root.title("Magic Number Game")
root.resizable(False, False)          # keep the window its proper size so the buttons always show
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0b1020")
canvas.pack()

secret = random.randint(1, 100)

def draw_tube():
    canvas.create_rectangle(120, 80, 200, 480, outline="white", width=3)

def fill_mercury(level, color):
    canvas.delete("mercury")
    top = 480 - (480 - 80) * level / 100
    canvas.create_rectangle(122, top, 198, 478, fill=color,
                            outline="", tags="mercury")

def guess():
    number = int(entry.get())
    fill_mercury(number, "cyan")

draw_tube()
entry = tk.Entry(root, font=("Arial", 18), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Guess!", command=guess).pack()

root.mainloop()
```

### What You'll See
A thermometer tube. Type a number and press **Guess!** — the mercury fills up to
that level in cyan.

### Line by Line
- `secret = random.randint(1, 100)` — the hidden number for this game.
- `draw_tube()` — draws the empty glass tube once.
- `fill_mercury(level, color)` — our parameter function from Lesson 16: fills the
  tube to `level`. The maths turns 0–100 into a screen height.
- `tags="mercury"` + `canvas.delete("mercury")` — a label so we can erase ONLY the
  old mercury, not the tube.
- `guess()` reads the Entry, turns it into a number, and fills the mercury.

### Do It in VS Code 🛠️
1. Create your real project file `number_game.py`. Type the code.
2. Save, run. Try guesses — watch the mercury rise to each one.

### Your Turn
1. Add `print(secret)` inside `guess` so you can peek while testing.
2. Change the mercury colour.
3. Predict the mercury height for a guess of 50 (half way!).

### 📸 Show Emrys
Screenshot your thermometer filled to a guess. Tell Emrys what you typed.

### Check Your Brain
- What does `secret = random.randint(1, 100)` do?
- Why do we use `tags="mercury"` and `delete("mercury")`?
- Which function fills the tube, and what two things does it need?

### More Examples
Peek at the secret on screen while building (remove later):

```python
canvas.create_text(WIDTH/2, 520, text=f"(secret is {secret})", fill="gray")
```

### Common Mistakes
- **Erasing the tube too:** `canvas.delete("all")` wipes the tube. **Fix:** delete
  only `"mercury"`.
- **Mercury upside down:** if it fills from the top, check the `top` maths. **Fix:**
  bigger level → smaller `top` value.

### Level Up 🚀
Make the tube have a round "bulb" at the bottom using `create_oval` under the
rectangle, like a real thermometer.

---

## Lesson 18: Keep Guessing — Hot or Cold Colours

### Big Idea
Each Guess click compares to the secret and paints red (too high) or blue (too
low) or green (win).

### Kid Meaning
This is the hot-and-cold heart of the game: the colour tells you which way to go,
and you keep clicking Guess until you win.

### Game Connection
Now the game is truly playable — guess after guess, the thermometer guides you
toward the secret.

### The Code
```python
def guess():
    number = int(entry.get())
    if number > secret:
        fill_mercury(number, "red")
        show("Too high!", "red")
    elif number < secret:
        fill_mercury(number, "deepskyblue")
        show("Too low!", "deepskyblue")
    else:
        fill_mercury(number, "lime")
        show("YOU GOT IT!", "lime")
    entry.delete(0, tk.END)

def show(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH/2, 40, text=text, fill=color,
                       font=("Arial", 22, "bold"), tags="msg")
```

### What You'll See
Guess too high → red mercury + "Too high!". Too low → blue + "Too low!". Correct →
green + "YOU GOT IT!". The Entry clears itself so you can type the next guess.

### Line by Line
- The `if / elif / else` from Lesson 10 now drives the colours.
- `show(text, color)` — a small parameter machine that draws the message at the
  top, erasing the old one via the `"msg"` tag.
- `entry.delete(0, tk.END)` — clears the typing box from start (0) to end so it's
  ready for the next guess.

### Do It in VS Code 🛠️
1. In `number_game.py`, replace your old `guess` with this and add `show`.
2. Save, run. Play until you win — watch the colours guide you.

### Your Turn
1. Change the three colours to your own hot/cold palette.
2. Change the win message.
3. Predict the colour for a guess just 1 above the secret.

### 📸 Show Emrys
Screenshot a "Too high!" (red) and a win (green). Tell Emrys how many guesses your
win took.

### Check Your Brain
- Which branch runs when the guess equals the secret?
- What does `entry.delete(0, tk.END)` do?
- Why give the message its own `"msg"` tag?

### More Examples
Add an arrow hint to the message:

```python
show("Too high! ⬇", "red")
show("Too low! ⬆", "deepskyblue")
```

### Common Mistakes
- **Entry not clearing:** you retype over the old guess. **Fix:** add
  `entry.delete(0, tk.END)` at the end of `guess`.
- **Messages stacking:** forgetting the `"msg"` delete. **Fix:** delete `"msg"`
  before drawing the new one.

### Level Up 🚀
Make the RED get darker the closer you are when too high (hint: use different
colour words for `distance` under 10 vs over 10 — full version in Lesson 23).

---

## Lesson 19: Counting the Guesses

### Big Idea
Keep a `tries` variable that goes up by one each guess and show it on screen.

### Kid Meaning
Good games keep score. We count how many guesses it took, so the player can try
to beat their record.

### Game Connection
"You won in 6 tries!" is way more fun than just "You won." Counting adds the
challenge.

### The Code
```python
tries = 0

def guess():
    global tries
    number = int(entry.get())
    tries = tries + 1
    if number > secret:
        fill_mercury(number, "red")
        show("Too high!", "red")
    elif number < secret:
        fill_mercury(number, "deepskyblue")
        show("Too low!", "deepskyblue")
    else:
        fill_mercury(number, "lime")
        show(f"WON in {tries} tries!", "lime")
    canvas.delete("count")
    canvas.create_text(WIDTH/2, 520, text=f"Guesses: {tries}",
                       fill="white", tags="count")
    entry.delete(0, tk.END)
```

### What You'll See
A "Guesses: 3" counter at the bottom climbs with every guess, and the win message
now brags "WON in 6 tries!".

### Line by Line
- `tries = 0` — starts the count OUTSIDE the function so it remembers (Lesson 13's
  lesson!).
- `global tries` — lets `guess` change it.
- `tries = tries + 1` — one more guess.
- The `"count"` text is redrawn each guess with its own tag.

### Do It in VS Code 🛠️
1. Add `tries = 0` near the top and update `guess` as shown.
2. Save, run. Play and watch the counter climb; win to see your total.

### Your Turn
1. Show "Great!" if they win in under 8 tries (use an `if tries < 8:`).
2. Change the counter's colour and position.
3. Predict the counter after 4 guesses.

### 📸 Show Emrys
Screenshot a win showing your try count. Tell Emrys your best score so far.

### Check Your Brain
- Where must `tries` be defined so it remembers?
- What does `global tries` allow?
- What does `tries = tries + 1` do each guess?

### More Examples
A simple best-score check:

```python
if tries < best:
    best = tries
    print("New record!")
```

### Common Mistakes
- **Resetting inside the function:** `tries = 0` inside `guess` never counts up.
  **Fix:** define it outside and use `global`.
- **Counting wrong guesses only:** put `tries = tries + 1` at the top so EVERY
  guess counts.

### Level Up 🚀
Track the FEWEST tries across games in a `best` variable and show "Best: 4" on
screen.

---

## Lesson 20: Being Kind to Wrong Typing

### Big Idea
`try / except` catches mistakes (like typing letters) so the game doesn't crash.

### Kid Meaning
If the player types "hello" instead of a number, `int()` breaks. We politely
catch that and ask again, instead of the red-error crash.

### Game Connection
Real players mistype. A good game gently says "please type a number" and keeps
going — never crashes.

### The Code
```python
def guess():
    global tries
    text = entry.get()
    try:
        number = int(text)
    except ValueError:
        show("Type a number 1-100!", "orange")
        return
    if number < 1 or number > 100:
        show("Only 1 to 100!", "orange")
        return
    tries = tries + 1
    # ... the hot/cold checks from Lesson 19 go here ...
    entry.delete(0, tk.END)
```

### What You'll See
Type "abc" → an orange "Type a number 1-100!" instead of a crash. Type 500 → an
orange "Only 1 to 100!". Good numbers play as normal.

### Line by Line
- `try:` — "attempt this risky line."
- `number = int(text)` — the risky bit: it breaks if `text` isn't a number.
- `except ValueError:` — "if that broke, do this instead" — show a kind message.
- `return` — leaves the function early so a bad guess doesn't count or continue.
- `if number < 1 or number > 100:` — also block out-of-range numbers. `or` means
  "either one true."

### Do It in VS Code 🛠️
1. Wrap your `int()` in `try/except` as shown and add the range check.
2. Save, run. Type letters, then 999 — both handled kindly.

### Your Turn
1. Change the two orange messages to your own friendly wording.
2. Test empty input (press Guess with nothing typed).
3. Predict what `return` does after a bad guess (it stops early — count doesn't go
   up).

### 📸 Show Emrys
Screenshot the orange "type a number" message. Tell Emrys what you typed to
trigger it.

### Check Your Brain
- What does `try/except` protect against?
- What does `return` do here?
- What does `or` mean in the range check?

### More Examples
Catching a different mistake:

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Can't divide by zero!")
```

### Common Mistakes
- **No `return` after the message:** the code keeps going with a broken number.
  **Fix:** `return` right after showing the error.
- **Catching everything with bare `except`:** be specific — `except ValueError`.

### Level Up 🚀
Give three chances of "hints" for repeated bad typing (count bad tries and change
the message on the third).

---

## Lesson 21: A Friendly Welcome and Rules

### Big Idea
Draw a title screen so players know what to do before they start.

### Kid Meaning
Every good game greets you and explains the rules. We draw a welcome message and
simple instructions on the canvas.

### Game Connection
First impressions matter. A clear "Guess 1 to 100! Red = too high, Blue = too
low" makes the game friendly for anyone.

### The Code
```python
def show_welcome():
    canvas.delete("msg")
    canvas.create_text(WIDTH/2, 30, text="Magic Number Game",
                       fill="gold", font=("Arial", 20, "bold"), tags="msg")
    canvas.create_text(WIDTH/2, 55, text="Guess 1 to 100!",
                       fill="white", font=("Arial", 13), tags="msg")
    canvas.create_text(WIDTH/2, 72, text="Red = too high · Blue = too low",
                       fill="#88ccff", font=("Arial", 11), tags="msg")

draw_tube()
show_welcome()
```

### What You'll See
Before the first guess, the window shows the title, "Guess 1 to 100!", and the
colour rules — so any new player understands instantly.

### Line by Line
- `show_welcome()` — a machine that draws three lines of intro text, all tagged
  `"msg"` so the first guess replaces them.
- We call it right after `draw_tube()` so it's there at startup.

### Do It in VS Code 🛠️
1. Add `show_welcome` and call it at startup.
2. Save, run. The welcome greets you; your first guess replaces it.

### Your Turn
1. Add a fourth line with your name as "Game by ___".
2. Change the title colour.
3. Predict what covers the welcome text when you guess (the `show` message, same
   tag).

### 📸 Show Emrys
Screenshot your welcome screen. Tell Emrys what your title says.

### Check Your Brain
- Why give the welcome text the `"msg"` tag?
- When does the welcome disappear?
- Why is a rules screen helpful?

### More Examples
Center-anchored multi-line text in one call:

```python
canvas.create_text(WIDTH/2, 60, text="Line one\nLine two", fill="white",
                   justify="center")
```

### Common Mistakes
- **Welcome never leaves:** if it uses a different tag than `show`, it stays
  forever. **Fix:** use the same `"msg"` tag so guesses replace it.
- **Text off-screen:** keep y values small (near the top). **Fix:** use y under 80.

### Level Up 🚀
Add a big "START" button that hides the welcome and shows the first "Guess 1 to
100!" prompt.

---

## Lesson 22: Play Again? — A New Game Button

### Big Idea
A "New Game" button resets the secret, the tries, and the drawing.

### Kid Meaning
When the game ends, players want another go. One button gives them a brand-new
secret and a clean thermometer.

### Game Connection
This turns one-and-done into endless replay — the mark of a real game.

### The Code
```python
def new_game():
    global secret, tries
    secret = random.randint(1, 100)
    tries = 0
    canvas.delete("mercury")
    canvas.delete("count")
    canvas.delete("stars")
    show_welcome()
    entry.delete(0, tk.END)

tk.Button(root, text="New Game", command=new_game).pack(pady=4)
```

### What You'll See
Press **New Game** and everything resets: fresh secret, mercury gone, counter at
zero, welcome back on screen — ready to play again.

### Line by Line
- `global secret, tries` — we're changing BOTH outside boxes.
- `secret = random.randint(1, 100)` — a new hidden number.
- `tries = 0` — reset the count.
- The `delete` lines clear mercury, counter, and any win stars — but NOT the tube.
- `show_welcome()` — bring the intro back.

### Do It in VS Code 🛠️
1. Add `new_game` and its button below the Guess button.
2. Save, run. Win a game, press New Game, and play a totally fresh round.

### Your Turn
1. Make New Game also show a short "New round!" flash.
2. Change the button's text to "Play Again".
3. Predict what stays on screen after New Game (the tube).

### 📸 Show Emrys
Screenshot the game right after pressing New Game (clean tube + welcome). Tell
Emrys it reset correctly.

### Check Your Brain
- Which variables does New Game reset?
- Why must we NOT delete the tube?
- What does `global secret, tries` allow?

### More Examples
Reset several values in one function:

```python
def reset():
    global score, lives
    score = 0
    lives = 3
```

### Common Mistakes
- **Forgetting to reset `tries`:** the new game starts with the old count. **Fix:**
  set `tries = 0` in `new_game`.
- **Deleting the tube:** don't `delete("all")` — clear items by their tags.

### Level Up 🚀
Add a difficulty: an "Easy" button sets the range to 1–20 and a "Hard" button to
1–100 (store the range in variables).

---

## Lesson 23: Making It Cooler — Hints, Glow, and Encouragement

### Big Idea
Use the DISTANCE from the secret to give warmer/colder hints and a celebration.

### Kid Meaning
"You're getting warmer!" is more fun than just "too high." We measure how close
the guess is and cheer the player on, then burst stars when they win.

### Game Connection
This is the polish that makes the game delightful — glowing hints and a
star-shower victory.

### The Code
```python
def guess():
    global tries
    text = entry.get()
    try:
        number = int(text)
    except ValueError:
        show("Type a number 1-100!", "orange"); return
    if number < 1 or number > 100:
        show("Only 1 to 100!", "orange"); return
    tries = tries + 1
    distance = abs(secret - number)
    if number == secret:
        fill_mercury(number, "lime")
        show(f"WON in {tries} tries!", "lime")
        celebrate()
    elif number > secret:
        color = "red" if distance < 10 else "#ff9999"
        fill_mercury(number, color)
        show("Too high — " + warmth(distance), color)
    else:
        color = "deepskyblue" if distance < 10 else "#a9d6ff"
        fill_mercury(number, color)
        show("Too low — " + warmth(distance), "#66aaff")
    entry.delete(0, tk.END)

def warmth(distance):
    if distance < 5:
        return "🔥 boiling!"
    elif distance < 15:
        return "warm"
    else:
        return "cold"

def celebrate():
    for i in range(30):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        canvas.create_text(x, y, text="⭐", font=("Arial", 16), tags="stars")
```

### What You'll See
Close guesses glow bright and say "🔥 boiling!"; far ones say "cold". When you win,
30 stars scatter across the window in celebration.

### Line by Line
- `distance = abs(secret - number)` — `abs` makes the difference positive so it's
  a true "how far away."
- `color = "red" if distance < 10 else "#ff9999"` — a one-line choice: bright red
  when close, soft red when far.
- `warmth(distance)` — a function that returns a hint WORD based on distance
  (functions can hand back a value with `return`).
- `celebrate()` — a `for` loop (Lesson 12) that scatters 30 random stars
  (Lesson 14).

### Do It in VS Code 🛠️
1. Update `guess`, and add `warmth` and `celebrate`.
2. Save, run. Feel the hints get hotter as you close in; win to see the stars.

### Your Turn
1. Add a "🥶 freezing" level for distances over 40.
2. Make `celebrate` draw 60 stars.
3. Predict the warmth word for a guess 3 away from the secret.

### 📸 Show Emrys
Screenshot a "🔥 boiling!" hint and your star-shower win. Tell Emrys your winning
try count.

### Check Your Brain
- What does `abs()` do and why do we need it?
- How does `warmth` hand a word back to `guess`?
- Which earlier lessons power `celebrate` (loops + random)?

### More Examples
Return a value from a function:

```python
def square(n):
    return n * n

print(square(5))   # 25
```

### Common Mistakes
- **Forgetting `abs`:** distance goes negative when the guess is low, breaking the
  hints. **Fix:** wrap it in `abs()`.
- **Stars never clear:** they pile up across games. **Fix:** `canvas.delete("stars")`
  in `new_game` (Lesson 22).

### Level Up 🚀
Make the stars ANIMATE (fall or twinkle) using `root.after` like the moving ball
in Lesson 5.

---

## Lesson 24: Showcase and Reflection

### Big Idea
Assemble the complete Magic Number Game and show it off — you built a real
graphical game!

### Kid Meaning
Every piece you learned — windows, shapes, variables, maths, input, if/elif,
loops, random, functions, and try/except — comes together into one game you can
play and share.

### Game Connection
This is the finished product. Read it, run it, and be proud.

### The Code
```python
import tkinter as tk
import random

WIDTH, HEIGHT = 320, 620
root = tk.Tk()
root.title("Magic Number Game")
root.resizable(False, False)          # keep the window its proper size so the buttons always show
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0b1020")
canvas.pack()

secret = random.randint(1, 100)
tries = 0

def draw_tube():
    canvas.create_rectangle(120, 100, 200, 500, outline="white", width=3)
    for n in range(0, 101, 10):
        y = 500 - (500 - 100) * n / 100
        canvas.create_line(200, y, 214, y, fill="white")
        canvas.create_text(232, y, text=str(n), fill="white",
                           font=("Arial", 9))

def fill_mercury(level, color):
    canvas.delete("mercury")
    top = 500 - (500 - 100) * level / 100
    canvas.create_rectangle(122, top, 198, 498, fill=color, outline="",
                            tags="mercury")

def show(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH/2, 55, text=text, fill=color,
                       font=("Arial", 20, "bold"), tags="msg")

def show_welcome():
    canvas.delete("msg")
    canvas.create_text(WIDTH/2, 30, text="Magic Number Game", fill="gold",
                       font=("Arial", 18, "bold"), tags="msg")
    canvas.create_text(WIDTH/2, 55, text="Guess 1 to 100!", fill="white",
                       font=("Arial", 13), tags="msg")

def warmth(distance):
    if distance < 5:
        return "🔥 boiling!"
    elif distance < 15:
        return "warm"
    else:
        return "cold"

def celebrate():
    for i in range(30):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        canvas.create_text(x, y, text="⭐", font=("Arial", 16), tags="stars")

def update_count():
    canvas.delete("count")
    canvas.create_text(WIDTH/2, 540, text=f"Guesses: {tries}", fill="white",
                       tags="count")

def guess():
    global tries
    text = entry.get()
    try:
        number = int(text)
    except ValueError:
        show("Type a number 1-100!", "orange"); return
    if number < 1 or number > 100:
        show("Only 1 to 100!", "orange"); return
    tries = tries + 1
    distance = abs(secret - number)
    if number == secret:
        fill_mercury(number, "lime")
        show(f"WON in {tries} tries!", "lime")
        celebrate()
    elif number > secret:
        color = "red" if distance < 10 else "#ff9999"
        fill_mercury(number, color)
        show("Too high — " + warmth(distance), color)
    else:
        color = "deepskyblue" if distance < 10 else "#a9d6ff"
        fill_mercury(number, color)
        show("Too low — " + warmth(distance), "#66aaff")
    update_count()
    entry.delete(0, tk.END)

def new_game():
    global secret, tries
    secret = random.randint(1, 100)
    tries = 0
    canvas.delete("mercury"); canvas.delete("count"); canvas.delete("stars")
    show_welcome()
    entry.delete(0, tk.END)

draw_tube()
show_welcome()
entry = tk.Entry(root, font=("Arial", 18), justify="center")
entry.pack(pady=6)
entry.bind("<Return>", lambda event: guess())   # pressing Enter guesses too
entry.focus()                                    # cursor starts in the box, ready to type
tk.Button(root, text="Guess!", font=("Arial", 13), command=guess).pack()
tk.Button(root, text="New Game", command=new_game).pack(pady=4)

root.mainloop()
```

### What You'll See
The full game: a scaled thermometer, hot/cold colours and warmth hints, a live
guess counter, star-shower wins, kind handling of typos, and a New Game button.

### Line by Line
- Every function is one you built across the course. Read each name — you know
  exactly what it does now.
- Notice how `main` setup at the bottom draws the tube, shows the welcome, and
  wires the two buttons — then `mainloop()` waits for the player.
- `root.resizable(False, False)` locks the window to its proper size, so the
  **Guess!** and **New Game** buttons are always visible (a maximized window can
  otherwise push them off the bottom of the screen).
- `entry.bind("<Return>", lambda event: guess())` lets the player press **Enter**
  to guess instead of hunting for the button, and `entry.focus()` puts the cursor
  in the box so they can start typing straight away.

### Do It in VS Code 🛠️
1. Make sure your `number_game.py` matches this complete version.
2. Save, run. Play several rounds. Try to beat your best score!
3. Show it to a friend or family member and let them play.

### Your Turn — Reflection
1. Which lesson was the hardest, and what finally made it click?
2. Add ONE personal touch (your own colours, a title, an extra hint level).
3. Write two sentences: what are you proudest of building?

### 📸 Show Emrys
Screenshot your finished game mid-play AND a win with stars. Tell Emrys: "Course
complete!" and share your best score and your one personal touch.

### Check Your Brain
- Name three different concepts this game uses (there are many!).
- Which function picks the secret, and which one celebrates a win?
- How would you explain "hot and cold" to a friend using your game?

### More Examples
Ideas to keep growing your game:

```python
# Sound-like flash: briefly change the background on a win
canvas.config(bg="#103010")
root.after(400, lambda: canvas.config(bg="#0b1020"))
```

### Common Mistakes
- **Copy-paste errors:** if it won't run, read the terminal's red line number and
  check that exact line. **Fix:** compare it to the code above, character by
  character.
- **Indentation drift:** mixed spaces break Python. **Fix:** keep 4 spaces per
  level everywhere.

### Level Up 🚀
Publish your game: add a scoreboard that remembers the best score in a file (peek
at file saving), or add difficulty buttons. You are officially a game maker! 🎮
