# Rock Paper Scissors Lessons: JHS 1 Edition

Build your own **Rock-Paper-Scissors game** — play against the computer! It makes a
secret choice, compares it with yours, tells you who won, keeps score over several
rounds, and crowns a champion at the end.

This project is for **JHS 1**, and it assumes you have **never coded before**. We
start from absolutely zero and explain every line in simple words, so you truly
understand it — not just copy it. By the end you'll have built a real, working game.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Game Connection** — how this fits our Rock-Paper-Scissors game.
- **The Code** — the actual Python to type.
- **Line by Line** — every important line explained.
- **Your Turn** — a small task YOU do to practise (the most important part!).
- **Check Your Brain** — quick questions to make sure it stuck.

Teach one lesson at a time: idea, code, then type and run it. **Always do "Your
Turn."** Understanding one lesson fully beats copying five.

**This course takes about 4 months** (about two lessons a week), in three parts:

- **Part 1 — First Steps (Lessons 1–8):** what code is, printing, variables, input,
  and f-strings, from zero.
- **Part 2 — Making Choices (Lessons 9–16):** decisions, comparing choices, random,
  loops, and functions.
- **Part 3 — Building the Game (Lessons 17–24):** assemble the real game, add
  scoring and rounds, then polish.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST STEPS

---

## Lesson 1: What Is Code? Saying Hello

### Big Idea
Code is a list of instructions we give the computer, one line at a time.

### Kid Meaning
A recipe tells a cook each step. Code tells the computer each step. It does EXACTLY
what you say.

### Game Connection
Our game "says" who won each round — it all starts with `print`.

### The Code
```python
print("Welcome to Rock, Paper, Scissors!")
print("Can you beat the computer?")
```

### Line by Line
- `print(...)` shows whatever is inside on the screen.
- Text in quotes `" "` is shown exactly.
- Each `print` is its own line.

### Your Turn
1. Print your own two-line welcome to the game.
2. Add a line with an emoji, like `print("Let's play! ✊✋✌️")`.
3. Run it.

### Check Your Brain
- What does `print` do?
- What do the quotes mark?

### More Examples
Predict each output BEFORE you run — reading code is half of coding:

```python
print("Best of three rounds.")
print("Winner takes the glory! 🏆")
```

The computer follows your order exactly — try rearranging these lines and see the story change:

```python
print("You step into the arena...")
print("The computer cracks its robot knuckles...")
print("FIGHT! ✊✋✌️")
```

`print()` with nothing makes an empty line — spacing is style:

```python
print("ROCK PAPER SCISSORS")
print()
print("...the ancient game of champions.")
```

### Common Mistakes
- **Missing quotes:** `print(Welcome)` → `NameError: name 'Welcome' is not defined`. Python thought Welcome was a variable. **Fix:** `print("Welcome")`.
- **Unclosed bracket:** `print("Hi"` → `SyntaxError: '(' was never closed`.
- **Capital P:** `Print("Hi")` → `NameError`. Python is case-sensitive — only `print` works.

### Level Up 🚀
Write a dramatic 6-line arena intro for your game — title banner, a challenger announcement (your name), and a taunt from the computer. Make someone laugh with the taunt. Code with personality gets played more.

---

## Lesson 2: How to Run Python

### Big Idea
We write code in a `.py` file and run it to see it work.

### Kid Meaning
Writing is like penning a letter; running is reading it aloud.

### Game Connection
You'll run your game again and again as you build it.

### The Code
```python
print("If you can see this, Python works!")
```

### Line by Line
- Save with a `.py` name, e.g. `rps.py`.
- Run from the editor's Run button, or type `python rps.py`.

### Your Turn
1. Save `practice.py` with one print line and run it.
2. Show a friend.

### Check Your Brain
- What ending must a Python file have?
- What does "running" mean?

### More Examples
Each `.py` file is a complete program. Make a couple:

```python
# file: countdown.py
print("3...")
print("2...")
print("1...")
print("SHOOT! ✊")
```

`#` lines are **comments** — notes the computer ignores. Sign your work like an engineer:

```python
# Rock Paper Scissors - built by Kwame, JHS 1
print("Game loading...")   # this part still shows
```

### Common Mistakes
- **Wrong extension:** `rps.txt` won't run as Python. Always `.py`.
- **Running without saving:** you'll see the OLD version's output. Ctrl+S then Run, every time — make it muscle memory.
- **Editing the wrong window:** code goes in the editor pane, not the output/terminal pane.

### Level Up 🚀
Create `rules.py` printing the three rules of RPS, each numbered. Then the edit-save-run cycle: change rule wording, save, run, repeat — three times fast. That cycle is the actual day-to-day life of every software developer on Earth.

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that stores a value for later.

### Kid Meaning
A box with a name sticker; say the name and the computer uses what's inside.

### Game Connection
The game remembers YOUR score and the COMPUTER's score in variables.

### The Code
```python
you_score = 0
computer_score = 0
print(you_score)
print(computer_score)
```

### Line by Line
- Two boxes, each holding 0.
- `print(you_score)` shows what's inside (0).
- Numbers need no quotes.

### Your Turn
1. Make a `player` variable with your name and print it.
2. Make a `rounds` variable set to 5 and print it.
3. Change `you_score` to 2 and print it.

### Check Your Brain
- What is a variable?
- Do numbers need quotes?

### More Examples
A match needs a full set of state boxes:

```python
player = "Kwame"
you_score = 0
computer_score = 0
rounds_to_play = 3
print(player)
print(rounds_to_play)
```

Boxes refill — the newest value wins:

```python
you_score = 0
print(you_score)    # 0
you_score = 2
print(you_score)    # 2 - the 0 is history
```

A box can copy another box — useful later for records:

```python
you_score = 5
best_ever = you_score
print(best_ever)    # 5
```

### Common Mistakes
- **Using before creating:** `print(you_score)` with no assignment above → `NameError: name 'you_score' is not defined`.
- **Inconsistent spelling:** `you_score` then `You_Score` → `NameError`. Exact match required, capitals included.
- **Quoted numbers:** `you_score = "0"` is a word; `"0" + 1` crashes with `TypeError`. Scores are numbers — no quotes.

### Level Up 🚀
Set up your game's complete opening state: `player`, `computer_name` (give the bot a menacing name!), `you_score = 0`, `computer_score = 0`, `rounds_to_play = 3`. Print a pre-match announcement using all five. Every esports broadcast starts with this exact info — yours now does too.

---

## Lesson 4: Numbers and Simple Maths

### Big Idea
The computer does maths fast and correctly.

### Kid Meaning
The computer is a super calculator.

### Game Connection
The game adds points to scores — that's maths.

### The Code
```python
you_score = 0
print(you_score + 1)
print(3 + 2)
print(3 * 2)
```

### Line by Line
- `+` adds, `-` subtracts, `*` multiplies (use `*`, not `x`).
- The computer works it out, then `print` shows it.

