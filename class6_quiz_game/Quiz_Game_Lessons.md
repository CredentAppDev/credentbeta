# Quiz Game Lessons: Class 6 Edition

Build your own **Quiz Game** — the computer asks questions, checks your answers,
keeps your score, gives you lives, and shows your final result with a fun rank!

This project is for **Class 6**, and it assumes you have **never coded before**.
We start from absolutely zero and explain every line in simple words, so you truly
understand it — not just copy it. By the end you'll have built a real, working quiz.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Quiz Connection** — how this fits our Quiz Game.
- **The Code** — the actual Python to type.
- **Line by Line** — every important line explained.
- **Your Turn** — a small task YOU do to practise (the most important part!).
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

Teach one lesson at a time: explain the idea, show the code, then let students type
and run it. **Always do "Your Turn."** Understanding one lesson fully beats copying
five.

**This course takes about 4 months** (about two lessons a week), in three parts:

- **Part 1 — First Steps (Lessons 1–8):** what code is, printing, variables, input,
  and f-strings, from zero.
- **Part 2 — Making Choices (Lessons 9–16):** decisions, scoring, loops, lists, and
  functions.
- **Part 3 — Building the Quiz (Lessons 17–24):** assemble the real Quiz Game, then
  add lives, ranks, and polish.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST STEPS

---

## Lesson 1: What Is Code? Saying Hello

### Big Idea
Code is a list of instructions we give the computer, one line at a time.

### Kid Meaning
A recipe tells a cook each step. Code tells the computer each step. It does EXACTLY
what you say — nothing more, nothing less.

### Quiz Connection
Our quiz "asks" questions and "says" if you're right — it all starts with `print`.

### The Code
```python
print("Welcome to the Quiz!")
print("Get ready to test your brain.")
```

### Line by Line
- `print(...)` shows whatever is inside on the screen.
- The text in quotes `" "` is shown exactly.
- Each `print` is its own line.

### Your Turn
1. Print your own two-line welcome to a quiz.
2. Add a line with an emoji, like `print("Let's go! 🚀")`.
3. Run it.

### Check Your Brain
- What does `print` do?
- What do the quotes `" "` mark?

### More Examples
Predict what each shows BEFORE running — that's how coders read code:

```python
print("3... 2... 1...")
print("QUIZ TIME! 🎯")
```

Order matters — the computer follows your script exactly:

```python
print("Question 1 is coming...")
print("Are you ready?")
print("Too late - here it comes!")
```

A quiz-show opening with empty lines for drama (`print()` with nothing makes a gap):

```python
print("WELCOME TO...")
print()
print("THE GREATEST QUIZ ON EARTH! 🌍")
```

### Common Mistakes
- **Forgetting the quotes:** `print(Welcome)` → `NameError: name 'Welcome' is not defined`. Python thinks Welcome is a box name. **Fix:** `print("Welcome")`.
- **Forgetting a bracket:** `print("Hi"` → `SyntaxError: '(' was never closed`. Count your brackets.
- **Capital P:** `Print("Hi")` → `NameError`. Only lowercase `print` exists.

### Level Up 🚀
Design your quiz show's title screen in 5 print lines: a top border of `=`, the show name, your name as host, one rule, and a bottom border. Make it look like a real TV game show intro!

---

## Lesson 2: How to Run Python

### Big Idea
We write code in a `.py` file and run it to see it work.

### Kid Meaning
Writing is like penning a letter; running is reading it aloud — that's when things
happen.

### Quiz Connection
You'll run your quiz again and again as you build it.

### The Code
```python
print("If you can see this, Python works!")
```

### Line by Line
- Save the file with a `.py` name, e.g. `quiz.py`.
- Run from your editor's Run button, or type `python quiz.py`.

### Your Turn
1. Save `practice.py` with one print line and run it.
2. Show a friend.

### Check Your Brain
- What ending must a Python file have?
- What does "running" code mean?

### More Examples
Each file is its own little program — make a few:

```python
# file: warmup.py
print("Brain warming up... 🧠")
print("Ready for questions!")
```

Lines starting with `#` are **comments** — notes the computer skips. Label your work like a pro:

```python
# Quiz Game - built by Kojo, Class 6
print("This shows.")   # this note doesn't
```

### Common Mistakes
- **Wrong file ending:** `quiz.txt` won't run as Python. Save as `quiz.py`.
- **Not saving before running:** you see the OLD result. Ctrl+S, then Run — make it a habit.
- **Typing in the output panel:** code goes in the editor area only.

### Level Up 🚀
Make `quiz_rules.py` that prints your quiz's 3 rules, numbered. Run it, then change rule 3 to something funnier and run again. Feel that edit→save→run rhythm? That's the heartbeat of all programming.

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that stores a value for later.

### Kid Meaning
A box with a name sticker; say the name and the computer uses what's inside.

### Quiz Connection
The quiz must remember your SCORE and your LIVES — those live in variables.

### The Code
```python
score = 0
player = "Ama"
print(player)
print(score)
```

### Line by Line
- `score = 0` — a box called `score` holding the number 0.
- `player = "Ama"` — a box holding the word Ama (words need quotes).
- `print(score)` shows what's inside (0), not the word "score".

### Your Turn
1. Make a `lives` variable set to 3 and print it.
2. Make a `player` variable with your name and print it.
3. Change `score` to 10 and print it.

### Check Your Brain
- What is a variable?
- Why does `"Ama"` have quotes but `0` does not?

### More Examples
A quiz needs several boxes at once — here's a whole scoreboard:

```python
player = "Kojo"
score = 0
lives = 3
round_number = 1
print(player)
print(score)
print(lives)
print(round_number)
```

Boxes get refilled as the game changes:

```python
score = 0
print(score)     # 0
score = 5
print(score)     # 5 - the 0 is gone
```

One box copying another — useful for "best score" later:

```python
score = 8
best = score
print(best)      # 8
```

### Common Mistakes
- **Using before filling:** `print(lives)` with no `lives = ...` line above → `NameError: name 'lives' is not defined`.
- **Different spelling:** `player = "Ama"` then `print(Player)` → `NameError`. Capital P ≠ small p.
- **Quotes around numbers:** `score = "0"` stores a WORD. Later `score + 1` crashes with `TypeError`. Game numbers take no quotes.

### Level Up 🚀
Set up the complete starting state of your future quiz in one file: `player`, `score = 0`, `lives = 3`, `prize = "golden pencil 🏆"`. Print them all as a "game loading" screen. Every real game starts exactly like this — setting up its variables.

---

## Lesson 4: Numbers and Simple Maths

### Big Idea
The computer does maths fast and correctly. Numbers need no quotes.

### Kid Meaning
The computer is a super calculator.

### Quiz Connection
The quiz adds points and takes away lives — that's maths.

### The Code
```python
score = 0
print(score + 10)
print(score + 10 + 10)
lives = 3
print(lives - 1)
```

