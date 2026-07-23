# Budget Tracker Lessons: JHS 2 Edition (Graphics Version)

Build your very own **Pocket-Money Budget Tracker** — but this time you can SEE
your money! A real dashboard window shows your **balance in big green (or red!)
letters**, a **live bar chart** where each spending category grows its own
coloured bar as you log money, and a **savings goal progress bar** that fills up
as you save. It gives you honest advice about your habits, and **saves your data
to a file** so your records are still there the next time you open it.

This project is for **JHS 2** students. It uses Python with **tkinter**, the
drawing kit that comes free inside Python — nothing to install. You start from
absolutely zero — no experience needed. Every single line of code is explained in
simple words so you truly understand it, not just copy it. By the end you will
have a real money tool you can actually use for your own pocket money.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one core thing this lesson teaches.
- **Kid Meaning** — the same idea explained with a real-life analogy.
- **Tracker Connection** — how this fits our Budget Tracker.
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
(VS Code)** with the Python extension — the same editor professional programmers
use every day. The rhythm for every piece of code is always:

1. Open your project file in VS Code (or **File → New File**, saved as `name.py`).
2. Type the code in the editor.
3. Save: **Ctrl+S** (Windows) or **Cmd+S** (Mac).
4. Run: press the **▶ Run** button at the top-right.
5. A **window pops up** showing your dashboard. Use it! (When you're done, click
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

- **Part 1 — First Pictures (Lessons 1–8):** open a window, draw the dashboard,
  handle money with decimals, and take amounts from the user.
- **Part 2 — Tools and Decisions (Lessons 9–16):** warnings with `if`, bars drawn
  with loops, lists of records, and dictionaries.
- **Part 3 — Building the Tracker (Lessons 17–24):** the transaction list, the
  live bar chart, the savings goal, saving to a file, and advice.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST PICTURES

## Lesson 1: What Is Code? Drawing the Dashboard

### Big Idea
Code is a list of instructions we give the computer, one line at a time — and
those instructions can draw a money dashboard.

### Kid Meaning
A recipe tells a cook what to do step by step. Code tells the computer what to do
step by step. The computer does EXACTLY what you say — nothing more, nothing less.
Today we tell it: "Show me my money."

### Tracker Connection
Our whole tracker is a dashboard window. Before we can track anything, we need
the dashboard.

### The Code
```python
import tkinter as tk

root = tk.Tk()
root.title("My Money Budget Tracker")
canvas = tk.Canvas(root, width=720, height=400, bg="#0e1b2a")
canvas.pack()

canvas.create_text(360, 50, text="MY MONEY BUDGET TRACKER", fill="#ffd54a",
                   font=("Arial", 20, "bold"))
canvas.create_text(360, 130, text="Balance: GHS 0.00", fill="#7CFC00",
                   font=("Arial", 28, "bold"))
canvas.create_text(360, 180, text="Let's start tracking!", fill="#8fa0d8",
                   font=("Arial", 13))

root.mainloop()
```

### What You'll See
A dark blue dashboard window with a gold title, a big **green balance of GHS
0.00**, and a friendly line underneath. Your money app has a face!

### Line by Line
- `import tkinter as tk` — brings in Python's drawing kit and gives it the short
  nickname `tk` so we type less. Think of it as opening your box of crayons.
- `root = tk.Tk()` — makes the window itself. `root` is the name we use to talk
  to that window.
- `root.title(...)` — writes the title in the window's bar.
- `canvas = tk.Canvas(root, width=720, height=400, bg="#0e1b2a")` — puts a dark
  drawing sheet, 720 wide and 400 tall, inside the window. `canvas` is our paper.
- `canvas.pack()` — actually places the canvas into the window (without this, the
  paper stays hidden).
- `create_text(360, 50, ...)` — writes words centred 360 across and 50 down.
- `font=("Arial", 20, "bold")` — the font name, the size, and the style.
- `#0e1b2a` — a colour code. The `#` means "a colour written in computer code."
  You can also write plain names like `"navy"`.
- `root.mainloop()` — the magic word that keeps the window open and waiting.
  Without it, the window would blink and vanish.

### Do It in VS Code 🛠️
1. **File → New File** → name it `dashboard.py` → save it on your Desktop.
2. Type the code above yourself (don't copy-paste — typing teaches your fingers).
3. Save: **Ctrl+S** (make the white "unsaved" dot on the tab disappear).
4. Press the **▶ Run** button. Your dashboard should pop up!
5. Look at it. Then close it by clicking the **X**.

### Your Turn
1. Change the title to your own, like `"AMA'S MONEY APP"`.
2. Change the balance to a different amount and colour.
3. Add a line showing today's date as text.
4. BEFORE you run: predict what will be different. Then run. Were you right?

### 📸 Show Emrys
Take a screenshot of your dashboard with YOUR title and **send it to Emrys**.
Say: "Lesson 1 done!" Emrys will give you your first ✅ of the course.

### Check Your Brain
- What does `import tkinter as tk` bring us?
- Which line makes the window actually appear and stay open?
- What do the two numbers in `create_text(360, 50, ...)` mean?
- What do the three parts of `font=("Arial", 20, "bold")` control?

### More Examples
A simpler money screen:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=400, height=250, bg="black")
canvas.pack()
canvas.create_text(200, 100, text="GHS 50.00", fill="lime",
                   font=("Arial", 36, "bold"))
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
Add a horizontal divider line under the balance using
`canvas.create_line(60, 210, 660, 210, fill="#2a4a6a", width=2)`.

---

## Lesson 2: How to Run Python (and the Screen Map)

### Big Idea
We type code in a file, save it, and then "run" it — and every drawing lands at
a spot described by two numbers.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when the window pops up. And every shape needs an address on the
screen: how far across, and how far down.

### Tracker Connection
Our bar chart has five bars stacked neatly under each other. Getting them evenly
spaced means understanding the screen map.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=600, height=400, bg="white")
canvas.pack()

canvas.create_rectangle(120, 100, 400, 130, fill="#ffd54a")
canvas.create_text(60, 115, text="Food", anchor="e", fill="black")
canvas.create_text(420, 115, text="GHS 40", anchor="w", fill="black")

root.mainloop()
```

### What You'll See
A white window with a **gold bar**, the label "Food" to its left, and "GHS 40" to
its right — your first bar chart row!

### Line by Line
- `create_rectangle(120, 100, 400, 130, ...)` — the first two numbers `(120, 100)`
  are the **top-left corner**, the next two `(400, 130)` are the **bottom-right
  corner**. That makes a bar 280 long and 30 thick.
- `anchor="e"` — anchors the text by its **east (right) edge**, so labels END at
  x=60 and line up neatly.
- `anchor="w"` — anchors by the **west (left) edge**, so amounts START at x=420.

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

Remember this and your bars stack exactly where you expect. Forget it and your
chart grows upside down — that's not a bug, it's just the screen map. (In our
chart each new bar uses a BIGGER y, so it sits LOWER than the one before.)

### Slow Motion 🔬 — writing vs running
There are TWO different moments, and mixing them up confuses every beginner:

- **Writing** = typing the code into the editor. Nothing happens yet.
- **Saving** = Ctrl+S. Your words are safely on the disk. STILL nothing happens.
- **Running** = pressing **▶**. NOW Python reads your file and the window pops up.

The biggest trap: changing the code and running WITHOUT saving — the computer runs
the OLD version and you wonder why nothing changed. Burn this rhythm into your
fingers: **type → Ctrl+S → ▶ → look at the window.** Every time. Forever.

### Do It in VS Code 🛠️
1. **File → New File** → name it `bar_map.py` → save on your Desktop.
2. Type the code above.
3. **Ctrl+S**, then press **▶ Run**.
4. Change the bar's end to `create_rectangle(120, 100, 250, 130, ...)`. Predict
   what happens BEFORE you run. (It gets shorter — less money!)

### Your Turn
1. Draw a SECOND bar below the first (add 45 to both y numbers).
2. Give it a different colour and label.
3. Draw a dot at `(0, 0)` — where does it land? (Try
   `create_oval(0, 0, 20, 20, fill="red")`.)

### 📸 Show Emrys
Screenshot your window with two labelled bars. Tell Emrys which number you changed
to move the second bar down.

### Check Your Brain
- Where is the point `(0, 0)` on the canvas?
- Which direction does **y** get bigger — up or down?
- What do `anchor="e"` and `anchor="w"` do?
- Why must you SAVE before you run?

### More Examples
Three bars of different lengths:

```python
import tkinter as tk
root = tk.Tk()
canvas = tk.Canvas(root, width=500, height=250, bg="white")
canvas.pack()
canvas.create_rectangle(60, 40, 300, 70, fill="#ffd54a")
canvas.create_rectangle(60, 100, 200, 130, fill="#7db4ff")
canvas.create_rectangle(60, 160, 420, 190, fill="#ff8fd8")
root.mainloop()
```

### Common Mistakes
- **Thinking up is bigger:** using a big y to go "up" sends the bar DOWN. **Fix:**
  smaller y = higher.
- **Corners backwards:** if the second corner is smaller than the first, the bar
  can vanish. **Fix:** first pair = top-left, second pair = bottom-right.

### Level Up 🚀
Draw five bars in a loop-free way (just typing them) — then note how repetitive it
is. Lesson 12 will fix that with a loop!

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that remembers a value so we can use it again.

### Kid Meaning
A box with a label. You write `balance = 50` and now the box called `balance`
holds 50. Whenever you say `balance`, the computer looks in the box.

### Tracker Connection
Our tracker must remember income, spending, the balance, and the savings goal.
Variables are how the computer remembers.

### The Code
```python
import tkinter as tk

WIDTH = 720
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=340, bg="#0e1b2a")
canvas.pack()

income = 120.00
spent = 45.50
balance = income - spent
goal = 100.00

canvas.create_text(WIDTH/2, 50, text="MY MONEY", fill="#ffd54a",
                   font=("Arial", 20, "bold"))
canvas.create_text(WIDTH/2, 120, text=balance, fill="#7CFC00",
                   font=("Arial", 30, "bold"))
canvas.create_text(WIDTH/2, 180, text=income, fill="white",
                   font=("Arial", 14))
canvas.create_text(WIDTH/2, 215, text=spent, fill="#ff6b6b",
                   font=("Arial", 14))
canvas.create_text(WIDTH/2, 265, text=goal, fill="#8fa0d8",
                   font=("Arial", 14))

