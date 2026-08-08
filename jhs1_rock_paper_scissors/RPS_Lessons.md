# Rock Paper Scissors Arena Lessons: JHS 1 Edition (Graphics Version)

Build your very own **Rock Paper Scissors Arena** — but this time you can WATCH
the battle! Two giant hands face each other in a real arena window. You pick your
move, both hands **shake up and down** just like the real game — "Rock… Paper…
Scissors…" — and then they **snap open** to reveal what each player threw. The
winner is announced, the scoreboard updates, and **live statistics bars** show
your win rate. First to 3 wins the match, and victory comes with a shower of
stars.

This project is for **JHS 1** (beginners, around 12–13 years old). It uses Python
with **tkinter**, the drawing kit that comes free inside Python — nothing to
install. You start from absolutely zero — no experience needed. Every single line
of code is explained in simple words so you truly understand it, not just copy it.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one core thing this lesson teaches.
- **Kid Meaning** — the same idea explained with a real-life analogy.
- **Arena Connection** — how this fits our Rock Paper Scissors Arena.
- **The Code** — the actual Python to type (it draws something you can see!).
- **What You'll See** — the picture or motion that appears in the window.
- **Line by Line** — every important line explained.
- **Do It in VS Code 🛠️** — the exact steps to type, save, and run it.
- **Your Turn** — a small task YOU do to practise (this is the most important part!).
- **📸 Show Emrys** — send a screenshot of your window so Emrys can check it.
- **Check Your Brain** — quick questions to make sure it stuck.
- **More Examples** — extra runnable programs that stretch the idea further.
- **Common Mistakes** — the real errors beginners hit, with the exact fix.
- **Level Up 🚀** — a pro-feel challenge for fast finishers.

### Your Workshop Is VS Code 🛠️

All code in this course is typed, saved, and run in **Visual Studio Code
(VS Code)** with the Python extension — the same editor professional programmers
use every day. The rhythm for every piece of code is always:

1. Open your project file in VS Code (or **File → New File**, saved as `name.py`).
2. Type the code in the editor.
3. Save: **Ctrl+S** (Windows) or **Cmd+S** (Mac).
4. Run: press the **▶ Run** button at the top-right.
5. A **window pops up** showing your arena. Play in it! (When you're done, click
   the window's **X** to close it.)

Because our programs draw pictures, the exciting part is the **window**, not the
terminal. But keep an eye on the terminal too — if something goes wrong, Python
prints a red error message there, and errors are just clues.

You never run code inside Emrys's chat — Emrys is your teacher; VS Code is your
workbench.

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

- **Part 1 — First Pictures (Lessons 1–8):** open a window, draw the arena and
  the hands, use variables and maths, and make things MOVE.
- **Part 2 — Making Choices (Lessons 9–16):** decide who wins with `if`, use
  `random` for the computer's move, and package everything into functions.
- **Part 3 — Building the Arena (Lessons 17–24):** the shake animation, the
  score dictionary, best-of matches, win statistics, and the victory screen.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST PICTURES

## Lesson 1: What Is Code? Drawing the Arena

### Big Idea
Code is a list of instructions we give the computer, one line at a time — and
those instructions can draw a battle arena.

### Kid Meaning
A recipe tells a cook what to do step by step. Code tells the computer what to do
step by step. The computer does EXACTLY what you say — nothing more, nothing less.
Today we tell it: "Build me an arena."

### Arena Connection
Our whole game lives inside a window with two hands facing each other. Before the
battle, we need the arena.

### The Code
```python
import tkinter as tk

root = tk.Tk()
root.title("Rock Paper Scissors Arena")
canvas = tk.Canvas(root, width=700, height=400, bg="#141428")
canvas.pack()

canvas.create_text(350, 60, text="ROCK PAPER SCISSORS ARENA", fill="#ffd54a",
                   font=("Arial", 22, "bold"))
canvas.create_text(180, 150, text="YOU", fill="#ffd54a",
                   font=("Arial", 16, "bold"))
canvas.create_text(520, 150, text="COMPUTER", fill="#7db4ff",
                   font=("Arial", 16, "bold"))
canvas.create_text(350, 250, text="VS", fill="#5a5ac0",
                   font=("Arial", 30, "bold"))

root.mainloop()
```

### What You'll See
A dark arena window with a gold title, **YOU** on the left, **COMPUTER** on the
right, and a big purple **VS** in the middle. The stage is set!

### Line by Line
- `import tkinter as tk` — brings in Python's drawing kit and gives it the short
  nickname `tk` so we type less. Think of it as opening your box of crayons.
- `root = tk.Tk()` — makes the window itself. `root` is the name we use to talk
  to that window.
- `root.title(...)` — writes the title in the window's bar.
- `canvas = tk.Canvas(root, width=700, height=400, bg="#141428")` — puts a dark
  drawing sheet, 700 wide and 400 tall, inside the window. `canvas` is our paper.
- `canvas.pack()` — actually places the canvas into the window (without this, the
  paper stays hidden).
- `create_text(350, 60, ...)` — writes words centred 350 across and 60 down.
- `font=("Arial", 22, "bold")` — the font name, the size, and the style.
- `#141428` — a colour code. The `#` means "a colour written in computer code."
  You can also write plain names like `"navy"`.
- `root.mainloop()` — the magic word that keeps the window open and waiting.
  Without it, the window would blink and vanish.

### Do It in VS Code 🛠️
1. **File → New File** → name it `arena.py` → save it on your Desktop.
2. Type the code above yourself (don't copy-paste — typing teaches your fingers).
3. Save: **Ctrl+S** (make the white "unsaved" dot on the tab disappear).
4. Press the **▶ Run** button. Your arena should pop up!
5. Look at it. Then close it by clicking the **X**.

### Your Turn
1. Change "COMPUTER" to a rival name, like `"THE MACHINE"`.
2. Change the arena background colour.
3. Add a subtitle under the title saying "Best of 5!".
4. BEFORE you run: predict what will be different. Then run. Were you right?

### 📸 Show Emrys
Take a screenshot of your arena with YOUR rival's name and **send it to Emrys**.
Say: "Lesson 1 done!" Emrys will give you your first ✅ of the course.

### Check Your Brain
- What does `import tkinter as tk` bring us?
- Which line makes the window actually appear and stay open?
- What do the two numbers in `create_text(350, 60, ...)` mean?
- What do the three parts of `font=("Arial", 22, "bold")` control?

### More Examples
A simpler arena:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=300, bg="black")
canvas.pack()
canvas.create_text(250, 100, text="FIGHT!", fill="red", font=("Arial", 40, "bold"))
root.mainloop()
```

### Common Mistakes
- **Forgetting `root.mainloop()`:** the window flashes and disappears. **Fix:** add
  it as the LAST line.
- **Forgetting `canvas.pack()`:** the window opens but is empty. **Fix:** add
  `canvas.pack()` after making the canvas.
- **Capital letters wrong:** `Import` or `canvas.Create_text()` → an error. Python
  is picky — copy the spelling exactly.

### Level Up 🚀
Add a horizontal line across the middle of the arena using
`canvas.create_line(0, 320, 700, 320, fill="#3a4a90", width=3)` to make a floor.

---

## Lesson 2: How to Run Python (and the Screen Map)

### Big Idea
We type code in a file, save it, and then "run" it — and every drawing lands at
a spot described by two numbers.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when the window pops up. And every shape needs an address on the
screen: how far across, and how far down.

### Arena Connection
Our two hands must face each other at exactly the right heights. Getting that
right means understanding the screen map.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=600, height=400, bg="white")
canvas.pack()

canvas.create_oval(100, 150, 210, 260, fill="#ffd54a")
canvas.create_text(155, 300, text="I am at 155, 205", fill="black")

root.mainloop()
```

### What You'll See
A white window with a **yellow circle** (our first "hand"!) and a label under it.

### Line by Line
- `create_oval(100, 150, 210, 260, ...)` — the first two numbers `(100, 150)` are
  the **top-left corner** of an invisible box, and `(210, 260)` is the
  **bottom-right corner**. The oval is drawn to fill that box.
- Because the box is 110 wide and 110 tall, we get a perfect circle.
- `create_text(155, 300, ...)` — words centred below the circle.

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
  ▼            •(300,200) ← the middle of a 600×400 canvas
y gets
bigger        •(50,350) ← near the bottom-left
  ↓
```

Remember this and your hands sit exactly where you expect. Forget it and they end
up above or below each other — that's not a bug, it's just the screen map. (This
matters a LOT in Lesson 5, when we make the hands SHAKE: moving a hand **up**
means making its y **smaller**.)

### Slow Motion 🔬 — writing vs running
There are TWO different moments, and mixing them up confuses every beginner:

- **Writing** = typing the code into the editor. Nothing happens yet.
- **Saving** = Ctrl+S. Your words are safely on the disk. STILL nothing happens.
- **Running** = pressing **▶**. NOW Python reads your file and the window pops up.

The biggest trap: changing the code and running WITHOUT saving — the computer runs
the OLD version and you wonder why nothing changed. Burn this rhythm into your
fingers: **type → Ctrl+S → ▶ → look at the window.** Every time. Forever.

### Do It in VS Code 🛠️
1. **File → New File** → name it `hand_map.py` → save on your Desktop.
2. Type the code above.
3. **Ctrl+S**, then press **▶ Run**.
4. Change the oval to `create_oval(390, 150, 500, 260, ...)`. Predict where it
   moves BEFORE you run. (Answer: to the right — the opponent's side!)

### Your Turn
1. Draw a SECOND circle on the right side, so two hands face each other.
2. Move one circle HIGHER. Which number do you make smaller?
3. Draw a dot at `(0, 0)` — where does it land? (Try
   `create_oval(0, 0, 20, 20, fill="red")`.)

### 📸 Show Emrys
Screenshot your window with two circles facing each other. Tell Emrys which number
you changed to move one up.

### Check Your Brain
- Where is the point `(0, 0)` on the canvas?
- Which direction does **y** get bigger — up or down?
- To move a hand UP, do you make y bigger or smaller?
- Why must you SAVE before you run?

### More Examples
Three circles marching down (watch y grow):

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=200, height=400, bg="white")
canvas.pack()
canvas.create_oval(60, 40, 140, 120, fill="red")
canvas.create_oval(60, 150, 140, 230, fill="green")
canvas.create_oval(60, 260, 140, 340, fill="blue")
root.mainloop()
```

### Common Mistakes
- **Thinking up is bigger:** using a big y to go "up" sends the hand DOWN. **Fix:**
  smaller y = higher.
- **Corners backwards:** if the second corner is smaller than the first, the shape
  can vanish. **Fix:** first pair = top-left, second pair = bottom-right.

### Level Up 🚀
Draw a shape in each of the four corners and label each with its coordinates.

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that remembers a value so we can use it again.

### Kid Meaning
A box with a label. You write `wins = 0` and now the box called `wins` holds 0.
Whenever you say `wins`, the computer looks in the box and uses what's inside.

### Arena Connection
Our arena must remember the score, where each hand sits, and what each player
chose. Variables are how the computer remembers.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=700, height=400, bg="#141428")
canvas.pack()