### Your Turn
1. Start `you_score = 0`, print it plus 3.
2. Print `10 - 4` and `4 * 5`.
3. Predict each first, then run.

### Check Your Brain
- Which symbol means "times"?
- What is `10 - 4`?

### More Examples
Match maths you'll really use — total rounds played:

```python
wins = 4
losses = 2
ties = 1
print(wins + losses + ties)    # 7 rounds played
```

Win percentage — the stat every gamer checks:

```python
wins = 3
rounds = 4
print(wins / rounds * 100)     # 75.0 percent!
```

Operator order: `*` and `/` before `+` and `-`; brackets overrule everything:

```python
print(1 + 2 * 3)        # 7
print((1 + 2) * 3)      # 9
```

### Common Mistakes
- **`x` for multiply:** `3 x 2` → `SyntaxError`. It's `*`.
- **Quoting the maths:** `print("3 + 2")` shows `3 + 2` — quotes mean "display literally".
- **Decimal surprise:** `print(7 / 2)` gives `3.5`, not 3. For whole-number division use `7 // 2` → `3`. Both have their uses — know which you want.

### Level Up 🚀
Tournament prize calculator: winning a round earns 10 points, a tie earns 3. Set `wins = 5` and `ties = 2`, then print the total prize points in one line. Add a "champion bonus" of 25 if it was a perfect run — calculate the perfect-run total too. (56 and 75 — did your code agree?)

---

## Lesson 5: Counting Score by Adding to a Variable

### Big Idea
Update a variable using its own value: `you_score = you_score + 1`.

### Kid Meaning
"Take what's in the box, add one, put it back" — like adding a point.

### Game Connection
Winning a round does `you_score = you_score + 1`.

### The Code
```python
you_score = 0
you_score = you_score + 1
print(you_score)
you_score = you_score + 1
print(you_score)
```

### Line by Line
- Start at 0, then add 1 each time.
- The box keeps the latest total.

### Your Turn
1. Start `you_score = 0`, add 1 three times, printing each time.
2. Do the same for `computer_score`.

### Check Your Brain
- What does `you_score = you_score + 1` do?
- If it's 2 and you add 1, what is it?

### More Examples
Both scoreboards moving — a match in fast-forward:

```python
you_score = 0
computer_score = 0
you_score = you_score + 1        # you take round 1!
computer_score = computer_score + 1   # bot strikes back
you_score = you_score + 1        # you again!
print(f"You {you_score} - {computer_score} Computer")
```

The `+=` shortcut — pros type this instead:

```python
you_score = 0
you_score += 1     # exactly the same as you_score = you_score + 1
you_score += 1
print(you_score)   # 2
```

Streak counters reset with plain `=`:

```python
streak = 3
streak = 0      # lost a round - streak over!
print(streak)
```

### Common Mistakes
- **No starting zero:** `you_score += 1` before `you_score = 0` exists → `NameError`.
- **Adding to the wrong score:** the bot wins but you typed `you_score += 1` — no error, just a quietly cheating game! Variable names matter; read them back.
- **Reversed assignment:** `you_score + 1 = you_score` → `SyntaxError`. Box on the LEFT.

### Level Up 🚀
Trace this without running it — write the final values of both boxes, then run to check:

```python
a = 0
b = 0
a += 2
b = a + 1
a = a * b
b -= 1
print(a, b)
```

Got both right? You're tracing like a debugger — the skill that finds bugs before they find you.

---

## Lesson 6: Asking the Player with input()

### Big Idea
`input()` asks a question and waits for the player to type.

### Kid Meaning
The computer asks, listens, and keeps your answer in a box.

### Game Connection
Each round, the game asks you to choose rock, paper, or scissors.

### The Code
```python
choice = input("Rock, paper, or scissors? ")
print("You chose:")
print(choice)
```

### Line by Line
- `input("...")` shows the question and waits.
- The typed answer is stored in `choice`.

### Your Turn
1. Ask the player's name and store it.
2. Ask their choice and print it.
3. Print both.

### Check Your Brain
- What does `input()` do after showing the question?
- Where does the answer go?

### More Examples
Several questions, several boxes — a pre-match interview:

```python
name = input("Challenger name? ")
catchphrase = input("Your battle cry? ")
print("Entering the arena: " + name + "!")
print('"' + catchphrase + '!!!"')
```

One answer reused:

```python
move = input("Practice move? ")
print("You played " + move)
print("And again: " + move + "!")
```

### Common Mistakes
- **The vanishing answer:** `input("Move? ")` without `move =` — the typing disappears into nothing. Always assign.
- **Squashed prompts:** end your question with a space inside the quotes so typing doesn't touch the `?`.
- **Glued joins:** `print("Hi" + name)` → `HiKwame`. Spaces live inside the quotes.

### Level Up 🚀
Stage a "weigh-in": ask the challenger's name, town, and signature move — then print a three-line boxing-style announcement ("From KUMASI... wielding the legendary PAPER... it's KWAME!"). `.upper()` makes it shout.

---

## Lesson 7: f-strings — Dropping Values Into Sentences

### Big Idea
An **f-string** puts a variable's value right inside your words using `{ }`.

### Kid Meaning
A magic sentence with blanks; `{choice}` is filled with the real choice.

### Game Connection
The game says "You chose rock, computer chose scissors" with f-strings.

### The Code
```python
choice = input("Your move? ")
print(f"You played {choice}.")
score = 2
print(f"Your score is {score}.")
```

### Line by Line
- The `f` before the quotes makes it an f-string.
- `{choice}` and `{score}` are filled with what's in those boxes.
- Numbers drop in fine too.

### Your Turn
1. Ask the player's name; print an f-string greeting.
2. Make `score = 5` and print `f"Score: {score}"`.
3. Use both name and score in one f-string.

### Check Your Brain
- What does the `f` do?
- What goes inside `{ }`?

### More Examples
The classic round-report line — multiple blanks:

```python
you = "rock"
computer = "scissors"
print(f"You played {you}, computer played {computer}.")
```

Maths inside the braces:

```python
wins = 3
rounds = 4
print(f"Win rate: {wins / rounds * 100}%")
```

Text vs numbers — the eternal trap, demonstrated:

```python
text = "2"
num = 2
print(text + text)    # 22 - glued text!
print(num + num)      # 4  - real maths
```

`input()` always gives TEXT — wrap with `int(...)` when you need a number.

### Common Mistakes
- **No `f`:** `print("Score: {score}")` prints the braces literally. The `f` activates the blanks.
- **Maths on raw input:** `rounds = input(...)` then `{rounds + 1}` → `TypeError`. Use `int(input(...))`.
- **Wrong bracket type:** `f"Score: (score)"` shows `(score)`. Only `{ }` are magic.

### Level Up 🚀
Build the post-match stats card: with `you_score = 2`, `computer_score = 1`, print three f-string lines — the scoreline, total rounds (`{you_score + computer_score}`), and your win percentage. Format the percentage to one decimal with `{...:.1f}` — instant professional polish.