root.mainloop()
```

### What You'll See
The dashboard showing **74.5** as the balance, with income, spending, and the goal
underneath — all worked out from boxes. (We'll make it show "GHS 74.50" properly
in Lesson 7!)

### Line by Line
- `income = 120.00` — a box holding money. The `.00` makes it a **decimal number**
  (Python calls these **floats**), which is what money needs.
- `spent = 45.50` — you can't write half a cedi with a whole number, so floats
  matter here.
- `balance = income - spent` — a box worked out FROM other boxes. Change either
  one and the balance follows automatically.
- `text=balance` — instead of typing a number, we hand `create_text` the box, and
  it shows whatever is inside.
- `goal = 100.00` — how much we're trying to save.

### Do It in VS Code 🛠️
1. New file `money_vars.py`. Type the code.
2. Save and run — see 74.5.
3. Change `spent = 45.50` to `spent = 200.00`. Save, run. The balance went
   NEGATIVE — you overspent!
4. Change `income` and watch the balance recalculate itself.

### Your Turn
1. Add a `saved_last_month = 30.00` box and show it.
2. Set numbers so the balance is exactly 0.
3. Predict the balance when income is 80 and spent is 25.5. (54.5.)

### 📸 Show Emrys
Send a screenshot with YOUR numbers, including one where the balance goes
negative. Tell Emrys which variables you changed.

### Check Your Brain
- What is a variable?
- What is a **float**, and why does money need one?
- Why is `balance` worked out instead of typed?
- What happens to `balance` when you change `spent`?

### More Examples
Floats in the terminal:

```python
income = 120.00
spent = 45.50
print(income - spent)     # 74.5
```

### Common Mistakes
- **Using a box before filling it:** using `balance` before it's worked out →
  `NameError`. **Fix:** create the box first, above where you use it.
- **Whole numbers for money:** `spent = 45` can't hold 45 cedis 50 pesewas. **Fix:**
  use floats like `45.50`.

### Level Up 🚀
Add a `left_to_goal = goal - balance` box and display it, so you can see how much
more you need to save.

---

## Lesson 4: Numbers and Money Maths

### Big Idea
Python does maths, and money maths needs decimals shown to exactly 2 places.

### Kid Meaning
Money is always written with two digits after the dot: GHS 7.50, not GHS 7.5.
Python has a neat way to force that.

### Tracker Connection
Every amount on our dashboard must look like real money, and every bar's length
comes from a division.

### The Code
```python
import tkinter as tk

WIDTH = 720
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=340, bg="#0e1b2a")
canvas.pack()

spent = 45.5
income = 120.0
percent = spent / income * 100

canvas.create_text(WIDTH/2, 60, text=f"Spent: GHS {spent:.2f}", fill="#ff6b6b",
                   font=("Arial", 22, "bold"))
canvas.create_text(WIDTH/2, 105, text=f"That is {percent:.0f}% of your income",
                   fill="white", font=("Arial", 14))

# A bar showing that percentage
canvas.create_rectangle(120, 170, 520, 205, outline="#2a4a6a")
canvas.create_rectangle(120, 170, 120 + 400 * percent / 100, 205,
                        fill="#ff6b6b", outline="")
canvas.create_text(535, 187, text=f"{percent:.0f}%", fill="white", anchor="w",
                   font=("Arial", 12))

root.mainloop()
```

### What You'll See
"Spent: GHS 45.50" (note the **two decimal places**, even though we typed 45.5),
"That is 38% of your income", and a red bar filled 38% of the way.

### Line by Line
- `f"GHS {spent:.2f}"` — the `:.2f` means "show this number with **2** digits after
  the dot." So `45.5` displays as `45.50` — proper money.
- `f"{percent:.0f}%"` — `:.0f` means **0** digits after the dot, so `37.9166` shows
  as a clean `38`.
- `percent = spent / income * 100` — divide, then multiply by 100. Python works
  through `/` and `*` from left to right.
- `120 + 400 * percent / 100` — the bar's right edge. The track is 400 long, so 38%
  of 400 is about 152, and `120 + 152 = 272`.
- Two rectangles: the **outline** is the empty track, the **filled** one is drawn on
  top.

### Do It in VS Code 🛠️
1. New file `money_maths.py`. Type the code.
2. Save, run — see the 38% bar.
3. Change `spent = 120.0` and run. A full bar and 100% — you spent everything!
4. Change `:.2f` to `:.0f` on the money line and see it lose the pesewas.

### Your Turn
1. Add a second bar showing what percent you SAVED (income minus spent).
2. Print `f"{7.5:.2f}"` in the terminal and check it shows `7.50`.
3. Predict what `f"{100/3:.2f}"` shows. (33.33.)

### 📸 Show Emrys
Screenshot your percentage bar at two different spending levels. Tell Emrys what
`:.2f` does.

### Check Your Brain
- What does `:.2f` do to a number?
- What is the difference between `:.2f` and `:.0f`?
- Why must money always show 2 decimal places?
- What sets the bar's length?

### More Examples
Formatting money in the terminal:

```python
print(f"{7.5:.2f}")       # 7.50
print(f"{1234.5:.2f}")    # 1234.50
print(f"{0.999:.2f}")     # 1.00  (it rounds!)
```

### Common Mistakes
- **Dividing by zero:** `spent / 0` → `ZeroDivisionError`. **Fix:** check income
  isn't 0 first (we do this in Lesson 23!).
- **Ugly money:** showing `45.5` instead of `45.50` looks unprofessional. **Fix:**
  always use `:.2f` for money.

### Level Up 🚀
Write a `money(amount)` function that returns `f"GHS {amount:.2f}"` so you never
have to type the format again.

---

## Lesson 5: Counting — Updating the Balance

### Big Idea
Adding to and subtracting from a variable, then redrawing, is how a balance moves.

### Kid Meaning
`balance = balance + 10` means "take what's in the box, add ten, put it back."
Then wipe the old number and draw the new one.

### Tracker Connection
Every income and every expense does exactly this. It's the heartbeat of the app.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=280, bg="#0e1b2a")
canvas.pack()

balance = 0.0

def show():
    canvas.delete("bal")
    color = "#7CFC00" if balance >= 0 else "#ff6b6b"
    canvas.create_text(230, 110, text=f"GHS {balance:.2f}", fill=color,
                       font=("Arial", 32, "bold"), tags="bal")

def earn():
    global balance
    balance = balance + 10
    show()

def spend():
    global balance
    balance = balance - 4.5
    show()

show()
buttons = tk.Frame(root)
buttons.pack(pady=10)
tk.Button(buttons, text="Earn GHS 10", command=earn).pack(side="left", padx=5)
tk.Button(buttons, text="Spend GHS 4.50", command=spend).pack(side="left", padx=5)

root.mainloop()
```

### What You'll See
"GHS 0.00" in green. **Earn** pushes it up by 10; **Spend** pulls it down by 4.50.
Spend enough and it turns **red** — you're in debt!

### Line by Line
- `balance = 0.0` — the box lives OUTSIDE the functions so it survives between
  clicks.
- `global balance` — tells Python "use the OUTSIDE box, don't make a new one
  inside." Without this, nothing would change.
- `balance = balance + 10` — the counting step. Read it right-to-left: work out
  `balance + 10`, then store the answer back.
- `balance = balance - 4.5` — the mirror image for spending.
- `color = "#7CFC00" if balance >= 0 else "#ff6b6b"` — a one-line choice: green
  when you're in the black, red when you're overdrawn.
- `canvas.delete("bal")` — erase only the item tagged `"bal"` before redrawing.

### Do It in VS Code 🛠️
1. New file `balance.py`. Type the code.
2. Save, run. Click Earn twice, then Spend five times — watch it go red.
3. Remove `global balance` from `earn`, run, and click. Nothing changes! Now
   you've SEEN why `global` matters. Put it back.

### Your Turn
1. Change the amounts to your real pocket money.
2. Add a third button that spends GHS 20.
3. Predict the balance after Earn, Earn, Spend. (15.50.)

### 📸 Show Emrys
Screenshot a green balance AND a red one. Tell Emrys what makes the colour change.

### Check Your Brain
- What does `balance = balance + 10` do?
- Why must `balance` live outside the functions?
- What does `global balance` allow?
- What decides the colour?

### More Examples
Counting in the terminal:

```python
balance = 0
balance = balance + 10
balance = balance - 4.5
print(balance)   # 5.5
```

### Common Mistakes
- **Forgetting `global`:** `UnboundLocalError`, or nothing changes. **Fix:** add
  `global` for every outside box you change.
- **Numbers stacking up:** forgetting `canvas.delete("bal")` draws the new number
  on top of the old. **Fix:** delete by tag first.

### Level Up 🚀
Add a small "history" counter showing how many times you've clicked each button.

---

## Lesson 6: Taking an Amount from the User

### Big Idea
An Entry box lets the user type an amount, and a Button sends it to our code.

### Kid Meaning
A real money app doesn't have fixed buttons for every amount — you type what you
spent. The Entry box is where you type it.

### Tracker Connection
This is how every real transaction gets into our tracker.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=460, height=280, bg="#0e1b2a")
canvas.pack()

balance = 0.0

def show():
    canvas.delete("bal")
    color = "#7CFC00" if balance >= 0 else "#ff6b6b"
    canvas.create_text(230, 110, text=f"GHS {balance:.2f}", fill=color,
                       font=("Arial", 30, "bold"), tags="bal")

def add_money():
    global balance
    amount = float(entry.get())
    balance = balance + amount
    entry.delete(0, tk.END)
    show()

show()
entry = tk.Entry(root, font=("Arial", 14), width=10, justify="center")
entry.pack(pady=6)
entry.bind("<Return>", lambda event: add_money())
tk.Button(root, text="Add to balance", command=add_money).pack()

root.mainloop()
```

### What You'll See
Type `25.50`, press **Add to balance** (or **Enter**), and the balance jumps by
exactly that amount. Type another number and it adds again.

### Line by Line
- `amount = float(entry.get())` — `entry.get()` gives the typed WORDS (like
  `"25.50"`). `float(...)` turns those words into a real decimal NUMBER we can do
  maths with. Without `float`, Python would try to glue text together instead of
  adding!
- `float` not `int` — because money has decimals. `int("25.50")` would crash.
- `entry.delete(0, tk.END)` — clears the box from start (0) to end, ready for the
  next amount.
- `entry.bind("<Return>", lambda event: add_money())` — the **Enter** key works
  too, like a real app. (`lambda event:` politely accepts the event tkinter passes
  and ignores it.)

### Do It in VS Code 🛠️
1. New file `amount_entry.py`. Type the code.
2. Save, run. Type `25.50` and press Enter. Then `10` and Enter.
3. Now type `hello` and press Enter. **Crash!** Read the red `ValueError` in the
   terminal — we fix this properly in Lesson 9.

### Your Turn
1. Add a "Subtract" button that takes the amount away instead.
2. Show the last amount entered under the balance.
3. Predict the balance after adding 10, then 5.5. (15.50.)

### 📸 Show Emrys
Screenshot your balance after adding a typed amount. Tell Emrys what number you
typed.

### Check Your Brain
- What does `entry.get()` give you — a number or words?
- What does `float()` do?
- Why `float` instead of `int` for money?
- What happens if the user types letters?

### More Examples
Turning words into numbers:

```python
print(float("25.50") + 10)    # 35.5
print(int("25") + 10)         # 35
# print(int("25.50"))         # crashes! int can't take decimals
```

### Common Mistakes
- **Forgetting `float`:** `balance + entry.get()` → `TypeError`, because you can't
  add words to a number. **Fix:** wrap it in `float()`.
- **Using `int` for money:** `int("4.50")` → `ValueError`. **Fix:** use `float`.

### Level Up 🚀
Add a second Entry for a description ("bought jollof") and show it next to the
amount.

---

## Lesson 7: f-strings — Showing Money Nicely

### Big Idea
An f-string builds a sentence with values dropped inside, formatted properly.

### Kid Meaning
Instead of gluing words and numbers together awkwardly, put an `f` before the
quotes and drop any box inside `{ }`. Add `:.2f` and it looks like real money.

### Tracker Connection
Every label on our dashboard is an f-string with money formatting.

### The Code
```python
import tkinter as tk