LEFT_X = 180
RIGHT_X = 520
HAND_Y = 240
SIZE = 55
YELLOW = "#ffd54a"
BLUE = "#7db4ff"

canvas.create_oval(LEFT_X - SIZE, HAND_Y - SIZE,
                   LEFT_X + SIZE, HAND_Y + SIZE, fill=YELLOW)
canvas.create_oval(RIGHT_X - SIZE, HAND_Y - SIZE,
                   RIGHT_X + SIZE, HAND_Y + SIZE, fill=BLUE)
canvas.create_text(350, HAND_Y, text="VS", fill="#5a5ac0",
                   font=("Arial", 30, "bold"))

root.mainloop()
```

### What You'll See
Two big fists — a yellow one on the left and a blue one on the right — facing
each other across a purple **VS**.

### Line by Line
- `LEFT_X = 180` — where the left hand's CENTRE sits, across the screen.
- `HAND_Y = 240` — how far DOWN both hands sit. Sharing one variable means they're
  always perfectly level with each other.
- `SIZE = 55` — how far each hand reaches from its centre (its radius).
- `YELLOW = "#ffd54a"` — a box holding a colour, so we write the name instead of
  the code each time.
- `LEFT_X - SIZE, HAND_Y - SIZE` — the top-left of the hand's box;
  `LEFT_X + SIZE, HAND_Y + SIZE` is the bottom-right. Centre-and-radius maths.
- **CAPITAL names** like `LEFT_X` are a coder's habit for values that never change
  ("constants"). Python doesn't force it — it's a message to other humans.

### Do It in VS Code 🛠️
1. New file `hands.py`. Type the code.
2. Save and run — two fists face off.
3. Change `SIZE = 55` to `SIZE = 90`. Save, run. BOTH hands got bigger at once!
4. Change `HAND_Y = 240` to `HAND_Y = 150`. Both hands rose together.

### Your Turn
1. Move the hands further apart (smaller `LEFT_X`, bigger `RIGHT_X`).
2. Change both hand colours to your own.
3. Predict what happens if `LEFT_X` and `RIGHT_X` are the same number.

### 📸 Show Emrys
Send a screenshot of your two hands in YOUR colours and sizes. Tell Emrys which
variables you changed.

### Check Your Brain
- What is a variable?
- Why do both hands share one `HAND_Y`?
- Why is `SIZE` better than typing the number four times?
- Why do coders write some names in CAPITALS?

### More Examples
One box feeding another:

```python
LEFT_X = 180
RIGHT_X = 520
middle = (LEFT_X + RIGHT_X) / 2
print(middle)      # 350 — exactly where VS goes!
```

### Common Mistakes
- **Using a box before filling it:** using `SIZE` before `SIZE = 55` → `NameError`.
  **Fix:** create the box first, above where you use it.
- **Spelling the name differently:** `HAND_Y` vs `hand_y` are two different boxes.
  **Fix:** keep names exactly the same everywhere.

### Level Up 🚀
Add a `GAP` variable and work out `LEFT_X` and `RIGHT_X` from it, so one number
controls how far apart the fighters stand.

---

## Lesson 4: Numbers and Maths

### Big Idea
Python can do maths, and we use maths to place shapes and work out percentages.

### Kid Meaning
Python is a super-fast calculator. `+ - * /` mean add, subtract, multiply, divide.
We use them to space fingers evenly and to work out win rates.

### Arena Connection
Our hands grow fingers that must be evenly spaced. And our stats screen shows
"You win 60% of rounds" — that's division.

### The Code
```python
import tkinter as tk

WIDTH = 700
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=400, bg="#141428")
canvas.pack()

wins = 3
rounds = 5
percent = wins / rounds * 100

canvas.create_text(WIDTH/2, 60, text=f"You won {wins} of {rounds} rounds",
                   fill="white", font=("Arial", 18))
canvas.create_text(WIDTH/2, 100, text=f"That is {percent:.0f}%",
                   fill="#ffd54a", font=("Arial", 22, "bold"))

# A bar showing that percentage
canvas.create_rectangle(150, 160, 550, 190, outline="#3a4a90")
canvas.create_rectangle(150, 160, 150 + 400 * percent / 100, 190,
                        fill="#ffd54a", outline="")

root.mainloop()
```

### What You'll See
"You won 3 of 5 rounds", "That is 60%", and a gold **bar filled exactly 60% of
the way** across its track.

### Line by Line
- `percent = wins / rounds * 100` — divide, then multiply by 100. Python works
  through `/` and `*` from left to right.
- `f"{percent:.0f}%"` — the `:.0f` means "show this number with **0** digits after
  the dot", so `60.0` becomes a clean `60`.
- `150 + 400 * percent / 100` — the bar's right edge. The track is 400 wide, so
  60% of 400 is 240, and `150 + 240 = 390`. Change the percent and the bar length
  follows automatically.
- Two rectangles: the **outline** is the empty track, the **filled** one is the
  progress drawn on top.

### Do It in VS Code 🛠️
1. New file `stats_maths.py`. Type the code.
2. Save, run — a 60% bar.
3. Change `wins = 5` and run. A full bar and 100%.
4. Change `wins = 0`. An empty bar and 0%.

### Your Turn
1. Add a second bar for LOSSES in a different colour.
2. Make the track longer (change 400 to 500) and check the maths still works.
3. Print maths to the terminal: `print(10 + 5, 10 * 5, 10 / 5)`.

### 📸 Show Emrys
Screenshot your percentage bar at two different win counts. Tell Emrys the maths
that sets the bar's width.

### Check Your Brain
- What does `wins / rounds * 100` work out?
- What does `:.0f` do to a number?
- Why do we draw TWO rectangles for one bar?
- What is 60% of a 400-wide track?

### More Examples
Whole division and remainder (used for spacing later):

```python
print(7 // 2)   # 3  (how many whole 2s fit in 7)
print(7 % 2)    # 1  (what's left over)
```

### Common Mistakes
- **Dividing by zero:** `wins / 0` → `ZeroDivisionError`. **Fix:** check that
  `rounds` is not 0 before dividing (we do this in Lesson 22!).
- **Long decimals:** `60.00000001` looks messy. **Fix:** use `:.0f`.

### Level Up 🚀
Draw THREE bars (wins, losses, draws) stacked under each other, each with its own
colour and percentage label.

---

## Lesson 5: Counting and Moving — Changing a Variable

### Big Idea
Changing a number and redrawing is how a score climbs — and how a hand moves.

### Kid Meaning
`wins = wins + 1` means "take what's in the box, add one, put it back." Do the
same to a hand's y position and the hand JUMPS. That's the secret of animation.

### Arena Connection
The shake animation is just this: move the hands up, redraw, move them down,
redraw — over and over.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="#141428")
canvas.pack()

hand_y = 200
wins = 0

def bump():
    global hand_y, wins
    wins = wins + 1
    hand_y = hand_y - 20          # smaller y = HIGHER up
    canvas.delete("all")
    canvas.create_oval(150, hand_y - 50, 250, hand_y + 50, fill="#ffd54a")
    canvas.create_text(200, 360, text=f"Bumps: {wins}", fill="white",
                       font=("Arial", 16))

bump()
tk.Button(root, text="Move the hand up!", command=bump).pack(pady=8)

root.mainloop()
```

### What You'll See
A yellow hand. Every click moves it **20 pixels higher** and the counter goes up.
Click enough times and it leaves the top of the window!

### Line by Line
- `hand_y = 200` and `wins = 0` — both boxes live OUTSIDE the function so they
  survive between clicks.
- `global hand_y, wins` — tells Python "use the OUTSIDE boxes, don't make new ones
  inside." Without this, nothing would move or count.
- `wins = wins + 1` — the counting step. Read it right-to-left: work out
  `wins + 1`, then store the answer back in `wins`.
- `hand_y = hand_y - 20` — **subtract** to go UP, because y grows downward
  (Lesson 2's screen map in action!).
- `canvas.delete("all")` — wipe the old drawing before drawing the new one,
  otherwise you get a trail of hands.

### Do It in VS Code 🛠️
1. New file `moving.py`. Type the code.
2. Save, run. Click several times and watch the hand climb.
3. Change `- 20` to `+ 20` and click — now it sinks. Screen map confirmed!
4. Remove `global hand_y, wins`, run, and click. Nothing moves! Now you've SEEN
   why `global` matters. Put it back.

### Your Turn
1. Make each click move the hand by 50 instead of 20.
2. Add a second button that moves it back DOWN.
3. Predict `hand_y` after three clicks starting from 200. (Answer: 140.)

### 📸 Show Emrys
Screenshot the hand after several clicks with the counter showing. Tell Emrys
which direction subtracting moves it.

### Check Your Brain
- What does `wins = wins + 1` do?
- Why does `hand_y - 20` move the hand UP?
- Why must the boxes live outside the function?
- What does `canvas.delete("all")` prevent?

### More Examples
Counting in the terminal:

```python
count = 0
count = count + 1
count = count + 1
print(count)   # shows 2
```

### Common Mistakes
- **Forgetting `global`:** `UnboundLocalError`, or nothing changes. **Fix:** add
  `global` for every outside box you change.
- **Trail of shapes:** forgetting `canvas.delete("all")`. **Fix:** wipe first.

### Level Up 🚀
Make the hand move automatically using `root.after(100, bump)` at the end of
`bump` — your first real animation! (Full lesson in Lesson 20.)

---

## Lesson 6: Choosing a Move with Buttons

### Big Idea
Buttons let the player choose rock, paper, or scissors with a single click.

### Kid Meaning
In a real game you don't type "rock" — you throw it. Three buttons make choosing
instant.

### Arena Connection
This is how the player makes every move in our game.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=280, bg="#141428")
canvas.pack()

def pick(choice):
    canvas.delete("all")
    canvas.create_text(230, 120, text=f"You chose {choice}!", fill="#ffd54a",
                       font=("Arial", 22, "bold"))

buttons = tk.Frame(root)
buttons.pack(pady=8)
tk.Button(buttons, text="Rock", width=9,
          command=lambda: pick("rock")).pack(side="left", padx=4)
tk.Button(buttons, text="Paper", width=9,
          command=lambda: pick("paper")).pack(side="left", padx=4)
tk.Button(buttons, text="Scissors", width=9,
          command=lambda: pick("scissors")).pack(side="left", padx=4)

root.mainloop()
```

### What You'll See
Three buttons in a neat row. Click any one and the arena announces your choice in
big gold letters.

### Line by Line
- `def pick(choice):` — ONE machine handles all three buttons. The `choice`
  parameter tells it which move was thrown.
- `command=lambda: pick("rock")` — buttons normally call a function with NO
  information. `lambda:` builds a tiny throwaway function that calls `pick` WITH
  the word "rock". That's how three buttons share one machine.
- `buttons = tk.Frame(root)` — a **Frame** is an invisible tray that holds other
  widgets. It lets us line the buttons up side by side.
- `.pack(side="left", padx=4)` — pack them LEFT to right instead of stacked, with
  4 pixels of space between.
- `width=9` — makes all three buttons the same width so the row looks tidy.

### Do It in VS Code 🛠️
1. New file `choose.py`. Type the code.
2. Save, run. Click each button in turn.
3. Remove `side="left"` from one button and run — see it drop below. Put it back.

### Your Turn
1. Change the announcement to include an emoji or extra words.
2. Add a fourth button called "Lizard" that picks `"lizard"`.
3. Predict what shows when you click Paper.

### 📸 Show Emrys
Screenshot your arena after clicking a move. Tell Emrys which move you chose.

### Check Your Brain
- Why do all three buttons call the SAME function?
- What does `lambda:` do here?
- What is a `Frame` for?
- What does `side="left"` change?

### More Examples
Two buttons sharing one machine:

```python
def greet(name):
    print(f"Hello {name}!")

tk.Button(root, text="Ama", command=lambda: greet("Ama")).pack()
tk.Button(root, text="Kofi", command=lambda: greet("Kofi")).pack()
```

### Common Mistakes
- **Adding brackets:** `command=pick("rock")` runs it INSTANTLY at startup and the
  button does nothing after. **Fix:** wrap it — `command=lambda: pick("rock")`.
- **Forgetting `.pack()`:** the button never appears. **Fix:** pack every widget.

### Level Up 🚀
Give each button its own colour with `bg="#ffd54a"` so Rock, Paper and Scissors
look different.

---

## Lesson 7: f-strings — Mixing Words and Values

### Big Idea
An f-string lets us build a sentence with values dropped inside it.

### Kid Meaning
Instead of gluing words and numbers together awkwardly, put an `f` before the
quotes and drop any box inside `{ }`. Python fills in the value for you.

### Arena Connection
"You win! rock beats scissors." and "You 2 - 1 Computer" are sentences with values
dropped in. f-strings write every announcement in our arena.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=560, height=300, bg="#141428")
canvas.pack()

you = 2
computer = 1
draws = 1
my_move = "rock"
their_move = "scissors"

canvas.create_text(280, 60, text=f"You {you}  -  {computer} Computer",
                   fill="white", font=("Arial", 20))
canvas.create_text(280, 100, text=f"(draws: {draws})", fill="#8fa0d8",
                   font=("Arial", 12))
canvas.create_text(280, 170,
                   text=f"You win! {my_move} beats {their_move}.",
                   fill="#7CFC00", font=("Arial", 18, "bold"))
canvas.create_text(280, 230, text=f"Rounds played: {you + computer + draws}",
                   fill="#ffd54a", font=("Arial", 14))

root.mainloop()
```

### What You'll See
A full scoreboard: "You 2 - 1 Computer", the draw count, a green victory line, and
the total rounds — that last number **worked out by maths inside the f-string**.

### Line by Line
- `f"You {you}  -  {computer} Computer"` — the `f` before the quotes turns on the
  magic. Anything inside `{ }` is a box name, and Python drops its value in.
- `f"You win! {my_move} beats {their_move}."` — two boxes make one natural
  sentence. This is exactly how our arena will announce results.
- `f"Rounds played: {you + computer + draws}"` — you can do **maths** inside the
  braces, not just names. Python works it out first, then drops the answer in.

### Do It in VS Code 🛠️
1. New file `announce.py`. Type the code.
2. Save, run. Read all four lines.
3. Change `my_move` and `their_move` and run — the sentence rewrites itself.

### Your Turn
1. Add a line showing your win percentage using `:.0f` (from Lesson 4).
2. Show your move in CAPITALS: `f"{my_move.upper()}"`.
3. Predict the total when you is 3, computer is 2, draws is 0.

### 📸 Show Emrys
Screenshot your scoreboard with your own numbers. Tell Emrys which line uses maths
inside the braces.

### Check Your Brain
- What does the `f` before the quotes do?
- What can go inside the `{ }` — just names?
- What does `.upper()` do to text?

### More Examples
f-strings in the terminal:

```python
name = "Kofi"
score = 5
print(f"{name} has {score} wins.")
print(f"Two more and {name} reaches {score + 2}.")
```

### Common Mistakes
- **Forgetting the `f`:** `"{you}"` prints the braces literally as `{you}`. **Fix:**
  put `f` right before the opening quote.
- **Wrong box name inside braces:** `{yuo}` → `NameError`. **Fix:** spell it
  exactly as you named it.

### Level Up 🚀
Build a single "match report" f-string that includes both scores, the draws, the
rounds played, and your win percentage.

---

## Lesson 8: Mini-Project — Fighter Registration Card

### Big Idea
Put together windows, Entry, buttons, variables, and f-strings into one small
finished program.

### Kid Meaning
This is your first real mini-app: the fighter signs in and gets a proper arena
card. You already know every piece — now we assemble them.

### Arena Connection
This is the sign-in screen of the real game, and a rehearsal for the whole thing:
take input, store it, redraw the screen.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 560, 380
root = tk.Tk()
root.title("Fighter Registration")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#141428")
canvas.pack()

def register():
    fighter = entry.get().strip().title()
    if fighter == "":
        fighter = "Mystery Fighter"
    canvas.delete("all")
    canvas.create_text(WIDTH/2, 55, text="FIGHTER CARD", fill="#ffd54a",
                       font=("Arial", 24, "bold"))
    canvas.create_rectangle(80, 90, WIDTH-80, 300, outline="#5a5ac0", width=3)
    canvas.create_oval(WIDTH/2-45, 115, WIDTH/2+45, 205, fill="#ffd54a")
    canvas.create_text(WIDTH/2, 235, text=fighter, fill="white",
                       font=("Arial", 22, "bold"))
    canvas.create_text(WIDTH/2, 270, text="Ready to fight - best of 5!",
                       fill="#8fa0d8", font=("Arial", 12))
    entry.delete(0, tk.END)

canvas.create_text(WIDTH/2, 120, text="Enter your fighter name",
                   fill="white", font=("Arial", 16))
entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=8)
entry.bind("<Return>", lambda event: register())
entry.focus()
tk.Button(root, text="Register", font=("Arial", 13), command=register).pack()

