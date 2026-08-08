# Emoji Mood Chatbot Lessons: Class 5 Edition (Graphics Version)

Build your very own **Emoji Mood Chatbot** — but this time you can SEE it! A big
friendly **emoji face** looks at you from the screen. You type how you feel, and
the face **changes its expression** — it smiles when you're happy, droops when
you're sad, and scowls when you're angry — while a **speech bubble** replies with
a kind message. It even remembers your name and counts your messages.

This project is for **Class 5** (beginners, around 10–11 years old). It uses
Python on a normal school computer with **tkinter**, the drawing kit that comes
free inside Python — nothing to install. You start from absolutely zero — no
experience needed. Every single line of code is explained in simple words so you
truly understand it, not just copy it.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Chatbot Connection** — how this fits our Emoji Mood Chatbot.
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
5. A **window pops up** showing your emoji face. Look at it! (When you're done,
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
the learning happens.** Do not rush; it is better to truly understand one
lesson than to copy five.

**This course takes about 4 months** (roughly two lessons a week). It has three
parts:

- **Part 1 — First Pictures (Lessons 1–8):** open a window, draw the emoji face,
  use variables and maths to place it, and let the player type to the bot.
- **Part 2 — Making Choices & Expressions (Lessons 9–16):** teach the face to
  change expression with `if`, loops, and functions.
- **Part 3 — Building the Chatbot (Lessons 17–24):** put it all together into the
  full talking Emoji Mood Chatbot that remembers, replies, and cares.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST PICTURES

## Lesson 1: What Is Code? Drawing a Face

### Big Idea
Code is a list of instructions we give the computer, one line at a time — and
those instructions can draw a face on the screen.

### Kid Meaning
A recipe tells a cook what to do step by step. Code tells the computer what to do
step by step. The computer does EXACTLY what you say — nothing more, nothing less.
Today we tell it: "Draw me a face."

### Chatbot Connection
Our whole chatbot IS a face that looks at you and changes expression. Before it
can smile or frown, we must learn to draw the face at all.

### The Code
```python
import tkinter as tk

root = tk.Tk()
root.title("My Emoji Face")
canvas = tk.Canvas(root, width=400, height=400, bg="#0e1230")
canvas.pack()

canvas.create_oval(120, 100, 280, 260, fill="#ffd54a")   # the head
canvas.create_oval(155, 150, 175, 170, fill="black")     # left eye
canvas.create_oval(225, 150, 245, 170, fill="black")     # right eye
canvas.create_line(160, 210, 240, 210, width=5)          # a straight mouth

root.mainloop()
```

### What You'll See
A dark blue window with a big **yellow round face**: two black eyes and a
straight line for a mouth. It looks calm — we'll teach it to smile soon!

### Line by Line
- `import tkinter as tk` — brings in Python's drawing kit and gives it the short
  nickname `tk` so we type less. Think of it as opening your box of crayons.
- `root = tk.Tk()` — makes the window itself. `root` is the name we'll use to
  talk to that window.
- `root.title("My Emoji Face")` — writes the title at the top of the window.
- `canvas = tk.Canvas(root, width=400, height=400, bg="#0e1230")` — puts a dark
  drawing sheet, 400 wide and 400 tall, inside the window. `canvas` is our paper.
- `canvas.pack()` — actually places the canvas into the window (without this, the
  paper stays hidden).
- `create_oval(120, 100, 280, 260, fill="#ffd54a")` — draws the round head.
- The two small ovals are the eyes; the `create_line` is the mouth.
- `#ffd54a` — a colour code. The `#` at the start means "a colour written in
  computer code" — this one is a warm yellow. You can also just write `"yellow"`.
- `root.mainloop()` — the magic word that keeps the window open and waiting.
  Without it, the window would blink and vanish.
- `#` in the code — anything after a `#` (outside quotes) is a **comment**: a note
  for humans. Python ignores it completely.

### Do It in VS Code 🛠️
1. **File → New File** → name it `face.py` → save it on your Desktop.
2. Type the code above yourself (don't copy-paste — typing teaches your fingers).
3. Save: **Ctrl+S** (make the white "unsaved" dot on the tab disappear).
4. Press the **▶ Run** button. Your emoji face should pop up!
5. Look at your face. Then close it by clicking the **X**.

### Your Turn
1. Change the face colour to `"lime"` or `"pink"`.
2. Make the eyes bigger (change their oval numbers).
3. Change the background `bg` to a different colour.
4. BEFORE you run: predict what will look different. Then run. Were you right?

### 📸 Show Emrys
Take a screenshot of your face in YOUR colours and **send it to Emrys**. Say:
"Lesson 1 done!" Emrys will give you your first ✅ of the course.

### Check Your Brain
- What does `import tkinter as tk` bring us?
- Which line makes the window actually appear and stay open?
- What does `fill` change?
- What does a `#` comment do?

### More Examples
A face with a nose:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="black")
canvas.pack()
canvas.create_oval(120, 100, 280, 260, fill="orange")
canvas.create_oval(155, 150, 175, 170, fill="black")
canvas.create_oval(225, 150, 245, 170, fill="black")
canvas.create_line(200, 175, 200, 200, width=4)   # nose
canvas.create_line(165, 220, 235, 220, width=5)   # mouth
root.mainloop()
```

### Common Mistakes
- **Forgetting `root.mainloop()`:** the window flashes and disappears. **Fix:** add
  it as the LAST line.
- **Forgetting `canvas.pack()`:** the window opens but is empty. **Fix:** add
  `canvas.pack()` after making the canvas.
- **Capital letters wrong:** `Import` or `canvas.Create_oval()` → an error. Python
  is picky — copy the spelling exactly.

### Level Up 🚀
Give your face hair, ears, or a hat using more ovals and lines. Make it YOURS!

---

## Lesson 2: How to Run Python (and the Screen Map)

### Big Idea
We type code in a file, save it, and then "run" it — and every drawing lands at
a spot described by two numbers.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when the window pops up. And every shape needs an address on the
screen: how far across, and how far down.

### Chatbot Connection
You'll run your chatbot again and again as you build it. And every eye, mouth,
and speech bubble has to be placed at exactly the right spot.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="white")
canvas.pack()

canvas.create_rectangle(100, 100, 300, 300, fill="skyblue")
canvas.create_text(200, 200, text="I am at 200, 200", fill="black")

root.mainloop()
```

### What You'll See
A white window with a **blue square**, and words in the middle telling you where
they are.

### Line by Line
- `create_rectangle(100, 100, 300, 300, ...)` — the first two numbers
  `(100, 100)` are the **top-left corner**, the next two `(300, 300)` are the
  **bottom-right corner**.
- `create_text(200, 200, ...)` — writes words centred at the spot 200 across and
  200 down.

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

Remember this and shapes go exactly where you expect. Forget it and your face
ends up "upside down" from where you pictured it — that's not a bug, it's just
the screen map. (This is why the eyes use a SMALLER y than the mouth: eyes sit
HIGHER on the face.)

### Slow Motion 🔬 — writing vs running
There are TWO different moments, and mixing them up confuses every beginner:

- **Writing** = typing the code into the editor. Nothing happens yet.
- **Saving** = Ctrl+S. Your words are safely on the disk. STILL nothing happens.
- **Running** = pressing **▶**. NOW Python reads your file and the window pops up.

The biggest trap: changing the code and running WITHOUT saving — the computer
runs the OLD version and you wonder why nothing changed. Burn this rhythm into
your fingers: **type → Ctrl+S → ▶ → look at the window.** Every time. Forever.

### Do It in VS Code 🛠️
1. **File → New File** → name it `map.py` → save on your Desktop.
2. Type the code above.
3. **Ctrl+S**, then press **▶ Run**.
4. Change the text position to `create_text(100, 50, ...)`. Predict where it
   moves BEFORE you run. (Answer: up and to the left!)

### Your Turn
1. Put text near the BOTTOM of the window. Which number do you make bigger?
2. Put a small circle in the **top-right** corner.
3. Draw a dot at `(0, 0)` — where does it land? (Try
   `create_oval(0, 0, 20, 20, fill="red")`.)

### 📸 Show Emrys
Screenshot your window with a shape in the top-right AND one near the bottom.
Tell Emrys which number you changed to move things down.

### Check Your Brain
- Where is the point `(0, 0)` on the canvas?
- Which direction does **y** get bigger — up or down?
- To move a shape RIGHT, which number do you change?
- Why must you SAVE before you run?

### More Examples
Three dots marching down the screen (watch y grow):

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=200, height=350, bg="white")
canvas.pack()
canvas.create_oval(50, 50, 70, 70, fill="red")
canvas.create_oval(50, 150, 70, 170, fill="green")
canvas.create_oval(50, 250, 70, 270, fill="blue")
root.mainloop()
```

### Common Mistakes
- **Thinking up is bigger:** using a big y to go "up" sends the shape DOWN.
  **Fix:** smaller y = higher.
- **Corners backwards:** if the second corner is smaller than the first, the
  shape can vanish. **Fix:** first pair = top-left, second pair = bottom-right.

### Level Up 🚀
Draw a shape in each of the four corners of the canvas. Label each with
`create_text` saying its coordinates.

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that remembers a value so we can use it again.

### Kid Meaning
A box with a label. You write `cx = 200` and now the box called `cx` holds 200.
Whenever you say `cx`, the computer looks in the box and uses what's inside.

### Chatbot Connection
Our bot must remember lots of things: where the face is, how big it is, the
player's name, the mood. Variables are how the computer remembers.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="#0e1230")
canvas.pack()

cx = 200          # centre across
cy = 180          # centre down
r = 80            # how big the face is
face_color = "#ffd54a"

canvas.create_oval(cx - r, cy - r, cx + r, cy + r, fill=face_color)
canvas.create_oval(cx - 30, cy - 25, cx - 15, cy - 10, fill="black")
canvas.create_oval(cx + 15, cy - 25, cx + 30, cy - 10, fill="black")
canvas.create_line(cx - 30, cy + 35, cx + 30, cy + 35, width=5)

root.mainloop()
```

### What You'll See
The same emoji face — but now its position, size, and colour all come from the
boxes `cx`, `cy`, `r`, and `face_color`.