WIDTH = 720
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=340, bg="#0e1b2a")
canvas.pack()

name = "Ama"
income = 120.0
spent = 45.5
balance = income - spent
records = 7

canvas.create_text(WIDTH/2, 45, text=f"{name}'s Money", fill="#ffd54a",
                   font=("Arial", 20, "bold"))
canvas.create_text(WIDTH/2, 105, text=f"Balance: GHS {balance:.2f}",
                   fill="#7CFC00", font=("Arial", 26, "bold"))
canvas.create_text(WIDTH/2, 155,
                   text=f"In: GHS {income:.2f}    Out: GHS {spent:.2f}",
                   fill="white", font=("Arial", 14))
canvas.create_text(WIDTH/2, 195, text=f"({records} records)", fill="#8fa0d8",
                   font=("Arial", 12))
canvas.create_text(WIDTH/2, 250,
                   text=f"You kept {balance / income * 100:.0f}% of your money",
                   fill="#ffd54a", font=("Arial", 15))

root.mainloop()
```

### What You'll See
A complete, professional dashboard: "Ama's Money", "Balance: GHS 74.50", the in/out
line, the record count, and "You kept 62% of your money" — that last number
**worked out by maths inside the f-string**.

### Line by Line
- `f"{name}'s Money"` — the `f` turns on the magic. Anything in `{ }` is a box
  name, and Python drops its value in.
- `f"GHS {balance:.2f}"` — the `:.2f` formats it as proper money with 2 decimals.
- `f"{balance / income * 100:.0f}%"` — you can do **maths** inside the braces AND
  format the result. Python works it out, rounds it, then drops it in.
- `f"{name}'s Money"` — note the apostrophe is fine inside double quotes.

### Do It in VS Code 🛠️
1. New file `money_labels.py`. Type the code.
2. Save, run. Read every line.
3. Change `spent = 110.0` and run. The balance drops and the percentage falls too.

### Your Turn
1. Change the name to yours.
2. Add a line showing how much MORE you need to reach a GHS 100 goal.
3. Predict what `f"{50/200*100:.0f}%"` shows. (25%.)

### 📸 Show Emrys
Screenshot your dashboard with your name and numbers. Tell Emrys which line does
maths inside the braces.

### Check Your Brain
- What does the `f` before the quotes do?
- What does `:.2f` add?
- Can you do maths inside `{ }`?
- Why does `:.0f` suit a percentage?

### More Examples
f-strings in the terminal:

```python
price = 12.5
count = 3
print(f"{count} items cost GHS {price * count:.2f}")   # 3 items cost GHS 37.50
```

### Common Mistakes
- **Forgetting the `f`:** `"{balance}"` prints the braces literally. **Fix:** put
  `f` right before the opening quote.
- **Format in the wrong place:** `f"{balance}.2f"` shows the letters. **Fix:** the
  format goes INSIDE the braces after a colon — `{balance:.2f}`.

### Level Up 🚀
Build a one-line "money report" f-string with balance, income, spending, and
percentage all together.

---

## Lesson 8: Mini-Project — Simple Spending Log

### Big Idea
Put together windows, Entry, buttons, variables, and f-strings into one small
finished program.

### Kid Meaning
This is your first real money app: type what you spent, and it keeps a running
total on screen. You already know every piece — now we assemble them.

### Tracker Connection
This is the tracker in miniature, and a rehearsal for the whole thing.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 560, 400
root = tk.Tk()
root.title("Spending Log")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1b2a")
canvas.pack()

total = 0.0
count = 0

def show():
    canvas.delete("all")
    canvas.create_text(WIDTH/2, 50, text="SPENDING LOG", fill="#ffd54a",
                       font=("Arial", 22, "bold"))
    canvas.create_text(WIDTH/2, 130, text=f"Total spent: GHS {total:.2f}",
                       fill="#ff6b6b", font=("Arial", 24, "bold"))
    canvas.create_text(WIDTH/2, 185, text=f"{count} things bought",
                       fill="white", font=("Arial", 14))
    if count > 0:
        canvas.create_text(WIDTH/2, 235,
                           text=f"Average: GHS {total / count:.2f} each",
                           fill="#8fa0d8", font=("Arial", 13))
    canvas.create_text(WIDTH/2, 300, text="Type an amount and press Enter",
                       fill="#8fa0d8", font=("Arial", 11))

def log_spend():
    global total, count
    total = total + float(entry.get())
    count = count + 1
    entry.delete(0, tk.END)
    show()

show()
entry = tk.Entry(root, font=("Arial", 15), width=10, justify="center")
entry.pack(pady=8)
entry.bind("<Return>", lambda event: log_spend())
entry.focus()
tk.Button(root, text="Log spending", font=("Arial", 12),
          command=log_spend).pack()

root.mainloop()
```

### What You'll See
Type amounts one after another and watch the total climb, the count rise, and an
**average per item** appear once you've logged at least one thing.

### Line by Line
- `total` and `count` — two boxes outside the functions, both changed with
  `global total, count` (several names on one `global` line).
- `if count > 0:` — the **divide-by-zero guard**. Before anything is logged,
  `total / count` would crash. Skipping that line avoids it. (Your first `if` —
  full lesson next!)
- `root.resizable(False, False)` — locks the window size so buttons can never be
  pushed off the screen.
- `entry.focus()` — puts the typing cursor in the box automatically.
- `canvas.delete("all")` then redraw — the simple approach here; from Lesson 15 we
  use tags to redraw just the parts that changed.

### Do It in VS Code 🛠️
1. New file `spending_log.py`. Type the whole program.
2. Save, run. Log three amounts and check the average is right.
3. Remove the `if count > 0:` line and run without logging anything — crash! Put
   it back.

### Your Turn
1. Change the colours and the app name.
2. Add a "Reset" button that sets total and count back to 0.
3. Predict the average after logging 10 and 20. (GHS 15.00.)

### 📸 Show Emrys
Screenshot your log after three purchases showing the average. Tell Emrys:
"Part 1 mini-project done!"

### Check Your Brain
- Why do we need the `if count > 0:` guard?
- How do you put two names on one `global` line?
- What does `entry.focus()` do?
- Why lock the window size?

### More Examples
Several globals at once:

```python
def reset():
    global total, count
    total = 0.0
    count = 0
```

### Common Mistakes
- **`ZeroDivisionError`:** working out an average before anything is logged.
  **Fix:** the guard.
- **Only one name in `global`:** `global total` but then changing `count` too →
  `UnboundLocalError`. **Fix:** list both.

### Level Up 🚀
Show the biggest single amount you've logged so far (hint: keep a `biggest` box
and update it with an `if`).

---

# PART 2 — TOOLS AND DECISIONS

## Lesson 9: if — Catching Bad Input

### Big Idea
`if` and `try/except` let the program handle mistakes instead of crashing.

### Kid Meaning
People type "abc" or leave the box empty. A good app says "please type a number"
politely instead of dying with a red error.

### Tracker Connection
Real users make mistakes. Our tracker must survive them.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=520, height=280, bg="#0e1b2a")
canvas.pack()

balance = 0.0

def add_money():
    global balance
    text = entry.get().strip()
    try:
        amount = float(text)
    except ValueError:
        message("Please type a number, like 12.50", "#ff6b6b")
        return
    if amount <= 0:
        message("Amount must be more than zero.", "#ff6b6b")
        return
    balance = balance + amount
    entry.delete(0, tk.END)
    message(f"Balance: GHS {balance:.2f}", "#7CFC00")

def message(text, color):
    canvas.delete("msg")
    canvas.create_text(260, 130, text=text, fill=color, width=460,
                       font=("Arial", 17, "bold"), tags="msg")

message("Balance: GHS 0.00", "#7CFC00")
entry = tk.Entry(root, font=("Arial", 14), width=10, justify="center")
entry.pack(pady=8)
entry.bind("<Return>", lambda event: add_money())
tk.Button(root, text="Add", command=add_money).pack()

root.mainloop()
```

### What You'll See
Type `20` → the balance grows. Type `hello` → a polite **red warning**, no crash.
Type `-5` → another warning. Type nothing → a warning too.

### Line by Line
- `try:` — "attempt this risky line."
- `amount = float(text)` — the risky bit: it breaks if `text` isn't a number.
- `except ValueError:` — "if that broke, do this instead" — show a kind message.
  `ValueError` is the exact error `float()` raises on bad text.
- `return` — leave the function early so a bad amount never reaches the balance.
- `if amount <= 0:` — a SECOND check. `float("-5")` works fine, so `try/except`
  won't catch it — we need our own rule. `<=` means "less than or equal to".
- Two guards in a row is a common pattern: first check the TYPE, then the VALUE.

### Do It in VS Code 🛠️
1. New file `safe_input.py`. Type the code.
2. Save, run. Try `20`, `hello`, `-5`, and an empty box.
3. Remove the `try/except` and type letters — meet the raw crash. Put it back.

### Your Turn
1. Change both warning messages to your own wording.
2. Add a third rule rejecting amounts over 10000.
3. Predict what happens with `0`. (Rejected — it's not more than zero.)

### 📸 Show Emrys
Screenshot both warnings (bad text and negative). Tell Emrys which guard catches
which mistake.

### Check Your Brain
- What does `try/except` protect against?
- What does `return` do here?
- Why doesn't `try/except` catch a negative number?
- What does `<=` mean?

### More Examples
Catching a different error:

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Can't divide by zero!")
```

### Common Mistakes
- **No `return` after the warning:** the bad value carries on and corrupts the
  balance. **Fix:** `return` right after showing the error.
- **Bare `except:`** hides real bugs. **Fix:** be specific — `except ValueError`.

### Level Up 🚀
Make the Entry box flash red for a moment on a bad entry using
`entry.config(bg="#ffcccc")` and `root.after` to change it back.

---

## Lesson 10: if / elif / else — Budget Categories

### Big Idea
`if / elif / else` sorts a value into one of several buckets.

### Kid Meaning
"IF you spent a lot, warn me. ELSE IF a medium amount, note it. ELSE, it's fine."
Python checks top to bottom and does the FIRST true one.

### Tracker Connection
Our tracker gives different advice depending on how much of your money is left.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=560, height=300, bg="#0e1b2a")
canvas.pack()

def rate(kept_percent):
    canvas.delete("all")
    if kept_percent >= 50:
        verdict = "Excellent saver!"
        color = "#7CFC00"
    elif kept_percent >= 20:
        verdict = "Good going - aim for 50%!"
        color = "#ffd54a"
    elif kept_percent >= 0:
        verdict = "Watch your spending."
        color = "#ff9966"
    else:
        verdict = "You overspent! Time to slow down."
        color = "#ff6b6b"
    canvas.create_text(280, 100, text=f"You kept {kept_percent:.0f}%",
                       fill="white", font=("Arial", 20))
    canvas.create_text(280, 170, text=verdict, fill=color, width=500,
                       font=("Arial", 20, "bold"))

