# Emoji Mood Chatbot Lessons: Class 5 Edition

Build your own **Emoji Mood Chatbot** — a friendly computer buddy that asks how
you feel, replies with the perfect emoji and a kind message, remembers your name,
and keeps chatting until you say bye!

This project is for **Class 5**, and it assumes you have **never coded before**.
We start from absolutely zero and explain every single line in simple words, so you
truly understand it — not just copy it. By the end you will have built a real,
working chatbot.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Chatbot Connection** — how this fits our Emoji Mood Chatbot.
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
and run it. **Always do "Your Turn" — that is where the learning happens.** Do not
rush; understanding one lesson fully is better than copying five.

**This course takes about 4 months** (about two lessons a week), in three parts:

- **Part 1 — First Steps (Lessons 1–8):** what code is, printing, variables, input,
  and f-strings. The basic building blocks, from zero.
- **Part 2 — Making Choices (Lessons 9–16):** decisions with `if`, True/False,
  loops, and functions.
- **Part 3 — Building the Chatbot (Lessons 17–24):** put it together into the real
  Emoji Mood Chatbot, then make it smarter and friendlier.

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

### Chatbot Connection
Our chatbot will "say" things like "How do you feel?" — so first we learn how to
make the computer say anything at all.

### The Code
```python
print("Hi! I am your computer.")
print("Let's build a chatbot together.")
```

### Line by Line
- `print(...)` — `print` is a command that means "show this on the screen."
- The words inside the quotes `" "` are exactly what gets shown.
- Each `print` line shows on its own new line.

### Your Turn
1. Make the computer print your own name, like: `print("My name is Esi.")`
2. Add two more `print` lines: your favourite food and your favourite colour.
3. Run it. Did all three lines appear?

### Check Your Brain
- What does `print` do?
- What do the quotes `" "` mark?
- If you write three `print` lines, how many lines show?

### More Examples
Make the computer talk like a friendly robot — predict each result BEFORE running:

```python
print("Beep boop! 🤖")
print("I am learning to chat.")
```

The computer says things in the exact order you write them — order matters in a conversation:

```python
print("Knock knock!")
print("Who's there?")
print("A chatbot you are about to build!")
```

Emojis are just characters — they can live inside your quotes like any letter:

```python
print("Happy 😄")
print("Sleepy 😴")
print("Super cool 😎")
```

### Common Mistakes
Everyone makes these — spotting them makes you a real coder:

- **Forgetting the quotes:** `print(Hello)` → Python says `NameError: name 'Hello' is not defined`. It thinks Hello is a box name, not words. **Fix:** `print("Hello")`.
- **Forgetting a bracket:** `print("Hello"` → `SyntaxError: '(' was never closed`. **Fix:** close it — `print("Hello")`.
- **Capital P:** `Print("Hello")` → `NameError`. Python only knows lowercase `print`.

### Level Up 🚀
Print a 4-line conversation between two robots, like a tiny play:

```python
print("Robo1: Hello friend!")
print("Robo2: Hello! How are you?")
print("Robo1: Fully charged! 🔋")
print("Robo2: Lucky you - I'm at 2 percent...")
```

Write your own version with different robot names and a funnier ending!

---

## Lesson 2: How to Run Python

### Big Idea
We type code in a file and then "run" it to see it work.

### Kid Meaning
Writing code is like writing a letter. Running it is like reading the letter out
loud — that is when things actually happen.

### Chatbot Connection
You will run your chatbot again and again as you build it, checking it each time.

### The Code
```python
print("If you can see this, Python is working!")
```

### Line by Line
- This is one instruction. When you run the file, Python reads it top to bottom.
- Save your file with a name ending in `.py`, for example `chatbot.py`. The `.py`
  tells the computer "this is Python."

### How to start (ask your teacher to help the first time)
- **Windows**: open the file in the code editor, then press the Run button.
- **Mac / Linux**: same idea — open and Run.
- You can also type `python chatbot.py` in the terminal.

### Your Turn
1. Save a file called `practice.py`.
2. Put one `print` line inside that says `"I ran my first program!"`.
3. Run it. Show your teacher or a friend.

### Check Your Brain
- What ending must a Python file name have?
- What is the difference between "writing" code and "running" code?

### More Examples
Make and run tiny files — each one is a complete program:

```python
# file: hello_bot.py
print("Bot: Hello! I live in a file.")
```

```python
# file: jokes.py
print("Why did the robot cross the road?")
print("Because it was programmed to! 🤖")
```

Lines starting with `#` are **comments** — notes for humans that the computer skips. Coders use them to label their work:

```python
# My second program ever - by Esi
print("This line shows.")   # the computer ignores this part too
```

### Common Mistakes
- **Saving without `.py`:** if the file is called `chatbot.txt`, the Run button may not work. **Fix:** save as `chatbot.py`.
- **Forgetting to SAVE before running:** you change the code, run, and see the OLD result. **Fix:** save first (Ctrl+S), then run.
- **Typing code in the output window:** nothing happens there! Type in the editor area, then press Run.

### Level Up 🚀
Create `my_bot_intro.py` that prints 4 lines: your bot's name, what it loves, what it fears (low battery?), and its dream. Run it for a friend. Every chatbot starts with its creator running a file — you're officially a bot-builder now.

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a labelled box that stores a value so we can use it later.

### Kid Meaning
Imagine a box with a name sticker on it. You put something inside, and whenever
you say the box's name, the computer looks inside and uses what's there.

### Chatbot Connection
Our chatbot must remember YOUR name and YOUR mood. Those are stored in variables.

### The Code
```python
name = "Kofi"
mood = "happy"
print(name)
print(mood)
```

### Line by Line
- `name = "Kofi"` — make a box called `name` and put the word `Kofi` inside.
- `mood = "happy"` — make a box called `mood` and put `happy` inside.
- `print(name)` — show what is INSIDE the `name` box (Kofi), NOT the word "name".
- Words need quotes (`"Kofi"`).

### Your Turn
1. Make a variable `favourite_food` and put your favourite food inside it.
2. Make a variable `mood` set to "sleepy".
3. Print both. Then change `mood` to "excited" and print it again — see how the box
   can hold something new?

### Check Your Brain
- What is a variable, in your own words?
- Why does `"Kofi"` have quotes?
- Does `print(mood)` show "mood" or what's inside it?

### More Examples
A chatbot's memory is just boxes — here's a bot remembering three things about a friend:

```python
friend = "Abena"
mood = "excited"
favourite_emoji = "🌟"
print(friend)
print(mood)
print(favourite_emoji)
```

Boxes can be REFILLED — moods change, and the box keeps only the newest one:

```python
mood = "sleepy"
print(mood)
mood = "happy"
print(mood)     # sleepy is gone - the box holds the latest thing
```

One box can copy from another:

```python
best_friend = "Esi"
chat_partner = best_friend
print(chat_partner)    # Esi - it copied what was inside
```

### Common Mistakes
- **Using a box before filling it:** `print(mood)` before any `mood = ...` line → `NameError: name 'mood' is not defined`. Fill first, use after.
- **Spelling the name differently:** `favourite_food = "waakye"` then `print(favorite_food)` → `NameError`. The names must match EXACTLY.
- **Quotes around the box name when printing:** `print("mood")` shows the word `mood`, not what's inside! No quotes when you mean the box: `print(mood)`.

### Level Up 🚀
Build a "Bot ID Card": variables for `bot_name`, `bot_mood`, and `battery` (a number 0–100). Print all three. Then "charge" the bot — change `battery` to 100 on a new line and print it again. Your bot's state just changed at your command — that's exactly how real game characters work.

---