root.mainloop()
```

### What You'll See
A sign-in screen. Type your fighter name, press **Register** (or **Enter**), and
the whole screen becomes a bordered fighter card with a yellow fist and your name.

### Line by Line
- `entry.get().strip().title()` — read what they typed, remove spare spaces, and
  capitalise it neatly. Three little jobs **chained** together.
- `if fighter == "":` — if they typed nothing, give a fun default instead of an
  empty card. (Your first `if` — full lesson next!)
- `root.resizable(False, False)` — locks the window size so buttons can never get
  pushed off the screen.
- `entry.bind("<Return>", ...)` — the **Enter** key registers too, like a real app.
- `entry.focus()` — puts the typing cursor in the box automatically.
- `create_rectangle(..., outline="#5a5ac0", width=3)` with no `fill` — draws just
  the border, so the card looks like a frame.

### Do It in VS Code 🛠️
1. New file `registration.py`. Type the whole program.
2. Save, run. Type your fighter name, press Enter, admire your card!
3. Try registering with an EMPTY box — meet "Mystery Fighter".

### Your Turn
1. Change the card colours and the tagline.
2. Add your fighter's "special move" as another line.
3. Add a second fist to the card so it looks like a fighting stance.

### 📸 Show Emrys
Screenshot your finished fighter card. Tell Emrys: "Part 1 mini-project done!"

### Check Your Brain
- Which line reads what the player typed?
- What do `.strip()` and `.title()` each do?
- Why lock the window size?
- How do you draw a rectangle with only a border?

### More Examples
Chaining text jobs:

```python
messy = "   kofi  "
print(messy.strip().title())   # "Kofi"
```

### Common Mistakes
- **Widgets not showing:** every Entry and Button needs `.pack()`. **Fix:** add it.
- **Old screen stays:** clear with `canvas.delete("all")` at the start.

### Level Up 🚀
Add a "New fighter" button that brings the sign-in screen back so a friend can
register too.

---

# PART 2 — MAKING CHOICES

## Lesson 9: Making Decisions with if

### Big Idea
`if` lets the program CHOOSE what to do — like reacting to the move you threw.

### Kid Meaning
"IF you threw rock, show a fist." The computer checks — is it true? — and only
then does the action.

### Arena Connection
Deciding what to draw and who won is all `if`.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=320, bg="#141428")
canvas.pack()

def pick(choice):
    canvas.delete("all")
    canvas.create_oval(180, 90, 280, 190, fill="#ffd54a")
    if choice == "paper":
        # four fingers stretching out to the right
        for k in range(4):
            y = 98 + k * 24
            canvas.create_rectangle(270, y, 350, y + 14, fill="#ffd54a",
                                    outline="")
    canvas.create_text(230, 250, text=f"You threw {choice}", fill="white",
                       font=("Arial", 16))

buttons = tk.Frame(root)
buttons.pack(pady=8)
tk.Button(buttons, text="Rock", width=9,
          command=lambda: pick("rock")).pack(side="left", padx=4)
tk.Button(buttons, text="Paper", width=9,
          command=lambda: pick("paper")).pack(side="left", padx=4)

root.mainloop()
```

### What You'll See
Click **Rock** → just a fist. Click **Paper** → the same fist but with **four
fingers** stretching out. The `if` decided whether to draw fingers.

### Line by Line
- `if choice == "paper":` — checks whether the thrown move is paper. `==` means
  "is exactly equal to" (two equals signs!).
- The `:` starts the "then do this" block, and the indented lines ONLY run when
  the check is true.
- `for k in range(4):` — a loop drawing four fingers (full loop lesson coming).
- `y = 98 + k * 24` — each finger sits 24 pixels below the last, so they're evenly
  spaced without typing four sets of numbers.

### Do It in VS Code 🛠️
1. New file `first_if.py`. Type the code.
2. Save, run. Click Rock, then Paper — spot the difference.
3. Change `range(4)` to `range(2)` and click Paper — now it looks like scissors!

### Your Turn
1. Add a Scissors button and an `if choice == "scissors":` that draws 2 fingers.
2. Change the finger length (the `350`).
3. Predict what shows if you click Rock. (No fingers — the `if` was false.)

### 📸 Show Emrys
Screenshot a rock hand AND a paper hand. Tell Emrys what the `if` decides.

### Check Your Brain
- What does `if` do?
- What is the difference between `=` and `==`?
- When do the indented lines under `if` run?
- What does `98 + k * 24` work out?

### More Examples
A simple if in the terminal:

```python
score = 8
if score > 5:
    print("Winning!")
```

### Common Mistakes
- **`=` instead of `==`:** `if choice = "paper":` → `SyntaxError`. **Fix:** use `==`.
- **Forgetting the colon** after the `if` line. **Fix:** add `:` and indent below.

### Level Up 🚀
Write one `draw_hand(choice)` function that handles all three moves (a preview of
Lesson 14!).

---

## Lesson 10: if / elif / else — Who Wins?

### Big Idea
`if / elif / else` decides the three possible outcomes: you win, you lose, or it's
a draw.