### Line by Line
- `cx = 200` — the face's left-right centre.
- `cy = 180` — the face's up-down centre.
- `r = 80` — the radius: how far the face reaches from its centre.
- `face_color = "#ffd54a"` — a box holding a colour.
- `create_oval(cx - r, cy - r, cx + r, cy + r, ...)` — instead of typing numbers,
  we use the boxes. `cx - r` is the left edge, `cx + r` the right, and so on.
  Change `r` and the WHOLE face grows or shrinks.
- The eyes and mouth are also placed relative to `cx` and `cy`, so they move with
  the face automatically.

### Do It in VS Code 🛠️
1. New file `face_vars.py`. Type the code.
2. Save and run — see the face.
3. Change `r = 80` to `r = 130`. Save, run. The whole face got BIGGER.
4. Change `cx = 200` to `cx = 120`. Save, run. The face slid LEFT — and the eyes
   and mouth followed!

### Your Turn
1. Move the face to the bottom of the window (make `cy` bigger).
2. Make a tiny face (`r = 40`) and then a huge one (`r = 150`).
3. Change `face_color` to your favourite colour.
4. Predict each change before you run it.

### 📸 Show Emrys
Send a screenshot of your face in a NEW position and size. Tell Emrys which
variables you changed.

### Check Your Brain
- What is a variable?
- Which variable moves the face up and down?
- Why do the eyes move when you change `cx`?
- Why is `r` better than typing the size four times?

### More Examples
One box feeding another:

```python
cx = 200
eye_gap = 30
left_eye_x = cx - eye_gap
right_eye_x = cx + eye_gap
print(left_eye_x, right_eye_x)   # 170 230
```

### Common Mistakes
- **Using a box before filling it:** using `cx` before `cx = 200` → `NameError`.
  **Fix:** create the box (give it a value) first, above where you use it.
- **Spelling the name differently:** `face_color` vs `facecolor` are two different
  boxes. **Fix:** keep names exactly the same everywhere.

### Level Up 🚀
Add a variable `eye_size` and use it for BOTH eyes, so changing one number
resizes both eyes at once.

---

## Lesson 4: Numbers and Simple Maths

### Big Idea
Python can do maths, and we use maths to place every part of the face perfectly.

### Kid Meaning
Python is a super-fast calculator. `+ - * /` mean add, subtract, multiply,
divide. We use them to put the eyes exactly where they belong on the face.

### Chatbot Connection
The middle of our window is `WIDTH / 2`. The eyes sit either side of `cx`.
Getting a face to look right is all arithmetic.

### The Code
```python
import tkinter as tk

WIDTH = 400
HEIGHT = 400

root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1230")
canvas.pack()

cx = WIDTH / 2            # always the middle, even if WIDTH changes
cy = HEIGHT / 2
r = 90
eye_gap = r / 3           # eyes spread out with the face size
eye_size = r / 8

canvas.create_oval(cx - r, cy - r, cx + r, cy + r, fill="#ffd54a")
canvas.create_oval(cx - eye_gap - eye_size, cy - 25,
                   cx - eye_gap + eye_size, cy - 25 + 2 * eye_size, fill="black")
canvas.create_oval(cx + eye_gap - eye_size, cy - 25,
                   cx + eye_gap + eye_size, cy - 25 + 2 * eye_size, fill="black")
canvas.create_line(cx - r / 2, cy + r / 2, cx + r / 2, cy + r / 2, width=5)

root.mainloop()
```

### What You'll See
A perfectly centred face whose eyes and mouth are spaced using maths — so if you
change `r`, everything scales together nicely.

### Line by Line
- `WIDTH = 400` and `HEIGHT = 400` — boxes holding the window size, used
  everywhere so the maths always fits.
- `cx = WIDTH / 2` — half of 400 is 200, the left-right middle.
- `eye_gap = r / 3` — the eyes sit one-third of the radius from the centre. Change
  `r` and the gap adjusts by itself!
- `cx - r / 2` — half a radius left of centre: where the mouth starts.

### Do It in VS Code 🛠️
1. New file `face_maths.py`. Type the code.
2. Save, run — a neatly centred face.
3. Change `r = 90` to `r = 140`. Save, run. Notice the eyes and mouth grew and
   spread out TOO, because their positions are built from `r`.

### Your Turn
1. Make the mouth wider by changing `r / 2` to `r / 1.5`.
2. Move the eyes further apart (`r / 2` instead of `r / 3`).
3. Print some maths in the terminal to check: `print(10 + 5, 10 * 5, 10 / 5)`.

### 📸 Show Emrys
Screenshot your face at TWO different `r` values (small and big). Tell Emrys how
the eyes changed.

### Check Your Brain
- What do `*` and `/` mean?
- What is `WIDTH / 2` when `WIDTH` is 400?
- Why is it smart to build `eye_gap` from `r` instead of typing 30?

### More Examples
The `%` sign gives the remainder (useful for patterns):

```python
print(17 % 5)   # shows 2, because 17 = 3*5 + 2
```

### Common Mistakes
- **Whole vs decimal:** `400 / 2` gives `200.0` (a decimal). tkinter is fine with
  that. Use `//` for a whole number: `400 // 2` gives `200`.
- **Forgetting order:** Python does `*` and `/` before `+` and `-`, just like
  school. Use brackets to be sure: `(r + 10) / 2`.

### Level Up 🚀
Make the face automatically sit in the middle no matter the window size — try
`WIDTH = 600` and check nothing breaks.

---

## Lesson 5: Changing the Face by Changing a Variable

### Big Idea
If we redraw the face with a different value, its expression changes.

### Kid Meaning
The face isn't glued down. Wipe it, change one number, draw it again — and now
its mouth is somewhere else. That's how our bot will react to you.

### Chatbot Connection
Every time you type a mood, the bot will wipe the old face and draw a new one.
This lesson is that exact trick.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="#0e1230")
canvas.pack()

cx, cy, r = 200, 180, 90

def draw_face(mouth_y):
    canvas.delete("all")
    canvas.create_oval(cx - r, cy - r, cx + r, cy + r, fill="#ffd54a")
    canvas.create_oval(cx - 35, cy - 30, cx - 15, cy - 10, fill="black")
    canvas.create_oval(cx + 15, cy - 30, cx + 35, cy - 10, fill="black")
    canvas.create_line(cx - 35, mouth_y, cx + 35, mouth_y, width=5)

draw_face(cy + 40)

root.mainloop()
```

### What You'll See
The face with its mouth at the height you passed in. Change `draw_face(cy + 40)`
to `draw_face(cy + 10)` and the mouth jumps higher up the face.

### Line by Line
- `def draw_face(mouth_y):` — a reusable machine (a function) that draws the whole
  face. `mouth_y` is a value we hand it.
- `canvas.delete("all")` — wipes the canvas clean first, so the old face doesn't
  stay underneath.
- `draw_face(cy + 40)` — calls the machine, telling it where to put the mouth.
- Change the number you pass and the face changes. One machine, many faces!
- `cx, cy, r = 200, 180, 90` — a shortcut for filling three boxes on one line.

### Do It in VS Code 🛠️
1. New file `change_face.py`. Type the code.
2. Save, run. Note where the mouth is.
3. Change the last call to `draw_face(cy + 10)`. Save, run — the mouth moved up.
4. Try `draw_face(cy + 60)` — a low, droopy mouth.

### Your Turn
1. Call `draw_face` with three different mouth heights (one at a time).
2. Add a second thing that changes — pass in a colour too (peek at Lesson 15!).
3. Predict where the mouth goes for `draw_face(cy)`.

### 📸 Show Emrys
Screenshot the face with a HIGH mouth and with a LOW mouth (two shots). Tell
Emrys which number you changed.

### Check Your Brain
- Why do we call `canvas.delete("all")` before redrawing?
- What does `draw_face(cy + 40)` hand to the machine?
- What happens if you never call `draw_face` at all?

### More Examples
Counting in the terminal (the same "change a value" idea, no drawing):

```python
count = 0
count = count + 1
count = count + 1
print(count)   # shows 2
```

### Common Mistakes
- **Faces stack up:** forgetting `canvas.delete("all")` draws a new face ON TOP of
  the old one. **Fix:** wipe before redrawing.
- **Defining but never calling:** the machine exists but nothing runs it. **Fix:**
  call it — `draw_face(cy + 40)`.

### Level Up 🚀
Make the mouth a curved smile using `create_arc` instead of a straight line (full
explanation in Lesson 10 — try it early!).

---

## Lesson 6: Talking to the Bot with an Entry Box

### Big Idea
An Entry box lets the player TYPE something, and a Button sends it to our code.

### Kid Meaning
A chatbot needs you to talk to it. The Entry box is where you type; the Button is
the "send" key that hands your words to the program.

### Chatbot Connection
This is HUGE: this is how you'll tell the bot how you feel. Everything the bot
does starts with reading what you typed.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="#0e1230")
canvas.pack()

def send():
    words = entry.get()
    canvas.delete("all")
    canvas.create_text(200, 150, text=words, fill="lime",
                       font=("Arial", 20))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Send", command=send).pack()

root.mainloop()
```

### What You'll See
A window with a typing box and a **Send** button. Type anything, press Send, and
your words appear in big green letters. The box clears itself, ready for the next
message.

### Line by Line
- `def send():` — the machine that runs when the button is pressed.
- `words = entry.get()` — `entry.get()` reads whatever the player typed and
  stores it in the box `words`.
- `canvas.delete("all")` — wipes the canvas so old text doesn't pile up.
- `entry.delete(0, tk.END)` — clears the typing box from start (0) to end, ready
  for the next message.
- `entry = tk.Entry(root, ...)` — makes the typing box. `justify="center"` centres
  what you type.
- `tk.Button(root, text="Send", command=send)` — makes a button. `command=send`
  means "when clicked, run `send`." (No brackets after `send` — we're NAMING the
  machine, not running it yet.)

### Do It in VS Code 🛠️
1. New file `talk.py`. Type the code.
2. Save, run. Type "hello" and press **Send** — it appears big and green.
3. Type something else and press Send again — it replaces the old one.

