# Quiz Game Lessons: Class 6 Edition (Graphics Version)

Build your very own **Quiz Game Show** — but this time you can SEE and CLICK it!
A real game-show window asks a question and shows **four answer cards**. You
**click** the one you think is right — it flashes **green** if you're correct,
**red** if not (and lights up the right answer so you learn). Your **score** and
your **lives** ❤ sit at the top, and at the end you get a dramatic **rank reveal**
with a shower of stars.

This project is for **Class 6** (around 11–12 years old). It assumes you have
**never written a single line of code before** — we start at absolute zero. It
uses Python with **tkinter**, the drawing kit that comes free inside Python —
nothing to install. Every line is explained in plain words so you truly
understand it, not just copy it. By the end you will have a real, working quiz
game show that you built yourself from scratch.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one core thing this lesson teaches.
- **Kid Meaning** — the same idea explained with a real-life analogy.
- **Quiz Connection** — how this fits our Quiz Game Show.
- **The Code** — the actual Python to type (it draws something you can see!).
- **What You'll See** — the picture or change that appears in the window.
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
(VS Code)** with the Python extension — the same editor professional
programmers use every day. The rhythm for every piece of code is always:

1. Open your project file in VS Code (or **File → New File**, saved as `name.py`).
2. Type the code in the editor.
3. Save: **Ctrl+S** (Windows) or **Cmd+S** (Mac).
4. Run: press the **▶ Run** button at the top-right.
5. A **window pops up** showing your quiz. Click around in it! (When you're done,
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

- **Part 1 — First Pictures (Lessons 1–8):** open a window, draw the quiz screen
  and answer cards, use variables and maths, and make cards CLICKABLE.
- **Part 2 — Making Choices (Lessons 9–16):** check answers with `if`, keep
  score, build lists of questions, and package it all into functions.
- **Part 3 — Building the Quiz (Lessons 17–24):** the question bank, lives,
  the main quiz flow, randomising, and the final rank reveal.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST PICTURES

## Lesson 1: What Is Code? Drawing the Quiz Screen

### Big Idea
Code is a list of instructions we give the computer, one line at a time — and
those instructions can draw a game-show screen.

### Kid Meaning
A recipe tells a cook what to do step by step. Code tells the computer what to do
step by step. The computer does EXACTLY what you say — nothing more, nothing less.
Today we tell it: "Draw me a quiz screen."

### Quiz Connection
Our whole game lives inside a window with a question at the top and answer cards
below. Before anything else, we must learn to make that window appear.

### The Code
```python
import tkinter as tk

root = tk.Tk()
root.title("Quiz Game Show")
canvas = tk.Canvas(root, width=640, height=400, bg="#12122b")
canvas.pack()

canvas.create_text(320, 80, text="QUIZ GAME SHOW", fill="#ffd54a",
                   font=("Arial", 30, "bold"))
canvas.create_text(320, 140, text="Get ready to play!", fill="white",
                   font=("Arial", 16))

root.mainloop()
```

### What You'll See
A dark purple window titled **"Quiz Game Show"** with a big gold title and a
white line underneath. Your game show has a stage!

### Line by Line
- `import tkinter as tk` — brings in Python's drawing kit and gives it the short
  nickname `tk` so we type less. Think of it as opening your box of crayons.
- `root = tk.Tk()` — makes the window itself. `root` is the name we'll use to
  talk to that window.
- `root.title("Quiz Game Show")` — writes the title at the top of the window.
- `canvas = tk.Canvas(root, width=640, height=400, bg="#12122b")` — puts a dark
  drawing sheet, 640 wide and 400 tall, inside the window. `canvas` is our paper.
- `canvas.pack()` — actually places the canvas into the window (without this, the
  paper stays hidden).
- `create_text(320, 80, ...)` — writes words centred at the spot 320 across and
  80 down.
- `font=("Arial", 30, "bold")` — the font name, the size, and the style.
- `#12122b` — a colour code. The `#` means "a colour written in computer code."
  You can also just write `"navy"` or `"black"`.
- `root.mainloop()` — the magic word that keeps the window open and waiting.
  Without it, the window would blink and vanish.

### Do It in VS Code 🛠️
1. **File → New File** → name it `quiz_screen.py` → save it on your Desktop.
2. Type the code above yourself (don't copy-paste — typing teaches your fingers).
3. Save: **Ctrl+S** (make the white "unsaved" dot on the tab disappear).
4. Press the **▶ Run** button. Your quiz screen should pop up!
5. Look at it. Then close it by clicking the **X**.

### Your Turn
1. Change the title to your own quiz name, like `"AMA'S BRAIN CHALLENGE"`.
2. Change the gold colour to something else.
3. Add a THIRD line of text underneath saying how many questions there will be.
4. BEFORE you run: predict what will be different. Then run. Were you right?

### 📸 Show Emrys
Take a screenshot of your quiz screen with YOUR title and **send it to Emrys**.
Say: "Lesson 1 done!" Emrys will give you your first ✅ of the course.

### Check Your Brain
- What does `import tkinter as tk` bring us?
- Which line makes the window actually appear and stay open?
- What do the two numbers in `create_text(320, 80, ...)` mean?
- What do the three parts of `font=("Arial", 30, "bold")` control?

### More Examples
Different sizes and colours:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=300, bg="black")
canvas.pack()
canvas.create_text(250, 80, text="ROUND 1", fill="lime", font=("Arial", 40, "bold"))
canvas.create_text(250, 160, text="Are you ready?", fill="white", font=("Arial", 14))
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
Add a subtitle in a different colour and a line of stars `"* * * * *"` under the
title to make it look like a real game show.

---

## Lesson 2: How to Run Python (and the Screen Map)

### Big Idea
We type code in a file, save it, and then "run" it — and every drawing lands at
a spot described by two numbers.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when the window pops up. And every shape needs an address on the
screen: how far across, and how far down.

### Quiz Connection
Our answer cards must sit in a neat 2×2 grid. Getting them in the right places is
all about knowing how the screen is mapped.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=600, height=400, bg="white")
canvas.pack()

canvas.create_rectangle(100, 100, 300, 200, fill="skyblue")
canvas.create_text(200, 150, text="I am a card", fill="black")

root.mainloop()
```

### What You'll See
A white window with a **blue card**, and words in its middle telling you what it
is.

### Line by Line
- `create_rectangle(100, 100, 300, 200, ...)` — the first two numbers
  `(100, 100)` are the **top-left corner**, the next two `(300, 200)` are the
  **bottom-right corner**. That makes a card 200 wide and 100 tall.
- `create_text(200, 150, ...)` — writes words centred inside the card.

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

Remember this and your cards go exactly where you expect. Forget it and your
bottom row ends up above the top row — that's not a bug, it's just the screen
map. (This is why the question sits at a SMALL y and the cards at a BIG y: the
question is HIGHER on the screen.)

### Slow Motion 🔬 — writing vs running
There are TWO different moments, and mixing them up confuses every beginner:

- **Writing** = typing the code into the editor. Nothing happens yet.
- **Saving** = Ctrl+S. Your words are safely on the disk. STILL nothing happens.
- **Running** = pressing **▶**. NOW Python reads your file and the window pops up.

The biggest trap: changing the code and running WITHOUT saving — the computer
runs the OLD version and you wonder why nothing changed. Burn this rhythm into
your fingers: **type → Ctrl+S → ▶ → look at the window.** Every time. Forever.

### Do It in VS Code 🛠️
1. **File → New File** → name it `card_map.py` → save on your Desktop.
2. Type the code above.
3. **Ctrl+S**, then press **▶ Run**.
4. Change the card to `create_rectangle(320, 100, 520, 200, ...)`. Predict where
   it moves BEFORE you run. (Answer: to the right!)

### Your Turn
1. Draw a second card BELOW the first one. Which number do you make bigger?
2. Draw a card in the **top-right** corner.
3. Draw a dot at `(0, 0)` — where does it land? (Try
   `create_oval(0, 0, 20, 20, fill="red")`.)

### 📸 Show Emrys
Screenshot your window with two cards, one above the other. Tell Emrys which
number you changed to move the second one down.

### Check Your Brain
- Where is the point `(0, 0)` on the canvas?
- Which direction does **y** get bigger — up or down?
- To move a card RIGHT, which number do you change?
- Why must you SAVE before you run?

### More Examples
Three cards marching down the screen (watch y grow):

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=300, height=400, bg="white")
canvas.pack()
canvas.create_rectangle(50, 40, 250, 100, fill="#ffcccc")
canvas.create_rectangle(50, 140, 250, 200, fill="#ccffcc")
canvas.create_rectangle(50, 240, 250, 300, fill="#ccccff")
root.mainloop()
```

### Common Mistakes
- **Thinking up is bigger:** using a big y to go "up" sends the card DOWN.
  **Fix:** smaller y = higher.
- **Corners backwards:** if the second corner is smaller than the first, the card
  can vanish. **Fix:** first pair = top-left, second pair = bottom-right.

### Level Up 🚀
Draw four cards in a neat 2×2 grid by hand (just typing numbers). Next lessons
will teach you to do it with maths and a loop instead!

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that remembers a value so we can use it again.

### Kid Meaning
A box with a label. You write `score = 0` and now the box called `score` holds 0.
Whenever you say `score`, the computer looks in the box and uses what's inside.

### Quiz Connection
Our quiz must remember the score, the lives, and which question we're on.
Variables are how the computer remembers.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=640, height=300, bg="#12122b")
canvas.pack()

score = 0
lives = 3
player = "Ama"

canvas.create_text(320, 80, text="QUIZ GAME SHOW", fill="#ffd54a",
                   font=("Arial", 26, "bold"))
canvas.create_text(320, 150, text=player, fill="white", font=("Arial", 18))
canvas.create_text(150, 200, text=score, fill="#7CFC00", font=("Arial", 20))
canvas.create_text(490, 200, text=lives, fill="#ff6b6b", font=("Arial", 20))

