# Magic Number Game Lessons: Class 4 Edition

Build your very own **Magic Number Game** — the computer secretly picks a number,
and you try to guess it. The computer tells you "too high" or "too low" until you
get it right, then cheers for you and counts how many tries you took!

This project is for **Class 4** (beginners, around 9–10 years old). It uses Python
on a normal school computer. You start from absolutely zero — no experience
needed. Every single line of code is explained in simple words so you truly
understand it, not just copy it.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Game Connection** — how this fits our Magic Number Game.
- **The Code** — the actual Python to type.
- **Line by Line** — every important line explained.
- **Your Turn** — a small task YOU do to practise (this is the most important part!).
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
4. Run: press the **▶ Run** button at the top-right, and read the result in
   the **TERMINAL** panel at the bottom.

You never run code inside Emrys's chat — Emrys is your teacher; VS Code is
your workbench.

### Show Emrys Your Work 📸

After EVERY "Your Turn" task, show Emrys the proof: **copy what the terminal
printed and paste it to Emrys — or send a screenshot.** Emrys will check it,
celebrate what's right, and help fix anything that isn't. If something errored,
paste the red error message too — errors are clues, and Emrys reads them like
a detective. No skipping this step: real coders always show their output.

Teach one lesson at a time. Explain the idea first, then the code, then let
students type it and run it themselves. **Always do "Your Turn" — that is where
the learning happens.** Do not rush; it is better to truly understand one lesson
than to copy five.

**This course takes about 4 months** (roughly two lessons a week). It has three
parts:

- **Part 1 — First Steps (Lessons 1–8):** learn what code is and the basic
  building blocks — printing, variables, and input.
- **Part 2 — Making Choices (Lessons 9–16):** teach the computer to decide and
  repeat, using `if` and loops.
- **Part 3 — Building the Game (Lessons 17–24):** put it all together into the
  real Magic Number Game, then make it even cooler.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST STEPS

---

## Lesson 1: What Is Code? Saying Hello

### Big Idea
Code is a list of instructions we give the computer, one line at a time.

### Kid Meaning
A recipe tells a cook what to do step by step. Code tells the computer what to do
step by step. The computer does EXACTLY what you say — nothing more, nothing less.

### Game Connection
Our game will need to "say" things like "Too high!" — so first we learn how to
make the computer say anything at all.

### The Code
```python
print("Hello! I am your computer.")
print("Let's make a game together.")
```

**When you run it, the TERMINAL at the bottom of VS Code shows:**

```text
Hello! I am your computer.
Let's make a game together.
```

Notice: the quotes are **gone** in the output. The quotes are for Python's
eyes only — they mark where your message starts and ends.

### Line by Line
- `print(...)` — `print` is a command that means "show this on the screen."
  It is the computer's mouth: whatever you put inside, it says.
- The words inside the quotes `" "` are exactly what gets shown — letter for
  letter, space for space, even the punctuation.
- Each `print` line shows on its own new line, in the exact order you wrote
  them — top to bottom, like reading a book.

### Slow Motion 🔬 — every single piece explained
Look at `print("Hello! I am your computer.")` one piece at a time:

- `print` — the command's name. It must be spelled in small letters exactly
  like this. The computer has a dictionary of commands it knows, and `print`
  is one of them.
- `(` and `)` — the brackets are like HANDS. The computer holds whatever is
  between them and works on it. Every `(` must have a matching `)`.
- `"` and `"` — the quotes are like a GIFT BOX around your words. They tell
  Python: "don't try to understand these words — just deliver them."
- `Hello! I am your computer.` — the message itself. You can write ANYTHING
  here: your name, a joke, even emoji.

What actually happens when you press Run: VS Code hands your file to Python →
Python reads line 1 → sees `print` → takes the message out of the gift box →
shows it in the terminal → moves to line 2 → does it again → no more lines, so
it stops. The whole thing takes less than a blink. That's a PROGRAM: a list of
orders, followed perfectly, top to bottom.

### Do It in VS Code 🛠️
1. Open VS Code → **File → New File** → name it `hello.py` → save it on your
   Desktop.
2. Type the two `print` lines yourself (don't copy-paste — typing teaches your
   fingers the language).
3. Save: **Ctrl+S**. (A white dot on the file tab means UNSAVED — make it
   disappear!)
4. Press the **▶ Run** button at the top-right.
5. Read the TERMINAL panel at the bottom — your two lines should be there.

### Your Turn
1. Make the computer print your own name, like: `print("My name is Ama.")`
2. Add two more `print` lines: your favourite food and your favourite colour.
3. BEFORE you run: predict out loud exactly what the terminal will show, in
   order. Then run. Were you right, line for line?
4. Now break it ON PURPOSE: remove one closing quote and run. Read the red
   error slowly. Put the quote back, run again — green and clean. You just had
   your first conversation with a Python error, and you won.

### 📸 Show Emrys
Copy everything the terminal printed (your three lines) and **paste it to
Emrys** — or send a screenshot. Tell Emrys: "Lesson 1 done!" Emrys will check
each line and give you your first ✅ of the course.

### Check Your Brain
- What does `print` do?
- What do the quotes `" "` mark — and do they appear in the output?
- If you write three `print` lines, how many lines show on screen?
- What are the brackets `( )` for?

### More Examples
Try each one — predict what it shows BEFORE you run it:

```python
print("I am learning Python!")
print("Python is a snake AND a computer language.")
```

The computer prints things in the exact order you write them:

```python
print("First")
print("Second")
print("Third")
```

You can even print an empty line to make space — `print()` with nothing inside:

```python
print("Top line")
print()
print("Bottom line - see the gap above me?")
```

### Common Mistakes
Everyone makes these — spotting them makes you a real coder:

- **Forgetting the quotes:** `print(Hello)` → Python says `NameError: name 'Hello' is not defined`. It thinks Hello is a box name, not words. **Fix:** `print("Hello")`.
- **Forgetting a bracket:** `print("Hello"` → Python says `SyntaxError: '(' was never closed`. **Fix:** close it — `print("Hello")`.
- **Capital P:** `Print("Hello")` → `NameError`. Python only knows lowercase `print`. Computers are picky about spelling!

### Level Up 🚀
Make the computer print a little picture using symbols — this is called ASCII art:

```python
print("  *  ")
print(" *** ")
print("*****")
```

That's a tree top! Can you add a trunk? Can you print your initial in stars?

---

## Lesson 2: How to Run Python

### Big Idea
We type code in a file and then "run" it to see it work.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when things actually happen.

### Game Connection
You will run your game again and again as you build it, checking it each time.

### The Code
```python
print("If you can see this, Python is working!")
```

**When you run it, the TERMINAL shows:**

```text
If you can see this, Python is working!
```

### Line by Line
- This is one instruction. When you run the file, Python reads it top to
  bottom, like you read a page.
- Save your file with a name ending in `.py`, for example `game.py`. The `.py`
  ending is a label that tells the computer "this is Python" — like `.mp3`
  means music and `.jpg` means a picture.

### Slow Motion 🔬 — writing vs running
There are TWO different moments, and mixing them up confuses every beginner:

- **Writing** = typing the code into the VS Code editor. Nothing happens yet —
  it's like writing a letter that nobody has read.
- **Saving** = Ctrl+S. Your words are now safely on the computer's disk. STILL
  nothing happens.
- **Running** = pressing **▶**. NOW Python reads your letter out loud and the
  instructions actually happen. This is the magic moment.

The biggest beginner trap: changing the code and running WITHOUT saving — the
computer runs the OLD saved version and you sit there confused why nothing
changed. The rhythm to burn into your fingers: **type → Ctrl+S → ▶ → read the
terminal.** Every time. Forever.

### Do It in VS Code 🛠️
1. **File → New File** → name it `practice.py` → save on your Desktop.
2. Type the print line above.
3. **Ctrl+S** — watch the white "unsaved" dot on the tab disappear.
4. Press **▶ Run** (top-right). The TERMINAL opens at the bottom by itself.
5. Find your sentence in the terminal. That text travelled: your fingers → the
   editor → the disk → Python → the screen. You're officially running programs.

There's a second way to run, like the pros: open **Terminal → New Terminal**
and type `python practice.py` then press Enter. Same result — the ▶ button
just types that command for you.

### Your Turn
1. Save a file called `practice.py`.
2. Put one `print` line inside that says `"I ran my first program!"`.
3. Run it with the ▶ button. Then run it AGAIN with `python practice.py` typed
   in the terminal — prove to yourself both roads lead to the same place.
4. Change the message, but DON'T save, and run. See the old message? Now save
   and run. THAT lesson — save first! — just saved you a hundred future
   headaches.

### 📸 Show Emrys
Paste the terminal output of your `practice.py` to Emrys (or screenshot it) and
tell Emrys which way you ran it — the ▶ button or the typed command. Emrys
will confirm your setup is rock solid.

### Check Your Brain
- What ending must a Python file name have?
- What is the difference between "writing" code and "running" code?
- Why must you SAVE before you run?

### More Examples
Make a few tiny files and run each one — running programs should feel as easy as opening a book:

```python
# file: morning.py
print("Good morning, class!")
```

```python
# file: countdown.py
print("3...")
print("2...")
print("1...")
print("Blast off!")
```

The line starting with `#` is a **comment** — a note for humans. The computer skips it completely. Coders leave comments like sticky notes to remember what the code does:

```python
# This program cheers for our team
print("Go go go!")  # this part shows on screen
```

### Common Mistakes
- **Saving without `.py`:** if the file is called `game.txt`, the Run button may not work. **Fix:** save it as `game.py`.
- **Forgetting to SAVE before running:** you change the code, run it, and see the OLD result. **Fix:** save first (Ctrl+S), then run. Many editors show a dot ● on the tab when you haven't saved.
- **Editing the output window instead of the code window:** nothing happens there! **Fix:** type only in the code editor (the big writing area), then press Run.

### Level Up 🚀
Make a file called `about_me.py` that prints 5 lines about you — name, class, town, favourite food, and what you want to build with Python. Run it for the person next to you. You just wrote and ran a real program — that's exactly what professional programmers do all day!

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a labelled box that stores a value so we can use it later.

### Kid Meaning
Imagine a box with a name sticker on it. You put something inside, and whenever
you say the box's name, the computer looks inside and uses what's there.

### Game Connection
Our game must remember the secret number and how many guesses you have made. Those
are stored in variables.

### The Code
```python
name = "Kofi"
age = 9
print(name)
print(age)
```

**When you run it, the TERMINAL shows:**

```text
Kofi
9
```

See that? It printed `Kofi` — NOT the word `name`. Because there are no quotes
around `name` in `print(name)`, Python knows you mean "open the box called
name and show what's inside."

### Line by Line
- `name = "Kofi"` — make a box called `name` and put the word `Kofi` inside.
  The single `=` means "PUT INTO" (not "equals" like in maths!). Read it
  right-to-left: take `"Kofi"`, put it into `name`.
- `age = 9` — make a box called `age` and put the number `9` inside.
- `print(name)` — show what is inside the `name` box (Kofi), NOT the word
  "name". No quotes = "look inside the box". Quotes = "say this exact word".
- Notice: words need quotes (`"Kofi"`), but numbers do not (`9`).

### Slow Motion 🔬 — what IS a variable really?
Inside the computer there is memory — millions of tiny shelves. When Python
reads `name = "Kofi"`, it does three things:

1. Finds an empty shelf.
2. Puts the word `"Kofi"` on it.
3. Sticks a label on the shelf that says `name`.

From now on, whenever you write `name` (no quotes), Python walks to that
shelf, reads the label, and brings you what's on it. When you later write
`name = "Ama"`, Python doesn't get a new shelf — it REPLACES what's on the
labelled shelf. The old value is gone forever. One label, one current value.

**Naming rules** (Python is strict): letters, numbers, and `_` only — no
spaces. `lucky_number` ✅, `lucky number` ❌ (SyntaxError). Names can't START
with a number: `2cool` ❌, `cool2` ✅. And capitals matter: `Name` and `name`
are two DIFFERENT shelves!

### Do It in VS Code 🛠️
1. Open `game.py` (or make `practice.py`) in VS Code.
2. Type the four lines, save (**Ctrl+S**), run (**▶**).
3. Confirm the terminal shows `Kofi` then `9` — values, not label names.

### Your Turn
1. Make a variable `favourite_game` and put your favourite game inside it.
2. Make a variable `lucky_number` with a number you like.
3. Print both.
4. Now change `lucky_number` to a different number on a NEW line below, and
   print it again. Run it — you'll see the old number first, then the new one.
   That's the shelf being replaced while the program runs!
5. Predict first, then test: what does `print("lucky_number")` show — WITH
   quotes? Run it. (It shows the words `lucky_number`, because quotes mean
   "say exactly this". Quotes change everything!)

### 📸 Show Emrys
Paste your terminal output to Emrys and tell him your variable names. Emrys
will check that your boxes are filled correctly — and might quiz you: "what's
inside `lucky_number` right now?"

### Check Your Brain
- What is a variable, in your own words?
- Why does `"Kofi"` have quotes but `9` does not?
- What does `print(name)` show — the word "name" or what's inside it?
- What happens to the OLD value when you put a new one in the box?

### More Examples
Boxes can hold all kinds of things, and you can have as many as you like:

```python
school = "Credent Academy"
class_size = 25
print(school)
print(class_size)
```

A box can be **refilled** — the old thing is replaced by the new thing:

```python
mood = "sleepy"
print(mood)
mood = "excited"
print(mood)   # shows excited, the old sleepy is gone
```

One box can even be filled FROM another box:

```python
best_friend = "Esi"
team_mate = best_friend
print(team_mate)   # shows Esi - it copied what was inside
```

### Common Mistakes
- **Quotes around numbers you want to do maths with:** `age = "9"` stores a *word* that looks like 9. Later `age + 1` breaks with `TypeError: can only concatenate str (not "int") to str`. **Fix:** for real numbers, no quotes: `age = 9`.
- **Using a box before filling it:** `print(score)` before ever writing `score = ...` → `NameError: name 'score' is not defined`. **Fix:** fill the box first, use it after.
- **Spelling the name differently:** `favourite_game = "Ampe"` then `print(favorite_game)` → `NameError`. The names must match EXACTLY, letter for letter.

### Level Up 🚀
Make a "My Hero Card": variables for `hero_name`, `power`, and `strength` (a number from 1 to 100). Print all three. Then change `strength` to a bigger number on the next line and print it again — your hero just levelled up, exactly how game characters work in real games!

---

## Lesson 4: Numbers and Simple Maths

### Big Idea
The computer can do maths for us, very fast and never wrong.