### Your Turn
1. Change the button text to `"Talk"`.
2. Change the colour and font size of the shown words.
3. Predict: what shows if you press Send with the box EMPTY?

### 📸 Show Emrys
Screenshot your window showing YOUR typed message. Tell Emrys what you typed.

### Check Your Brain
- What does `entry.get()` give you?
- What does `command=send` do?
- Why do we call `entry.delete(0, tk.END)` at the end?

### More Examples
Show the message AND a shape:

```python
def send():
    words = entry.get()
    canvas.delete("all")
    canvas.create_text(200, 80, text=words, fill="white", font=("Arial", 18))
    canvas.create_oval(150, 120, 250, 220, fill="#ffd54a")
    entry.delete(0, tk.END)
```

### Common Mistakes
- **Adding brackets:** `command=send()` runs it INSTANTLY (wrong). **Fix:** no
  brackets — `command=send`.
- **Text piles up:** forgetting `canvas.delete("all")` stacks new text on old.
  **Fix:** clear before you redraw.
- **Widget doesn't show:** every Entry and Button needs `.pack()`. **Fix:** add it.

### Level Up 🚀
Make pressing the **Enter** key send the message too:
`entry.bind("<Return>", lambda event: send())` — put it right after `entry.pack()`.

---

## Lesson 7: f-strings — Dropping Values Into Sentences

### Big Idea
An f-string lets us build a sentence with values dropped inside it.

### Kid Meaning
Instead of gluing words together awkwardly, put an `f` before the quotes and drop
any box inside `{ }`. Python fills in the value for you.

### Chatbot Connection
Our bot says things like "Nice to meet you, Ama!" — that's a sentence with the
name dropped in. f-strings build every reply the bot makes.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="#0e1230")
canvas.pack()

def greet():
    person = entry.get()
    canvas.delete("all")
    canvas.create_text(200, 120, text=f"Nice to meet you, {person}!",
                       fill="#ffd54a", font=("Arial", 18))
    canvas.create_text(200, 170, text=f"Your name has {len(person)} letters.",
                       fill="white", font=("Arial", 13))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Greet", command=greet).pack()

root.mainloop()
```

### What You'll See
Type your name, press **Greet**, and the bot says "Nice to meet you, Ama!" plus
how many letters are in your name.

### Line by Line
- `f"Nice to meet you, {person}!"` — the `f` before the quotes turns on the magic.
  Anything inside `{ }` is a box name, and Python drops its value in.
- `len(person)` — `len` counts how many letters are in the text.
- You can put maths inside the braces too: `f"{2 + 3}"` shows `5`.

### Do It in VS Code 🛠️
1. New file `fstring.py`. Type the code.
2. Save, run. Type your name and press Greet.
3. Try a long name and a short one — watch the letter count change.

### Your Turn
1. Add a third line: `f"Hello {person}, welcome to Python!"`.
2. Show the name in CAPITALS: `f"{person.upper()}"`.
3. Predict what `len("Ama")` gives. (Answer: 3.)

### 📸 Show Emrys
Screenshot your greeting with your name and letter count. Tell Emrys your name's
length.

### Check Your Brain
- What does the `f` before the quotes do?
- What goes inside the `{ }`?
- What does `len(person)` count?

### More Examples
f-strings in the terminal:

```python
name = "Ama"
age = 10
print(f"{name} is {age} years old.")     # Ama is 10 years old.
print(f"Next year {name} will be {age + 1}.")
```

### Common Mistakes
- **Forgetting the `f`:** `"{person}"` prints the braces literally as `{person}`.
  **Fix:** put `f` right before the opening quote.
- **Wrong box name inside braces:** `{persn}` → `NameError`. **Fix:** spell it
  exactly as you named it.

### Level Up 🚀
Make the greeting show the name backwards too: `f"{person[::-1]}"` — a fun trick!

---

## Lesson 8: Tidying Text and a Mini Hello-Bot

### Big Idea
`.lower()` and `.strip()` clean up messy typing so our bot can understand it.

### Kid Meaning
People type "HAPPY", " happy ", and "Happy" — all the same word to us, but three
DIFFERENT words to the computer. We tidy them into one neat form first.

### Chatbot Connection
Before the bot checks your mood, it tidies what you typed. Without this, typing
"Happy" with a capital H would confuse it completely.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 420, 380
root = tk.Tk()
root.title("Hello Bot")
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1230")
canvas.pack()

def hello():
    raw = entry.get()
    tidy = raw.lower().strip()
    canvas.delete("all")
    canvas.create_oval(150, 40, 270, 160, fill="#ffd54a")
    canvas.create_oval(178, 80, 194, 96, fill="black")
    canvas.create_oval(226, 80, 242, 96, fill="black")
    canvas.create_line(180, 125, 240, 125, width=5)
    canvas.create_text(WIDTH/2, 210, text=f"You typed: '{raw}'",
                       fill="#8fa0d8", font=("Arial", 12))
    canvas.create_text(WIDTH/2, 240, text=f"I tidied it to: '{tidy}'",
                       fill="lime", font=("Arial", 13))
    canvas.create_text(WIDTH/2, 285, text=f"Hello, {tidy.title()}!",
                       fill="#ffd54a", font=("Arial", 20, "bold"))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=8)
tk.Button(root, text="Say hello", command=hello).pack()

root.mainloop()
```

### What You'll See
A little emoji face greets you. Type `"  AMA  "` (with spaces and capitals) and it
shows you exactly what you typed, the tidied version `ama`, and a neat greeting
"Hello, Ama!"

### Line by Line
- `raw = entry.get()` — exactly what the player typed, mess and all.
- `raw.lower()` — turns every letter into small letters: `"HAPPY"` → `"happy"`.
- `.strip()` — removes spare spaces at the START and END: `"  ama  "` → `"ama"`.
- `raw.lower().strip()` — does BOTH, one after the other. This is called
  **chaining** — the result of the first feeds into the second.
- `tidy.title()` — makes the First Letter Capital, nice for showing a name.

### Do It in VS Code 🛠️
1. New file `hello_bot.py`. Type the code.
2. Save, run. Type your name normally — nice greeting.
3. Now type it with CAPITALS and extra spaces. See how `tidy` cleans it up while
   `raw` shows the mess.

### Your Turn
1. Type `"  KOFI  "` and check that the greeting still looks neat.
2. Remove `.strip()` and type a name with spaces — see what breaks.
3. Predict what `"  Happy  ".lower().strip()` gives. (Answer: `"happy"`.)

### 📸 Show Emrys
Screenshot your Hello-Bot showing the raw AND tidied versions. Tell Emrys what
messy text you typed.

### Check Your Brain
- What does `.lower()` do?
- What does `.strip()` remove?
- Why must we tidy text before checking a mood?
- What does `.title()` do?

### More Examples
See tidying in the terminal:

```python
messy = "   SAD  "
print(messy.lower())          # "   sad  "
print(messy.lower().strip())  # "sad"
```

### Common Mistakes
- **Forgetting the brackets:** `raw.lower` (no `()`) doesn't run it. **Fix:**
  `raw.lower()`.
- **Tidying but not USING it:** calling `raw.lower()` without storing it changes
  nothing. **Fix:** `tidy = raw.lower().strip()`.

### Level Up 🚀
Add `.replace("!", "")` to the chain so exclamation marks get removed too.

---

# PART 2 — MAKING CHOICES & EXPRESSIONS

## Lesson 9: Making Decisions with if

### Big Idea
`if` lets the program CHOOSE what to do based on what you typed.

### Kid Meaning
"IF you say you're happy, smile." The computer checks — is it true? — and only
then does the action.

### Chatbot Connection
This is the first spark of the bot's brain: IF the word "happy" is in your
message, draw a smile.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=400, bg="#0e1230")
canvas.pack()
cx, cy, r = 200, 170, 90

def send():
    text = entry.get().lower().strip()
    canvas.delete("all")
    canvas.create_oval(cx-r, cy-r, cx+r, cy+r, fill="#ffd54a")
    canvas.create_oval(cx-35, cy-30, cx-15, cy-10, fill="black")
    canvas.create_oval(cx+15, cy-30, cx+35, cy-10, fill="black")
    if "happy" in text:
        canvas.create_arc(cx-50, cy-10, cx+50, cy+70, start=200, extent=140,
                          style="arc", width=6)
        canvas.create_text(200, 330, text="You seem happy!", fill="lime")
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Send", command=send).pack()

root.mainloop()
```

### What You'll See
Type "I am happy" and press Send — the face gets a **smiling curve** and a green
message. Type anything else and the face stays blank-mouthed (for now).

### Line by Line
- `if "happy" in text:` — checks: does the word "happy" appear ANYWHERE inside
  what they typed? `in` searches inside the text.
- The `:` starts the "then do this" block, and the indented lines ONLY run when
  the check is true.
- `create_arc(...)` — draws a curve. `start=200, extent=140` sweeps across the
  BOTTOM of an invisible box, which looks like a **smile** (a U shape).
- `style="arc"` — draw only the curved line, not a filled pie slice.

### Do It in VS Code 🛠️
1. New file `first_mood.py`. Type the code.
2. Save, run. Type "happy" → smile appears. Type "hello" → no smile.
3. Try "I feel so happy today" — the `in` check still finds it!

### Your Turn
1. Change the check to `if "great" in text:` and test.
2. Change the message and its colour.
3. Predict: does "HAPPY" (capitals) work? (Yes — because we `.lower()` first!)

### 📸 Show Emrys
Screenshot the smiling face after typing a happy message. Tell Emrys the exact
sentence you typed.

### Check Your Brain
- What does `if` do?
- What does `in` check for?
- When do the indented lines under `if` run?
- Why does `.lower()` make the check work for "HAPPY"?

### More Examples
Checking a different word:

```python
if "hello" in text:
    canvas.create_text(200, 350, text="Hi there!", fill="white")