### Kid Meaning
"IF both threw the same, it's a draw. ELSE IF your move beats theirs, you win.
ELSE, they win." Python checks top to bottom and does the FIRST true one.

### Arena Connection
This is the referee of our whole game.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=520, height=300, bg="#141428")
canvas.pack()

def judge(mine, theirs):
    canvas.delete("all")
    canvas.create_text(260, 70, text=f"You: {mine}   Computer: {theirs}",
                       fill="white", font=("Arial", 15))
    if mine == theirs:
        result = "It's a draw!"
        color = "#8fa0d8"
    elif (mine == "rock" and theirs == "scissors") or \
         (mine == "paper" and theirs == "rock") or \
         (mine == "scissors" and theirs == "paper"):
        result = "You win!"
        color = "#7CFC00"
    else:
        result = "Computer wins!"
        color = "#ff6b6b"
    canvas.create_text(260, 160, text=result, fill=color,
                       font=("Arial", 26, "bold"))

judge("rock", "scissors")

root.mainloop()
```

### What You'll See
"You: rock   Computer: scissors" and a big green **"You win!"**. Change the two
words in `judge(...)` to test every combination.

### Line by Line
- `if mine == theirs:` — the easiest case first: same move means a draw.
- `elif (...) or (...) or (...):` — the three ways YOU win, joined by `or`.
  `or` means "any one of these being true is enough."
- `and` inside each bracket means "BOTH parts must be true" — rock only beats
  scissors if you threw rock **and** they threw scissors.
- `\` at the end of a line — a **line continuation**: it lets one long condition
  spread over three lines so humans can read it.
- `else:` — if it wasn't a draw and you didn't win, there's only one option left.
- We store `result` and `color` in boxes, then draw ONCE at the bottom — tidier
  than repeating the drawing code in all three branches.

### Do It in VS Code 🛠️
1. New file `referee.py`. Type the code.
2. Save, run — "You win!".
3. Try `judge("paper", "scissors")` (you lose), `judge("rock", "rock")` (draw).
4. Test all NINE combinations and check each answer is right.

### Your Turn
1. Change the three result messages to your own trash talk.
2. Change the colours.
3. Predict the result of `judge("scissors", "rock")`. (Computer wins!)

### 📸 Show Emrys
Screenshot a win, a loss, and a draw (three shots). Tell Emrys which combination
you used for each.

### Check Your Brain
- What is the difference between `if` and `elif`?
- What does `and` mean? What does `or` mean?
- When does `else` run?
- Why check the draw FIRST?

### More Examples
`and` and `or` in the terminal:

```python
print(True and False)   # False - both must be true
print(True or False)    # True  - one is enough
```

### Common Mistakes
- **Using `and` where you need `or`:** no combination ever wins. **Fix:** the three
  winning cases are alternatives, so join them with `or`.
- **Forgetting brackets:** mixing `and`/`or` without brackets confuses the logic.
  **Fix:** bracket each pair.

### Level Up 🚀
Rewrite this whole referee in THREE lines using a dictionary — that's exactly what
Lesson 16 teaches!

---

## Lesson 11: True and False — Booleans

### Big Idea
Every check is either True or False — those two values are called Booleans.

### Kid Meaning
A light switch is on or off. A check is True or False. `mine == theirs` is a
question Python answers with True or False.

### Arena Connection
"Is the animation still running?" is a True/False fact we store in a box called
`busy` — it stops players clicking mid-shake.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=480, height=300, bg="#141428")
canvas.pack()

busy = False

def throw(mine):
    global busy
    if busy:
        return
    busy = True
    is_rock = (mine == "rock")
    canvas.delete("all")
    canvas.create_text(240, 80, text=f"is_rock = {is_rock}", fill="white",
                       font=("Arial", 16))
    canvas.create_text(240, 130, text=f"busy = {busy}", fill="#ffd54a",
                       font=("Arial", 16))
    canvas.create_text(240, 200, text="Thinking...", fill="#8fa0d8",
                       font=("Arial", 14))
    root.after(1500, finish)

def finish():
    global busy
    busy = False
    canvas.create_text(240, 240, text="Ready again! busy = False",
                       fill="#7CFC00", font=("Arial", 13))

buttons = tk.Frame(root)
buttons.pack(pady=8)
tk.Button(buttons, text="Rock", width=9,
          command=lambda: throw("rock")).pack(side="left", padx=4)
tk.Button(buttons, text="Paper", width=9,
          command=lambda: throw("paper")).pack(side="left", padx=4)

root.mainloop()
```

### What You'll See
Click a button: you SEE `is_rock = True` (or False) and `busy = True`. For 1.5
seconds extra clicks are **ignored**, then "Ready again!" appears.

### Line by Line
- `busy = False` — a Boolean box: is an animation running right now?
- `if busy: return` — the **guard**. If we're busy, leave the function immediately
  and ignore the click. This stops players spamming buttons mid-animation.
- `is_rock = (mine == "rock")` — Python answers the question and stores True or
  False.
- `if busy:` works directly because `busy` is ALREADY True or False — no need for
  `if busy == True`.
- `root.after(1500, finish)` — "in 1.5 seconds, run `finish`", which unlocks the
  guard. The window stays responsive the whole time.

### Do It in VS Code 🛠️
1. New file `busy_flag.py`. Type the code.
2. Save, run. Click once, then click again quickly — the second click does nothing.
3. Wait for "Ready again!" then click — it works.
4. Remove the `if busy: return` lines and spam-click. See the mess! Put them back.

### Your Turn
1. Make the wait 3 seconds instead of 1.5.
2. Add `is_paper = (mine == "paper")` and show it too.
3. Predict `is_rock` when you click Paper. (False.)

### 📸 Show Emrys
Screenshot the True/False values on screen. Tell Emrys what the `busy` guard
prevents.

### Check Your Brain
- What two values can a Boolean be?
- What does the `busy` guard stop?
- Why can we write `if busy:` without `== True`?
- What does `return` do inside the guard?

### More Examples
Booleans in the terminal:

```python
print(10 > 3)      # True
print(5 == 5)      # True
print(not True)    # False
```

### Common Mistakes
- **Forgetting to unlock:** if nothing ever sets `busy = False`, the game freezes
  forever. **Fix:** always unlock at the end of the animation.
- **Quoting True:** `busy = "False"` is a WORD, and a non-empty word counts as
  True! **Fix:** no quotes.

### Level Up 🚀
Show a "Please wait…" message while `busy` is True, and hide it when it unlocks.

---

## Lesson 12: for Loops — Drawing Fingers

### Big Idea
A `for` loop repeats an action many times — perfect for drawing a hand's fingers.

### Kid Meaning
Instead of writing four almost-identical lines, a loop says "do this 4 times,
counting as you go." The counter changes each time so each finger lands in a new
spot.

### Arena Connection
Rock has 0 fingers, scissors has 2, paper has 4. One loop draws them all — the
number of fingers IS the move.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=300, bg="#141428")
canvas.pack()

cx, cy = 160, 150
fingers = 4
spacing = 28

canvas.create_oval(cx-55, cy-55, cx+55, cy+55, fill="#ffd54a", outline="")

for k in range(fingers):
    fy = cy - (fingers - 1) * spacing / 2 + k * spacing
    canvas.create_rectangle(cx + 40, fy - 9, cx + 112, fy + 9,
                            fill="#ffd54a", outline="")

canvas.create_text(250, 260, text=f"{fingers} fingers = paper", fill="white",
                   font=("Arial", 14))

root.mainloop()
```

### What You'll See
A yellow palm with **four evenly spaced fingers** stretching to the right — an
open hand. Change `fingers` to 2 and it becomes scissors; to 0 and it's a fist.

### Line by Line
- `for k in range(fingers):` — count `k` from 0 up to (not including) `fingers`.
  With `fingers = 4` that's 0, 1, 2, 3.
- `cy - (fingers - 1) * spacing / 2` — this is the **centring trick**. It works out
  where the TOP finger should start so the whole group sits centred on `cy`.
  With 4 fingers 28 apart, the group is 84 tall, so we start 42 above centre.
- `+ k * spacing` — then each finger steps down by 28 from there.
- `create_rectangle(cx + 40, fy - 9, cx + 112, fy + 9, ...)` — a finger 72 long and
  18 thick, starting 40 right of the palm's centre.
- Change ONE number (`fingers`) and the whole hand changes shape. That's the power
  of building drawings from variables.

### Do It in VS Code 🛠️
1. New file `fingers.py`. Type the code.
2. Save, run — an open hand.
3. Change `fingers = 2` and run. Scissors! Change to `0` — a fist.
4. Change `spacing = 60` with 2 fingers — a wide scissors V.

### Your Turn
1. Make the fingers longer and thicker.
2. Draw the hand facing LEFT (use `cx - 40` and `cx - 112` instead).
3. Predict where the fingers go if `fingers = 1`. (Exactly on `cy`!)

### 📸 Show Emrys
Screenshot a rock, a scissors, and a paper hand (three shots). Tell Emrys which
single number you changed each time.

### Check Your Brain
- What does a `for` loop do?
- What numbers does `range(4)` produce?
- What is the centring trick working out?
- How does the number of fingers decide the move?

### More Examples
Seeing the finger positions in the terminal:

```python
fingers, spacing, cy = 4, 28, 150
for k in range(fingers):
    print(cy - (fingers - 1) * spacing / 2 + k * spacing)
```

### Common Mistakes
- **Off-by-one:** `range(4)` gives 0–3, NOT 1–4. **Fix:** that's what we want for
  spacing from zero.
- **Fingers off-centre:** forgetting the `(fingers - 1) * spacing / 2` part makes
  them hang below the palm. **Fix:** keep the centring maths.

### Level Up 🚀
Make the fingers slightly different lengths (like a real hand) by adding
`+ k * 5` to the finger's end position.

---

## Lesson 13: random.choice — The Computer Picks

### Big Idea
`random.choice` lets the computer pick a move we can't predict.

### Kid Meaning
Like your opponent hiding their hand behind their back. The computer chooses from
a list, and you have no idea which one you'll face.

### Arena Connection
This is the computer's brain. Without it there's no opponent — and no game.

### The Code
```python
import tkinter as tk
import random

root = tk.Tk()
canvas = tk.Canvas(root, width=480, height=300, bg="#141428")
canvas.pack()

CHOICES = ["rock", "paper", "scissors"]

def computer_turn():
    move = random.choice(CHOICES)
    canvas.delete("all")
    canvas.create_text(240, 100, text="The computer throws...", fill="#8fa0d8",
                       font=("Arial", 14))
    canvas.create_text(240, 160, text=move.upper(), fill="#7db4ff",
                       font=("Arial", 32, "bold"))

tk.Button(root, text="Computer, throw!", command=computer_turn).pack(pady=10)

