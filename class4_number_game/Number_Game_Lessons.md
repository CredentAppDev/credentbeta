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

### Line by Line
- `print(...)` — `print` is a command that means "show this on the screen."
- The words inside the quotes `" "` are exactly what gets shown.
- Each `print` line shows on its own new line.

### Your Turn
1. Make the computer print your own name, like: `print("My name is Ama.")`
2. Add two more `print` lines: your favourite food and your favourite colour.
3. Run it. Did all three lines appear?

### Check Your Brain
- What does `print` do?
- What do the quotes `" "` mark?
- If you write three `print` lines, how many lines show on screen?

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

### Line by Line
- This is one instruction. When you run the file, Python reads it top to bottom.
- Save your file with a name ending in `.py`, for example `game.py`. The `.py`
  tells the computer "this is Python."

### How to start (ask your teacher to help the first time)
- **Windows**: open the file in the code editor, then press the Run button.
- **Mac / Linux**: same idea — open and Run.
- You can also type `python game.py` in the terminal.

### Your Turn
1. Save a file called `practice.py`.
2. Put one `print` line inside that says `"I ran my first program!"`.
3. Run it. Show your teacher or a friend.

### Check Your Brain
- What ending must a Python file name have?
- What is the difference between "writing" code and "running" code?

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

### Line by Line
- `name = "Kofi"` — make a box called `name` and put the word `Kofi` inside.
- `age = 9` — make a box called `age` and put the number `9` inside.
- `print(name)` — show what is inside the `name` box (Kofi), NOT the word "name".
- Notice: words need quotes (`"Kofi"`), but numbers do not (`9`).

### Your Turn
1. Make a variable `favourite_game` and put your favourite game inside it.
2. Make a variable `lucky_number` with a number you like.
3. Print both.
4. Now change `lucky_number` to a different number and print it again. See how the
   box can hold something new?

### Check Your Brain
- What is a variable, in your own words?
- Why does `"Kofi"` have quotes but `9` does not?
- What does `print(name)` show — the word "name" or what's inside it?

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

### Line by Line
- `a + b` — add (gives 8).
- `a - b` — subtract (gives 2).
- `a * b` — multiply. We use `*` (a star) for "times", not `x`.
- The computer works out the answer, then `print` shows it.

### Your Turn
1. Make two number variables and print their sum.
2. Try multiplying them.
3. Predict the answer FIRST, then run it. Were you right?

### Check Your Brain
- Which symbol means "times"?
- What does `a - b` give if `a = 10` and `b = 4`?

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

### Line by Line
- `guesses = 0` — start the counter at zero.
- `guesses = guesses + 1` — new value is the old value plus one. Now it's 1.
- Do it again and it becomes 2. The box keeps the latest number.

### Your Turn
1. Start a variable `score = 0`.
2. Add 10 to it, print it. Add 10 again, print it.
3. Can you make it go up by 5 each time instead?

### Check Your Brain
- What does `count = count + 1` do?
- If `score` is 20 and you run `score = score + 10`, what is it now?

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

### Line by Line
- `input("What is your name? ")` — shows the question, then waits.
- Whatever the player types is stored in the `name` box.
- `"Nice to meet you, " + name` — joins two pieces of text together with `+`.

### Your Turn
1. Ask the player their favourite animal and store it.
2. Print a friendly message using their answer.
3. Ask a second question (their age) and print both answers.

### Check Your Brain
- What does `input()` do after it shows the question?
- What does `+` do between two pieces of text?

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

### Line by Line
- `age_text` holds text, e.g. the drawing `"9"`.
- `int(age_text)` turns `"9"` into the real number `9`.
- `age + 1` does maths → 10.
- `print(f"...")` — the little **`f`** before the quotes makes it an f-string. Now
  anything inside `{ }` is worked out and dropped into the sentence. So
  `{age + 1}` becomes `10`. **No `str()` needed — this is why f-strings are easier!**

### The old way (you'll see it too)
You can also join with `+`, like `print("Next year: " + str(age + 1))`. That works,
but you must remember `str(...)` around every number or Python complains. The
f-string is friendlier, so we'll mostly use it.

### Your Turn
1. Ask the player for a number, `int()` it, and print it doubled using an f-string:
   `print(f"Double is {number * 2}")`.
2. Ask their name AND age, then print one f-string sentence using BOTH, like
   `print(f"{name} will be {age + 1} next year")`.
3. Try leaving out the `f` before the quotes and see what prints — what's different?

### Check Your Brain
- What kind of thing does `input()` always give you — text or number?
- What does `int()` do?
- In an f-string, what happens to whatever you put inside `{ }`?
- Why is an f-string easier than joining with `+` and `str()`?

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

### Line by Line
- We `print` a welcome.
- We ask for the name (text) and store it.
- `int(input(...))` asks AND converts in one line — a neat shortcut.
- We greet them with an f-string, dropping `{name}` right into the sentence.
- `{age + 5}` does the little maths inside the f-string — no `str()` needed.