---

## Lesson 8: Tidying Choices — .lower() and .strip()

### Big Idea
`.lower()` makes text small; `.strip()` trims spaces — so we read choices fairly.

### Kid Meaning
A player might type "Rock", "ROCK", or " rock ". We tidy it so all count the same.

### Game Connection
The game must understand the player's choice however they type it.

### The Code
```python
choice = input("Rock, paper, or scissors? ").lower().strip()
print(f"Tidied choice: {choice}")
```

### Line by Line
- `.lower()` → "Rock" becomes "rock".
- `.strip()` → removes surrounding spaces.
- Now `choice` is clean and easy to compare.

### Your Turn
1. Ask for a choice, tidy it, and print it.
2. Type it with CAPITALS and spaces — does it come out tidy?
3. Why does tidying make the game fair?

### Check Your Brain
- What does `.lower()` do? `.strip()`?
- Why tidy the player's choice?

### More Examples
The transformation, step by step:

```python
messy = "  RoCk  "
print(messy.lower())          # "  rock  "
print(messy.strip())          # "RoCk"
print(messy.lower().strip())  # "rock" - match-ready
```

Proof that tidying makes all typing styles equal:

```python
print("ROCK".lower().strip() == "rock")     # True
print(" Rock ".lower().strip() == "rock")   # True
print("rOcK".lower().strip() == "rock")     # True
```

`.upper()` for the announcer voice:

```python
move = "paper"
print(f"{move.upper()}!!! WHAT A CHOICE!")
```

### Common Mistakes
- **No brackets:** `choice.lower` doesn't run the method — silently does nothing useful. `()` always.
- **Tidy-and-forget:** `choice.lower()` alone changes nothing — it returns a COPY. Chain it at input time: `input(...).lower().strip()`.
- **Comparing untidied:** check `"Rock" == "rock"` → False. Untidied comparisons are how games "eat" valid moves.

### Level Up 🚀
Write a "tidying torture test": a list of horrible inputs — `"ROCK"`, `"  paper "`, `"ScIsSoRs"`, `" PAPER"` — loop through, print each before-and-after tidying. If all four come out clean, your input pipeline is tournament-grade.

---

# PART 2 — MAKING CHOICES

---

## Lesson 9: Making Decisions with if

### Big Idea
`if` runs code only when a condition is True.

### Kid Meaning
"IF you chose rock, remember that." The computer checks, then acts only if true.

### Game Connection
The game uses `if` to work out who won.

### The Code
```python
choice = "rock"
if choice == "rock":
    print("You picked rock! 🪨")
```

### Line by Line
- `if choice == "rock":` — check IF choice equals "rock" (`==` compares).
- The `:` and indented line run only when true.
- Indentation tells Python which line belongs to the `if`.

### Your Turn
1. Set `choice = "paper"`. Write an `if` that prints a paper message.
2. Change it to "rock" — does the paper message show? Why not?

### Check Your Brain
- Difference between `=` and `==`?
- Why does indentation matter?

### More Examples
Several lines inside one `if` — the indented block moves together:

```python
choice = input("Your move? ").lower().strip()
if choice == "rock":
    print("Solid choice! 🪨")
    print("Rock is the most popular opening move.")
print("(This line shows whatever you chose.)")
```

`if` on numbers — score milestones:

```python
you_score = 3
if you_score >= 3:
    print("Hat-trick! 🎩")
```

A secret cheat-code check (every game has one...):

```python
code = input("Enter code: ").lower().strip()
if code == "konami":
    print("🌟 SECRET MODE UNLOCKED!")
```

### Common Mistakes
- **`=` in the condition:** `if choice = "rock":` → `SyntaxError`. Compare with `==`.
- **Missing colon:** `if choice == "rock"` → `SyntaxError: expected ':'`.
- **Flat indentation:** the action line at the left edge → `IndentationError: expected an indented block`. One Tab in.

### Level Up 🚀
Make a "move analyzer": ask for a move; if it's rock, print rock's strengths AND weaknesses (two indented lines). Notice nothing prints for paper/scissors yet — that silence is exactly what `elif`/`else` fix next lesson. Feeling the gap before learning the tool is how engineers think.

---

## Lesson 10: if / elif / else — Checking Each Choice

### Big Idea
`elif` checks more options; `else` is the catch-all.

### Kid Meaning
"IF rock... ELIF paper... ELIF scissors... ELSE that's not valid."

### Game Connection
We check which of the three the player picked, and catch typos.

### The Code
```python
choice = input("Rock, paper, or scissors? ").lower().strip()
if choice == "rock":
    print("Rock! 🪨")
elif choice == "paper":
    print("Paper! 📄")
elif choice == "scissors":
    print("Scissors! ✂️")
else:
    print("That's not a valid choice.")
```

### Line by Line
- Tidy the choice first.
- Each `elif` checks another valid option.
- `else` catches anything invalid (like "banana").

### Your Turn
1. Build this and try each choice, plus something invalid.
2. Also accept short forms: "r", "p", "s" (add them with `or` — sneak peek:
   `if choice == "rock" or choice == "r":`).
3. Why is the `else` useful here?

### Check Your Brain
- What does `elif` mean?
- When does `else` run?

### More Examples
The short-form upgrade from Your Turn, fully written — `or` lets one branch accept several spellings:

```python
choice = input("rock/paper/scissors (or r/p/s)? ").lower().strip()
if choice == "rock" or choice == "r":
    print("Rock! 🪨")
elif choice == "paper" or choice == "p":
    print("Paper! 📄")
elif choice == "scissors" or choice == "s":
    print("Scissors! ✂️")
else:
    print(f"'{choice}' isn't a move I know!")
```

Echo the invalid input back (see the `{choice}` in the else) — players instantly see their typo. Small kindness, huge clarity.

An elif chain on numbers — rank a score:

```python
wins = 2
if wins == 3:
    print("Perfect sweep!")
elif wins == 2:
    print("Strong showing!")
elif wins == 1:
    print("Got one on the board!")
else:
    print("The comeback begins next match!")
```

### Common Mistakes
- **`elif` first:** a chain must start with `if` → `SyntaxError` otherwise.
- **Conditions on else:** `else choice == "x":` → `SyntaxError`. `else` is the catch-all, condition-free.
- **Unreachable branches:** if two `elif`s check the same thing, the second NEVER runs — the chain stops at the first true. Keep each branch distinct.

### Level Up 🚀
Add a secret fourth move "fire" 🔥 that the else recognises specially: "Fire isn't in the rules... but I respect the ambition." Easter eggs in the else-branch are a real game-dev tradition — your future players will find it and grin.

---

## Lesson 11: Comparing Two Choices (Who Wins?)

### Big Idea
We compare the player's choice and the computer's choice to decide the winner.

### Kid Meaning
Rock beats scissors, scissors beats paper, paper beats rock. We teach the computer
these rules with `if`.