root.mainloop()
```

### What You'll See
Click the button and the computer throws **ROCK**, **PAPER**, or **SCISSORS** — a
different surprise almost every click.

### Line by Line
- `import random` — brings in Python's dice-and-shuffle kit.
- `CHOICES = ["rock", "paper", "scissors"]` — a **list** of the three legal moves.
- `random.choice(CHOICES)` — picks ONE item from the list at random. Each has an
  equal chance.
- `move.upper()` — shows the word in CAPITALS for dramatic effect.
- Using a list means adding a fourth move later needs only ONE change here.

### Do It in VS Code 🛠️
1. New file `computer_picks.py`. Type the code.
2. Save, run. Click ten times and count how often each move appears.
3. Add `print(move)` and watch the terminal fill up with random moves.

### Your Turn
1. Add `"lizard"` to `CHOICES` and see it start appearing.
2. Use `random.choice` to pick a random taunt from a list of three sentences.
3. Predict: over 30 clicks, roughly how many times should each move appear?
   (About 10 each — but randomness is lumpy!)

### 📸 Show Emrys
Screenshot two different computer throws. Tell Emrys how `random.choice` works.

### Check Your Brain
- What does `random.choice` do?
- What must you `import` first?
- Why store the moves in a list instead of three variables?
- Does each move have an equal chance?

### More Examples
Random picks in the terminal:

```python
import random
print(random.choice(["heads", "tails"]))
print(random.randint(1, 6))     # a dice roll
```

### Common Mistakes
- **Forgetting `import random`:** `NameError: name 'random' is not defined`.
  **Fix:** add the import at the top.
- **`random.choice("rock")`:** passing TEXT instead of a list picks a single
  LETTER! **Fix:** pass a list — `random.choice(["rock", "paper"])`.

### Level Up 🚀
Give the computer a personality: make it pick rock 50% of the time using
`random.randint`, so it has a favourite move you can learn to beat.

---

## Lesson 14: Functions — Reusable Arena Tools

### Big Idea
A function is a named machine: define it once, then run it whenever you like.

### Kid Meaning
A blender is a machine — you don't rebuild it each time, you press its button. A
function is code you name once and reuse by calling it.

### Arena Connection
We'll build tools like `draw_hand()`, `show_msg()`, and `draw_score()` and call
them every round — instead of copying the same drawing code over and over.

### The Code
```python
import tkinter as tk

WIDTH = 700
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=420, bg="#141428")
canvas.pack()

def show_msg(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH/2, 350, text=text, fill=color,
                       font=("Arial", 22, "bold"), tags="msg")

def draw_score(you, computer):
    canvas.delete("score")
    canvas.create_text(WIDTH/2, 50, text=f"You {you}  -  {computer} Computer",
                       fill="white", font=("Arial", 18), tags="score")

draw_score(2, 1)
show_msg("You win this round!", "#7CFC00")

root.mainloop()
```

### What You'll See
A scoreboard reading "You 2 - 1 Computer" and a green announcement underneath —
each drawn by its own little machine.

### Line by Line
- `def show_msg(text, color):` — defines the machine. Nothing happens yet — we're
  just building it.
- `tags="msg"` / `tags="score"` — **labels** on the drawings so each machine erases
  only ITS OWN text, leaving everything else untouched. Much better than
  `delete("all")`, which would wipe the hands too.
- `canvas.delete("msg")` at the START of the machine — clear the old one before
  drawing the new one.
- `draw_score(2, 1)` — calling a machine actually runs it. Call it again with new
  numbers and only the scoreboard changes.

### Do It in VS Code 🛠️
1. New file `arena_tools.py`. Type the code.
2. Save, run — see both pieces.
3. Add `draw_score(3, 1)` at the bottom. Only the score updated!
4. Add `show_msg("Computer wins!", "#ff6b6b")` — only the message changed.

### Your Turn
1. Add a `draw_title()` machine that writes the arena name at the top.
2. Call `show_msg` three times with different words — which one wins? (The last.)
3. Predict what `canvas.delete("msg")` erases — the score too?

### 📸 Show Emrys
Screenshot your arena with a score and a message. Tell Emrys the names of your
functions.

### Check Your Brain
- What does `def` do?
- What is the difference between DEFINING a function and CALLING it?
- Why are `tags` better than `delete("all")` here?
- Why delete at the start of the machine?

### More Examples
A tiny function you call by name:

```python
def cheer():
    print("Let's go!")

cheer()
cheer()
```

### Common Mistakes
- **Defining but never calling:** the machine exists but nothing runs it. **Fix:**
  call it — `draw_score(0, 0)`.
- **Wiping everything:** `delete("all")` erases the hands too. **Fix:** delete by
  tag.

### Level Up 🚀
Write `draw_hand(cx, cy, fingers, color, tag)` combining Lesson 12's loop with
tags — you'll need exactly this in Lesson 17!

---

## Lesson 15: Functions with Parameters and return

### Big Idea
Parameters let us hand information INTO a function; `return` hands an answer BACK.

### Kid Meaning
Some machines DO something (draw a hand). Others ANSWER something (work out who
won). `return` is how a machine gives you its answer.

### Arena Connection
`fingers_for(move)` RETURNS how many fingers to draw. `winner_of(a, b)` RETURNS
who won. These answer-machines keep our code tidy.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=520, height=320, bg="#141428")
canvas.pack()

def fingers_for(move):
    if move == "rock":
        return 0
    elif move == "paper":
        return 4
    else:
        return 2

def draw_hand(cx, cy, move, color):
    canvas.create_oval(cx-55, cy-55, cx+55, cy+55, fill=color, outline="")
    fingers = fingers_for(move)
    spacing = 28 if move == "paper" else 60
    for k in range(fingers):
        fy = cy - (fingers - 1) * spacing / 2 + k * spacing
        canvas.create_rectangle(cx + 40, fy - 9, cx + 112, fy + 9,
                                fill=color, outline="")

draw_hand(180, 150, "paper", "#ffd54a")
canvas.create_text(260, 280, text=f"paper needs {fingers_for('paper')} fingers",
                   fill="white", font=("Arial", 14))

root.mainloop()
```

### What You'll See
An open paper hand, and a line reading "paper needs 4 fingers" — the answer came
straight from the `fingers_for` machine.

### Line by Line
- `def fingers_for(move):` — an ANSWER-machine. Give it a move, it hands back a
  number.
- `return 0` — hands the number back AND stops the function immediately. Nothing
  after it runs.
- `fingers = fingers_for(move)` — inside `draw_hand`, we CALL the answer-machine
  and catch its answer. One machine using another!
- `spacing = 28 if move == "paper" else 60` — a one-line choice: paper's fingers
  sit close together, scissors' spread apart.
- `fingers_for('paper')` inside the f-string uses **single** quotes because the
  f-string already uses double quotes.
- `draw_hand` is a DO-machine (it draws); `fingers_for` is an ANSWER-machine (it
  returns). Knowing which is which is a big step in thinking like a coder.

### Do It in VS Code 🛠️
1. New file `hand_tools.py`. Type the code.
2. Save, run — a paper hand.
3. Change to `draw_hand(180, 150, "scissors", "#ffd54a")` — two spread fingers.
4. Add `print(fingers_for("rock"))` and check the terminal shows 0.

### Your Turn
1. Add a `color_for(player)` machine that returns yellow for "you" and blue for
   "computer".
2. Draw two hands side by side using it.
3. Predict what `fingers_for("scissors")` returns. (2 — it falls to the `else`.)

### 📸 Show Emrys
Screenshot two hands with different moves. Tell Emrys which function RETURNS a
value and which one DRAWS.

### Check Your Brain
- What is a parameter?
- What does `return` do?
- What is the difference between `fingers_for` and `draw_hand`?
- What does `28 if move == "paper" else 60` mean?

### More Examples
Return a calculated value:

```python
def double(n):
    return n * 2

print(double(7))   # 14
```

### Common Mistakes
- **Forgetting to catch the answer:** calling `fingers_for(move)` alone throws the
  answer away. **Fix:** store it — `fingers = fingers_for(move)`.
- **Using `print` instead of `return`:** printing shows it but hands back nothing.
  **Fix:** use `return` when you need the value.

### Level Up 🚀
Write `beats(a, b)` that returns True if move `a` beats move `b`, using the
dictionary you'll meet next lesson.

---

## Lesson 16: Dictionaries — The Rules and the Score

### Big Idea
A dictionary pairs names with values — perfect for the game's rules and the score.

### Kid Meaning
A real dictionary: look up a word, get its meaning. Here we look up `"rock"` and
get `"scissors"` — the thing rock beats.

### Arena Connection
This ONE dictionary replaces the huge `if/or/and` referee from Lesson 10. It's the
most elegant idea in the whole course.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=560, height=340, bg="#141428")
canvas.pack()

BEATS = {"rock": "scissors", "paper": "rock", "scissors": "paper"}
score = {"you": 0, "computer": 0, "draws": 0}

def judge(mine, theirs):
    canvas.delete("all")
    if mine == theirs:
        score["draws"] = score["draws"] + 1
        result, color = "Draw!", "#8fa0d8"
    elif BEATS[mine] == theirs:
        score["you"] = score["you"] + 1
        result, color = f"You win! {mine} beats {theirs}.", "#7CFC00"
    else:
        score["computer"] = score["computer"] + 1
        result, color = f"Computer wins! {theirs} beats {mine}.", "#ff6b6b"
    canvas.create_text(280, 120, text=result, fill=color,
                       font=("Arial", 18, "bold"))
    canvas.create_text(280, 200,
                       text=f"You {score['you']} - {score['computer']} Computer"
                            f"  (draws {score['draws']})",
                       fill="white", font=("Arial", 15))

judge("rock", "scissors")