### Your Turn
1. Build the Greeting Machine above and run it.
2. Add one more question of your own (favourite colour) and use it in a message.
3. Show a friend and let them try it.

### Check Your Brain
- Why do we wrap the age question in `int(...)`?
- What does `int(input(...))` do in one line?

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

### Line by Line
- `if number == 7:` — check IF `number` is equal to 7. We use `==` (two equals)
  for "is equal to". (One `=` means "put into the box"; two `==` means "compare".)
- The `:` colon starts the "what to do if true" block.
- The indented (spaced-in) line runs ONLY if the condition is true. Indentation
  (the spaces at the start) is how Python knows which lines belong to the `if`.

### Your Turn
1. Make a variable `score = 10`. Write an `if` that prints "Great score!" if score
   is equal to 10.
2. Change score to 5 and run again. Does the message still show? Why not?

### Check Your Brain
- What is the difference between `=` and `==`?
- Why are the spaces (indentation) before the print important?

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

### Line by Line
- `guess > secret` — is the guess bigger? `>` means "greater than".
- `elif guess < secret:` — otherwise, is it smaller? `<` means "less than".
- `else:` — if neither bigger nor smaller, it must be equal → correct!
- Only ONE of the three blocks runs.

### Your Turn
1. Change `guess` to 42 and run — which message shows?
2. Change `guess` to 10, then to 99. Predict each result before running.
3. This is almost the whole game brain — notice how close we are!

### Check Your Brain
- What does `>` mean? What does `<` mean?
- When does the `else` block run?

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