```

### Common Mistakes
- **Forgetting the colon:** `if "happy" in text` (no `:`) → `SyntaxError`. **Fix:**
  add the `:`.
- **Not indenting:** the lines under `if` must be indented (4 spaces). **Fix:**
  indent them so Python knows they belong to the `if`.

### Level Up 🚀
Add a SECOND `if` for the word "sad" that draws a frown (hint: use
`start=20, extent=140` and a lower box — full version next lesson).

---

## Lesson 10: if / elif / else — Many Moods

### Big Idea
`if / elif / else` handles several possibilities: this mood, or that one,
otherwise a friendly default.

### Kid Meaning
"IF happy, smile. ELSE IF sad, droop. ELSE just be calm." Python checks them top
to bottom and does the FIRST one that's true.

### Chatbot Connection
This is EXACTLY our bot's brain: each mood gets its own face, colour, and reply.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=430, bg="#0e1230")
canvas.pack()
cx, cy, r = 200, 170, 90

def draw(mood, color):
    canvas.delete("all")
    canvas.create_oval(cx-r, cy-r, cx+r, cy+r, fill=color)
    canvas.create_oval(cx-35, cy-30, cx-15, cy-10, fill="black")
    canvas.create_oval(cx+15, cy-30, cx+35, cy-10, fill="black")
    if mood == "happy":
        canvas.create_arc(cx-50, cy-10, cx+50, cy+70, start=200, extent=140,
                          style="arc", width=6)
    elif mood == "sad":
        canvas.create_arc(cx-50, cy+30, cx+50, cy+100, start=20, extent=140,
                          style="arc", width=6)
    else:
        canvas.create_line(cx-35, cy+45, cx+35, cy+45, width=6)
    canvas.create_text(200, 330, text=f"Mood: {mood}", fill="white",
                       font=("Arial", 16))

def send():
    text = entry.get().lower().strip()
    if "happy" in text:
        draw("happy", "#ffd54a")
    elif "sad" in text:
        draw("sad", "#7db4ff")
    else:
        draw("okay", "#c8d0ff")
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Send", command=send).pack()

root.mainloop()
```

### What You'll See
Type "happy" → a **yellow smiling** face. Type "sad" → a **blue drooping** face.
Type anything else → a **pale calm** face. The mood name shows underneath.

### Line by Line
- `if "happy" in text:` — first check. If true, do this and SKIP the rest.
- `elif "sad" in text:` — "else if" — only checked if the first was false.
- `else:` — the leftover case, our friendly default.
- Inside `draw`, another `if/elif/else` picks the **mouth shape**:
  - **Smile:** `start=200, extent=140` sweeps the BOTTOM of the box → a U curve.
  - **Frown:** `start=20, extent=140` sweeps the TOP → an ∩ curve.
  - **Straight:** a plain line for calm.
- `mood == "happy"` — `==` means "is exactly equal to" (two equals signs!).

### Do It in VS Code 🛠️
1. New file `moods.py`. Type the code.
2. Save, run. Test all three: "happy", "sad", "hello".
3. Swap the smile and frown numbers and see how wrong it looks — then put them
   back. Now you understand arcs!

### Your Turn
1. Add an `elif "angry" in text:` that draws a red face.
2. Change the three colours to your own palette.
3. Predict which face shows for "I am not sad" (it says sad — our bot is simple!).

### 📸 Show Emrys
Screenshot all three faces (three shots). Tell Emrys which words triggered each.

### Check Your Brain
- What is the difference between `if` and `elif`?
- When does `else` run?
- Which numbers turn an arc into a smile instead of a frown?
- What does `==` mean?

### More Examples
An elif chain with grades:

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
- **Using many `if`s instead of `elif`:** separate `if`s can ALL run and draw
  faces on top of each other. **Fix:** use `elif`/`else` so only one runs.
- **`=` vs `==`:** `if mood = "happy"` is an error. **Fix:** use `==` to compare.

### Level Up 🚀
Add a "surprised" mood that draws a small round **O** mouth using `create_oval`.

---

## Lesson 11: True and False — Booleans

### Big Idea
Every check is either True or False — those two values are called Booleans.

### Kid Meaning
A light switch is on or off. A check is True or False. `"happy" in text` is a
question Python answers with True or False.

### Chatbot Connection
"Did they mention a happy word?" is a True/False fact. We can store it in a box
and use it to decide the face.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="#0e1230")
canvas.pack()

def send():
    text = entry.get().lower().strip()
    is_happy = ("happy" in text)
    is_sad = ("sad" in text)
    canvas.delete("all")
    canvas.create_text(200, 80, text=f"is_happy = {is_happy}", fill="lime",
                       font=("Arial", 16))
    canvas.create_text(200, 120, text=f"is_sad = {is_sad}", fill="#7db4ff",
                       font=("Arial", 16))
    if is_happy:
        canvas.create_text(200, 190, text="Smiling!", fill="#ffd54a",
                           font=("Arial", 22))
    elif is_sad:
        canvas.create_text(200, 190, text="Aww...", fill="#7db4ff",
                           font=("Arial", 22))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Send", command=send).pack()

root.mainloop()
```

### What You'll See
Type "I am happy" and you literally SEE `is_happy = True` and `is_sad = False` on
screen, plus the matching message.

### Line by Line
- `is_happy = ("happy" in text)` — Python answers the question and stores True or
  False in the box `is_happy`.
- `if is_happy:` — since `is_happy` is ALREADY True or False, we can use it
  directly. No need to write `if is_happy == True`.
- The f-strings print the Boolean value so you can watch it change.

### Do It in VS Code 🛠️
1. New file `booleans.py`. Type the code.
2. Save, run. Type "happy" → watch `True` appear. Type "sad" → the other flips.
3. Type "happy and sad" — BOTH are True! Which message shows? (The first one — `if`
   wins over `elif`.)

### Your Turn
1. Add a third Boolean `is_angry = ("angry" in text)` and show it.
2. Type a message that makes all three False.
3. Predict the two values for the message "so sad today".

### 📸 Show Emrys
Screenshot the screen showing True and False values. Tell Emrys what you typed.

### Check Your Brain
- What two values can a Boolean be?
- What does `is_happy = ("happy" in text)` store?
- Why can we write `if is_happy:` without `== True`?

### More Examples
Booleans in the terminal:

```python
print(10 > 3)          # True
print("a" in "cat")    # True
print(2 < 1)           # False
```

### Common Mistakes
- **Quoting True:** `is_happy = "True"` makes a WORD, not a Boolean. **Fix:**
  no quotes.
- **One equals sign:** `if is_happy = True` → error. **Fix:** `if is_happy:`.

### Level Up 🚀
Combine two checks with `and`: `if is_happy and is_sad:` show "Mixed feelings!"

---

## Lesson 12: Repeating with a for Loop

### Big Idea
A `for` loop repeats an action many times — perfect for drawing lots of things.

### Kid Meaning
Instead of writing 5 almost-identical lines, a loop says "do this 5 times,
counting as you go." The counter changes each time so each item lands somewhere
new.

### Chatbot Connection
We'll use loops to draw a row of little mood faces, and later to CHECK a whole
list of happy words one by one.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=440, height=200, bg="#0e1230")
canvas.pack()

colors = ["#ffd54a", "#7db4ff", "#ff6b6b", "#a0e8a0", "#e0a0ff"]

for i in range(5):
    x = 60 + i * 80
    canvas.create_oval(x - 30, 60, x + 30, 120, fill=colors[i])
    canvas.create_oval(x - 12, 78, x - 4, 86, fill="black")
    canvas.create_oval(x + 4, 78, x + 12, 86, fill="black")
    canvas.create_line(x - 14, 104, x + 14, 104, width=3)
    canvas.create_text(x, 145, text=str(i), fill="white")

root.mainloop()
```

### What You'll See
A neat **row of five little emoji faces**, each a different colour, numbered 0 to
4 underneath — all drawn by ONE loop.

### Line by Line
- `colors = [...]` — a **list**: several values in one box, in order.
- `for i in range(5):` — count `i` from 0 up to (not including) 5 → 0, 1, 2, 3, 4.
- `x = 60 + i * 80` — turns the counter into a position. Each face sits 80 pixels
  further right than the last.
- `colors[i]` — picks the colour at position `i` from the list. **Lists start at
  0**, so `colors[0]` is the first one.
- `str(i)` — turns the number into text so `create_text` can show it.

### Do It in VS Code 🛠️
1. New file `row.py`. Type the code.
2. Save, run — five faces appear.
3. Change `range(5)` to `range(3)` — only three faces.

### Your Turn
1. Space the faces further apart (change `80` to `100`) and widen the canvas.
2. Add a sixth colour to the list and change `range(5)` to `range(6)`.
3. Predict what `colors[0]` and `colors[2]` are.

### 📸 Show Emrys
Screenshot your row of faces. Tell Emrys how many you drew and the spacing used.

### Check Your Brain
- What does a `for` loop do?
- What numbers does `range(5)` produce?
- Is `colors[0]` the first or second item?
- Why does `str(i)` matter for `create_text`?

### More Examples
Looping straight over a list (no counter needed):

```python
for c in ["glad", "great", "good"]:
    print(c)
```

### Common Mistakes
- **Off-by-one:** `range(5)` gives 0–4, NOT 1–5. **Fix:** use `range(1, 6)` if you
  want 1–5.
- **List index too big:** `colors[5]` when the list has 5 items → `IndexError`
  (the last one is `colors[4]`). **Fix:** count from 0.

### Level Up 🚀
Draw the faces in a vertical column instead of a row (change which number uses
`i`).

---

## Lesson 13: The Chat Loop — Keep Talking

### Big Idea
In a window app, we don't loop-and-wait for the player. Each **button click** is
one turn of the conversation.

### Kid Meaning
In the terminal you'd write `while True: ask again`. But in a window that would
FREEZE everything. Instead, every time you press Send, the bot takes one turn.
You control the pace.

### Chatbot Connection
"Keep chatting until you say bye" is just "let them press Send as many times as
they like, and check for the word bye each time."

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="#0e1230")
canvas.pack()

turns = 0

def send():
    global turns
    text = entry.get().lower().strip()
    canvas.delete("all")
    if text == "bye":
        canvas.create_text(200, 140, text=f"Bye! We chatted {turns} times.",
                           fill="#ffd54a", font=("Arial", 15))
    else:
        turns = turns + 1
        canvas.create_text(200, 120, text=f"You said: {text}", fill="white",
                           font=("Arial", 14))
        canvas.create_text(200, 160, text=f"Turn number {turns}", fill="lime",
                           font=("Arial", 14))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