rate(35)

root.mainloop()
```

### What You'll See
"You kept 35%" and the gold verdict **"Good going - aim for 50%!"**. Change the
number in `rate(35)` and you get a different verdict and colour.

### Line by Line
- `if kept_percent >= 50:` — first check. `>=` means "greater than or equal to".
  If true, do this and SKIP the rest.
- `elif kept_percent >= 20:` — "else if" — only checked if the first was false.
- `else:` — the leftover case: a negative percentage means you overspent.
- **Order matters!** We check the BIGGEST first. If `>= 20` came first, someone who
  kept 80% would stop there and wrongly get the middle message.
- We store `verdict` and `color` in boxes, then draw ONCE at the bottom — tidier
  than repeating the drawing code in all four branches.

### Do It in VS Code 🛠️
1. New file `verdicts.py`. Type the code.
2. Save, run — the gold verdict.
3. Try `rate(80)`, `rate(10)`, `rate(-15)` — all four branches.
4. Flip the order (put `>= 20` first) and try 80 again. See the bug! Put it back.

### Your Turn
1. Write your own four verdict messages.
2. Add a fifth band for keeping over 75%.
3. Predict the verdict for 20 exactly. (Good going — `>=` includes 20.)

### 📸 Show Emrys
Screenshot two different verdicts. Tell Emrys the percentages that trigger them.

### Check Your Brain
- What is the difference between `if` and `elif`?
- When does `else` run?
- Why must the biggest number be checked FIRST?
- Does `>= 20` include exactly 20?

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
- **Wrong order:** small checks first swallow the big cases. **Fix:** biggest first.
- **Many `if`s instead of `elif`:** several branches run and the last wins. **Fix:**
  use `elif`/`else`.

### Level Up 🚀
Give each verdict its own emoji and draw a matching coloured bar underneath.

---

## Lesson 11: True and False — Booleans

### Big Idea
Every check is either True or False — those two values are called Booleans.

### Kid Meaning
A light switch is on or off. A check is True or False. `balance >= 0` is a
question Python answers with True or False.

### Tracker Connection
"Am I in debt?" and "Have I reached my goal?" are True/False facts that drive the
colours on our dashboard.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=560, height=320, bg="#0e1b2a")
canvas.pack()

def check(balance, goal):
    canvas.delete("all")
    in_credit = (balance >= 0)
    reached_goal = (balance >= goal)
    canvas.create_text(280, 60, text=f"Balance: GHS {balance:.2f}",
                       fill="white", font=("Arial", 18))
    canvas.create_text(280, 110, text=f"in_credit = {in_credit}",
                       fill="#7CFC00", font=("Arial", 15))
    canvas.create_text(280, 145, text=f"reached_goal = {reached_goal}",
                       fill="#ffd54a", font=("Arial", 15))
    if reached_goal:
        canvas.create_text(280, 220, text="GOAL REACHED!", fill="#7CFC00",
                           font=("Arial", 24, "bold"))
    elif in_credit:
        canvas.create_text(280, 220, text="Still saving...", fill="#ffd54a",
                           font=("Arial", 20))
    else:
        canvas.create_text(280, 220, text="You are in debt!", fill="#ff6b6b",
                           font=("Arial", 20, "bold"))

check(120.0, 100.0)

root.mainloop()
```

### What You'll See
"Balance: GHS 120.00", then literally `in_credit = True` and `reached_goal = True`
on screen, plus a green **"GOAL REACHED!"**.

### Line by Line
- `in_credit = (balance >= 0)` — Python answers the question and stores True or
  False in the box.
- `if reached_goal:` — since it's ALREADY True or False, we use it directly. No
  need for `if reached_goal == True`.
- The f-strings print the Boolean values so you can watch them flip.
- **Order matters again:** reaching the goal is the strongest news, so it's checked
  first.

### Do It in VS Code 🛠️
1. New file `flags.py`. Type the code.
2. Save, run — both True.
3. Try `check(50.0, 100.0)` (in credit, no goal) and `check(-20.0, 100.0)` (debt).
4. Add `print(in_credit)` and watch the terminal too.

### Your Turn
1. Add `halfway = (balance >= goal / 2)` and show it.
2. Add a message for being halfway but not there yet.
3. Predict both values for balance 0 and goal 100. (True, False.)

### 📸 Show Emrys
Screenshot all three outcomes (goal reached, saving, debt). Tell Emrys the numbers
you used.

### Check Your Brain
- What two values can a Boolean be?
- What does `in_credit = (balance >= 0)` store?
- Why can we write `if reached_goal:` without `== True`?
- Why check the goal before checking credit?

### More Examples
Booleans in the terminal:

```python
print(120 >= 100)    # True
print(-20 >= 0)      # False
print(not True)      # False
```

### Common Mistakes
- **Quoting True:** `in_credit = "True"` is a WORD, and any non-empty word counts
  as True — so the check always passes! **Fix:** no quotes.
- **One equals sign:** `if in_credit = True` → error. **Fix:** `if in_credit:`.

### Level Up 🚀
Combine two checks with `and`: warn when you're in credit **but** less than 20%
of the way to your goal.

---

## Lesson 12: for Loops — Drawing the Bar Chart

### Big Idea
A `for` loop repeats an action many times — perfect for drawing all the category
bars.

### Kid Meaning
Instead of writing five almost-identical blocks, a loop says "do this 5 times,
counting as you go." The counter changes each time so each bar lands lower down.

### Tracker Connection
This is our live bar chart — the centrepiece of the whole dashboard.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=700, height=340, bg="#0e1b2a")
canvas.pack()

CATEGORIES = ["Food", "Transport", "Fun", "School", "Other"]
COLORS = ["#ffd54a", "#7db4ff", "#ff8fd8", "#7CFC00", "#c8a0ff"]
amounts = [40.0, 15.0, 25.0, 10.0, 5.0]

biggest = 40.0

for i in range(5):
    y = 60 + i * 50
    bar_len = 400 * amounts[i] / biggest
    canvas.create_text(110, y, text=CATEGORIES[i], fill="white", anchor="e",
                       font=("Arial", 12))
    canvas.create_rectangle(120, y - 16, 520, y + 16, outline="#2a4a6a")
    canvas.create_rectangle(120, y - 16, 120 + bar_len, y + 16,
                            fill=COLORS[i], outline="")
    canvas.create_text(535, y, text=f"GHS {amounts[i]:.2f}", fill="white",
                       anchor="w", font=("Arial", 11))

root.mainloop()
```

### What You'll See
A **proper bar chart**: five labelled rows, each with a coloured bar whose length
matches its amount, and the exact figure beside it. Food is longest; Other is
shortest.

### Line by Line
- `CATEGORIES`, `COLORS`, `amounts` — three **lists** that line up: position 0 of
  each belongs together (Food, gold, 40.00). This is a very common coder pattern.
- `for i in range(5):` — count `i` from 0 up to (not including) 5 → 0, 1, 2, 3, 4.
- `y = 60 + i * 50` — each bar sits 50 pixels below the one before. The counter
  turns into a position.
- `bar_len = 400 * amounts[i] / biggest` — **scaling**. The longest bar fills the
  whole 400-pixel track; everything else is drawn in proportion. Without scaling,
  a GHS 5 bar and a GHS 5000 bar would look the same.
- `CATEGORIES[i]`, `COLORS[i]`, `amounts[i]` — reading all three lists at the same
  position. **Lists start at 0.**
- `anchor="e"` for labels (they end together) and `anchor="w"` for amounts (they
  start together) — that's what makes a chart look tidy.

### Do It in VS Code 🛠️
1. New file `bar_chart.py`. Type the code.
2. Save, run — a real bar chart!
3. Change `amounts` to your own spending and update `biggest` to your largest
   number.
4. Set every amount to the same value — all bars become full length. That's
   scaling at work.

### Your Turn
1. Add a sixth category (remember: add to ALL THREE lists and change `range(5)`).
2. Make the bars thicker.
3. Predict the bar length for an amount that is exactly half of `biggest`. (200.)

### 📸 Show Emrys
Screenshot your bar chart with your own spending. Tell Emrys what `biggest` does.

### Check Your Brain
- What does a `for` loop do?
- How do the three lists line up with each other?
- What does scaling by `biggest` achieve?
- Why use `anchor="e"` for labels and `anchor="w"` for amounts?

### More Examples
Parallel lists in the terminal:

```python
names = ["Food", "Fun"]
costs = [40.0, 25.0]
for i in range(2):
    print(names[i], costs[i])
```

### Common Mistakes
- **Lists out of step:** adding a category but not a colour → `IndexError`. **Fix:**
  keep all three lists the same length.
- **Forgetting to scale:** using the raw amount as the bar length makes big numbers
  shoot off the screen. **Fix:** divide by `biggest` and multiply by the track.

### Level Up 🚀
Work out `biggest` automatically with a loop instead of typing it (that's exactly
what Lesson 18 does!).

---

## Lesson 13: Lists — Storing Many Transactions

### Big Idea
A list holds many items in order, and `.append()` adds a new one to the end.

### Kid Meaning
A list is like a receipt roll. Every time you spend, you add a line. The roll
grows as long as you need.

### Tracker Connection
Every income and expense becomes an item in one big list.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=520, height=380, bg="#0e1b2a")
canvas.pack()

amounts = []

def add():
    amounts.append(float(entry.get()))
    entry.delete(0, tk.END)
    show()

def show():
    canvas.delete("all")
    canvas.create_text(260, 35, text=f"{len(amounts)} amounts logged",
                       fill="#ffd54a", font=("Arial", 16, "bold"))
    for i in range(len(amounts)):
        canvas.create_text(260, 80 + i * 26,
                           text=f"{i}:  GHS {amounts[i]:.2f}",
                           fill="white", font=("Arial", 13))

show()
entry = tk.Entry(root, font=("Arial", 14), width=10, justify="center")
entry.pack(pady=6)
entry.bind("<Return>", lambda event: add())
tk.Button(root, text="Add amount", command=add).pack()

root.mainloop()
```

### What You'll See
Type amounts and press Enter — each one appears in a growing numbered list, with a
running count at the top.

### Line by Line
- `amounts = []` — an **empty list**, ready to be filled.
- `amounts.append(...)` — adds one item to the END of the list. The list grows by
  itself; you never say how big it should be.
- `len(amounts)` — how many items are in the list right now.
- `for i in range(len(amounts)):` — loop over every position, however many there
  are. Using `len(...)` means it works for 1 item or 100.
- `80 + i * 26` — each line sits 26 pixels below the last.
- `amounts[i]` — the item at position `i`. **Lists start at 0**, which is why the
  first line shows `0:`.

### Do It in VS Code 🛠️
1. New file `transaction_list.py`. Type the code.
2. Save, run. Add five amounts and watch the list build.
3. Add `print(amounts)` inside `add` and watch the real list in the terminal.

### Your Turn
1. Show the numbers starting at 1 instead of 0 (hint: `i + 1`).
2. Add a "Remove last" button using `amounts.pop()`.
3. Predict `len(amounts)` after adding three amounts. (3.)