### Kid Meaning
The computer is a super calculator. We just tell it the sum.

### Game Connection
Later the game counts your guesses by adding 1 each time. That is maths!

### The Code
```python
a = 5
b = 3
print(a + b)
print(a - b)
print(a * b)
```

**When you run it, the TERMINAL shows:**

```text
8
2
15
```

Only the ANSWERS appear — not the sums. The maths happens invisibly inside
Python, and `print` shows the result.

### Line by Line
- `a + b` — add (gives 8).
- `a - b` — subtract (gives 2).
- `a * b` — multiply. We use `*` (a star) for "times", not `x` — because `x`
  could be a variable name, so Python needs a different symbol.
- The computer works out the answer FIRST, then hands it to `print` to show.
  Two steps in one line: calculate, then display.

### Slow Motion 🔬 — how Python reads `print(a + b)`
Watch Python think, from the inside out:

1. It sees `print(...)` and says: "before I can show anything, I must work out
   what's inside the brackets."
2. Inside it finds `a + b`. It opens box `a` → finds 5. Opens box `b` → finds 3.
3. It adds: 5 + 3 = 8.
4. NOW print has something to show: `8` goes to the terminal.

The full symbol family you'll use in this course:

```text
+   add          5 + 3   ->  8
-   subtract     5 - 3   ->  2
*   multiply     5 * 3   ->  15
/   divide       6 / 3   ->  2.0   (division always gives a decimal!)
```

That `2.0` surprise: dividing always produces a decimal number in Python, even
when it divides evenly. You'll meet this again — for now, just don't be shocked
by the `.0`.

### Do It in VS Code 🛠️
1. In your practice file, type the five lines, save (**Ctrl+S**), run (**▶**).
2. Check the terminal shows exactly `8`, `2`, `15`.
3. Add a sixth line `print(a / b)` and run — see the decimal answer.

### Your Turn
1. Make two number variables and print their sum.
2. Try multiplying them.
3. Predict the answer FIRST, then run it. Were you right?
4. Calculator race: set `a = 123` and `b = 47`. Predict `a * b` in your head or
   on paper... then let Python settle it. Who's faster — you or the machine?
   (This is exactly why humans invented computers!)
5. Try `print(a + b * 2)` with small numbers. Surprised? Python does `*` BEFORE
   `+`, just like in maths class (BODMAS). Brackets win over everything:
   `print((a + b) * 2)` forces the add first.

### 📸 Show Emrys
Paste your terminal output to Emrys, including the race result from task 4.
Tell Emrys your prediction and whether you beat the computer. 😄

### Check Your Brain
- Which symbol means "times"?
- What does `a - b` give if `a = 10` and `b = 4`?
- In `print(2 + 3 * 4)`, what does Python work out first — and what prints?

### More Examples
The computer can solve real problems from your life:

```python
# Pocket money for a week
per_day = 2
days = 5
print(per_day * days)   # how much in a school week?
```

```python
# Sharing sweets fairly
sweets = 20
friends = 4
print(sweets / friends)   # the / means divide
```

Notice: dividing gives `5.0` with a dot — Python's way of saying "this might not be a whole number". You can mix maths in one line, and Python multiplies/divides BEFORE adding/subtracting, just like in maths class:

```python
print(2 + 3 * 4)     # 14, not 20! (times first)
print((2 + 3) * 4)   # 20 - brackets go first, same as maths
```

### Common Mistakes
- **Using `x` for times:** `print(5 x 3)` → `SyntaxError`. The computer only knows `*`. **Fix:** `print(5 * 3)`.
- **Quotes around the sum:** `print("5 + 3")` shows the words `5 + 3`, not `8`! Quotes mean "say exactly this". **Fix:** no quotes when you want the answer: `print(5 + 3)`.
- **Expecting `÷`:** there is no `÷` key — divide is `/` (the slash).

### Level Up 🚀
Be the class shopkeeper: a pencil costs 3 cedis and a notebook costs 7 cedis. Make variables `pencils = 4` and `notebooks = 2`, then print the total cost in ONE print line. (Answer should be 26 — did your code agree?)

---

## Lesson 5: Counting Up by Adding to a Variable

### Big Idea
We can update a variable using its own value, like `count = count + 1`.

### Kid Meaning
It looks strange, but it means: "take what's in the box, add one, put it back."
Like adding one more sweet to your jar.

### Game Connection
This is EXACTLY how the game counts tries: every guess does `guesses = guesses + 1`.

### The Code
```python
guesses = 0
print(guesses)
guesses = guesses + 1
print(guesses)
guesses = guesses + 1
print(guesses)
```

**When you run it, the TERMINAL shows:**

```text
0
1
2
```

A counter, counting. You just built the heart of every scoreboard, step
counter, and "likes" number you've ever seen.

### Line by Line
- `guesses = 0` — start the counter at zero. (Counters must be BORN before
  they can grow — this line is the birth.)
- `guesses = guesses + 1` — new value is the old value plus one. Now it's 1.
- Do it again and it becomes 2. The box keeps only the latest number.

### Slow Motion 🔬 — why `guesses = guesses + 1` isn't crazy
In maths class, `x = x + 1` would be impossible — nothing equals itself plus
one! But remember: in Python `=` does NOT mean "equals". It means **"work out
the right side, then PUT it into the left side."** So Python does this:

1. RIGHT SIDE first: open the `guesses` box → finds `0` → adds 1 → gets `1`.
2. THEN the `=`: put `1` back into the `guesses` box, replacing the `0`.

Old value out, new value in. Like adding one sweet to your jar: count what's
in the jar, add one, that's the new count. The order — *right side first, then
store* — is the key that makes it make sense.

### Do It in VS Code 🛠️
1. Type the six lines in your practice file. Save (**Ctrl+S**), run (**▶**).
2. Confirm: `0`, `1`, `2` — one per line.
3. Now add `guesses = guesses + 1` and `print(guesses)` once more — predict the
   fourth number before running.

### Your Turn
1. Start a variable `score = 0`.
2. Add 10 to it, print it. Add 10 again, print it.
3. Can you make it go up by 5 each time instead?
4. Make a countdown instead: start `rocket = 3` and SUBTRACT 1 three times,
   printing each step — `3, 2, 1` — then print `"LIFT OFF! 🚀"`.
5. Pro shortcut unlock: `score += 10` does exactly the same as
   `score = score + 10`, just shorter. Try replacing one line with it. (And
   `rocket -= 1` counts down!) Now you write it like the pros.

### 📸 Show Emrys
Paste BOTH outputs to Emrys: your score counter going up, and your rocket
counting down to lift-off. Emrys will check the numbers step by step.

### Check Your Brain
- What does `count = count + 1` do?
- If `score` is 20 and you run `score = score + 10`, what is it now?
- Which side of the `=` does Python work out FIRST?

### More Examples
Counters can go DOWN too — like lives in a game:

```python
lives = 3
print(f"Lives: {lives}")
lives = lives - 1      # ouch! lost a life
print(f"Lives: {lives}")
```

Counters can grow by anything, not just 1:

```python
savings = 0
savings = savings + 5    # saved 5 cedis Monday
savings = savings + 5    # saved 5 more Tuesday
savings = savings + 10   # big saving day!
print(savings)           # 20
```

Coders use a shortcut so often it's worth knowing: `score += 10` means exactly the same as `score = score + 10` (and `lives -= 1` means lose one):

```python
score = 0
score += 10
score += 10
print(score)   # 20 - same result, less typing
```

### Common Mistakes
- **Starting without 0:** using `tries = tries + 1` when `tries` was never created → `NameError: name 'tries' is not defined`. **Fix:** always start the counter first: `tries = 0`.
- **Writing it backwards:** `count + 1 = count` → `SyntaxError`. The box being filled must be on the LEFT of `=`.
- **Expecting it to remember between runs:** every time you run the program, counters start fresh from your starting line. (Saving things between runs comes much later!)

### Level Up 🚀
Make a "clap counter": start `claps = 0`, then add 2 claps, then double the whole thing (`claps = claps * 2`), then add 1. Predict the final number BEFORE you run it. If you predicted right, you're thinking exactly like the computer — that skill is called *tracing* and pro programmers do it every day.

---

## Lesson 6: Talking to the Player with input()

### Big Idea
`input()` lets the computer ask a question and wait for the player to type.

### Kid Meaning
It's like the computer asking "What's your name?" and then listening for your
answer.

### Game Connection
The whole game is built on this — the computer asks "Guess the number" and waits
for you to type a guess.

### The Code
```python
name = input("What is your name? ")
print("Nice to meet you, " + name)
```

**When you run it, the TERMINAL shows the question and then... WAITS:**

```text
What is your name? █
```

That blinking cursor is the computer listening — for the first time, your
program needs YOU. Click in the terminal, type your name, press **Enter**:

```text
What is your name? Ama
Nice to meet you, Ama
```

### Line by Line
- `input("What is your name? ")` — shows the question, then STOPS and waits.
  The whole program freezes patiently until the player presses Enter.
- Whatever the player types is stored in the `name` box — exactly like
  `name = "Ama"`, except the PLAYER chose the value, not you.
- `"Nice to meet you, " + name` — joins two pieces of text together with `+`.
  This glueing has a fancy name: *concatenation* (kon-kat-en-NAY-shun) — drop
  that word at home and watch the reaction. 😄

### Slow Motion 🔬 — the conversation pattern
`input()` is the doorway between your program and a human. Every chat-style
program in the world follows this exact pattern:

```text
ASK  ->  the prompt text inside input("...")
WAIT ->  the program freezes until Enter is pressed
STORE -> the typed answer lands in a variable
USE  ->  print (or calculate with) that variable
```

Two small but mighty details:
- The space at the end of `"What is your name? "` is on PURPOSE — without it,
  typing starts squashed against the question mark. Tiny detail, professional
  feel.
- With the glue `+`, spaces never appear by magic. `"Hi" + name` makes
  `HiAma`. You must put the space INSIDE the quotes: `"Hi " + name`.

### Do It in VS Code 🛠️
1. Type the two lines, save (**Ctrl+S**), run (**▶**).
2. **Click inside the TERMINAL panel** (important — your typing must go to the
   terminal, not the editor!), type your name, press Enter.
3. Read the greeting. You and your program just had a conversation.

### Your Turn
1. Ask the player their favourite animal and store it.
2. Print a friendly message using their answer.
3. Ask a second question (their age) and print both answers.
4. Build a two-question mini-interview that ends with one combined line, like:
   `"Wow — a 9-year-old who loves leopards!"` (glue carefully: mind the spaces!)
5. Run your interview on a CLASSMATE — let them type the answers. Watching
   someone else use YOUR program for the first time is a feeling you'll never
   forget.

### 📸 Show Emrys
Paste the whole conversation from the terminal — questions AND answers — to
Emrys. Emrys will check your glueing (no squashed words!) and might ask what
`input()` does while it waits.

### Check Your Brain
- What does `input()` do after it shows the question?
- What does `+` do between two pieces of text?
- Where must you click before typing your answer — the editor or the terminal?

### More Examples
The computer can have a whole conversation by asking several questions:

```python
food = input("What is your favourite food? ")
print("Yum! " + food + " is delicious!")
```

```python
town = input("Which town are you from? ")
team = input("Which football team do you support? ")
print("So a " + team + " fan from " + town + " - nice!")
```

You can reuse one answer many times once it's in a box:

```python
name = input("Your name? ")
print(name + ", " + name + ", " + name + "!")
print("The crowd is chanting your name!")
```

### Common Mistakes
- **No space in the question:** `input("Your name?")` works, but the player types right against the question mark and it looks squashed. **Fix:** end with a space — `input("Your name? ")`. Small touch, very professional.
- **Forgetting to store the answer:** writing just `input("Your name? ")` without `name =` — the answer disappears! **Fix:** always catch it in a box: `name = input(...)`.
- **Joining words without spaces:** `print("Hello" + name)` shows `HelloAma`. **Fix:** include a space inside the quotes: `"Hello " + name`.

### Level Up 🚀
Build a two-question "interview robot": it asks your name and your dream job, then announces you like a TV host — "Ladies and gentlemen... AMA, the future PILOT!" Bonus: `.upper()` makes text shout — try `print(name.upper())`.

---

## Lesson 7: Words vs Numbers — int() and the Easy f-string

### Big Idea
Anything typed with `input()` arrives as TEXT, even if it looks like a number. We
use `int()` to turn it into a real number. And to mix words and numbers in a
message the EASY way, we use an **f-string**.

### Kid Meaning
"7" written on paper is a drawing of seven. To do maths, the computer needs the
real number seven, not the drawing. `int()` does that change. An f-string is a
magic sentence where you can drop a box's value right inside the words.

### Game Connection
The player types a guess like `50`. We must turn it into a real number before we
can compare it to the secret. And we'll show messages like "You took 6 tries" by
dropping the number straight into the sentence with an f-string.

### The Code
```python
age_text = input("How old are you? ")
age = int(age_text)
print(f"Next year you will be {age + 1}")
```

**When you run it and type `9`, the TERMINAL shows:**

```text
How old are you? 9
Next year you will be 10
```

### Line by Line
- `age_text` holds text, e.g. the drawing `"9"`.
- `int(age_text)` turns `"9"` into the real number `9`.
- `age + 1` does maths → 10.
- `print(f"...")` — the little **`f`** before the quotes makes it an f-string.
  Now anything inside `{ }` is worked out and dropped into the sentence. So
  `{age + 1}` becomes `10`. **No `str()` needed — this is why f-strings are
  easier!**

### Slow Motion 🔬 — the "drawing of a number" problem
This is the single most important secret in beginner Python, so let's nail it:

When you type `9` at an `input()`, Python receives the CHARACTER "9" — a
drawing, a shape on the screen — not the QUANTITY nine. Try this experiment in
your head:

```text
"9" + "1"   ->  "91"   (two drawings glued side by side!)
 9  +  1    ->  10     (real numbers, real maths)
```

Same symbols, totally different results. `int(...)` is the converter machine:
drawing in, real number out. The name comes from *integer* — maths-speak for a
whole number.

And the f-string: `f"Next year you will be {age + 1}"` — the `f` switches on
the magic braces. Python sees `{age + 1}`, pauses the sentence, works out the
maths (9 + 1 = 10), converts the result to text, and stitches it into place.
One line, no glue, no `str()` headache. (The old way,
`"Next year: " + str(age + 1)`, still works — you'll see it in other people's
code — but f-strings are friendlier, so this course uses them.)