entry.bind("<Return>", lambda event: send())
tk.Button(root, text="Send", command=send).pack()

root.mainloop()
```

### What You'll See
Each Send counts a turn: "Turn number 1", "Turn number 2"… Type **bye** and the
bot says goodbye with the total. The window never freezes — it just waits for
your next message.

### Line by Line
- `turns = 0` — memory that survives between clicks (it lives OUTSIDE the
  function).
- `global turns` — lets the function change that outside box.
- `if text == "bye":` — checks for the exact word "bye" to end the chat.
- `entry.bind("<Return>", lambda event: send())` — makes the **Enter key** send
  too, just like a real chat app. (`lambda event:` is just the little wrapper
  tkinter needs — don't worry about it yet.)
- The window sitting patiently between clicks IS the loop — `mainloop()` handles
  it for us.

### Do It in VS Code 🛠️
1. New file `chat_turns.py`. Type the code.
2. Save, run. Send several messages, watching the turn count climb.
3. Press **Enter** instead of clicking — it works too!
4. Type "bye" to finish.

### Your Turn
1. Change the goodbye message to your own wording.
2. Add an `elif text == "hi":` that gives a special greeting.
3. Predict the turn count after sending 4 messages then "bye".

### 📸 Show Emrys
Screenshot your goodbye screen showing the total turns. Tell Emrys how many
messages you sent.

### Check Your Brain
- Why don't we use a `while True` loop to keep chatting in a window?
- Where must `turns` live so it remembers between clicks?
- What does `entry.bind("<Return>", ...)` add?

### More Examples
Two buttons sharing one counter:

```python
def up():
    global n
    n = n + 1
```

### Common Mistakes
- **Putting the counter inside the function:** `def send(): turns = 0` resets it
  every time. **Fix:** define it OUTSIDE and use `global`.
- **A `while True` loop in a window app:** it freezes the window solid. **Fix:**
  use button clicks (the event model).

### Level Up 🚀
Add a "Reset chat" button that sets `turns` back to 0 and clears the canvas.

---

## Lesson 14: Functions — Reusable Reply Machines

### Big Idea
A function is a named machine: define it once, then run it whenever you like.

### Kid Meaning
A blender is a machine — you don't rebuild it each time, you press its button. A
function is code you name once and reuse by calling it.

### Chatbot Connection
We'll build machines like `draw_face()` and `say()` and call them on every
message — instead of copying the same drawing code over and over.

### The Code
```python
import tkinter as tk

WIDTH = 400
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=420, bg="#0e1230")
canvas.pack()
cx, cy, r = 200, 160, 85

def draw_face():
    canvas.delete("face")
    canvas.create_oval(cx-r, cy-r, cx+r, cy+r, fill="#ffd54a", tags="face")
    canvas.create_oval(cx-32, cy-28, cx-14, cy-10, fill="black", tags="face")
    canvas.create_oval(cx+14, cy-28, cx+32, cy-10, fill="black", tags="face")
    canvas.create_arc(cx-45, cy-10, cx+45, cy+60, start=200, extent=140,
                      style="arc", width=5, tags="face")

def say(words):
    canvas.delete("bubble")
    canvas.create_rectangle(30, 290, WIDTH-30, 360, fill="#1b2350",
                            outline="#3a4a90", width=2, tags="bubble")
    canvas.create_text(WIDTH/2, 325, text=words, fill="white",
                       width=WIDTH-70, font=("Arial", 13), tags="bubble")

draw_face()
say("Hi! I'm your Emoji Mood Bot.")

root.mainloop()
```

### What You'll See
A smiling face with a proper **speech bubble** below it saying "Hi! I'm your Emoji
Mood Bot."

### Line by Line
- `def draw_face():` — defines the machine. Nothing happens yet — we're just
  building it.
- `def say(words):` — a machine that draws the speech bubble with whatever words
  we hand it.
- `tags="face"` / `tags="bubble"` — **labels** on the shapes. `canvas.delete("face")`
  erases ONLY the face, leaving the bubble alone. This is much better than
  `delete("all")`, which would wipe everything.
- `width=WIDTH-70` inside `create_text` — makes long sentences **wrap** onto
  several lines instead of running off the edge.
- `draw_face()` and `say(...)` — calling the machines actually runs them.

### Do It in VS Code 🛠️
1. New file `machines.py`. Type the code.
2. Save, run — face plus speech bubble.
3. Change the `say(...)` text and run again. Only the bubble changes!

### Your Turn
1. Call `say` twice with different words — which one wins? (The last, because of
   the `"bubble"` delete.)
2. Add a `clear()` machine that deletes everything, and call it first.
3. Predict what `canvas.delete("face")` erases — the bubble too?

### 📸 Show Emrys
Screenshot your face with its speech bubble. Tell Emrys the name of your two
functions.

### Check Your Brain
- What does `def` do?
- What is the difference between DEFINING a function and CALLING it?
- Why are `tags` better than `delete("all")` here?
- What does `width=` do inside `create_text`?

### More Examples
A tiny function you call by name:

```python
def hello():
    print("Hi there!")

hello()   # runs it
hello()   # runs it again
```

### Common Mistakes
- **Defining but never calling:** the machine exists but nothing runs it. **Fix:**
  call it — `draw_face()`.
- **Deleting everything by accident:** `delete("all")` wipes the bubble too.
  **Fix:** delete by tag.

### Level Up 🚀
Add a `draw_background()` machine that draws stars behind the face using a `for`
loop (Lesson 12).

---

## Lesson 15: Functions That Take Information — Parameters

### Big Idea
Parameters let us hand information INTO a function so it can do different things.

### Kid Meaning
A vending machine does different things depending on which button you press. A
parameter is the "which button" — you give the function a value and it uses it.

### Chatbot Connection
`draw_face(mood)` will take the mood and draw the RIGHT expression — one machine
that can be happy, sad, or angry depending on what we pass it.

### The Code
```python
import tkinter as tk

WIDTH = 400
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=380, bg="#0e1230")
canvas.pack()
cx, cy, r = 200, 160, 85

def draw_face(mood):
    canvas.delete("face")
    colors = {"happy": "#ffd54a", "sad": "#7db4ff", "angry": "#ff6b6b"}
    color = colors.get(mood, "#c8d0ff")
    canvas.create_oval(cx-r, cy-r, cx+r, cy+r, fill=color, tags="face")
    canvas.create_oval(cx-32, cy-28, cx-14, cy-10, fill="black", tags="face")
    canvas.create_oval(cx+14, cy-28, cx+32, cy-10, fill="black", tags="face")
    if mood == "happy":
        canvas.create_arc(cx-45, cy-10, cx+45, cy+60, start=200, extent=140,
                          style="arc", width=5, tags="face")
    elif mood == "sad":
        canvas.create_arc(cx-45, cy+25, cx+45, cy+95, start=20, extent=140,
                          style="arc", width=5, tags="face")
    else:
        canvas.create_line(cx-30, cy+42, cx+30, cy+42, width=5, tags="face")
    canvas.create_text(cx, 320, text=f"mood = {mood}", fill="white",
                       tags="face")

draw_face("happy")

root.mainloop()
```

### What You'll See
A yellow smiling face. Change the last line to `draw_face("sad")` → a blue
drooping face. `draw_face("angry")` → a red one. ONE machine, three faces.

### Line by Line
- `def draw_face(mood):` — `mood` is a parameter — an empty box waiting to be
  filled when we call the function.
- `colors = {...}` — a **dictionary**: it pairs each mood NAME with a colour. Like
  a real dictionary: look up a word, get its meaning.
- `colors.get(mood, "#c8d0ff")` — looks up the mood's colour. The second value is
  the **fallback** used if the mood isn't in the dictionary — so unknown moods
  don't crash.
- `draw_face("happy")` — calls the machine, filling `mood` with `"happy"`.

### Do It in VS Code 🛠️
1. New file `face_param.py`. Type the code.
2. Save, run — happy face.
3. Change the call to `draw_face("sad")`, then `draw_face("angry")`, then
   `draw_face("sleepy")` (watch the fallback colour appear!).

### Your Turn
1. Add a `"surprised"` colour to the dictionary and an `elif` for a round mouth.
2. Add a second parameter `size` and use it instead of `r`.
3. Predict the colour for `draw_face("excited")` (the fallback — it's not in the
   dictionary).

### 📸 Show Emrys
Screenshot the happy, sad, AND angry faces (three shots). Tell Emrys the values
you passed.

### Check Your Brain
- What is a parameter?
- How do values get INTO the parameter?
- What is a dictionary, and what does `.get(mood, fallback)` do?
- Why is one `draw_face` better than three separate functions?

### More Examples
A greet function with a parameter:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Ama")
greet("Kofi")
```

### Common Mistakes
- **Wrong number of values:** `draw_face()` when it expects one → `TypeError`.
  **Fix:** pass one, e.g. `draw_face("happy")`.
- **Using `colors[mood]` instead of `.get`:** an unknown mood crashes with
  `KeyError`. **Fix:** use `.get(mood, fallback)`.

### Level Up 🚀
Make `draw_face(mood, size)` so you can draw a big happy face and a small sad one.

---

## Lesson 16: Functions That Give an Answer Back — return

### Big Idea
`return` lets a function hand a value BACK to whoever called it.

### Kid Meaning
Some machines DO something (draw a face). Others ANSWER something (work out which
mood you meant). `return` is how a machine gives you its answer.

### Chatbot Connection
`mood_of(text)` will read your message and RETURN the mood name. `reply_for(mood)`
will RETURN the sentence to say. These two are the bot's real brain.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=300, bg="#0e1230")
canvas.pack()

def mood_of(text):
    if "happy" in text:
        return "happy"
    elif "sad" in text:
        return "sad"
    elif "angry" in text:
        return "angry"
    return "okay"

def reply_for(mood):
    if mood == "happy":
        return "That's wonderful to hear!"
    elif mood == "sad":
        return "I'm here for you."
    elif mood == "angry":
        return "Take a deep breath."
    return "Tell me more!"