### Game Connection
This is the heart of the game — the winning rules.

### The Code
```python
you = "rock"
computer = "scissors"

if you == computer:
    print("It's a tie!")
elif you == "rock" and computer == "scissors":
    print("You win! 🎉")
elif you == "paper" and computer == "rock":
    print("You win! 🎉")
elif you == "scissors" and computer == "paper":
    print("You win! 🎉")
else:
    print("Computer wins! 🤖")
```

### Line by Line
- `if you == computer:` — same choice → tie.
- `and` means BOTH parts must be true. `you == "rock" and computer == "scissors"`
  is true only when you have rock AND the computer has scissors.
- We list the three ways YOU win; `else` covers the rest (computer wins).

### Your Turn
1. Build this and change `you`/`computer` to test a tie, a win, and a loss.
2. Say out loud the three ways you can win.
3. What does `and` require?

### Check Your Brain
- What does `and` do?
- How many ways can YOU win?

### More Examples
Test the rules engine like a pro — all nine combinations:

```python
# you, computer -> expected result
# rock, rock -> tie        rock, paper -> computer    rock, scissors -> you
# paper, rock -> you       paper, paper -> tie        paper, scissors -> computer
# scissors, rock -> computer  scissors, paper -> you  scissors, scissors -> tie
```

Set `you` and `computer` to each pair and check your code agrees with the table. Nine quick runs = a fully verified game brain.

`and` in slow motion:

```python
print(True and True)     # True
print(True and False)    # False - BOTH must be true
print(5 > 1 and 3 > 2)   # True
```

Say the rules while coding them — it cements both:

```python
# "rock CRUSHES scissors"     -> you == "rock" and computer == "scissors"
# "paper COVERS rock"         -> you == "paper" and computer == "rock"
# "scissors CUT paper"        -> you == "scissors" and computer == "paper"
```

### Common Mistakes
- **`or` instead of `and`:** `you == "rock" or computer == "scissors"` wins whenever EITHER is true — way too generous! Winning needs BOTH facts: `and`.
- **Tie check last:** if the tie check comes after the win checks... actually it still works here, but tie-first is clearest — equal moves exit immediately.
- **Misreading the else:** the final `else` means "none of the above" = computer won. If you add a new move someday, that else needs rethinking!

### Level Up 🚀
Add a "reason" to every outcome: instead of just "You win!", print `"Rock crushes scissors - you win! 🎉"`. Three win lines, three loss lines, each explaining WHY. Games that explain their rules teach their players — and you'll never forget the rules again either.

---

## Lesson 12: Random — The Computer's Secret Move

### Big Idea
`random.choice` picks a surprise item from a list — perfect for the computer's move.

### Kid Meaning
Like the computer secretly picking from three cards. Even it doesn't know in
advance.

### Game Connection
This is how the computer chooses rock, paper, or scissors fairly.

### The Code
```python
import random
moves = ["rock", "paper", "scissors"]
computer = random.choice(moves)
print(f"Computer chose: {computer}")
```

### Line by Line
- `import random` — bring in the random helper (once, at the top).
- `moves` is a **list** of the three options.
- `random.choice(moves)` — picks one at random from the list.

### Your Turn
1. Make the computer pick a random move and print it. Run 5 times — different?
2. Make a list of 3 fruits and pick one randomly.
3. Why is `random.choice` perfect here?

### Check Your Brain
- What does `random.choice(moves)` do?
- Why must we `import random` first?

### More Examples
`random.choice` works on any list — taunts, prizes, anything:

```python
import random
taunts = ["Is that all you've got?", "Beep boop - too easy!", "My circuits are bored."]
print(random.choice(taunts))
```

Its cousin `random.randint(a, b)` picks a number — dice for deciding who goes first:

```python
import random
roll = random.randint(1, 6)
print(f"You rolled a {roll}!")
```

Prove the fairness — let it choose 10 times and watch the spread:

```python
import random
moves = ["rock", "paper", "scissors"]
count = 1
while count <= 10:
    print(random.choice(moves))
    count = count + 1
```

### Common Mistakes
- **No import:** `random.choice(...)` without `import random` at the top → `NameError: name 'random' is not defined`.
- **Choice from a string:** `random.choice("rock")` picks a single LETTER like "o"! It needs the list: `random.choice(moves)`.
- **Repeats feel broken:** the computer picking rock twice in a row is REAL randomness, not a bug. Coins land heads twice sometimes.

### Level Up 🚀
Give the computer a "personality mode": make a list where rock appears THREE times — `["rock", "rock", "rock", "paper", "scissors"]` — and the bot becomes a rock-lover you can exploit! Loaded lists = weighted randomness, a genuine technique in game AI design. Can a friend detect the bias by playing?

---

## Lesson 13: Repeating with while Loops

### Big Idea
A `while` loop repeats while a condition stays True.

### Kid Meaning
"WHILE we haven't played 5 rounds, keep playing."

### Game Connection
The game plays several rounds in a loop.

### The Code
```python
round_number = 1
while round_number <= 5:
    print(f"Round {round_number}")
    round_number = round_number + 1
print("All rounds done!")
```

### Line by Line
- `while round_number <= 5:` — loop while it's 5 or less.
- `round_number = round_number + 1` — move it up so the loop ends.
- Without that, it loops forever!

### Your Turn
1. Loop to print "Round X" for 3 rounds.
2. Count down from 5 to 1.
3. Why must something change inside the loop?

### Check Your Brain
- What does `while` do?
- Why must the condition eventually become False?

### More Examples
A pre-match countdown:

```python
n = 3
while n > 0:
    print(f"{n}...")
    n = n - 1
print("SHOOT! ✊✋✌️")
```

"First to 3 wins" — a loop that watches a SCORE instead of a round count (this is where your game is heading):

```python
you_score = 0
while you_score < 3:
    print("(imagine a round happens here)")
    you_score = you_score + 1      # pretend you won each one
print("You reached 3 - match over!")
```

A training montage:

```python
practice = 1
while practice <= 5:
    print(f"Practice swing {practice} 💪")
    practice = practice + 1
print("You're ready.")
```

### Common Mistakes
- **Forever loop:** no `round_number = round_number + 1` → spins endlessly. Stop it (Ctrl+C / Stop button), add the increment. A rite of passage — welcome to the club.
- **Off-by-one:** `while round_number < 5` runs rounds 1–4, `<= 5` runs 1–5. Count on your fingers when unsure — pros literally do this.
- **Indented finale:** the "All rounds done!" inside the loop prints every round. Outdent it.

### Level Up 🚀
Build "best of N": ask the player `rounds = int(input("Best of how many? "))` then loop that many times printing each round number. Odd numbers only would be smarter for avoiding draws — add a check that adds 1 if they pick an even number, with a cheeky message. Configurable games = real product thinking.

---

## Lesson 14: Functions — Reusable Machines

### Big Idea
A function is named code you run by calling its name; it can take parameters.

### Kid Meaning
A machine with a button. Press it to do the job, with whatever you hand it.