### Line by Line
- `score + 10` — adds 10 (gives 10).
- `lives - 1` — subtracts 1 (gives 2).
- `*` would multiply. We use `*`, not `x`.

### Your Turn
1. Start `score = 0`, print it plus 20.
2. Start `lives = 3`, print it minus 2.
3. Predict each answer first, then run.

### Check Your Brain
- Which symbol means "times"?
- What is `3 - 1`?

### More Examples
Quiz maths you'll actually use — double points for hard questions:

```python
points = 10
hard_bonus = points * 2
print(hard_bonus)        # 20
```

Percentages for the final results screen:

```python
score = 3
total = 4
print(score / total * 100)    # 75.0 - the player's percentage!
```

Python does `*` and `/` before `+` and `-`, and brackets jump the queue:

```python
print(10 + 5 * 2)      # 20, not 30
print((10 + 5) * 2)    # 30 - brackets first
```

### Common Mistakes
- **`x` for times:** `5 x 3` → `SyntaxError`. Use `*`.
- **Quotes around the sum:** `print("3 - 1")` shows `3 - 1`, not `2`. Quotes mean "say this exactly".
- **Dividing and expecting a whole number:** `print(7 / 2)` gives `3.5`. If you want whole-number division, `7 // 2` gives `3` — handy for game maths.

### Level Up 🚀
Prize-money calculator: each correct answer is worth 5 cedis. Make `correct = 7`, then print the winnings in one line. Then add a "perfect bonus": if they ALSO got a bonus question, add 15 more in the same calculation. (Check: 7 correct + bonus should print 50!)

---

## Lesson 5: Counting Score by Adding to a Variable

### Big Idea
Update a variable using its own value: `score = score + 1`.

### Kid Meaning
"Take what's in the box, add one, put it back." Like adding a point to your tally.

### Quiz Connection
This is EXACTLY how the quiz scores: a right answer does `score = score + 1`.

### The Code
```python
score = 0
print(score)
score = score + 1
print(score)
score = score + 1
print(score)
```

### Line by Line
- `score = 0` — start at zero.
- `score = score + 1` — new value is old value plus one.
- The box keeps the latest number.

### Your Turn
1. Start `score = 0`, add 1 three times, printing each time.
2. Start `lives = 3`, subtract 1 twice (`lives = lives - 1`), printing each time.

### Check Your Brain
- What does `score = score + 1` do?
- If `lives` is 3 and you run `lives = lives - 1`, what is it?

### More Examples
Score and lives moving in opposite directions — the rhythm of every game:

```python
score = 0
lives = 3
score = score + 1     # right answer!
lives = lives - 1     # wrong answer!
print(f"Score {score}, Lives {lives}")
```

Different points for different difficulty:

```python
score = 0
score = score + 1     # easy question
score = score + 3     # HARD question, big reward!
print(score)          # 4
```

The pro shortcut — `+=` and `-=` mean the same thing with less typing:

```python
score = 0
score += 1      # same as score = score + 1
lives = 3
lives -= 1      # same as lives = lives - 1
print(score, lives)    # 1 2
```

### Common Mistakes
- **No starting value:** `score = score + 1` with no `score = 0` first → `NameError`. Always start the counter.
- **Backwards:** `score + 1 = score` → `SyntaxError`. The box being filled goes LEFT of `=`.
- **Adding to the wrong box:** `score = lives + 1` — no error, but your score becomes 4 out of nowhere! Read your variable names carefully.

### Level Up 🚀
Trace this WITHOUT running, write your prediction, then run to check:

```python
score = 0
lives = 3
score += 2
score = score * 3
lives -= 1
score = score - lives
print(score)
```