def send():
    text = entry.get().lower().strip()
    mood = mood_of(text)
    answer = reply_for(mood)
    canvas.delete("all")
    canvas.create_text(200, 110, text=f"I think you feel: {mood}",
                       fill="lime", font=("Arial", 15))
    canvas.create_text(200, 160, text=answer, fill="white",
                       width=340, font=("Arial", 14))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Send", command=send).pack()

root.mainloop()
```

### What You'll See
Type "I feel sad today" → the bot shows "I think you feel: sad" and replies "I'm
here for you." The two machines worked together.

### Line by Line
- `def mood_of(text):` — a machine that ANSWERS. It looks at the text and hands
  back a mood name.
- `return "happy"` — hands the word "happy" back AND stops the function
  immediately. Nothing after it runs.
- The last `return "okay"` — reached only if no mood matched, so it's our default.
- `mood = mood_of(text)` — catches the answer in a box.
- `answer = reply_for(mood)` — feeds the FIRST machine's answer into the SECOND.
  That's how programs are built: small machines passing answers along.

### Do It in VS Code 🛠️
1. New file `brain.py`. Type the code.
2. Save, run. Test "happy", "sad", "angry", and "pizza" (the default).
3. Add `print(mood)` inside `send` and watch the answer in the terminal.

### Your Turn
1. Add an `"excited"` mood to BOTH machines.
2. Change all the replies to your own kind wording.
3. Predict what `mood_of("nothing much")` returns. (Answer: `"okay"`.)

### 📸 Show Emrys
Screenshot two different moods with their replies. Tell Emrys which words you
used.

### Check Your Brain
- What does `return` do?
- What happens to code written AFTER a `return` that runs?
- Why does `mood_of` end with a plain `return "okay"`?
- How does `reply_for` get its mood?

### More Examples
Return a calculated value:

```python
def square(n):
    return n * n

print(square(5))   # 25
```

### Common Mistakes
- **Forgetting to catch the answer:** calling `mood_of(text)` without storing it
  throws the answer away. **Fix:** `mood = mood_of(text)`.
- **Using `print` instead of `return`:** printing shows it but hands back nothing.
  **Fix:** use `return` when you need the value.

### Level Up 🚀
Write `is_question(text)` that returns True if the text ends with `"?"` (hint:
`text.endswith("?")`).

---

# PART 3 — BUILDING THE CHATBOT

## Lesson 17: Greeting and Remembering the Name

### Big Idea
The bot asks your name first, remembers it, and uses it in every reply.

### Kid Meaning
A good friend remembers your name. We store it in a box that stays filled between
messages, so the bot can greet you personally forever after.

### Chatbot Connection
This is the chatbot's first real conversation step — and the start of our final
program.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 420, 560
root = tk.Tk()
root.title("Emoji Mood Chatbot")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1230")
canvas.pack()

name = ""            # empty until they tell us
cx, cy, r = WIDTH/2, 180, 100

def draw_face():
    canvas.delete("face")
    canvas.create_oval(cx-r, cy-r, cx+r, cy+r, fill="#ffd54a", tags="face")
    canvas.create_oval(cx-40, cy-30, cx-22, cy-12, fill="black", tags="face")
    canvas.create_oval(cx+22, cy-30, cx+40, cy-12, fill="black", tags="face")
    canvas.create_arc(cx-50, cy-5, cx+50, cy+65, start=200, extent=140,
                      style="arc", width=6, tags="face")

def say(words):
    canvas.delete("bubble")
    canvas.create_rectangle(30, 330, WIDTH-30, 420, fill="#1b2350",
                            outline="#3a4a90", width=2, tags="bubble")
    canvas.create_text(WIDTH/2, 375, text=words, fill="white",
                       width=WIDTH-70, font=("Arial", 14), tags="bubble")

def send():
    global name
    text = entry.get().strip()
    entry.delete(0, tk.END)
    if text == "":
        return
    if name == "":
        name = text.title()
        say(f"Nice to meet you, {name}! How do you feel today?")
    else:
        say(f"You said '{text}', {name}.")

draw_face()
say("Hi! I'm your Emoji Mood Bot. What's your name?")
entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=8)
entry.bind("<Return>", lambda event: send())
entry.focus()
tk.Button(root, text="Send", font=("Arial", 13), command=send).pack()

root.mainloop()
```

### What You'll See
The bot greets you and asks your name. Type it → "Nice to meet you, Ama! How do
you feel today?" Every message after that uses your name.

### Line by Line
- `name = ""` — an EMPTY text box. Empty means "we don't know it yet."
- `if name == "":` — if we still don't know the name, treat this message AS the
  name.
- `name = text.title()` — store it with a capital first letter.
- `if text == "": return` — if they pressed Send with nothing typed, quietly do
  nothing. `return` leaves the function early.
- `root.resizable(False, False)` — locks the window size so the buttons can never
  get pushed off the screen.
- `entry.focus()` — puts the typing cursor in the box automatically, so you can
  type straight away.

### Do It in VS Code 🛠️
1. Create your real project file `chatbot.py`. Type the code.
2. Save, run. Type your name, then type anything else and see it remembered.

### Your Turn
1. Change the opening greeting to your own words.
2. Add the name to the window title after they type it.
3. Predict what happens if you press Send on an empty box.

### 📸 Show Emrys
Screenshot the bot greeting you BY NAME. Tell Emrys the name you gave it.

### Check Your Brain
- How does the bot know it hasn't learned your name yet?
- What does `.title()` do to the name?
- What does `return` do when the box is empty?
- Why lock the window with `resizable(False, False)`?

### More Examples
Remembering two things:

```python
name = ""
favourite = ""
```

### Common Mistakes
- **Forgetting `global name`:** the name never sticks — it resets each message.
  **Fix:** add `global name` at the top of `send`.
- **Comparing wrongly:** `if name = "":` is an error. **Fix:** `==`.

### Level Up 🚀
Add a "Forget me" button that sets `name = ""` so the bot asks again.

---

## Lesson 18: Matching Many Words with a List and `in`

### Big Idea
A list holds many words, and a loop checks them all — so lots of words mean the
same mood.

### Kid Meaning
People don't only say "happy" — they say "glad", "great", "excited". We put all
those words in one list and check the whole list at once.

### Chatbot Connection
This makes the bot MUCH smarter. Instead of knowing one word per mood, it knows
a whole family of words.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=420, height=260, bg="#0e1230")
canvas.pack()

happy_words = ["happy", "glad", "great", "good", "yay", "excited", "fun"]

def has_any(text, words):
    for word in words:
        if word in text:
            return True
    return False

def send():
    text = entry.get().lower().strip()
    found = has_any(text, happy_words)
    canvas.delete("all")
    canvas.create_text(210, 110, text=f"Happy word found? {found}",
                       fill="lime" if found else "#ff9999",
                       font=("Arial", 16))
    entry.delete(0, tk.END)

entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=6)
tk.Button(root, text="Check", command=send).pack()

root.mainloop()
```

### What You'll See
Type "I feel great today" → **True** in green (it found "great"). Type "meh" →
**False** in red.

### Line by Line
- `happy_words = [...]` — a **list**: many words in one box, separated by commas.
- `def has_any(text, words):` — a machine with TWO parameters: the message, and
  the list to search.
- `for word in words:` — walk through the list one word at a time.
- `if word in text: return True` — the moment we find ANY match, hand back True
  and stop looking. No need to check the rest!
- `return False` — reached only if the loop finished without finding anything.
  Notice it is lined up with the `for`, NOT inside it.
- `"lime" if found else "#ff9999"` — a one-line choice: green when True, red when
  False.

### Do It in VS Code 🛠️
1. New file `word_lists.py`. Type the code.
2. Save, run. Try "great", "yay", "excited", then something with none of them.
3. Add a word to the list, save, run, and test your new word.

### Your Turn
1. Add three more happy words of your own.
2. Make a `sad_words` list and check it too.
3. Predict the result for "I had a good day" (True — "good" is in the list).

### 📸 Show Emrys
Screenshot both a True and a False result. Tell Emrys which word was found.

### Check Your Brain
- What is a list?
- What does the `for` loop do to the list?
- Why does `return True` stop the loop early?
- When is `return False` reached?

### More Examples
Looping over a list and printing each:

```python
for w in ["glad", "great", "good"]:
    print(w)
```

### Common Mistakes
- **`return False` inside the loop:** it quits after checking only the FIRST word.
  **Fix:** put it AFTER the loop, lined up with the `for`.
- **Forgetting commas** between list items → `SyntaxError`. **Fix:** comma after
  every item except the last.

### Level Up 🚀
Write `which_word(text, words)` that returns the actual matching word (not just
True) so the bot can say "you said 'excited'!"

---

## Lesson 19: The Mood Brain as a Function

### Big Idea
One machine, `mood_of(text)`, reads the message and returns the mood name.

### Kid Meaning
This is the bot's brain in one box. Give it your sentence, it hands back "happy",
"sad", "angry", or "okay".

### Chatbot Connection
Everything else — the face colour, the mouth shape, the reply — is decided from
this one answer.

### The Code
Add these word lists near the top of `chatbot.py`:

```python
happy_words = ["happy", "glad", "great", "good", "yay", "excited", "fun"]
sad_words   = ["sad", "down", "cry", "bad", "unhappy", "lonely", "upset"]
angry_words = ["angry", "mad", "cross", "annoyed", "furious"]

def mood_of(text):
    if has_any(text, happy_words):
        return "happy"
    if has_any(text, sad_words):
        return "sad"
    if has_any(text, angry_words):
        return "angry"
    return "okay"