root.mainloop()
```

### What You'll See
The quiz screen showing the player's name, a green score of **0**, and red lives
of **3** — all coming from boxes.

### Line by Line
- `score = 0` — makes a box named `score` and puts 0 inside.
- `lives = 3` — another box, holding how many chances the player has.
- `player = "Ama"` — a box holding TEXT. Text needs quotes; numbers don't.
- `text=score` — instead of typing a number, we hand `create_text` the box, and it
  shows whatever is inside.
- Change `score = 0` to `score = 5`, run again, and the screen updates — you never
  touched the drawing line.

### Do It in VS Code 🛠️
1. New file `quiz_vars.py`. Type the code.
2. Save and run — see 0 and 3.
3. Change `score = 0` to `score = 7`. Save, run. The green number changed!
4. Change `player` to your own name.

### Your Turn
1. Add a `question_number = 1` box and show it at the top.
2. Set `lives = 1` and see the red number change.
3. Predict what shows if you set `score = 100`.

### 📸 Show Emrys
Send a screenshot with YOUR name and a different score. Tell Emrys which
variables you changed.

### Check Your Brain
- What is a variable?
- Which box holds text, and how can you tell?
- Why is `text=score` better than typing the number directly?

### More Examples
Boxes feeding other boxes:

```python
score = 4
total = 10
print(score, "out of", total)
```

### Common Mistakes
- **Using a box before filling it:** using `score` before `score = 0` →
  `NameError`. **Fix:** create the box first, above where you use it.
- **Forgetting quotes on text:** `player = Ama` → `NameError`. **Fix:**
  `player = "Ama"`.

### Level Up 🚀
Add a `title` variable holding your quiz name and use it in the `create_text` so
you can rename your show by changing ONE line.

---

## Lesson 4: Numbers and Quiz Maths

### Big Idea
Python can do maths, and we use maths to work out scores, percentages, and where
every card goes.

### Kid Meaning
Python is a super-fast calculator. `+ - * /` mean add, subtract, multiply,
divide. We use them to place cards in a neat grid without guessing.

### Quiz Connection
"You scored 4 out of 6" is maths. And each answer card's position comes from
multiplying its column and row numbers.

### The Code
```python
import tkinter as tk

WIDTH = 640
CARD_W, CARD_H = 260, 90

root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=380, bg="#12122b")
canvas.pack()

score = 4
total = 6
percent = score / total * 100

canvas.create_text(WIDTH/2, 50, text=f"Score: {score} of {total}",
                   fill="#ffd54a", font=("Arial", 20))
canvas.create_text(WIDTH/2, 90, text=f"That is {percent:.0f} percent!",
                   fill="white", font=("Arial", 14))

# Two cards, positioned with maths
left_x = 40
right_x = 40 + CARD_W + 40
canvas.create_rectangle(left_x, 150, left_x + CARD_W, 150 + CARD_H,
                        fill="#26264d", outline="#5a5ac0", width=3)
canvas.create_rectangle(right_x, 150, right_x + CARD_W, 150 + CARD_H,
                        fill="#26264d", outline="#5a5ac0", width=3)

root.mainloop()
```

### What You'll See
"Score: 4 of 6" and "That is 67 percent!", plus two evenly spaced answer cards
side by side.

### Line by Line
- `percent = score / total * 100` — divide, then multiply by 100. Python does `/`
  and `*` left to right.
- `f"{percent:.0f}"` — the `:.0f` means "show this number with **0** digits after
  the dot" — so `66.666` becomes `67`. Much tidier for kids to read.
- `left_x = 40` — the first card starts 40 pixels from the left edge.
- `right_x = 40 + CARD_W + 40` — start, plus the card's width, plus a 40-pixel gap.
  Now the two cards are perfectly spaced no matter how wide the cards are.
- `left_x + CARD_W` — the card's right edge. Using width maths beats typing the
  end position by hand.

### Do It in VS Code 🛠️
1. New file `quiz_maths.py`. Type the code.
2. Save, run — see the score and the two cards.
3. Change `CARD_W = 200`. Save, run. Both cards resized AND respaced by themselves!

### Your Turn
1. Change `score` to 6 and check the percent shows 100.
2. Make the gap between cards bigger (change both `40`s to `60`).
3. Print some maths to the terminal: `print(10 + 5, 10 * 5, 10 / 5)`.

### 📸 Show Emrys
Screenshot your score line with a different score and percent. Tell Emrys the
maths you used.

### Check Your Brain
- What does `score / total * 100` work out?
- What does `:.0f` do to a number?
- Why is `40 + CARD_W + 40` better than typing 340?

### More Examples
Integer division and remainder (used for grids later!):

```python
print(7 // 2)   # 3  (how many whole 2s fit in 7)
print(7 % 2)    # 1  (what's left over)
```

### Common Mistakes
- **Dividing by zero:** `score / 0` → `ZeroDivisionError`. **Fix:** make sure
  `total` is never 0.
- **Long decimals everywhere:** `66.66666` looks messy. **Fix:** use `:.0f`.

### Level Up 🚀
Show the percent as a **bar**: draw a rectangle whose width is
`percent / 100 * 400`. Instant progress bar!

---

## Lesson 5: Counting — Updating the Score

### Big Idea
Adding to a variable and redrawing is how a score goes up on screen.

### Kid Meaning
`score = score + 1` means "take what's in the box, add one, put it back." Then we
wipe the old number and draw the new one.

### Quiz Connection
Every correct answer does exactly this. It's the heartbeat of the game.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=250, bg="#12122b")
canvas.pack()

score = 0

def add_point():
    global score
    score = score + 1
    canvas.delete("score")
    canvas.create_text(200, 100, text=f"Score: {score}", fill="#7CFC00",
                       font=("Arial", 28, "bold"), tags="score")

add_point()
tk.Button(root, text="Correct answer! +1", command=add_point).pack(pady=10)

root.mainloop()
```

### What You'll See
"Score: 1" appears. Every time you click the button, it climbs: 2, 3, 4… The old
number is wiped before the new one is drawn.

### Line by Line
- `score = 0` — the box lives OUTSIDE the function so it survives between clicks.
- `global score` — tells Python "use the OUTSIDE box, don't make a new one inside."
  Without this the score would reset to 0 every click.
- `score = score + 1` — the counting step. Read it right-to-left: work out
  `score + 1`, then store the result back in `score`.
- `canvas.delete("score")` — erases only the item tagged `"score"`.
- `tags="score"` — a **label** on the drawing so we can delete just that one thing
  later, instead of wiping the whole canvas.

### Do It in VS Code 🛠️
1. New file `counting.py`. Type the code.
2. Save, run. Click the button several times and watch the score climb.
3. Remove `global score`, save, run, and click — it sticks at 1! Now you've SEEN
   why `global` matters. Put it back.

### Your Turn
1. Make each click add 5 instead of 1.
2. Add a second button that SUBTRACTS one (a wrong answer).
3. Predict the score after 4 clicks of a `+2` button.

### 📸 Show Emrys
Screenshot your score after several clicks. Tell Emrys how much each click adds.

### Check Your Brain
- What does `score = score + 1` do?
- Why must `score` live outside the function?
- What does `global score` allow?
- What does `tags="score"` let us do later?

### More Examples
Counting in the terminal:

```python
count = 0
count = count + 1
count = count + 1
print(count)   # shows 2
```

### Common Mistakes
- **Forgetting `global`:** `UnboundLocalError` or the score never grows. **Fix:**
  add `global score` at the top of the function.
- **Numbers stacking up:** forgetting `canvas.delete("score")` draws the new
  number ON TOP of the old one. **Fix:** delete by tag first.

### Level Up 🚀
Make the score turn **gold** when it passes 5 (hint: you'll learn `if` in
Lesson 9 — come back and try it!).

---

## Lesson 6: Clicking a Card — the Player's Answer

### Big Idea
We can make a shape **clickable**, so the player answers by clicking a card.

### Kid Meaning
On a quiz show you don't type your answer — you press a buzzer or point at a
card. `tag_bind` turns any shape into a button you can click.

### Quiz Connection
This is HUGE: it's how the player answers every question in our game. No typing
at all.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=300, bg="#12122b")
canvas.pack()

def card_clicked():
    canvas.delete("msg")
    canvas.create_text(250, 250, text="You clicked the card!", fill="#7CFC00",
                       font=("Arial", 16), tags="msg")

canvas.create_rectangle(120, 80, 380, 180, fill="#26264d",
                        outline="#5a5ac0", width=3, tags="mycard")
canvas.create_text(250, 130, text="CLICK ME", fill="white",
                   font=("Arial", 18), tags="mycard")

canvas.tag_bind("mycard", "<Button-1>", lambda event: card_clicked())

root.mainloop()
```

### What You'll See
A card sitting in the window. **Click it** and a green message appears below:
"You clicked the card!"

### Line by Line
- `tags="mycard"` — BOTH the rectangle and the text carry the same label, so the
  whole card (box + words) is one clickable thing.
- `canvas.tag_bind("mycard", "<Button-1>", ...)` — "when anything tagged
  `mycard` gets a **left mouse click**, run this."
- `"<Button-1>"` — tkinter's name for the **left** mouse button. (`<Button-3>` is
  the right button.)
- `lambda event: card_clicked()` — tkinter hands the handler an `event` describing
  the click. Our function doesn't need it, so `lambda event:` politely accepts and
  ignores it, then calls our real function.

### Do It in VS Code 🛠️
1. New file `clickable.py`. Type the code.
2. Save, run. Click the card — the message appears.
3. Click the dark background instead — nothing happens. Only the tagged card
   listens!

### Your Turn
1. Change the card's words to a real answer, like `"Mars"`.
2. Make the message say which answer was clicked.
3. Add a SECOND card with tag `"card2"` and its own click function.

### 📸 Show Emrys
Screenshot your window AFTER clicking the card (message showing). Tell Emrys what
your card says.

### Check Your Brain
- What does `tag_bind` do?
- What does `"<Button-1>"` mean?
- Why do the rectangle AND the text share the same tag?
- Why does the handler have `event` in it?

### More Examples
Making a circle clickable:

```python
canvas.create_oval(50, 50, 150, 150, fill="gold", tags="ball")
canvas.tag_bind("ball", "<Button-1>", lambda event: print("Ball clicked!"))
```

### Common Mistakes
- **Binding before creating:** `tag_bind` only affects shapes that exist (or are
  made later with that tag). **Fix:** create the shapes, then bind.
- **Forgetting `event`:** `lambda: card_clicked()` → `TypeError`, because tkinter
  always passes the event. **Fix:** `lambda event: card_clicked()`.
- **Only tagging the rectangle:** clicking the words does nothing. **Fix:** tag
  both.

### Level Up 🚀
Make the card change colour when clicked using
`canvas.itemconfig("mycard", fill="green")` — a preview of Lesson 18!

---

## Lesson 7: f-strings — Mixing Words and Values

### Big Idea
An f-string lets us build a sentence with values dropped inside it.

### Kid Meaning
Instead of gluing words and numbers together awkwardly, put an `f` before the
quotes and drop any box inside `{ }`. Python fills in the value for you.

### Quiz Connection
"Question 3 of 6" and "Score: 4" are sentences with numbers dropped in. f-strings
build every label in our game.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=280, bg="#12122b")
canvas.pack()

player = "Ama"
score = 4
total = 6
current = 3

canvas.create_text(250, 60, text=f"Good luck, {player}!", fill="#ffd54a",
                   font=("Arial", 20, "bold"))
canvas.create_text(250, 120, text=f"Question {current} of {total}",
                   fill="#8fa0d8", font=("Arial", 14))
canvas.create_text(250, 170, text=f"Score: {score}", fill="#7CFC00",
                   font=("Arial", 22))
canvas.create_text(250, 220, text=f"You need {total - score} more to win!",
                   fill="white", font=("Arial", 13))

root.mainloop()
```