## Lesson 4: Numbers and Simple Maths

### Big Idea
The computer can do maths for us, very fast and never wrong. Numbers don't need
quotes.

### Kid Meaning
The computer is a super calculator. We just tell it the sum.

### Chatbot Connection
Later our chatbot counts how many feelings you shared — that is maths!

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
- Numbers like `5` need NO quotes (quotes are only for words).

### Your Turn
1. Make two number variables and print their sum.
2. Try multiplying them.
3. Predict the answer FIRST, then run it. Were you right?

### Check Your Brain
- Which symbol means "times"?
- Do numbers need quotes?

### More Examples
Your bot can be a maths helper in two lines:

```python
pencils = 6
price = 2
print(pencils * price)    # total cost of all pencils
```

Divide shares things fairly — note the `/` gives a decimal answer:

```python
biscuits = 10
friends = 4
print(biscuits / friends)   # 2.5 each
```

Python does times/divide BEFORE plus/minus, exactly like maths class — and brackets jump the queue:

```python
print(2 + 3 * 4)      # 14 (times first!)
print((2 + 3) * 4)    # 20 (brackets first)
```

### Common Mistakes
- **Using `x` for times:** `print(5 x 3)` → `SyntaxError`. Only `*` works.
- **Quotes around the sum:** `print("5 + 3")` shows the words `5 + 3`, not `8`. Quotes mean "say exactly this".
- **Quotes around numbers in boxes:** `battery = "50"` stores a WORD. Later `battery + 10` crashes with `TypeError`. Real numbers take no quotes: `battery = 50`.

### Level Up 🚀
Bot energy maths: your bot starts with `battery = 100`. Each chat message costs 7 energy. Print how much battery remains after 3 messages — in ONE print line using maths. (Check: should be 79!)

---

## Lesson 5: Counting Up by Adding to a Variable

### Big Idea
We can update a variable using its own value, like `count = count + 1`.

### Kid Meaning
It looks strange, but it means: "take what's in the box, add one, put it back."
Like adding one more sweet to your jar.

### Chatbot Connection
This is how our chatbot counts feelings: `shared = shared + 1` each time.

### The Code
```python
shared = 0
print(shared)
shared = shared + 1
print(shared)
shared = shared + 1
print(shared)
```

### Line by Line
- `shared = 0` — start the counter at zero.
- `shared = shared + 1` — new value is the old value plus one. Now it's 1.
- Do it again and it becomes 2. The box keeps the latest number.

### Your Turn
1. Start a variable `score = 0`. Add 10, print. Add 10 again, print.
2. Can you make it go up by 5 each time instead?

### Check Your Brain
- What does `count = count + 1` do?
- If `score` is 20 and you run `score = score + 10`, what is it now?

### More Examples
Counters can go DOWN — like a bot's battery draining:

```python
battery = 100
print(f"Battery: {battery}")
battery = battery - 30      # a long chat used 30!
print(f"Battery: {battery}")
```

Counters can grow by different amounts each time:

```python
kindness_points = 0
kindness_points = kindness_points + 5    # helped a friend
kindness_points = kindness_points + 10   # shared lunch!
print(kindness_points)                    # 15
```

Pro shortcut: `shared += 1` means exactly `shared = shared + 1` (and `battery -= 5` means lose 5):

```python
shared = 0
shared += 1
shared += 1
print(shared)    # 2 - same thing, less typing
```

### Common Mistakes
- **No starting value:** `shared = shared + 1` with no `shared = 0` first → `NameError: name 'shared' is not defined`. Counters must start somewhere.
- **Writing it backwards:** `shared + 1 = shared` → `SyntaxError`. The box being filled goes LEFT of the `=`.
- **Expecting memory between runs:** each run starts fresh from your starting line — counters don't survive closing the program (saving comes much later!).

### Level Up 🚀
"Mood points" tracker: start `points = 0`. A happy chat adds 10, a joke adds 5, then DOUBLE everything (`points = points * 2`), then subtract 3 for a yawn. Predict the final number BEFORE you run it. Predicting what code does is called *tracing* — it's a real programmer superpower.

---

## Lesson 6: Talking to the Player with input()

### Big Idea
`input()` lets the computer ask a question and wait for the person to type.

### Kid Meaning
It's like the computer asking "What's your name?" and then listening for your
answer, and keeping it in a box.

### Chatbot Connection
The whole chatbot is built on this — it asks "How do you feel?" and waits for you.

### The Code
```python
name = input("What is your name? ")
print("Nice to meet you!")
print(name)
```

### Line by Line
- `input("What is your name? ")` — shows the question, then waits.
- Whatever the player types is stored in the `name` box.
- `print(name)` then shows what they typed.

### Your Turn
1. Ask the player their favourite animal and store it.
2. Ask their pet's name and store it.
3. Print both answers.

### Check Your Brain
- What does `input()` do after it shows the question?
- Where does the typed answer go?

### More Examples
A bot interview — several questions, several boxes:

```python
colour = input("Favourite colour? ")
print("Ooh, " + colour + " is lovely!")
```

```python
food = input("Best food ever? ")
drink = input("And the best drink? ")
print("Dinner at your house: " + food + " with " + drink + "!")
```

Use one answer many times — the box keeps it:

```python
name = input("Your name? ")
print(name + "! " + name + "! " + name + "!")
print("The whole class is cheering for you!")
```

### Common Mistakes
- **Forgetting to store the answer:** `input("Your name? ")` alone — the answer vanishes! Always catch it: `name = input(...)`.
- **No space at the end of the question:** `input("Name?")` squashes the typing against the question mark. End with a space: `input("Name? ")` — small touch, very professional.
- **Joining without spaces:** `print("Hi" + name)` shows `HiEsi`. Put the space inside the quotes: `"Hi " + name`.

### Level Up 🚀
Build "Bot's First Questions": the bot asks three things — name, favourite emoji, and dream job — then introduces the person back like a game-show host: "Welcome ESI, the future PILOT who loves 🌟!" Tip: `.upper()` makes text SHOUT — try `name.upper()`.

---

## Lesson 7: f-strings — Dropping Values Into Sentences

### Big Idea
An **f-string** lets you put a variable's value right inside your words using `{ }`
— the easy way to mix words and boxes.

### Kid Meaning
A magic sentence with blanks. You write `{name}` in the blank and the computer
fills in the real name for you.

### Chatbot Connection
This is how the chatbot says "Hello Esi!" using whatever name was typed.

### The Code
```python
name = input("What is your name? ")
print(f"Hello {name}! Lovely to meet you. 😊")
```

### Line by Line
- The little `f` right before the quotes makes it an f-string.
- `{name}` is replaced by what's in the `name` box.
- So if they typed "Esi", it prints `Hello Esi! Lovely to meet you. 😊`.
- No need for tricky joining — f-strings are the friendly way.

### Your Turn
1. Ask the player's name and print a friendly f-string greeting using it.
2. Ask a number too (their age), then print: `f"Wow, {age} is a great age!"` — yes,
   you can drop numbers into f-strings as well.
3. Add an emoji inside your f-string.

### Check Your Brain
- What does the `f` before the quotes do?
- What goes inside the `{ }`?

### More Examples
One f-string can hold MANY blanks:

```python
name = "Adwoa"
mood = "happy"
print(f"{name} feels {mood} today! 😄")
```

Maths works right inside the `{ }`:

```python
age = int(input("How old are you? "))
print(f"In 2 years you'll be {age + 2}!")
print(f"Double your age is {age * 2}!")
```

See why text "7" and number 7 are different — run this and be amazed:

```python
text_seven = "7"
real_seven = 7
print(text_seven + text_seven)   # 77 - text GLUES together!
print(real_seven + real_seven)   # 14 - numbers do real maths
```