### 📸 Show Emrys
Screenshot your list with several amounts. Tell Emrys what `.append()` does.

### Check Your Brain
- What does `[]` create?
- What does `.append()` do?
- What does `len()` tell you?
- Why does the first item show as position 0?

### More Examples
Lists in the terminal:

```python
prices = []
prices.append(10.0)
prices.append(4.5)
print(prices)        # [10.0, 4.5]
print(len(prices))   # 2
print(prices[0])     # 10.0
```

### Common Mistakes
- **Index out of range:** asking for `amounts[3]` in a 3-item list. **Fix:** the
  last valid position is `len(amounts) - 1`.
- **Forgetting the brackets:** `amounts.append` without `()` does nothing. **Fix:**
  `amounts.append(value)`.

### Level Up 🚀
Show the list in reverse (newest first) using `range(len(amounts) - 1, -1, -1)`.

---

## Lesson 14: for Loops — Summing Everything Up

### Big Idea
A loop can add up every item in a list to make a total.

### Kid Meaning
Walk down the receipt roll, adding each line to a running total. At the end, you
know what you spent.

### Tracker Connection
Our income total, spending total, and each category total are all built this way.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=520, height=320, bg="#0e1b2a")
canvas.pack()

amounts = [12.5, 30.0, 4.75, 18.0]

def total_of(numbers):
    total = 0.0
    for n in numbers:
        total = total + n
    return total

def biggest_of(numbers):
    biggest = 0.0
    for n in numbers:
        if n > biggest:
            biggest = n
    return biggest

canvas.create_text(260, 60, text=f"Items: {len(amounts)}", fill="white",
                   font=("Arial", 16))
canvas.create_text(260, 110, text=f"Total: GHS {total_of(amounts):.2f}",
                   fill="#ffd54a", font=("Arial", 22, "bold"))
canvas.create_text(260, 165, text=f"Biggest: GHS {biggest_of(amounts):.2f}",
                   fill="#ff6b6b", font=("Arial", 16))
canvas.create_text(260, 215,
                   text=f"Average: GHS {total_of(amounts)/len(amounts):.2f}",
                   fill="#8fa0d8", font=("Arial", 14))

root.mainloop()
```

### What You'll See
"Items: 4", "Total: GHS 65.25", "Biggest: GHS 30.00", "Average: GHS 16.31" — all
worked out by walking the list.

### Line by Line
- `def total_of(numbers):` — a machine that takes a list and ANSWERS with its
  total.
- `total = 0.0` — start the running total at zero BEFORE the loop. This is the key
  step beginners forget.
- `for n in numbers:` — loop straight over the items themselves (no counter
  needed). `n` is each amount in turn.
- `total = total + n` — add this item to the running total.
- `return total` — hand the answer back AFTER the loop finishes. Note it lines up
  with the `for`, not inside it — otherwise it would quit after one item!
- `biggest_of` uses the same walk but keeps the LARGEST seen so far with an `if`.
  This is exactly how our chart works out its scale.

### Do It in VS Code 🛠️
1. New file `totals.py`. Type the code.
2. Save, run — check the maths by hand.
3. Add another amount to the list and confirm every figure updates.
4. Move `return total` INSIDE the loop (indent it) and run — it returns after one
   item. Now you've seen why placement matters. Put it back.

### Your Turn
1. Write `smallest_of(numbers)` (hint: start it at the first item, not 0).
2. Count how many amounts are over GHS 20 using a loop and an `if`.
3. Predict `total_of([1.5, 2.5])`. (4.0.)

### 📸 Show Emrys
Screenshot your totals panel. Tell Emrys where `total = 0.0` must go and why.

### Check Your Brain
- Why must `total` start at 0 before the loop?
- What is the difference between `for n in numbers:` and `for i in range(...)`?
- Why does `return` go after the loop?
- How does `biggest_of` find the largest?

### More Examples
Summing in the terminal:

```python
prices = [10.0, 4.5, 2.0]
total = 0.0
for p in prices:
    total = total + p
print(total)     # 16.5
```

### Common Mistakes
- **Resetting inside the loop:** `total = 0.0` inside the `for` wipes it every
  time. **Fix:** put it above the loop.
- **`return` inside the loop:** quits after one item. **Fix:** line it up with the
  `for`.

### Level Up 🚀
Python has a built-in shortcut: `sum(amounts)` and `max(amounts)`. Try them, but
make sure you understand the loop version first!

---

## Lesson 15: Functions — Reusable Tracker Tools

### Big Idea
A function is a named machine: define it once, then run it whenever you like.

### Kid Meaning
A blender is a machine — you don't rebuild it each time, you press its button. A
function is code you name once and reuse by calling it.

### Tracker Connection
We'll build tools like `draw_header()`, `draw_chart()`, and `refresh()` and call
them after every transaction.

### The Code
```python
import tkinter as tk

WIDTH = 720
root = tk.Tk()
canvas = tk.Canvas(root, width=WIDTH, height=340, bg="#0e1b2a")
canvas.pack()

balance = 74.5
income = 120.0
spent = 45.5

def draw_header():
    canvas.delete("header")
    canvas.create_text(WIDTH/2, 40, text="MY MONEY BUDGET TRACKER",
                       fill="#ffd54a", font=("Arial", 20, "bold"),
                       tags="header")
    color = "#7CFC00" if balance >= 0 else "#ff6b6b"
    canvas.create_text(WIDTH/2, 95, text=f"Balance: GHS {balance:.2f}",
                       fill=color, font=("Arial", 26, "bold"), tags="header")
    canvas.create_text(WIDTH/2, 135,
                       text=f"In: GHS {income:.2f}    Out: GHS {spent:.2f}",
                       fill="#8fa0d8", font=("Arial", 12), tags="header")

def message(text, color):
    canvas.delete("msg")
    canvas.create_text(WIDTH/2, 200, text=text, fill=color, width=WIDTH - 80,
                       font=("Arial", 14), tags="msg")

draw_header()
message("Welcome back! Add a transaction to begin.", "#ffd54a")

root.mainloop()
```

### What You'll See
A clean dashboard header — title, colour-coded balance, and the in/out line — plus
a separate message underneath, each drawn by its own machine.

### Line by Line
- `def draw_header():` — defines the machine. Nothing happens yet — we're just
  building it.
- `tags="header"` / `tags="msg"` — **labels** so each machine erases only ITS OWN
  drawing. Much better than `delete("all")`, which would wipe the chart too.
- `canvas.delete("header")` at the START — clear the old header before drawing the
  new one.
- `color = "#7CFC00" if balance >= 0 else "#ff6b6b"` — a one-line choice, so the
  balance goes red the moment you overspend.
- `width=WIDTH - 80` inside `create_text` — makes long messages **wrap** onto
  several lines instead of running off the edge.

### Do It in VS Code 🛠️
1. New file `tracker_tools.py`. Type the code.
2. Save, run — see both pieces.
3. Change `balance = -20.0` and run. The balance turns red, everything else stays.
4. Call `message("New message!", "#7db4ff")` again at the bottom — only the message
   changes.

### Your Turn
1. Add a `draw_footer()` machine showing today's date.
2. Call `message` twice — which one wins? (The last.)
3. Predict what `canvas.delete("header")` erases — the message too?

### 📸 Show Emrys
Screenshot your dashboard with a green balance AND a red one. Tell Emrys the names
of your functions.

### Check Your Brain
- What does `def` do?
- What is the difference between DEFINING and CALLING a function?
- Why are `tags` better than `delete("all")` here?
- What does `width=` do inside `create_text`?

### More Examples
A tiny function you call by name:

```python
def hello():
    print("Hi!")

hello()
hello()
```

### Common Mistakes
- **Defining but never calling:** the machine exists but nothing runs it. **Fix:**
  call it — `draw_header()`.
- **Wiping everything:** `delete("all")` erases the chart too. **Fix:** delete by
  tag.

### Level Up 🚀
Write one `refresh()` machine that calls `draw_header()` and `message()` together,
so one call updates the whole screen.

---

## Lesson 16: Dictionaries — One Transaction Record

### Big Idea
A dictionary stores related facts together under names — perfect for one
transaction.

### Kid Meaning
A real dictionary: look up a word, get its meaning. Here we look up `"amount"` and
get how much, `"category"` and get what it was for.

### Tracker Connection
Every transaction in our tracker is a dictionary with three facts: kind, category,
and amount.

### The Code
```python
import tkinter as tk

root = tk.Tk()
canvas = tk.Canvas(root, width=560, height=320, bg="#0e1b2a")
canvas.pack()

record = {"kind": "expense", "category": "Food", "amount": 12.50}

canvas.create_text(280, 50, text="ONE TRANSACTION", fill="#ffd54a",
                   font=("Arial", 17, "bold"))
canvas.create_text(280, 110, text=f"Kind: {record['kind']}", fill="white",
                   font=("Arial", 15))
canvas.create_text(280, 150, text=f"Category: {record['category']}",
                   fill="white", font=("Arial", 15))
canvas.create_text(280, 190, text=f"Amount: GHS {record['amount']:.2f}",
                   fill="#ff6b6b", font=("Arial", 18, "bold"))

sign = "-" if record["kind"] == "expense" else "+"
canvas.create_text(280, 250, text=f"{sign} GHS {record['amount']:.2f}",
                   fill="#ff6b6b" if sign == "-" else "#7CFC00",
                   font=("Arial", 22, "bold"))

root.mainloop()
```

### What You'll See
One transaction laid out clearly — its kind, category, and amount — plus a big
red **"- GHS 12.50"** showing it takes money away.

### Line by Line
- `record = { ... }` — curly braces `{ }` make a **dictionary**. Inside are
  `"key": value` pairs.
- `"kind"`, `"category"`, `"amount"` — the **keys** (the labels).
- `record["kind"]` — look up the key and get its value.
- `record['kind']` inside the f-string uses **single** quotes, because the f-string
  itself uses double quotes. You can't reuse the same quote type inside.
- `record['amount']:.2f` — you can format a dictionary value just like any number.
- `sign = "-" if record["kind"] == "expense" else "+"` — a one-line choice picking
  the sign, which then drives the colour too.

### Do It in VS Code 🛠️
1. New file `one_record.py`. Type the code.
2. Save, run — a red expense.
3. Change `"kind"` to `"income"` and run. Green, with a `+`!
4. Change the category and amount.

### Your Turn
1. Add a `"note"` key (like `"bought jollof"`) and display it.
2. Make a second record for income and show them side by side.
3. Predict the sign for `"kind": "income"`. (A `+`.)

### 📸 Show Emrys
Screenshot an expense record AND an income record. Tell Emrys the three keys you
used.

### Check Your Brain
- What makes a dictionary different from a list?
- What is a "key"?
- Why single quotes inside the f-string?
- What decides the sign and the colour?

### More Examples
Dictionaries in the terminal:

```python
t = {"kind": "expense", "amount": 12.5}
print(t["amount"])       # 12.5
t["note"] = "jollof"     # add a new key
print(t)
```

### Common Mistakes
- **Wrong key:** `record["Amount"]` (capital A) → `KeyError`. **Fix:** keys are
  case-sensitive.
- **Same quote type inside the f-string:** `f"{record["kind"]}"` → `SyntaxError`.
  **Fix:** single quotes inside.

### Level Up 🚀
Write a `describe(record)` function that returns a full sentence like
"Expense of GHS 12.50 on Food".

---

# PART 3 — BUILDING THE TRACKER

## Lesson 17: The Transaction List

### Big Idea
A **list of dictionaries** holds every transaction — the tracker's memory.

### Kid Meaning
One receipt roll (the list) holding many labelled receipts (the dictionaries).

### Tracker Connection
This is the single source of truth. Every total, bar, and piece of advice is
worked out from this one list.

### The Code
```python
import tkinter as tk