### Game Connection
A function can show the score neatly whenever we want.

### The Code
```python
def show_score(you, computer):
    print(f"You: {you}  |  Computer: {computer}")

show_score(2, 1)
show_score(3, 3)
```

### Line by Line
- `def show_score(you, computer):` — needs two numbers.
- It prints them neatly with an f-string.
- We call it with different scores.

### Your Turn
1. Make a `greet(name)` function that prints a welcome using the name.
2. Call it twice with different names.

### Check Your Brain
- What word defines a function?
- What is a parameter?

### More Examples
A scoreboard with a winner indicator — functions can contain ifs:

```python
def show_score(you, computer):
    print(f"You: {you}  |  Computer: {computer}")
    if you > computer:
        print("You're ahead! 🔥")
    elif computer > you:
        print("Bot leads... fight back!")
    else:
        print("Dead even.")

show_score(2, 1)
show_score(1, 1)
```

A round announcer:

```python
def announce(round_number):
    print("=" * 24)
    print(f"     ROUND {round_number}")
    print("=" * 24)

announce(1)
announce(2)
```

### Common Mistakes
- **Define but never call:** functions don't run themselves — `show_score(2, 1)` presses the button.
- **Call above the def:** Python reads top-down; calling before defining → `NameError`.
- **Missing arguments:** `show_score(2)` → `TypeError: show_score() missing 1 required positional argument: 'computer'`. Two parameters = two values.

### Level Up 🚀
Write `victory_banner(name)` that prints a 3-line celebration with the name in capitals, and `defeat_banner(name)` that consoles them kindly. Call each once to test. You're pre-building the ending screens your full game will snap together later — engineers call this "building components."

---

## Lesson 15: Functions That Give an Answer Back (return)

### Big Idea
A function can `return` a value — hand back an answer to use.

### Kid Meaning
Ask a friend, get an answer you can then use, not just hear.

### Game Connection
A `decide(you, computer)` function can work out the winner and hand it back.

### The Code
```python
def decide(you, computer):
    if you == computer:
        return "tie"
    elif you == "rock" and computer == "scissors":
        return "you"
    elif you == "paper" and computer == "rock":
        return "you"
    elif you == "scissors" and computer == "paper":
        return "you"
    else:
        return "computer"

result = decide("rock", "scissors")
print(result)
```

### Line by Line
- `decide` takes both moves and returns who won as a word: "tie", "you", or
  "computer".
- `return` hands the word back AND stops the function.
- `result = decide(...)` catches the answer.

### Your Turn
1. Call `decide` with a tie and with a loss; print each result.
2. Why is returning a word ("you"/"computer"/"tie") handy for the rest of the game?
3. What's the difference between `print` and `return`?

### Check Your Brain
- What does `return` do?
- What three words can `decide` return?

### More Examples
Returned words can drive other code — that's their power:

```python
result = decide("paper", "rock")
if result == "you":
    print("Round goes to YOU!")
```

Unit-test your brain function — pros write tests exactly like this:

```python
print(decide("rock", "rock"))         # expect: tie
print(decide("rock", "scissors"))     # expect: you
print(decide("rock", "paper"))        # expect: computer
print(decide("scissors", "paper"))    # expect: you
```

Run it — four predictions, four outputs. All match? Your function is certified. ✅

A returning function feeding ANOTHER function:

```python
def result_emoji(result):
    if result == "you":
        return "🎉"
    elif result == "computer":
        return "🤖"
    return "🤝"

print(result_emoji(decide("paper", "rock")))    # functions chained!
```

### Common Mistakes
- **`print` inside instead of `return`:** then `result = decide(...)` catches `None`, and later checks like `result == "you"` are quietly never true. Return hands back; print only displays.
- **Code after return:** lines below a hit `return` never run — it exits immediately.
- **Comparing to the wrong word:** the function returns `"you"`, but you check `== "player"` — always False, no error. Match the exact strings.

### Level Up 🚀
Print the test block above, then hand your `decide` to a classmate and challenge them to find ANY pair of moves it judges wrongly. If they can't break it, sign your function like an artist: `# decide() - certified correct by [name]`. Tested code you can trust is the foundation everything else builds on.

---

## Lesson 16: Validating the Player's Choice

### Big Idea
Keep asking until the player gives a valid choice, using a loop.

### Kid Meaning
If they type "banana", politely ask again until they pick a real move.

### Game Connection
A fair game only accepts rock, paper, or scissors.

### The Code
```python
moves = ["rock", "paper", "scissors"]
choice = input("Rock, paper, or scissors? ").lower().strip()
while choice not in moves:
    choice = input("Please type rock, paper, or scissors: ").lower().strip()
print(f"You chose {choice}.")
```

### Line by Line
- `moves` is the list of valid options.
- `while choice not in moves:` — keep asking while the choice is NOT in the list.
- `not in` is the opposite of `in`.
- Once valid, we move on.

### Your Turn
1. Build this and try typing nonsense, then a real move.
2. Why use a `while` loop instead of a single `if`?
3. What does `not in` check?

### Check Your Brain
- What does `not in` mean?
- Why keep asking in a loop?

### More Examples
`in` and `not in` are mirror twins:

```python
moves = ["rock", "paper", "scissors"]
print("rock" in moves)        # True
print("banana" in moves)      # False
print("banana" not in moves)  # True
```

Wrap the guard in a reusable function — ask once, use everywhere:

```python
def get_move():
    moves = ["rock", "paper", "scissors"]
    choice = input("Rock, paper, or scissors? ").lower().strip()
    while choice not in moves:
        choice = input("Please type rock, paper, or scissors: ").lower().strip()
    return choice

you = get_move()
print(f"Locked in: {you}")
```

A patience-meter version — the re-ask gets more helpful each time:

```python
tries = 0
while choice not in moves:
    tries = tries + 1
    if tries >= 3:
        print("(hint: type exactly - rock, paper, or scissors)")
    choice = input("Your move: ").lower().strip()
```

### Common Mistakes
- **Guarding before tidying:** if `.lower().strip()` isn't applied in the re-ask too, "ROCK" stays trapped in the loop forever — frustrating! Tidy EVERY input.
- **`if` instead of `while`:** an `if` re-asks once; type nonsense twice and it slips through. The `while` guards forever.
- **Checking against a string:** `choice not in "rock paper scissors"` checks LETTERS in that sentence — "ock" would pass! Check against the LIST.

### Level Up 🚀
Upgrade `get_move()` to also accept "r", "p", "s" — after validating, convert the short form to the long form (an if/elif chain or, slicker: `{"r": "rock", "p": "paper", "s": "scissors"}` — a dict preview!). Fast players will love you for saving them keystrokes.

---

# PART 3 — BUILDING THE GAME

---

## Lesson 17: One Full Round

### Big Idea
Combine your move, the computer's random move, and the decision into one round.

### Kid Meaning
Now we play a complete single round, start to finish.