If you predicted right — you can officially think like a computer. (That skill is called tracing, and it's how pros debug.)

---

## Lesson 6: Asking Questions with input()

### Big Idea
`input()` asks a question and waits for the player to type an answer.

### Kid Meaning
The computer asks, listens, and keeps your answer in a box.

### Quiz Connection
Every quiz question uses `input()` to get the player's answer.

### The Code
```python
answer = input("What is the capital of Ghana? ")
print("You answered:")
print(answer)
```

### Line by Line
- `input("...")` shows the question and waits.
- Whatever is typed is stored in `answer`.
- We then print it back.

### Your Turn
1. Ask "What is 2 + 2?" and store the answer.
2. Ask the player's name and store it.
3. Print both.

### Check Your Brain
- What does `input()` do after showing the question?
- Where does the typed answer go?

### More Examples
A two-question mini-interview — each answer in its own box:

```python
name = input("Contestant name? ")
subject = input("Your best subject? ")
print("Welcome " + name + ", master of " + subject + "!")
```

The same answer used twice:

```python
answer = input("Type any word: ")
print("You said: " + answer)
print("I'll remember '" + answer + "' forever!")
```

Quiz questions are just inputs waiting to be checked:

```python
guess = input("How many regions does Ghana have? ")
print("You guessed: " + guess)
print("(We'll teach the computer to CHECK answers in Lesson 9!)")
```

### Common Mistakes
- **Not storing the answer:** `input("Name? ")` alone — the typing vanishes. Catch it: `name = input("Name? ")`.
- **No space after the question:** `input("Name?")` looks squashed when they type. End with a space inside the quotes.
- **Joining without spaces:** `print("Hi" + name)` → `HiKojo`. Spaces go inside the quotes: `"Hi " + name`.

### Level Up 🚀
Run a "contestant registration desk": ask name, age, and town — then print an announcer line using all three, like a TV host introducing the player. Read it out loud in your best announcer voice. 🎤

---

## Lesson 7: f-strings — Dropping Values Into Sentences

### Big Idea
An **f-string** puts a variable's value right inside your words using `{ }` — the
easy way to mix words and boxes.

### Kid Meaning
A magic sentence with blanks; `{score}` gets filled with the real score.

### Quiz Connection
This is how the quiz says "Your score is 5!" using whatever the score is.

### The Code
```python
player = input("Your name? ")
score = 3
print(f"Well played, {player}! Your score is {score}.")
```

### Line by Line
- The `f` before the quotes makes it an f-string.
- `{player}` and `{score}` are replaced by what's in those boxes.
- Numbers drop into f-strings too — no extra steps.

### Your Turn
1. Ask the player's name; print an f-string greeting using it.
2. Make a `score = 10` and print `f"Score: {score}"`.
3. Print an f-string that uses BOTH name and score in one sentence.

### Check Your Brain
- What does the `f` before the quotes do?
- What goes inside `{ }`?

### More Examples
The scoreboard line every game needs — many blanks in one sentence:

```python
player = "Akosua"
score = 7
lives = 2
print(f"{player} | Score: {score} | Lives: {lives}")
```

Maths inside the blanks:

```python
score = 7
total = 10
print(f"You got {score} out of {total} - that's {score / total * 100}%!")
```

Text "7" vs number 7 — see the trap with your own eyes:

```python
text = "7"
number = 7
print(text + text)        # 77 - text glues!
print(number + number)    # 14 - numbers add
```

This is why answers from `input()` (always text!) need care when they're numbers.

### Common Mistakes
- **Forgetting the `f`:** `print("Score: {score}")` literally shows `{score}`. The `f` switches the magic on.
- **Maths on raw input:** `age = input(...)` then `{age + 1}` → `TypeError`. Wrap it: `int(input(...))`.
- **Brackets instead of braces:** `f"Score: (score)"` shows `(score)`. Only `{ }` are blanks.

### Level Up 🚀
Make the results screen of your dreams: with `player`, `score = 8`, `total = 10`, print three f-string lines — the score line, the percentage line, and a custom message with the player's name. Make it look like the end screen of your favourite game.

---

## Lesson 8: Tidying Answers — .lower() and .strip()

### Big Idea
`.lower()` makes text all small; `.strip()` trims spaces — so we can check answers
fairly.

### Kid Meaning
A player might type "Accra", "accra", or " ACCRA ". We tidy it so all count as
correct.

### Quiz Connection
The quiz must accept a right answer no matter how it's typed.

### The Code
```python
answer = input("Capital of Ghana? ").lower().strip()
print(f"Tidied answer: {answer}")
if answer == "accra":
    print("Correct! ✅")
```

### Line by Line
- `.lower()` turns "Accra" into "accra".
- `.strip()` removes surrounding spaces.
- Now comparing to `"accra"` works for messy typing too. (`if` is taught next
  lesson — here's a sneak peek of why tidying matters.)

### Your Turn
1. Ask a question, tidy the answer, and print it.
2. Type it with CAPITALS and spaces — does it come out tidy?
3. Why does tidying make a quiz fair?

### Check Your Brain
- What does `.lower()` do? What does `.strip()` do?
- Why tidy a player's answer before checking it?

### More Examples
Watch the tidying transform messy text step by step:

```python
messy = "  AcCRa  "
print(messy.lower())            # "  accra  "
print(messy.strip())            # "AcCRa"
print(messy.lower().strip())    # "accra" - quiz-ready!
```

Tidying makes ALL of these count as the same correct answer:

```python
print("ACCRA".lower().strip() == "accra")     # True
print(" accra ".lower().strip() == "accra")   # True
print("Accra".lower().strip() == "accra")     # True
```

`.title()` is for SHOWING names nicely (not for checking):

```python
name = "kwame mensah"
print(name.title())    # Kwame Mensah
```

### Common Mistakes
- **Missing brackets:** `answer.lower` without `()` doesn't run the tidy — and worse, gives no error here. Always `.lower()`.
- **Tidying but not keeping it:** `answer.lower()` on its own line changes nothing — it makes a COPY. Tidy at input time: `input(...).lower().strip()`.
- **Tidying the CORRECT answer instead:** keep correct answers already-tidy in your code (`"accra"` not `"Accra"`), and tidy the PLAYER's typing.

### Level Up 🚀
Build a fairness tester: store `correct = "accra"`, then try checking these against it WITH and WITHOUT tidying: `"Accra"`, `" ACCRA "`, `"aCCrA"`. Print both results each time. Show your teacher the difference one line of tidying makes — this is why real exam software tidies answers too.

---

# PART 2 — MAKING CHOICES

---

## Lesson 9: Making Decisions with if

### Big Idea
`if` runs code only when a condition is True.

### Kid Meaning
"IF the answer is right, give a point." The computer checks, then acts only if true.

### Quiz Connection
This is how the quiz decides if you got a question right.

### The Code
```python
answer = "accra"
if answer == "accra":
    print("Correct! ✅")
```

### Line by Line
- `if answer == "accra":` — check IF answer equals "accra" (`==` compares).
- The `:` and the indented line run only when true.
- Indentation tells Python which line belongs to the `if`.

### Your Turn
1. Set `answer = "paris"`. Write an `if` that prints "Right!" if it equals "paris".
2. Change answer to "london" — does the message show? Why not?

### Check Your Brain
- Difference between `=` and `==`?
- Why does indentation matter?

### More Examples
An `if` with several lines inside — everything indented belongs to it:

```python
answer = input("What is 6 x 7? ").strip()
if answer == "42":
    print("Correct! ✅")
    print("That's the famous answer to everything!")
print("This line shows either way - it's not indented.")
```

Number checks for number questions:

```python
age = int(input("How old is Ghana in 2027? (independence 1957) "))
if age == 70:
    print("Sharp maths! 🇬🇭")
```

A bonus-points check with `>=`:

```python
score = 9
if score >= 8:
    print("You qualify for the BONUS ROUND! 🌟")
```

### Common Mistakes
- **One `=` in a check:** `if answer = "42":` → `SyntaxError`. Compare with `==`.
- **No colon:** `if answer == "42"` → `SyntaxError: expected ':'`.
- **No indent:** the line under `if` at the left edge → `IndentationError: expected an indented block`. Tab once.

### Level Up 🚀
Make a "sudden death" question: ask one HARD question; if right, print a 3-line victory ceremony. Run it on a classmate. Notice how silent it is when they're wrong? `else` fixes that next lesson — you're about to make the quiz talk back.

---

## Lesson 10: if / else — Right or Wrong

### Big Idea
`else` says what to do when the `if` is false.

### Kid Meaning
"IF right, cheer. ELSE, show the correct answer." One of the two always runs.

### Quiz Connection
Every question: right → point and cheer; wrong → tell them the answer.

### The Code
```python
answer = input("Capital of Ghana? ").lower().strip()
if answer == "accra":
    print("Correct! ✅")
else:
    print("Oops! The answer was Accra.")
```

### Line by Line
- Tidy the answer, then check it.
- `if` block runs when correct; `else` block runs when not.
- Exactly one of them runs.

### Your Turn
1. Build a single question with `if/else`.
2. Make your OWN question with its own correct answer.
3. Test both a right and a wrong answer.

### Check Your Brain
- When does the `else` block run?
- Why tidy the answer first?

### More Examples
Different question types, same if/else shape — maths:

```python
answer = input("What is 9 x 8? ").strip()
if answer == "72":
    print("Correct! ✅")
else:
    print(f"Not quite - it was 72. You said {answer}.")
```

True/false questions work great too:

```python
answer = input("The sun is a star - true or false? ").lower().strip()
if answer == "true":
    print("Correct! ☀️ It really is a star!")
else:
    print("It IS true - the sun is a star!")
```

A kind else that teaches instead of just rejecting:

```python
answer = input("Which gas do plants breathe in? ").lower().strip()
if answer == "carbon dioxide":
    print("Correct! ✅")
else:
    print("It's carbon dioxide - plants take it in and give us oxygen! 🌱")
```

### Common Mistakes
- **`else` with a condition:** `else answer == "no":` → `SyntaxError`. `else` takes nothing — it IS "everything else".
- **Misaligned else:** `else:` must line up exactly with its `if` — indented differently, Python gets lost.
- **Mean else messages:** "WRONG! HA!" makes players quit. A great quiz teaches in the else — always show the right answer.

### Level Up 🚀
Write a 3-question "teaching quiz" where every wrong answer EXPLAINS the right one in a friendly sentence. Test it on someone younger — if they learn something from getting questions wrong, your quiz is doing what great teachers do.

---

## Lesson 11: Adding a Point When Right

### Big Idea
Combine `if` with scoring: add a point inside the `if`.

### Kid Meaning
A right answer earns a point; a wrong one doesn't.

### Quiz Connection
This is the core scoring move of the whole quiz.

### The Code
```python
score = 0
answer = input("What is 5 + 5? ").strip()
if answer == "10":
    print("Correct! ✅")
    score = score + 1
else:
    print("Not quite.")
print(f"Score so far: {score}")
```

### Line by Line
- `score = 0` — start the score.
- If correct, we cheer AND `score = score + 1`.
- After, an f-string shows the score.
- Note: the answer "10" is compared as TEXT (in quotes) because `input` gives text.

### Your Turn
1. Build this scoring question.
2. Add a second question that also adds a point when right.
3. Print the total score at the end.

### Check Your Brain
- Where does `score = score + 1` go — inside the `if` or the `else`? Why?
- Why is `"10"` in quotes here?

### More Examples
Two scored questions back to back — watch the score build:

```python
score = 0

answer = input("Capital of Ghana? ").lower().strip()
if answer == "accra":
    print("Correct! ✅")
    score = score + 1
else:
    print("It was Accra.")

answer = input("What is 7 + 8? ").strip()
if answer == "15":
    print("Correct! ✅")
    score = score + 1
else:
    print("It was 15.")

print(f"Final: {score} out of 2")
```

Hard questions can be worth MORE — just add more:

```python
if answer == "photosynthesis":
    print("Correct - and that was a HARD one! +3 points! 🌟")
    score = score + 3
```

### Common Mistakes
- **Point in the wrong place:** `score = score + 1` OUTSIDE the if gives a point even for wrong answers — the quiz becomes too generous! Indent it under the `if`.
- **Comparing number-text without quotes:** `if answer == 10:` is always False because `input` gives `"10"` (text). Either compare text `== "10"` or convert with `int()` first. Pick one and be consistent.
- **Reusing `answer` without re-asking:** the second question must have its own fresh `input(...)` — otherwise it checks the OLD answer.

### Level Up 🚀
Add a "risk question" at the end: the player can type "yes" to attempt it — right = double their whole score (`score = score * 2`), wrong = lose 2 points. One question that changes everything — that's real game-show drama, built with the tools you already have.

---

## Lesson 12: True and False (Booleans)

### Big Idea
Conditions are always True or False.

### Kid Meaning
A switch: on or off. Yes or no.

### Quiz Connection
"Was the answer correct?" is a yes/no the quiz checks each question.

### The Code
```python
answer = "accra"
print(answer == "accra")
print(answer == "lagos")
```

### Line by Line
- `answer == "accra"` → `True`.
- `answer == "lagos"` → `False`.
- `True`/`False` have no quotes — they're special.

### Your Turn
1. Print whether `"10" == "10"`.
2. Print whether `"10" == "11"`.
3. Make `correct = (answer == "accra")` and print it.

### Check Your Brain
- The two boolean values?
- Is `"5" == "5"` True or False?

### More Examples
Store the result of a check — name the fact:

```python
answer = "accra"
correct = (answer == "accra")
print(correct)            # True
```

Combine facts with `and` / `or`:

```python
score = 8
lives = 2
print(score >= 8 and lives > 0)    # True - BOTH true
print(score >= 10 or lives > 0)    # True - at least ONE true
```

`not` flips it:

```python
game_over = False
print(not game_over)    # True - the game is NOT over!
```

### Common Mistakes
- **Quoted booleans:** `correct = "True"` is a word, not a boolean. Bare and capitalised: `True`, `False`.
- **`true` lowercase:** → `NameError: name 'true' is not defined`.
- **Capitals in comparisons:** `"Accra" == "accra"` is `False`! The computer sees A and a as different letters — that's exactly why Lesson 8 taught tidying.

### Level Up 🚀
Boolean exam — predict each, then run to mark yourself:

```python
print("42" == "42")
print("42" == 42)
print(5 > 4 and 3 > 2)
print(5 > 6 or 6 > 5)
print(not (1 == 1))
```

Watch the second one — text `"42"` and number `42` are NOT equal! Score 5/5 and you're ready for anything the quiz can throw at you.

---

## Lesson 13: Repeating with while Loops

### Big Idea
A `while` loop repeats while a condition stays True.

### Kid Meaning
"WHILE you still have lives, keep playing." Stop when they run out.

### Quiz Connection
The quiz keeps asking WHILE you still have lives left.

### The Code
```python
lives = 3
while lives > 0:
    print(f"You have {lives} lives.")
    lives = lives - 1
print("Game over!")
```

### Line by Line
- `while lives > 0:` — loop while lives is more than zero.
- `lives = lives - 1` — lose a life each time, so the loop eventually ends.
- Without that change, it would loop forever!

### Your Turn
1. Make a loop that counts lives down from 5.
2. Make a loop that prints "Question!" 4 times (use a counter going up).
3. Why must something change inside the loop?

### Check Your Brain
- What does a `while` loop do?
- Why must the condition eventually become False?

### More Examples
A countdown timer feel for the quiz start:

```python
count = 3
while count > 0:
    print(f"Starting in {count}...")
    count = count - 1
print("GO! 🏁")
```

A score climbing to a target:

```python
score = 0
while score < 50:
    print(f"Score: {score}")
    score = score + 10
print("Target reached! 🎯")
```

A loop drawing the quiz's decorations:

```python
row = 1
while row <= 3:
    print("🎯" * row)
    row = row + 1
```

### Common Mistakes
- **The forever loop:** forget `lives = lives - 1` and lives stays 3 forever — the loop never ends! Press STOP or Ctrl+C, then add the missing line. (Every programmer has done this. Today is your day. 😄)
- **Wrong direction:** adding when you should subtract also loops forever. Ask: "does each lap move me closer to stopping?"
- **Checking after changing:** print BEFORE subtracting shows 3,2,1 — print AFTER shows 2,1,0. Both fine, but know which story you're telling.

### Level Up 🚀
Build "the pressure round": `seconds = 10`, count down with a loop printing `f"{seconds} seconds left!"` — but at 3 or less, add "⚠️ HURRY!" to the line (an `if` inside the `while`). Loops + ifs working together — that's the exact machinery inside the full quiz.

---

## Lesson 14: Lists — Holding Many Questions

### Big Idea
A **list** stores many values in one box, written in `[ ]` and separated by commas.

### Kid Meaning
Instead of many separate boxes, a list is one box holding a whole row of things —
like an egg tray.

### Quiz Connection
We keep all our quiz questions in a list, then go through them one by one.

### The Code
```python
questions = ["Capital of Ghana?", "What is 2 + 2?", "Colour of the sky?"]
print(questions[0])
print(questions[1])
print(len(questions))
```

### Line by Line
- `["...", "...", "..."]` — a list of three questions.
- `questions[0]` — the FIRST item (Python counts from 0!).
- `questions[1]` — the second item.
- `len(questions)` — how many items (3).

### Your Turn
1. Make a list of your 3 favourite foods. Print the first and the last.
2. Print how many items the list has with `len()`.
3. Why does `questions[0]` give the FIRST item, not the second?

### Check Your Brain
- How do you write a list?
- What number is the first item in a list?

### More Examples
Lists can hold numbers, words — anything:

```python
scores = [7, 9, 4, 10]
print(scores[0])        # 7
print(scores[3])        # 10
print(len(scores))      # 4
```

Add to a list while the program runs — `.append()` puts a new item at the end:

```python
players = ["Ama"]
players.append("Kojo")
players.append("Esi")
print(players)          # ['Ama', 'Kojo', 'Esi']
print(len(players))     # 3
```

The LAST item has a magic shortcut — index `-1`:

```python
questions = ["Q1?", "Q2?", "Q3?"]
print(questions[-1])    # "Q3?" - counting from the back!
```

### Common Mistakes
- **Index too big:** `questions[3]` on a 3-item list → `IndexError: list index out of range`. The last index is always `len - 1` (items 0, 1, 2).
- **Missing commas:** `["Q1?" "Q2?"]` silently glues into ONE item `["Q1?Q2?"]` — no error, sneaky bug!
- **Round brackets:** `(1, 2, 3)` is a different thing (a tuple). Lists are SQUARE: `[1, 2, 3]`.

### Level Up 🚀
Build your quiz's "contestant list": start with 2 names, `.append()` two more, print the first contestant, the last (use `-1`!), and the total with `len()`. Then try printing `players[10]` ON PURPOSE to meet `IndexError` — now the error message is a friend you recognise, not a scary stranger.

---

## Lesson 15: Going Through a List with for

### Big Idea
A `for` loop visits every item in a list, one at a time.

### Kid Meaning
"FOR each question in my list, ask it." The loop handles them all without retyping.

### Quiz Connection
This is how the quiz asks every question in its list automatically.

### The Code
```python
questions = ["Capital of Ghana?", "What is 2 + 2?"]
for q in questions:
    print("Question:", q)
```

### Line by Line
- `for q in questions:` — go through the list; each time, `q` is the next item.
- The indented line runs once per item.
- First `q` is "Capital of Ghana?", then "What is 2 + 2?".

### Your Turn
1. Put 4 foods in a list and print each with a `for` loop.
2. Make a `for` loop that prints each item with an emoji in front.
3. How is a `for` loop different from typing `print` four times?

### Check Your Brain
- What does a `for` loop do with a list?
- What is `q` each time around?

### More Examples
A for loop can DO things with each item, not just print it:

```python
scores = [7, 9, 4, 10]
total = 0
for s in scores:
    total = total + s
print(f"Team total: {total}")     # 30 - it added every score!
```

Numbering the questions as you go:

```python
questions = ["Capital of Ghana?", "2 + 2?", "Largest ocean?"]
number = 1
for q in questions:
    print(f"Q{number}: {q}")
    number = number + 1
```

`for` even walks through letters of a word:

```python
for letter in "QUIZ":
    print(letter + "!")
```

### Common Mistakes
- **Using the list name inside:** `for q in questions: print(questions)` prints the WHOLE list each time! Inside the loop, use the loop variable `q` — it holds the current item.
- **Forgetting the colon:** `for q in questions` → `SyntaxError: expected ':'`.
- **Changing the list while looping over it:** adding/removing items mid-loop confuses the tour. Build the list first, loop after.

### Level Up 🚀
The "hype machine": a list of your 4 classmates' names — the for loop prints `"🎉 Give it up for AMA!"` for each (`.upper()` for shouting). Then add a `count` so the last one gets `"...and FINALLY, the one you've waited for..."` before their name. Crowd control via code!

---

## Lesson 16: Functions — Reusable Machines

### Big Idea
A function is named code you can run again by calling its name. It can take inputs
(parameters).

### Kid Meaning
A machine with a button. `ask("...")` runs the same job for any question you give.

### Quiz Connection
A function can ask ONE question, check it, and hand back whether it was right.

### The Code
```python
def ask(question, correct):
    answer = input(question + " ").lower().strip()
    if answer == correct:
        print("Correct! ✅")
        return 1
    else:
        print(f"The answer was {correct}.")
        return 0

points = ask("Capital of Ghana?", "accra")
print(f"You earned {points} point.")
```

### Line by Line
- `def ask(question, correct):` — needs two things: the question and the right
  answer.
- It asks, tidies the answer, and checks it.
- `return 1` for right, `return 0` for wrong — it hands back the points.
- `points = ask(...)` catches that number.

### Your Turn
1. Use `ask()` for a question of your own.
2. Call `ask()` twice and add the returned points into a score.
3. Why is `ask()` better than copying the same if/else for every question?

### Check Your Brain
- What two parameters does `ask` take?
- What does `return 1` vs `return 0` mean here?

### More Examples
Use `ask()` many times and pile the points into a score — this is why the function exists:

```python
score = 0
score = score + ask("Capital of Ghana?", "accra")
score = score + ask("What is 6 x 7?", "42")
score = score + ask("Largest planet?", "jupiter")
print(f"Total: {score} out of 3")
```

A simpler returning machine to feel the idea — `points_for` decides a reward:

```python
def points_for(difficulty):
    if difficulty == "hard":
        return 3
    else:
        return 1

print(points_for("easy"))    # 1
print(points_for("hard"))    # 3
```

Returned values can go straight into maths:

```python
total = points_for("hard") + points_for("easy")
print(total)    # 4
```

### Common Mistakes
- **Ignoring the return:** calling `ask("...", "...")` without catching the result throws the point away! Catch it: `score = score + ask(...)`.
- **`print` instead of `return`:** if `ask` prints "1" but returns nothing, `score + ask(...)` crashes with `TypeError` — you can't add `None`. Return hands back; print only shows.
- **Forgetting BOTH parameters:** `ask("Capital of Ghana?")` → `TypeError: ask() missing 1 required positional argument: 'correct'`. The machine needs the question AND its answer.

### Level Up 🚀
Upgrade `ask` to `ask(question, correct, points)` — a third parameter for how much the question is worth. Right answer returns `points`, wrong returns 0. Now build a 3-question quiz where the last question is worth 5! You've just designed a scoring SYSTEM — that's real game architecture.

---

# PART 3 — BUILDING THE QUIZ

---

## Lesson 17: A List of Questions and Answers

### Big Idea
Store each question WITH its answer, as pairs, so the quiz can check them.

### Kid Meaning
Each question needs to know its own correct answer — we keep them together.

### Quiz Connection
This is the quiz's question bank.

### The Code
```python
quiz = [
    ["Capital of Ghana?", "accra"],
    ["What is 2 + 2?", "4"],
    ["Colour of the sky?", "blue"],
]
print(quiz[0])
print(quiz[0][0])   # the question
print(quiz[0][1])   # the answer
```

### Line by Line
- `quiz` is a list of small lists. Each inner list is `[question, answer]`.
- `quiz[0]` — the first pair.
- `quiz[0][0]` — first pair's question; `quiz[0][1]` — first pair's answer.

### Your Turn
1. Add two more question-answer pairs of your own to the list.
2. Print the question of the third pair.
3. Why keep the question and answer together in a pair?

### Check Your Brain
- What does `quiz[1][1]` give you?
- Why does the first pair start at `[0]`?

### More Examples
Read pairs from your bank — practise the double index until it feels easy:

```python
quiz = [
    ["Capital of Ghana?", "accra"],
    ["What is 2 + 2?", "4"],
    ["Colour of the sky?", "blue"],
]
print(quiz[1][0])    # "What is 2 + 2?" - second pair's question
print(quiz[2][1])    # "blue" - third pair's answer
print(len(quiz))     # 3 pairs in the bank
```

Grow the bank while the program runs:

```python
quiz.append(["Largest ocean?", "pacific"])
print(len(quiz))     # 4 now!
```

Subject sections — banks inside variables make organising easy:

```python
maths_quiz = [
    ["What is 9 x 9?", "81"],
    ["Half of 50?", "25"],
]
science_quiz = [
    ["Gas plants breathe in?", "carbon dioxide"],
]
```

### Common Mistakes
- **Mixing the order:** `["accra", "Capital of Ghana?"]` — answer first means the quiz will ASK "accra"! Keep the pattern: question `[0]`, answer `[1]`, always.
- **Missing inner brackets:** `["Q?", "a", "Q2?", "a2"]` is ONE flat list of 4 things, not 2 pairs. Each pair needs its own `[ ]`.
- **A comma after the last pair?** Actually fine in Python! `["Q?", "a"],` — that trailing comma is legal and pros use it to make adding lines easier.

### Level Up 🚀
Build a 6-question bank about YOUR favourite topic (football? animals? Ghana history?). Mind the answers: keep them lowercase, one word where possible — you're learning real data design: clean data makes checking easy, messy data makes bugs.

---

## Lesson 18: Asking Every Question with a Loop

### Big Idea
Use a `for` loop over the quiz list, asking each question and scoring it.

### Kid Meaning
Go through the whole question bank automatically, keeping score.

### Quiz Connection
The core of the quiz: ask all, score all.

### The Code
```python
quiz = [
    ["Capital of Ghana?", "accra"],
    ["What is 2 + 2?", "4"],
    ["Colour of the sky?", "blue"],
]

score = 0
for pair in quiz:
    question = pair[0]
    correct = pair[1]
    answer = input(question + " ").lower().strip()
    if answer == correct:
        print("Correct! ✅")
        score = score + 1
    else:
        print(f"The answer was {correct}.")

print(f"You scored {score} out of {len(quiz)}!")
```

### Line by Line
- `for pair in quiz:` — each `pair` is a `[question, answer]`.
- We pull out the question and correct answer.
- Tidy the player's answer, check it, score it.
- At the end, `len(quiz)` is the total number of questions.

### Your Turn
1. Build the full quiz and play it.
2. Add two more questions to the bank — they get asked automatically!
3. Why didn't we have to write new code to ask the extra questions?

### Check Your Brain
- What is `pair` each time around the loop?
- What does `len(quiz)` tell us?

### More Examples
Add question numbers to feel like a real show:

```python
number = 1
for pair in quiz:
    print(f"--- Question {number} of {len(quiz)} ---")
    answer = input(pair[0] + " ").lower().strip()
    if answer == pair[1]:
        print("Correct! ✅")
        score = score + 1
    else:
        print(f"The answer was {pair[1]}.")
    number = number + 1
```

Shuffle the questions so every play is different — one import changes everything:

```python
import random
random.shuffle(quiz)     # mixes the question order!
```

A neat unpacking trick pros use — name both parts at once:

```python
for question, correct in quiz:
    print(question)      # no pair[0] needed - Python unpacked it!
```

### Common Mistakes
- **Score reset inside the loop:** `score = 0` INSIDE the for-loop wipes it every question — final score is always 0 or 1. Starting values go BEFORE the loop.
- **Checking `pair` instead of `pair[1]`:** `if answer == pair:` compares a word to a whole LIST — always False. Index into the pair.
- **Forgetting to tidy:** `input(...)` without `.lower().strip()` makes "Accra" wrong. Every answer check needs tidy typing (Lesson 8!).

### Level Up 🚀
Add `random.shuffle(quiz)` at the top and play twice — different order each time! Then add question numbers too. Your quiz now has replay value, which is THE quality that separates a demo from a game.

---

## Lesson 19: Adding Lives

### Big Idea
Give the player lives; a wrong answer costs one, and the game can end early.

### Kid Meaning
Like a real game — too many mistakes and it's game over.

### Quiz Connection
Lives add excitement and stakes to the quiz.

### The Code
```python
lives = 3
for pair in quiz:
    if lives == 0:
        print("No lives left! 💔")
        break
    answer = input(pair[0] + " ").lower().strip()
    if answer == pair[1]:
        print("Correct! ✅")
    else:
        lives = lives - 1
        print(f"Wrong! Lives left: {lives}")
```

### Line by Line
- `lives = 3` — start with three.
- `if lives == 0:` then `break` — stop the loop early if lives run out.
- A wrong answer does `lives = lives - 1`.
- `break` is a new word: it leaves the loop immediately.

### Your Turn
1. Add lives to your full quiz.
2. Start with 2 lives and see how it changes the game.
3. What does `break` do?

### Check Your Brain
- When does the quiz end early?
- What does `break` do inside a loop?

### More Examples
Show the lives as hearts — instantly more game-like:

```python
print("Lives: " + "❤️" * lives)
```

`break` vs `continue` in 8 lines — the two loop controls side by side:

```python
for n in [1, 2, 3, 4, 5]:
    if n == 2:
        continue     # skip just this one
    if n == 4:
        break        # stop the whole loop
    print(n)
# prints: 1, 3  (2 skipped, stopped before 4)
```

A "survived!" bonus for finishing with all lives:

```python
if lives == 3:
    print("🛡️ FLAWLESS - never lost a life! Bonus point!")
    score = score + 1
```

### Common Mistakes
- **Checking lives AFTER asking:** if the lives-check is at the bottom of the loop, the player gets asked one question too many. Check `if lives == 0: break` FIRST, at the top.
- **`break` in the wrong block:** indented under the `else`, it would end the quiz after EVERY wrong answer — brutal! Make sure break only runs when lives hit 0.
- **Negative lives:** if you subtract without checking, lives can hit -1 and hearts print weirdly. The top-of-loop check prevents it.

### Level Up 🚀
Add a "second chance" mechanic: the FIRST time lives reach 0, ask one special revival question — get it right and lives become 1 with "💫 REVIVED!", wrong and it's truly game over. Track `revived = False` so it only happens once. You've just implemented respawn logic — a real game-dev pattern.

---

## Lesson 20: Being Kind to Empty Answers

### Big Idea
Handle empty answers gently with a check and a re-ask, so the quiz feels fair.

### Kid Meaning
If a player presses Enter by mistake, don't punish them — ask once more.

### Quiz Connection
A polished quiz doesn't lose a life for an accidental blank.

### The Code
```python
answer = input(pair[0] + " ").lower().strip()
while answer == "":
    answer = input("Please type an answer: ").lower().strip()
# now answer is definitely not empty
if answer == pair[1]:
    print("Correct! ✅")
```

### Line by Line
- After asking, a small `while answer == "":` keeps re-asking until they type
  something.
- Only then do we check the answer.
- This guard means a blank never counts as wrong.

### Your Turn
1. Add the empty-answer guard to your quiz.
2. Test it by pressing Enter on a blank line.
3. Why use a small `while` loop here instead of an `if`?

### Check Your Brain
- How do we check for an empty answer?
- Why re-ask instead of marking it wrong?

### More Examples
The guard as a reusable function — kindness you can call anywhere:

```python
def ask_not_empty(question):
    answer = input(question + " ").lower().strip()
    while answer == "":
        answer = input("Please type an answer: ").lower().strip()
    return answer

answer = ask_not_empty("Capital of Ghana?")
```

Guard against accidental spaces-only too — `.strip()` already turns `"   "` into `""`, so the same check catches it:

```python
print("   ".strip() == "")    # True - spaces-only counts as empty!
```

A friendlier escalating re-ask:

```python
asks = 0
while answer == "":
    asks = asks + 1
    if asks >= 3:
        print("(psst - just type any guess, you won't lose a life for trying!)")
    answer = input("Your answer: ").lower().strip()
```

### Common Mistakes
- **Using `if` instead of `while`:** an `if` re-asks ONCE — press Enter twice and the blank sneaks through! `while` keeps guarding until there's real typing.
- **Forgetting `.strip()` in the re-ask:** the guard's own input needs tidying too, or `" "` passes as an answer.
- **Punishing blanks with a life:** losing a life for a slipped Enter feels deeply unfair — fairness is why this lesson exists.

### Level Up 🚀
Combine the guard function with `ask()` from Lesson 16 into one super-function: `ask_safe(question, correct)` that re-asks blanks AND returns 1 or 0. Your quiz code shrinks to almost nothing — `score += ask_safe(...)` per question. Less code doing more: the most professional feeling in programming.

---

## Lesson 21: A Final Rank Based on Score

### Big Idea
After the quiz, give the player a fun rank using `if/elif/else` on their score.

### Kid Meaning
Like a medal at the end — gold, silver, or "try again" — based on how well you did.

### Quiz Connection
A satisfying ending that makes players want to beat their score.

### The Code
```python
total = len(quiz)
if score == total:
    print("🏆 PERFECT! Quiz Champion!")
elif score >= total / 2:
    print("🥈 Great job!")
else:
    print("🙂 Good try — play again to improve!")
```

### Line by Line
- `total = len(quiz)` — how many questions there were.
- `score == total` — got them all → champion.
- `score >= total / 2` — got at least half → great. (`/` divides.)
- `else` — encourage them to try again.

### Your Turn
1. Add the rank to the end of your quiz.
2. Write your OWN three rank messages.
3. Add a "nearly perfect" rank for one wrong answer (hint: `score == total - 1`).

### Check Your Brain
- What does `len(quiz)` give?
- What does `total / 2` mean?

### More Examples
A four-tier ranking with percentages — order from best down:

```python
percent = score / total * 100
if percent == 100:
    print("🏆 PERFECT! Quiz Champion!")
elif percent >= 75:
    print("🥇 Gold brain!")
elif percent >= 50:
    print("🥈 Silver - solid effort!")
else:
    print("🥉 Bronze - the comeback starts now!")
```

Show the percentage with one decimal — the `:.1f` formatting trick:

```python
print(f"You scored {percent:.1f}%")    # like 66.7%
```

A rank that ALSO looks at lives — two stats, richer story:

```python
if score == total and lives == 3:
    print("👑 FLAWLESS CHAMPION - perfect score, no lives lost!")
```

### Common Mistakes
- **Checks in the wrong order:** if `>= 50` is checked before `== total`, a perfect score gets "Silver"! The computer stops at the first true — strongest rank first.
- **Integer division surprise:** `total / 2` gives 2.0 for 4 questions — fine for comparing. But `total // 2` (double slash) gives 2 exactly. Both work here; know the difference.
- **Forgetting else:** without it, a low score gets NO rank — silence is worse than bronze! Every player deserves an ending.

### Level Up 🚀
Add a "rank ladder" display at the end showing ALL ranks with an arrow at theirs:

```
🏆 Champion
🥇 Gold     ⬅️ YOU
🥈 Silver
🥉 Bronze
```

(Hint: four prints, with an `if` deciding which line gets the arrow.) Players instantly see what to chase next time — that's motivation by design.

---

## Lesson 22: The Full Quiz Game

### Big Idea
Put it all together: question bank, loop, score, lives, empty-guard, and rank.

### Kid Meaning
Your complete, polished quiz — a real game from start to finish!

### Quiz Connection
This is your finished Quiz Game.

### The Code
```python
quiz = [
    ["Capital of Ghana?", "accra"],
    ["What is 2 + 2?", "4"],
    ["Largest planet?", "jupiter"],
    ["Colour of the sky?", "blue"],
]

print("=" * 28)
print("   THE QUIZ GAME 🎯")
print("=" * 28)

score = 0
lives = 3
for pair in quiz:
    if lives == 0:
        print("No lives left! 💔")
        break
    question = pair[0]
    correct = pair[1]
    answer = input(question + " ").lower().strip()
    while answer == "":
        answer = input("Please type an answer: ").lower().strip()
    if answer == correct:
        print("Correct! ✅")
        score = score + 1
    else:
        lives = lives - 1
        print(f"Wrong! The answer was {correct}. Lives left: {lives}")

print(f"\nFinal score: {score} out of {len(quiz)}")
total = len(quiz)
if score == total:
    print("🏆 PERFECT! Quiz Champion!")
elif score >= total / 2:
    print("🥈 Great job!")
else:
    print("🙂 Good try — play again to improve!")
```

### Line by Line
- The question bank, then a titled welcome.
- A `for` loop over each pair, with a lives check and `break`.
- Empty-answer guard, then score or lose a life.
- A final score line (`\n` makes a blank line) and a rank.

### Your Turn
1. Build the full quiz and play it.
2. Add THREE more questions of your own.
3. Change the number of starting lives and the rank rules to your taste.

### Check Your Brain
- What does `\n` do in the final print?
- Trace what happens when lives reach 0.

### More Examples
Pre-flight checklist — pros TEST every path before shipping. Run your quiz four times, once per path:

```python
# Test 1: answer everything correctly -> champion rank?
# Test 2: answer everything wrongly   -> lives run out + game over line?
# Test 3: press Enter on a blank      -> re-asked, no life lost?
# Test 4: type answers in CAPITALS    -> still counted correct?
```

Add a question counter header to each round (from Lesson 18):

```python
number = 1
for pair in quiz:
    print(f"\n--- Question {number} of {len(quiz)} | Lives: {'❤️' * lives} ---")
    # ... rest of the loop ...
    number = number + 1
```

Polish: a tiny pause between questions builds suspense (`import time` at the top):

```python
import time
time.sleep(1)    # one dramatic second
```

### Common Mistakes
- **Pieces in the wrong order:** the bank must be defined BEFORE the loop; `score`/`lives` before the loop; the rank AFTER. If something's `NameError`-ing, check what's above what.
- **One missing indent in the big code:** with nested if/while/for, a single wrong indent changes the meaning. Read the code top to bottom matching each indented block to its owner.
- **Testing only the happy path:** a quiz that works when YOU play nicely but crashes for your naughty friend isn't done. The four tests above are the real finish line.

### Level Up 🚀
Add ALL the upgrades you've built into this full version: shuffle (L18), hearts display (L19), the safe-ask function (L20), and the rank ladder (L21). That's not following a tutorial anymore — that's assembling YOUR engineering toolkit into YOUR product.

---

## Lesson 23: Play Again and a High Score

### Big Idea
Let the player replay, and remember the best score across rounds.

### Kid Meaning
Real games let you try again and chase a high score.

### Quiz Connection
Adds replay value to your quiz.

### The Code
```python
best = 0
playing = "yes"
while playing == "yes":
    # ...run one full quiz here, ending with the variable `score`...
    score = 3   # (this is just a stand-in; use your real quiz score)
    if score > best:
        best = score
        print("🌟 New high score!")
    print(f"Best score so far: {best}")
    playing = input("Play again? (yes/no): ").lower().strip()
print("Thanks for playing!")
```

### Line by Line
- `best = 0` — remember the highest score, starting at 0.
- An OUTER `while playing == "yes":` wraps a whole round.
- `if score > best:` updates the record and celebrates.
- Ask "Play again?"; not "yes" → stop.

### Your Turn
1. Wrap your full quiz from Lesson 22 inside this play-again loop.
2. Make sure `score` and `lives` RESET at the start of each round.
3. Why must they reset each round?

### Check Your Brain
- What does the OUTER loop do?
- What resets at the start of each new round?

### More Examples
Accept "yes", "y", and "YES" all at once:

```python
playing = input("Play again? (yes/no): ").lower().strip()
if playing == "y":
    playing = "yes"
```

A round counter across the whole session:

```python
rounds = 0
best = 0
playing = "yes"
while playing == "yes":
    rounds = rounds + 1
    print(f"\n🎲 ROUND {rounds}!")
    # ... full quiz here, ends with `score` ...
```

A farewell report when they finally stop:

```python
print(f"\nSession over! {rounds} rounds played.")
print(f"🏅 Best score: {best} out of {len(quiz)}")
```

### Common Mistakes
- **Not resetting score/lives:** round 2 starts with round 1's leftovers — instant game over or free points! Reset INSIDE the outer loop, before the questions.
- **Resetting `best` inside:** then the high score forgets itself every round — it must live OUTSIDE the outer loop. Where a variable is born decides what it remembers.
- **Shuffling only once:** put `random.shuffle(quiz)` INSIDE the outer loop so every round has a fresh order.

### Level Up 🚀
Track and announce a "streak": if the player beats their previous round's score, print "📈 Improving!"; if they hit a new best, celebrate louder. Keep `last_score` and `best` outside the loop. Watching numbers climb across rounds is exactly why people replay games — you're engineering motivation now.

---

## Lesson 24: Showcase and Reflection

### Big Idea
You built a real quiz game — celebrate and share it.

### Kid Meaning
From zero to a scored, lives-and-ranks quiz. Be proud!

### Quiz Connection
This is your finished Quiz Game — question bank, loop, score, lives, ranks, and
play-again.

### The Code
```python
# This is YOUR finished quiz. Read every line top to bottom and
# make sure you can explain it. That's how you know you've learned it.
```

### Line by Line
- Open your full quiz file and explain each line out loud.
- Any fuzzy line → revisit the lesson that taught it.

### Your Turn (Showcase)
1. Let your class or family play your quiz.
2. Explain THREE lines of your code to them.
3. Pick ONE upgrade you'd add next (categories, a timer, harder rounds) and
   describe how it might work.
4. Brilliant — you're now a beginner Python quiz-maker! 🎉

### Check Your Brain
- What was your favourite part to build?
- Explain what a variable, an `if`, a `for` loop, a list, and a function each do.

### Look How Far You've Come 🏆
Four months ago you had never coded. Today your quiz uses ALL of this:

- **print & f-strings** — the show talks (Lessons 1, 7)
- **variables & counters** — score and lives (Lessons 3, 5, 11)
- **input + tidying** — fair answer checking (Lessons 6, 8)
- **if / elif / else** — right, wrong, and ranks (Lessons 9, 10, 21)
- **while + for loops** — lives countdowns and question tours (Lessons 13, 15, 18)
- **lists & pairs** — a real question bank (Lessons 14, 17)
- **functions + return** — the reusable `ask()` machine (Lesson 16)
- **break + guards** — early endings and kind re-asks (Lessons 19, 20)

Quiz apps with millions of users — Kahoot, Duolingo — are built on these exact blocks, stacked higher. You're on the same staircase now.

### More Examples (Showcase ideas)
```python
# 1. A signed banner
print("THE QUIZ GAME 🎯 - hosted by Kojo, Class 6")
```

```python
# 2. Category announcement before each question
print("📚 Category: GHANA HISTORY")
```

```python
# 3. The grand farewell
print(f"Thanks for playing! Best today: {best}/{len(quiz)} 🏅")
```

### Common Mistakes (on showcase day!)
- **Editing minutes before the demo:** if it works, FREEZE it (pros call it a code freeze).
- **Questions only YOU can answer:** a showcase quiz should let the audience win sometimes — fun beats hard.
- **Skipping the final test:** one full run — right answers, wrong answers, a blank Enter, play-again, quit.

### Level Up 🚀 (your next adventure)
1. **Timed questions** — explore `time.time()` to measure how fast they answered; faster = more points.
2. **Saved high scores** — JHS 1 learns files; your scores could survive shutdown!
3. **Team mode** — two players alternate questions; separate scores; dramatic winner announcement.

You didn't just answer questions — you built the machine that asks them. See you in JHS. 🎓🚀
- What's one thing you understand now that you didn't 4 months ago?