```

And upgrade the face machine to take a mood:

```python
def draw_face(mood):
    canvas.delete("face")
    colors = {"happy": "#ffd54a", "sad": "#7db4ff",
              "angry": "#ff6b6b", "okay": "#c8d0ff"}
    color = colors.get(mood, "#c8d0ff")
    canvas.create_oval(cx-r, cy-r, cx+r, cy+r, fill=color, tags="face")
    canvas.create_oval(cx-40, cy-30, cx-22, cy-12, fill="black", tags="face")
    canvas.create_oval(cx+22, cy-30, cx+40, cy-12, fill="black", tags="face")
    if mood == "happy":
        canvas.create_arc(cx-50, cy-5, cx+50, cy+65, start=200, extent=140,
                          style="arc", width=6, tags="face")
    elif mood == "sad":
        canvas.create_arc(cx-50, cy+30, cx+50, cy+100, start=20, extent=140,
                          style="arc", width=6, tags="face")
    elif mood == "angry":
        canvas.create_line(cx-38, cy+48, cx+38, cy+48, width=6, tags="face")
        canvas.create_line(cx-50, cy-42, cx-22, cy-32, width=5, tags="face")
        canvas.create_line(cx+50, cy-42, cx+22, cy-32, width=5, tags="face")
    else:
        canvas.create_line(cx-32, cy+45, cx+32, cy+45, width=6, tags="face")
```

### What You'll See
Once wired up (next lesson), the face turns yellow-and-smiling, blue-and-drooping,
or red-with-angry-eyebrows depending on what you type.

### Line by Line
- `mood_of` uses `has_any` from Lesson 18, so it checks whole word FAMILIES.
- Notice the plain `if`s (not `elif`) — that's fine here because each one
  `return`s, which exits immediately.
- **Order matters:** happy is checked first. "I'm not happy, I'm sad" is read as
  happy — our bot is simple, and that's okay to admit!
- In `draw_face`, the angry mood adds two slanted **eyebrow** lines — small
  details make a face feel alive.
- `colors.get(mood, "#c8d0ff")` — safe lookup with a fallback (Lesson 15).

### Do It in VS Code 🛠️
1. In `chatbot.py`, add the word lists, `has_any`, `mood_of`, and this new
   `draw_face(mood)` (replacing the old no-parameter one).
2. Change your startup call to `draw_face("okay")`.
3. Save and run — the bot still greets you; the moods get wired next lesson.

### Your Turn
1. Add a `"tired"` mood with its own words, colour, and a sleepy mouth.
2. Reorder the checks (sad before happy) and test "happy but sad" — see what
   changes.
3. Predict `mood_of("I am furious")`. (Answer: `"angry"`.)

### 📸 Show Emrys
Send Emrys your `mood_of` function and your word lists. Tell Emrys which extra
mood you invented.

### Check Your Brain
- What does `mood_of` hand back?
- Why can we use plain `if`s here instead of `elif`?
- Which mood wins if the text has both happy and sad words?
- What draws the angry eyebrows?

### More Examples
A tiny brain with one rule:

```python
def is_greeting(text):
    return "hello" in text or "hi" in text
```

### Common Mistakes
- **Checking the untidied text:** if you forget `.lower()`, "HAPPY" won't match.
  **Fix:** tidy before calling `mood_of`.
- **Missing the final `return`:** without `return "okay"`, unknown moods hand back
  `None` and break the colour lookup. **Fix:** always end with a default.

### Level Up 🚀
Make `mood_of` also tell you WHICH word matched, so the bot can say "I heard
'furious'!"

---

## Lesson 20: Putting It in a Chat Loop (with Kindness)

### Big Idea
Wire it all together: read → tidy → find mood → draw face → reply kindly.

### Kid Meaning
Now the bot really works. Every Send follows the same steps, like a little
assembly line.

### Chatbot Connection
This is the beating heart of the finished chatbot.

### The Code
```python
def reply_for(mood):
    if mood == "happy":
        return f"Yay {name}! I'm so glad you feel happy!"
    elif mood == "sad":
        return f"Oh {name}, I'm here for you. Tomorrow will be brighter."
    elif mood == "angry":
        return f"Take a deep breath, {name}. It's okay to feel angry."
    else:
        return f"Thanks for sharing, {name}. Tell me more!"

def send():
    global name
    text = entry.get().lower().strip()
    entry.delete(0, tk.END)
    if text == "":
        return
    if name == "":
        name = text.title()
        draw_face("happy")
        say(f"Nice to meet you, {name}! How do you feel today?")
        return
    mood = mood_of(text)          # 1. work out the mood
    draw_face(mood)               # 2. show it on the face
    say(reply_for(mood))          # 3. say something kind
```

### What You'll See
Type "I feel great!" → the face turns **yellow and smiles**, and the bubble says
"Yay Ama! I'm so glad you feel happy!" Type "I'm so upset" → **blue and drooping**
with a caring reply.

### Line by Line
- `reply_for(mood)` — returns a kind sentence, using the remembered `name`.
- The `send` assembly line: tidy the text → handle the name → find the mood →
  draw → speak.
- `say(reply_for(mood))` — the answer from one machine goes straight into another.
  You can nest calls like this once you're comfortable.
- The `else` branch is deliberately **kind**, not "I don't understand." A good bot
  never makes you feel silly.

### Do It in VS Code 🛠️
1. Add `reply_for` and replace `send` in `chatbot.py`.
2. Save, run. Try several moods and watch the face AND bubble change together.

### Your Turn
1. Rewrite all four replies in your own caring words.
2. Add a reply for your extra mood from Lesson 19.
3. Predict the face colour for "today was bad". (Blue — "bad" is a sad word.)

### 📸 Show Emrys
Screenshot the happy face AND the sad face with their replies. Tell Emrys your
favourite reply you wrote.

### Check Your Brain
- What are the steps `send` follows, in order?
- Where does `reply_for` get the name from?
- Why is the `else` reply written kindly?

### More Examples
Nesting calls:

```python
say(reply_for(mood_of(text)))   # all three machines in one line!
```

### Common Mistakes
- **Forgetting `return` after the name step:** the bot would treat your NAME as a
  mood too. **Fix:** `return` right after greeting them.
- **Drawing before deciding:** call `mood_of` FIRST, then `draw_face(mood)`.

### Level Up 🚀
Make the speech bubble colour match the mood colour, so the whole window feels
the emotion.

---

## Lesson 21: A Few Smart Answers (Questions)

### Big Idea
The bot can spot simple questions and answer them specially.

### Kid Meaning
If you ask "what is your name?", a mood reply would be silly. We check for a few
questions FIRST and answer those properly.

### Chatbot Connection
This makes the bot feel much more alive — it can talk about itself, not just
about your feelings.

### The Code
```python
def answer_question(text):
    if "your name" in text:
        return "I'm Emoji Mood Bot! Nice to meet you."
    if "how are you" in text:
        return "I'm always cheerful - I'm made of code!"
    if "how old" in text:
        return "I was born the moment you pressed Run!"
    if "what can you do" in text:
        return "Tell me how you feel and I'll show it on my face."
    return ""      # empty means "not a question I know"
```

Wire it into `send`, BEFORE the mood check:

```python
    reply = answer_question(text)
    if reply != "":
        draw_face("happy")
        say(reply)
        return
    mood = mood_of(text)
    draw_face(mood)
    say(reply_for(mood))
```

### What You'll See
Ask "what is your name?" → the bot answers about itself instead of guessing a
mood. Ask about feelings → normal mood behaviour.

### Line by Line
- `answer_question(text)` — returns an answer, or an **empty text** `""` meaning
  "I don't know this question."
- `if reply != "":` — `!=` means "is NOT equal to". So: if we DID find an answer…
- `return` — stops `send` so the mood code never runs for a question.
- Order matters: questions are checked FIRST, moods second.

### Do It in VS Code 🛠️
1. Add `answer_question` and update `send` in `chatbot.py`.
2. Save, run. Ask all four questions, then say a mood.

### Your Turn
1. Add two more questions the bot can answer (e.g. "favourite colour").
2. Change the bot's self-description.
3. Predict what happens for "how are you feeling happy?" (The question wins — it's
   checked first!)

### 📸 Show Emrys
Screenshot the bot answering a question about itself. Tell Emrys which questions
you added.

### Check Your Brain
- What does an empty `""` return mean here?
- What does `!=` mean?
- Why must questions be checked BEFORE moods?

### More Examples
Checking for a question mark:

```python
if text.endswith("?"):
    say("That's a good question!")
```

### Common Mistakes
- **Checking moods first:** questions get mood replies. **Fix:** put
  `answer_question` before `mood_of`.
- **Forgetting `return`:** both a question answer AND a mood reply appear, and the
  second overwrites the first. **Fix:** `return` after answering.

### Level Up 🚀
Make the bot answer "what mood am I?" by remembering the LAST mood in a variable.

---

## Lesson 22: The Full Chatbot — Moods AND Questions

### Big Idea
Combine greeting, questions, moods, and goodbye into one complete conversation.

### Kid Meaning
All the machines now work as a team. Your bot can meet you, chat about itself,
read your feelings, and say goodbye.

### Chatbot Connection
This is the whole conversation flow — everything except the final polish.

### The Code
```python
def send():
    global name
    text = entry.get().lower().strip()
    entry.delete(0, tk.END)
    if text == "":
        return

    if name == "":                       # 1. learn the name
        name = text.title()
        draw_face("happy")
        say(f"Nice to meet you, {name}! How do you feel today?")
        return

    if text == "bye":                    # 2. goodbye
        draw_face("happy")
        say(f"Bye {name}! Come back soon.")
        return

    reply = answer_question(text)        # 3. a known question?
    if reply != "":
        draw_face("happy")
        say(reply)
        return

    mood = mood_of(text)                 # 4. otherwise, read the mood
    draw_face(mood)
    say(reply_for(mood))
```

### What You'll See
A full conversation: it learns your name, answers questions, reacts to moods with
the right face, and waves goodbye when you type "bye".

### Line by Line
- The four numbered steps run **in order**, and each ends with `return` so only
  ONE thing happens per message.
- This shape — check the special cases first, general case last — is how real
  programs are organised.
- Read it top to bottom like a flowchart: "Is it the name? No. Is it bye? No. Is
  it a question? No. Then it's a mood."

### Do It in VS Code 🛠️
1. Replace `send` in `chatbot.py` with this full version.
2. Save, run. Have a whole conversation: name → question → happy → sad → bye.

### Your Turn
1. Add a step that replies specially to "hello".
2. Move the `bye` check to the END and see what breaks (bye becomes a mood!).
   Then put it back.
3. Predict which step handles "I am glad". (Step 4 — the mood.)

### 📸 Show Emrys
Screenshot four moments of one conversation: greeting, a question, a mood, and
goodbye. Tell Emrys the order you tried.

### Check Your Brain
- Why does each step end with `return`?
- What would happen if the name check came LAST?
- Which step handles a message the bot has never seen?

### More Examples
The same "special cases first" idea elsewhere:

```python
age = 10
if age < 0:
    print("That can't be right!")