### What You'll See
A tidy game-show panel: "Good luck, Ama!", "Question 3 of 6", "Score: 4", and
"You need 2 more to win!" — that last number worked out by maths INSIDE the
f-string.

### Line by Line
- `f"Good luck, {player}!"` — the `f` before the quotes turns on the magic.
  Anything inside `{ }` is a box name, and Python drops its value in.
- `f"Question {current} of {total}"` — two boxes in one sentence.
- `f"You need {total - score} more to win!"` — you can do **maths** inside the
  braces, not just names. Python works it out first, then drops the answer in.

### Do It in VS Code 🛠️
1. New file `labels.py`. Type the code.
2. Save, run. Read all four lines.
3. Change `score` to 6 and check the last line now says "You need 0 more".

### Your Turn
1. Add a line showing the percent: `f"{score / total * 100:.0f}%"`.
2. Show the player's name in CAPITALS: `f"{player.upper()}"`.
3. Predict what `f"{total - score}"` shows when score is 2.

### 📸 Show Emrys
Screenshot your panel with your own name and score. Tell Emrys which line uses
maths inside the braces.

### Check Your Brain
- What does the `f` before the quotes do?
- What can go inside the `{ }` — just names?
- What does `:.0f` do (from Lesson 4)?

### More Examples
f-strings in the terminal:

```python
name = "Kofi"
score = 5
print(f"{name} scored {score} points.")
print(f"Double that is {score * 2}.")
```

### Common Mistakes
- **Forgetting the `f`:** `"{score}"` prints the braces literally as `{score}`.
  **Fix:** put `f` right before the opening quote.
- **Wrong box name inside braces:** `{scor}` → `NameError`. **Fix:** spell it
  exactly as you named it.

### Level Up 🚀
Build a one-line "scoreboard" f-string that shows name, score, question number
and percent all together, separated by ` | `.

---

## Lesson 8: Mini-Project — Quiz Registration Desk

### Big Idea
Put together windows, Entry, buttons, variables, and f-strings into one small
finished program.

### Kid Meaning
This is your first real mini-app: the player signs in, and the game welcomes them
to the show. You already know every piece — now we assemble them.

### Quiz Connection
This is the welcome screen of the real game, and a rehearsal for the whole thing:
take input, store it, redraw the screen.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 560, 340
root = tk.Tk()
root.title("Quiz Registration")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#12122b")
canvas.pack()

def sign_in():
    player = entry.get().strip().title()
    if player == "":
        player = "Mystery Player"
    canvas.delete("all")
    canvas.create_text(WIDTH/2, 70, text="QUIZ GAME SHOW", fill="#ffd54a",
                       font=("Arial", 28, "bold"))
    canvas.create_text(WIDTH/2, 140, text=f"Welcome, {player}!", fill="white",
                       font=("Arial", 22))
    canvas.create_text(WIDTH/2, 190, text="6 questions - 3 lives - good luck!",
                       fill="#8fa0d8", font=("Arial", 13))
    canvas.create_rectangle(WIDTH/2 - 90, 230, WIDTH/2 + 90, 285,
                            fill="#26264d", outline="#5a5ac0", width=3)
    canvas.create_text(WIDTH/2, 257, text="READY", fill="#7CFC00",
                       font=("Arial", 20, "bold"))
    entry.delete(0, tk.END)

canvas.create_text(WIDTH/2, 120, text="Type your name to sign in",
                   fill="white", font=("Arial", 16))
entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=8)
entry.bind("<Return>", lambda event: sign_in())
entry.focus()
tk.Button(root, text="Sign in", font=("Arial", 13), command=sign_in).pack()

root.mainloop()
```

### What You'll See
A sign-in screen. Type your name, press **Sign in** (or **Enter**), and the whole
screen becomes a game-show welcome with your name and a green READY card.

### Line by Line
- `entry.get().strip().title()` — read what they typed, remove spare spaces, and
  capitalise it neatly. Three little jobs **chained** together.
- `if player == "":` — if they typed nothing, we give them a fun default instead
  of an empty greeting. (Your first `if` — full lesson next!)
- `root.resizable(False, False)` — locks the window size so buttons can never get
  pushed off the screen.
- `entry.bind("<Return>", ...)` — the **Enter** key signs in too, like a real app.
- `entry.focus()` — puts the typing cursor in the box automatically.

### Do It in VS Code 🛠️
1. New file `registration.py`. Type the whole program.
2. Save, run. Type your name, press Enter, admire your welcome screen!
3. Try pressing Sign in with an EMPTY box — meet "Mystery Player".

### Your Turn
1. Change the colours and the welcome message.
2. Change the number of questions and lives in the info line.
3. Add your school's name somewhere on the screen.

### 📸 Show Emrys
Screenshot your finished welcome screen with your name. Tell Emrys: "Part 1
mini-project done!"

### Check Your Brain
- Which line reads what the player typed?
- What do `.strip()` and `.title()` each do?
- Why lock the window size?
- What happens when the box is empty?

### More Examples
Chaining text jobs:

```python
messy = "   kofi  "
print(messy.strip().title())   # "Kofi"
```

### Common Mistakes
- **Widgets not showing:** every Entry and Button needs `.pack()`. **Fix:** add it.
- **Old screen stays:** clear with `canvas.delete("all")` at the start of the
  function.

### Level Up 🚀
Add a "Change name" button that brings the sign-in screen back so a new player
can take a turn.

---

# PART 2 — MAKING CHOICES

## Lesson 9: Making Decisions with if

### Big Idea
`if` lets the program CHOOSE what to do — like checking whether an answer is right.

### Kid Meaning
"IF the answer is correct, turn the card green." The computer checks — is it
true? — and only then does the action.

### Quiz Connection
This is the heart of the whole game: checking the clicked card against the
correct answer.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=320, bg="#12122b")
canvas.pack()

correct = 1        # card number 1 is the right answer

def clicked(n):
    canvas.delete("msg")
    if n == correct:
        canvas.itemconfig(f"rect{n}", fill="#1f7a3a")
        canvas.create_text(250, 280, text="Correct!", fill="#7CFC00",
                           font=("Arial", 18, "bold"), tags="msg")

canvas.create_text(250, 50, text="Which is the Red Planet?", fill="white",
                   font=("Arial", 16, "bold"))

names = ["Venus", "Mars"]
for i in range(2):
    x = 60 + i * 200
    canvas.create_rectangle(x, 120, x + 160, 200, fill="#26264d",
                            outline="#5a5ac0", width=3,
                            tags=(f"card{i}", f"rect{i}"))
    canvas.create_text(x + 80, 160, text=names[i], fill="white",
                       font=("Arial", 15), tags=(f"card{i}", f"txt{i}"))
    canvas.tag_bind(f"card{i}", "<Button-1>", lambda event, n=i: clicked(n))

root.mainloop()
```

### What You'll See
Two cards: **Venus** and **Mars**. Click **Mars** → it turns green and "Correct!"
appears. Click Venus → nothing happens (we add that next lesson).

### Line by Line
- `correct = 1` — card number **1** is right. Remember, we count from **0**, so
  card 0 is Venus and card 1 is Mars.
- `if n == correct:` — checks: is the clicked card the right one? `==` means "is
  exactly equal to" (two equals signs!).
- `canvas.itemconfig(f"rect{n}", fill="#1f7a3a")` — **changes a shape that already
  exists**. `itemconfig` means "reconfigure this item" — here, repaint it green.
- Two tags per card: `card{i}` for **clicking** (covers box AND text) and
  `rect{i}` for **colouring** (just the box, so the words stay white).
- `lambda event, n=i: clicked(n)` — the `n=i` part is important! It **saves which
  card this is, right now**. Without it, every card would think it was the last
  one. (A classic Python trap — you just learned it early!)

### Do It in VS Code 🛠️
1. New file `check_answer.py`. Type the code.
2. Save, run. Click Mars → green + "Correct!". Click Venus → nothing.
3. Change `correct = 0` and run. Now Venus is the right answer!

### Your Turn
1. Change the question and both answers to your own.
2. Set `correct` to the right card number for your question.
3. Predict what happens if you set `correct = 5` (no card matches — nothing works).

### 📸 Show Emrys
Screenshot the green correct card with the message. Tell Emrys your question and
which card number was correct.

### Check Your Brain
- What does `if` do?
- What is the difference between `=` and `==`?
- What does `itemconfig` change?
- Why do we need `n=i` in the lambda?

### More Examples
A simple if in the terminal:

```python
score = 8
if score > 5:
    print("Well done!")
```

### Common Mistakes
- **`=` instead of `==`:** `if n = correct:` → `SyntaxError`. **Fix:** use `==`.
- **Forgetting the colon** after the `if` line. **Fix:** add `:` and indent below.
- **Forgetting `n=i`:** every card behaves like the last one. **Fix:** add `n=i`.

### Level Up 🚀
Also turn the card's OUTLINE bright green when correct:
`canvas.itemconfig(f"rect{n}", fill="#1f7a3a", outline="#7CFC00")`.

---

## Lesson 10: if / elif / else — Ranks and Reactions

### Big Idea
`if / elif / else` handles several possibilities: right, wrong, or a final rank.