### Do It in VS Code 🛠️
1. Type the three lines, save (**Ctrl+S**), run (**▶**).
2. Click in the terminal, answer with a number, Enter.
3. Now run it again and type `nine` (letters!) — watch the red `ValueError`
   appear. Python is saying: "I can't turn the word 'nine' into a number."
   Read it, don't fear it. Run once more with digits.

### Your Turn
1. Ask the player for a number, `int()` it, and print it doubled using an
   f-string: `print(f"Double is {number * 2}")`.
2. Ask their name AND age, then print one f-string sentence using BOTH, like
   `print(f"{name} will be {age + 1} next year")`.
3. Try leaving out the `f` before the quotes and see what prints — what's
   different? (The braces stop working and print literally!)
4. Build a tiny "age machine": ask for an age, then print three f-string
   lines — their age in 10 years, their age doubled, and how old they were
   3 years ago. One input, three calculations.
5. Shortcut unlock: `age = int(input("Age? "))` asks AND converts in ONE line.
   Rewrite your age machine using it. (Read it inside-out: input first, then
   int wraps the answer.)

### 📸 Show Emrys
Paste your age machine's full conversation to Emrys — AND the `ValueError`
from the experiment, if you still have it. Emrys loves seeing errors that got
beaten. Tell Emrys in one sentence what `int()` does.

### Check Your Brain
- What kind of thing does `input()` always give you — text or number?
- What does `int()` do?
- In an f-string, what happens to whatever you put inside `{ }`?
- Why is an f-string easier than joining with `+` and `str()`?
- What error appears if someone types `nine` instead of `9`?

### More Examples
f-strings can hold as many `{ }` slots as you want:

```python
name = "Adwoa"
age = 10
print(f"{name} is {age} years old and in Class 4.")
```

Maths works right inside the slots:

```python
price = int(input("Price of one orange? "))
print(f"Three oranges cost {price * 3} cedis.")
print(f"Ten oranges cost {price * 10} cedis.")
```

See the difference between text "7" and number 7 with your own eyes:

```python
text_seven = "7"
real_seven = 7
print(text_seven + text_seven)   # 77  - text glues together!
print(real_seven + real_seven)   # 14  - numbers do real maths
```

That first one surprises everyone — text `"7" + "7"` GLUES into `"77"`. That's why `int()` matters so much for our game.

### Common Mistakes
- **Doing maths on raw input:** `age = input("Age? ")` then `age + 1` → `TypeError: can only concatenate str (not "int") to str`. **Fix:** convert first — `age = int(input("Age? "))`.
- **Forgetting the `f`:** `print("You are {age}")` literally shows `You are {age}` with the curly braces! **Fix:** put `f` before the quotes: `print(f"You are {age}")`.
- **int() on something that isn't a number:** if the player types `nine`, `int("nine")` crashes with `ValueError: invalid literal for int()`. (Lesson 20 teaches the polite fix — for now, type digits.)

### Level Up 🚀
Make a "future machine": ask the player's age, then print what year they'll turn 18, using an f-string with maths inside — `f"You will be 18 in the year {2026 + (18 - age)}"`. Test it on yourself. Did it get your year right?

---

## Lesson 8: Mini-Project — A Greeting Machine

### Big Idea
We combine printing, variables, and input into one small working program.

### Kid Meaning
Time to put our first tools together and build something that actually talks to a
person.

### Game Connection
This is practice for the real game loop: ask → store → use → respond.

### The Code
```python
print("Welcome to the Greeting Machine!")
name = input("What is your name? ")
age = int(input("How old are you? "))
print(f"Hello {name}!")
print(f"In 5 years you will be {age + 5}")
```

**A full run looks like this (with the player typing `Ama` and `9`):**

```text
Welcome to the Greeting Machine!
What is your name? Ama
How old are you? 9
Hello Ama!
In 5 years you will be 14
```

### Line by Line
- We `print` a welcome — every good program greets its user.
- We ask for the name (text) and store it. Names stay as text, so no `int()`.
- `int(input(...))` asks AND converts in one line — a neat shortcut. Read it
  inside-out: `input(...)` runs first and hands its text to `int(...)`.
- We greet them with an f-string, dropping `{name}` right into the sentence.
- `{age + 5}` does the little maths inside the f-string — no `str()` needed.

### Slow Motion 🔬 — you now own the 4 superpowers
Stop and look at what this tiny program uses. EVERYTHING from Part 1:

```text
Lesson 1+2  ->  print(...)            the computer speaks
Lesson 3    ->  name = ...            the computer remembers
Lesson 6    ->  input(...)            the computer listens
Lesson 7    ->  int(...) + f-strings  the computer calculates and reports
```

Speak, remember, listen, calculate. That's not a toy list — it's the same four
powers inside WhatsApp, games, and bank apps. They just stack thousands of
these together. You have the full starter kit now, and the Magic Number Game
ahead is built from exactly these four bricks.

Notice also the SHAPE of the program: greet → ask → ask → respond → respond.
Programs have a flow, like a conversation has a flow. Designing that flow is
the fun part of being a programmer.

### Do It in VS Code 🛠️
1. New file: `greeting_machine.py` — your first named PROJECT file. Save it
   next to your other files.
2. Type all five lines. Save (**Ctrl+S**), run (**▶**).
3. Answer both questions in the terminal. Read your machine's reply.
4. Run it twice more with different answers — same machine, different
   conversation every time. That's the power of variables!

### Your Turn
1. Build the Greeting Machine above and run it.
2. Add one more question of your own (favourite colour) and use it in a
   message, like `f"{colour} is a great colour, {name}!"` — two boxes in one
   sentence.
3. Add a maths line of your own invention using `{ }` — maybe the year they
   were born: `f"You were born around {2026 - age}"`. (Mind-blowing, right?)
4. Show a friend and let them try it. Don't touch the keyboard — watch them
   use YOUR software.

### 📸 Show Emrys
Paste a COMPLETE run of your upgraded Greeting Machine (all questions and
answers) to Emrys. This is your Part 1 graduation — Emrys will check all four
superpowers are working and officially promote you to Part 2: teaching the
computer to make choices. 🎓

### Check Your Brain
- Why do we wrap the age question in `int(...)` but not the name question?
- What does `int(input(...))` do in one line?
- What are the four superpowers, in your own words?

### More Examples
Your Greeting Machine can become anything. A compliment machine:

```python
print("THE COMPLIMENT MACHINE 3000")
name = input("Who needs cheering up? ")
print(f"{name}, you are doing GREAT today!")
print(f"Everyone says {name} works so hard!")
```

A mini maths quiz machine:

```python
print("Quick maths check!")
number = int(input("Give me any number: "))
print(f"Double:  {number * 2}")
print(f"Triple:  {number * 3}")
print(f"Squared: {number * number}")
```

A countdown machine using what the player gives:

```python
start = int(input("Count down from? "))
print(f"{start}...")
print(f"{start - 1}...")
print(f"{start - 2}...")
print("Time's up!")
```

### Common Mistakes
- **Mixing up the order:** trying to `print(f"Hello {name}")` BEFORE the `name = input(...)` line → `NameError`. The computer reads top to bottom; ask first, use after.
- **int() around the name:** `name = int(input("Your name? "))` crashes when someone types `Ama` — names are words, not numbers! Only convert things that should be numbers.
- **One bracket too few:** `age = int(input("Age? ")` → `SyntaxError: '(' was never closed`. Two opens need two closes: count them — `int(` and `input(` need `))`.

### Level Up 🚀
Combine everything from Part 1 into a "Registration Desk" for our future game: ask name AND age, then print a little ticket:

```
==== GAME TICKET ====
Player: Ama
Age:    10
Lucky entry number: 20   <- their age times 2!
=====================
```

Use `"=" * 21` to draw the lines — you'll meet this trick properly in Lesson 21.

---

# PART 2 — MAKING CHOICES

---

## Lesson 9: Making Decisions with if

### Big Idea
`if` lets the computer choose what to do based on a condition (something true or
false).

### Kid Meaning
"IF it is raining, take an umbrella." The computer checks, and only acts if the
condition is true.

### Game Connection
The heart of the game: IF your guess equals the secret number → you win!

### The Code
```python
number = 7
if number == 7:
    print("Lucky seven!")
```

**When you run it, the TERMINAL shows:**

```text
Lucky seven!
```

Now change the first line to `number = 3`, save, run again — the terminal
shows **nothing at all**. Silence! The computer checked, the answer was no, so
it skipped the indented line. You just watched a computer make a decision.

### Line by Line
- `if number == 7:` — check IF `number` is equal to 7. We use `==` (two
  equals) for "is equal to". (One `=` means "put into the box"; two `==`
  means "compare what's in the box".)
- The `:` colon at the end of the if-line is mandatory — it announces "the
  instructions for YES are coming next."
- The indented (spaced-in) line runs ONLY if the condition is true.
  Indentation (the spaces at the start) is how Python knows which lines
  belong to the `if`.

### Slow Motion 🔬 — how a computer "decides"
Until today, your programs ran every line, always, top to bottom. Boring
obedience. The `if` changes everything — now there are lines that MIGHT run:

1. Python reaches `if number == 7:` and asks a yes/no question: "is the value
   in `number` equal to 7?"
2. It opens the box, finds 7, compares: YES.
3. Because YES, it enters the indented block and runs it.
4. If the answer had been NO, it would JUMP over the indented block entirely,
   as if those lines didn't exist.

About that indentation: press **Tab** once (VS Code makes it 4 spaces). The
indented lines are "inside" the if — like things written inside a box on a
worksheet. When you stop indenting, you're back outside, in "always runs"
land:

```python
number = 3
if number == 7:
    print("Lucky!")        # inside the if  -> only when YES
print("Program finished")  # outside        -> ALWAYS runs
```

Run that — you'll see only `Program finished`. The membership of each line —
inside or outside — is decided purely by the spaces at the start. In Python,
**spaces have meaning**. This is THE most important formatting rule in the
whole language.

### Do It in VS Code 🛠️
1. Type the three lines. When you press Enter after the `:`, watch VS Code
   indent the next line for you automatically — it knows!
2. Save (**Ctrl+S**), run (**▶**): see `Lucky seven!`.
3. Change `number = 3`, save, run: silence (plus your outside line if you
   added one).
4. Try deleting the indentation before `print` and running — VS Code
   underlines it red and Python says `IndentationError: expected an indented
   block`. Put the Tab back. Error met, error beaten.

### Your Turn
1. Make a variable `score = 10`. Write an `if` that prints "Great score!" if
   score is equal to 10.
2. Change score to 5 and run again. Does the message still show? Why not?
3. Make a secret-password check: `password = input("Password? ")` then
   `if password == "banana":` print a welcome with TWO indented lines (a
   welcome and a bonus message). Test it with the right and wrong password.
4. Game preview: set `secret = 42` and `guess = int(input("Guess: "))`, then
   `if guess == secret:` print "CORRECT!" — that's the actual heart of the
   Magic Number Game, beating for the first time. Feel it!

### 📸 Show Emrys
Paste TWO runs of your password checker to Emrys — one with the correct
password, one wrong — so Emrys can see the `if` saying yes AND no. Bonus
respect: paste your guess-the-secret preview too.

### Check Your Brain
- What is the difference between `=` and `==`?
- Why are the spaces (indentation) before the print important?
- What happens to the indented lines when the condition is false?
- What punctuation must end every `if` line?

### More Examples
`if` can check text answers too, not just numbers:

```python
answer = input("What is the capital of Ghana? ")
if answer == "Accra":
    print("Correct! Well done!")
```

More than one line can live inside an `if` — everything indented belongs to it:

```python
age = int(input("How old are you? "))
if age >= 10:
    print("You are double digits!")
    print("That is a whole DECADE of you.")
print("This line prints for everyone - see, it's not indented.")
```

`>=` means "greater than or equal to". An `if` can also guard a surprise:

```python
password = input("Whisper the secret word: ")
if password == "banana":
    print("The treasure chest opens! 💰")
```

### Common Mistakes
- **One `=` in the check:** `if number = 7:` → `SyntaxError`. One `=` fills a box; two `==` compares. **Fix:** `if number == 7:`.
- **Forgetting the colon:** `if number == 7` → `SyntaxError: expected ':'`. The `:` is the doorway into the if-block.
- **Forgetting to indent:** writing the `print` at the left edge under an `if` → `IndentationError: expected an indented block`. Press Tab once — the spaces tell Python "this belongs to the if".

### Level Up 🚀
Make a "door code" program: the secret code is `4321`. Ask the player for the code (remember `int(...)`), and if it's exactly right, print a 3-line welcome with a treasure inside. Then try typing the wrong code — notice the program just ends quietly. Next lesson we'll teach it to answer back when the code is wrong!

---

## Lesson 10: if, else, and elif — More Choices

### Big Idea
`else` says what to do when the `if` is false; `elif` checks another condition.

### Kid Meaning
"IF it's hot, wear shorts. ELSE wear a jacket." `elif` is "or else, IF this other
thing..."

### Game Connection
The game says: IF guess is too high → "Too high"; ELIF too low → "Too low"; ELSE
→ "Correct!"

### The Code
```python
guess = 50
secret = 42
if guess > secret:
    print("Too high!")
elif guess < secret:
    print("Too low!")
else:
    print("Correct!")
```

**With `guess = 50`, the TERMINAL shows:**

```text
Too high!
```

One question asked, one answer chosen, the other two skipped. This eight-line
block IS the brain of the Magic Number Game — everything else we build is
just decoration around it.

### Line by Line
- `guess > secret` — is the guess bigger? `>` means "greater than". (Memory
  trick: the arrow opens toward the BIGGER side, like a crocodile mouth that
  always eats the bigger number. 🐊)
- `elif guess < secret:` — otherwise, is it smaller? `<` means "less than".
  `elif` is short for "else if" — "if not THAT, then is it THIS?"
- `else:` — if neither bigger nor smaller, it must be equal → correct! Notice
  `else` asks no question and has no condition: it's the catch-all for
  "none of the above".
- Only ONE of the three blocks ever runs. Never two, never zero.

### Slow Motion 🔬 — the decision ladder
Picture the if/elif/else as a ladder Python climbs from the top, stopping at
the FIRST rung that says YES:

```text
guess = 50, secret = 42

Rung 1:  if 50 > 42 ?      YES! -> print "Too high!" -> DONE, skip the rest
Rung 2:  (never even looked at)
Rung 3:  (never even looked at)
```

Now mentally run `guess = 42`:

```text
Rung 1:  if 42 > 42 ?      no  (42 is not bigger than itself)
Rung 2:  elif 42 < 42 ?    no  (not smaller either)
Rung 3:  else              -> print "Correct!"
```