### Game Connection
This is one round of the real game.

### The Code
```python
import random

def decide(you, computer):
    if you == computer:
        return "tie"
    elif you == "rock" and computer == "scissors":
        return "you"
    elif you == "paper" and computer == "rock":
        return "you"
    elif you == "scissors" and computer == "paper":
        return "you"
    else:
        return "computer"

moves = ["rock", "paper", "scissors"]
you = input("Rock, paper, or scissors? ").lower().strip()
computer = random.choice(moves)
print(f"Computer chose {computer}.")

result = decide(you, computer)
if result == "tie":
    print("It's a tie!")
elif result == "you":
    print("You win! 🎉")
else:
    print("Computer wins! 🤖")
```

### Line by Line
- The `decide` function (Lesson 15) holds the rules.
- We get your move and a random computer move.
- We use the returned result to print who won.

### Your Turn
1. Build a full round and play it a few times.
2. Add the choice-validation loop (Lesson 16) so typos are handled.
3. Which earlier lessons does this combine?

### Check Your Brain
- Why is the winner logic inside its own function?
- What does `random.choice(moves)` give?

### More Examples
Add suspense before the reveal (`import time` at the top):

```python
import time
print("Rock...")
time.sleep(1)
print("Paper...")
time.sleep(1)
print("Scissors...")
time.sleep(1)
print(f"Computer chose {computer}!")
```

Show both moves side by side with emoji — instant scoreboard feel:

```python
icons = {"rock": "🪨", "paper": "📄", "scissors": "✂️"}
print(f"You {icons[you]}  vs  {icons[computer]} Computer")
```