### Kid Meaning
"IF correct, celebrate. ELSE, show the right answer." And at the end: "IF score is
huge, QUIZ MASTER. ELSE IF good, Brilliant. ELSE, keep practising."

### Quiz Connection
Both halves of our game need this: reacting to each answer, and awarding the final
rank.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=300, bg="#12122b")
canvas.pack()

def show_rank(points):
    canvas.delete("all")
    if points >= 6:
        rank = "QUIZ MASTER"
        color = "#ffd54a"
    elif points >= 4:
        rank = "Brilliant"
        color = "#7CFC00"
    elif points >= 2:
        rank = "Good effort"
        color = "#8fa0d8"
    else:
        rank = "Keep practising"
        color = "#ff9999"
    canvas.create_text(230, 100, text=f"You scored {points}", fill="white",
                       font=("Arial", 20))
    canvas.create_text(230, 170, text=rank, fill=color,
                       font=("Arial", 26, "bold"))

show_rank(5)

root.mainloop()
```

### What You'll See
"You scored 5" and the rank **Brilliant** in green. Change the number in
`show_rank(5)` and you get a different rank and colour every time.

### Line by Line
- `if points >= 6:` — first check. `>=` means "greater than or equal to". If true,
  do this and SKIP the rest.
- `elif points >= 4:` — "else if" — only checked if the first was false.
- `else:` — the leftover case, when nothing above matched.
- **Order matters!** We check the BIGGEST score first. If we checked `>= 2` first,
  a score of 6 would stop there and wrongly say "Good effort".
- We store the results in `rank` and `color` boxes, then draw ONCE at the bottom —
  tidier than repeating the drawing code in every branch.

### Do It in VS Code 🛠️
1. New file `ranks.py`. Type the code.
2. Save, run — "Brilliant".
3. Try `show_rank(6)`, `show_rank(3)`, `show_rank(0)` — all four ranks.
4. Now flip the order (put `>= 2` first) and try 6 again. See the bug! Put it back.

### Your Turn
1. Invent your own four rank names.
2. Add a FIFTH rank for a perfect score using another `elif`.
3. Predict the rank for a score of 4.

### 📸 Show Emrys
Screenshot two different ranks (two shots). Tell Emrys your rank names and the
scores that trigger them.

### Check Your Brain
- What is the difference between `if` and `elif`?
- When does `else` run?
- Why must the biggest score be checked FIRST?
- What does `>=` mean?

### More Examples
The classic grader:

```python
score = 85
if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"
print(grade)
```

### Common Mistakes
- **Wrong order:** checking small numbers first makes big scores get low ranks.
  **Fix:** biggest first.
- **Many `if`s instead of `elif`:** several branches run and the last one wins.
  **Fix:** use `elif`/`else`.

### Level Up 🚀
Give each rank its own celebration: draw stars only when the rank is QUIZ MASTER.

---

## Lesson 11: True and False — Booleans

### Big Idea
Every check is either True or False — those two values are called Booleans.

### Kid Meaning
A light switch is on or off. A check is True or False. `n == correct` is a
question Python answers with True or False.

### Quiz Connection
"Was that answer right?" is a True/False fact. We can store it and use it to
decide the colour, the score, and the message.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=300, bg="#12122b")
canvas.pack()

correct = 1
score = 0
locked = False        # has the player already answered?

def answer(n):
    global score, locked
    is_right = (n == correct)
    canvas.delete("msg")
    canvas.create_text(230, 200, text=f"is_right = {is_right}",
                       fill="white", font=("Arial", 14), tags="msg")
    if is_right:
        score = score + 1
        canvas.create_text(230, 240, text=f"Score: {score}", fill="#7CFC00",
                           font=("Arial", 18), tags="msg")
    else:
        canvas.create_text(230, 240, text="Try the other one!",
                           fill="#ff6b6b", font=("Arial", 16), tags="msg")

canvas.create_text(230, 40, text="Click the correct card", fill="white",
                   font=("Arial", 15))
for i in range(2):
    x = 50 + i * 190
    canvas.create_rectangle(x, 90, x + 170, 150, fill="#26264d",
                            outline="#5a5ac0", width=3, tags=f"card{i}")
    canvas.create_text(x + 85, 120, text=f"Card {i}", fill="white",
                       tags=f"card{i}")
    canvas.tag_bind(f"card{i}", "<Button-1>", lambda event, n=i: answer(n))

root.mainloop()
```

### What You'll See
Click a card and you literally SEE `is_right = True` or `is_right = False` on
screen, plus the matching reaction.

### Line by Line
- `is_right = (n == correct)` — Python answers the question and stores True or
  False in the box `is_right`.
- `if is_right:` — since `is_right` is ALREADY True or False, we can use it
  directly. No need to write `if is_right == True`.
- `locked = False` — a Boolean box we'll use in Part 3 to stop the player clicking
  twice on the same question.
- The f-string prints the Boolean value so you can watch it change.

### Do It in VS Code 🛠️
1. New file `booleans.py`. Type the code.
2. Save, run. Click each card and watch True/False flip.
3. Add `print(is_right)` inside `answer` and watch the terminal too.

### Your Turn
1. Add a third card and make it wrong.
2. Store `is_wrong = not is_right` and show it as well (`not` flips a Boolean).
3. Predict `is_right` when you click card 0 with `correct = 1`.

### 📸 Show Emrys
Screenshot both a True result and a False result. Tell Emrys which card is
correct.

### Check Your Brain
- What two values can a Boolean be?
- What does `is_right = (n == correct)` store?
- Why can we write `if is_right:` without `== True`?
- What does `not` do to a Boolean?

### More Examples
Booleans in the terminal:

```python
print(10 > 3)       # True
print(5 == 5)       # True
print(not True)     # False
```

### Common Mistakes
- **Quoting True:** `is_right = "True"` makes a WORD, not a Boolean. **Fix:** no
  quotes.
- **One equals sign:** `if is_right = True` → error. **Fix:** `if is_right:`.

### Level Up 🚀
Use `locked` for real: set `locked = True` after an answer and start `answer` with
`if locked: return` so a second click does nothing.

---

## Lesson 12: Drawing Many Cards with a for Loop

### Big Idea
A `for` loop repeats an action many times — perfect for drawing all four cards.

### Kid Meaning
Instead of writing four almost-identical blocks, a loop says "do this 4 times,
counting as you go." The counter changes each time so each card lands in a new
spot.

### Quiz Connection
Our quiz shows FOUR answer cards in a 2×2 grid. One loop draws them all.

### The Code
```python
import tkinter as tk

WIDTH = 640
CARD_W, CARD_H = 260, 90

root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=380, bg="#12122b")
canvas.pack()

options = ["Venus", "Mars", "Jupiter", "Mercury"]

def card_box(i):
    col = i % 2                # 0, 1, 0, 1
    row = i // 2               # 0, 0, 1, 1
    x = 40 + col * (CARD_W + 40)
    y = 60 + row * (CARD_H + 30)
    return x, y, x + CARD_W, y + CARD_H

for i in range(4):
    x1, y1, x2, y2 = card_box(i)
    canvas.create_rectangle(x1, y1, x2, y2, fill="#26264d",
                            outline="#5a5ac0", width=3)
    canvas.create_text((x1 + x2) / 2, (y1 + y2) / 2, text=options[i],
                       fill="white", font=("Arial", 15))

root.mainloop()
```

### What You'll See
A perfect **2×2 grid** of four answer cards — Venus, Mars, Jupiter, Mercury — all
drawn by ONE loop.

### Line by Line
- `options = [...]` — a **list**: four values in one box, in order.
- `for i in range(4):` — count `i` from 0 up to (not including) 4 → 0, 1, 2, 3.
- `col = i % 2` — the **remainder** trick! `0%2=0, 1%2=1, 2%2=0, 3%2=1` → the
  column pattern **left, right, left, right**.
- `row = i // 2` — **whole division**: `0//2=0, 1//2=0, 2//2=1, 3//2=1` → the row
  pattern **top, top, bottom, bottom**. Together these two lines turn one counter
  into a grid!
- `return x, y, x + CARD_W, y + CARD_H` — a function can hand back **several
  values** at once.
- `x1, y1, x2, y2 = card_box(i)` — and we catch all four in one line.
- `options[i]` — picks the option at position `i`. **Lists start at 0.**

### Do It in VS Code 🛠️
1. New file `grid.py`. Type the code.
2. Save, run — four cards in a neat grid.
3. Change `col = i % 2` to `col = 0` and run. All cards stack in one column — now
   you SEE what `%` was doing.

### Your Turn
1. Change the four options to your own answers.
2. Make the gap between rows bigger (change `30` to `50`).
3. Predict `i % 2` and `i // 2` for `i = 3`. (Answers: 1 and 1 — bottom right.)

### 📸 Show Emrys
Screenshot your 2×2 grid with your own answers. Tell Emrys what `%` and `//` do.

### Check Your Brain
- What does a `for` loop do?
- What numbers does `range(4)` produce?
- What does `i % 2` work out, and what does `i // 2` work out?
- Is `options[0]` the first or second item?

### More Examples
Seeing the grid maths in the terminal:

```python
for i in range(4):
    print(i, "column", i % 2, "row", i // 2)
```

### Common Mistakes
- **Off-by-one:** `range(4)` gives 0–3, NOT 1–4. **Fix:** that's what we want for
  list positions!
- **List index too big:** `options[4]` when the list has 4 items → `IndexError`
  (the last is `options[3]`). **Fix:** count from 0.

### Level Up 🚀
Make a 3×2 grid of six cards by changing the `% 2` and `// 2` to `% 3` and `// 3`
(and widening the canvas).

---

## Lesson 13: Lists — Storing Many Questions

### Big Idea
A list holds many items in order, and we reach each one by its position number.

### Kid Meaning
A list is like a numbered shelf. `questions[0]` is the first book,
`questions[1]` the second. One box, many things.

### Quiz Connection
Our quiz needs many questions. A list keeps them all in one tidy place.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=560, height=320, bg="#12122b")
canvas.pack()

questions = [
    "What is 7 x 8?",
    "Which planet is the Red Planet?",
    "How many sides does a hexagon have?",
]

current = 0