That `int(...)` around input is what turns typed text into a real number — remember it whenever your bot needs maths.

### Common Mistakes
- **Forgetting the `f`:** `print("Hello {name}")` literally shows `Hello {name}` with the braces! The `f` is the magic switch: `print(f"Hello {name}")`.
- **Maths on raw input:** `age = input("Age? ")` then `{age + 2}` → `TypeError`. Convert first: `age = int(input("Age? "))`.
- **Braces the wrong way:** `print(f"Hello (name)")` shows `(name)` — only curly braces `{ }` are blanks, not round brackets.

### Level Up 🚀
The "Compliment Calculator": ask name and age, then print ONE f-string that uses both AND does maths — like `f"{name}, you've been awesome for roughly {age * 365} days!"`. Run it on yourself. That's a big number of awesome days. 😄

---

## Lesson 8: Tidying Text and a Mini Hello-Bot

### Big Idea
`.lower()` makes text all small letters and `.strip()` removes extra spaces, so the
computer understands messy typing. Then we build a small talking program.

### Kid Meaning
People type messily — "HAPPY", " happy ". We tidy it so the computer sees it the
same way every time.

### Chatbot Connection
If the chatbot knows "happy" but the player types "Happy", tidying makes it still
work. This mini-bot is practice for the real opening.

### The Code
```python
print("=" * 25)
print("   HELLO BOT")
print("=" * 25)
name = input("What is your name? ").strip()
mood = input("In one word, how do you feel? ").lower().strip()
print(f"Nice to meet you, {name}!")
print(f"So you feel {mood} today. Thanks for telling me. 😊")
```

### Line by Line
- `"=" * 25` — prints `=` 25 times to draw a line (a number times text repeats it).
- `.strip()` on the name removes spaces at the start/end.
- `.lower().strip()` on the mood makes it small letters AND trims spaces.
- Two friendly f-string replies use both boxes.

### Your Turn
1. Build Hello Bot and run it. Type your name with CAPITALS and spaces — see it
   come out tidy.
2. Add one more question (favourite hobby) and reply using it.
3. Let a friend try it.

### Check Your Brain
- What does `.lower()` do? What does `.strip()` do?
- What does `"=" * 25` do?

### More Examples
Watch the tidying happen with your own eyes:

```python
messy = "  HaPPy  "
print(messy)
print(messy.lower())            # "  happy  " - small letters, spaces remain
print(messy.strip())            # "HaPPy" - spaces gone, capitals remain
print(messy.lower().strip())    # "happy" - both fixed!
```

There's also `.upper()` for SHOUTING and `.title()` for Making Names Neat:

```python
name = "ama serwaa"
print(name.upper())    # AMA SERWAA
print(name.title())    # Ama Serwaa - perfect for greetings!
```

Border patterns for your bot's screens:

```python
print("~" * 25)
print("=-" * 12)
print("🤖" * 5)
```

### Common Mistakes
- **Forgetting the brackets:** `mood.lower` without `()` doesn't DO anything — it's like pointing at the soap without washing. Always `.lower()`.
- **Expecting it to change the box:** `mood.lower()` makes a tidied COPY; the box still holds the messy one! Catch it: `mood = mood.lower()` (or tidy at input time like the lesson does).
- **Tidying the wrong things:** don't `.lower()` a name you'll display — "esi" looks less special than "Esi". Tidy for MATCHING, `.title()` for SHOWING.

### Level Up 🚀
Upgrade Hello Bot into "Smart Hello Bot": tidy the name with `.strip().title()` so even "  aMA  " becomes "Ama", and tidy the mood with `.lower().strip()`. Test by typing as messily as possible — spaces everywhere, crazy capitals. If the bot still answers neatly, you've built something genuinely robust.

---

# PART 2 — MAKING CHOICES

---

## Lesson 9: Making Decisions with if

### Big Idea
`if` lets the computer choose what to do based on a condition (something True or
False).

### Kid Meaning
"IF you feel happy, I'll smile." The computer checks, and only acts if it's true.

### Chatbot Connection
The chatbot picks a reply based on your mood — that's an `if`.

### The Code
```python
mood = "happy"
if mood == "happy":
    print("Yay! 😄 I'm happy too!")
```

### Line by Line
- `if mood == "happy":` — check IF `mood` is equal to "happy". We use `==` (two
  equals) for "is equal to". (One `=` puts a value in a box; two `==` compares.)
- The `:` colon starts the "what to do if true" block.
- The indented (spaced-in) line runs ONLY if the condition is true. Indentation is
  how Python knows which line belongs to the `if`.

### Your Turn
1. Make `mood = "sad"` and write an `if` that prints a caring message if sad.
2. Change mood to "happy" — does the sad message show? Why not?

### Check Your Brain
- Difference between `=` and `==`?
- Why does the indentation (spaces) matter?

### More Examples
An `if` can hold SEVERAL lines — everything indented belongs to it:

```python
mood = input("How do you feel? ").lower().strip()
if mood == "happy":
    print("😄 Fantastic!")
    print("Happy days are the best days.")
print("This line shows for EVERY mood - see, not indented.")
```

Checks work on numbers too — your bot can react to ages:

```python
age = int(input("How old are you? "))
if age >= 10:
    print("Double digits! Practically a grown-up. 😎")
```

A secret-word check — the seed of every password screen ever:

```python
word = input("Whisper the magic word: ").lower().strip()
if word == "sunshine":
    print("✨ The bot reveals its secret dance! 🕺")
```