That third case is beautiful: we never ask "is it equal?" — we don't need to!
If a number is not bigger and not smaller, equality is the only possibility
left. Programmers love this kind of "free" logic.

### Do It in VS Code 🛠️
1. Type the eight lines. Watch VS Code auto-indent after each `:` — and notice
   `elif`/`else` must line up with `if` (NOT indented), while their print
   lines ARE indented.
2. Save, run, confirm `Too high!`.
3. Edit → save → run three times: `guess = 42` (Correct!), `guess = 10`
   (Too low!), `guess = 99` (Too high!). Three runs, three different paths
   through the same code.

### Your Turn
1. Change `guess` to 42 and run — which message shows?
2. Change `guess` to 10, then to 99. Predict each result before running.
3. Make it interactive: replace `guess = 50` with
   `guess = int(input("Your guess: "))` and play it for real. One guess, real
   feedback — the game is being born in front of you!
4. Build a ladder of your own: ask for an age, then `if age < 6:` print
   "Nursery", `elif age < 12:` print "Primary", `else:` print "JHS or beyond".
   Test all three doors with ages 4, 9, and 14.

### 📸 Show Emrys
Paste three runs to Emrys — one "Too high!", one "Too low!", one "Correct!" —
so Emrys can see you've walked all three paths. Then tell Emrys in one
sentence why `else` needs no condition.

### Check Your Brain
- What does `>` mean? What does `<` mean?
- When does the `else` block run?
- How many of the three blocks run each time?
- Why don't we need to ask "is it equal?" anywhere?

### More Examples
A grader that turns marks into messages — `elif`s check in order, top to bottom:

```python
marks = int(input("Your test marks (out of 100): "))
if marks >= 80:
    print("Excellent! ⭐")
elif marks >= 50:
    print("Good - keep practising!")
else:
    print("Don't worry, we will revise together.")
```

A weather adviser:

```python
weather = input("Is it sunny, rainy, or cloudy? ")
if weather == "rainy":
    print("Take an umbrella!")
elif weather == "sunny":
    print("Wear a hat!")
else:
    print("Enjoy your day!")
```

You can chain MANY elifs — the computer stops at the FIRST true one:

```python
day = input("What day is it? ")
if day == "Saturday":
    print("Weekend! Time to play.")
elif day == "Sunday":
    print("Rest day - school tomorrow!")
elif day == "Friday":
    print("Almost the weekend...")
else:
    print("School day. Let's learn!")
```

### Common Mistakes
- **`elif` without an `if` first:** `elif` can never start the chain → `SyntaxError`. The chain is always `if` → (maybe some `elif`s) → (maybe one `else`).
- **Giving `else` a condition:** `else guess < 10:` → `SyntaxError`. `else` means "everything that's left" — it takes no condition, just `else:`.
- **Wrong order of checks:** in the grader, if you check `marks >= 50` FIRST, a mark of 90 prints "Good" and never reaches "Excellent" — because the computer stops at the first true check. Put the strongest check first.

### Level Up 🚀
Build "Hot or Cold" — the heart of next week's game: set `secret = 42`. Ask for a guess. Print "Boiling hot!" if it's exactly right, "Warm" if the guess is between 35 and 49, otherwise "Freezing cold!". Hint: you can write `if 35 <= guess <= 49:` — Python lets you check "between" exactly like maths class.

---

## Lesson 11: True and False (Booleans)

### Big Idea
A condition is always either **True** or **False** — these are special values.

### Kid Meaning
Like a light switch: on or off. Yes or no. Nothing in between.

### Game Connection
"Has the player guessed correctly?" is a yes/no fact the game checks every turn.

### The Code
```python
secret = 42
guess = 42
print(guess == secret)
print(guess > 100)
```

**When you run it, the TERMINAL shows:**

```text
True
False
```

The computer ANSWERED your questions — out loud! Every comparison secretly
produces one of these two values, and today you get to see them with your own
eyes.

