# Pocket-Money Budget Tracker Lessons: JHS 2 Edition

Build your own **Pocket-Money Budget Tracker** — a program that records money you
get and money you spend, lists every entry, shows your total balance, and warns you
if you're running low. A real, useful tool you'll actually want to use!

This project is for **JHS 2**, and it assumes you have **never coded before**. We
start from absolutely zero and explain every line in simple words, so you truly
understand it — not just copy it. By the end you'll have built a real, working app.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Tracker Connection** — how this fits our Budget Tracker.
- **The Code** — the actual Python to type.
- **Line by Line** — every important line explained.
- **Your Turn** — a small task YOU do to practise (the most important part!).
- **Check Your Brain** — quick questions to make sure it stuck.

Teach one lesson at a time: idea, code, then type and run it. **Always do "Your
Turn."** Understanding one lesson fully beats copying five.

**This course takes about 4 months** (about two lessons a week), in three parts:

- **Part 1 — First Steps (Lessons 1–8):** what code is, printing, variables, input,
  numbers, and f-strings, from zero.
- **Part 2 — Choices, Loops & Data (Lessons 9–16):** decisions, loops, lists,
  dictionaries, and functions.
- **Part 3 — Building the Tracker (Lessons 17–24):** assemble the real tracker with
  a menu, totals, and warnings, then polish.

Works on **Windows, Mac, and Linux**.

---

# PART 1 — FIRST STEPS

---

## Lesson 1: What Is Code? Saying Hello

### Big Idea
Code is a list of instructions we give the computer, one line at a time.

### Kid Meaning
A recipe tells a cook each step. Code tells the computer each step.

### Tracker Connection
Our tracker "shows" your balance and menus — it all starts with `print`.

### The Code
```python
print("Welcome to your Money Tracker!")
print("Let's keep your pocket money in order.")
```

### Line by Line
- `print(...)` shows whatever is inside on the screen.
- Text in quotes `" "` is shown exactly.
- Each `print` is its own line.

### Your Turn
1. Print your own two-line welcome to a money app.
2. Add a line with an emoji, like `print("Saving is smart 💰")`.
3. Run it.

### Check Your Brain
- What does `print` do?
- What do the quotes mark?

### More Examples
Predict, then run — that habit pays off all course:

```python
print("Money in. Money out.")
print("Know where every cedi goes. 💰")
```

Order is everything — a receipt prints top to bottom:

```python
print("RECEIPT")
print("Waakye ............ 12")
print("Pure water ......... 1")
print("TOTAL ............. 13")
```

`print()` alone gives breathing room:

```python
print("MONEY TRACKER")
print()
print("Your financial journey starts now.")
```

### Common Mistakes
- **No quotes:** `print(Money)` → `NameError: name 'Money' is not defined`. Words need quotes: `print("Money")`.
- **Unclosed bracket:** `print("Hi"` → `SyntaxError: '(' was never closed`.
- **Capital P:** `Print(...)` → `NameError`. Python knows only lowercase `print`.

### Level Up 🚀
Print your own 6-line bank statement mock-up: a header, three made-up entries with dots lining up the amounts (like the receipt above), and a total. Making text LINE UP neatly is a real skill — banks pay designers for exactly this.

---

## Lesson 2: How to Run Python

### Big Idea
We write code in a `.py` file and run it.

### Kid Meaning
Writing is like penning a letter; running is reading it aloud.

### Tracker Connection
You'll run your tracker again and again as you build it.

### The Code
```python
print("If you can see this, Python works!")
```

### Line by Line
- Save with a `.py` name, e.g. `tracker.py`.
- Run from the editor's Run button, or type `python tracker.py`.

### Your Turn
1. Save `practice.py` with one print line and run it.
2. Show a friend.

### Check Your Brain
- What ending must a Python file have?
- What does "running" mean?

### More Examples
Small files, complete programs:

```python
# file: motto.py
print("Save first. Spend second. 💪")
```

`#` comments are your engineering notebook — the computer skips them, future-you thanks you:

```python
# Budget Tracker project - day 1
# Author: Yaa, JHS 2
print("Setup complete.")   # confirms the file runs
```

### Common Mistakes
- **`.txt` instead of `.py`:** the Run button needs `.py` to know it's Python.
- **Run before save:** old output, new confusion. Ctrl+S → Run, in that order, always.
- **Typing in the output panel:** code only counts in the editor pane.