def show():
    canvas.delete("q")
    canvas.create_text(280, 120, text=questions[current], fill="white",
                       width=480, font=("Arial", 18, "bold"), tags="q")
    canvas.create_text(280, 180,
                       text=f"Question {current + 1} of {len(questions)}",
                       fill="#8fa0d8", font=("Arial", 12), tags="q")

def next_q():
    global current
    current = current + 1
    if current >= len(questions):
        current = 0            # wrap back to the start
    show()

show()
tk.Button(root, text="Next question", command=next_q).pack(pady=8)

root.mainloop()
```

### What You'll See
One question at a time. Click **Next question** to step through all three, then it
loops back to the first.

### Line by Line
- `questions = [ ... ]` — a list written across several lines for readability.
  Python doesn't mind, as long as the brackets match.
- `questions[current]` — grabs the question at position `current`.
- `len(questions)` — how many items are in the list (here, 3).
- `current + 1` in the label — because humans count from 1 but lists count from 0.
- `if current >= len(questions): current = 0` — when we run off the end, wrap back
  to the start. Without this we'd get an `IndexError`.

### Do It in VS Code 🛠️
1. New file `question_list.py`. Type the code.
2. Save, run. Click Next several times — watch it cycle.
3. Add a fourth question to the list. It just works — no other changes needed!

### Your Turn
1. Add three of your own questions.
2. Remove the wrap-around line and click past the end — meet `IndexError`. Put it
   back.
3. Predict `len(questions)` after you add two more.

### 📸 Show Emrys
Screenshot two different questions from your list. Tell Emrys how many questions
you have.

### Check Your Brain
- What is a list?
- What does `len(questions)` tell you?
- Why do we show `current + 1` instead of `current`?
- What happens without the wrap-around check?

### More Examples
Lists in the terminal:

```python
names = ["Ama", "Kofi", "Esi"]
print(names[0])       # Ama
print(len(names))     # 3
names.append("Yaw")   # add one more
print(names)
```

### Common Mistakes
- **Missing commas** between list items → `SyntaxError`. **Fix:** comma after
  every item except the last.
- **Index out of range:** asking for `questions[3]` in a 3-item list. **Fix:** the
  last valid position is `len(questions) - 1`.

### Level Up 🚀
Add a "Previous question" button that goes backwards (and wraps to the end).

---

## Lesson 14: Dictionaries — A Question and Its Answers Together

### Big Idea
A dictionary stores related facts together under names, so one question keeps its
options and its answer in one place.

### Kid Meaning
A real dictionary: look up a word, get its meaning. Here we look up `"q"` and get
the question; look up `"answer"` and get which card is right.

### Quiz Connection
Every question in our bank is a dictionary. This is how the game knows which card
to mark green.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=600, height=340, bg="#12122b")
canvas.pack()

question = {
    "q": "Which planet is the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Mercury"],
    "answer": 1,
}

canvas.create_text(300, 60, text=question["q"], fill="white",
                   width=520, font=("Arial", 18, "bold"))

for i in range(4):
    y = 120 + i * 50
    right = (i == question["answer"])
    canvas.create_text(300, y,
                       text=f"{i}: {question['options'][i]}",
                       fill="#7CFC00" if right else "white",
                       font=("Arial", 15))

root.mainloop()
```

### What You'll See
The question, then all four options listed with their numbers — and the **correct
one shown in green** because the dictionary told us `answer` is 1.

### Line by Line
- `question = { ... }` — curly braces `{ }` make a **dictionary**. Inside are
  `"key": value` pairs.
- `"q"`, `"options"`, `"answer"` — the **keys** (the labels).
- `question["q"]` — look up the key `"q"` and get the question text.
- `question["options"][i]` — get the options LIST, then item `i` from it. Two
  lookups in a row!
- `question['options'][i]` inside the f-string uses **single** quotes, because the
  f-string itself uses double quotes. You can't reuse the same quote type inside.
- `right = (i == question["answer"])` — a Boolean: is this the correct card?
- `"#7CFC00" if right else "white"` — a one-line choice for the colour.

### Do It in VS Code 🛠️
1. New file `question_dict.py`. Type the code.
2. Save, run — the correct option is green.
3. Change `"answer": 1` to `"answer": 3` and run. Mercury turns green instead!

### Your Turn
1. Write your own question dictionary with four options.
2. Set the `answer` to the right position (remember: counting from 0!).
3. Predict which option is green if `answer` is 0.

### 📸 Show Emrys
Screenshot your question with the correct option green. Tell Emrys your question
and its answer number.

### Check Your Brain
- What makes a dictionary different from a list?
- What is a "key"?
- What does `question["options"][2]` give you?
- Why do we use single quotes inside the f-string?

### More Examples
A dictionary about a person:

```python
pupil = {"name": "Ama", "class": 6, "score": 8}
print(pupil["name"])    # Ama
print(pupil["score"])   # 8
```

### Common Mistakes
- **Wrong key:** `question["question"]` when the key is `"q"` → `KeyError`. **Fix:**
  use the exact key name.
- **Answer number off by one:** setting `answer` to 2 when you mean the 2nd option
  (which is position 1). **Fix:** count from 0.

### Level Up 🚀
Add a `"topic"` key (like `"Science"`) to your dictionary and display it above the
question.

---

## Lesson 15: Functions — Reusable Quiz Tools

### Big Idea
A function is a named machine: define it once, then run it whenever you like.

### Kid Meaning
A blender is a machine — you don't rebuild it each time, you press its button. A
function is code you name once and reuse by calling it.

### Quiz Connection
We'll build tools like `draw_question()`, `draw_status()`, and `show_msg()` and
call them on every question — instead of copying the same drawing code over and
over.

### The Code
```python
import tkinter as tk

WIDTH = 600
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=320, bg="#12122b")
canvas.pack()

score = 0
lives = 3

def draw_status():
    canvas.delete("status")
    canvas.create_text(20, 25, text=f"Score: {score}", fill="#ffd54a",
                       anchor="w", font=("Arial", 14, "bold"), tags="status")
    canvas.create_text(WIDTH - 20, 25, text="* " * lives, fill="#ff6b6b",
                       anchor="e", font=("Arial", 16, "bold"), tags="status")

def show_msg(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH / 2, 180, text=text, fill=color,
                       font=("Arial", 20, "bold"), tags="msg")

draw_status()
show_msg("Let's play!", "white")

root.mainloop()
```

### What You'll See
A status bar: gold **Score: 0** on the left, three red **lives** on the right, and
"Let's play!" in the middle.

### Line by Line
- `def draw_status():` — defines the machine. Nothing happens yet — we're just
  building it.
- `def show_msg(text, color):` — a machine that takes TWO pieces of information.
- `anchor="w"` — anchors the text by its **west (left) edge**, so it lines up
  neatly against the left side. `anchor="e"` does the same on the right.
- `"* " * lives` — **string repetition**! Multiplying text by 3 gives `"* * * "`.
  A neat trick for drawing lives.
- `tags="status"` / `tags="msg"` — labels so each machine erases only ITS OWN
  drawing, leaving everything else untouched.

### Do It in VS Code 🛠️
1. New file `quiz_tools.py`. Type the code.
2. Save, run — see the status bar and message.
3. Change `lives = 5` and run. Five marks appear, no other changes needed.
4. Call `show_msg("Correct!", "#7CFC00")` at the bottom instead. Only the middle
   text changes!

### Your Turn
1. Add a `draw_title()` machine that writes the quiz name at the top.
2. Call `show_msg` twice with different words — which one wins? (The last.)
3. Predict what `"* " * 0` gives. (Answer: nothing — an empty text!)

### 📸 Show Emrys
Screenshot your status bar with a different number of lives. Tell Emrys the names
of your functions.

### Check Your Brain
- What does `def` do?
- What is the difference between DEFINING a function and CALLING it?
- What does `anchor="e"` do?
- What does `"* " * 3` produce?

### More Examples
A tiny function you call by name:

```python
def cheer():
    print("Well done!")

cheer()
cheer()
```

### Common Mistakes
- **Defining but never calling:** the machine exists but nothing runs it. **Fix:**
  call it — `draw_status()`.
- **Wiping everything:** `delete("all")` erases the status too. **Fix:** delete by
  tag.

### Level Up 🚀
Make `draw_status()` also show a progress bar rectangle whose width grows with the
score (using the maths from Lesson 4).

---

## Lesson 16: Functions with Parameters and return

### Big Idea
Parameters let us hand information INTO a function; `return` hands an answer BACK.

### Kid Meaning
Some machines DO something (draw the status). Others ANSWER something (work out
the rank). `return` is how a machine gives you its answer.

### Quiz Connection
`rank_for(score)` will RETURN the rank name. `card_box(i)` RETURNS a card's
position. These little answer-machines keep our code tidy.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=300, bg="#12122b")
canvas.pack()

def rank_for(points):
    if points >= 6:
        return "QUIZ MASTER"
    elif points >= 4:
        return "Brilliant"
    elif points >= 2:
        return "Good effort"
    else:
        return "Keep practising"

def colour_for(points):
    if points >= 4:
        return "#7CFC00"
    return "#ff9999"

def show(points):
    canvas.delete("all")
    canvas.create_text(230, 110, text=f"You scored {points}", fill="white",
                       font=("Arial", 20))
    canvas.create_text(230, 175, text=rank_for(points),
                       fill=colour_for(points), font=("Arial", 24, "bold"))

show(5)

root.mainloop()
```

### What You'll See
"You scored 5" with the rank **Brilliant** in green. Change `show(5)` to `show(1)`
and you get "Keep practising" in red.

### Line by Line
- `def rank_for(points):` — `points` is a **parameter**: an empty box filled when
  we call the function.
- `return "QUIZ MASTER"` — hands the text back AND stops the function immediately.
  Nothing after it runs.
- `rank_for(points)` used directly inside `create_text` — the answer goes straight
  where it's needed, no need to store it first.
- `colour_for(points)` — a second answer-machine. Notice it has no `else`: if the
  `if` doesn't match, the last `return` catches everything.
- `show(points)` — a DO-machine that uses two ANSWER-machines. Small parts,
  combined.

### Do It in VS Code 🛠️
1. New file `rank_tools.py`. Type the code.
2. Save, run — Brilliant.
3. Try `show(6)`, `show(3)`, `show(0)`.
4. Add `print(rank_for(4))` at the bottom and check the terminal.

### Your Turn
1. Add a `message_for(points)` machine that returns an encouraging sentence.
2. Show that message under the rank.
3. Predict what `rank_for(2)` returns.

### 📸 Show Emrys
Screenshot two different ranks with their colours. Tell Emrys which functions
RETURN a value and which one DRAWS.

### Check Your Brain
- What is a parameter?
- What does `return` do?
- What happens to code written AFTER a `return` that runs?
- What is the difference between `rank_for` and `show`?

### More Examples
Return a calculated value:

```python
def double(n):
    return n * 2