### Line by Line
- `guess == secret` — the computer works this out as `True` (they're equal).
- `guess > 100` — this is `False` (42 is not over 100).
- `True` and `False` have no quotes — they are special built-in values, not
  words. (And the capital T and F matter: `true` ❌, `True` ✅.)

### Slow Motion 🔬 — the secret behind every if
Here's the curtain-lifting moment. When you wrote `if guess == secret:` in the
last lessons, Python actually did this:

1. Worked out `guess == secret` → got `True` or `False` (a *boolean* — named
   after George Boole, a mathematician who studied yes/no logic).
2. Handed that single value to `if`.
3. `if True:` → run the block. `if False:` → skip it.

So `if` never sees your comparison — it only ever sees a True or a False!
That means a boolean can live in a VARIABLE, travel around your program, and
be used later:

```python
is_winner = (guess == secret)   # the answer gets stored!
print(is_winner)                # True
if is_winner:
    print("We have a champion!")
```

`if is_winner:` reads almost like English. Naming your booleans `is_...` or
`has_...` is a real professional habit — it makes code read like sentences.

### Do It in VS Code 🛠️
1. Type the four lines, save, run. Confirm `True` then `False`.
2. Add `print(type(guess == secret))` and run — Python says
   `<class 'bool'>`. You just asked Python "what KIND of thing is this?" and
   it answered: a boolean.

### Your Turn
1. Print whether `10 > 3` (predict first).
2. Print whether `5 == 6`.
3. Make a variable `is_winner = (guess == secret)` and print it.
4. Boolean quiz machine — predict each, then run all five at once:
   ```python
   print(7 < 2)
   print(100 == 100)
   print(50 > 49)
   print("cat" == "cat")
   print("Cat" == "cat")
   ```
   That last one is sneaky: capitals make different words, so it's `False`!
5. Use your stored boolean: write `if is_winner:` with a celebration print
   under it. One variable driving a decision — that's real program design.

### 📸 Show Emrys
Paste your five-question quiz output to Emrys WITH your predictions, like
"I predicted True False True True True — got 4/5!" Emrys will explain any
one that surprised you.

### Check Your Brain
- What are the only two boolean values?
- Is `7 < 2` True or False?
- What does `if` actually receive — your comparison, or its answer?
- Why is `"Cat" == "cat"` False?

### More Examples
Booleans hide inside every check your game makes. You can store them in boxes like any value:

```python
age = 10
is_double_digits = age >= 10
print(is_double_digits)         # True
```

Text comparisons give booleans too:

```python
answer = "yes"
print(answer == "yes")          # True
print(answer == "no")           # False
```

You can combine checks with `and` / `or` — just like English:

```python
age = 10
has_ticket = True
print(age >= 8 and has_ticket)   # True - BOTH must be true
print(age >= 18 or has_ticket)   # True - at least ONE is true
```

### Common Mistakes
- **Quotes around True:** `is_winner = "True"` makes a *word*, not a boolean. The real ones have no quotes and a capital first letter: `True`, `False`.
- **Lowercase:** `true` → `NameError: name 'true' is not defined`. Python only knows `True` and `False` with capitals.
- **Confusing `=` and `==` again:** it sneaks back here! `print(guess = secret)` is an error; comparing is always `==`.

### Level Up 🚀
Truth detective: WITHOUT running it, write down True or False for each line — then run and check your answers like a test.

```python
print(10 > 5)
print(3 == 3)
print("cat" == "Cat")
print(7 != 7)
print(5 >= 5 and 2 < 1)
```

(Watch the third one — computers see `cat` and `Cat` as DIFFERENT because of the capital letter. That fact will matter in Lesson 22!)

---

## Lesson 12: Repeating with while Loops

### Big Idea
A `while` loop repeats lines again and again, as long as a condition stays true.

### Kid Meaning
"WHILE the music plays, keep dancing." When the music stops (condition false), you
stop.

### Game Connection
The game keeps asking for a guess WHILE you haven't found the number yet.

### The Code
```python
count = 1
while count <= 5:
    print(f"Count is {count}")
    count = count + 1
print("Done!")
```

**When you run it, the TERMINAL shows:**

```text
Count is 1
Count is 2
Count is 3
Count is 4
Count is 5
Done!
```

You wrote `print` ONCE — and got five lines. That's the magic of loops: write
a little, run a lot.

### Line by Line
- `while count <= 5:` — keep looping while count is 5 or less (`<=` means
  "less than or equal to").
- The indented lines are the loop's body — they run each time around.
- `count = count + 1` — VERY important: it moves the count up so the loop
  eventually stops. Without it, the loop would run forever!
- `print("Done!")` is not indented, so it's OUTSIDE the loop — it runs once,
  after the loop ends.

### Slow Motion 🔬 — one full lap at a time
A while loop is a racetrack with a gatekeeper at the entrance. Every lap,
the gatekeeper checks the condition before letting you in:

```text
Lap 1: count is 1.  Is 1 <= 5? YES -> print "Count is 1" -> count becomes 2
Lap 2: count is 2.  Is 2 <= 5? YES -> print "Count is 2" -> count becomes 3
Lap 3: count is 3.  Is 3 <= 5? YES -> print "Count is 3" -> count becomes 4
Lap 4: count is 4.  Is 4 <= 5? YES -> print "Count is 4" -> count becomes 5
Lap 5: count is 5.  Is 5 <= 5? YES -> print "Count is 5" -> count becomes 6
Lap 6: count is 6.  Is 6 <= 5? NO  -> loop OVER, jump to "Done!"
```

Tracing laps like this — slowly, on paper or out loud — is how professionals
debug loops to this day. Notice the three jobs every healthy loop needs:
**a starting value** (count = 1), **a condition** (count <= 5), and **a
change** (count + 1). Remove any one and the loop misbehaves.

The infinite loop you were warned about? Without `count = count + 1`, count
stays 1 forever, `1 <= 5` is forever YES, and the loop never ends — the
terminal floods with text. If it ever happens: **click in the terminal and
press Ctrl+C** (the universal STOP), or hit the trash-can icon. Every
programmer alive has done this. It's a rite of passage, not a disaster.

### Do It in VS Code 🛠️
1. Type the five lines — watch the indentation: two lines inside, "Done!"
   outside.
2. Save, run, count the five lines plus Done.
3. NOW, with your teacher's blessing: comment out the count line by putting
   `#` in front (`# count = count + 1`), save, run — meet the infinite loop —
   and stop it with **Ctrl+C** in the terminal. Remove the `#`, save, run,
   order restored. You've now survived the most famous bug in programming. 🏅

### Your Turn
1. Make a loop that counts from 1 to 10.
2. Make a loop that prints "Hello" three times.
3. Make a countdown: start at 5, loop `while rocket > 0:`, SUBTRACT 1 each
   lap, then print "LIFT OFF! 🚀" after the loop. (Trace it on paper first —
   which value never prints?)
4. Times-table machine: pick a number, and loop to print its table from
   `x 1` to `x 10` using an f-string like
   `print(f"7 x {count} = {7 * count}")`. Ten seconds of homework, forever. 😄

### 📸 Show Emrys
Paste your countdown output AND your times-table to Emrys. If you met the
infinite loop, tell Emrys how you stopped it — Emrys gives a special badge
for surviving that one.

### Check Your Brain
- What does a `while` loop do?
- Why must something change inside the loop?
- What are the loop's three jobs (start, ___, ___)?
- How do you stop a runaway loop in the terminal?

### More Examples
A rocket countdown — loops can count DOWN as well as up:

```python
count = 5
while count > 0:
    print(f"{count}...")
    count = count - 1
print("LIFT OFF! 🚀")
```

A loop that grows money — watch savings double each round:

```python
money = 1
while money < 100:
    print(f"You have {money} cedis")
    money = money * 2
print(f"Rich! You ended with {money} cedis")
```

Loops can also build a repeated picture:

```python
row = 1
while row <= 4:
    print("*" * row)    # 1 star, then 2, then 3, then 4
    row = row + 1
```

That last one prints a star triangle — `"*" * row` repeats the star `row` times.

### Common Mistakes
- **The forever loop:** forgetting `count = count + 1` means the condition never becomes false — the program runs forever! **Fix:** every `while` needs something inside that moves it toward stopping. (If it happens: click the STOP button, or press Ctrl+C in the terminal. Every coder has done this — it's a rite of passage!)
- **Moving the wrong way:** `count = count - 1` when the loop needs count to GROW — it runs forever too. Check your direction.
- **Indenting the after-line:** if `print("Done!")` is indented, it prints EVERY loop, not once at the end. Indentation decides what's inside.

### Level Up 🚀
The 12-times-table machine: use a loop to print `1 x 12 = 12` up to `12 x 12 = 144`, each line made with an f-string like `f"{n} x 12 = {n * 12}"`. Twelve lines of maths from four lines of code — THAT is why programmers love loops.

---

## Lesson 13: Loops + input Together

### Big Idea
We can ask the player something inside a loop, again and again.

### Kid Meaning
Like a teacher asking "Any more questions?" over and over until you say "no".

### Game Connection
This is the real shape of the game: keep asking for a guess inside a loop.

### The Code
```python
answer = ""
while answer != "stop":
    answer = input("Type something (or 'stop' to quit): ")
    print("You typed: " + answer)
print("You stopped the loop.")
```

**A real run looks like this:**

```text
Type something (or 'stop' to quit): hello
You typed: hello
Type something (or 'stop' to quit): banana
You typed: banana
Type something (or 'stop' to quit): stop
You typed: stop
You stopped the loop.
```

The program kept talking with you for as LONG AS YOU WANTED. The player —
not the programmer — decided when it ended. That's a huge upgrade.

### Line by Line
- `answer = ""` — start with empty text so the loop can begin. (The gatekeeper
  needs SOMETHING in the box to check — empty text isn't "stop", so we're in.)
- `while answer != "stop":` — keep going while the answer is NOT "stop". `!=`
  means "is not equal to" — the opposite of `==`.
- Inside, we ask again and store the new answer — each lap REPLACES what's in
  the `answer` box.
- When the player types `stop`, the condition becomes false at the next
  gate-check and the loop ends.

### Slow Motion 🔬 — the gate checks at the TOP
A subtle but important detail: the gatekeeper only checks when a lap BEGINS.
Trace what happens when you type `stop`:

```text
Lap 3 begins: answer is "banana".  "banana" != "stop"? YES -> enter
   - input asks... player types "stop" -> answer box now holds "stop"
   - print runs: "You typed: stop"   <- still inside the lap!
Lap 4 begins: "stop" != "stop"? NO -> loop over -> "You stopped the loop."
```

That's why `You typed: stop` still printed — the lap was already underway when
the box changed. The gate isn't checked mid-lap, only at the top. Knowing this
saves you from many "why did it run one extra time?!" mysteries.

This ask-inside-a-loop shape has a name — the **conversation loop** — and it
is EXACTLY how the Magic Number Game will keep asking for guesses, how ATMs
keep showing menus, and how chat apps wait for messages. Learn this shape
once, recognise it everywhere.

### Do It in VS Code 🛠️
1. Type the five lines — note which are inside (indented) and which outside.
2. Save, run, chat with your program. Type at least 3 things, then `stop`.
3. Run again and type `STOP` (capitals) — the loop does NOT stop! Why?
   Because `"STOP" != "stop"` is True (capitals matter, Lesson 11!). Type
   lowercase `stop` to exit. Remember this gotcha — we'll fix it properly
   later with `.lower()`.

### Your Turn
1. Build the loop above and run it. Type a few things, then `stop`.
2. Change the magic stop word from `stop` to `quit`.
3. Count how many times the player typed something: add `count = 0` before the
   loop, `count = count + 1` inside, and after the loop print
   `f"You typed {count} things!"`. (Two skills — counters and loops — now
   working together.)
4. Make an echo robot with attitude: instead of "You typed: ...", reply
   `f"{answer}?? How interesting!"` — suddenly it has personality.

### 📸 Show Emrys
Paste a full conversation with your counting loop to Emrys — including the
final count line. Did the count include the "stop" itself? Tell Emrys why
(hint: the gate-checks-at-the-top story).

### Check Your Brain
- What does `!=` mean?
- Why did we set `answer = ""` before the loop?
- Why does "You typed: stop" still print before the loop ends?
- Why doesn't typing `STOP` in capitals stop the loop?

### More Examples
A patient quiz that repeats the question until it's right — this is half of our game already:

```python
answer = ""
while answer != "Accra":
    answer = input("Capital of Ghana? ")
print("Correct! You may pass. 🎉")
```

A polite parrot that repeats whatever you say until you say goodbye:

```python
words = ""
while words != "bye":
    words = input("Say something: ")
    print(f"Polly says: {words}!")
print("Polly flies away. 🦜")
```

Add a counter to know how many tries it took (Lesson 5 + 13 together!):

```python
answer = ""
tries = 0
while answer != "python":
    answer = input("Which language are we learning? ")
    tries = tries + 1
print(f"Yes! And it only took you {tries} tries.")
```

### Common Mistakes
- **Starting box equals the stop word:** `answer = "stop"` before the loop → the condition is false immediately and the loop NEVER runs. Start with something different, like `""`.
- **Asking outside the loop:** putting `input(...)` before the `while` only asks ONCE — the loop then spins with the same old answer forever. The `input` must be INSIDE so each lap asks again.
- **Capital letters:** the player types `Stop` but your check is `!= "stop"` — they don't match, the loop keeps going! (You'll fix this like a pro in Lesson 22 with `.lower()`.)

### Level Up 🚀
Make a "guard at the gate": the guard keeps asking "What's the password?" until the player types `mango`. Count their tries. If they got it in 1 try, print "Suspiciously fast... 🤨" — otherwise welcome them in. You've now built the exact skeleton of the Magic Number Game!

---

## Lesson 14: Random Numbers

### Big Idea
The `random` tool lets the computer pick a surprise number we can't predict.

### Kid Meaning
Like rolling a dice or drawing a name from a hat — even the computer doesn't know
in advance.

### Game Connection
This is how the computer picks its SECRET number for you to guess.

### The Code
```python
import random
secret = random.randint(1, 100)
print(f"Secret picked! (Shhh, it's {secret})")
```

**When you run it, the TERMINAL might show:**

```text
Secret picked! (Shhh, it's 73)
```

Run it again: a different number. Again: different again! For the first time,
your program does something even YOU can't predict.

### Line by Line
- `import random` — bring in Python's random-number helper. We do this once,
  at the very top of the file.
- `random.randint(1, 100)` — pick a whole number from 1 to 100 (BOTH ends
  included — 1 can come out, and so can 100).
- We store it in `secret`. In the real game we will NOT print it — that would
  be cheating! Here we print it just to learn.

### Slow Motion 🔬 — what is `import`, really?
Python comes with a giant TOOLSHED of extra powers, kept outside your program
so it stays fast and tidy. Each toolbox in the shed has a name: `random`
(chance and dice), `time` (clocks and waiting), `math` (advanced maths)...

- `import random` — walk to the shed, fetch the toolbox named `random`, put
  it on your desk. Done once, at the top.
- `random.randint(1, 100)` — open that toolbox (`random`), take out the tool
  called `randint` (RANDom INTeger), and use it with your settings (1, 100).
  The dot means "look inside": *toolbox DOT tool*.

If you forget the import and use the tool anyway, Python says
`NameError: name 'random' is not defined` — "I don't see that toolbox on your
desk!" The fix is always the same: import at the top.

One mind-tickler: computers actually CAN'T do true randomness — they follow
instructions perfectly, remember? `randint` uses clever maths on things like
the exact microsecond of your click to produce numbers so unpredictable they
count as random. Computer scientists call it *pseudo-random* — "fake random
that's good enough to fool everyone."

### Do It in VS Code 🛠️
1. Type the three lines (import FIRST, at the top), save, run.
2. Run it five times in a row — collect five different secrets. (Same number
   twice in a row is possible and fair, like rolling doubles with dice!)
3. Delete the import line, save, run — meet the `NameError`. Put it back.
   Another error met, another error beaten.

### Your Turn
1. Pick a random number from 1 to 6 (like a dice) and print it. Run it 5
   times — different each time?
2. Pick a random number from 1 to 10.
3. Why is `random` perfect for a guessing game? (Say it out loud: even the
   PROGRAMMER can't cheat!)
4. Build a two-dice roller: roll two `randint(1, 6)` into `die1` and `die2`,
   then print `f"You rolled {die1} and {die2} — total {die1 + die2}!"`.
   Ludo night will never be the same.
5. Make a coin flipper: `flip = random.randint(1, 2)`, then an if/else prints
   "HEADS" or "TAILS". Run it ten times and tally the results — roughly half
   and half?

### 📸 Show Emrys
Paste your dice roller AND coin flipper outputs to Emrys (run each a few
times). Tell Emrys your heads-vs-tails tally — Emrys may explain why 7-3 in
ten flips is still perfectly fair randomness.

### Check Your Brain
- What does `random.randint(1, 100)` give you?
- Why must we `import random` first?
- What does the dot in `random.randint` mean?
- Can 100 itself come out of `randint(1, 100)`?

### More Examples
Roll two dice at once — like a board game:

```python
import random
die1 = random.randint(1, 6)
die2 = random.randint(1, 6)
print(f"You rolled {die1} and {die2} - total {die1 + die2}!")
```

A coin flip using an `if` (random + decisions = instant games):

```python
import random
coin = random.randint(1, 2)
if coin == 1:
    print("HEADS")
else:
    print("TAILS")
```

The computer can even pick a random word from a list using `random.choice` — a sneak peek of something Class 5 uses a lot:

```python
import random
prize = random.choice(["sticker", "pencil", "high five", "song"])
print(f"Today's lucky prize: a {prize}!")
```

### Common Mistakes
- **Forgetting the import:** using `random.randint(...)` without `import random` at the top → `NameError: name 'random' is not defined`. The import is like borrowing the dice from the cupboard — you must fetch it before rolling.
- **Spelling it `randInt` or `Randint`:** Python is exact: it's `randint`, all lowercase.
- **Thinking the same number is a bug:** rolling a 4 twice in a row is normal — real dice do that too! Random means *any* number can come up, even repeats.

### Level Up 🚀
Build a "weather fortune teller": roll `random.randint(1, 3)`. 1 → "Sunny tomorrow ☀️", 2 → "Rain is coming 🌧", 3 → "Harmattan winds! 🌬". Run it three mornings in a row this week — keep score of how often your program was actually right. (That's data collection — real scientist behaviour!)

---

## Lesson 15: Functions — Reusable Machines

### Big Idea
A function is a named machine that does a job whenever we call its name.

### Kid Meaning
Like a kettle: you don't rebuild it each time — you just press the button. A
function is code you can re-use by name.

### Game Connection
We can make a `cheer()` function that celebrates the player, and call it whenever
they win.

### The Code
```python
def cheer():
    print("Well done!")
    print("You are a star!")

cheer()
cheer()
```

**When you run it, the TERMINAL shows:**

```text
Well done!
You are a star!
Well done!
You are a star!
```

Two prints written, four lines shown — because the machine ran twice.

### Line by Line
- `def cheer():` — `def` means "define a machine called cheer". Note the empty
  brackets `()` and the colon `:` — both required.
- The indented lines are the machine's job — what it does when switched on.
- `cheer()` — press the button: it runs both prints. We called it twice, so it
  ran twice.

### Slow Motion 🔬 — defining is NOT running
Here's the part that surprises everyone. When Python reads the `def` block, it
does **NOTHING visible**. No printing. It just *memorises the recipe*:

```text
Python reads:  def cheer(): ...     -> "Noted. A machine called cheer exists.
                                        I'll remember what it does."
Python reads:  cheer()              -> "Ah, RUN it!" -> Well done! / You are a star!
Python reads:  cheer()              -> runs it again
```

Two separate moments, just like writing vs running a file (Lesson 2):
**defining** stores the recipe, **calling** cooks it. A function nobody calls
never runs at all — a recipe nobody cooks.

Why bother? Three professional reasons:
1. **Write once, use everywhere** — fix a typo in the function, and EVERY call
   gets the fix instantly.
2. **Names that explain themselves** — `cheer()` tells you what it does
   without reading its insides.
3. **Programs become Lego** — big apps are hundreds of small named machines
   snapped together. You're learning the snapping today.

And: you've ALREADY been calling functions all course! `print()`, `input()`,
`int()`, `random.randint()` — all machines someone else defined. Today you
built your own. Welcome to the makers' side.

### Do It in VS Code 🛠️
1. Type the function (watch the auto-indent after `:`), then a blank line,
   then the two calls — calls start at the LEFT edge, not indented.
2. Save, run — count four lines.
3. Delete both calls, save, run: total silence. The recipe exists but nobody
   cooked it. Put one call back.
4. Add a third `cheer()` — six lines now. One machine, any number of presses.

### Your Turn
1. Make a function `welcome()` that prints a two-line welcome message.
2. Call it.
3. Make a function `goodbye()` and call it at the end of a program.
4. Build a `drumroll()` function that prints "DRRRR..." three times, and use
   it before announcing anything dramatic:
   `drumroll()` then `print("...the winner is YOU!")`.
5. Order experiment: try CALLING `welcome()` ABOVE its `def` block, save,
   run — `NameError`! Python reads top-to-bottom and hadn't memorised the
   recipe yet. Rule learned: **define first, call after.** Fix it back.

### 📸 Show Emrys
Paste your program with at least two functions and their output to Emrys.
Tell Emrys which line DEFINES and which line CALLS — if you can say that
clearly, you've truly got it.

### Check Your Brain
- What word defines a function?
- What does it mean to "call" a function?
- What does Python do when it reads a `def` block — run it or remember it?
- Name two functions you'd already used before today without knowing it.

### More Examples
A drum machine — define once, play many times:

```python
def drum_roll():
    print("Brrrrrrrr...")
    print("BOOM! 🥁")

drum_roll()
drum_roll()
drum_roll()
```

Functions can use loops INSIDE them — your tools combine:

```python
def count_to_three():
    n = 1
    while n <= 3:
        print(n)
        n = n + 1

count_to_three()
```

A program can have several functions, like a toolbox with many tools:

```python
def morning():
    print("Good morning! Time for school.")

def evening():
    print("Good evening! Time for homework.")

morning()
evening()
morning()
```

### Common Mistakes
- **Defining but never calling:** you write `def cheer():` and the prints... and nothing shows when you run it! Defining builds the machine; only `cheer()` presses the button.
- **Calling before defining:** `cheer()` ABOVE the `def cheer():` lines → `NameError`. Python reads top to bottom — build the machine first, press the button after.
- **Forgetting the brackets when calling:** writing just `cheer` (no `()`) does nothing visible. The `()` is the actual button-press.

### Level Up 🚀
Make a "school bell" program: a function `bell()` that prints "RING RING RING! 🔔". Then call it three times with a print between each, like "Time for maths", "Time for break", "Time for Python!". One machine, three moments — feel how much typing the function saved you.

---

## Lesson 16: Functions That Take Information

### Big Idea
Functions can accept inputs (called parameters) so they do their job with
different values.

### Kid Meaning
A toaster works on whatever bread you give it. A function works on whatever value
you hand it.

### Game Connection
A `greet(name)` function can welcome ANY player by name, not just one.

### The Code
```python
def greet(name):
    print(f"Hello {name}! Welcome to the game.")

greet("Akua")
greet("Yaw")
```

**When you run it, the TERMINAL shows:**

```text
Hello Akua! Welcome to the game.
Hello Yaw! Welcome to the game.
```

ONE machine, TWO different outputs — because we fed it different ingredients.

### Line by Line
- `def greet(name):` — this machine needs one ingredient: a `name`. The word
  in the brackets is called a **parameter** — an ingredient slot.
- Inside, `name` stands for whatever we hand over — it's a temporary variable
  that exists only while the machine runs.
- `greet("Akua")` — run it with "Akua". Then again with "Yaw". The value you
  hand over is called an **argument** — the actual ingredient.

### Slow Motion 🔬 — how the ingredient travels
Watch the journey of "Akua" through the machine, step by step:

```text
1. Python reads greet("Akua")
2. It finds the greet recipe it memorised earlier
3. It pours "Akua" into the slot called name      <- name = "Akua" happens invisibly!
4. It runs the body: print(f"Hello {name}!...")   <- {name} is "Akua" right now
5. Output: Hello Akua! Welcome to the game.
6. Machine finishes; the temporary name box vanishes
7. Next call pours "Yaw" in -> same steps, new result
```

Think of a toaster: the toaster (function) stays the same; the bread
(argument) changes; the slot (parameter) is where bread goes. You don't build
a new toaster for every slice — and you don't write a new print for every
player. THIS is why functions with parameters are the most useful idea in
programming: one recipe, infinite variations.

The remote-control test: parameters even work with variables and maths —
`greet(input("Who are you? "))` pipes the player's typed name straight into
the machine!

### Do It in VS Code 🛠️
1. Type the function and the two calls. Save, run, confirm both greetings.
2. Add a third call with YOUR name.
3. Try calling `greet()` with EMPTY brackets — Python refuses:
   `TypeError: greet() missing 1 required positional argument: 'name'`.
   The machine won't run without its ingredient. Give it one.

### Your Turn
1. Make a function `double(number)` that prints the number times 2.
2. Call it with 5, then with 50.
3. Make a `cheer(name)` that says "Well done, NAME!" using the player's name.
4. Two-slot machine: `def introduce(name, age):` printing
   `f"{name} is {age} years old"`. Call it twice with different people. (Two
   parameters = two ingredients, in order: first goes to first slot.)
5. Connect to input: ask the player's name with `input`, then `cheer` them
   with it. Input → function → output: a full pipeline, built by you.

### 📸 Show Emrys
Paste your `double`, `cheer`, and `introduce` outputs to Emrys. Then answer
Emrys's favourite quiz: in `greet("Akua")`, which is the parameter and which
is the argument?

### Check Your Brain
- What is a parameter? What is an argument?
- Why is `greet(name)` better than writing a new print for every player?
- What happens to the `name` box when the machine finishes?
- In `introduce("Ama", 9)`, which slot does 9 land in?

### More Examples
A function can take a NUMBER and work with it:

```python
def birthday(age):
    print(f"Happy birthday! Now you are {age}! 🎂")
    print(f"Next year you'll be {age + 1}.")

birthday(9)
birthday(10)
```

A function can take TWO things at once:

```python
def add(a, b):
    print(f"{a} + {b} = {a + b}")

add(3, 4)
add(100, 250)
```

Mix a parameter with a loop — a chant machine for any name and any count:

```python
def chant(name, times):
    count = 0
    while count < times:
        print(f"{name}! ", end="")
        count = count + 1
    print()

chant("Ghana", 3)     # Ghana! Ghana! Ghana!
```

(`end=""` is a tiny trick that keeps the prints on ONE line — try removing it to see the difference.)

### Common Mistakes
- **Calling with nothing:** `greet()` when the function needs a name → `TypeError: greet() missing 1 required positional argument: 'name'`. The machine needs its ingredient!
- **Wrong order with two parameters:** `add(b, a)` style mix-ups don't error, but give the wrong story. Order matters: first value goes into the first parameter.
- **Using the parameter outside the function:** trying `print(name)` at the bottom of the file → `NameError`. Parameters only live INSIDE their function — like ingredients that exist only in the kitchen.

### Level Up 🚀
Write `times_table(number)` that prints that number's times table from 1 to 12 using a loop. Then call `times_table(7)` and `times_table(9)`. Two complete tables from ONE machine — show your teacher; this is genuinely how real software is built.

---

# PART 3 — BUILDING THE GAME

---

## Lesson 17: The Secret Number and the First Guess

### Big Idea
We start the real game: pick a secret, then take one guess and compare it.

### Kid Meaning
Now we glue our tools together into the beginning of a real game.

### Game Connection
This is the opening of the Magic Number Game.

### The Code
```python
import random

secret = random.randint(1, 100)
print("I am thinking of a number between 1 and 100.")

guess = int(input("Your guess: "))
if guess == secret:
    print("Amazing! First try!")
elif guess > secret:
    print("Too high!")
else:
    print("Too low!")
```

**A real run might look like:**

```text
I am thinking of a number between 1 and 100.
Your guess: 50
Too high!
```

The computer is HIDING something from you and judging your guess. That's a
real game — and you built it.

### Line by Line
- `import random` then pick the `secret` (we do NOT print it — no cheating!).
  The secret sits invisibly in memory; only the comparisons reveal clues.
- Ask for a guess and `int()` it — the guess must be a real number to compare
  against the secret.
- Compare with `if / elif / else` — the decision ladder from Lesson 10, now
  with a real job.

### Slow Motion 🔬 — your lessons, assembled
This is the moment the bricks become a building. Label each line with the
lesson that taught it:

```text
import random                       <- Lesson 14 (toolboxes)
secret = random.randint(1, 100)     <- Lesson 14 + Lesson 3 (variables)
print("I am thinking...")           <- Lesson 1 (print)
guess = int(input("Your guess: "))  <- Lessons 6 + 7 (input + int)
if guess == secret:                 <- Lessons 9-11 (decisions, ==)
elif guess > secret:                <- Lesson 10 (the ladder)
else:                               <- Lesson 10
```

NOTHING in this game is new. Every single line is a skill you already own —
arranged in a new order. That's the deepest secret of programming: big things
are small things, combined. When you see an app with thousands of features,
it's this same trick at giant scale.

One design detail worth noticing: the program picks the secret BEFORE asking
for your guess. Order matters — you can't compare against a secret that
doesn't exist yet. Programs are stories; events must happen in sequence.

### Do It in VS Code 🛠️
1. New file: `number_game.py` — THE project file. From now on, this game grows
   inside it, lesson by lesson, until Lesson 24.
2. Type the whole program. Save (**Ctrl+S**), run (**▶**).
3. Play three rounds (run it three times). Score any "Amazing!"?

### Your Turn
1. Build this and play it a few times. Can you win on the first try? (It's
   hard — about a 1-in-100 chance. That's WHY we add loops next lesson!)
2. Change the range to 1–20 to make it easier for testing. (Two places to
   think about: the `randint` AND the welcome message — keep them telling the
   same story!)
3. Add a fourth message of pure style: after the if/elif/else, print
   `f"(My secret was {secret} — see you next round!)"` — revealing the answer
   AFTER judging is fair play and makes losing less sour.

### 📸 Show Emrys
Paste a full round to Emrys — welcome, your guess, and the verdict. Tell Emrys
which lesson number each line of your game came from (the Slow Motion table
helps). Proving you know WHERE each brick came from is what makes you a
builder, not a copier.

### Check Your Brain
- Why don't we print the secret number before the guess?
- Which earlier lessons does this combine? (Name at least four.)
- Why must the secret be picked before the guess is asked?

### More Examples
While testing, coders often add a secret "debug" line — print the answer ON PURPOSE, then remove it before anyone plays:

```python
import random

secret = random.randint(1, 20)
print(f"(debug: secret is {secret})")   # remove me before showing friends!

guess = int(input("Your guess (1-20): "))
if guess == secret:
    print("Amazing!")
elif guess > secret:
    print("Too high!")
else:
    print("Too low!")
```

Tell the player HOW FAR off they were — a kinder single-guess game:

```python
import random

secret = random.randint(1, 10)
guess = int(input("Guess 1-10: "))
distance = secret - guess
if distance == 0:
    print("PERFECT!")
else:
    print(f"Missed! The number was {secret}.")
```

### Common Mistakes
- **Printing the secret in the real game:** fun for testing, but it ruins the game — make removing the debug line part of finishing.
- **Forgetting `int(...)` on the guess:** then `guess > secret` compares TEXT with a NUMBER → `TypeError: '>' not supported between instances of 'str' and 'int'`. This is the #1 game-building error — now you know exactly what it means!
- **`import random` in the middle:** it works at the top only ONCE per file; keep all imports as the very first lines, like packing your bag before the trip.

### Level Up 🚀
A "warmer or colder" single guess: after a wrong guess, also print whether they were within 10 ("So close — you can almost touch it!") or far ("Miles away! ❄️"). Hint: `abs(guess - secret)` gives the distance ignoring minus signs. You're now writing game feel — what designers call "juice".

---

## Lesson 18: Keep Guessing with a Loop

### Big Idea
Wrap the guessing in a `while` loop so the player keeps trying until correct.

### Kid Meaning
One guess isn't a game. Now we let the player try again and again until they win.

### Game Connection
This turns our single guess into the real, replayable game.

### The Code
```python
import random

secret = random.randint(1, 100)
guess = 0

while guess != secret:
    guess = int(input("Your guess: "))
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")

print(f"You got it! The number was {secret}")
```

**A real game (secret was 42) plays like this:**

```text
Your guess: 50
Too high!
Your guess: 25
Too low!
Your guess: 40
Too low!
Your guess: 42
You got it! The number was 42
```

THE GAME LIVES. It answers back, it keeps going, it ends in victory. This is
the lesson where students gasp.

### Line by Line
- `guess = 0` — a starting value so the loop's gatekeeper has something to
  check (and 0 can never be the secret in 1–100, so the loop always begins).
- `while guess != secret:` — keep looping AS LONG AS the guess is wrong. The
  conversation loop from Lesson 13, now powering a game.
- Inside: ask, then say too high or too low — the brain from Lesson 17, now
  running once per lap.
- When correct, the `while` condition becomes false at the next gate-check →
  loop ends → the celebration line (outside the loop) finally runs.

### Slow Motion 🔬 — why there's no "Correct!" inside
Sharp eyes noticed: the if/elif has no "Correct!" branch anymore. Watch why,
lap by lap (secret = 42):

```text
Lap 1: gate: 0 != 42? YES, enter -> guess becomes 50 -> "Too high!"
Lap 2: gate: 50 != 42? YES, enter -> guess becomes 25 -> "Too low!"
Lap 3: gate: 25 != 42? YES, enter -> guess becomes 42 -> (not >, not <... nothing prints)
Lap 4: gate: 42 != 42? NO -> loop OVER
       -> "You got it! The number was 42"
```

The winning itself is what KILLS the loop — so the line right after the loop
can only ever be reached by a winner. The loop's exit IS the victory door.
This is elegant program design: instead of checking "did they win?" inside,
we let the loop's own condition do that job for free.

Also notice what happens to `guess` each lap: the same box is refilled with
each new guess (Lesson 3 — one label, latest value). The whole game runs on
just TWO variables.

### Do It in VS Code 🛠️
1. Update `number_game.py` to this version. Mind the indentation: four lines
   inside the loop, the celebration OUTSIDE (left edge).
2. Save, run, and PLAY TO THE WIN. However many guesses it takes.
3. Play again with the smart strategy: always guess the MIDDLE of what's
   possible (50 → 25 or 75 → ...). Count your guesses. Seven or fewer is
   mathematically guaranteed — this strategy has a famous name, *binary
   search*, and it's taught in university. You just used it in Class 4.

### Your Turn
1. Build this and play until you win. Feels like a real game now!
2. Notice we removed the "Correct!" from inside — why can the win message live
   after the loop instead? (Say the answer out loud — the Slow Motion table
   has it.)
3. Challenge a classmate: they pick the strategy (random guesses vs
   halve-the-middle) — who wins in fewer tries?

### 📸 Show Emrys
Paste your full winning game to Emrys — every guess, every clue, the victory
line. Tell Emrys how many guesses you took and whether you used the
halving strategy. Emrys keeps an eye out for 7-or-under wins. 🏆

### Check Your Brain
- What makes the loop finally stop?
- Why did we set `guess = 0` at the start?
- Why can the win message live AFTER the loop?
- What's the guaranteed-win strategy called, and how does it work?

### More Examples
The same loop pattern works for a WORD game too — same skeleton, different skin:

```python
secret_word = "mango"
guess = ""
while guess != secret_word:
    guess = input("Guess the fruit I'm thinking of: ")
print("Yes! Sweet, juicy mango! 🥭")
```

Make the range easy to change by keeping it in variables at the top — change ONE line to make the game easier or harder:

```python
import random

lowest = 1
highest = 20    # change to 100 for hard mode!

secret = random.randint(lowest, highest)
guess = 0
while guess != secret:
    guess = int(input(f"Guess ({lowest}-{highest}): "))
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")
print("You found it!")
```

### Common Mistakes
- **New secret every lap:** putting `secret = random.randint(...)` INSIDE the while loop means the answer CHANGES after every guess — an impossible, maddening game! The secret must be picked once, BEFORE the loop.
- **Hints flipped:** writing "Too high!" under `guess < secret` confuses every player. Read it out loud to check: "if the guess is bigger than the secret… it's too HIGH."
- **Win message inside the loop:** if `print("You got it!")` is indented into the loop, it never prints (the loop ends the moment the guess is right). After-the-loop lines start at the left edge.

### Level Up 🚀
Add a "give up" escape: if the player types `0`, stop the game and reveal the secret. Hint: right after reading the guess, check `if guess == 0:` then print the reveal and use `break` — a new word that means "smash out of the loop right now". You just learned a tool most adults find on page 200 of Python books!

---

## Lesson 19: Counting the Guesses

### Big Idea
Add a counter that goes up by one each guess, then show the total.

### Kid Meaning
We keep a tally, like counting how many throws to hit the target.

### Game Connection
Players love a score — "You did it in 6 guesses!" makes them want to beat it.

### The Code
```python
import random

secret = random.randint(1, 100)
guess = 0
tries = 0

while guess != secret:
    guess = int(input("Your guess: "))
    tries = tries + 1
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")

print(f"You got it in {tries} tries!")
```

**The end of a game now looks like:**

```text
Your guess: 42
You got it in 4 tries!
```

A score! Suddenly there's something to BEAT. Watch what happens to your
classmates the moment a number appears — everyone wants a rematch. That's
game design psychology, and you just used it.

### Line by Line
- `tries = 0` — start the counter BEFORE the loop (a counter must be born
  before it can grow — Lesson 5).
- `tries = tries + 1` — add one for every guess, INSIDE the loop, right after
  the input. Each lap = each guess = one tick.
- At the end we print the total with an f-string — `{tries}` drops the number
  into the sentence.

### Slow Motion 🔬 — placement is everything
The counter line could physically go in four places. Watch how only one is
right:

```text
BEFORE the loop:        counts... once, ever.   Final answer: always 1. ❌
INSIDE, after input:    one tick per guess.     CORRECT! ✅
INSIDE, after the ifs:  also works — same lap.  ✅ (style choice)
AFTER the loop:         ticks once at the end.  Always says 1. ❌
```

WHERE a line lives decides WHEN and HOW OFTEN it runs. Same line, different
homes, completely different programs. This placement-thinking is the #1 skill
that separates "I can type code" from "I can build programs."

Three variables now run your game, each with one clear job:
`secret` (never changes after birth), `guess` (refilled every lap),
`tries` (grows by one every lap). Give each variable ONE job and a name that
says it — your future self will thank you.

### Do It in VS Code 🛠️
1. Add the two `tries` lines to `number_game.py` — one before the loop, one
   inside it. Update the final print to the f-string with `{tries}`.
2. Save, run, play to the win, read your score.
3. Experiment: move `tries = tries + 1` to ABOVE the input line, save, play.
   Same count? (Yes — anywhere inside the lap works once per lap. Placement
   within the lap is style; inside-vs-outside is correctness!)

### Your Turn
1. Add the counter and play. How few tries can you manage?
2. Add a message: if `tries` is less than 8, print "You're a guessing genius!"
   (use an `if` after the loop).
3. Personal best tracker (paper edition): play three full games, write down
   each score, circle your best. Next lesson block we'll teach the GAME to
   remember things like this.
4. Stretch: change the final line to also reveal the secret —
   `f"You got it in {tries} tries! The number was {secret}."` Two boxes, one
   sentence.

### 📸 Show Emrys
Paste your full game (all guesses + the score line) to Emrys. Report your best
score out of three games — Emrys is keeping a class leaderboard in spirit.
Under 7 with the halving strategy? Tell Emrys; that's the certified-genius
zone. 🧠

### Check Your Brain
- Where must `tries = tries + 1` go — inside or outside the loop? Why?
- Why is an f-string easier here than joining with `+` and `str()`?
- What are the three variables in the game, and what is each one's single job?

### More Examples
Show the try number AS they play — players love seeing the count tick up:

```python
while guess != secret:
    guess = int(input(f"Try #{tries + 1} - your guess: "))
    tries = tries + 1
```

Give the player a guess BUDGET — a limited number of tries makes it exciting:

```python
import random

secret = random.randint(1, 20)
tries = 0
guess = 0

while guess != secret and tries < 5:
    guess = int(input("Your guess: "))
    tries = tries + 1
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")

if guess == secret:
    print(f"You win in {tries} tries! 🏆")
else:
    print(f"Out of tries! It was {secret}.")
```

Notice the new trick: `while guess != secret and tries < 5` — the loop continues only while BOTH things are true (Lesson 11's `and`!).

### Common Mistakes
- **Counter outside the loop:** `tries = tries + 1` after the loop counts… once, ever. Inside the loop = counts every guess.
- **Resetting inside the loop:** `tries = 0` INSIDE the while wipes the count every lap — final answer is always 1. Starting values go BEFORE the loop.
- **Counting bad input:** later, when you add letter-checking (Lesson 20), make sure `tries` only counts real number guesses — count AFTER the safety check passes.

### Level Up 🚀
A best-score memory: add `best = 999` before the play-again loop you'll build in Lesson 22. After each win, check `if tries < best:` then `best = tries` and print "NEW RECORD! 🎉". You're now tracking a high score — the feature that makes players come back.

---

## Lesson 20: Being Kind to Wrong Typing

### Big Idea
Players sometimes type letters by mistake; we can guide them instead of crashing.

### Kid Meaning
If someone types "five" instead of "5", a kind game says "please type a number"
rather than breaking.

### Game Connection
A polished game doesn't crash — it helps the player.

### The Code
```python
guess_text = input("Your guess: ")
if guess_text.isdigit():
    guess = int(guess_text)
    print("Thanks! You guessed " + str(guess))
else:
    print("Please type a number, like 42.")
```

**Two runs, two behaviours:**

```text
Your guess: 42
Thanks! You guessed 42
```

```text
Your guess: hello
Please type a number, like 42.
```

No red error. No crash. The program PROTECTED itself — like a goalkeeper
catching a bad ball instead of letting it smash the net.

### Line by Line
- `guess_text.isdigit()` — asks the text "are you made ONLY of digits?" and
  gets True or False (a boolean — Lesson 11 paying off!). `"42"` → True.
  `"hello"` → False. `"4x2"` → False too — ONE letter spoils it.
- If True, it's safe to `int()` it — no surprise ValueError possible.
- If False (they typed letters), we politely guide them instead of crashing.

### Slow Motion 🔬 — check BEFORE you convert
Remember Lesson 7's experiment: `int("nine")` explodes with `ValueError`. In
your own practice that's fine — read the error, fix, rerun. But imagine your
little cousin playing your game, typing "fifty", and the whole game DIES with
red text. Heartbreaking!

The professional rule: **never trust input — check it first.** The pattern is
called *validation*, and it reads like airport security:

```text
1. Receive the text       (input)
2. Inspect it             (.isdigit() -> True/False)
3. Safe? -> convert & continue    Suspicious? -> reject politely & re-ask
```

`.isdigit()` is something the TEXT ITSELF can do — notice the dot:
`guess_text.isdigit()`, like `random.randint` — "ask the thing for one of its
own tricks." Text has many built-in tricks; you'll meet `.lower()` soon.

### Using it inside the game (the safe pattern)
Here is how the check fits INSIDE the guessing loop. If the player types
letters, we say so and use `continue`, which means "skip the rest and ask
again":

```python
while guess != secret:
    guess_text = input("Your guess: ")
    if not guess_text.isdigit():
        print("Please type a number, like 42.")
        continue          # go back to the top of the loop and ask again
    guess = int(guess_text)
    tries = tries + 1
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")
```

- `if not guess_text.isdigit():` — `not` flips True/False, so this means "if
  it is NOT all digits". Reads like English!
- `continue` — jump straight back to the loop's gate (don't run the rest of
  this lap). The player gets asked again, and the game never crashes.
- Sharp detail: because `continue` skips `tries = tries + 1`, typo laps don't
  count against the player's score. Kind AND fair.

### Do It in VS Code 🛠️
1. Try the small top version in a practice file first: run twice — once
   typing `42`, once `hello`.
2. Now upgrade `number_game.py` with the safe loop pattern.
3. The crash test: run the game and type `abc`, `4x2`, an EMPTY Enter, then
   a real guess. The game should sail through all of it, politely re-asking.
   If it survives, your game is officially crash-proof.

### Your Turn
1. Try the small code at the top; type `42`, then type `hello`. See the
   difference.
2. Copy the safe pattern into your game loop. Test it by typing `abc` — the
   game should politely ask again instead of crashing.
3. Make the rejection message friendlier and YOURS — maybe
   `"Numbers only, champion! Try something like 50."` Kind software has a
   personality.
4. Think like a tester: what's the WEIRDEST thing someone could type at your
   game? Try it. (Spaces? Emoji? A minus number? `-5` fails `.isdigit()` —
   the minus sign isn't a digit — so your goalkeeper catches that too!)

### 📸 Show Emrys
Paste a run showing your game surviving at least two bad inputs and then
winning. That survival is the proof. Tell Emrys your weirdest test input —
Emrys collects those. 😄

### Check Your Brain
- What does `.isdigit()` tell you?
- What does `not` do to True or False?
- What does `continue` do inside a loop?
- Why doesn't a typo lap increase `tries` in our pattern?

### More Examples
See `.isdigit()` think — run this truth-table on different inputs:

```python
print("42".isdigit())      # True
print("hello".isdigit())   # False
print("4 2".isdigit())     # False - the space ruins it
print("".isdigit())        # False - empty is not a number
```

The same kindness works anywhere players type numbers — an age checker:

```python
age_text = input("How old are you? ")
if age_text.isdigit():
    age = int(age_text)
    print(f"Great! {age} is a wonderful age.")
else:
    print("Numbers only, please - like 9 or 10.")
```

Keep asking until the typing is good — a loop that only lets numbers through:

```python
number_text = ""
while not number_text.isdigit():
    number_text = input("Type a number: ")
number = int(number_text)
print(f"Thank you! You typed {number}.")
```

### Common Mistakes
- **`int()` first, check second:** `int(guess_text)` BEFORE `.isdigit()` defeats the whole point — the crash happens before the check! Always check, THEN convert.
- **`.isdigit` without brackets:** `if guess_text.isdigit:` (no `()`) is always counted as True — silently wrong! The brackets actually ASK the question: `.isdigit()`.
- **`continue` outside a loop:** using it in plain code → `SyntaxError: 'continue' not properly in loop`. It only means something inside a loop.

### Level Up 🚀
Polish your game like a released product: combine the safe pattern with the try counter so letters do NOT count as a try. Then hand your game to the naughtiest tester in class and challenge them to crash it. If they can't — you've written *robust software*, which is what companies pay real money for.

---

## Lesson 21: A Friendly Welcome and Rules

### Big Idea
Good games greet the player and explain the rules before starting.

### Kid Meaning
Like a host welcoming you to a party and telling you the game's rules.

### Game Connection
We add a warm opening so the game feels finished and friendly.

### The Code
```python
def welcome():
    print("=" * 30)
    print(" THE MAGIC NUMBER GAME ")
    print("=" * 30)
    print("I will think of a number from 1 to 100.")
    print("Try to guess it. I'll say higher or lower!")

welcome()
```

**When you run it, the TERMINAL shows:**

```text
==============================
 THE MAGIC NUMBER GAME 
==============================
I will think of a number from 1 to 100.
Try to guess it. I'll say higher or lower!
```

A title screen! Compare the feeling: a game that just barks "Your guess:" at
you, versus one that rolls out a banner and explains itself. Same engine —
totally different welcome. Players feel the difference instantly.

### Line by Line
- `def welcome():` — a function (Lesson 15) holding our intro. The whole
  opening ceremony has ONE name now.
- `"=" * 30` — a neat trick: text times a number repeats the text. Thirty `=`
  signs make a clean banner line without typing them all.
- We call `welcome()` once at the very start of the game.

### Slow Motion 🔬 — multiplying text?!
You knew `5 * 3` = 15. But `"=" * 30`?! In Python, multiplying TEXT by a
NUMBER means "repeat it that many times":

```python
print("=" * 30)     # ==============================
print("ab" * 3)     # ababab
print("🎉" * 5)     # 🎉🎉🎉🎉🎉
print("-=" * 15)    # -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
```

One symbol, two meanings: between two numbers `*` is maths; between text and a
number it's a repeater. Python looks at WHAT you're multiplying and picks the
right meaning. (But `"=" + 30` crashes — you can't ADD text and a number.
Repeating makes sense; adding doesn't.)

Why a FUNCTION for the welcome? Organisation. Your game file is growing, and
top-of-file functions act like a table of contents: the program's "main story"
at the bottom stays short and readable —
`welcome()` ... loop ... celebrate — while the details live in their named
boxes above. Real codebases with millions of lines survive ONLY because of
this habit. You're learning it at 24 lines. Perfect timing.

### Do It in VS Code 🛠️
1. Add the `welcome()` function at the TOP of `number_game.py` (right under
   `import random`), and the `welcome()` call as the first line of the main
   program.
2. Save, run — admire your title screen, then play through.
3. Experiment in a practice file: print your name times 3, and a `"~"` banner
   exactly as wide as your title (count the characters!).

### Your Turn
1. Add the `welcome()` function to your game and call it first.
2. Change the title and the decoration line to your own style — different
   symbols (`*`, `~`, `🎲`), different width. Make it YOURS.
3. Add a line telling the player your name as the game-maker — every artist
   signs their work.
4. Add a `rules()` function too, with 2–3 lines explaining how to win, and
   call it right after `welcome()`. Two ceremonies, two named machines.

### 📸 Show Emrys
Screenshot your title screen (banners look best as pictures!) or paste it,
and send it to Emrys. Style points are real points today — Emrys will judge
the banner like an art teacher. 🎨

### Check Your Brain
- What does `"=" * 30` do?
- Why put the welcome in a function instead of just printing?
- What's the difference between `"=" * 30` and `"=" + 30`?

### More Examples
Different border styles — pick your favourite:

```python
print("*" * 30)
print("-" * 30)
print("~" * 30)
print("=*" * 15)    # patterns work too!
```

A fancier welcome with the player's name in it (function + parameter — Lesson 16 pays off):

```python
def welcome(player):
    print("=" * 34)
    print(f"  WELCOME, {player.upper()}!")
    print("  THE MAGIC NUMBER GAME")
    print("=" * 34)

name = input("Your name? ")
welcome(name)
```

A matching `goodbye()` so the game ends as politely as it starts:

```python
def goodbye():
    print("-" * 30)
    print("Thanks for playing. Come back soon!")
    print("-" * 30)
```

### Common Mistakes
- **`30 * "="` vs `"=" * 30`:** actually BOTH work — but `"=" + 30` crashes (`TypeError`)! You can multiply text, but you can't ADD a number to text.
- **Defining welcome at the bottom:** if `welcome()` is called on line 2 but defined on line 50 → `NameError`. Function definitions live at the TOP of your file, like a table of contents.
- **Uneven borders:** title is 20 letters but the line is 30 `=` — looks scruffy. Count, or just make the line generous.

### Level Up 🚀
Design a complete "game poster" welcome: borders top and bottom, the title, one line of rules, AND a difficulty announcement like "Today's range: 1 to 100". Make the range a variable so the poster always tells the truth when you change the difficulty. Truthful screens = professional screens.

---

## Lesson 22: Play Again? — A Bigger Loop

### Big Idea
We wrap the whole game so the player can choose to play again.

### Kid Meaning
After one round, the game asks "Again?" — like a fairground ride you can re-ride.

### Game Connection
Real games don't quit after one round. This makes ours replayable.

### The Code
```python
import random

playing = "yes"
while playing == "yes":
    secret = random.randint(1, 100)
    guess = 0
    tries = 0
    while guess != secret:
        guess = int(input("Your guess: "))
        tries = tries + 1
        if guess > secret:
            print("Too high!")
        elif guess < secret:
            print("Too low!")
    print(f"Correct! It took {tries} tries.")
    playing = input("Play again? (yes/no): ")

print("Thanks for playing!")
```

**A two-round session looks like:**

```text
Your guess: 50
Too low!
Your guess: 75
Correct! It took 2 tries.
Play again? (yes/no): yes
Your guess: 30
Too high!
Your guess: 15
Correct! It took 2 tries.
Play again? (yes/no): no
Thanks for playing!
```

A NEW secret each round, fresh scores, and the player decides when the fun
ends. This is a complete game session — like a real arcade machine.

### Line by Line
- An OUTER loop `while playing == "yes":` holds a whole round — everything
  indented under it happens once per round.
- Inside it we pick a NEW secret and reset `guess` and `tries` each round —
  fresh game, fresh state.
- The INNER loop is the guessing we already built — a loop inside a loop!
  (Indented TWICE: the inner loop's body is inside the inner loop which is
  inside the outer loop.)
- At the end of a round we ask "Play again?"; any answer except exactly "yes"
  ends the outer loop.

### Slow Motion 🔬 — loops inside loops (and where variables live)
Zoom out and see the two wheels turning:

```text
OUTER LOOP (rounds)                 spins once per ROUND
   pick new secret, reset scores
   INNER LOOP (guesses)             spins once per GUESS
      ask, count, judge
   celebrate + ask "again?"
```

Like a clock: the inner loop is the fast second-hand (many guesses), the outer
loop the slow minute-hand (ticks one round forward after the inner finishes).
The inner loop must completely finish before the outer takes its next step.

Now the most valuable map in this whole course — WHERE a variable is created
decides WHEN it resets:

```text
BEFORE the outer loop   -> survives the whole session   (playing)
INSIDE outer, before inner -> fresh every ROUND         (secret, guess, tries)
INSIDE the inner loop   -> fresh every GUESS            (guess_text, if you add it)
```

Move `tries = 0` ABOVE the outer loop and watch the bug: round 2 would START
at round 1's count — "Correct! It took 9 tries" when you guessed in 2. Wrong
shelf, wrong story. When a variable behaves strangely, check WHERE it lives
first. This map answers 90% of "why is my variable weird?!" questions you'll
ever have — in any program, forever.

### Do It in VS Code 🛠️
1. Rebuild `number_game.py` to this full version (keep your `welcome()` from
   Lesson 21 at the top — call it once, ABOVE the outer loop... or inside it
   to greet every round. Try both; which feels right?).
2. Watch the double indentation carefully — VS Code shows faint vertical
   guide-lines connecting each level. Use them!
3. Save, run, play exactly two rounds then `no`. Confirm round 2 got a fresh
   tries count.

### Your Turn
1. Build this full version and play two rounds.
2. Why must `secret`, `guess`, and `tries` be reset INSIDE the outer loop?
   (Answer with the shelf map!)
3. Accept "Yes", "YES", and "y" as yes: change the last line to
   `playing = input("Play again? (yes/no): ").lower()` — the `.lower()` trick
   makes every answer lowercase before checking. Then add after it:
   `if playing == "y": playing = "yes"`. Test all three spellings!
4. Add a round counter: `round_number = 0` BEFORE the outer loop (it must
   survive rounds — check the map!), `+ 1` inside, and announce
   `f"--- Round {round_number} ---"` at each round's start.

### 📸 Show Emrys
Paste a full two-round session to Emrys — including the fresh tries count in
round 2 and your round announcements. Then answer Emrys's map quiz: where
would you create a variable that counts TOTAL guesses across ALL rounds?

### Check Your Brain
- What is a "loop inside a loop"?
- What resets at the start of each new round — and what survives all rounds?
- Where would a "total guesses across the whole session" variable live?

### More Examples
The friendly yes-checker — `.lower()` turns ANY typing style into lowercase, so one check handles `YES`, `Yes`, and `yes`:

```python
answer = input("Play again? ")
answer = answer.lower()
if answer == "yes" or answer == "y":
    print("Round two!")
else:
    print("Goodbye!")
```

Count the rounds across the whole session — a counter OUTSIDE the outer loop survives every round:

```python
rounds = 0
playing = "yes"
while playing == "yes":
    rounds = rounds + 1
    print(f"--- Round {rounds} ---")
    # ... the game goes here ...
    playing = input("Play again? (yes/no): ").lower()
print(f"You played {rounds} rounds today!")
```

See where a variable lives: `rounds` is outside (remembers everything), `tries` is inside (fresh each round). Where you create a variable decides what it remembers.

### Common Mistakes
- **Forgetting to reset the round:** if `guess` isn't reset, round 2 starts with last round's winning guess — the new round ends instantly! Everything per-round resets INSIDE the outer loop.
- **Asking "play again" inside the INNER loop:** then it asks after every single guess — infuriating! The question belongs after the inner loop ends, still inside the outer one. Indentation is the map.
- **`playing` never changing:** if you forget the `playing = input(...)` line, the outer loop never stops. Every loop needs its escape hatch.

### Level Up 🚀
A session scoreboard: track `total_tries` and `rounds` across all rounds, and when the player finally quits, print their average — `f"Average: {total_tries / rounds:.1f} tries per round"`. The `:.1f` inside the f-string rounds to 1 decimal place — a tiny pro formatting trick that makes reports look sharp.

---

## Lesson 23: Making It Cooler — Hints and Encouragement

### Big Idea
Small extra touches (hints, kind words) make a game feel great.

### Kid Meaning
Like a friend cheering you on and giving a little hint when you're stuck.

### Game Connection
We reward good play and gently help struggling players.

### The Code
```python
if tries == 1:
    print("INCREDIBLE — first try!")
elif tries <= 5:
    print("Wow, that was fast!")
elif tries <= 10:
    print("Nice guessing!")
else:
    print("You got there in the end — well done!")
```

**A win in 4 tries now ends like:**

```text
Correct! It took 4 tries.
Wow, that was fast!
```

Same victory, warmer feeling. Small words, big difference.

### Line by Line
- After a win, we look at `tries` and choose ONE encouraging message — the
  decision ladder from Lesson 10, now used for kindness.
- `elif tries <= 5:` — "5 or fewer". The checks go from best score to
  gentlest.
- Everyone gets a kind message no matter how many tries — the `else` catches
  all remaining players. Nobody leaves empty-handed.

### Slow Motion 🔬 — why the ORDER of the ladder matters
Try mentally swapping the ladder: what if `tries <= 10` came FIRST? A player
who won in 1 try hits `1 <= 10` → YES → gets "Nice guessing!" — and the
ladder STOPS (first yes wins, remember?). They never reach their deserved
"INCREDIBLE"! The champion got the bronze message. 😱

The rule: **when ladder ranges overlap, put the most specific/most special
check first.** `== 1` is inside `<= 5` is inside `<= 10` — so we check
narrowest to widest. Trace each of these through the ladder to prove the
order works: tries = 1, 3, 7, 15 → INCREDIBLE / fast / Nice / got there.

And the hint feature uses a tiny maths gem: `abs(guess - secret)` measures
DISTANCE. If secret is 42: guess 45 → 45-42 = 3. Guess 39 → 39-42 = **-3**,
but `abs(-3)` = 3 — `abs` throws away the minus sign, because being 3 below
is just as CLOSE as 3 above. Distance has no direction!

```python
if abs(guess - secret) <= 5:
    print("🔥 You're VERY close!")
```

This goes INSIDE the inner loop, after the too-high/too-low lines — the
"warmer/colder" from hide-and-seek, in three lines of Python.

### Do It in VS Code 🛠️
1. Add the encouragement ladder right after the `Correct!` line, INSIDE the
   outer loop (it should run every round — check your shelf map!).
2. Add the 🔥 close-hint inside the inner loop.
3. Save, run, and deliberately fish for each message: try to win fast once,
   then guess badly on purpose once. All four messages reachable?

### Your Turn
1. Add these messages right after the player wins.
2. Write your OWN four encouragement messages — your humour, your style. (A
   game's personality is its writer's personality.)
3. Add the 🔥 hint: if a guess is within 5 of the secret, print "You're very
   close!" using `abs(guess - secret) <= 5`.
4. Extra spice: a SECOND hint tier — within 15 prints "Getting warm...",
   within 5 prints "🔥 VERY close!". Mind the ladder order — which check must
   come first, and why? (You know this now!)

### 📸 Show Emrys
Paste a round where a 🔥 hint appeared AND the final encouragement message.
Tell Emrys your four custom messages — best set in the class gets Emrys's
applause. Then answer: why must the `== 1` check be first on the ladder?

### Check Your Brain
- Why do we order the checks from fewest tries to most?
- What makes a game feel "friendly"?
- What does `abs(guess - secret)` measure, and why ignore the minus sign?

### More Examples
The "you're close!" hint using `abs` — distance ignoring the minus sign:

```python
distance = abs(guess - secret)
if distance != 0 and distance <= 5:
    print("🔥 You're VERY close!")
elif distance != 0 and distance <= 15:
    print("Getting warm...")
```

A random cheer so wins never feel the same twice (Lesson 14's `random.choice`):

```python
import random
cheers = ["Champion!", "Superstar!", "Legend!", "Genius at work!"]
print(random.choice(cheers))
```

A progress bar of guesses — silly, but players love it:

```python
print("Tries used: " + "🟦" * tries)
```

### Common Mistakes
- **Hints that give it away:** "You're close" within 5 is fun; printing the actual distance ("You're 3 away!") makes the game too easy. Good hints tease, not tell.
- **`abs` misunderstanding:** `guess - secret` can be negative (guess 40, secret 45 → -5). Checking `<= 5` on a negative is ALWAYS true — every wrong guess says "close"! That's why `abs(...)` matters.
- **Unkind else:** ending with "Too slow!" feels mean. The last message should still feel like winning — kind games get replayed.

### Level Up 🚀
Difficulty levels! Before the round starts, ask "easy, normal or hard?" — easy = 1–20, normal = 1–100, hard = 1–500. Set `highest` from their choice with if/elif/else, then use it in `random.randint(1, highest)` AND in the welcome poster. One question, and your game now has game-menu energy. 😎

---

## Lesson 24: Showcase and Reflection

### Big Idea
A finished project is something to be proud of and to show others.

### Kid Meaning
You built a real, working game from nothing. Time to celebrate and share it!

### Game Connection
This is your complete Magic Number Game — welcome, secret number, guessing loop,
counter, kind messages, and play-again.

### The Code
```python
import random

def welcome():
    print("=" * 30)
    print(" THE MAGIC NUMBER GAME ")
    print("=" * 30)
    print("I will think of a number from 1 to 100.")
    print("Try to guess it. I'll say higher or lower!")

welcome()

playing = "yes"

while playing == "yes":
    secret = random.randint(1, 100)
    guess = 0
    tries = 0

    print()
    print("I picked a new secret number!")

    while guess != secret:
        guess_text = input("Your guess: ")

        if not guess_text.isdigit():
            print("Please type a number, like 42.")
            continue

        guess = int(guess_text)
        tries = tries + 1

        if guess > secret:
            print("Too high!")
        elif guess < secret:
            print("Too low!")

    print(f"Correct! The number was {secret}.")
    print(f"It took you {tries} tries.")

    if tries == 1:
        print("INCREDIBLE - first try!")
    elif tries <= 5:
        print("Wow, that was fast!")
    elif tries <= 10:
        print("Nice guessing!")
    else:
        print("You got there in the end - well done!")

    playing = input("Play again? Type yes or no: ").lower()
    if playing == "y":
        playing = "yes"

print("Thanks for playing!")
```

### Line by Line
- `import random` lets Python pick the secret number.
- `def welcome():` stores the welcome message in a function, then `welcome()` runs it.
- `playing = "yes"` starts the play-again loop.
- `while playing == "yes":` keeps the whole game running for another round.
- `secret`, `guess`, and `tries` are reset at the start of each new round.
- `while guess != secret:` keeps asking until the player finds the number.
- `guess_text = input(...)` gets what the player typed as text first.
- `if not guess_text.isdigit():` checks for wrong typing, like letters.
- `continue` jumps back to ask again, so the game does not crash.
- `guess = int(guess_text)` changes safe text like `"42"` into the number `42`.
- `tries = tries + 1` counts only real number guesses.
- The `if / elif` lines say whether the guess is too high or too low.
- After the loop ends, the game prints the answer, the number of tries, and a kind
  message.
- `.lower()` lets the player type `YES`, `Yes`, or `yes`.
- If the player types `y`, the game changes it to `yes` so another round starts.

### Build Checklist
1. Open your game file `number_game.py` in VS Code.
2. Type the full code above (or check your grown file matches it piece by
   piece — you BUILT this across eight lessons!).
3. Save (**Ctrl+S**), run (**▶**), and play until you win.
4. Test a mistake: type `hello`. The game should say to type a number and keep
   going.
5. Test play-again: after you win, type `yes`, `YES`, and `y` in different
   rounds.
6. Type `no` when you want to stop. You should see "Thanks for playing!"

### Read Your Own Program Like a Pro 🔬
Before the showcase, do the professional's final ritual: scroll to the top of
`number_game.py` and read EVERY line out loud, saying what it does — like
giving a tour of a house you built. Imports → welcome function → outer loop →
fresh secrets → inner loop → guard → judge → counter → celebration → again?
If any line makes you hesitate, that's the lesson to glance back at. When you
can tour the whole file without stopping... you don't just have a game. You
UNDERSTAND a game.

### 📸 Show Emrys — Graduation Run
This one is special. Play one complete session (at least two rounds, one typo
test, one win under 10) and paste the WHOLE terminal transcript to Emrys —
or screenshot it in pieces. Say: **"Emrys, this is my graduation run!"**
Emrys will review it like an examiner: checking the welcome banner, the crash
protection, the fresh rounds, the kind messages — and then say the words every
builder waits for. 🎓

### Your Turn (Showcase)
1. Play your finished game in front of the class or your family.
2. Explain THREE lines of your code to them.
3. Change the welcome title to make the game feel like yours.
4. Pick ONE new feature you'd love to add next (a high score, two players, or
   harder levels) and describe how it might work.
5. Well done — you are now a beginner Python game-maker! 🎉

### Check Your Brain
- Which part of the game was your favourite to build?
- What is one thing you understand now that you didn't 4 months ago?
- Can you explain to a friend what a variable, an `if`, and a loop each do?

### Look How Far You've Come 🏆
Four months ago you had never written a line of code. Today your game uses ALL of this — read the list out loud and feel proud:

- **print & f-strings** — the game talks (Lessons 1, 7)
- **variables** — it remembers the secret and the score (Lessons 3, 5)
- **input & int()** — it listens and understands numbers (Lessons 6, 7)
- **if / elif / else** — it makes decisions (Lessons 9, 10)
- **while loops** — it keeps playing, inside AND outside (Lessons 12, 18, 22)
- **random** — it surprises you (Lesson 14)
- **functions** — it's organised like a pro's code (Lessons 15, 21)
- **isdigit & continue** — it never crashes on wrong typing (Lesson 20)

That is a REAL program, with the same building blocks used in banking apps, games, and the software on this very computer.

### More Examples (Showcase ideas)
Three quick make-it-yours touches for presentation day:

```python
# 1. A signed title
print("THE MAGIC NUMBER GAME - by Ama, Class 4")
```

```python
# 2. A round timer feel: show the range shrinking
print(f"Hint zone: somewhere between 1 and 100...")
```

```python
# 3. Goodbye with stats
print(f"Today: {rounds} rounds, best score {best} tries. See you tomorrow!")
```

### Common Mistakes (on showcase day!)
- **Changing code 2 minutes before presenting:** if it worked, freeze it! Pros call this a "code freeze" before a launch.
- **Explaining too fast:** pick your three lines, breathe, and explain like the listener has never coded — because four months ago, neither had you.
- **Forgetting to test once more:** run the game ONE full time before the audience arrives — win a round, type a letter, play again, quit.

### Level Up 🚀 (your next adventure)
You're ready for bigger quests. Pick one and ask your teacher to cheer you on:
1. **Two-player mode** — player 1 types a secret (use `input`), screen scrolls away, player 2 guesses it.
2. **High-score file** — Class 5 learns to SAVE things so the best score survives switching the computer off.
3. **The reverse game** — YOU think of a number, and the COMPUTER guesses it with "too high/too low" from you. (Mind-bending and brilliant.)

Welcome to coding. You're not starting anymore — you're *building*. 🚀