WIDTH, HEIGHT = 720, 480
CATEGORIES = ["Food", "Transport", "Fun", "School", "Other"]

root = tk.Tk()
root.title("My Money Budget Tracker")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1b2a")
canvas.pack()

transactions = []

def total_income():
    total = 0.0
    for t in transactions:
        if t["kind"] == "income":
            total = total + t["amount"]
    return total

def total_spent():
    total = 0.0
    for t in transactions:
        if t["kind"] == "expense":
            total = total + t["amount"]
    return total

def balance():
    return total_income() - total_spent()

# A quick test
transactions.append({"kind": "income", "category": "Other", "amount": 120.0})
transactions.append({"kind": "expense", "category": "Food", "amount": 45.5})

canvas.create_text(WIDTH/2, 60, text=f"In: GHS {total_income():.2f}",
                   fill="#7CFC00", font=("Arial", 18))
canvas.create_text(WIDTH/2, 110, text=f"Out: GHS {total_spent():.2f}",
                   fill="#ff6b6b", font=("Arial", 18))
canvas.create_text(WIDTH/2, 180, text=f"Balance: GHS {balance():.2f}",
                   fill="#ffd54a", font=("Arial", 26, "bold"))

root.mainloop()
```

### What You'll See
"In: GHS 120.00", "Out: GHS 45.50", "Balance: GHS 74.50" — every figure counted
from the same list of records.

### Line by Line
- `transactions = []` — the empty receipt roll.
- `transactions.append({...})` — add one dictionary to the list. This is the list
  and dictionary ideas working TOGETHER.
- `for t in transactions:` — walk the list; `t` is one record dictionary each time.
- `if t["kind"] == "income":` — only count the ones we want. This **filter inside
  a loop** is the key pattern of the whole course.
- `total = total + t["amount"]` — add just that record's amount.
- `def balance(): return total_income() - total_spent()` — a machine built from two
  other machines. Small parts, combined.
- Notice `balance()` needs **brackets** to call it — `balance` alone is the machine
  itself, not its answer.

### Do It in VS Code 🛠️
1. Create your real project file `budget_tracker.py`. Type the code.
2. Save, run — check the three figures.
3. Append two more transactions and confirm the totals update.

### Your Turn
1. Add a `count_of(kind)` machine returning how many records of that kind exist.
2. Append an expense big enough to make the balance negative.
3. Predict `total_spent()` after adding an expense of 10. (55.50.)

### 📸 Show Emrys
Screenshot your three figures. Tell Emrys how the `if` inside the loop filters
records.

### Check Your Brain
- What is a list of dictionaries?
- What does `t` hold on each pass of the loop?
- Why does `total_income` need the `if` inside the loop?
- Why does `balance()` need brackets?

### More Examples
Filtering in a loop:

```python
numbers = [1, 5, 12, 3]
big = 0
for n in numbers:
    if n > 4:
        big = big + 1
print(big)     # 2
```

### Common Mistakes
- **Forgetting the brackets:** `balance` instead of `balance()` shows something
  like `<function balance>`. **Fix:** add `()`.
- **Counting everything:** leaving out the `if` mixes income into the spending
  total. **Fix:** filter by `kind`.

### Level Up 🚀
Write `spent_in(category)` that totals only expenses in one category — you'll need
it next lesson for the chart!

---

## Lesson 18: Adding Income and Expenses

### Big Idea
Buttons plus an Entry plus a category picker record a real transaction.

### Kid Meaning
This is the "log it" moment: type the amount, choose what it was for, press the
button.

### Tracker Connection
Every record in the list gets there through this one function.

### The Code
```python
def spent_in(category):
    total = 0.0
    for t in transactions:
        if t["kind"] == "expense" and t["category"] == category:
            total = total + t["amount"]
    return total

def add(kind):
    text = amount_entry.get().strip()
    try:
        amount = float(text)
    except ValueError:
        show_error("Please type a number, like 12.50")
        return
    if amount <= 0:
        show_error("Amount must be more than zero.")
        return
    transactions.append({"kind": kind,
                         "category": category_var.get(),
                         "amount": amount})
    amount_entry.delete(0, tk.END)
    canvas.delete("error")
    refresh()

controls = tk.Frame(root)
controls.pack(pady=6)
tk.Label(controls, text="Amount:").pack(side="left", padx=3)
amount_entry = tk.Entry(controls, font=("Arial", 13), width=9, justify="center")
amount_entry.pack(side="left", padx=3)
category_var = tk.StringVar(root)
category_var.set(CATEGORIES[0])
tk.OptionMenu(controls, category_var, *CATEGORIES).pack(side="left", padx=3)
tk.Button(controls, text="Add Expense",
          command=lambda: add("expense")).pack(side="left", padx=3)
tk.Button(controls, text="Add Income",
          command=lambda: add("income")).pack(side="left", padx=3)
```

### What You'll See
A control bar under the dashboard: an amount box, a **drop-down menu** of
categories, and two buttons. Type, choose, click — and the record is logged.

### Line by Line
- `t["kind"] == "expense" and t["category"] == category` — `and` means **both**
  must be true. We want expenses AND in this category.
- `add(kind)` — ONE machine handles both buttons; the `kind` parameter says which.
- `command=lambda: add("expense")` — buttons call a function with no information,
  so `lambda:` wraps it to pass the word `"expense"`.
- `category_var = tk.StringVar(root)` — a special tkinter box that widgets can
  watch. The drop-down writes the chosen category into it.
- `category_var.get()` — read whichever category is currently selected.
- `tk.OptionMenu(controls, category_var, *CATEGORIES)` — the drop-down. The `*`
  **unpacks** the list, handing each category to the menu as its own option — the
  same as typing `"Food", "Transport", "Fun", ...` by hand.
- `tk.Label(...)` — plain text sitting beside a widget (not drawn on the canvas).
- The two guards from Lesson 9 protect us before anything reaches the list.

### Do It in VS Code 🛠️
1. Add `spent_in`, `add`, and the control bar to `budget_tracker.py`. Add a
   temporary `refresh()` and `show_error()` that just print for now.
2. Save, run. Log a few expenses in different categories.
3. Add `print(transactions)` inside `add` and watch the list grow in the terminal.

### Your Turn
1. Add a "Savings" category (remember to add it to `CATEGORIES`).
2. Try logging letters and a negative — check both guards fire.
3. Predict what `category_var.get()` returns before you touch the menu. (`"Food"` —
   the one we `.set()`.)

### 📸 Show Emrys
Screenshot your control bar with the drop-down open. Tell Emrys what `*CATEGORIES`
does.

### Check Your Brain
- What does `and` mean in `spent_in`?
- Why does one `add` function serve two buttons?
- What is a `StringVar` for?
- What does the `*` in `*CATEGORIES` do?

### More Examples
Unpacking a list:

```python
words = ["a", "b", "c"]
print(*words)      # a b c   (same as print("a", "b", "c"))
```

### Common Mistakes
- **Brackets on the command:** `command=add("expense")` runs it instantly at
  startup. **Fix:** wrap it — `command=lambda: add("expense")`.
- **Forgetting `.set()`:** the drop-down starts blank. **Fix:**
  `category_var.set(CATEGORIES[0])`.

### Level Up 🚀
Add a "Remove last" button using `transactions.pop()` — but guard against popping
from an empty list!

---

## Lesson 19: The Live Bar Chart

### Big Idea
Draw a bar per category, scaled to the biggest, and redraw it after every
transaction.

### Kid Meaning
This is the moment your data becomes a picture. Log a big Food expense and watch
the Food bar stretch out.

### Tracker Connection
The centrepiece of the whole dashboard.

### The Code
```python
COLORS = {"Food": "#ffd54a", "Transport": "#7db4ff", "Fun": "#ff8fd8",
          "School": "#7CFC00", "Other": "#c8a0ff"}

def draw_chart():
    canvas.delete("chart")
    canvas.create_text(120, 160, text="Spending by category", fill="white",
                       anchor="w", font=("Arial", 13, "bold"), tags="chart")
    biggest = 0.0
    for c in CATEGORIES:
        if spent_in(c) > biggest:
            biggest = spent_in(c)
    if biggest == 0:
        biggest = 1.0
    for i in range(len(CATEGORIES)):
        name = CATEGORIES[i]
        amount = spent_in(name)
        y = 200 + i * 44
        bar_len = 400 * amount / biggest
        canvas.create_text(110, y, text=name, fill="white", anchor="e",
                           font=("Arial", 12), tags="chart")
        canvas.create_rectangle(120, y - 15, 520, y + 15, outline="#2a4a6a",
                                tags="chart")
        canvas.create_rectangle(120, y - 15, 120 + bar_len, y + 15,
                                fill=COLORS[name], outline="", tags="chart")
        canvas.create_text(535, y, text=f"GHS {amount:.2f}", fill="white",
                           anchor="w", font=("Arial", 11), tags="chart")
```

### What You'll See
Five coloured bars that **grow live**. Log GHS 50 on Food and its bar fills the
track; log GHS 25 on Fun and that bar is exactly half as long.

### Line by Line
- `COLORS = {...}` — a **dictionary** pairing each category name with its colour.
  `COLORS[name]` looks up the right one — cleaner than a parallel list.
- The first loop finds `biggest` — the largest category total, worked out
  automatically (no typing it by hand like Lesson 12!).
- `if biggest == 0: biggest = 1.0` — the **divide-by-zero guard**. With no spending
  yet, every total is 0, and dividing by 0 would crash. Setting it to 1 makes all
  bars harmlessly zero-length.
- `bar_len = 400 * amount / biggest` — scaling: the biggest category fills the
  whole 400-pixel track, everything else in proportion.
- Everything shares `tags="chart"`, so one `delete("chart")` clears the whole chart
  before redrawing.

### Do It in VS Code 🛠️
1. Add `COLORS` and `draw_chart` to `budget_tracker.py`, and call it from
   `refresh()`.
2. Save, run. Log expenses in different categories and watch the bars move.
3. Remove the zero-guard and run with no transactions — crash! Put it back.

### Your Turn
1. Change the category colours to your own.
2. Make the track longer (change both 400 and 520 to match).
3. Predict the bar length for a category with exactly half the biggest total.
   (200 pixels.)

### 📸 Show Emrys
Screenshot your chart after logging in three categories. Tell Emrys how `biggest`
is worked out and why the guard is needed.

### Check Your Brain
- How does the program find `biggest`?
- Why do we need `if biggest == 0`?
- What does scaling achieve?
- Why is a colour dictionary better than a parallel list here?

### More Examples
Finding the largest in a loop:

```python
values = [3, 9, 5]
biggest = 0
for v in values:
    if v > biggest:
        biggest = v