### Level Up 🚀
Create `money_quotes.py` with three wise money sayings (one can be your grandmother's!). Run it, swap the order of quotes, run again. The edit→save→run loop you're practising is the exact daily rhythm of professional software work.

---

## Lesson 3: Variables — Boxes That Remember

### Big Idea
A variable is a named box that stores a value for later.

### Kid Meaning
A box with a name sticker; say the name and the computer uses what's inside.

### Tracker Connection
The tracker remembers your BALANCE in a variable.

### The Code
```python
balance = 0
owner = "Yaa"
print(owner)
print(balance)
```

### Line by Line
- `balance = 0` — a box holding the number 0.
- `owner = "Yaa"` — a box holding a word (words need quotes).
- `print(balance)` shows what's inside (0).

### Your Turn
1. Make a `balance` variable set to 50 and print it.
2. Make an `owner` variable with your name and print it.
3. Change `balance` to 80 and print it.

### Check Your Brain
- What is a variable?
- Why does `"Yaa"` have quotes but `0` does not?

### More Examples
A tracker's full opening state:

```python
owner = "Yaa"
balance = 0
currency = "cedis"
weekly_goal = 20
print(owner)
print(balance)
print(weekly_goal)
```

Refilling — balances change constantly:

```python
balance = 50
print(balance)    # 50
balance = 35
print(balance)    # 35 - new value replaced the old
```

Copying a box — snapshots for comparing later:

```python
balance = 80
balance_last_week = balance
print(balance_last_week)    # 80
```

### Common Mistakes
- **Use before create:** `print(balance)` with no `balance = ...` above → `NameError: name 'balance' is not defined`.
- **Spelling drift:** `weekly_goal` then `weeklygoal` → `NameError`. One spelling, everywhere.
- **Quoted amounts:** `balance = "50"` is text; `"50" - 20` crashes with `TypeError`. Money is numbers — no quotes.

### Level Up 🚀
Model your REAL pocket money: variables for what you currently have, your weekly income, and one thing you're saving toward (name + price). Print a 4-line savings snapshot. You've just done what financial apps call "onboarding" — capturing the user's starting picture.

---

## Lesson 4: Numbers and Money Maths

### Big Idea
The computer does maths fast — adding income and subtracting spending.

### Kid Meaning
The computer is a super calculator, perfect for money.

### Tracker Connection
Getting money adds to the balance; spending subtracts from it.

### The Code
```python
balance = 0
balance = balance + 50     # got 50
print(balance)
balance = balance - 20     # spent 20
print(balance)
```

### Line by Line
- `balance + 50` — add income.
- `balance - 20` — subtract spending.
- The `# ...` part is a **comment** — a note for humans; Python ignores it.

### Your Turn
1. Start `balance = 100`. Add 30, print. Subtract 45, print.
2. What balance do you end with?
3. Add a comment to each line explaining it.

### Check Your Brain
- What does a `#` comment do?
- If balance is 100, you add 30 and spend 45, what's left?

### More Examples
A whole week of money in five lines:

```python
balance = 20            # started the week with 20
balance = balance + 10  # Monday: aunt visited!
balance = balance - 5   # Tuesday: snack
balance = balance - 3   # Thursday: pure water + biscuit
print(balance)          # how did the week end?
```

Multiplication for repeated costs:

```python
daily_snack = 4
school_days = 5
print(daily_snack * school_days)   # weekly snack cost - eye-opening!
```

Division for fair shares and savings plans:

```python
target = 60
weeks = 4
print(target / weeks)   # save this much per week to hit the goal
```

### Common Mistakes
- **`x` for times:** `4 x 5` → `SyntaxError`. Multiplication is `*`.
- **Quoted maths:** `print("100 - 45")` shows the sum, not the answer.
- **Losing track of sign:** spending is SUBTRACTED — writing `balance + 20` for a spend silently inflates your wealth. (Nice dream, bad accounting.)

### Level Up 🚀
The "small leaks" calculator: a 2-cedi daily snack seems tiny — calculate what it costs over a week, a month (`* 30`), and a school year (`* 200`). Print all three with comments. This little program teaches more real finance than some adults ever learn. 📊

---

## Lesson 5: Updating the Balance

### Big Idea
Update a variable using its own value: `balance = balance + amount`.

### Kid Meaning
"Take what's in the box, change it, put it back."

### Tracker Connection
Every entry updates the running balance.

### The Code
```python
balance = 0
amount = 25
balance = balance + amount
print(balance)
amount = 10
balance = balance - amount
print(balance)
```

### Line by Line
- `amount` holds the size of a transaction.
- `balance = balance + amount` adds it; `- amount` subtracts it.
- The box always keeps the latest total.

### Your Turn
1. Start `balance = 0`. Add an `amount` of 40, then subtract an `amount` of 15.
2. Print after each step.

### Check Your Brain
- What does `balance = balance + amount` do?
- Why use an `amount` variable instead of a fixed number?

### More Examples
The same `amount` box reused for different transactions — that's its job:

```python
balance = 100
amount = 25
balance = balance - amount    # bought a book
print(balance)                # 75
amount = 40
balance = balance + amount    # birthday money!
print(balance)                # 115
```

The `+=` and `-=` shortcuts — banking code everywhere uses these:

```python
balance = 50
balance += 20    # same as balance = balance + 20
balance -= 5     # same as balance = balance - 5
print(balance)   # 65
```

A savings box growing beside the balance:

```python
balance = 100
savings = 0
move = 30
balance -= move
savings += move
print(f"Balance {balance}, Savings {savings}")   # money MOVED, total is safe
```

### Common Mistakes
- **Updating the wrong direction:** `balance = amount - balance` is backwards maths — balance of 100, spend 30 gives... -70! Read your formula out loud.
- **Forgetting to reassign:** `balance + amount` alone calculates and THROWS AWAY the result. The `balance =` part saves it.
- **One box for two jobs:** using `balance` for both balance AND the transaction makes soup. Separate boxes for separate meanings.

### Level Up 🚀
Build the savings-transfer above, but add a check on yourself: print `balance + savings` before and after the move. If the total changed, money leaked — a bug! Accountants call this *reconciliation*; programmers call it an *invariant*. You just used both words' ideas in 8 lines.

---

## Lesson 6: Asking the User with input()

### Big Idea
`input()` asks a question and waits for the user to type.

### Kid Meaning
The computer asks, listens, keeps the answer in a box.

### Tracker Connection
The tracker asks "How much?" and "What for?" using `input()`.

### The Code
```python
note = input("What did you spend on? ")
print("You wrote:")
print(note)
```

### Line by Line
- `input("...")` shows the question and waits.
- The typed answer is stored in `note`.

### Your Turn
1. Ask the user their name and store it.
2. Ask what they bought and store it.
3. Print both.

### Check Your Brain
- What does `input()` do after showing the question?
- Where does the answer go?

### More Examples
Two-question entry — the shape of every form ever:

```python
item = input("What did you buy? ")
shop = input("From where? ")
print("Noted: " + item + " from " + shop)
```

Reusing one answer:

```python
goal = input("What are you saving for? ")
print("Goal set: " + goal)
print("Every cedi gets you closer to " + goal + "!")
```

### Common Mistakes
- **Unstored input:** `input("What for? ")` without `note =` — the answer evaporates.
- **Cramped prompts:** end questions with a space inside the quotes for neat typing.
- **Space-less joins:** `print("Bought" + item)` → `Boughtkofi broke`. Spaces inside quotes.

### Level Up 🚀
Build the "money diary interview": ask three questions — best purchase this month, one regret purchase, and current savings goal — then print them back as a mini reflection report. Financial apps charge money for this exact feature; yours is homemade. 📔

---

## Lesson 7: Numbers from input() — int() and f-strings

### Big Idea
`input()` gives TEXT; use `int()` to turn money amounts into real numbers. Use
**f-strings** to show values in sentences.

### Kid Meaning
"50" typed is a drawing of fifty. `int()` makes it a real number we can add. An
f-string drops a value into a sentence.

### Tracker Connection
Amounts must be real numbers to add to the balance, and we show the balance with an
f-string.

### The Code
```python
amount_text = input("How much? ")
amount = int(amount_text)
balance = 100 + amount
print(f"Your new balance is {balance} cedis.")
```

### Line by Line
- `amount_text` holds text like "50".
- `int(amount_text)` turns "50" into the real number 50.
- The `f` before the quotes makes an f-string; `{balance}` drops the number in.

### Your Turn
1. Ask for an amount, `int()` it, add it to a starting balance of 100, print with an
   f-string.
2. Try typing letters instead of a number and see the error (we'll handle that
   later — errors teach us!).
3. Why do we need `int()` here?

### Check Your Brain
- What kind of thing does `input()` always give?
- What does `int()` do? What does an f-string do?

### More Examples
The trap, demonstrated — run this and stare at the first line:

```python
text_fifty = "50"
real_fifty = 50
print(text_fifty + text_fifty)   # 5050 - text GLUES! imagine that on your bank app
print(real_fifty + real_fifty)   # 100 - real money maths
```

`int(input(...))` in one smooth move:

```python
amount = int(input("How much did you get? "))
print(f"With 10 more you'd have {amount + 10}.")
```

Multiple values in one f-string — the tracker's voice:

```python
owner = "Yaa"
balance = 130
print(f"{owner}, your balance is {balance} cedis.")
print(f"Half of it would be {balance / 2}.")
```

### Common Mistakes
- **Maths on raw input:** `amount = input(...)` then `amount + 10` → `TypeError: can only concatenate str (not "int") to str`. THE most common money-app bug. `int()` first.
- **Missing `f`:** `print("Balance: {balance}")` shows the braces literally.
- **int() on words:** type "fifty" and `int("fifty")` → `ValueError: invalid literal for int()`. Lesson coming on handling that gracefully — for now, digits only.

### Level Up 🚀
The allowance projector: ask weekly allowance with `int(input(...))`, then print a 3-line forecast — in 4 weeks, in 12 weeks (a term), in 52 weeks — each line an f-string with maths inside. Seeing a year of allowance as ONE number changes how people think about money. Try it on a parent. 😄

---

## Lesson 8: Mini-Project — One Transaction

### Big Idea
Combine input, int(), maths, and f-strings into a tiny money program.

### Kid Meaning
Our first real money tool: record one transaction.

### Tracker Connection
Practice for the full tracker.

### The Code
```python
balance = int(input("Starting balance? "))
amount = int(input("Amount you got? "))
balance = balance + amount
print(f"Great! Your balance is now {balance} cedis. 💰")
```

### Line by Line
- `int(input(...))` asks AND converts in one line.
- Add the income to the balance.
- Show the new balance with an f-string.

### Your Turn
1. Build this and run it.
2. Change it to SUBTRACT (a spend) instead of add.
3. Add a `note` question and include it in the final message.

### Check Your Brain
- Why wrap the inputs in `int(...)`?
- What does `int(input(...))` do in one line?

### More Examples
The spend version — subtraction plus an honest report:

```python
balance = int(input("Starting balance? "))
spend = int(input("How much did you spend? "))
balance = balance - spend
print(f"After spending {spend}, you have {balance} cedis left.")
```

A two-transaction session — income then spend:

```python
balance = int(input("Balance? "))
balance = balance + int(input("Money received? "))
balance = balance - int(input("Money spent? "))
print(f"End of day: {balance} cedis.")
```

Add the note for a complete record:

```python
balance = 100
amount = int(input("Amount? "))
note = input("What for? ")
balance = balance + amount
print(f"Recorded '{note}' ({amount}). New balance: {balance}.")
```

### Common Mistakes
- **One conversion missing:** converting the balance but not the amount → the maths line crashes. EVERY number input gets `int(...)`.
- **Subtracting income:** copy-pasting the spend version and forgetting to flip `-` to `+`. Copy-paste is the #1 source of bugs in all of software — always reread pasted lines.
- **Note wrapped in int():** `int(input("What for? "))` crashes on "lunch"! Only numbers get converted.

### Level Up 🚀
Add a "transaction type" question first — `kind = input("income or spend? ")` — and print a different confirmation message for each (just two prints for now; the `if` to branch properly arrives NEXT lesson). Feeling the need for `if` before you learn it is perfect timing.

---

# PART 2 — CHOICES, LOOPS & DATA

---

## Lesson 9: Making Decisions with if / else

### Big Idea
`if` runs code when a condition is True; `else` covers the other case.

### Kid Meaning
"IF you have enough money, buy it. ELSE, you can't afford it."

### Tracker Connection
The tracker checks if you can afford a spend, and warns if your balance is low.

### The Code
```python
balance = 30
price = 50
if balance >= price:
    print("You can afford it! ✅")
else:
    print("Not enough money. ❌")
```

### Line by Line
- `balance >= price` — is balance at least the price? (`>=` means "greater or
  equal").
- The `if` block runs if true; the `else` block if false.
- One of them always runs.

### Your Turn
1. Set `balance = 100`, `price = 40`, and test the message.
2. Change to `balance = 20` and test again.
3. What does `>=` mean?

### Check Your Brain
- When does the `else` run?
- What does `>=` check?

### More Examples
The affordability check with real inputs:

```python
balance = int(input("Your balance? "))
price = int(input("Price of the thing you want? "))
if balance >= price:
    print(f"✅ Affordable - you'd have {balance - price} left.")
else:
    print(f"❌ You're short by {price - balance} cedis.")
```

Notice BOTH branches calculate something useful — great apps inform, not just permit/deny.

A savings-goal check:

```python
saved = 45
goal = 60
if saved >= goal:
    print("🎉 GOAL REACHED!")
else:
    print(f"Keep going - {goal - saved} cedis to go!")
```

Multi-line branches — celebration takes several lines:

```python
if saved >= goal:
    print("🎉 GOAL REACHED!")
    print("Time to set a bigger one?")
else:
    print("Not yet - but every cedi counts.")
```

### Common Mistakes
- **`=` vs `==`:** `if balance = price:` → `SyntaxError`. Compare with `==` (and `>=`, `<=` etc.).
- **`>` when you mean `>=`:** with `balance > price`, having EXACTLY the price says you can't afford it — harsh! `>=` includes the boundary. Boundaries deserve a second look, always.
- **Unindented branch lines:** the second celebration line at the left edge runs for everyone — even the broke. Indentation = membership.

### Level Up 🚀
Build "the honest shopkeeper": ask balance and price; if affordable, also warn when the purchase would leave less than 5 cedis ("Affordable, but it nearly empties your pocket — sure?"). That's an `if` INSIDE an `if` — nesting. You've just modelled *nuanced* advice, which is what separates a calculator from a counsellor.

---

## Lesson 10: True / False and Comparisons

### Big Idea
Comparisons give True or False: `>`, `<`, `>=`, `<=`, `==`, `!=`.

### Kid Meaning
Each comparison is a yes/no question about numbers.

### Tracker Connection
"Is the balance below 10?" is a True/False the tracker checks to warn you.

### The Code
```python
balance = 8
print(balance < 10)
print(balance == 0)
print(balance >= 5)
```

### Line by Line
- `balance < 10` → True (8 is less than 10).
- `balance == 0` → False.
- `balance >= 5` → True.

### Your Turn
1. With `balance = 15`, predict and print: `balance < 10`, `balance > 20`,
   `balance == 15`.
2. What does `!=` mean? Print `balance != 15`.

### Check Your Brain
- The two boolean values?
- What does `<=` mean?

### More Examples
All six comparison operators in one cheat sheet:

```python
balance = 15
print(balance > 10)     # True   greater than
print(balance < 10)     # False  less than
print(balance >= 15)    # True   at least
print(balance <= 14)    # False  at most
print(balance == 15)    # True   exactly equal
print(balance != 20)    # True   not equal
```

Combine money facts with `and` / `or`:

```python
balance = 25
goal = 60
print(balance > 0 and balance < goal)    # True: solvent but not there yet
print(balance < 0 or balance >= goal)    # False: neither broke nor done
```

Name your facts — readable code is professional code:

```python
is_broke = balance <= 0
can_buy_lunch = balance >= 12
print(is_broke, can_buy_lunch)
```

### Common Mistakes
- **`=<` and `=>`:** they don't exist! It's `<=` and `>=` — the arrow comes first. (Memory trick: say "less than or equal" — the words are in symbol order.)
- **Quoted booleans:** `"True"` is a word. The values are bare: `True`, `False`.
- **Chained confusion:** `10 < balance < 20` actually WORKS in Python ("between") — but `balance > 10 and balance < 20` says the same thing more explicitly. Know both, prefer clear.

### Level Up 🚀
Predict-then-run with `balance = 0`: `balance > 0`, `balance >= 0`, `balance == 0`, `balance != 0`, `balance <= 0 and balance >= 0`. Zero is the trickiest boundary in all of finance code (is zero broke? is it "non-negative"?) — and you just mapped it completely.

---

## Lesson 11: Repeating with while Loops

### Big Idea
A `while` loop repeats while a condition stays True.

### Kid Meaning
"WHILE the user hasn't chosen Quit, keep showing the menu."

### Tracker Connection
The tracker shows its menu over and over until you choose to quit.

### The Code
```python
choice = ""
while choice != "quit":
    choice = input("Type a command (or 'quit'): ").lower().strip()
    print(f"You typed: {choice}")
print("Goodbye!")
```

### Line by Line
- `choice = ""` — start empty so the loop begins.
- `while choice != "quit":` — keep going until they type "quit". `!=` means "not
  equal".
- We tidy the input so "Quit" works too.

### Your Turn
1. Build this and type a few things, then "quit".
2. Change the quit word to "exit".
3. Why set `choice = ""` before the loop?

### Check Your Brain
- What does `!=` mean?
- Why must the loop's condition eventually become false?

### More Examples
This menu-loop shape IS your tracker's skeleton — practise it bare:

```python
command = ""
while command != "quit":
    command = input("Command (hello/quit): ").lower().strip()
    if command == "hello":
        print("Hello yourself! 👋")
print("Tracker closed.")
```

A savings loop — repeat WHILE below target:

```python
saved = 0
while saved < 50:
    saved = saved + 10
    print(f"Saved so far: {saved}")
print("Target hit! 🎯")
```

A countdown to payday:

```python
days = 5
while days > 0:
    print(f"{days} days until allowance...")
    days = days - 1
print("PAYDAY! 💰")
```

### Common Mistakes
- **Pre-filled stop word:** `choice = "quit"` before the loop → never runs once. Start empty: `""`.
- **The immortal loop:** nothing inside changes the condition → forever. Stop button / Ctrl+C, fix, relaunch. Everyone's done it; now you have too.
- **Untidied quit:** typing "QUIT " with a space won't match `"quit"` without `.lower().strip()`. Tidy every command.

### Level Up 🚀
Add a counter to the menu loop and on quit, print "You used the tracker N times this session." — then a cheeky `if` for heavy users: more than 5 commands gets "Wow, you really love budgeting! 📊". Session statistics is genuinely how apps measure engagement.

---

## Lesson 12: Lists — Many Values in One Box

### Big Idea
A **list** holds many values in one box, in `[ ]`, separated by commas.

### Kid Meaning
One box holding a whole row of things — like a shopping list on one page.

### Tracker Connection
The tracker keeps every transaction in a list, so it can show your history.

### The Code
```python
amounts = [50, -20, 30, -10]
print(amounts)
print(amounts[0])
print(len(amounts))
```

### Line by Line
- `[50, -20, 30, -10]` — a list; positive = money in, negative = money out.
- `amounts[0]` — the FIRST item (Python counts from 0).
- `len(amounts)` — how many items (4).

### Your Turn
1. Make a list of 3 amounts you imagine spending or getting. Print the first.
2. Print how many items with `len()`.
3. Why does `amounts[0]` give the first item?

### Check Your Brain
- How do you write a list?
- What number is the first item?

### More Examples
Index practice — the skill that makes lists click:

```python
amounts = [50, -20, 30, -10]
print(amounts[1])      # -20 (the SECOND item!)
print(amounts[3])      # -10
print(amounts[-1])     # -10 too! -1 means "last from the back"
```

Lists of words work the same — notes alongside amounts:

```python
notes = ["gift", "snack", "chores", "pure water"]
print(notes[0], amounts[0])    # gift 50 - matching pairs by position!
```

Changing one entry — lists are editable:

```python
amounts[1] = -25     # that snack actually cost more
print(amounts)       # [50, -25, 30, -10]
```

### Common Mistakes
- **Off-the-end index:** `amounts[4]` on a 4-item list → `IndexError: list index out of range`. Four items live at 0,1,2,3.
- **Missing commas:** `[50 -20]` is actually `[30]` — Python did the maths! Commas between every item, especially with negatives.
- **`len` confusion:** `len(amounts)` is 4, but the LAST index is 3. `len - 1` = last index, forever and always.

### Level Up 🚀
Recreate your last week of money as a list (positives and negatives, from memory). Print the first entry, the last (use `-1`), and the count. Next lesson this list starts growing on its own — and two lessons from now it computes your balance automatically.

---

## Lesson 13: Adding to a List with .append()

### Big Idea
`.append()` adds a new item to the end of a list.

### Kid Meaning
Like writing one more line at the bottom of your shopping list.

### Tracker Connection
Each new transaction is `.append()`-ed to the history list.

### The Code
```python
amounts = []
amounts.append(50)
amounts.append(-20)
print(amounts)
print(f"You have {len(amounts)} entries.")
```

### Line by Line
- `amounts = []` — start with an EMPTY list.
- `.append(50)` — add 50 to the end.
- `.append(-20)` — add -20 (a spend) to the end.
- The list grows as we add.

### Your Turn
1. Start an empty list and append 3 amounts. Print the list.
2. Print how many entries there are.
3. What does `.append()` do?

### Check Your Brain
- How do you start an empty list?
- Where does `.append()` add the new item?

### More Examples
Append from input — the list grows as the user types:

```python
amounts = []
amounts.append(int(input("First amount? ")))
amounts.append(int(input("Second amount? ")))
print(amounts)
```

Append inside a LOOP — now it grows forever until quit (your tracker's core!):

```python
amounts = []
choice = ""
while choice != "done":
    choice = input("Amount (or 'done'): ").lower().strip()
    if choice != "done":
        amounts.append(int(choice))
print(f"Collected {len(amounts)} amounts: {amounts}")
```

Other list tools worth meeting — remove and check:

```python
amounts = [50, -20, 30]
amounts.remove(-20)      # delete that entry
print(amounts)           # [50, 30]
print(30 in amounts)     # True - 'in' works on lists
```

### Common Mistakes
- **`append` without the dot:** `append(amounts, 50)` → `NameError`. It's the list's own tool: `amounts.append(50)`.
- **Appending the un-converted:** `amounts.append(input(...))` stores TEXT "50" — later totals glue instead of add! `int(...)` before appending.
- **`=` instead of append:** `amounts = 50` REPLACES the whole list with a number — history obliterated. Append adds; `=` overwrites.

### Level Up 🚀
Build the loop version above, then after "done", print three stats: the count, the biggest amount (`max(amounts)`), and the smallest (`min(amounts)`). Three built-in functions you just discovered yourself — Python is full of these helpers, and pros constantly look them up. Curiosity is the real skill.

---

## Lesson 14: Adding Up a List with a for Loop

### Big Idea
A `for` loop visits each item; we add them up to get a total.

### Kid Meaning
Go down the list and keep a running total — that's your balance.

### Tracker Connection
This is exactly how the tracker works out your balance from all entries.

### The Code
```python
amounts = [50, -20, 30, -10]
total = 0
for amount in amounts:
    total = total + amount
print(f"Your balance is {total} cedis.")
```

### Line by Line
- `total = 0` — start the running total.
- `for amount in amounts:` — each time, `amount` is the next item.
- `total = total + amount` — add it to the total (negatives subtract naturally).
- After the loop, `total` is the balance.

### Your Turn
1. Make a list of amounts and add them up with a `for` loop.
2. Add one negative amount and see the total go down.
3. Why does adding a negative number subtract?

### Check Your Brain
- What does a `for` loop do with a list?
- What is `amount` each time around?

### More Examples
Watch the total build, lap by lap — add a print INSIDE:

```python
amounts = [50, -20, 30, -10]
total = 0
for amount in amounts:
    total = total + amount
    print(f"  after {amount}: total = {total}")
print(f"Final balance: {total}")
```

Count only the spends — a for loop with an `if` inside:

```python
spend_count = 0
for amount in amounts:
    if amount < 0:
        spend_count = spend_count + 1
print(f"You spent money {spend_count} times.")
```

Find the biggest single spend:

```python
biggest_spend = 0
for amount in amounts:
    if amount < biggest_spend:
        biggest_spend = amount
print(f"Biggest spend: {biggest_spend}")
```

### Common Mistakes
- **Total reset inside the loop:** `total = 0` indented into the for-loop wipes it every lap — final answer is just the last item. Starting values live BEFORE.
- **Looping the wrong name:** `for amount in amount:` (list and loop variable same name) → chaos. Plural for the list (`amounts`), singular for the item (`amount`) — a pro naming habit.
- **Expecting order to matter:** adding in any order gives the same total (maths!), but min/max/count patterns DO care about the `if` you write. Trace one lap by hand when unsure.

### Level Up 🚀
The week-in-review engine: from one amounts list, compute and print — final balance, number of incomes, number of spends, and the single biggest income. Four for-loops (or one clever combined one — try both!). You're now doing *data analysis*. That phrase belongs on your future CV.

---

## Lesson 15: Dictionaries — Labelled Information

### Big Idea
A **dictionary** stores information with labels (keys), like `{"amount": 50,
"note": "snack"}`.

### Kid Meaning
A list just holds values in a row. A dictionary labels each value, like a form:
"Amount: 50, Note: snack." You look things up by their label.

### Tracker Connection
Each transaction is a dictionary so it remembers BOTH the amount AND what it was
for.

### The Code
```python
entry = {"amount": 50, "note": "birthday gift"}
print(entry["amount"])
print(entry["note"])
```

### Line by Line
- `{ }` with `key: value` pairs is a **dictionary**.
- `"amount"` and `"note"` are the **keys** (labels).
- `entry["amount"]` — look up the value behind the "amount" label (50).

### Your Turn
1. Make an `entry` dictionary with an amount and a note of your own. Print both.
2. Add a third key `"day"` with a day of the week, and print it.
3. How is a dictionary different from a list?

### Check Your Brain
- What is a key in a dictionary?
- How do you look up a value by its key?

### More Examples
A richer transaction — as many labels as you need:

```python
entry = {"amount": -15, "note": "lunch", "day": "Tuesday", "place": "canteen"}
print(entry["day"])
print(f"{entry['note']} at {entry['place']}: {entry['amount']}")
```

(Inside an f-string, use SINGLE quotes for keys — the f-string already owns the doubles.)

Update and add labels after creation:

```python
entry["amount"] = -18          # price correction
entry["regret"] = False       # worth it!
print(entry)
```

A LIST of dictionaries — your tracker's true shape, one lesson early:

```python
history = [
    {"amount": 50, "note": "gift"},
    {"amount": -20, "note": "snack"},
]
print(history[0]["note"])     # "gift" - index the list, then key the dict!
```

### Common Mistakes
- **Wrong key:** `entry["amout"]` (typo) → `KeyError: 'amout'`. Keys must match exactly — the error names the missing key, read it!
- **Square vs curly:** lists `[ ]`, dictionaries `{ }` with `key: value`. Mixing them up is everyone's week-one dict mistake.
- **Quote collision in f-strings:** `f"{entry["note"]}"` breaks — the doubles fight. Singles inside: `f"{entry['note']}"`.

### Level Up 🚀
Design your "dream transaction record": what would the PERFECT money entry remember? (amount, note, day, mood when buying?, needed-or-wanted?) Build it as a dict with 5+ keys and print a nicely formatted card from it. Data design — deciding what to remember — is the quiet superpower behind every great app.

---

## Lesson 16: Functions for the Tracker

### Big Idea
A function bundles a job; it can take parameters and `return` a result.

### Kid Meaning
A machine with a button. `total_of(list)` adds up a list whenever we press it.

### Tracker Connection
A `balance_of(entries)` function can total all transactions and hand back the
balance.

### The Code
```python
def balance_of(entries):
    total = 0
    for entry in entries:
        total = total + entry["amount"]
    return total

history = [{"amount": 50, "note": "gift"}, {"amount": -20, "note": "snack"}]
print(f"Balance: {balance_of(history)}")
```

### Line by Line
- `balance_of(entries)` takes a list of transaction dictionaries.
- It loops, adding each entry's `["amount"]` to the total.
- `return total` hands the balance back.
- We print it with an f-string.

### Your Turn
1. Add another entry to `history` and see the balance change.
2. Make a function `count_of(entries)` that returns how many entries there are
   (hint: `return len(entries)`).
3. Why is `balance_of` better than adding by hand each time?

### Check Your Brain
- What does this function `return`?
- What does `entry["amount"]` get?

### More Examples
The `count_of` from Your Turn, plus a friend — small functions stack up fast:

```python
def count_of(entries):
    return len(entries)

def biggest_income(entries):
    best = 0
    for entry in entries:
        if entry["amount"] > best:
            best = entry["amount"]
    return best

print(f"{count_of(history)} entries, best income {biggest_income(history)}")
```

Returned values feed other code — chain your machines:

```python
balance = balance_of(history)
if balance < 0:
    print("⚠️ Overspent!")
```

Test like an engineer — known input, known answer:

```python
test_data = [{"amount": 10, "note": "a"}, {"amount": -3, "note": "b"}]
print(balance_of(test_data))    # must print 7 - if not, the function lies!
```

### Common Mistakes
- **`print` instead of `return`:** then `balance_of(history)` hands back `None`, and `if balance < 0:` crashes with `TypeError`. Calculators return; reporters print. `balance_of` is a calculator.
- **`return` inside the loop:** indent `return total` into the for-loop and it exits after the FIRST entry — balance of one transaction! The return belongs after the loop, at function level.
- **Forgetting the parameter:** `balance_of()` → `TypeError: missing 1 required positional argument`. The machine needs its list.

### Level Up 🚀
Write `spend_total(entries)` returning ONLY the spends total (negatives), and `income_total(entries)` for incomes. Then verify the accountant's identity: `income_total(...) + spend_total(...) == balance_of(...)` — print it; it must be True. Three functions agreeing with each other is called *cross-validation*. When your own functions check each other, you're truly engineering.

---

# PART 3 — BUILDING THE TRACKER

---

## Lesson 17: Recording One Transaction

### Big Idea
Ask for an amount and note, store them as a dictionary, add to the history list.

### Kid Meaning
Capture one money event with its details and remember it.

### Tracker Connection
This is how the tracker records every entry.

### The Code
```python
history = []
amount = int(input("Amount (use a minus for spending, e.g. -20): "))
note = input("What for? ").strip()
entry = {"amount": amount, "note": note}
history.append(entry)
print(f"Recorded: {note} ({amount})")
print(history)
```

### Line by Line
- `history = []` — empty list of entries.
- `int(input(...))` — amount as a real number (negative for spending).
- Build a dictionary with the amount and note.
- `.append(entry)` adds it to the history.

### Your Turn
1. Build this and record one entry.
2. Record a spend (a negative amount).
3. Why store amount AND note together in a dictionary?

### Check Your Brain
- What two pieces does each entry store?
- What does `.append(entry)` do?

### More Examples
Record THREE entries and watch the history grow:

```python
history = []
count = 0
while count < 3:
    amount = int(input("Amount (minus for spending): "))
    note = input("What for? ").strip()
    history.append({"amount": amount, "note": note})
    count = count + 1
print(f"Recorded {len(history)} entries:")
print(history)
```

Confirm each entry back, beautifully — income vs spend wording:

```python
if amount >= 0:
    print(f"💵 +{amount} for '{note}' - nice!")
else:
    print(f"🧾 {amount} on '{note}' - noted.")
```

Build the dict inline (no temporary variable) — common pro style:

```python
history.append({"amount": amount, "note": note})
```

### Common Mistakes
- **History reset in the loop:** `history = []` INSIDE the while wipes everything each lap — eternal single entry! The empty list is created ONCE, before.
- **Appending pieces separately:** `history.append(amount)` then `history.append(note)` makes a flat mixed list — amount and note lose each other. Append the DICT so they stay married.
- **Minus confusion:** users forget the minus for spends. Echo it back ("-20 on snack") so they SEE what was recorded — feedback catches mistakes.

### Level Up 🚀
Add a third key while recording: `"day": input("Day? ")`. Then print a "today filter": loop history and show only entries where `entry["day"] == "monday"` (tidy the input!). Congratulations — you've implemented FILTERING, the feature behind every search box you've ever used.

---

## Lesson 18: Recording Many with a Menu Loop

### Big Idea
Use a `while` loop and a menu so the user can add many entries until they quit.

### Kid Meaning
The tracker keeps offering choices until you're done.

### Tracker Connection
The main loop of the app.

### The Code
```python
history = []
choice = ""
while choice != "quit":
    choice = input("\n[add] entry, [quit]: ").lower().strip()
    if choice == "add":
        amount = int(input("Amount (minus for spending): "))
        note = input("What for? ").strip()
        history.append({"amount": amount, "note": note})
        print("Added! ✅")
    elif choice == "quit":
        print("Closing tracker...")
    else:
        print("Type 'add' or 'quit'.")
print(f"You recorded {len(history)} entries.")
```

### Line by Line
- A menu loop runs until "quit".
- `if choice == "add":` — record a new entry (amount + note → dictionary →
  append).
- `elif`/`else` handle quit and typos.
- After the loop, show how many entries.

### Your Turn
1. Build this and add a few entries, then quit.
2. Add a `[help]` command that explains the menu.
3. Why use a dictionary for each entry inside the loop?

### Check Your Brain
- What ends the menu loop?
- What does each `add` create and append?

### More Examples
The `[help]` command from Your Turn, written out:

```python
elif choice == "help":
    print("add  - record money in (+) or out (-)")
    print("quit - close the tracker")
```

Show the entry count live in the prompt — tiny touch, very app-like:

```python
choice = input(f"\n({len(history)} entries) [add] [quit]: ").lower().strip()
```

A confirmation with personality based on the amount:

```python
if amount >= 50:
    print("💰 Big money! Recorded.")
elif amount < 0:
    print("🧾 Spend recorded - watch that balance!")
else:
    print("Added! ✅")
```

### Common Mistakes
- **add-code outside the if:** if the amount/note questions aren't indented under `if choice == "add":`, EVERY command (even quit!) asks them. Indentation routes the traffic.
- **else swallowing quit:** order the chain so `quit` has its own `elif` BEFORE the catch-all else — or "quit" prints "Type add or quit" while quitting. Confusing!
- **Crash on lettered amounts:** type "ten" at the amount → `ValueError`. Park this thought: the guard arrives in your toolkit soon (you met `.isdigit()` thinking in earlier classes; JHS 2 polish coming).

### Level Up 🚀
Add an `undo` command: `history.pop()` removes the LAST entry (look it up — pop is append's opposite!). Guard it: if the list is empty, say "Nothing to undo." Every great app forgives mistakes — yours now does too.

---

## Lesson 19: Showing the Balance

### Big Idea
Total all entries with a function and show the balance on demand.

### Kid Meaning
A "balance" command that adds up everything so far.

### Tracker Connection
Lets the user check their money any time.

### The Code
```python
def balance_of(entries):
    total = 0
    for entry in entries:
        total = total + entry["amount"]
    return total

# inside the menu loop, add:
#   elif choice == "balance":
#       print(f"Your balance is {balance_of(history)} cedis.")
```

### Line by Line
- `balance_of` (Lesson 16) totals the entries.
- We add a `balance` command to the menu that prints it.

### Your Turn
1. Add the `balance` command to your menu loop.
2. Add a few entries, then check the balance.
3. Does spending (negative amounts) lower the balance correctly?

### Check Your Brain
- What does `balance_of` return?
- Where do you add the new menu command?

### More Examples
The balance command, fully wired into the menu:

```python
elif choice == "balance":
    balance = balance_of(history)
    print(f"💼 Current balance: {balance} cedis")
    if balance < 0:
        print("   (that's negative - time to earn!)")
```

A percentage-of-goal readout — balance with CONTEXT:

```python
goal = 100
balance = balance_of(history)
percent = balance / goal * 100
print(f"Goal progress: {percent:.0f}% of {goal} cedis")
```

(`:.0f` rounds to a whole number — display polish.)

A progress bar in pure text:

```python
bars = int(balance / goal * 10)
print("[" + "█" * bars + "·" * (10 - bars) + "]")
```

### Common Mistakes
- **Recomputing by hand:** adding amounts manually in the balance branch instead of calling `balance_of(history)` — the whole POINT of the function is one source of truth. Call it everywhere.
- **Stale balance variable:** computing `balance` once before the loop and printing it forever — it never updates! Compute it fresh INSIDE the command (or after each add).
- **Division by zero:** percent-of-goal with `goal = 0` → `ZeroDivisionError`. Guard: `if goal > 0:` first. Money code meets edge cases fast.

### Level Up 🚀
Combine all three examples into a deluxe `balance` command: amount + goal percentage + the text progress bar. Run it after a few entries. Your beginner tracker now displays data better than some real banking SMS services. 📊

---

## Lesson 20: Listing the History

### Big Idea
Loop through the entries and print each one neatly, numbered.

### Kid Meaning
Show the full statement — every entry, line by line.

### Tracker Connection
The "list" command shows the user their history.

### The Code
```python
def show_history(entries):
    if len(entries) == 0:
        print("No entries yet.")
        return
    number = 1
    for entry in entries:
        print(f"{number}. {entry['note']}: {entry['amount']}")
        number = number + 1

# in the menu: elif choice == "list": show_history(history)
```

### Line by Line
- If the list is empty, say so and `return` early (stop the function).
- Otherwise loop, printing a numbered line for each entry.
- Note: inside an f-string we use single quotes `'note'` because the f-string uses
  double quotes.

### Your Turn
1. Add the `list` command to your menu.
2. Add entries, then list them.
3. Why check for an empty list first?

### Check Your Brain
- What does `return` do when the list is empty?
- Why number the entries?

### More Examples
A prettier statement with income/spend icons:

```python
def show_history(entries):
    if len(entries) == 0:
        print("No entries yet.")
        return
    number = 1
    for entry in entries:
        icon = "💵" if entry["amount"] >= 0 else "🧾"
        print(f"{number}. {icon} {entry['note']}: {entry['amount']}")
        number = number + 1
```

(That `icon = ... if ... else ...` one-liner is a *conditional expression* — a compact if/else that fits in one line. Both styles are fine.)

Show a running balance beside each line — like a real bank statement:

```python
running = 0
number = 1
for entry in entries:
    running = running + entry["amount"]
    print(f"{number}. {entry['note']}: {entry['amount']}   (balance: {running})")
    number = number + 1
```

The "early return" pattern you just used is everywhere in pro code — handle the empty/edge case first, `return`, and the main logic below stays clean and unindented.

### Common Mistakes
- **No empty check:** listing an empty history prints… nothing. Silence looks broken. Always say "No entries yet."
- **Quote collision:** `f"{entry["note"]}"` breaks — single quotes inside f-strings: `entry['note']`.
- **Number never increments:** forget `number = number + 1` and every line says "1." — a statement printed by someone who can't count!

### Level Up 🚀
Add a `last` command that shows only the final 3 entries — slice the list with `entries[-3:]` ("the last three"). Slicing is a famous Python superpower; this is your first taste. Big histories need short views — that's why your banking app has "recent transactions."

---

## Lesson 21: A Low-Balance Warning

### Big Idea
After changes, warn the user if their balance is low or negative.

### Kid Meaning
Like a friendly nudge: "Careful — you're running low!"

### Tracker Connection
Helps the user manage money wisely.

### The Code
```python
balance = balance_of(history)
if balance < 0:
    print("⚠️ You've overspent! Balance is negative.")
elif balance < 10:
    print("⚠️ Low balance — spend carefully.")
else:
    print(f"👍 Balance is healthy: {balance} cedis.")
```

### Line by Line
- Get the current balance with `balance_of`.
- `< 0` → overspent; `< 10` → low; otherwise healthy.
- Order matters: most serious check first.

### Your Turn
1. Show this warning after each `add`.
2. Change the "low" threshold to a number you choose.
3. Why check `< 0` before `< 10`?

### Check Your Brain
- What are the three balance states here?
- Why does the order of the checks matter?

### More Examples
Wrap the warning in a function — call it after every change:

```python
def check_balance(entries):
    balance = balance_of(entries)
    if balance < 0:
        print("⚠️ You've overspent! Balance is negative.")
    elif balance < 10:
        print("⚠️ Low balance - spend carefully.")
    else:
        print(f"👍 Healthy: {balance} cedis.")
```

A spending-speed warning — compare the LAST entry to the balance:

```python
last = history[-1]["amount"]
if last < 0 and abs(last) > balance_of(history) / 2:
    print("🚨 That single spend was over half your money!")
```

(`abs(...)` strips the minus sign so we can compare sizes.)

Make the threshold the USER's choice at startup:

```python
low_mark = int(input("Warn me when balance drops below: "))
# later: elif balance < low_mark: ...
```

### Common Mistakes
- **Order flipped:** check `< 10` before `< 0` and a -50 balance gets the mild "low balance" warning — underplaying a crisis! Most severe first.
- **Warning only in the balance command:** the warning matters most right AFTER a spend — call `check_balance(history)` at the end of every add.
- **Nagging on healthy balances:** printing warnings every single time gets ignored (alarm fatigue is real!). The healthy path can stay quiet or brief.

### Level Up 🚀
Add a "budget coach" line to the overspent case: compute how much they'd need to add to get back to zero, and suggest it — `f"Add {abs(balance)} cedis to break even."` Advice with a number beats advice with adjectives — in apps and in life.

---

## Lesson 22: The Full Tracker

### Big Idea
Combine menu, add, balance, list, and warnings into one complete app.

### Kid Meaning
Your finished, useful money tracker — start to finish!

### Tracker Connection
This is your complete Pocket-Money Budget Tracker.

### The Code
```python
def balance_of(entries):
    total = 0
    for entry in entries:
        total = total + entry["amount"]
    return total

def show_history(entries):
    if len(entries) == 0:
        print("No entries yet.")
        return
    number = 1
    for entry in entries:
        print(f"{number}. {entry['note']}: {entry['amount']}")
        number = number + 1

print("=" * 30)
print("   POCKET-MONEY TRACKER 💰")
print("=" * 30)

history = []
choice = ""
while choice != "quit":
    choice = input("\n[add] [balance] [list] [quit]: ").lower().strip()
    if choice == "add":
        amount = int(input("Amount (minus for spending): "))
        note = input("What for? ").strip()
        history.append({"amount": amount, "note": note})
        print("Added! ✅")
        balance = balance_of(history)
        if balance < 0:
            print("⚠️ You've overspent!")
        elif balance < 10:
            print("⚠️ Low balance — spend carefully.")
    elif choice == "balance":
        print(f"Your balance is {balance_of(history)} cedis.")
    elif choice == "list":
        show_history(history)
    elif choice == "quit":
        print("Final balance:", balance_of(history))
        print("Goodbye! 👋")
    else:
        print("Please type add, balance, list, or quit.")
```

### Line by Line
- Two functions: `balance_of` and `show_history`.
- A titled welcome, then the menu loop.
- `add` records an entry and shows a warning if low/overspent.
- `balance` and `list` report; `quit` shows the final balance and ends.

### Your Turn
1. Build the full tracker and use it: add income and spends, list, check balance.
2. Add a `help` command explaining each option.
3. Trace what happens when you add a big spend that makes the balance negative.

### Check Your Brain
- What does each menu command do?
- Where is the low-balance warning shown?

### More Examples
The release checklist — your tracker must pass all seven:

```python
# Test 1: add income       -> confirmed + balance correct?
# Test 2: add a spend      -> negative handled, warning if low?
# Test 3: overspend        -> negative balance + overspent warning?
# Test 4: balance command  -> matches your mental maths?
# Test 5: list command     -> all entries, numbered, in order?
# Test 6: nonsense command -> polite correction, no crash?
# Test 7: quit             -> final balance + goodbye?
```

A startup greeting that loads the owner's name:

```python
owner = input("Who owns this tracker? ").strip().title()
print(f"Welcome, {owner}! Let's manage your money.")
```

A session summary at quit — bookend the experience:

```python
elif choice == "quit":
    print(f"📋 Session summary: {len(history)} entries.")
    print(f"💼 Final balance: {balance_of(history)} cedis.")
    print(f"Goodbye, {owner}! 👋")
```

### Common Mistakes
- **Functions below the loop:** `balance_of` defined after it's first called → `NameError`. Functions at the top — the file reads: tools first, then the program.
- **The `while choice != "quit"` + else trap:** typing "QUIT" untidied doesn't quit AND falls to else. The `.lower().strip()` on the input line is load-bearing — never remove it.
- **Testing once, trusting forever:** every change can break an old command. Re-run the checklist after EVERY new feature — that's why pros automate tests.

### Level Up 🚀
Your tracker is feature-complete — now run a real "user test": hand it to a family member with actual pocket-money history and watch them use it WITHOUT helping. Write down every place they hesitated. Those notes are pure gold — real products are built from exactly such observations.

---

## Lesson 23: Making It Smarter — Totals In and Out

### Big Idea
Show separately how much came IN and how much went OUT.

### Kid Meaning
Like a mini report: "You earned X, you spent Y."

### Tracker Connection
Gives the user a clearer picture of their habits.

### The Code
```python
def totals(entries):
    money_in = 0
    money_out = 0
    for entry in entries:
        if entry["amount"] >= 0:
            money_in = money_in + entry["amount"]
        else:
            money_out = money_out + entry["amount"]
    return money_in, money_out

got, spent = totals(history)
print(f"In: {got}   Out: {spent}")
```

### Line by Line
- We separate positive amounts (in) from negative ones (out).
- `return money_in, money_out` — a function can hand back TWO values at once!
- `got, spent = totals(history)` — catch both returned values.

### Your Turn
1. Add a `report` command that prints money in and money out.
2. Show the spent total as a positive number (hint: multiply by -1).
3. How can a function return two values?

### Check Your Brain
- How does the code tell income from spending?
- What does `return money_in, money_out` do?

### More Examples
The `report` command, fully dressed:

```python
elif choice == "report":
    got, spent = totals(history)
    print("📊 MONEY REPORT")
    print(f"   In:  +{got}")
    print(f"   Out: {spent}   (that's {abs(spent)} spent)")
    print(f"   Net: {got + spent}")
```

A savings rate — the one number financial advisors obsess over:

```python
got, spent = totals(history)
if got > 0:
    rate = (got + spent) / got * 100
    print(f"You kept {rate:.0f}% of everything you received.")
```

Two-value returns work anywhere — here's min and max together:

```python
def extremes(entries):
    amounts = []
    for entry in entries:
        amounts.append(entry["amount"])
    return min(amounts), max(amounts)

lowest, highest = extremes(history)
```

### Common Mistakes
- **Catching into one box:** `result = totals(history)` works but gives a *pair* — `result[0]` and `result[1]`. The two-box catch `got, spent = ...` is clearer.
- **Wrong unpack order:** `spent, got = totals(...)` swaps the meanings silently — your report lies politely. Match the return order.
- **Zero-income division:** the savings-rate maths with `got = 0` → `ZeroDivisionError`. The `if got > 0:` guard isn't decoration.

### Level Up 🚀
Add a "needs vs wants" analysis: when recording, ask `kind = input("need or want? ")` and store it in the dict. Then a `wants` command totals only the want-spending. Most adults have never measured their wants-spending — your JHS 2 program does. Let that sink in. 💡

---

## Lesson 24: Showcase and Reflection

### Big Idea
You built a real, useful app — celebrate and share it.

### Kid Meaning
From zero to a working money tracker with menus, lists, totals, and warnings. Be
proud!

### Tracker Connection
This is your finished Pocket-Money Budget Tracker.

### The Code
```python
# This is YOUR finished tracker. Read every line top to bottom and
# make sure you can explain it. That's how you know you've learned it.
```

### Line by Line
- Open your full tracker file and explain each line out loud.
- Any fuzzy line → revisit the lesson that taught it.

### Your Turn (Showcase)
1. Demonstrate your tracker to your class or family — record real pocket money!
2. Explain THREE lines of your code to them.
3. Pick ONE upgrade you'd add next (saving to a file, categories, a weekly limit)
   and describe how it might work.
4. Brilliant — you're now a beginner Python app-maker! 🎉

### Check Your Brain
- What was your favourite part to build?
- Explain what a variable, an `if`, a `for` loop, a list, a dictionary, and a
  function with `return` each do.
- What's one thing you understand now that you didn't 4 months ago?

### Look How Far You've Come 🏆
Four months ago: zero code. Today you've built a real APP that uses:

- **print & f-strings** — clean money displays (Lessons 1, 7)
- **variables & money maths** — balances that update correctly (Lessons 3–5)
- **input + int()** — real amounts from real typing (Lessons 6–8)
- **if / elif / else** — affordability checks and smart warnings (Lessons 9, 21)
- **while menu loops** — an app that runs until you quit (Lessons 11, 18)
- **lists + append** — a growing transaction history (Lessons 12–13)
- **for loops** — totals and reports computed from data (Lessons 14, 23)
- **dictionaries** — labelled records like real databases use (Lesson 15)
- **functions + return (even two values!)** — `balance_of`, `totals`, tested and trusted (Lessons 16, 23)

This is not a toy. Banking apps are this, scaled up: records in, totals out, warnings when needed. You've built the seed of financial software — and learned money sense doing it.

### More Examples (Showcase ideas)
```python
# 1. A branded startup screen
print("YAA-PAY v1.0 💰 - your money, your rules")
```

```python
# 2. Demo data so the audience sees a rich history instantly
history = [
    {"amount": 50, "note": "birthday gift"},
    {"amount": -12, "note": "waakye"},
    {"amount": 20, "note": "errand reward"},
]
```

```python
# 3. The closing line that lands
print("Track it. Understand it. Grow it. 📈")
```

### Common Mistakes (on showcase day!)
- **Editing during the demo:** code freeze! A working v1 beats a broken v2.
- **Starting from empty:** an empty tracker demos badly — preload the demo data above so `list` and `report` shine immediately.
- **Forgetting the story:** don't just show commands — tell the story ("I spent too much on snacks, and MY OWN APP warned me").

### Level Up 🚀 (your next adventure)
1. **Save to a file** — `open("history.txt", "w")` can make entries survive shutdown. The bridge from program to real product.
2. **Categories + charts** — group spends by category and print emoji bar charts per category.
3. **A weekly allowance auto-add** — and a projection: "at this rate you'll have X by December."

You came in knowing nothing. You leave with a working app, an engineer's habits, and better money sense than most adults. Final level: unlocked. 🎓💰🚀