root.mainloop()
```

### What You'll See
"You win! rock beats scissors." and a running scoreboard. Call `judge` again with
different moves and the score keeps climbing.

### Line by Line
- `BEATS = {"rock": "scissors", ...}` — read it as "rock beats scissors, paper
  beats rock, scissors beats paper." The **key** is the winner, the **value** is
  what it defeats.
- `BEATS[mine] == theirs` — look up what MY move beats, and check whether that's
  what they threw. If yes, I win. **This one line replaces six lines of
  `and`/`or`!**
- `score = {"you": 0, ...}` — a dictionary as a scoreboard: three counters with
  clear names, all in one box.
- `score["you"] = score["you"] + 1` — look up the counter, add one, put it back.
- `result, color = "Draw!", "#8fa0d8"` — filling TWO boxes on one line.
- `{score['you']}` — single quotes inside a double-quoted f-string.

### Do It in VS Code 🛠️
1. New file `rules_dict.py`. Type the code.
2. Save, run — you win.
3. Try `judge("paper", "scissors")` (you lose) and `judge("rock", "rock")` (draw).
4. Call `judge` three times in a row and watch the scoreboard accumulate.

### Your Turn
1. Print `BEATS["paper"]` and check it says `"rock"`.
2. Add a `"lizard"` entry to `BEATS` and test it.
3. Predict `BEATS["scissors"]`. (Answer: `"paper"`.)

### 📸 Show Emrys
Screenshot a win and a loss with the scoreboard. Tell Emrys how the ONE line
`BEATS[mine] == theirs` decides the winner.

### Check Your Brain
- What is a dictionary?
- What does `BEATS["rock"]` give you, and what does it mean?
- Why is `BEATS[mine] == theirs` better than the big `if/and/or`?
- How does a dictionary work as a scoreboard?

### More Examples
Dictionaries in the terminal:

```python
ages = {"Ama": 12, "Kofi": 13}
print(ages["Ama"])        # 12
ages["Esi"] = 12          # add a new one
print(ages)
```

### Common Mistakes
- **Wrong key:** `BEATS["Rock"]` (capital R) → `KeyError`. **Fix:** keys are
  case-sensitive — use exactly `"rock"`.
- **Reversing the meaning:** writing `{"rock": "paper"}` makes rock beat paper —
  wrong! **Fix:** key beats value.

### Level Up 🚀
Add a `TAUNTS` dictionary pairing each move with a trash-talk line the computer
says when it wins with that move.

---

# PART 3 — BUILDING THE ARENA

## Lesson 17: Drawing Both Hands Facing Each Other

### Big Idea
One `draw_hand` machine, called twice with a **direction**, draws both fighters.

### Kid Meaning
The left hand's fingers point right; the right hand's point left. One number —
`+1` or `-1` — flips the whole hand around.

### Arena Connection
This is the visual heart of the arena, and the start of our real program.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 700, 420
LEFT_X, RIGHT_X, HAND_Y = 180, 520, 250
YELLOW, BLUE = "#ffd54a", "#7db4ff"

root = tk.Tk()
root.title("Rock Paper Scissors Arena")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#141428")
canvas.pack()

def fingers_for(shape):
    if shape == "rock":
        return 0
    elif shape == "paper":
        return 4
    else:
        return 2

def draw_hand(cx, cy, shape, direction, color, tag):
    canvas.delete(tag)
    canvas.create_oval(cx - 55, cy - 55, cx + 55, cy + 55, fill=color,
                       outline="", tags=tag)
    fingers = fingers_for(shape)
    spacing = 28 if shape == "paper" else 60
    for k in range(fingers):
        fy = cy - (fingers - 1) * spacing / 2 + k * spacing
        x1 = cx + direction * 40
        x2 = cx + direction * 112
        canvas.create_rectangle(min(x1, x2), fy - 9, max(x1, x2), fy + 9,
                                fill=color, outline="", tags=tag)

draw_hand(LEFT_X, HAND_Y, "paper", 1, YELLOW, "left")
draw_hand(RIGHT_X, HAND_Y, "scissors", -1, BLUE, "right")
canvas.create_text(WIDTH/2, HAND_Y, text="VS", fill="#5a5ac0",
                   font=("Arial", 26, "bold"))

root.mainloop()
```

### What You'll See
A yellow **paper** hand on the left with fingers pointing right, and a blue
**scissors** hand on the right with fingers pointing left, facing off across the
VS.

### Line by Line
- `direction` — `1` means fingers stretch to the RIGHT, `-1` means LEFT. Multiplying
  by `-1` flips the whole hand.
- `x1 = cx + direction * 40` — with direction `1` that's `cx + 40` (right of the
  palm); with `-1` it's `cx - 40` (left of it).
- `min(x1, x2)` and `max(x1, x2)` — rectangles need top-left BEFORE bottom-right.
  When direction is `-1`, `x2` is smaller than `x1`, so `min`/`max` sort them out.
  Without this, the left-facing fingers would vanish!
- `tag` — each hand gets its own label (`"left"` / `"right"`) so we can redraw ONE
  hand without disturbing the other.
- `canvas.delete(tag)` at the start — wipe just this hand before redrawing it.

### Do It in VS Code 🛠️
1. Create your real project file `rps_arena.py`. Type the code.
2. Save, run — two hands face off.
3. Swap the moves in the two calls and run again.
4. Change the right hand's direction to `1` and run — its fingers point the WRONG
   way, straight off the screen. Change it back!

### Your Turn
1. Draw both hands as rock (fists).
2. Move the hands closer together.
3. Predict what `min(x1, x2)` gives when direction is `-1`. (It's `x2` — the
   further-left one.)

### 📸 Show Emrys
Screenshot both hands with different moves. Tell Emrys what the `direction`
number does.

### Check Your Brain
- What does `direction` control?
- Why do we need `min` and `max` for the finger rectangles?
- Why does each hand get its own tag?
- What does multiplying by `-1` do to a position?

### More Examples
Flipping with a direction number:

```python
for direction in [1, -1]:
    print(200 + direction * 50)   # 250 then 150
```

### Common Mistakes
- **Fingers disappear:** forgetting `min`/`max` on the left-facing hand. **Fix:**
  always sort the corners.
- **Both hands share a tag:** redrawing one erases the other. **Fix:** give each
  its own tag.

### Level Up 🚀
Add a thumb to each hand: one small oval on the palm, positioned using `direction`
so it flips correctly too.

---

## Lesson 18: The Shake Animation

### Big Idea
`root.after` calling a function again and again makes the hands shake.

### Kid Meaning
"Rock… Paper… Scissors…" — the hands bounce up and down before the reveal. That
bounce is just: move, redraw, wait a moment, repeat.

### Arena Connection
This is the drama of the whole game. Without the shake it's just an instant
answer; with it, it's a real match.

### The Code
```python
def shake(count):
    if count == 0:
        reveal()
        return
    offset = 25 if count % 2 == 0 else -25
    draw_hand(LEFT_X, HAND_Y + offset, "rock", 1, YELLOW, "left")
    draw_hand(RIGHT_X, HAND_Y + offset, "rock", -1, BLUE, "right")
    show_msg("Rock... Paper... Scissors...", "#8fa0d8")
    root.after(200, lambda: shake(count - 1))
```

### What You'll See
Both fists **bounce up and down six times**, about a fifth of a second apart,
while the countdown text shows — then they reveal their real moves.

### Line by Line
- `def shake(count):` — `count` is how many bounces are LEFT to do.
- `if count == 0: reveal(); return` — the **stop condition**. When there are no
  bounces left, show the result and leave. Without this, the hands would shake
  forever!
- `offset = 25 if count % 2 == 0 else -25` — the bounce. `count % 2` is 0, 1, 0,
  1… so the offset flips between **down 25** and **up 25** each time.
- `HAND_Y + offset` — a bigger y draws LOWER, a smaller y draws HIGHER (the screen
  map from Lesson 2!).
- Both hands show as `"rock"` during the shake — just like real players keeping
  their move hidden until the last moment.
- `root.after(200, lambda: shake(count - 1))` — "in 200 milliseconds, run `shake`
  again with ONE FEWER bounce." A function that calls itself is called
  **recursion**, and the countdown is what stops it.

### Do It in VS Code 🛠️
1. Add `shake` to `rps_arena.py` (plus a temporary `reveal` that just prints).
2. Call `shake(6)` and run. Watch the bounce!
3. Change `200` to `500` — a slow, dramatic shake. Try `80` — a frantic one.
4. Change `shake(6)` to `shake(12)` for a longer build-up.

### Your Turn
1. Make the bounce bigger (change 25 to 50).
2. Make the two hands bounce in OPPOSITE directions (use `- offset` for one).
3. Predict what happens if you delete the `if count == 0` block. (It never stops!)

### 📸 Show Emrys
Screenshot the hands mid-shake (both raised or lowered). Tell Emrys how many
bounces you used and how fast.

### Check Your Brain
- What stops the shake from going forever?
- What does `count % 2` produce as count counts down?
- Why do both hands show as rock during the shake?
- What does `root.after(200, ...)` do?

### More Examples
A simple countdown with `after`:

```python
def countdown(n):
    if n == 0:
        print("Go!")
        return
    print(n)
    root.after(1000, lambda: countdown(n - 1))
```

### Common Mistakes
- **Using `time.sleep()`:** it FREEZES the window — you'd see nothing move at all.
  **Fix:** always use `root.after` in tkinter.
- **Forgetting the stop condition:** an endless shake that never reveals. **Fix:**
  always check for 0 first.
- **Brackets on the function:** `root.after(200, shake(count - 1))` runs it
  instantly. **Fix:** wrap it in `lambda:`.

### Level Up 🚀
Make the shake speed UP as it goes: pass a shorter delay each time, so the
countdown builds tension.

---

## Lesson 19: One Full Round — Pick, Shake, Reveal, Judge

### Big Idea
Chain the pieces: the player picks, the hands shake, the moves reveal, the referee
decides.

### Kid Meaning
This is one complete round of the game, from button press to result.

### Arena Connection
Everything from here is repeating this one round until someone wins the match.

### The Code
```python
CHOICES = ["rock", "paper", "scissors"]
BEATS = {"rock": "scissors", "paper": "rock", "scissors": "paper"}
score = {"you": 0, "computer": 0, "draws": 0}
busy = False
player_choice = "rock"

def play(choice):
    global busy, player_choice
    if busy:
        return
    busy = True
    player_choice = choice
    shake(6)

def reveal():
    global busy
    computer_choice = random.choice(CHOICES)
    draw_hand(LEFT_X, HAND_Y, player_choice, 1, YELLOW, "left")
    draw_hand(RIGHT_X, HAND_Y, computer_choice, -1, BLUE, "right")
    if player_choice == computer_choice:
        score["draws"] = score["draws"] + 1
        show_msg(f"Draw! Both chose {player_choice}.", "#8fa0d8")
    elif BEATS[player_choice] == computer_choice:
        score["you"] = score["you"] + 1
        show_msg(f"You win! {player_choice} beats {computer_choice}.", "#7CFC00")
    else:
        score["computer"] = score["computer"] + 1
        show_msg(f"Computer wins! {computer_choice} beats {player_choice}.",
                 "#ff6b6b")
    draw_score()
    busy = False
```

### What You'll See
Click **Rock** → the hands shake → they snap open showing your rock and the
computer's random move → the winner is announced and the score updates.

### Line by Line
- `play(choice)` — the button handler. It stores the move and starts the shake.
- `if busy: return` — the guard from Lesson 11. It stops a player clicking a second
  move mid-shake, which would confuse the whole round.
- `busy = True` at the start, `busy = False` at the end of `reveal` — locked during
  the animation, unlocked when the round finishes.
- `player_choice` is a global so it survives from `play` through the shake to
  `reveal`. The shake happens in between, so we can't just pass it along.
- `random.choice(CHOICES)` — the computer's move, decided at the REVEAL moment
  (not before) so it's a genuine surprise.
- The `if/elif/else` is the Lesson 16 referee, using the `BEATS` dictionary.

### Do It in VS Code 🛠️
1. Add `play` and the real `reveal` to `rps_arena.py`, plus the three move buttons
   from Lesson 6.
2. Save, run. Play several rounds!
3. Try clicking two buttons quickly — the guard blocks the second.