(That `{"rock": "🪨", ...}` is a **dictionary** — a lookup table. Type the word, get the emoji. You'll meet dicts properly in JHS 2 — enjoy the preview!)

### Common Mistakes
- **Asking AFTER showing the computer's move:** if the bot's choice prints before the player types, the game is beatable by reading! Player first, computer second, reveal last.
- **Forgetting the validation loop:** one typo ("rok") and `decide` returns "computer" unfairly — the else catches unknown moves as losses! Always validate before deciding.
- **Re-importing random in the round:** `import` lines belong at the top of the file, once.

### Level Up 🚀
Polish the round into a ceremony: countdown → both moves revealed with icons → a one-line reason ("Paper covers rock!") → the verdict. Time each beat with `time.sleep`. Run it for someone and watch their face — pacing is what turns code into entertainment.

---

## Lesson 18: Playing Several Rounds with Score

### Big Idea
Loop several rounds and keep both scores.

### Kid Meaning
A best-of-5 match, not just one round — and we track who's ahead.

### Game Connection
The core match of the game.

### The Code
```python
import random

def decide(you, computer):
    if you == computer: return "tie"
    if you == "rock" and computer == "scissors": return "you"
    if you == "paper" and computer == "rock": return "you"
    if you == "scissors" and computer == "paper": return "you"
    return "computer"

moves = ["rock", "paper", "scissors"]
you_score = 0
computer_score = 0

round_number = 1
while round_number <= 3:
    print(f"\n--- Round {round_number} ---")
    you = input("Your move? ").lower().strip()
    while you not in moves:
        you = input("Type rock, paper, or scissors: ").lower().strip()
    computer = random.choice(moves)
    print(f"Computer chose {computer}.")
    result = decide(you, computer)
    if result == "you":
        you_score = you_score + 1
        print("You win the round! 🎉")
    elif result == "computer":
        computer_score = computer_score + 1
        print("Computer wins the round. 🤖")
    else:
        print("Tie!")
    round_number = round_number + 1

print(f"\nFinal: You {you_score} - {computer_score} Computer")
```

### Line by Line
- Scores start at 0; we loop 3 rounds.
- Each round: validate move, computer picks, decide, update the right score.
- `\n` makes a blank line for spacing.
- After the loop, an f-string shows the final scoreline.

### Your Turn
1. Build this and play a 3-round match.
2. Change it to best-of-5.
3. Notice `decide` here uses several `if`s with `return` — why does that work the
   same as `if/elif`?

### Check Your Brain
- Where do the scores get updated?
- What does `\n` do?

### More Examples
"First to 2" instead of fixed rounds — loop on scores, not the round count:

```python
while you_score < 2 and computer_score < 2:
    # ...one round here...
    print(f"({you_score} - {computer_score})")
```

The match ends the MOMENT someone reaches 2 — much more dramatic than always playing all rounds.

A tie counter as a third stat:

```python
ties = 0
# in the tie branch:
ties = ties + 1
# in the final report:
print(f"You {you_score} - {computer_score} Computer ({ties} ties)")
```

About that compact `decide` — `if ... : return` on one line works because after a `return`, nothing else in the function runs, so the next `if` is only reached when the previous didn't return. It behaves exactly like `elif`. Both styles are correct; pick the one you read fastest.

### Common Mistakes
- **Scores reset inside the rounds loop:** `you_score = 0` INSIDE the while wipes progress every round. Start values go BEFORE the loop.
- **Forgetting to bump `round_number`:** infinite round 1! The increment is the loop's heartbeat.
- **Updating the wrong score:** the most common RPS bug in history — the player wins but `computer_score` goes up. Read the result branches slowly once.

### Level Up 🚀
Convert your match to "first to 2 wins" using the score-based while above. Then think: what happens with endless ties — could the match never end? (It can't stall forever — ties don't add score but rounds keep coming. But what if you capped total rounds at 10? Add it!) Congratulations: you're now reasoning about *termination*, a real computer-science concept.

---

## Lesson 19: Crowning a Champion

### Big Idea
After the rounds, compare the scores and announce the overall winner.

### Kid Meaning
Like the final whistle — who won the whole match?

### Game Connection
A satisfying end to the match.

### The Code
```python
if you_score > computer_score:
    print("🏆 You are the CHAMPION!")
elif computer_score > you_score:
    print("🤖 The computer is the champion. Try again!")
else:
    print("🤝 It's a draw overall!")
```

### Line by Line
- Compare the two final scores with `>`.
- Three outcomes: you win, computer wins, or a draw.

### Your Turn
1. Add the champion announcement to the end of your match.
2. Write your OWN three end messages.
3. What does `>` compare?

### Check Your Brain
- How do we decide the overall winner?
- When is it a draw?

### More Examples
A champion ceremony with the score difference:

```python
if you_score > computer_score:
    margin = you_score - computer_score
    print(f"🏆 CHAMPION - you won by {margin}!")
    if margin == 3:
        print("A PERFECT SWEEP! Legendary.")
```

Personalise it with the player's name:

```python
name = "Adjoa"
if you_score > computer_score:
    print(f"🏆 {name.upper()} TAKES THE CROWN!")
```

The match summary block — every stat in one card:

```python
print("=" * 26)
print("      MATCH REPORT")
print(f"  You:      {you_score}")
print(f"  Computer: {computer_score}")
print(f"  Rounds:   {you_score + computer_score}")
print("=" * 26)
```

### Common Mistakes
- **`>=` instead of `>`:** `if you_score >= computer_score` calls a DRAW a win for you — flattering but wrong! Strict `>` for victory, `else`/equality for draws.
- **Announcing inside the rounds loop:** the champion line indented into the loop crowns someone every round. It belongs AFTER the loop.
- **Forgetting the draw case:** with odd best-of totals draws are rare but possible (ties don't score!) — handle all three outcomes.

### Level Up 🚀
Add a "rivalry record" across matches: outside the play-again loop, keep `championships_you` and `championships_computer`, bump them each match, and print the all-time record at the very end: "All-time: You 3 - 2 Computer 🔥". Whoever loses the session will DEMAND a rematch — engineered competitiveness!

---

## Lesson 20: A Friendly Welcome and Rules

### Big Idea
Greet the player and explain the rules before the match.

### Kid Meaning
A good host welcomes you and explains how to play.

### Game Connection
Makes the game feel finished and friendly.

### The Code
```python
def welcome():
    print("=" * 30)
    print("   ROCK • PAPER • SCISSORS")
    print("=" * 30)
    print("Beat the computer over 3 rounds!")
    print("Rock crushes scissors, scissors cut paper, paper covers rock.")

welcome()
```

### Line by Line
- A `welcome()` function (Lesson 14) holds the intro.
- `"=" * 30` draws a line.
- Call it once at the start.

### Your Turn
1. Add `welcome()` to the start of your game.
2. Make the title and rules your own style.

### Check Your Brain
- What does `"=" * 30` do?
- Why put the welcome in a function?

### More Examples
A parameterised welcome — the rounds number always tells the truth:

```python
def welcome(rounds):
    print("=" * 30)
    print("   ROCK • PAPER • SCISSORS")
    print("=" * 30)
    print(f"Best of {rounds} rounds. Good luck!")

welcome(3)
```

Border style options:

```python
print("•" * 30)
print("=-" * 15)
print("✊✋✌️ " * 5)
```

A matching `goodbye()` to bookend the game:

```python
def goodbye(you_score, computer_score):
    print("-" * 30)
    print(f"Final all-time: {you_score} - {computer_score}")
    print("Come back for the rematch! 👋")
```

### Common Mistakes
- **Hard-coded lies:** welcome says "3 rounds" but the loop plays 5 — players notice! Pass the real number as a parameter.
- **Defining functions at the bottom:** call-before-define → `NameError`. Defs live at the top, like a menu.
- **`"=" + 30`:** crashes (`TypeError`) — you can MULTIPLY text by a number but not ADD a number to text.

### Level Up 🚀
Build the full broadcast package: `welcome(rounds)`, `announce(round_number)` between rounds, and `goodbye(...)` at the end. Your game now has the same structure as a televised sports event — opening, segments, closing. That structure is no accident: it's information design.

---

## Lesson 21: Play Again?

### Big Idea
Wrap the whole match so the player can play again.

### Kid Meaning
After a match, ask "Again?" — like a rematch.

### Game Connection
Real games let you rematch.

### The Code
```python
playing = "yes"
while playing == "yes":
    # ...run one full match here (the Lesson 18 loop)...
    print("(match would play here)")
    playing = input("Play again? (yes/no): ").lower().strip()
print("Thanks for playing! 👋")
```

### Line by Line
- An OUTER `while playing == "yes":` wraps a whole match.
- After the match, ask "Again?"; not "yes" → stop.

### Your Turn
1. Wrap your full match (Lesson 18) inside this play-again loop.
2. Make sure `you_score` and `computer_score` RESET at the start of each match.
3. Why must they reset?

### Check Your Brain
- What does the OUTER loop do?
- What resets each match?

### More Examples
Accept y/yes/YES gracefully:

```python
playing = input("Play again? (yes/no): ").lower().strip()
if playing == "y":
    playing = "yes"
```

Count the matches across the session:

```python
matches = 0
playing = "yes"
while playing == "yes":
    matches = matches + 1
    print(f"\n🥊 MATCH {matches}!")
    # ... full match here ...
    playing = input("Rematch? (yes/no): ").lower().strip()
print(f"Session over - {matches} matches played!")
```

What lives where — the memory map of your game:

```python
# OUTSIDE the outer loop  -> survives all matches (all-time records, match count)
# INSIDE outer, before rounds -> fresh each match (you_score, computer_score)
# INSIDE the rounds loop  -> fresh each round (you, computer, result)
```

### Common Mistakes
- **Score reset missing:** match 2 starts at 2-1 — instant chaos. Reset INSIDE the outer loop.
- **Asking "again?" inside the rounds loop:** nags after every round. It belongs after the match ends, still inside the outer loop. Indentation is the address.
- **Infinite politeness:** if `playing` never gets reassigned from input, the game never ends. Every loop needs its exit.

### Level Up 🚀
Memorise that three-line memory map — it answers 90% of "why is my variable wrong?!" questions in ANY program, not just this one. Then prove you own it: deliberately move `you_score = 0` to the wrong place, predict the broken behaviour, run to confirm, fix it back. Breaking things on purpose is how engineers learn fastest.

---

## Lesson 22: The Full Game

### Big Idea
Put everything together: welcome, rounds, scoring, champion, play-again.

### Kid Meaning
Your complete, polished Rock-Paper-Scissors game!

### Game Connection
This is your finished game.

### The Code
```python
import random

def welcome():
    print("=" * 30)
    print("   ROCK • PAPER • SCISSORS")
    print("=" * 30)

def decide(you, computer):
    if you == computer: return "tie"
    if you == "rock" and computer == "scissors": return "you"
    if you == "paper" and computer == "rock": return "you"
    if you == "scissors" and computer == "paper": return "you"
    return "computer"

moves = ["rock", "paper", "scissors"]
welcome()

playing = "yes"
while playing == "yes":
    you_score = 0
    computer_score = 0
    round_number = 1
    while round_number <= 3:
        print(f"\n--- Round {round_number} ---")
        you = input("Your move? ").lower().strip()
        while you not in moves:
            you = input("Type rock, paper, or scissors: ").lower().strip()
        computer = random.choice(moves)
        print(f"Computer chose {computer}.")
        result = decide(you, computer)
        if result == "you":
            you_score = you_score + 1
            print("You win the round! 🎉")
        elif result == "computer":
            computer_score = computer_score + 1
            print("Computer wins the round. 🤖")
        else:
            print("Tie!")
        round_number = round_number + 1

    print(f"\nFinal: You {you_score} - {computer_score} Computer")
    if you_score > computer_score:
        print("🏆 You are the CHAMPION!")
    elif computer_score > you_score:
        print("🤖 Computer wins. Try again!")
    else:
        print("🤝 It's a draw!")

    playing = input("\nPlay again? (yes/no): ").lower().strip()

print("Thanks for playing! 👋")
```

### Line by Line
- Two functions (`welcome`, `decide`) up top.
- Outer loop = a match; inner loop = 3 rounds; innermost loop = validating a move.
- Scores reset each match; champion announced; ask to replay.

### Your Turn
1. Build the full game and play several matches.
2. Make it best-of-5 and adjust the messages.
3. Trace what happens across one full match.

### Check Your Brain
- How many loops are in this game, and what does each do?
- Why reset the scores inside the outer loop?

### More Examples
The release checklist — run each test on your finished game:

```python
# Test 1: win a match            -> champion line shows?
# Test 2: lose a match           -> computer line + kind message?
# Test 3: tie every round        -> draw announced properly?
# Test 4: type "ROCK", " paper " -> still accepted (tidying works)?
# Test 5: type "banana"          -> politely re-asked, no crash?
# Test 6: play 2 matches         -> scores reset between them?
# Test 7: answer "YES" then "no" -> replays once, then exits cleanly?
```

Pass all seven and your game is genuinely production-quality for a beginner project. Most adults' first games can't pass this list.

Three loops, one map:

```python
# while playing == "yes":        <- the SESSION (matches)
#     while round_number <= 3:   <- the MATCH (rounds)
#         while you not in moves:  <- the GUARD (one valid input)
```

### Common Mistakes
- **Indentation drift in the big build:** with three nested loops, one wrong indent silently moves a line to a different loop. When something repeats too often or too rarely — check its indent FIRST.
- **decide() defined inside a loop:** works, but redefines the machine every round — wasteful and confusing. Functions at the top, once.
- **Testing only victory:** the bugs hide in the loss, tie, and typo paths. The checklist exists because happy-path testing lies.

### Level Up 🚀
Time a full match with `time.time()`: stamp `start = time.time()` before the rounds, and after the champion line print `f"Match time: {time.time() - start:.1f} seconds"`. Speedrun mode unlocked — who in class finishes a best-of-3 fastest? 🏁

---

## Lesson 23: Making It Cooler — A Running Tally

### Big Idea
Show the score after every round so the player always knows the state.

### Kid Meaning
Like a scoreboard updating live during the match.

### Game Connection
Keeps players excited round to round.

### The Code
```python
# Add this line at the END of each round, inside the rounds loop:
print(f"Score so far → You: {you_score}  Computer: {computer_score}")
```

### Line by Line
- An f-string showing both scores.
- Placed inside the rounds loop, after updating the score, so it shows every round.

### Your Turn
1. Add the running tally to your game.
2. Add an emoji that changes if you're ahead, behind, or tied (hint: an `if` on the
   scores).
3. Why show the score every round?

### Check Your Brain
- Where must this line go to show every round?
- Why use an f-string?

### More Examples
The mood-aware tally from Your Turn, fully built:

```python
if you_score > computer_score:
    status = "😎 You lead!"
elif computer_score > you_score:
    status = "😬 Bot leads..."
else:
    status = "🤝 All square."
print(f"Score → You {you_score} - {computer_score} Computer   {status}")
```

A visual score bar — stars per point:

```python
print(f"You      {'⭐' * you_score}")
print(f"Computer {'⭐' * computer_score}")
```

Win-streak tracking with celebration:

```python
streak = 0
# in the "you win" branch:
streak = streak + 1
if streak >= 2:
    print(f"🔥 {streak} in a row!")
# in the "computer wins" branch:
streak = 0
```

### Common Mistakes
- **Tally before the score update:** print first, update second shows LAST round's score — confusing! Update, THEN display.
- **Streak never reset:** forgetting `streak = 0` on a loss makes the fire emoji lie. Resets matter as much as increments.
- **Information overload:** tally + streak + bars + status every round can drown the game. Pick the 1–2 displays that feel best — restraint is design.

### Level Up 🚀
A/B test your own game: version A with just the plain tally, version B with bars + streaks. Have two classmates play each, then ask which felt more exciting. You're now doing UX research — the discipline that decides how the world's apps look and feel.

---

## Lesson 24: Showcase and Reflection

### Big Idea
You built a real game — celebrate and share it.

### Kid Meaning
From zero to a scored, multi-round game vs the computer. Be proud!

### Game Connection
This is your finished Rock-Paper-Scissors — welcome, rounds, scoring, champion,
play-again, and a live tally.

### The Code
```python
# This is YOUR finished game. Read every line top to bottom and
# make sure you can explain it. That's how you know you've learned it.
```

### Line by Line
- Open your full game file and explain each line out loud.
- Any fuzzy line → revisit the lesson that taught it.

### Your Turn (Showcase)
1. Let your class or family play your game.
2. Explain THREE lines of your code to them.
3. Pick ONE upgrade you'd add next (best-of-7, lizard/Spock, two players) and
   describe how it might work.
4. Brilliant — you're now a beginner Python game-maker! 🎉

### Check Your Brain
- What was your favourite part to build?
- Explain what a variable, an `if` with `and`, `random.choice`, a loop, and a
  function with `return` each do.
- What's one thing you understand now that you didn't 4 months ago?

### Look How Far You've Come 🏆
Four months ago: zero code. Today your game runs on ALL of this:

- **print & f-strings** — the broadcast voice (Lessons 1, 7)
- **variables & counters** — two scores, rounds, streaks (Lessons 3, 5)
- **input + tidying** — fair, forgiving controls (Lessons 6, 8)
- **if / elif / else / and** — the complete rules engine (Lessons 9–11)
- **random.choice** — a fair computer opponent (Lesson 12)
- **three nested loops** — session, match, input guard (Lessons 13, 16, 21)
- **functions + return** — `decide()`, tested and certified (Lessons 14–15)

You also learned things most beginners skip: testing all nine combinations, validating input, and the memory map of where variables live. That's engineering discipline, not just coding.

### More Examples (Showcase ideas)
```python
# 1. A signed splash screen
print("RPS ARENA - engineered by Kwame, JHS 1 ⚙️")
```

```python
# 2. Tournament mode banner for the class competition
print("🏟️  CLASS CHAMPIONSHIP - QUARTER FINAL")
```

```python
# 3. The all-time record farewell
print(f"All-time: You {champs_you} - {champs_bot} Computer. Rematch tomorrow?")
```

### Common Mistakes (on showcase day!)
- **Last-minute "improvements":** code freeze before the demo. Working beats fancy.
- **Demoing in silence:** narrate like a sports commentator — you built the arena, own the mic.
- **Skipping the checklist:** run the 7-test release checklist (Lesson 22) one final time in the morning.

### Level Up 🚀 (your next adventure)
1. **Rock-Paper-Scissors-Lizard-Spock** — five moves, ten win-rules. Your `decide()` is about to grow up.
2. **The learning bot** — track which move the player picks most, and let the computer counter it. That's genuinely simple AI.
3. **Saved rivalry records** — JHS 2 teaches files; your all-time score could survive shutdown.

You didn't just play a game — you *built the opponent*. See you in JHS 2, engineer. ⚙️🚀