elif age < 13:
    print("Child")
else:
    print("Teen or older")
```

### Common Mistakes
- **Missing `return`s:** several replies fire and the last one wins, confusingly.
  **Fix:** `return` after every branch.
- **Wrong order:** general checks before special ones swallow the special cases.
  **Fix:** most specific first.

### Level Up 🚀
Add a "help" command that lists everything the bot can do.

---

## Lesson 23: Making It Friendlier — Counting and Caring

### Big Idea
Count the messages, show them on screen, and make the goodbye personal.

### Kid Meaning
Little touches make a bot feel warm: remembering how much you've chatted and
mentioning it when you leave.

### Chatbot Connection
This is the polish that turns a working program into something people enjoy using.

### The Code
Add near the top:

```python
messages = 0

def show_count():
    canvas.delete("count")
    canvas.create_text(WIDTH-20, 20, text=f"messages: {messages}",
                       fill="#8fa0d8", anchor="e", tags="count")
```

Then inside `send`, change the `global` line and add the counting:

```python
    global name, messages
    ...
    if text == "bye":
        draw_face("happy")
        say(f"Bye {name}! You sent {messages} messages. Come back soon!")
        return
    ...
    messages = messages + 1
    mood = mood_of(text)
    draw_face(mood)
    say(reply_for(mood))
    show_count()
```

### What You'll See
A small counter in the **top-right corner** climbing with every message, and a
goodbye that remembers your whole chat: "Bye Ama! You sent 7 messages."

### Line by Line
- `messages = 0` — lives outside the function so it survives between clicks.
- `global name, messages` — now the function may change BOTH outside boxes.
- `anchor="e"` — anchors the text by its **east (right) edge**, so it sits neatly
  against the right side no matter how long the number gets.
- `show_count()` — its own little machine, called at the end of each message.

### Do It in VS Code 🛠️
1. Add `messages = 0`, `show_count`, update `global name, messages`, and add the
   counting lines.
2. Save, run. Send several messages, watch the counter, then type "bye".

### Your Turn
1. Move the counter to the top-LEFT (change the x and use `anchor="w"`).
2. Add a special message when `messages` reaches 10.
3. Predict the goodbye text after 3 messages.

### 📸 Show Emrys
Screenshot the counter after several messages AND your personal goodbye. Tell
Emrys how many messages you sent.

### Check Your Brain
- Where must `messages` be defined so it remembers?
- What does `global name, messages` allow?
- What does `anchor="e"` do?

### More Examples
Celebrating a milestone:

```python
if messages == 10:
    say(f"Wow {name}, ten messages! You're a great chatter.")
```

### Common Mistakes
- **Forgetting to add `messages` to `global`:** `UnboundLocalError`. **Fix:**
  `global name, messages`.
- **Counting the name message:** put `messages = messages + 1` AFTER the name
  step so the name doesn't count as a chat message.

### Level Up 🚀
Make the face **blink**: briefly draw closed eyes, then reopen them using
`root.after(...)`.

---

## Lesson 24: Showcase and Reflection

### Big Idea
Assemble the complete Emoji Mood Chatbot and show it off — you built a real
talking, feeling program!

### Kid Meaning
Every piece you learned — windows, shapes, variables, maths, Entry input, tidying
text, if/elif, booleans, loops, lists, functions, parameters, and return — comes
together into one bot you can chat with and share.

### Chatbot Connection
This is the finished product. Read it, run it, and be proud.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 420, 620
root = tk.Tk()
root.title("Emoji Mood Chatbot")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1230")
canvas.pack()

name = ""
messages = 0
cx, cy, r = WIDTH / 2, 200, 110

happy_words = ["happy", "glad", "great", "good", "yay", "excited", "fun"]
sad_words   = ["sad", "down", "cry", "bad", "unhappy", "lonely", "upset"]
angry_words = ["angry", "mad", "cross", "annoyed", "furious"]

def has_any(text, words):
    for word in words:
        if word in text:
            return True
    return False

def mood_of(text):
    if has_any(text, happy_words):
        return "happy"
    if has_any(text, sad_words):
        return "sad"
    if has_any(text, angry_words):
        return "angry"
    return "okay"

def draw_face(mood):
    canvas.delete("face")
    colors = {"happy": "#ffd54a", "sad": "#7db4ff",
              "angry": "#ff6b6b", "okay": "#c8d0ff"}
    color = colors.get(mood, "#c8d0ff")
    canvas.create_oval(cx - r, cy - r, cx + r, cy + r, fill=color,
                       outline="", tags="face")
    canvas.create_oval(cx - 45, cy - 30, cx - 25, cy - 10, fill="black",
                       tags="face")
    canvas.create_oval(cx + 25, cy - 30, cx + 45, cy - 10, fill="black",
                       tags="face")
    if mood == "happy":
        canvas.create_arc(cx - 50, cy - 10, cx + 50, cy + 70, start=200,
                          extent=140, style="arc", width=6, tags="face")
    elif mood == "sad":
        canvas.create_arc(cx - 50, cy + 30, cx + 50, cy + 100, start=20,
                          extent=140, style="arc", width=6, tags="face")
    elif mood == "angry":
        canvas.create_line(cx - 40, cy + 50, cx + 40, cy + 50, width=6,
                           tags="face")
        canvas.create_line(cx - 50, cy - 40, cx - 20, cy - 30, width=5,
                           tags="face")
        canvas.create_line(cx + 50, cy - 40, cx + 20, cy - 30, width=5,
                           tags="face")
    else:
        canvas.create_line(cx - 35, cy + 45, cx + 35, cy + 45, width=6,
                           tags="face")

def say(text, color="white"):
    canvas.delete("bubble")
    canvas.create_rectangle(30, 360, WIDTH - 30, 450, fill="#1b2350",
                            outline="#3a4a90", width=2, tags="bubble")
    canvas.create_text(WIDTH / 2, 405, text=text, fill=color,
                       width=WIDTH - 70, font=("Arial", 14), tags="bubble")

def reply_for(mood):
    if mood == "happy":
        return f"Yay {name}! I'm so glad you feel happy!"
    elif mood == "sad":
        return f"Oh {name}, I'm here for you. Tomorrow will be brighter."
    elif mood == "angry":
        return f"Take a deep breath, {name}. It's okay to feel angry."
    else:
        return f"Thanks for sharing, {name}. Tell me more!"

def answer_question(text):
    if "your name" in text:
        return "I'm Emoji Mood Bot! Nice to meet you."
    if "how are you" in text:
        return "I'm always cheerful - I'm made of code!"
    if "what can you do" in text:
        return "Tell me how you feel and I'll show it on my face."
    return ""

def show_count():
    canvas.delete("count")
    canvas.create_text(WIDTH - 20, 20, text=f"messages: {messages}",
                       fill="#8fa0d8", anchor="e", tags="count")

def send():
    global name, messages
    text = entry.get().lower().strip()
    entry.delete(0, tk.END)
    if text == "":
        return
    if name == "":
        name = text.title()
        draw_face("happy")
        say(f"Nice to meet you, {name}! How do you feel today?")
        return
    if text == "bye":
        draw_face("happy")
        say(f"Bye {name}! You sent {messages} messages. Come back soon!")
        return
    reply = answer_question(text)
    if reply != "":
        draw_face("happy")
        say(reply)
        return
    messages = messages + 1
    mood = mood_of(text)
    draw_face(mood)
    say(reply_for(mood))
    show_count()

draw_face("okay")
say("Hi! I'm your Emoji Mood Bot. What's your name?")
entry = tk.Entry(root, font=("Arial", 16), justify="center")
entry.pack(pady=8)
entry.bind("<Return>", lambda event: send())
entry.focus()
tk.Button(root, text="Send", font=("Arial", 13), command=send).pack()

root.mainloop()
```

### What You'll See
The full chatbot: a big emoji face that smiles, droops, or scowls with your mood;
a speech bubble with kind replies using your name; a message counter; answers to
questions about itself; and a warm goodbye.

### Line by Line
- Every function is one you built across the course. Read each name — you know
  exactly what it does now.
- The setup at the bottom draws the first face, says hello, wires the Entry (with
  Enter-key support) and the Send button — then `mainloop()` waits for you.
- Notice how `send` reads like a story: name? bye? question? mood.

### Do It in VS Code 🛠️
1. Make sure your `chatbot.py` matches this complete version.
2. Save, run. Have a long conversation. Try every mood word in your lists!
3. Show it to a friend or family member and let them chat with it.

### Your Turn — Reflection
1. Which lesson was the hardest, and what finally made it click?
2. Add ONE personal touch (a new mood, your own colours, a new question).
3. Write two sentences: what are you proudest of building?

### 📸 Show Emrys
Screenshot your finished chatbot mid-conversation AND your goodbye screen. Tell
Emrys: "Course complete!" and share your one personal touch.

### Check Your Brain
- Name three different concepts this chatbot uses (there are many!).
- Which function decides the mood, and which one draws it?
- How would you explain "the bot's brain" to a friend?

### More Examples
Ideas to keep growing your bot:

```python
# Flash the background to match a happy mood
canvas.config(bg="#1a2a1a")
root.after(400, lambda: canvas.config(bg="#0e1230"))
```

### Common Mistakes
- **Copy-paste errors:** if it won't run, read the terminal's red line number and
  check that exact line. **Fix:** compare it character by character.
- **Indentation drift:** mixed spaces break Python. **Fix:** keep 4 spaces per
  level everywhere.

### Level Up 🚀
Give your bot a memory of the whole chat: keep a list of every mood, and at
"bye" tell the user which mood they felt most. You are officially a bot maker! 🤖