### Your Turn
1. Add your own wording to all three announcements.
2. Print `computer_choice` to the terminal each round.
3. Predict what happens if you forget `busy = False` in `reveal`. (One round only,
   then it's stuck!)

### 📸 Show Emrys
Screenshot a win, a loss, and a draw with the revealed hands. Tell Emrys what the
`busy` guard protects.

### Check Your Brain
- What are the four steps of one round?
- Why must `player_choice` be a global?
- When exactly does the computer choose its move?
- Where is `busy` locked and where is it unlocked?

### More Examples
Storing a value between two functions:

```python
choice = ""
def pick(c):
    global choice
    choice = c
def use():
    print("You picked", choice)
```

### Common Mistakes
- **Never unlocking `busy`:** the game plays one round then freezes. **Fix:** set
  `busy = False` at the end of `reveal`.
- **Choosing the computer's move too early:** if you pick it in `play`, a curious
  student could peek before the reveal. **Fix:** choose it in `reveal`.

### Level Up 🚀
Make the winning hand **glow** by drawing a bright outline around it after the
reveal.

---

## Lesson 20: The Best-Of Match

### Big Idea
Keep playing rounds until someone reaches the winning score.

### Kid Meaning
One round is fun; a match is a story. First to 3 wins takes the whole thing.

### Arena Connection
This turns a series of rounds into a real contest with a champion.

### The Code
```python
WIN_TARGET = 3
match_over = False

# at the end of reveal(), after busy = False:
    if score["you"] >= WIN_TARGET or score["computer"] >= WIN_TARGET:
        global match_over
        match_over = True
        if score["you"] >= WIN_TARGET:
            show_msg("YOU WIN THE MATCH!", "#7CFC00")
            celebrate()
        else:
            show_msg("Computer wins the match!", "#ff6b6b")

# and the guard in play() becomes:
    if busy or match_over:
        return
```

### What You'll See
Play on — as soon as either side reaches **3 wins**, a match-winner banner appears
and the move buttons stop responding until you start a new match.

### Line by Line
- `WIN_TARGET = 3` — one number controls the match length. Change it to 5 for a
  longer contest.
- `score["you"] >= WIN_TARGET or score["computer"] >= WIN_TARGET` — either side
  reaching the target ends the match. `>=` means "greater than or equal to".
- `match_over = True` — a second Boolean flag, like `busy` but permanent until a
  new match.
- `if busy or match_over: return` — now the guard blocks clicks for BOTH reasons:
  mid-animation, or match finished.
- Note we check the match END after the round result, so the final round still
  gets announced normally first.

### Do It in VS Code 🛠️
1. Add `WIN_TARGET`, `match_over`, and update `reveal` and `play`.
2. Save, run. Play until someone reaches 3.
3. Try clicking a move after the match ends — nothing happens, as intended.
4. Change `WIN_TARGET = 1` for a lightning match to test quickly.

### Your Turn
1. Make it best-of-7 (first to 4).
2. Add a message showing how many wins are still needed.
3. Predict what happens with `WIN_TARGET = 1`. (The first non-draw round ends it.)

### 📸 Show Emrys
Screenshot the match-winner banner. Tell Emrys your `WIN_TARGET` and the final
score.

### Check Your Brain
- What does `WIN_TARGET` control?
- What does `>=` mean?
- Why do we have TWO flags (`busy` and `match_over`)?
- Why check for the match end AFTER announcing the round?

### More Examples
Checking two ways to finish:

```python
if lives <= 0 or rounds >= 10:
    print("Game over")
```

### Common Mistakes
- **Forgetting `global match_over`:** the flag never sticks and the match never
  ends. **Fix:** declare it global where you change it.
- **Blocking too early:** checking `match_over` before announcing the last round
  hides the winning result. **Fix:** announce first, then check.

### Level Up 🚀
Add "match point!" text when either side is one win away from taking the match.

---

## Lesson 21: The Score Dictionary in Action

### Big Idea
One dictionary holds every counter, and one machine draws them all.

### Kid Meaning
Instead of three separate boxes floating around, the scoreboard lives in one tidy
place with clear labels.

### Arena Connection
This is the scoreboard the whole arena reads from.

### The Code
```python
def draw_score():
    canvas.delete("score")
    canvas.create_text(WIDTH/2, 40, text="ROCK PAPER SCISSORS ARENA",
                       fill="#ffd54a", font=("Arial", 20, "bold"), tags="score")
    canvas.create_text(WIDTH/2, 78,
                       text=f"You {score['you']}  -  {score['computer']} Computer"
                            f"   (draws: {score['draws']})",
                       fill="white", font=("Arial", 15), tags="score")
    canvas.create_text(WIDTH/2, 105, text=f"First to {WIN_TARGET} wins the match",
                       fill="#8fa0d8", font=("Arial", 11), tags="score")
    canvas.create_text(LEFT_X, 150, text="YOU", fill=YELLOW,
                       font=("Arial", 14, "bold"), tags="score")
    canvas.create_text(RIGHT_X, 150, text="COMPUTER", fill=BLUE,
                       font=("Arial", 14, "bold"), tags="score")
```

### What You'll See
A complete scoreboard header: the arena title, the live score with draws, the
match rule, and a name above each fighter — all redrawn cleanly every round.

### Line by Line
- `canvas.delete("score")` then redraw — the standard pattern: wipe this piece,
  draw it fresh. Everything shares the `"score"` tag so ONE delete clears the lot.
- `f"You {score['you']} ..."` — reading three values straight out of the
  dictionary inside one f-string.
- Two f-strings written next to each other (`f"..."` `f"..."`) — Python **joins
  them automatically**. That lets a long line be split neatly across two lines.
- `{score['you']}` — single quotes inside the double-quoted f-string.
- One machine draws the whole header, so `reveal` just calls `draw_score()` and
  everything updates at once.

### Do It in VS Code 🛠️
1. Replace your simple score drawing with this full `draw_score` in
   `rps_arena.py`.
2. Save, run. Play a few rounds and watch every number update together.
3. Add a new key `score["rounds"]` and display it too.

### Your Turn
1. Add your fighter name (from Lesson 8) above the left hand instead of "YOU".
2. Change the header colours.
3. Predict what `score['draws']` shows after two drawn rounds. (2.)

### 📸 Show Emrys
Screenshot your scoreboard mid-match. Tell Emrys how many values it reads from
the dictionary.

### Check Your Brain
- Why does everything in the header share one tag?
- What happens when you write two f-strings next to each other?
- Why single quotes inside the braces?
- Why is one `draw_score()` better than updating each number separately?

### More Examples
Reading several keys at once:

```python
score = {"you": 2, "computer": 1}
print(f"{score['you']} to {score['computer']}")
```

### Common Mistakes
- **Same quote type inside the f-string:** `f"{score["you"]}"` → `SyntaxError`.
  **Fix:** use single quotes inside.
- **Forgetting the tag on one item:** it never gets erased and text piles up.
  **Fix:** tag every piece.

### Level Up 🚀
Highlight whoever is currently ahead by drawing their name in a brighter colour.

---

## Lesson 22: Win Statistics and Percentages

### Big Idea
Turn the raw counts into percentages and draw them as bars.

### Kid Meaning
"You've won 3 of 5" is fine — but a bar chart shows your form at a glance, like a
real sports app.

### Arena Connection
This is the professional touch that makes the arena feel like a real game.

### The Code
```python
rounds_played = 0

def draw_stats():
    canvas.delete("stats")
    if rounds_played == 0:
        return
    labels = ["Wins", "Losses", "Draws"]
    values = [score["you"], score["computer"], score["draws"]]
    colors = [YELLOW, BLUE, "#8fa0d8"]
    for i in range(3):
        y = 440 + i * 28
        percent = values[i] / rounds_played * 100
        canvas.create_text(80, y, text=labels[i], fill="white", anchor="e",
                           font=("Arial", 11), tags="stats")
        canvas.create_rectangle(95, y - 9, 95 + 380, y + 9, outline="#3a4a90",
                                tags="stats")
        canvas.create_rectangle(95, y - 9, 95 + 380 * percent / 100, y + 9,
                                fill=colors[i], outline="", tags="stats")
        canvas.create_text(495, y, text=f"{percent:.0f}%", fill="white",
                           anchor="w", font=("Arial", 11), tags="stats")
```

### What You'll See
Three labelled bars under the arena — **Wins** in yellow, **Losses** in blue,
**Draws** in grey — each filling to its true percentage, with the number beside it.

### Line by Line
- `if rounds_played == 0: return` — the **divide-by-zero guard**. Before any round
  is played, dividing by 0 would crash the program. Leaving early avoids it.
- `labels`, `values`, `colors` — three lists that line up: position 0 of each
  belongs together. This is a really common coder pattern.
- `for i in range(3):` — one loop draws all three bars, reading `labels[i]`,
  `values[i]`, and `colors[i]` together.
- `y = 440 + i * 28` — each bar sits 28 pixels below the one before.
- `percent = values[i] / rounds_played * 100` — this bar's share of all rounds.
- `95 + 380 * percent / 100` — the filled bar's right edge on a 380-wide track.
- `anchor="e"` puts the label's RIGHT edge at x=80 (so labels end neatly aligned);
  `anchor="w"` puts the percentage's LEFT edge at x=495.

### Do It in VS Code 🛠️
1. Add `rounds_played = 0`, `draw_stats`, and `rounds_played = rounds_played + 1`
   in `reveal` (with `global rounds_played`).
2. Call `draw_stats()` from `reveal`.
3. Save, run. Play several rounds and watch the bars shift.
4. Remove the zero-guard and run — crash! Put it back.

### Your Turn
1. Change the bar colours and make the track longer.
2. Add a fourth bar showing rounds played as a fraction of 10.
3. Predict the three percentages after 1 win, 1 loss, 0 draws. (50%, 50%, 0%.)

### 📸 Show Emrys
Screenshot your stats bars after several rounds. Tell Emrys your win percentage.

### Check Your Brain
- Why do we check `rounds_played == 0` first?
- How do the three lists line up with each other?
- What do `anchor="e"` and `anchor="w"` do?
- What sets each bar's length?

### More Examples
Parallel lists in the terminal:

```python
names = ["Ama", "Kofi"]
scores = [3, 5]
for i in range(2):
    print(names[i], "scored", scores[i])
```

### Common Mistakes
- **`ZeroDivisionError`:** dividing before any round is played. **Fix:** the guard.
- **Lists out of step:** adding a label but not a colour → `IndexError`. **Fix:**
  keep all three lists the same length.

### Level Up 🚀
Track your favourite move: count how often you throw each one and show that as a
fourth set of bars.

---

## Lesson 23: Polish — Arena Feel

### Big Idea
Small touches — a reset, locked sizing, and a celebration — turn a program into a
game.

### Kid Meaning
The difference between "it works" and "let's play again" is polish.

### Arena Connection
This is the final layer before your showcase.

### The Code
```python
def celebrate():
    for i in range(30):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        canvas.create_text(x, y, text="*", fill="#ffd54a",
                           font=("Arial", 18), tags="stars")

def new_match():
    global score, rounds_played, busy, match_over
    score = {"you": 0, "computer": 0, "draws": 0}
    rounds_played = 0
    busy = False
    match_over = False
    canvas.delete("stars")
    canvas.delete("stats")
    draw_score()
    draw_hand(LEFT_X, HAND_Y, "rock", 1, YELLOW, "left")
    draw_hand(RIGHT_X, HAND_Y, "rock", -1, BLUE, "right")
    show_msg("Pick your move!", "white")
```

### What You'll See
Winning a match scatters **30 gold stars** across the arena. The **New Match**
button wipes everything clean — score, stats, stars — and puts both fists back in
the ready position.

### Line by Line
- `celebrate()` — a `for` loop (Lesson 12) scattering stars at `random` positions
  (Lesson 13). Two old skills combining.
- `random.randint(0, WIDTH)` — a random whole number anywhere across the arena.
- `tags="stars"` — so `new_match` can sweep them all away.
- `new_match` resets **four** things at once: the score dictionary, the round
  count, and both flags. Miss one and the new match starts broken.
- `score = {...}` — building a brand-new dictionary is the cleanest way to reset
  all three counters together.
- Redrawing both hands as `"rock"` puts the fighters back in their ready stance.

### Do It in VS Code 🛠️
1. Add `celebrate` and `new_match`, plus a **New Match** button.
2. Add `root.resizable(False, False)` near the top if it isn't there.
3. Save, run. Win a match, see the stars, then hit New Match.

### Your Turn
1. Change the star symbol and count.
2. Make `new_match` also show a "Round 1 - FIGHT!" banner.
3. Predict what breaks if `new_match` forgets `match_over = False`. (Buttons stay
   dead!)

### 📸 Show Emrys
Screenshot your victory stars AND the freshly reset arena. Tell Emrys the four
things `new_match` resets.

### Check Your Brain
- Which four things must `new_match` reset?
- Why do the stars need their own tag?
- What does `random.randint(0, WIDTH)` give?
- Why lock the window size?

### More Examples
Resetting several values at once:

```python
def reset():
    global score, lives
    score = 0
    lives = 3
```

### Common Mistakes
- **Stars piling up:** forgetting `canvas.delete("stars")`. **Fix:** delete them in
  `new_match`.
- **Forgetting one flag:** the arena looks reset but won't respond. **Fix:** reset
  `busy` AND `match_over`.

### Level Up 🚀
Animate the stars falling down the arena using `root.after`, like real confetti.

---

## Lesson 24: Showcase and Reflection

### Big Idea
Assemble the complete Rock Paper Scissors Arena and show it off — you built a real
animated game!

### Kid Meaning
Every piece you learned — windows, shapes, loops, buttons, variables, maths,
if/elif, booleans, dictionaries, functions, return, random, and animation — comes
together into one game you can play and share.

### Arena Connection
This is the finished product. Read it, run it, and be proud.

### The Code
```python
import tkinter as tk
import random

WIDTH, HEIGHT = 700, 540
LEFT_X, RIGHT_X, HAND_Y = 180, 520, 250
YELLOW, BLUE = "#ffd54a", "#7db4ff"
WIN_TARGET = 3

root = tk.Tk()
root.title("Rock Paper Scissors Arena")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#141428")
canvas.pack()

CHOICES = ["rock", "paper", "scissors"]
BEATS = {"rock": "scissors", "paper": "rock", "scissors": "paper"}

score = {"you": 0, "computer": 0, "draws": 0}
rounds_played = 0
busy = False
match_over = False
player_choice = "rock"

def fingers_for(shape):
    if shape == "rock":
        return 0
    elif shape == "paper":
        return 4
    else:
        return 2

def draw_hand(cx, cy, shape, direction, color, tag):
    canvas.delete(tag)
    canvas.create_oval(cx - 55, cy - 55, cx + 55, cy + 55, fill=color,
                       outline="", tags=tag)
    fingers = fingers_for(shape)
    spacing = 28 if shape == "paper" else 60
    for k in range(fingers):
        fy = cy - (fingers - 1) * spacing / 2 + k * spacing
        x1 = cx + direction * 40
        x2 = cx + direction * 112
        canvas.create_rectangle(min(x1, x2), fy - 9, max(x1, x2), fy + 9,
                                fill=color, outline="", tags=tag)

def show_msg(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH / 2, 385, text=text, fill=color,
                       font=("Arial", 22, "bold"), tags="msg")

def draw_score():
    canvas.delete("score")
    canvas.create_text(WIDTH / 2, 40, text="ROCK PAPER SCISSORS ARENA",
                       fill="#ffd54a", font=("Arial", 20, "bold"),
                       tags="score")
    canvas.create_text(WIDTH / 2, 78,
                       text=f"You {score['you']}  -  {score['computer']} Computer"
                            f"   (draws: {score['draws']})",
                       fill="white", font=("Arial", 15), tags="score")
    canvas.create_text(WIDTH / 2, 105,
                       text=f"First to {WIN_TARGET} wins the match",
                       fill="#8fa0d8", font=("Arial", 11), tags="score")
    canvas.create_text(LEFT_X, 150, text="YOU", fill=YELLOW,
                       font=("Arial", 14, "bold"), tags="score")
    canvas.create_text(RIGHT_X, 150, text="COMPUTER", fill=BLUE,
                       font=("Arial", 14, "bold"), tags="score")
    canvas.create_text(WIDTH / 2, HAND_Y, text="VS", fill="#5a5ac0",
                       font=("Arial", 26, "bold"), tags="score")

def draw_stats():
    canvas.delete("stats")
    if rounds_played == 0:
        return
    labels = ["Wins", "Losses", "Draws"]
    values = [score["you"], score["computer"], score["draws"]]
    colors = [YELLOW, BLUE, "#8fa0d8"]
    for i in range(3):
        y = 440 + i * 28
        percent = values[i] / rounds_played * 100
        canvas.create_text(80, y, text=labels[i], fill="white", anchor="e",
                           font=("Arial", 11), tags="stats")
        canvas.create_rectangle(95, y - 9, 95 + 380, y + 9, outline="#3a4a90",
                                tags="stats")
        canvas.create_rectangle(95, y - 9, 95 + 380 * percent / 100, y + 9,
                                fill=colors[i], outline="", tags="stats")
        canvas.create_text(495, y, text=f"{percent:.0f}%", fill="white",
                           anchor="w", font=("Arial", 11), tags="stats")

def celebrate():
    for i in range(30):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        canvas.create_text(x, y, text="*", fill="#ffd54a",
                           font=("Arial", 18), tags="stars")

def play(choice):
    global busy, player_choice
    if busy or match_over:
        return
    busy = True
    player_choice = choice
    shake(6)

def shake(count):
    if count == 0:
        reveal()
        return
    offset = 25 if count % 2 == 0 else -25
    draw_hand(LEFT_X, HAND_Y + offset, "rock", 1, YELLOW, "left")
    draw_hand(RIGHT_X, HAND_Y + offset, "rock", -1, BLUE, "right")
    show_msg("Rock... Paper... Scissors...", "#8fa0d8")
    root.after(200, lambda: shake(count - 1))

def reveal():
    global busy, rounds_played, match_over
    computer_choice = random.choice(CHOICES)
    draw_hand(LEFT_X, HAND_Y, player_choice, 1, YELLOW, "left")
    draw_hand(RIGHT_X, HAND_Y, computer_choice, -1, BLUE, "right")
    if player_choice == computer_choice:
        score["draws"] = score["draws"] + 1
        show_msg(f"Draw! Both chose {player_choice}.", "#8fa0d8")
    elif BEATS[player_choice] == computer_choice:
        score["you"] = score["you"] + 1
        show_msg(f"You win! {player_choice} beats {computer_choice}.", "#7CFC00")
    else:
        score["computer"] = score["computer"] + 1
        show_msg(f"Computer wins! {computer_choice} beats {player_choice}.",
                 "#ff6b6b")
    rounds_played = rounds_played + 1
    draw_score()
    draw_stats()
    busy = False
    if score["you"] >= WIN_TARGET or score["computer"] >= WIN_TARGET:
        match_over = True
        if score["you"] >= WIN_TARGET:
            show_msg("YOU WIN THE MATCH!", "#7CFC00")
            celebrate()
        else:
            show_msg("Computer wins the match!", "#ff6b6b")

def new_match():
    global score, rounds_played, busy, match_over
    score = {"you": 0, "computer": 0, "draws": 0}
    rounds_played = 0
    busy = False
    match_over = False
    canvas.delete("stars")
    canvas.delete("stats")
    draw_score()
    draw_hand(LEFT_X, HAND_Y, "rock", 1, YELLOW, "left")
    draw_hand(RIGHT_X, HAND_Y, "rock", -1, BLUE, "right")
    show_msg("Pick your move!", "white")

buttons = tk.Frame(root)
buttons.pack(pady=6)
tk.Button(buttons, text="Rock", font=("Arial", 13), width=9,
          command=lambda: play("rock")).pack(side="left", padx=4)
tk.Button(buttons, text="Paper", font=("Arial", 13), width=9,
          command=lambda: play("paper")).pack(side="left", padx=4)
tk.Button(buttons, text="Scissors", font=("Arial", 13), width=9,
          command=lambda: play("scissors")).pack(side="left", padx=4)
tk.Button(buttons, text="New Match", font=("Arial", 11),
          command=new_match).pack(side="left", padx=14)

new_match()
root.mainloop()
```

### What You'll See
The full arena: two fighters, a dramatic shake countdown, the reveal, a referee
that names the winning move, a live scoreboard, percentage bars, best-of-3 match
play, a star-shower victory, and a New Match button.

### Line by Line
- Every function is one you built across the course. Read each name — you know
  exactly what it does now.
- The flow: a button calls `play()` → `shake()` bounces the hands → `reveal()`
  judges and scores → if someone hit the target, the match ends.
- Notice how the program is just **small machines calling each other**. That's how
  all real software is built.

### Do It in VS Code 🛠️
1. Make sure your `rps_arena.py` matches this complete version.
2. Save, run. Play several matches. Can you beat the computer 3-0?
3. Let a friend play and watch which part they enjoy most.

### Your Turn — Reflection
1. Which lesson was the hardest, and what finally made it click?
2. Add ONE personal touch (your fighter name, new colours, trash talk, a longer
   match).
3. Write two sentences: what are you proudest of building?

### 📸 Show Emrys
Screenshot your arena mid-shake AND your match victory with stars. Tell Emrys:
"Course complete!" and share your one personal touch.

### Check Your Brain
- Name three different concepts this game uses (there are many!).
- Which function judges the winner, and which one animates the hands?
- How would you explain the `BEATS` dictionary to a friend?

### More Examples
Ideas to keep growing your arena:

```python
# Give the computer a favourite move it plays more often
def computer_move():
    if random.randint(1, 10) <= 5:
        return "rock"
    return random.choice(CHOICES)
```

### Common Mistakes
- **Copy-paste errors:** if it won't run, read the terminal's red line number and
  check that exact line. **Fix:** compare it character by character.
- **Indentation drift:** mixed spaces break Python. **Fix:** keep 4 spaces per
  level everywhere.

### Level Up 🚀
Add Rock-Paper-Scissors-Lizard-Spock by expanding the `BEATS` dictionary so each
move beats TWO others, or add a two-player mode. You are officially a game
maker! 🎮