print(biggest)     # 9
```

### Common Mistakes
- **`ZeroDivisionError`:** drawing the chart before any spending. **Fix:** the
  guard.
- **Bars off the screen:** forgetting to scale. **Fix:** always divide by `biggest`.

### Level Up 🚀
Grey out any category with zero spending, or sort the bars so the biggest is on
top.

---

## Lesson 20: The Savings Goal Bar

### Big Idea
A progress bar shows how close your balance is to a savings goal.

### Kid Meaning
Like a fundraising thermometer — it fills as you save, and it never goes past
100% or below empty.

### Tracker Connection
This gives the tracker a purpose beyond recording: something to aim for.

### The Code
```python
GOAL = 100.0

def draw_goal():
    canvas.delete("goal")
    money = balance()
    done = money / GOAL
    if done < 0:
        done = 0.0
    if done > 1:
        done = 1.0
    canvas.create_text(120, 450, text=f"Savings goal: GHS {GOAL:.2f}",
                       fill="white", anchor="w", font=("Arial", 12, "bold"),
                       tags="goal")
    canvas.create_rectangle(120, 470, 520, 495, outline="#2a4a6a", tags="goal")
    canvas.create_rectangle(120, 470, 120 + 400 * done, 495, fill="#7CFC00",
                            outline="", tags="goal")
    canvas.create_text(535, 482, text=f"{done * 100:.0f}%", fill="white",
                       anchor="w", font=("Arial", 11), tags="goal")
```

### What You'll See
A green progress bar under the chart. Save GHS 50 toward a GHS 100 goal and it
fills exactly halfway, showing **50%**.

### Line by Line
- `done = money / GOAL` — a fraction: 50 out of 100 is `0.5`.
- `if done < 0: done = 0.0` — **clamping**. If you're in debt the fraction goes
  negative, which would draw a bar stretching backwards off the screen.
- `if done > 1: done = 1.0` — the other clamp. Save more than the goal and the bar
  stops neatly at full instead of overflowing past the track.
- These two lines are called **clamping a value into a range**, and it's used
  everywhere in real graphics code.
- `120 + 400 * done` — the bar's right edge on the 400-wide track.
- `done * 100:.0f` — turn the fraction back into a whole percentage for the label.

### Do It in VS Code 🛠️
1. Add `GOAL` and `draw_goal` to `budget_tracker.py`, and call it from `refresh()`.
2. Save, run. Add income and watch the bar fill.
3. Overspend into debt — the bar sits empty instead of drawing backwards.
4. Save more than GHS 100 — it stops at full.
5. Remove the two clamps and try both extremes to see what they prevent.

### Your Turn
1. Change `GOAL` to your own savings target.
2. Make the bar turn gold when the goal is reached (hint: an `if done >= 1`).
3. Predict `done` when the balance is 25 and the goal is 100. (0.25.)

### 📸 Show Emrys
Screenshot your goal bar part-full and completely full. Tell Emrys what clamping
prevents.

### Check Your Brain
- What does `done = money / GOAL` work out?
- What does clamping mean?
- What would happen without the `done < 0` clamp?
- Why multiply by 100 for the label?

### More Examples
Clamping in the terminal:

```python
value = 1.7
if value > 1:
    value = 1.0
print(value)     # 1.0
```

### Common Mistakes
- **No clamping:** bars drawn backwards or way past the track. **Fix:** clamp to
  0–1.
- **Forgetting `* 100`:** the label shows `0.5%` instead of `50%`. **Fix:** multiply.

### Level Up 🚀
Add a second goal line marking 50% on the track so students can see the halfway
point.

---

## Lesson 21: Refresh — Redrawing Everything Together

### Big Idea
One `refresh()` machine redraws the whole dashboard after any change.

### Kid Meaning
Instead of remembering to update five things by hand, you call one function and
everything catches up.

### Tracker Connection
This keeps the dashboard honest: it always shows the truth about the list.

### The Code
```python
def refresh():
    draw_header()
    draw_chart()
    draw_goal()
    draw_advice()
```

And `add` ends with a single call:

```python
    transactions.append({...})
    amount_entry.delete(0, tk.END)
    canvas.delete("error")
    refresh()
```

### What You'll See
Log one transaction and **everything** updates at once — the balance, the in/out
line, the right bar, the goal bar, and the advice. No stale numbers anywhere.

### Line by Line
- `refresh()` calls the four drawing machines in order. Each one clears its own tag
  and redraws, so nothing is left behind.
- **The golden rule:** the drawing functions never CHANGE data, they only SHOW it.
  `add` changes the data, then calls `refresh` to show it. Keeping those two jobs
  separate is what stops big programs turning into spaghetti.
- Because every figure is worked out fresh from `transactions` each time, the
  screen can never disagree with the data.
- One call instead of four means you can never forget one and end up with a stale
  bar.

### Do It in VS Code 🛠️
1. Add `refresh` to `budget_tracker.py` and call it at the end of `add`.
2. Also call `refresh()` once at the bottom, before `root.mainloop()`, so the
   dashboard is drawn at startup.
3. Save, run. Log a transaction and watch everything update together.
4. Comment out `draw_chart()` inside `refresh` and log something — the chart goes
   stale. That's what `refresh` prevents.

### Your Turn
1. Add a `draw_footer()` and include it in `refresh`.
2. Count how many places call `refresh` (should be `add`, `load`, `clear`, and
   startup).
3. Predict what happens if `add` forgets to call `refresh`. (The data changes but
   the screen doesn't!)

### 📸 Show Emrys
Screenshot your full dashboard after logging several transactions. Tell Emrys why
one `refresh` beats four separate calls.

### Check Your Brain
- What does `refresh()` do?
- Why should drawing functions never change data?
- Why is the dashboard always correct?
- What breaks if you forget to call it?

### More Examples
Separating jobs:

```python
def change_data():
    global score
    score = score + 1      # changes
def show_data():
    print(score)           # only shows
```

### Common Mistakes
- **Changing data inside a draw function:** totals drift and bugs get very hard to
  find. **Fix:** draw functions only read.
- **Forgetting the startup call:** the window opens blank. **Fix:** call `refresh()`
  before `mainloop()`.

### Level Up 🚀
Time how long `refresh` takes with 1000 transactions using the `time` module —
real apps care about this!

---

## Lesson 22: Saving to a File

### Big Idea
Writing to a file lets your records survive after the program closes.

### Kid Meaning
Everything so far lives in the computer's short-term memory and vanishes when you
close the window. A file is the notebook that remembers.

### Tracker Connection
This is what makes the tracker genuinely useful for your real pocket money.

### The Code
```python
import os

FILENAME = "budget.txt"

def save_data():
    with open(FILENAME, "w") as f:
        for t in transactions:
            f.write(f"{t['kind']},{t['category']},{t['amount']}\n")
    show_error(f"Saved {len(transactions)} records to {FILENAME}")

def load_data():
    if not os.path.exists(FILENAME):
        show_error("No saved file yet.")
        return
    transactions.clear()
    with open(FILENAME) as f:
        for line in f:
            line = line.strip()
            if line == "":
                continue
            parts = line.split(",")
            transactions.append({"kind": parts[0],
                                 "category": parts[1],
                                 "amount": float(parts[2])})
    refresh()
    show_error(f"Loaded {len(transactions)} records.")
```

### What You'll See
Click **Save**, close the program completely, run it again, click **Load** — and
every transaction is back, with the chart exactly as you left it.

### Line by Line
- `with open(FILENAME, "w") as f:` — open the file for **w**riting. The `with`
  block **closes the file automatically** when it ends, even if something goes
  wrong. Always use `with`.
- `"w"` **erases the file first**. Use `"a"` to append instead. (This is why we
  write ALL transactions each time.)
- `f.write(f"{t['kind']},{t['category']},{t['amount']}\n")` — one line per record,
  values separated by commas. `\n` is the **newline** character that ends the line.
  Without it everything would run together on one line.
- `os.path.exists(FILENAME)` — check the file is there before reading. Without this
  the first ever run would crash with `FileNotFoundError`.
- `transactions.clear()` — empty the list before loading, so we don't double up.
- `line.split(",")` — chop the line at each comma into a list of pieces:
  `"expense,Food,12.5"` becomes `["expense", "Food", "12.5"]`.
- `float(parts[2])` — the amount comes back as TEXT from the file, so we must turn
  it into a number again. Files only ever store text!

### Do It in VS Code 🛠️
1. Add `import os`, `FILENAME`, `save_data`, `load_data`, and Save/Load buttons.
2. Save, run. Log three transactions, click **Save**.
3. Close the window completely. Look in your project folder — there's `budget.txt`.
   **Open it in VS Code** and read your own data!
4. Run the program again and click **Load**. Everything returns.

### Your Turn
1. Open `budget.txt` and add a line by hand, then Load it.
2. Change `"w"` to `"a"` and save twice — see records duplicate. Change it back.
3. Predict what `"expense,Food,12.5".split(",")` gives.

### 📸 Show Emrys
Screenshot your `budget.txt` contents AND the dashboard after loading it. Tell
Emrys why `float()` is needed on the way back in.

### Check Your Brain
- What does `with open(...)` do that a plain `open` doesn't?
- What is the difference between `"w"` and `"a"`?
- What does `\n` do?
- Why must you `float()` the amount after loading?

### More Examples
Writing and reading a tiny file:

```python
with open("test.txt", "w") as f:
    f.write("hello\n")
with open("test.txt") as f:
    print(f.read())
```

### Common Mistakes
- **`FileNotFoundError`:** loading before ever saving. **Fix:** check
  `os.path.exists` first.
- **Forgetting `float()`:** amounts become text and adding them glues them
  together. **Fix:** convert on load.
- **Forgetting `\n`:** every record ends up on one giant line. **Fix:** add it.

### Level Up 🚀
Make the program **load automatically** at startup, so your data is just there.

---

## Lesson 23: Savings Advice

### Big Idea
Turn the numbers into honest, useful advice about spending habits.

### Kid Meaning
Data is only useful if it tells you something. This is where your app stops
recording and starts helping.

### Tracker Connection
The feature that makes it a coach, not just a calculator.

### The Code
```python
def advice_text():
    if len(transactions) == 0:
        return "Add your first record to get started!"
    money = balance()
    if money < 0:
        return "You have spent more than you earned. Time to slow down!"
    if total_income() == 0:
        return "No income recorded yet."
    saved = money / total_income() * 100
    if saved >= 50:
        return f"Excellent! You kept {saved:.0f}% of your money."
    elif saved >= 20:
        return f"Good going - you kept {saved:.0f}%. Try for 50%!"
    else:
        return f"You only kept {saved:.0f}%. Watch your spending."

def draw_advice():
    canvas.delete("advice")
    canvas.create_text(WIDTH/2, 530, text=advice_text(), fill="#ffd54a",
                       width=WIDTH - 80, font=("Arial", 13), tags="advice")