print(double(7))   # 14
```

### Common Mistakes
- **Forgetting to catch the answer:** calling `rank_for(5)` on its own throws the
  answer away. **Fix:** use it or store it.
- **Using `print` instead of `return`:** printing shows it but hands back nothing.
  **Fix:** use `return` when you need the value.

### Level Up 🚀
Write `percent_for(score, total)` that returns the percentage, and show it on the
results screen.

---

# PART 3 — BUILDING THE QUIZ

## Lesson 17: Building the Question Bank

### Big Idea
A **list of dictionaries** stores every question, its options, and its answer.

### Kid Meaning
One shelf (the list) holding many labelled folders (the dictionaries). Each folder
has everything about one question.

### Quiz Connection
This is the game's brain-food: all the questions in one place, easy to add to.

### The Code
```python
questions = [
    {"q": "What is 7 x 8?",
     "options": ["54", "56", "48", "64"], "answer": 1},
    {"q": "Which planet is called the Red Planet?",
     "options": ["Venus", "Mars", "Jupiter", "Mercury"], "answer": 1},
    {"q": "How many sides does a hexagon have?",
     "options": ["5", "6", "7", "8"], "answer": 1},
    {"q": "What is the capital of Ghana?",
     "options": ["Kumasi", "Accra", "Tamale", "Takoradi"], "answer": 1},
    {"q": "Which gas do plants take in?",
     "options": ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], "answer": 1},
    {"q": "What is 144 divided by 12?",
     "options": ["11", "12", "13", "14"], "answer": 1},
]
```

Test it with this little viewer:

```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=620, height=300, bg="#12122b")
canvas.pack()

questions = [
    {"q": "What is 7 x 8?",
     "options": ["54", "56", "48", "64"], "answer": 1},
    {"q": "Which planet is called the Red Planet?",
     "options": ["Venus", "Mars", "Jupiter", "Mercury"], "answer": 1},
]

n = 0

def show():
    canvas.delete("all")
    q = questions[n]
    canvas.create_text(310, 60, text=q["q"], fill="white", width=540,
                       font=("Arial", 17, "bold"))
    for i in range(4):
        right = (i == q["answer"])
        canvas.create_text(310, 120 + i * 40,
                           text=f"{i}: {q['options'][i]}",
                           fill="#7CFC00" if right else "white",
                           font=("Arial", 14))

def nxt():
    global n
    n = (n + 1) % len(questions)
    show()

show()
tk.Button(root, text="Next", command=nxt).pack(pady=6)

root.mainloop()
```

### What You'll See
Each question with its four options, the correct one green. Click **Next** to flip
through your bank.

### Line by Line
- `questions = [ {...}, {...} ]` — a **list** whose items are **dictionaries**.
  Both structures you learned, working together.
- `q = questions[n]` — grab ONE question dictionary out of the list. Now `q["q"]`
  and `q["options"]` work on just that question.
- `n = (n + 1) % len(questions)` — the wrap-around trick in one line! `%` gives the
  remainder, so when `n` reaches the end it snaps back to 0 automatically.
- Notice **every** question has `"answer": 1` here — that's just how these were
  written. In your own bank, put the correct option wherever you like!

### Do It in VS Code 🛠️
1. Create your real project file `quiz_game.py`. Type the full question bank.
2. Add the viewer code and run it to check every question looks right.
3. Fix any question where the green answer is wrong.

### Your Turn
1. Add four questions of your own about a subject you love.
2. Make sure each `answer` number matches the right option (count from 0!).
3. Predict what `questions[0]["options"][1]` gives. (Answer: `"56"`.)

### 📸 Show Emrys
Screenshot two of YOUR questions with the correct answers green. Tell Emrys how
many questions are in your bank.

### Check Your Brain
- What is a list of dictionaries?
- How do you get the third question's second option?
- What does `(n + 1) % len(questions)` do?
- Why must `answer` count from 0?

### More Examples
Looping over the whole bank:

```python
for q in questions:
    print(q["q"], "->", q["options"][q["answer"]])
```

### Common Mistakes
- **Answer pointing at the wrong option:** the game marks the wrong card green.
  **Fix:** count the options 0, 1, 2, 3 and check each one.
- **Missing comma between dictionaries** → `SyntaxError`. **Fix:** comma after
  each `}` except the last.

### Level Up 🚀
Add a `"topic"` key to every question and show the topic above each one.

---

## Lesson 18: Asking and Checking One Question

### Big Idea
Draw a question's four clickable cards, then check the clicked one against the
answer.

### Kid Meaning
This is one full turn of the game: show the cards, wait for a click, react.

### Quiz Connection
Everything from here is repetition of this one turn.

### The Code
```python
WIDTH = 640
CARD_W, CARD_H = 260, 90

def card_box(i):
    col = i % 2
    row = i // 2
    x = 40 + col * (CARD_W + 40)
    y = 250 + row * (CARD_H + 30)
    return x, y, x + CARD_W, y + CARD_H

def draw_question():
    global locked
    locked = False
    canvas.delete("quiz")
    canvas.delete("msg")
    q = questions[current]
    canvas.create_text(WIDTH / 2, 120, text=q["q"], fill="white",
                       width=WIDTH - 80, font=("Arial", 20, "bold"),
                       tags="quiz")
    for i in range(4):
        x1, y1, x2, y2 = card_box(i)
        canvas.create_rectangle(x1, y1, x2, y2, fill="#26264d",
                                outline="#5a5ac0", width=3,
                                tags=("quiz", f"card{i}", f"rect{i}"))
        canvas.create_text((x1 + x2) / 2, (y1 + y2) / 2,
                           text=q["options"][i], fill="white",
                           width=CARD_W - 20, font=("Arial", 15),
                           tags=("quiz", f"card{i}", f"txt{i}"))
        canvas.tag_bind(f"card{i}", "<Button-1>",
                        lambda event, n=i: choose(n))

def choose(n):
    global score, locked
    if locked:
        return
    locked = True
    correct = questions[current]["answer"]
    if n == correct:
        canvas.itemconfig(f"rect{n}", fill="#1f7a3a", outline="#7CFC00")
        score = score + 1
        show_msg("Correct!", "#7CFC00")
    else:
        canvas.itemconfig(f"rect{n}", fill="#7a1f2a", outline="#ff6b6b")
        canvas.itemconfig(f"rect{correct}", fill="#1f7a3a", outline="#7CFC00")
        show_msg("Not quite!", "#ff6b6b")
```

### What You'll See
Four cards. Click one: if right it goes **green** with "Correct!"; if wrong it goes
**red** AND the true answer lights up green so you learn from it.

### Line by Line
- `locked = False` at the start of each question — the player may answer.
- `if locked: return` — the **guard**. Once they've answered, extra clicks do
  nothing. Without this, a fast clicker could score 4 points on one question!
- Three tags per card: `"quiz"` (wipe it all next question), `card{i}` (clickable
  area), `rect{i}` (just the box, so we recolour without turning the words green).
- `canvas.itemconfig(f"rect{correct}", ...)` — even on a wrong answer we light up
  the RIGHT card. Good teaching, not just scoring.
- `lambda event, n=i: choose(n)` — `n=i` remembers which card this is (Lesson 9).

### Do It in VS Code 🛠️
1. Add these functions to `quiz_game.py` along with
   `score = 0`, `current = 0`, `locked = False` and the `show_msg` from Lesson 15.
2. Call `draw_question()` before `root.mainloop()`.
3. Save, run. Click right and wrong answers and watch the colours.

### Your Turn
1. Change the correct/wrong colours to your own.
2. Remove the `if locked: return` line, click one card five times, and watch the
   score jump unfairly. Put it back!
3. Predict what happens if you click the background instead of a card.

### 📸 Show Emrys
Screenshot a correct (green) answer AND a wrong one showing both red and green.
Tell Emrys what the `locked` guard prevents.

### Check Your Brain
- What does the `locked` guard stop?
- Why do cards need three different tags?
- Why do we light up the correct card even when the player is wrong?
- What does `itemconfig` change?

### More Examples
A guard pattern anywhere:

```python
def do_once():
    global done
    if done:
        return
    done = True
    print("This only happens once!")
```

### Common Mistakes
- **Forgetting to reset `locked`:** after the first question nothing is clickable
  ever again. **Fix:** set `locked = False` in `draw_question`.
- **Colouring the shared tag:** `itemconfig(f"card{n}", fill=...)` turns the WORDS
  green too, making them invisible. **Fix:** use `rect{n}`.

### Level Up 🚀
Make the cards **glow** when the mouse hovers over them using
`canvas.tag_bind(tag, "<Enter>", ...)` and `"<Leave>"`.

---

## Lesson 19: Scoring and the Lives System

### Big Idea
Wrong answers cost a life, and the game ends when lives run out.

### Kid Meaning
Three chances, like a real game show. Every mistake takes one away, and the hearts
at the top show how many you have left.

### Quiz Connection
Lives add real tension — the player has to think, not just click.

### The Code
```python
score = 0
lives = 3
current = 0
locked = False

def draw_status():
    canvas.delete("status")
    canvas.create_text(20, 25, text=f"Score: {score}", fill="#ffd54a",
                       anchor="w", font=("Arial", 14, "bold"), tags="status")
    canvas.create_text(WIDTH - 20, 25, text="* " * lives, fill="#ff6b6b",
                       anchor="e", font=("Arial", 16, "bold"), tags="status")
    canvas.create_text(WIDTH / 2, 25,
                       text=f"Question {current + 1} of {len(questions)}",
                       fill="#8fa0d8", font=("Arial", 12), tags="status")
```

And inside `choose`, add the life loss:

```python
    else:
        canvas.itemconfig(f"rect{n}", fill="#7a1f2a", outline="#ff6b6b")
        canvas.itemconfig(f"rect{correct}", fill="#1f7a3a", outline="#7CFC00")
        lives = lives - 1                 # needs `global lives` too
        show_msg("Not quite!", "#ff6b6b")
    draw_status()