### Common Mistakes
- **One `=` in the check:** `if mood = "happy":` → `SyntaxError`. One `=` fills a box, two `==` compares.
- **Missing colon:** `if mood == "happy"` → `SyntaxError: expected ':'`. The colon is the doorway.
- **Forgetting to tidy first:** the player types "Happy" but you check `== "happy"` — False! Capitals fool the computer. Tidy with `.lower().strip()` before comparing (Lesson 8's superpower).

### Level Up 🚀
"Emoji door": the bot asks "Which emoji opens the door?" — if the typed word is exactly `key`, print a 3-line celebration with 🎉🔓✨. Then test the WRONG word and watch the program end silently. Tomorrow's lesson gives the bot a voice for every answer — `elif` and `else`.

---

## Lesson 10: if / elif / else — Many Moods

### Big Idea
`elif` checks another condition; `else` is the catch-all when nothing else matched.

### Kid Meaning
"IF happy... ELIF sad... ELIF angry... ELSE I'm not sure." Exactly one reply is
chosen.

### Chatbot Connection
This is the chatbot's brain: a different emoji reply for each mood.

### The Code
```python
mood = input("How do you feel? ").lower().strip()
if mood == "happy":
    print("😄 That's wonderful!")
elif mood == "sad":
    print("🤗 I'm here for you.")
elif mood == "angry":
    print("😤 Take a deep breath. You've got this.")
else:
    print("🙂 Thanks for sharing.")
```

### Line by Line
- We tidy the mood first so matching is reliable.
- Each `elif` checks another mood.
- `else` handles any mood we didn't list — so the chatbot never stays silent.
- Only ONE block runs.

### Your Turn
1. Build this and try "happy", "sad", "angry", "sleepy".
2. Add TWO more moods of your own (e.g. "excited", "tired") with their own emojis.
3. This is almost the whole chatbot brain — see how close we are!

### Check Your Brain
- What does `elif` mean?
- When does `else` run?

### More Examples
The bot reacting to a NUMBER with elif — checks run top to bottom and stop at the first true one:

```python
energy = int(input("Bot energy level (0-100)? "))
if energy >= 80:
    print("🔋 Fully charged! Let's gooo!")
elif energy >= 40:
    print("😐 Doing okay, could use a snack.")
elif energy >= 10:
    print("🥱 Getting sleepy...")
else:
    print("💤 Zzz... plug me in please.")
```

A snack-advisor bot:

```python
hungry = input("Are you hungry - yes or no? ").lower().strip()
if hungry == "yes":
    print("🍌 Banana time! Brain food!")
elif hungry == "no":
    print("👍 Great - let's keep coding!")
else:
    print("🤔 I'll take that as a maybe...")
```

### Common Mistakes
- **`elif` with no `if` above it:** the chain must START with `if` → otherwise `SyntaxError`.
- **`else` with a condition:** `else mood == "tired":` → `SyntaxError`. `else` takes nothing — it IS the "everything else".
- **Wrong order in number checks:** if `energy >= 10` is checked FIRST, an energy of 95 prints the sleepy message! Strongest check goes first — the computer stops at the first true.

### Level Up 🚀
Give your mood bot a personality: add FIVE moods, each with its own emoji AND a follow-up question (like "😄 Wonderful! What made today so good?"). A bot that asks back feels twice as alive — that's a real chatbot design secret.

---

## Lesson 11: True and False (Booleans)

### Big Idea
A condition is always either **True** or **False** — these are special values.

### Kid Meaning
Like a light switch: on or off. Yes or no. Nothing in between.

### Chatbot Connection
"Did the player say bye?" is a yes/no fact the chatbot checks every turn.

### The Code
```python
mood = "happy"
print(mood == "happy")
print(mood == "sad")
```

### Line by Line
- `mood == "happy"` — the computer works this out as `True`.
- `mood == "sad"` — this is `False`.
- `True` and `False` have no quotes — they are special, not words.

### Your Turn
1. Print whether `"cat" == "cat"` (predict first).
2. Print whether `"cat" == "dog"`.
3. Make `said_bye = (mood == "bye")` and print it.

### Check Your Brain
- The only two boolean values?
- Is `"hi" == "hi"` True or False?

### More Examples
Booleans can live in boxes, like any value:

```python
mood = "happy"
is_happy = (mood == "happy")
print(is_happy)            # True
```

Combine checks with `and` / `or` — just like English:

```python
mood = "happy"
battery = 90
print(mood == "happy" and battery > 50)   # True - BOTH true
print(mood == "sad" or battery > 50)      # True - at least ONE true
```

`not` flips a boolean upside down:

```python
said_bye = False
print(not said_bye)    # True - "they have NOT said bye"
```

### Common Mistakes
- **Quotes around True:** `is_happy = "True"` makes a WORD, not a boolean. The real ones are bare with capitals: `True`, `False`.
- **Lowercase true:** `true` → `NameError: name 'true' is not defined`.
- **Capitals fool comparisons:** `"Hi" == "hi"` is `False`! Computers see capital H and small h as different letters — that's exactly why our chatbot tidies text with `.lower()` first.

### Level Up 🚀
Boolean detective: WITHOUT running, write True or False for each line — then run to mark your own test:

```python
print("bye" == "bye")
print("Bye" == "bye")
print(5 > 3 and 2 > 7)
print(5 > 3 or 2 > 7)
print(not ("cat" == "cat"))
```

Score 5/5 and you officially think like a computer. 🤖

---

## Lesson 12: Repeating with while Loops

### Big Idea
A `while` loop repeats lines again and again, as long as a condition stays True.

### Kid Meaning
"WHILE the music plays, keep dancing." When the music stops (false), you stop.

### Chatbot Connection
The chatbot keeps chatting WHILE you haven't said "bye".

### The Code
```python
count = 1
while count <= 3:
    print(f"Message number {count}")
    count = count + 1
print("Done chatting!")
```

### Line by Line
- `while count <= 3:` — keep looping while count is 3 or less (`<=` means "less
  than or equal to").
- The indented lines run each time around.
- `count = count + 1` — VERY important: it moves the count up so the loop
  eventually stops. Without it, the loop runs forever!
- `print("Done chatting!")` is not indented, so it runs once after the loop.

### Your Turn
1. Make a loop that prints "Hello" 5 times.
2. Count down from 5 to 1 (start at 5, subtract 1 each time).
3. Why must something change inside the loop?

### Check Your Brain
- What does a `while` loop do?
- Why must the condition eventually become False?

### More Examples
A countdown to blast-off — loops go down too:

```python
count = 5
while count > 0:
    print(f"{count}...")
    count = count - 1
print("BLAST OFF! 🚀")
```

A bot charging its battery in steps:

```python
battery = 20
while battery < 100:
    print(f"Charging... {battery}%")
    battery = battery + 20
print("🔋 Fully charged!")
```

Loops can draw — `"⭐" * row` repeats the star `row` times:

```python
row = 1
while row <= 4:
    print("⭐" * row)
    row = row + 1
```

### Common Mistakes
- **The forever loop:** forget `count = count + 1` and the condition never turns False — the program spins forever! **Fix:** every `while` needs a line that moves it toward stopping. (If it happens: press the STOP button or Ctrl+C. Every coder alive has done this at least once.)
- **Moving the wrong way:** subtracting when the loop needs the number to GROW also loops forever. Check the direction.
- **Indenting the after-line:** if `print("Done chatting!")` is indented, it prints EVERY lap instead of once at the end.

### Level Up 🚀
"Emoji rain": ask how many rows (`int(input(...))`), then loop printing `"💧" * row` from 1 up to that number — a growing rain triangle, sized by the player. You just combined input + loops + text-times — three lessons in four lines.

---

## Lesson 13: The Chat Loop — Keep Talking Until "bye"

### Big Idea
We can ask the player something inside a loop, again and again, until they type a
stop word.

### Kid Meaning
The chatbot keeps the conversation going until you choose to leave.

### Chatbot Connection
This is the exact shape of a real chatbot conversation.

### The Code
```python
message = ""
while message != "bye":
    message = input("Say something (or 'bye' to leave): ").lower().strip()
    print(f"You said: {message}")
print("👋 Bye for now!")
```

### Line by Line
- `message = ""` — start with empty text so the loop can begin.
- `while message != "bye":` — keep going while the message is NOT "bye". `!=` means
  "is not equal to".
- We tidy each message so "Bye" and "BYE" also work.
- Type "bye" → condition becomes false → loop ends → farewell.

### Your Turn
1. Build this and chat, then type "bye".
2. Change the stop word to "exit".
3. Count how many messages were typed before leaving (use a counter variable!).

### Check Your Brain
- What does `!=` mean?
- Why did we set `message = ""` before the loop?

### More Examples
An echo bot with attitude — it repeats you but in CAPITALS:

```python
words = ""
while words != "bye":
    words = input("You: ").lower().strip()
    print(f"EchoBot: {words.upper()}!!!")
print("EchoBot: 👋 BYEEEE!")
```

Count the messages — a counter riding inside the chat loop:

```python
message = ""
chats = 0
while message != "bye":
    message = input("Say something: ").lower().strip()
    chats = chats + 1
print(f"We exchanged {chats} messages today!")
```

A quiz that repeats until correct — the same skeleton, different job:

```python
answer = ""
while answer != "python":
    answer = input("Which language are we learning? ").lower().strip()
print("🎉 Correct! You may pass!")
```

### Common Mistakes
- **Starting box equals the stop word:** `message = "bye"` before the loop → condition is False immediately, loop NEVER runs. Start with `""`.
- **input() outside the loop:** asking before the `while` means one question, then the same answer spins forever. The `input` goes INSIDE.
- **Forgetting the tidy:** player types `BYE` but you compare to `"bye"` — the loop keeps going! `.lower().strip()` saves the day again.

### Level Up 🚀
"The Polite Doorbot": it keeps asking "What's the password?" until the player types `mango`. BUT — count the tries, and make the bot's patience wear out in its replies: try 1 → "Hmm, nope!", try 2 → "Still no...", try 3+ → "😤 REALLY now?!" (use ifs on the counter inside the loop). Personality through code — that's chatbot craft.

---

## Lesson 14: Functions — Reusable Reply Machines

### Big Idea
A function is named code you can run again by calling its name.

### Kid Meaning
Like a kettle: you don't rebuild it each time — you just press the button. A
function is code you can re-use by name.

### Chatbot Connection
A `divider()` function can print a neat line anywhere, without retyping it.

### The Code
```python
def divider():
    print("-" * 25)

divider()
print("Mood Buddy")
divider()
```

### Line by Line
- `def divider():` — `def` means "define a machine called divider".
- The indented line is the machine's job.
- `divider()` — press the button. We called it twice, so it ran twice.

### Your Turn
1. Make a `welcome()` function that prints a two-line intro and call it.
2. Make a `bye()` function and call it at the end of a program.

### Check Your Brain
- What word defines a function?
- What does it mean to "call" a function?

### More Examples
A bot with several "moves" — each one a function in its toolbox:

```python
def wave():
    print("🤖 *waves hello*")

def dance():
    print("🤖 *spins around* 🕺")
    print("🤖 *does the robot* (obviously)")

wave()
dance()
wave()
```

Functions can contain loops — tools combine:

```python
def triple_beep():
    n = 1
    while n <= 3:
        print("Beep!")
        n = n + 1

triple_beep()
```

A divider with style options coming from a tiny change inside:

```python
def fancy_divider():
    print("✨" + "=" * 23 + "✨")

fancy_divider()
print("   MOOD BUDDY MENU")
fancy_divider()
```

### Common Mistakes
- **Defining but never calling:** you write `def dance():` and... nothing happens on Run. Defining builds the machine; `dance()` presses the button.
- **Calling above the definition:** `dance()` BEFORE `def dance():` → `NameError`. Python reads top to bottom — define first, call after.
- **No brackets when calling:** `dance` alone (no `()`) does nothing visible. The `()` is the button-press.

### Level Up 🚀
Build a "Bot Performance": three functions — `intro()`, `joke()`, `bow()` — then call them in show order. Then re-order the calls WITHOUT touching the functions and watch the whole show rearrange. One-line changes redirecting a whole program: that's the power functions give you.

---

## Lesson 15: Functions That Take Information (Parameters)

### Big Idea
Functions can accept inputs (called parameters) so they work with different values.

### Kid Meaning
A toaster works on whatever bread you give it. A function works on whatever value
you hand it.

### Chatbot Connection
A `greet(name)` function can welcome ANY player by name, not just one.

### The Code
```python
def greet(name):
    print(f"Hello {name}! Welcome to the chat.")

greet("Akua")
greet("Yaw")
```

### Line by Line
- `def greet(name):` — this machine needs one thing: a `name`.
- Inside, `name` stands for whatever we hand over.
- `greet("Akua")` — run it with "Akua". Then again with "Yaw". Same machine,
  different results.

### Your Turn
1. Make a function `cheer(name)` that prints "Well done, NAME!" using the name.
2. Call it with two different names.

### Check Your Brain
- What is a parameter?
- Why is `greet(name)` better than writing a new print for every player?

### More Examples
A function taking a NUMBER:

```python
def battery_report(level):
    print(f"🔋 Battery at {level}%")
    print(f"   {level // 10} bars showing")

battery_report(80)
battery_report(25)
```

(`//` divides and DROPS the decimal — 25 // 10 gives 2 whole bars.)

Two parameters at once — name AND mood:

```python
def mood_card(name, mood):
    print("-" * 22)
    print(f"  {name} feels {mood}")
    print("-" * 22)

mood_card("Akua", "happy")
mood_card("Yaw", "sleepy")
```

A parameter driving a loop — the chant machine:

```python
def cheer(name, times):
    count = 0
    while count < times:
        print(f"Go {name}!")
        count = count + 1

cheer("Class 5", 3)
```

### Common Mistakes
- **Calling with nothing:** `greet()` when it needs a name → `TypeError: greet() missing 1 required positional argument: 'name'`. The machine needs its ingredient!
- **Swapped order:** `mood_card("happy", "Akua")` prints "happy feels Akua" — no error, just nonsense. First value → first parameter.
- **Using the parameter outside:** `print(name)` at the bottom of the file → `NameError`. Parameters live only INSIDE their function, like ingredients that exist only in the kitchen.

### Level Up 🚀
Write `emoji_line(emoji, count)` that prints the emoji repeated `count` times (hint: `emoji * count`). Then decorate your whole bot screen with calls like `emoji_line("🌟", 10)` and `emoji_line("🎈", 7)`. One tiny machine, infinite decorations.

---

## Lesson 16: Functions That Give an Answer Back (return)

### Big Idea
A function can `return` a value — hand an answer back so we can use it.

### Kid Meaning
Like asking a friend a question and getting an answer you can then use, not just
hear once.

### Chatbot Connection
A `mood_reply(mood)` function can work out the right message and hand it back to be
printed.

### The Code
```python
def mood_reply(mood):
    if mood == "happy":
        return "😄 Yay!"
    elif mood == "sad":
        return "🤗 Sending a hug."
    else:
        return "🙂 Thanks for sharing."

message = mood_reply("happy")
print(message)
```

### Line by Line
- `def mood_reply(mood):` — takes a mood as input (a parameter).
- `return "..."` — hands a message back AND stops the function there.
- `message = mood_reply("happy")` — catch the returned message in a box.
- Then we `print(message)`.

### Your Turn
1. Add an "angry" reply to `mood_reply`.
2. Call it with "sad" and print the result.
3. What's the difference between a function that `print`s and one that `return`s?

### Check Your Brain
- What does `return` do?
- Why catch the result in a variable?

### More Examples
A returned answer can be USED, not just printed — that's the superpower:

```python
def double(number):
    return number * 2

result = double(5)
print(result)              # 10
print(double(result))      # 20 - feed it back in!
```

Return a built sentence:

```python
def make_greeting(name):
    return f"Welcome back, {name}! We missed you. 💙"

line = make_greeting("Esi")
print(line)
print(line)    # use it twice - it's saved in the box!
```

print vs return, side by side — feel the difference:

```python
def shouter(word):
    print(word.upper())     # prints, but hands back nothing

def returner(word):
    return word.upper()     # hands the result back

shouter("hi")                  # HI appears
caught = returner("hi")        # nothing appears yet...
print(caught + "!!!")          # HI!!! - we got to USE it first
```

### Common Mistakes
- **Forgetting to catch the return:** `mood_reply("happy")` on its own line — the message is returned… into thin air! Catch it: `msg = mood_reply("happy")` or print it directly.
- **Code after return:** anything below `return` inside the function NEVER runs — return exits immediately. Python may not even warn you.
- **Returning vs printing confusion:** if your function prints AND you print its result, you may see `None` — that's Python saying "this function handed nothing back". Pick one job per function.

### Level Up 🚀
Build `emoji_for(mood)` that RETURNS just an emoji ("happy" → "😄", "sad" → "😢", else "🙂"). Then compose it inside an f-string: `print(f"Your mood badge: {emoji_for(mood)}")`. Functions feeding f-strings — that's exactly how the polished final chatbot will be wired.

---

# PART 3 — BUILDING THE CHATBOT

---

## Lesson 17: Greeting and Remembering the Name

### Big Idea
Start the real chatbot: greet, ask the name, remember it.

### Kid Meaning
A good buddy learns your name first.

### Chatbot Connection
This is the opening of Mood Buddy.

### The Code
```python
def divider():
    print("=" * 28)

divider()
print("   MOOD BUDDY 🤖")
divider()
name = input("Hi! What's your name? ").strip()
print(f"Great to meet you, {name}! 😊")
```

### Line by Line
- A `divider()` function for neat lines (Lesson 14).
- Ask and `.strip()` the name.
- Greet warmly with an f-string.

### Your Turn
1. Build this opening and run it.
2. Make the title and emoji your own.

### Check Your Brain
- Why `.strip()` the name?
- Why put the divider in a function?

### More Examples
Level up the opening with `.title()` so any typing becomes a neat name:

```python
name = input("Hi! What's your name? ").strip().title()
print(f"Great to meet you, {name}! 😊")    # "aMA  " becomes "Ama"
```

A welcome that reacts to the name's length — tiny detail, big charm:

```python
name = input("What's your name? ").strip().title()
if len(name) > 8:
    print(f"Wow, {name} - what a grand name!")
else:
    print(f"{name} - short and mighty! 💪")
```

(`len(name)` counts the letters — a handy little measuring tape for text.)

A two-line "thinking" effect before greeting (chatbots feel alive when they pause):

```python
print("...")
print("...")
print(f"Initializing friendship with {name}... DONE! 🤝")
```

### Common Mistakes
- **Tidying with `.lower()` here:** the NAME should keep its capital — `.strip().title()` for names, `.lower()` for moods. Different jobs, different tidying.
- **Asking for the name inside the chat loop (coming soon):** then it asks every turn! Names are asked ONCE, before the loop.
- **Hard-coding the name:** `print("Great to meet you, Esi!")` works only for Esi. The `{name}` box makes it work for everyone — that's the whole point.

### Level Up 🚀
Give Mood Buddy a birth certificate: after greeting, the bot introduces ITSELF — name, age in days (make one up with maths), favourite emoji, and one funny fear ("I fear the OFF switch 😱"). Bots with character get chatted to for twice as long — true in real chatbot design!

---

## Lesson 18: Matching Many Words with a List and in

### Big Idea
A **list** holds many values in one box; `in` checks whether something is inside it.

### Kid Meaning
People say "happy", "glad", "good" — all mean happy. Instead of many `if`s, we keep
a "happy list" and ask once: "is the mood in my happy list?"

### Chatbot Connection
This lets the chatbot understand lots of words for the same feeling.

### The Code
```python
mood = input("How do you feel? ").lower().strip()
happy_words = ["happy", "glad", "good", "great"]
if mood in happy_words:
    print("😄 Love that energy!")
else:
    print("🙂 Thanks for telling me.")
```

### Line by Line
- `["happy", "glad", "good", "great"]` — a **list**: many words in one box, inside
  square brackets, separated by commas.
- `mood in happy_words` — True if the mood is ANY item in that list.
- One check handles four words!

### Your Turn
1. Make a `sad_words` list ("sad", "down", "blue", "bad") and reply kindly if the
   mood is in it.
2. Add the `sad_words` check using `elif`.
3. Why is a list better than four separate `if`s for the same idea?

### Check Your Brain
- What is a list? How do you write one?
- What does `in` check?

### More Examples
Lists hold anything — try printing whole lists and single items:

```python
fruits = ["mango", "banana", "pawpaw"]
print(fruits)        # the whole list
print(fruits[0])     # "mango" - the FIRST item is number 0!
print(fruits[2])     # "pawpaw" - counting starts at zero
```

Yes — Python counts from 0. Weird at first, then totally normal. You can also add to a list while the program runs:

```python
moods_today = []
moods_today.append("happy")
moods_today.append("excited")
print(moods_today)            # ['happy', 'excited']
print(len(moods_today))       # 2 - how many things inside
```

`in` works on any list — a guest-list bouncer:

```python
vip = ["ama", "kofi", "esi"]
guest = input("Name? ").lower().strip()
if guest in vip:
    print("🎉 Welcome to the party!")
else:
    print("🚪 Sorry, not on the list...")
```

### Common Mistakes
- **Round brackets:** `happy_words = ("happy", "glad")` makes a different thing (a tuple). Lists use SQUARE brackets `[ ]`.
- **Missing commas:** `["happy" "glad"]` silently GLUES into `["happyglad"]` — one weird item, no error! Commas between every item.
- **Checking the untidied word:** `"Happy" in happy_words` is False — the list has lowercase words. Tidy before checking (the lesson code does this — keep that habit).

### Level Up 🚀
Build a "mood collector": start `moods_shared = []`, and in a small loop, `append` each mood the player types until "done". Then print `f"You felt {len(moods_shared)} things today: {moods_shared}"`. You're now storing a whole conversation history — a real chatbot memory!

---

## Lesson 19: The Mood Brain as a Function

### Big Idea
Put the mood matching inside `mood_reply()` so the chatbot's brain is tidy and
reusable.

### Kid Meaning
We pack all the feeling-replies into one machine we can press any time.

### Chatbot Connection
This is the brain the finished chatbot will use every turn.

### The Code
```python
def mood_reply(mood):
    happy_words = ["happy", "glad", "good", "great"]
    sad_words = ["sad", "down", "blue", "bad"]
    if mood in happy_words:
        return "😄 That's wonderful!"
    elif mood in sad_words:
        return "🤗 I'm here for you."
    elif mood == "angry":
        return "😤 Breathe slowly — you've got this."
    else:
        return "🙂 Thanks for sharing how you feel."

mood = input("How do you feel today? ").lower().strip()
print(mood_reply(mood))
```

### Line by Line
- `mood_reply` uses lists + `in` (Lesson 18) to match many words.
- It `return`s the right message (Lesson 16).
- We tidy the mood, then print whatever the function returns.

### Your Turn
1. Build this and try happy/sad/angry words.
2. Add an "excited" mood and a "tired" mood inside the function.
3. Why is the brain easier to manage as one function?

### Check Your Brain
- Why use lists inside the function?
- What does `print(mood_reply(mood))` do in one line?

### More Examples
Make the brain RANDOM so replies never repeat — `random.choice` picks one item from a list (the bot instantly feels twice as alive):

```python
import random

def mood_reply(mood):
    happy_words = ["happy", "glad", "good", "great"]
    if mood in happy_words:
        return random.choice([
            "😄 That's wonderful!",
            "🌞 You're glowing today!",
            "🎉 Love that for you!",
        ])
    else:
        return "🙂 Thanks for sharing."

print(mood_reply("happy"))
print(mood_reply("happy"))   # run twice - probably different!
```

Test a brain the way pros test code — fire many moods at it:

```python
for test_mood in ["happy", "sad", "angry", "confused"]:
    print(test_mood, "->", mood_reply(test_mood))
```

(`for ... in list` is a loop that visits each item — a cousin of `while` you'll use a lot next year.)

### Common Mistakes
- **Lists outside, function can't see edits:** keep the word-lists INSIDE the function so the whole brain travels together — one machine, fully packed.
- **Forgetting `return` on a branch:** if "angry" has no `return`, `mood_reply("angry")` hands back `None` and the bot prints `None` — looks broken! Every branch needs its return.
- **Checking `mood in "happy"`:** backwards! That checks letters inside the WORD "happy". You want `mood in happy_words` — item in LIST.

### Level Up 🚀
Grow the brain to FIVE feelings, each matching at least 3 words, each with 2+ random replies. Then run the pro test loop above on all your words. A brain this rich is genuinely better than some real commercial bots from a few years ago. Seriously.

---

## Lesson 20: Putting It in a Chat Loop (with kindness)

### Big Idea
Wrap the mood chat in a loop so you can share many feelings until "bye", and handle
empty answers gently with `continue`.

### Kid Meaning
A real conversation, not just one question — and a buddy that asks again if you say
nothing.

### Chatbot Connection
The heart of the finished chatbot.

### The Code
```python
def mood_reply(mood):
    happy_words = ["happy", "glad", "good", "great"]
    sad_words = ["sad", "down", "blue", "bad"]
    if mood in happy_words:
        return "😄 That's wonderful!"
    elif mood in sad_words:
        return "🤗 I'm here for you."
    elif mood == "angry":
        return "😤 Breathe slowly — you've got this."
    else:
        return "🙂 Thanks for sharing."

name = input("What's your name? ").strip()
print(f"Hi {name}! Tell me your moods. Say 'bye' to leave.")

mood = ""
while mood != "bye":
    mood = input("How do you feel? ").lower().strip()
    if mood == "":
        print("I didn't catch that — try a word like 'happy'.")
        continue          # skip the rest and ask again
    if mood != "bye":
        print(mood_reply(mood))

print(f"👋 Bye {name}, take care!")
```

### Line by Line
- Greet by name once, OUTSIDE the loop.
- `if mood == "":` — if they typed nothing, say so and `continue` (jump back to ask
  again), so blanks never cause trouble.
- `if mood != "bye":` — don't run a mood reply for the word "bye" itself.
- Farewell uses the remembered name.

### Your Turn
1. Build this and have a full chat, including pressing Enter on an empty line.
2. Why do we check `if mood != "bye":` before replying?
3. What does `continue` do?

### Check Your Brain
- What ends the chat loop?
- Why greet by name OUTSIDE the loop?

### More Examples
Use the name INSIDE replies sometimes — friends use your name:

```python
if mood != "bye":
    print(f"{name}, here's my reply: {mood_reply(mood)}")
```

A "Buddy:" prefix makes the chat look like a real messaging app:

```python
print(f"Buddy: {mood_reply(mood)}")
```

Gentle nudges when the same mood repeats — remember the last mood in a box:

```python
last_mood = ""
# inside the loop, after getting a real mood:
if mood == last_mood:
    print("Buddy: Still feeling that way? I'm listening. 💙")
else:
    print("Buddy:", mood_reply(mood))
last_mood = mood
```

### Common Mistakes
- **Greeting inside the loop:** "Hi Esi!" before every single mood — sweet once, weird the fifth time. One-time things live OUTSIDE.
- **Forgetting `continue` after the empty-check:** without it, the empty text falls through to `mood_reply("")` and gets the confused else-reply. `continue` skips the rest properly.
- **Checking `mood != "bye"` BEFORE tidying:** if the check happens before `.lower()`, typing "Bye" doesn't end the chat. Tidy first, check after — order is everything.

### Level Up 🚀
Add a "mood streak": if the player gives 3 happy-family moods in a row, the bot throws a mini party (`"🎊 THREE happy moods - party mode!"` + emoji line). Track a `streak` counter that resets on non-happy moods. Streaks are the secret sauce of every app you love — now you can build them.

---

## Lesson 21: A Few Smart Answers (Questions)

### Big Idea
The chatbot can answer simple questions too, by spotting keywords with `in`.

### Kid Meaning
A buddy that can also reply to "what is your name?" feels clever.

### Chatbot Connection
Adds a little extra intelligence to Mood Buddy.

### The Code
```python
def answer(text):
    if "your name" in text:
        return "I'm Mood Buddy, your friendly helper! 🤖"
    elif "joke" in text:
        return "Why did the computer go to school? To improve its 'byte'! 😄"
    else:
        return None     # None means "I have no special answer"

reply = answer("tell me a joke")
if reply is not None:
    print(reply)
```

### Line by Line
- `answer(text)` looks for keywords; `in` here checks if a word appears ANYWHERE in
  the sentence.
- It `return`s a special reply, or `None` if it has nothing special.
- `if reply is not None:` — only print when there really is a special answer.
- `None` is Python's word for "nothing here".

### Your Turn
1. Add one more question the bot can answer (e.g. contains "favourite colour").
2. Test it with a sentence containing that keyword.
3. What does returning `None` let us do?

### Check Your Brain
- What does `in` check inside a sentence?
- What does `None` mean?

### More Examples
`in` searches anywhere in the sentence — all three of these find it:

```python
print("joke" in "tell me a joke")        # True
print("joke" in "joke please!")          # True
print("joke" in "I love jokes")          # True - "joke" is inside "jokes"!
print("joke" in "make me laugh")         # False - word not there
```

More smart answers — each `elif` is a new skill for your bot:

```python
def answer(text):
    if "your name" in text:
        return "I'm Mood Buddy! 🤖"
    elif "how old" in text:
        return "I was born this term - so VERY young and VERY clever."
    elif "thank" in text:
        return "Anytime, friend! 💙"
    elif "joke" in text:
        return "What do you call a computer that sings? A-Dell! 🎤"
    else:
        return None
```

Why `None` is the perfect "no answer" — you can test for it:

```python
print(answer("tell me a joke"))    # the joke
print(answer("blah blah"))         # None - nothing special found
```

### Common Mistakes
- **`== ` instead of `in`:** `if text == "joke":` only matches the EXACT word "joke" alone — "tell me a joke" fails! `in` finds it anywhere.
- **Returning `"None"` in quotes:** that's the WORD None, which counts as a real answer — your else-replies stop working. Bare `None`, no quotes.
- **`if reply:` vs `if reply is not None:`** — both work here, but learn `is not None` first: it says exactly what you mean.

### Level Up 🚀
Teach your bot FIVE questions, including one about YOUR school ("credent" in text → a proud reply!) and one that returns a random joke from a list (`random.choice` + Lesson 19). A bot that surprises you with different jokes? People will keep poking it to find them all.

---

## Lesson 22: The Full Chatbot — Moods AND Questions

### Big Idea
Combine mood replies and question answers in one chat loop.

### Kid Meaning
Now the buddy understands feelings AND simple questions — a real little chatbot!

### Chatbot Connection
This is your complete Emoji Mood Chatbot.

### The Code
```python
def mood_reply(mood):
    happy = ["happy", "glad", "good", "great"]
    sad = ["sad", "down", "blue", "bad"]
    if mood in happy:
        return "😄 That's wonderful!"
    elif mood in sad:
        return "🤗 I'm here for you."
    elif mood == "angry":
        return "😤 Breathe slowly — you've got this."
    else:
        return "🙂 Thanks for sharing."

def answer(text):
    if "your name" in text:
        return "I'm Mood Buddy! 🤖"
    elif "joke" in text:
        return "Why was the computer cold? It left its Windows open! 😄"
    else:
        return None

name = input("What's your name? ").strip()
print(f"Hi {name}! Chat with me. Say 'bye' to leave.")

text = ""
while text != "bye":
    text = input("You: ").lower().strip()
    if text == "":
        print("Buddy: Say something? 🙂")
        continue
    if text == "bye":
        break
    special = answer(text)
    if special is not None:
        print("Buddy:", special)
    else:
        print("Buddy:", mood_reply(text))

print(f"👋 Bye {name}, talk soon!")
```

### Line by Line
- Two helper functions: `mood_reply` and `answer`.
- The loop reads what the player types.
- Empty? Ask again with `continue`. Said "bye"? `break` (stop the loop now).
- If there's a special `answer`, use it; otherwise treat the text as a mood.
- `break` is a new word: it immediately leaves the loop.

### Your Turn
1. Build the full chatbot and have a real conversation.
2. What's the difference between `break` and `continue`?
3. Add one new mood AND one new question of your own.

### Check Your Brain
- When do we use `answer()` vs `mood_reply()`?
- What does `break` do?

### More Examples
`break` vs `continue` — the two loop controls, side by side:

```python
n = 0
while n < 10:
    n = n + 1
    if n == 3:
        continue      # skip JUST this lap (3 won't print)
    if n == 6:
        break         # smash out of the loop entirely
    print(n)
# prints: 1 2 4 5  - no 3 (skipped), stops before 6 (broke out)
```

Make the bot feel alive with a tiny pause — `time.sleep(1)` waits one second:

```python
import time

print("Buddy is typing", end="")
time.sleep(1)
print(".", end="")
time.sleep(1)
print(". 🤖")
```

A help command, so players know what the bot can do:

```python
if text == "help":
    print("Buddy: Tell me a mood (happy/sad/angry),")
    print("       ask my name, or say 'joke'. 'bye' to leave.")
    continue
```

### Common Mistakes
- **`break` outside a loop:** → `SyntaxError: 'break' outside loop`. It only means something inside `while` (or `for`).
- **Question-words caught as moods:** type "what is your name" without the `answer()` check first and the bot replies "🙂 Thanks for sharing" — nonsense! Order matters: check special answers BEFORE mood replies (the lesson code does this — keep it).
- **Two prints for one reply:** if you print in mood_reply AND print its return — `None` sneaks onto the screen. One job per function.

### Level Up 🚀
Add the `help` command AND the typing pause to your full chatbot. Then run a "Turing test": let a friend chat for one minute and ask them to rate how alive Buddy feels out of 10. Add one feature and test again — did the score go up? Congratulations: that's a real product-improvement loop.

---

## Lesson 23: Making It Friendlier — Counting and Caring

### Big Idea
Track how many moods were shared and give a caring summary at the end.

### Kid Meaning
A buddy that remembers the whole chat feels extra kind.

### Chatbot Connection
Adds a warm ending to the conversation.

### The Code
```python
shared = 0
# ...inside your chat loop, after a real mood reply:
shared = shared + 1
# ...after the loop:
print(f"You shared {shared} feelings with me today. Thank you! 💙")
```

### Line by Line
- `shared = 0` before the loop — a counter (Lesson 5).
- `shared = shared + 1` each time a real mood is replied to.
- After the loop, an f-string thanks them with the count.

### Your Turn
1. Add the counter to your chatbot and show the total at the end.
2. If `shared` is 0, print "We didn't chat much — come back soon!" instead.
3. Add a different goodbye if they shared more than 5 feelings.

### Check Your Brain
- Where does `shared = shared + 1` go?
- Why use an f-string for the summary?

### More Examples
A summary that *reacts* to the count — if/elif on your own statistic:

```python
if shared == 0:
    print("We barely chatted - come back soon! 🥺")
elif shared <= 3:
    print(f"You shared {shared} feelings. A lovely little chat! 💙")
else:
    print(f"WOW - {shared} feelings! You're a sharing superstar! 🌟")
```

Remember the moods themselves, not just the count (Lesson 18's append):

```python
moods_list = []
# inside the loop, after a real mood:
moods_list.append(mood)
# after the loop:
print(f"Today you felt: {moods_list}")
```

A caring touch — count SAD moods separately and check in at the end:

```python
sad_count = 0
# inside the loop, when the mood was in sad_words:
sad_count = sad_count + 1
# after the loop:
if sad_count >= 2:
    print("You had some heavy feelings today. Be kind to yourself. 🫂")
```

### Common Mistakes
- **Counting "bye" as a feeling:** put `shared = shared + 1` only on the real-mood path, AFTER the bye-check and empty-check.
- **Resetting inside the loop:** `shared = 0` inside the while wipes the count every lap. Starting values live BEFORE the loop.
- **Plural problems:** "You shared 1 feelings" — oops! Fix with an if, or the slick one-liner: `f"{shared} feeling{'s' if shared != 1 else ''}"` (ask your teacher to unpack that trick).

### Level Up 🚀
Build a full "chat report card": total moods, the list of moods, the most common one (try `max(moods_list, key=moods_list.count)` — a spicy one-liner!), and a kind sign-off. Print it in a bordered box. Data + kindness = the heart of every great wellbeing app.

---

## Lesson 24: Showcase and Reflection

### Big Idea
You built a real chatbot from nothing — celebrate and share it.

### Kid Meaning
From zero to a talking, feeling-aware buddy. Be proud!

### Chatbot Connection
This is your finished Emoji Mood Chatbot — greeting, name memory, mood replies,
question answers, chat loop, and a caring summary.

### The Code
```python
# This is YOUR finished chatbot. Read every line top to bottom and
# make sure you can explain it. That's how you know you've truly learned it.
```

### Line by Line
- Open your full chatbot file and explain each line out loud.
- Any fuzzy line → revisit the lesson that taught it.

### Your Turn (Showcase)
1. Let your class or family chat with your bot.
2. Explain THREE lines of your code to them.
3. Pick ONE upgrade you'd add next (more moods, save the chat, a typing delay) and
   describe how it might work.
4. Brilliant — you're now a beginner Python chatbot-maker! 🎉

### Check Your Brain
- What was your favourite part to build?
- Explain what a variable, an `if`, a loop, a function with `return`, and a list
  each do.
- What's one thing you understand now that you didn't 4 months ago?

### Look How Far You've Come 🏆
Four months ago you had never written a line of code. Today your chatbot uses ALL of this — read it out loud and feel proud:

- **print & f-strings** — the bot talks beautifully (Lessons 1, 7)
- **variables** — it remembers names and moods (Lessons 3, 5)
- **input + .lower()/.strip()** — it listens and forgives messy typing (Lessons 6, 8)
- **if / elif / else** — it chooses the right reply (Lessons 9, 10)
- **while loops + break/continue** — it holds a whole conversation (Lessons 12, 13, 22)
- **functions + return** — its brain is tidy, reusable machinery (Lessons 14–16, 19)
- **lists + in** — it understands many words for one feeling (Lesson 18)
- **counters** — it remembers the whole chat and cares (Lessons 5, 23)

Those are the SAME building blocks inside WhatsApp bots, customer-service bots, and even the giant AI assistants — just stacked much higher. You now stand on the first floor of that tower.

### More Examples (Showcase ideas)
Three quick make-it-yours touches for demo day:

```python
# 1. A signed banner
print("MOOD BUDDY v1.0 - built by Esi, Class 5 🚀")
```

```python
# 2. A typing pause before each reply (import time at the top)
time.sleep(1)
```

```python
# 3. A grand farewell with stats
print(f"Buddy: {shared} feelings shared. You're brave, {name}. 💙")
```

### Common Mistakes (on showcase day!)
- **Last-minute edits:** if it works, FREEZE it. Pros call this a "code freeze" before launch.
- **Demo without a script:** pick the 3 lines you'll explain and practise saying them once.
- **Skipping the final test:** run ONE full chat before the audience — a mood, a joke request, an empty Enter, then "bye".

### Level Up 🚀 (your next adventure)
1. **Memory bot** — save the chat to a file so Buddy remembers you TOMORROW (Class 6 learns files!).
2. **Two-bot theatre** — make two bots chat with EACH OTHER on screen, line by line.
3. **Mood graph** — at the end, print a bar of emoji per mood: `happy 😄😄😄`, `sad 😢` — your first data visualisation.

You didn't just learn Python. You built a friend with it. See you in Class 6. 🤖💙