```

### What You'll See
A gold line at the bottom that changes as you log: encouraging when you save,
blunt when you overspend.

### Line by Line
- `advice_text()` is an ANSWER-machine — it returns a sentence. `draw_advice()` is
  a DO-machine — it draws whatever the first one says. Two clean jobs.
- **Three guards before the maths**, each returning early:
  1. `len(transactions) == 0` — nothing logged yet.
  2. `money < 0` — in debt; a percentage would be meaningless.
  3. `total_income() == 0` — spending with no income would **divide by zero**.
- Only once all three are safe do we work out `saved`. This "check the impossible
  cases first, then do the real work" shape is how professionals write functions.
- The `if/elif/else` then bands the percentage, biggest first (Lesson 10's rule).

### Do It in VS Code 🛠️
1. Add both functions to `budget_tracker.py` and include `draw_advice()` in
   `refresh()`.
2. Save, run. Log only an expense (no income) — the third guard catches it.
3. Log income and small spending — get the excellent message.
4. Overspend — get the warning.
5. Remove the `total_income() == 0` guard and log only an expense — crash! Restore
   it.

### Your Turn
1. Rewrite all the advice in your own voice.
2. Add a band for keeping over 75%.
3. Predict the advice when income is 100 and spending is 30. (Kept 70% —
   excellent.)

### 📸 Show Emrys
Screenshot three different pieces of advice. Tell Emrys which guard prevents a
divide-by-zero crash.

### Check Your Brain
- Why does `advice_text` return instead of drawing?
- What are the three guards protecting against?
- Which guard stops a `ZeroDivisionError`?
- Why check the biggest percentage band first?

### More Examples
Guard-first functions:

```python
def divide(a, b):
    if b == 0:
        return "Cannot divide by zero"
    return a / b
```

### Common Mistakes
- **Maths before the guards:** a crash on the very first click. **Fix:** guards go
  first.
- **Drawing inside `advice_text`:** mixes the two jobs. **Fix:** return the text,
  draw elsewhere.

### Level Up 🚀
Name the category you spend most on in the advice: "Most of your money goes on
Food."

---

## Lesson 24: Showcase and Reflection

### Big Idea
Assemble the complete Budget Tracker and show it off — you built a real money app!

### Kid Meaning
Every piece you learned — windows, shapes, floats, Entry input, if/elif, booleans,
loops, lists, dictionaries, functions, return, files, and charts — comes together
into one tool you can genuinely use.

### Tracker Connection
This is the finished product. Read it, run it, and be proud.

### The Code
```python
import tkinter as tk
import os

WIDTH, HEIGHT = 720, 580
CATEGORIES = ["Food", "Transport", "Fun", "School", "Other"]
COLORS = {"Food": "#ffd54a", "Transport": "#7db4ff", "Fun": "#ff8fd8",
          "School": "#7CFC00", "Other": "#c8a0ff"}
GOAL = 100.0
FILENAME = "budget.txt"

root = tk.Tk()
root.title("My Money Budget Tracker")
root.resizable(False, False)
canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg="#0e1b2a")
canvas.pack()

transactions = []

def total_income():
    total = 0.0
    for t in transactions:
        if t["kind"] == "income":
            total = total + t["amount"]
    return total

def total_spent():
    total = 0.0
    for t in transactions:
        if t["kind"] == "expense":
            total = total + t["amount"]
    return total

def spent_in(category):
    total = 0.0
    for t in transactions:
        if t["kind"] == "expense" and t["category"] == category:
            total = total + t["amount"]
    return total

def balance():
    return total_income() - total_spent()

def draw_header():
    canvas.delete("header")
    canvas.create_text(WIDTH / 2, 35, text="MY MONEY BUDGET TRACKER",
                       fill="#ffd54a", font=("Arial", 20, "bold"),
                       tags="header")
    money = balance()
    color = "#7CFC00" if money >= 0 else "#ff6b6b"
    canvas.create_text(WIDTH / 2, 80, text=f"Balance: GHS {money:.2f}",
                       fill=color, font=("Arial", 26, "bold"), tags="header")
    canvas.create_text(WIDTH / 2, 115,
                       text=f"In: GHS {total_income():.2f}    "
                            f"Out: GHS {total_spent():.2f}    "
                            f"({len(transactions)} records)",
                       fill="#8fa0d8", font=("Arial", 12), tags="header")

def draw_chart():
    canvas.delete("chart")
    canvas.create_text(120, 160, text="Spending by category", fill="white",
                       anchor="w", font=("Arial", 13, "bold"), tags="chart")
    biggest = 0.0
    for c in CATEGORIES:
        if spent_in(c) > biggest:
            biggest = spent_in(c)
    if biggest == 0:
        biggest = 1.0
    for i in range(len(CATEGORIES)):
        name = CATEGORIES[i]
        amount = spent_in(name)
        y = 200 + i * 44
        bar_len = 400 * amount / biggest
        canvas.create_text(110, y, text=name, fill="white", anchor="e",
                           font=("Arial", 12), tags="chart")
        canvas.create_rectangle(120, y - 15, 520, y + 15, outline="#2a4a6a",
                                tags="chart")
        canvas.create_rectangle(120, y - 15, 120 + bar_len, y + 15,
                                fill=COLORS[name], outline="", tags="chart")
        canvas.create_text(535, y, text=f"GHS {amount:.2f}", fill="white",
                           anchor="w", font=("Arial", 11), tags="chart")

def draw_goal():
    canvas.delete("goal")
    money = balance()
    done = money / GOAL
    if done < 0:
        done = 0.0
    if done > 1:
        done = 1.0
    canvas.create_text(120, 450, text=f"Savings goal: GHS {GOAL:.2f}",
                       fill="white", anchor="w", font=("Arial", 12, "bold"),
                       tags="goal")
    canvas.create_rectangle(120, 470, 520, 495, outline="#2a4a6a", tags="goal")
    canvas.create_rectangle(120, 470, 120 + 400 * done, 495, fill="#7CFC00",
                            outline="", tags="goal")
    canvas.create_text(535, 482, text=f"{done * 100:.0f}%", fill="white",
                       anchor="w", font=("Arial", 11), tags="goal")

def advice_text():
    if len(transactions) == 0:
        return "Add your first record to get started!"
    money = balance()
    if money < 0:
        return "You have spent more than you earned. Time to slow down!"
    if total_income() == 0:
        return "No income recorded yet."
    saved = money / total_income() * 100
    if saved >= 50:
        return f"Excellent! You kept {saved:.0f}% of your money."
    elif saved >= 20:
        return f"Good going - you kept {saved:.0f}%. Try for 50%!"
    else:
        return f"You only kept {saved:.0f}%. Watch your spending."

def draw_advice():
    canvas.delete("advice")
    canvas.create_text(WIDTH / 2, 530, text=advice_text(), fill="#ffd54a",
                       width=WIDTH - 80, font=("Arial", 13), tags="advice")

def refresh():
    draw_header()
    draw_chart()
    draw_goal()
    draw_advice()

def show_error(message):
    canvas.delete("error")
    canvas.create_text(WIDTH / 2, 145, text=message, fill="#ff6b6b",
                       font=("Arial", 12), tags="error")

def add(kind):
    text = amount_entry.get().strip()
    try:
        amount = float(text)
    except ValueError:
        show_error("Please type a number, like 12.50")
        return
    if amount <= 0:
        show_error("Amount must be more than zero.")
        return
    transactions.append({"kind": kind,
                         "category": category_var.get(),
                         "amount": amount})
    amount_entry.delete(0, tk.END)
    canvas.delete("error")
    refresh()

def save_data():
    with open(FILENAME, "w") as f:
        for t in transactions:
            f.write(f"{t['kind']},{t['category']},{t['amount']}\n")
    show_error(f"Saved {len(transactions)} records to {FILENAME}")

def load_data():
    if not os.path.exists(FILENAME):
        show_error("No saved file yet.")
        return
    transactions.clear()
    with open(FILENAME) as f:
        for line in f:
            line = line.strip()
            if line == "":
                continue
            parts = line.split(",")
            transactions.append({"kind": parts[0],
                                 "category": parts[1],
                                 "amount": float(parts[2])})
    refresh()
    show_error(f"Loaded {len(transactions)} records.")

def clear_all():
    transactions.clear()
    canvas.delete("error")
    refresh()

controls = tk.Frame(root)
controls.pack(pady=6)
tk.Label(controls, text="Amount:").pack(side="left", padx=3)
amount_entry = tk.Entry(controls, font=("Arial", 13), width=9,
                        justify="center")
amount_entry.pack(side="left", padx=3)
category_var = tk.StringVar(root)
category_var.set(CATEGORIES[0])
tk.OptionMenu(controls, category_var, *CATEGORIES).pack(side="left", padx=3)
tk.Button(controls, text="Add Expense",
          command=lambda: add("expense")).pack(side="left", padx=3)
tk.Button(controls, text="Add Income",
          command=lambda: add("income")).pack(side="left", padx=3)

tools = tk.Frame(root)
tools.pack(pady=2)
tk.Button(tools, text="Save", width=8, command=save_data).pack(side="left", padx=3)
tk.Button(tools, text="Load", width=8, command=load_data).pack(side="left", padx=3)
tk.Button(tools, text="Clear", width=8, command=clear_all).pack(side="left", padx=3)

refresh()
root.mainloop()
```

### What You'll See
The full dashboard: a colour-coded balance, in/out totals, a live five-category bar
chart, a savings goal progress bar, honest advice, input validation, and Save /
Load / Clear buttons — a money app you can actually use.

### Line by Line
- Every function is one you built across the course. Read each name — you know
  exactly what it does now.
- The shape of the program: **data** (`transactions`), **questions about the data**
  (`total_income`, `spent_in`, `balance`, `advice_text`), **drawing** (`draw_*`),
  and **actions** (`add`, `save_data`, `load_data`). Real software is organised
  exactly like this.
- Notice no drawing function ever changes `transactions`. That discipline is why
  the dashboard is always correct.

### Do It in VS Code 🛠️
1. Make sure your `budget_tracker.py` matches this complete version.
2. Save, run. Log a week of your REAL pocket money and spending.
3. Save it, close it, reopen and load — your real data, still there.

### Your Turn — Reflection
1. Which lesson was the hardest, and what finally made it click?
2. Add ONE personal touch (your own categories, colours, goal, or advice).
3. Write two sentences: what are you proudest of building?

### 📸 Show Emrys
Screenshot your dashboard with your REAL money data AND your `budget.txt`. Tell
Emrys: "Course complete!" and share your one personal touch.

### Check Your Brain
- Name three different concepts this tracker uses (there are many!).
- Which functions ask questions about the data, and which ones draw?
- How would you explain "a list of dictionaries" to a friend?

### More Examples
Ideas to keep growing your tracker:

```python
# Add a date to every record
import datetime
today = datetime.date.today()
print(today)          # e.g. 2026-07-20
```

### Common Mistakes
- **Copy-paste errors:** if it won't run, read the terminal's red line number and
  check that exact line. **Fix:** compare it character by character.
- **Indentation drift:** mixed spaces break Python. **Fix:** keep 4 spaces per
  level everywhere.

### Level Up 🚀
Add dates to every record and show a "this week vs last week" comparison, or a
monthly report. You are officially an app developer! 💰