```

### What You'll See
A full status bar: gold score on the left, question number in the middle, and red
life marks on the right that **disappear one by one** as you get answers wrong.

### Line by Line
- `lives = 3` — the starting chances, outside any function so it survives.
- `global score, locked, lives` — `choose` now changes THREE outside boxes, so all
  three go on the `global` line.
- `lives = lives - 1` — take one away. The mirror image of `score = score + 1`.
- `"* " * lives` — string repetition draws exactly as many marks as lives left.
  When `lives` hits 0 it draws nothing at all.
- `draw_status()` at the end of `choose` — redraw the bar so the change shows.

### Do It in VS Code 🛠️
1. Add `lives = 3`, the new `draw_status`, and the life-loss line to `quiz_game.py`.
2. Update `choose`'s global line to `global score, locked, lives`.
3. Save, run. Get three answers wrong and watch the marks vanish.

### Your Turn
1. Start with 5 lives instead of 3.
2. Make the life marks a different colour or symbol.
3. Predict what the status bar shows when `lives` is 0.

### 📸 Show Emrys
Screenshot the status bar with full lives AND after losing one. Tell Emrys how
many lives you start with.

### Check Your Brain
- What does `lives = lives - 1` do?
- Why must `lives` be on the `global` line in `choose`?
- What does `"* " * 0` draw?
- Why call `draw_status()` after changing the score or lives?

### More Examples
Losing and gaining together:

```python
score = score + 1
lives = lives - 1
print(score, lives)
```

### Common Mistakes
- **Forgetting `lives` in `global`:** `UnboundLocalError`. **Fix:** `global score,
  locked, lives`.
- **Lives going negative:** without an end check they drop to -1, -2. **Fix:** the
  next lesson stops the game at 0.

### Level Up 🚀
Flash the whole window red for a moment when a life is lost, using
`canvas.config(bg="#3a1020")` and `root.after` to change it back.

---

## Lesson 20: The Main Quiz Flow

### Big Idea
After a short pause, move to the next question — or end the game.

### Kid Meaning
Real quiz shows give you a beat to see whether you were right before the next
question appears. `root.after` gives us that pause without freezing anything.

### Quiz Connection
This is what strings all the single turns into a real game.

### The Code
```python
def next_question():
    global current
    current = current + 1
    if lives <= 0 or current >= len(questions):
        show_result()
    else:
        draw_question()
```

And at the end of `choose`, add the pause:

```python
    draw_status()
    root.after(1100, next_question)
```

### What You'll See
Click an answer → the colours show for about a second → the next question slides
in automatically. When lives hit 0 or the questions run out, the results screen
appears.

### Line by Line
- `root.after(1100, next_question)` — "in 1100 milliseconds (1.1 seconds), run
  `next_question`." The window stays alive and responsive during the wait — this
  is NOT a freeze.
- `current = current + 1` — move the pointer to the next question in the list.
- `if lives <= 0 or current >= len(questions):` — two ways to finish: out of lives,
  OR no questions left. `or` means "either one is enough."
- `else: draw_question()` — otherwise, carry on playing.

### Do It in VS Code 🛠️
1. Add `next_question` and the `root.after` line to `quiz_game.py`.
2. Add a temporary `show_result` that just draws "Game over" (the real one is next
   lesson).
3. Save, run. Play a whole game through!

### Your Turn
1. Make the pause longer (`2000`) and shorter (`500`). Which feels best?
2. Test running out of lives before the questions run out.
3. Predict what happens if you forget `current = current + 1`. (The same question
   forever!)

### 📸 Show Emrys
Screenshot the moment just after answering (colours showing) and the game-over
screen. Tell Emrys your chosen pause length.

### Check Your Brain
- What does `root.after(1100, next_question)` do?
- What are the TWO ways the game can end?
- What does `or` mean?
- Why doesn't the pause freeze the window?

### More Examples
A delayed message:

```python
root.after(2000, lambda: print("Two seconds later!"))
```

### Common Mistakes
- **Using `time.sleep()`:** it FREEZES the whole window — the colours never even
  appear. **Fix:** always use `root.after` in a tkinter program.
- **Brackets on the function:** `root.after(1100, next_question())` runs it
  instantly. **Fix:** no brackets — pass the name.

### Level Up 🚀
Show a small countdown ("Next question in 3... 2... 1...") using repeated
`root.after` calls.

---

## Lesson 21: Randomising the Questions

### Big Idea
`random.shuffle` mixes the question order so every game feels new.

### Kid Meaning
Like shuffling a deck of cards. Same questions, different order — so you can't
just memorise the answers by position.

### Quiz Connection
This makes the game replayable, which is what turns it from an exercise into a
real game.

### The Code
```python
import random

order = []

def new_game():
    global score, lives, current, order
    score = 0
    lives = 3
    current = 0
    order = list(range(len(questions)))
    random.shuffle(order)
    canvas.delete("stars")
    draw_question()
```

Now every place that said `questions[current]` becomes
`questions[order[current]]`:

```python
    q = questions[order[current]]                 # in draw_question
    correct = questions[order[current]]["answer"]  # in choose
```

### What You'll See
Play twice — the questions come in a **different order** each time. The game feels
fresh every single play.

### Line by Line
- `import random` — brings in Python's dice-and-shuffle kit.
- `list(range(len(questions)))` — builds a list of positions: `[0, 1, 2, 3, 4, 5]`.
- `random.shuffle(order)` — jumbles that list **in place**, e.g. `[3, 0, 5, 1, 4, 2]`.
  Note: it changes the list itself and returns nothing — never write
  `order = random.shuffle(order)`.
- `questions[order[current]]` — a **double lookup**: `order[current]` gives the
  shuffled position, then `questions[...]` fetches that question. Read it from the
  inside out.
- `new_game()` resets everything at once — score, lives, position, AND a fresh
  shuffle.

### Do It in VS Code 🛠️
1. Add `import random`, `order = []`, and `new_game` to `quiz_game.py`.
2. Change both `questions[current]` lines to `questions[order[current]]`.
3. Replace your startup `draw_question()` call with `new_game()`.
4. Save, run twice — different order each time!

### Your Turn
1. Add `print(order)` inside `new_game` and watch the shuffled list each game.
2. Shuffle a list of your friends' names and print it.
3. Predict what `list(range(4))` gives. (Answer: `[0, 1, 2, 3]`.)

### 📸 Show Emrys
Screenshot the FIRST question of two different games (showing different
questions). Tell Emrys what `random.shuffle` does.

### Check Your Brain
- What does `random.shuffle` do to a list?
- What does `list(range(len(questions)))` build?
- Why is `questions[order[current]]` a double lookup?
- Why must you never write `order = random.shuffle(order)`?

### More Examples
Shuffling in the terminal:

```python
import random
cards = ["A", "B", "C", "D"]
random.shuffle(cards)
print(cards)      # a different order each run
```

### Common Mistakes
- **`order = random.shuffle(order)`:** sets `order` to `None` and everything
  breaks. **Fix:** just `random.shuffle(order)`.
- **Forgetting to change BOTH lookups:** the question shown won't match the answer
  checked! **Fix:** update `draw_question` AND `choose`.

### Level Up 🚀
Shuffle the four OPTIONS too — much harder! (You must also work out where the
correct answer moved to.)

---

## Lesson 22: The Final Rank and Celebration

### Big Idea
End the game with a dramatic score, rank, and a shower of stars.

### Kid Meaning
Every game show has a big finish. This is ours: your score, your title, and
confetti if you did well.

### Quiz Connection
The payoff that makes players want to go again.

### The Code
```python
def rank_for(points):
    if points >= 6:
        return "QUIZ MASTER"
    elif points >= 4:
        return "Brilliant"
    elif points >= 2:
        return "Good effort"
    else:
        return "Keep practising"

def celebrate():
    for i in range(25):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        canvas.create_text(x, y, text="*", fill="#ffd54a",
                           font=("Arial", 18), tags="stars")

def show_result():
    canvas.delete("quiz")
    canvas.delete("msg")
    canvas.delete("status")
    canvas.create_text(WIDTH / 2, 180, text="Quiz Over!", fill="white",
                       font=("Arial", 32, "bold"), tags="quiz")
    canvas.create_text(WIDTH / 2, 250,
                       text=f"You scored {score} out of {len(questions)}",
                       fill="#ffd54a", font=("Arial", 20), tags="quiz")
    canvas.create_text(WIDTH / 2, 310, text=rank_for(score), fill="#7CFC00",
                       font=("Arial", 26, "bold"), tags="quiz")
    if score >= 4:
        celebrate()
```

### What You'll See
"Quiz Over!", your score, and your rank in big green letters — plus **25 gold
stars** scattered across the window if you scored 4 or more.

### Line by Line
- `rank_for(points)` — the answer-machine from Lesson 16, now doing its real job.
- `celebrate()` — a `for` loop (Lesson 12) scattering stars at `random` positions
  (Lesson 21). Two old skills combining!
- `random.randint(0, WIDTH)` — a random whole number anywhere across the window.
- `tags="stars"` — so `new_game` can sweep them away for the next round.
- `if score >= 4:` — celebration is EARNED. That makes it feel special.

### Do It in VS Code 🛠️
1. Add `rank_for`, `celebrate`, and the real `show_result` to `quiz_game.py`.
2. Save, run. Play a full game and reach the results screen.
3. Deliberately do badly to see the no-stars version, then well for the stars.

### Your Turn
1. Change the star symbol to something else and the count to 50.
2. Change the rank thresholds so stars are harder to earn.
3. Predict the rank for a score of 5.

### 📸 Show Emrys
Screenshot your results screen WITH stars and one without. Tell Emrys your score
and rank.

### Check Your Brain
- Which function decides the rank, and which one draws the stars?
- What does `random.randint(0, WIDTH)` give?
- Why do the stars need the `"stars"` tag?
- Why only celebrate above a certain score?

### More Examples
Random positions in the terminal:

```python
import random
for i in range(3):
    print(random.randint(1, 100))