### Line by Line
- `guess == secret` — the computer works this out as `True` (they're equal).
- `guess > 100` — this is `False` (42 is not over 100).
- `True` and `False` have no quotes — they are special, not words.

### Your Turn
1. Print whether `10 > 3` (predict first).
2. Print whether `5 == 6`.
3. Make a variable `is_winner = (guess == secret)` and print it.

### Check Your Brain
- What are the only two boolean values?
- Is `7 < 2` True or False?

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

### Line by Line
- `while count <= 5:` — keep looping while count is 5 or less (`<=` means "less
  than or equal to").
- The indented lines run each time around.
- `count = count + 1` — VERY important: it moves the count up so the loop
  eventually stops. Without it, the loop would run forever!
- `print("Done!")` is not indented, so it runs once after the loop ends.

### Your Turn
1. Make a loop that counts from 1 to 10.
2. Make a loop that prints "Hello" three times.
3. (Careful!) What would happen if you removed `count = count + 1`? Ask your
   teacher before trying — that makes a "forever loop".

### Check Your Brain
- What does a `while` loop do?
- Why must something change inside the loop?

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

### Line by Line
- `answer = ""` — start with empty text so the loop can begin.
- `while answer != "stop":` — keep going while the answer is NOT "stop". `!=`
  means "is not equal to".
- Inside, we ask again and store the new answer.
- When the player types `stop`, the condition becomes false and the loop ends.

### Your Turn
1. Build the loop above and run it. Type a few things, then `stop`.
2. Change the magic stop word from `stop` to `quit`.
3. Count how many times the player typed something (use a counter variable!).

### Check Your Brain
- What does `!=` mean?
- Why did we set `answer = ""` before the loop?

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

### Line by Line
- `import random` — bring in Python's random-number helper. We do this once at the
  top.
- `random.randint(1, 100)` — pick a whole number from 1 to 100 (both included).
- We store it in `secret`. In the real game we will NOT print it — that would be
  cheating! Here we print it just to learn.

### Your Turn
1. Pick a random number from 1 to 6 (like a dice) and print it. Run it 5 times —
   different each time?
2. Pick a random number from 1 to 10.
3. Why is `random` perfect for a guessing game?

### Check Your Brain
- What does `random.randint(1, 100)` give you?
- Why must we `import random` first?

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

### Line by Line
- `def cheer():` — `def` means "define a machine called cheer".
- The indented lines are the machine's job.
- `cheer()` — press the button: it runs both prints. We called it twice, so it
  ran twice.

### Your Turn
1. Make a function `welcome()` that prints a two-line welcome message.
2. Call it.
3. Make a function `goodbye()` and call it at the end of a program.

### Check Your Brain
- What word defines a function?
- What does it mean to "call" a function?

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

### Line by Line
- `def greet(name):` — this machine needs one thing: a `name`.
- Inside, `name` stands for whatever we hand over.
- `greet("Akua")` — run it with "Akua". Then again with "Yaw". Same machine,
  different results.

### Your Turn
1. Make a function `double(number)` that prints the number times 2.
2. Call it with 5, then with 50.
3. Make a `cheer(name)` that says "Well done, NAME!" using the player's name.

### Check Your Brain
- What is a parameter?
- Why is `greet(name)` better than writing a new print for every player?

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

### Line by Line
- `import random` then pick the `secret` (we do NOT print it — no cheating).
- Ask for a guess and `int()` it.
- Compare with `if / elif / else` — the brain we learned in Lesson 10.

### Your Turn
1. Build this and play it a few times. Can you win on the first try? (It's hard —
   that's why we add loops next!)
2. Change the range to 1–20 to make it easier for testing.

### Check Your Brain
- Why don't we print the secret number?
- Which earlier lessons does this combine?

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

### Line by Line
- `guess = 0` — a starting value so the loop can begin (0 won't be the secret in
  1–100).
- `while guess != secret:` — keep looping until the guess equals the secret.
- Inside: ask, then say too high or too low.
- When correct, the `while` condition becomes false → loop ends → we celebrate.

### Your Turn
1. Build this and play until you win. Feels like a real game now!
2. Notice we removed the "Correct!" from inside — why can the win message live
   after the loop instead?

### Check Your Brain
- What makes the loop finally stop?
- Why did we set `guess = 0` at the start?

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

### Line by Line
- `tries = 0` — start the counter (Lesson 5 + 12 skills).
- `tries = tries + 1` — add one for every guess, inside the loop.
- At the end we print the total with an f-string — `{tries}` drops the number in.

### Your Turn
1. Add the counter and play. How few tries can you manage?
2. Add a message: if `tries` is less than 8, print "You're a guessing genius!"
   (use an `if` after the loop).

### Check Your Brain
- Where must `tries = tries + 1` go — inside or outside the loop? Why?
- Why is an f-string easier here than joining with `+` and `str()`?

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

### Line by Line
- `guess_text.isdigit()` — asks "is this text made only of digits?" Gives True/False.
- If True, it's safe to `int()` it.
- If False (they typed letters), we politely ask again instead of crashing.

### Using it inside the game (the safe pattern)
Here is how the check fits INSIDE the guessing loop. If the player types letters,
we say so and use `continue`, which means "skip the rest and ask again":

```python
while guess != secret:
    guess_text = input("Your guess: ")
    if not guess_text.isdigit():
        print("Please type a number, like 42.")
        continue          # go back to the top of the loop and ask again
    guess = int(guess_text)
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")
```

- `if not guess_text.isdigit():` — `not` flips True/False, so this means "if it is
  NOT all digits".
- `continue` — jump straight back to the top of the loop (don't run the rest this
  time). The player gets asked again, and the game never crashes.

### Your Turn
1. Try the small code at the top; type `42`, then type `hello`. See the difference.
2. Copy the safe pattern above into your game loop. Test it by typing `abc` — the
   game should politely ask again instead of crashing.

### Check Your Brain
- What does `.isdigit()` tell you?
- What does `not` do to True or False?
- What does `continue` do inside a loop?

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

### Line by Line
- `def welcome():` — a function (Lesson 15) holding our intro.
- `"=" * 30` — a neat trick: it prints the `=` sign 30 times to make a line.
- We call `welcome()` once at the very start of the game.

### Your Turn
1. Add the `welcome()` function to your game and call it first.
2. Change the title and the decoration line to your own style.
3. Add a line telling the player your name as the game-maker.

### Check Your Brain
- What does `"=" * 30` do?
- Why put the welcome in a function instead of just printing?

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

### Line by Line
- An OUTER loop `while playing == "yes":` holds a whole round.
- Inside it we pick a NEW secret and reset `guess` and `tries` each round.
- The INNER loop is the guessing we already built — a loop inside a loop!
- At the end of a round we ask "Play again?"; if not "yes", the outer loop stops.

### Your Turn
1. Build this full version and play two rounds.
2. Why must `secret`, `guess`, and `tries` be reset INSIDE the outer loop?
3. Accept "Yes", "YES", and "y" as yes (hint: `.lower()` and checking the first
   letter — ask your teacher).

### Check Your Brain
- What is a "loop inside a loop"?
- What resets at the start of each new round?

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

### Line by Line
- After a win, we look at `tries` and choose an encouraging message.
- `elif tries <= 5:` — "5 or fewer". The checks go from best to gentlest.
- Everyone gets a kind message no matter how many tries.

### Your Turn
1. Add these messages right after the player wins.
2. Write your OWN four encouragement messages.
3. Add a "hint": if a guess is within 5 of the secret, print "You're very close!"
   (hint: you can check `if abs(guess - secret) <= 5:` — ask your teacher about
   `abs`, which means "distance, ignoring minus signs").

### Check Your Brain
- Why do we order the checks from fewest tries to most?
- What makes a game feel "friendly"?

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
1. Open your game file, for example `game.py`.
2. Type the full code above.
3. Run it and play until you win.
4. Test a mistake: type `hello`. The game should say to type a number and keep
   going.
5. Test play-again: after you win, type `yes`, `YES`, and `y` in different rounds.
6. Type `no` when you want to stop. You should see "Thanks for playing!"

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