```

### Common Mistakes
- **Stars piling up between games:** forgetting `canvas.delete("stars")` in
  `new_game`. **Fix:** add it.
- **Results hidden behind cards:** forgetting to delete `"quiz"` first. **Fix:**
  clear the old screen before drawing the results.

### Level Up 🚀
Animate the stars falling down the screen using `root.after` (like a real confetti
drop).

---

## Lesson 23: Polish and Personality

### Big Idea
Small touches — a Play Again button, tidy sizing, and clear feedback — turn a
working program into a real game.

### Kid Meaning
The difference between "it works" and "I want to play again" is polish.

### Quiz Connection
This is the final layer before your showcase.

### The Code
```python
root.resizable(False, False)          # lock the window size

tk.Button(root, text="New Game", font=("Arial", 13),
          command=new_game).pack(pady=6)
```

And make the status bar show a progress bar:

```python
def draw_progress():
    canvas.delete("bar")
    done = current / len(questions)
    canvas.create_rectangle(20, 50, WIDTH - 20, 60, outline="#3a4a90",
                            tags="bar")
    canvas.create_rectangle(20, 50, 20 + (WIDTH - 40) * done, 60,
                            fill="#5a5ac0", outline="", tags="bar")
```

### What You'll See
A locked-size window (so buttons never slide off screen), a **New Game** button
that restarts instantly, and a purple **progress bar** filling up as you work
through the questions.

### Line by Line
- `root.resizable(False, False)` — stops the window being resized. This also
  prevents the bug where maximising pushes the buttons off the bottom of the
  screen.
- `done = current / len(questions)` — a fraction between 0 and 1, e.g. 3 of 6 is
  `0.5`.
- `20 + (WIDTH - 40) * done` — the bar's right edge. When `done` is 0 the bar is
  empty; at 1 it spans the full width. The same percentage maths from Lesson 4.
- Two rectangles: the **outline** (the empty track) and the **fill** (the progress),
  drawn on top.

### Do It in VS Code 🛠️
1. Add `root.resizable(False, False)`, the New Game button, and `draw_progress`.
2. Call `draw_progress()` from inside `draw_status()`.
3. Save, run. Watch the bar fill and try New Game mid-way.

### Your Turn
1. Change the progress bar's colours and thickness.
2. Move it to the bottom of the window.
3. Predict the bar's width when `current` is 0. (Answer: empty!)

### 📸 Show Emrys
Screenshot the progress bar half-full. Tell Emrys what maths sets its width.

### Check Your Brain
- Why lock the window size?
- What does `current / len(questions)` work out?
- Why draw two rectangles for the bar?
- What does the New Game button reset?

### More Examples
A fraction as a percent:

```python
done = 3 / 6
print(f"{done * 100:.0f}% complete")   # 50% complete
```

### Common Mistakes
- **Bar never resets:** forgetting to redraw it in `new_game`. **Fix:** call
  `draw_status()` (which calls `draw_progress`) after resetting.
- **Divide by zero:** if `questions` is empty. **Fix:** always keep questions in
  the bank.

### Level Up 🚀
Add a sound-like flash: briefly change the canvas background green on a correct
answer, using `root.after` to change it back.

---

## Lesson 24: Showcase and Reflection

### Big Idea
Assemble the complete Quiz Game Show and show it off — you built a real
click-to-play game!

### Kid Meaning
Every piece you learned — windows, shapes, clickable cards, variables, maths,
if/elif, booleans, loops, lists, dictionaries, functions, return, and random —
comes together into one game you can play and share.

### Quiz Connection
This is the finished product. Read it, run it, and be proud.

### The Code
```python
import tkinter as tk
import random

WIDTH, HEIGHT = 640, 560
CARD_W, CARD_H = 260, 90

root = tk.Tk()
root.title("Quiz Game Show")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#12122b")
canvas.pack()

questions = [
    {"q": "What is 7 x 8?",
     "options": ["54", "56", "48", "64"], "answer": 1},
    {"q": "Which planet is called the Red Planet?",
     "options": ["Venus", "Mars", "Jupiter", "Mercury"], "answer": 1},
    {"q": "How many sides does a hexagon have?",
     "options": ["5", "6", "7", "8"], "answer": 1},
    {"q": "What is the capital of Ghana?",
     "options": ["Kumasi", "Accra", "Tamale", "Takoradi"], "answer": 1},
    {"q": "Which gas do plants take in?",
     "options": ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], "answer": 1},
    {"q": "What is 144 divided by 12?",
     "options": ["11", "12", "13", "14"], "answer": 1},
]

score = 0
lives = 3
current = 0
order = []
locked = False

def card_box(i):
    col = i % 2
    row = i // 2
    x = 40 + col * (CARD_W + 40)
    y = 250 + row * (CARD_H + 30)
    return x, y, x + CARD_W, y + CARD_H

def draw_status():
    canvas.delete("status")
    canvas.create_text(20, 25, text=f"Score: {score}", fill="#ffd54a",
                       anchor="w", font=("Arial", 14, "bold"), tags="status")
    canvas.create_text(WIDTH - 20, 25, text="* " * lives, fill="#ff6b6b",
                       anchor="e", font=("Arial", 16, "bold"), tags="status")
    canvas.create_text(WIDTH / 2, 25,
                       text=f"Question {current + 1} of {len(order)}",
                       fill="#8fa0d8", font=("Arial", 12), tags="status")

def show_msg(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH / 2, 190, text=text, fill=color,
                       font=("Arial", 18, "bold"), tags="msg")

def draw_question():
    global locked
    locked = False
    canvas.delete("quiz")
    canvas.delete("msg")
    q = questions[order[current]]
    canvas.create_text(WIDTH / 2, 120, text=q["q"], fill="white",
                       width=WIDTH - 80, font=("Arial", 20, "bold"),
                       tags="quiz")
    for i in range(4):
        x1, y1, x2, y2 = card_box(i)
        canvas.create_rectangle(x1, y1, x2, y2, fill="#26264d",
                                outline="#5a5ac0", width=3,
                                tags=("quiz", f"card{i}", f"rect{i}"))
        canvas.create_text((x1 + x2) / 2, (y1 + y2) / 2,
                           text=q["options"][i], fill="white",
                           width=CARD_W - 20, font=("Arial", 15),
                           tags=("quiz", f"card{i}", f"txt{i}"))
        canvas.tag_bind(f"card{i}", "<Button-1>",
                        lambda event, n=i: choose(n))
    draw_status()

def choose(n):
    global score, lives, locked
    if locked:
        return
    locked = True
    correct = questions[order[current]]["answer"]
    if n == correct:
        canvas.itemconfig(f"rect{n}", fill="#1f7a3a", outline="#7CFC00")
        score = score + 1
        show_msg("Correct!", "#7CFC00")
    else:
        canvas.itemconfig(f"rect{n}", fill="#7a1f2a", outline="#ff6b6b")
        canvas.itemconfig(f"rect{correct}", fill="#1f7a3a", outline="#7CFC00")
        lives = lives - 1
        show_msg("Not quite!", "#ff6b6b")
    draw_status()
    root.after(1100, next_question)

def next_question():
    global current
    current = current + 1
    if lives <= 0 or current >= len(order):
        show_result()
    else:
        draw_question()

def rank_for(points):
    if points >= 6:
        return "QUIZ MASTER"
    elif points >= 4:
        return "Brilliant"
    elif points >= 2:
        return "Good effort"
    else:
        return "Keep practising"

def celebrate():
    for i in range(25):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        canvas.create_text(x, y, text="*", fill="#ffd54a",
                           font=("Arial", 18), tags="stars")

def show_result():
    canvas.delete("quiz")
    canvas.delete("msg")
    canvas.delete("status")
    canvas.create_text(WIDTH / 2, 180, text="Quiz Over!", fill="white",
                       font=("Arial", 32, "bold"), tags="quiz")
    canvas.create_text(WIDTH / 2, 250,
                       text=f"You scored {score} out of {len(order)}",
                       fill="#ffd54a", font=("Arial", 20), tags="quiz")
    canvas.create_text(WIDTH / 2, 310, text=rank_for(score), fill="#7CFC00",
                       font=("Arial", 26, "bold"), tags="quiz")
    if score >= 4:
        celebrate()

def new_game():
    global score, lives, current, order
    score = 0
    lives = 3
    current = 0
    order = list(range(len(questions)))
    random.shuffle(order)
    canvas.delete("stars")
    draw_question()

tk.Button(root, text="New Game", font=("Arial", 13),
          command=new_game).pack(pady=6)

new_game()
root.mainloop()
```

### What You'll See
The full game show: a shuffled question, four clickable cards, instant green/red
feedback that also teaches the right answer, a live score and lives bar, and a
dramatic rank reveal with stars — plus a New Game button for another round.

### Line by Line
- Every function is one you built across the course. Read each name — you know
  exactly what it does now.
- The flow: `new_game()` shuffles and starts → `draw_question()` shows cards →
  a click runs `choose()` → `root.after` calls `next_question()` → eventually
  `show_result()`.
- Notice how the program is just **small machines calling each other**. That's how
  all real software is built.

### Do It in VS Code 🛠️
1. Make sure your `quiz_game.py` matches this complete version (with YOUR
   questions!).
2. Save, run. Play several rounds. Try to earn QUIZ MASTER!
3. Let a friend or family member play and watch where they get stuck.

### Your Turn — Reflection
1. Which lesson was the hardest, and what finally made it click?
2. Add ONE personal touch (your own questions, colours, ranks, or a timer).
3. Write two sentences: what are you proudest of building?

### 📸 Show Emrys
Screenshot your finished quiz mid-game AND your results screen with a rank. Tell
Emrys: "Course complete!" and share your score and your one personal touch.

### Check Your Brain
- Name three different concepts this game uses (there are many!).
- Which function decides the rank, and which one handles a click?
- How would you explain "a list of dictionaries" to a friend?

### More Examples
Ideas to keep growing your game:

```python
# A countdown timer for each question
time_left = 10
def tick():
    global time_left
    time_left = time_left - 1
    if time_left > 0:
        root.after(1000, tick)
```

### Common Mistakes
- **Copy-paste errors:** if it won't run, read the terminal's red line number and
  check that exact line. **Fix:** compare it character by character.
- **Indentation drift:** mixed spaces break Python. **Fix:** keep 4 spaces per
  level everywhere.

### Level Up 🚀
Add a high-score file that remembers the best score between games, or a timer that
adds bonus points for fast answers. You are officially a game maker! 🎮
