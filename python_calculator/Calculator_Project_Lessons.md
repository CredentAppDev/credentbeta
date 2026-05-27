# Python Calculator Lessons: Kid Builder Edition

This lesson is for kids who are building the Python Calculator project.

The goal is not to memorize big computer words. The goal is to understand what
the app is doing, one small idea at a time.

By the end, you will understand how this project works:

- Python gives the computer instructions.
- The app shows a menu so you can pick an operation.
- The app asks you to type two numbers.
- It does the math and shows the answer.
- It checks for impossible problems like dividing by zero.
- It keeps a history of every calculation you did.
- It can repeat as many times as you like.

Think of the computer like a very fast helper. It is fast, but it is not wise.
It only does exactly what your instructions say.

---

## How To Use These Lessons

Each lesson has five parts:

1. **Big idea** - the new thing you are learning.
2. **Kid meaning** - a simple explanation.
3. **Real-life example** - something you already understand.
4. **Try it** - a small piece of code.
5. **Calculator connection** - how it helps the real app.

Rules for learning:

- Type the code yourself. Typing helps your brain learn.
- If you get an error, read it slowly. Errors are clues.
- Change one thing at a time.
- Run the code often.
- Explain what you built out loud, like you are teaching a friend.

---

## Project Picture

Before we code, imagine the full app.

The computer has to do these jobs:

1. Show a welcome message.
2. Show the menu: add, subtract, multiply, divide, history, quit.
3. Ask the user to pick one.
4. Ask the user to type the first number.
5. Ask the user to type the second number.
6. Do the math.
7. Show the answer.
8. Save the calculation to history.
9. Go back to step 2 and repeat.

That is the whole app loop.

Kid meaning: An app loop is like a vending machine. You pick, it gives you
what you picked, then it is ready again for the next choice.

---

## Lesson 1: What Is Python?

### Big Idea

Python is a language for giving instructions to a computer.

### Kid Meaning

Python is like writing a very clear list of instructions:

```text
Ask for a number.
Ask for another number.
Add them.
Show the answer.
```

The computer follows instructions like that, but written in Python.

You cannot skip steps, and you cannot be vague. The computer needs every
detail spelled out.

### Real-Life Example

If you tell a friend:

```text
Pick a number.
Pick another number.
Tell me their sum.
```

That is a set of instructions. Code is also a set of instructions.

Now imagine your friend is a robot that takes every word literally. If you
say "give me the sum" but the robot was never told what "sum" means, it
will stop and do nothing.

That is exactly how Python works. It is very powerful, but it only knows
what you teach it.

### Try It

Open Terminal or Command Prompt and start Python:

Mac:

```bash
python3
```

Windows:

```bash
python
```

Then type these one at a time:

```python
print("Welcome to the Calculator!")
print("I can add, subtract, multiply, and divide.")
print("Let us get started.")
```

### What Happened?

`print` means "show this on the screen."

Each `print` line shows one message. Python runs them in order, top to
bottom, one at a time.

### Another Example

Try this:

```python
print("First line")
print("Second line")
print("Third line")
```

Python always works in order. It never skips and never goes backwards on
its own.

### Calculator Connection

The real app shows a welcome message when it starts:

```python
print("Welcome to the Python Calculator!")
```

After that, every `print` in the app is Python following the same rule:
show this on the screen, in order, one line at a time.

### Check Your Brain

What does `print` do?

Answer: It shows something on the screen.

What order does Python follow when it reads instructions?

Answer: Top to bottom, one at a time.

---

## Lesson 2: Text And Numbers

### Big Idea

Python treats words and numbers differently.

### Kid Meaning

Words need quotation marks. Numbers do not.

This is one of the most important rules in Python.

```python
"hello"    # this is text
42         # this is a number
"42"       # this looks like a number but it is text
```

### Real-Life Example

If you write `"10"` with quotes, Python sees it like a label on a box.
You cannot add labels together the way you add numbers.

If you write `10` without quotes, Python sees it like a real number
for math.

Think of a price tag in a shop. The tag says `$5`. That printed word is
not the same as having 5 actual coins in your hand. The tag is text.
The coins are numbers.

### Try It

```python
print("10 + 5")
print(10 + 5)
```

### What Happened?

The first line shows the text exactly as written:

```text
10 + 5
```

The second line does the actual math:

```text
15
```

### More Examples

Try these to see the difference:

```python
print("3 * 4")
print(3 * 4)
```

First line shows:

```text
3 * 4
```

Second line shows:

```text
12
```

Now try mixing text with a plus sign:

```python
print("Hello" + " " + "World")
```

With text, `+` joins the words together instead of doing math.
This is called concatenation. Kid meaning: gluing words together.

### What Goes Wrong Without Quotes

Try this and see the error:

```python
print(hello)
```

Python looks for a variable called `hello`. It finds nothing and
complains. Quotation marks tell Python: this is a piece of text,
not a variable name.

### Calculator Connection

When the user types a number into the app, Python receives it as text.
The app must convert it to a real number before doing math:

```python
number = float(user_input)
```

Kid meaning:

```text
Turn the typed word "10" into the real number 10.
```

Without this step, the app could not add, subtract, multiply, or divide.

### Tiny Challenge

The app adds two numbers: `8` and `4`. What does each line print?

```python
print("8 + 4")
print(8 + 4)
```

Answer: First line shows `8 + 4`. Second line shows `12`.

---

## Lesson 3: Variables Are Boxes

### Big Idea

A variable stores something so the computer can remember it.

### Kid Meaning

A variable is like a labeled box.

```python
result = 15
```

This means:

```text
Make a box called result.
Put 15 inside it.
```

Later in the code, when Python sees `result`, it opens that box and
uses whatever is inside.

### Real-Life Example

Imagine a sticky note on a calculator:

```text
Last answer: 15
```

The sticky note can be replaced with a new answer every time.

Variables work like that. The name stays the same, but the value inside
can change.

Another way to think about it: a variable is like a piggy bank with a
label. You can put money in, take it out, or count what is there. The
piggy bank keeps holding it for you until you need it.

### Try It

```python
first_number = 8
second_number = 4
answer = first_number + second_number
print(answer)
```

### What Happened?

Python made three boxes:
- `first_number` holding `8`
- `second_number` holding `4`
- `answer` holding the result of adding them

Then it showed the contents of `answer`.

### Changing A Variable

Variables can change as your program runs:

```python
score = 0
print(score)

score = score + 10
print(score)

score = score + 10
print(score)
```

What do you see?

```text
0
10
20
```

Each time `score = score + 10` runs, Python opens the box, takes the
old number out, adds 10 to it, and puts the new number back in.

### Naming Rules

Variable names:
- Cannot have spaces: use `first_number`, not `first number`
- Cannot start with a digit: `2score` is not allowed, `score2` is fine
- Are case-sensitive: `Result` and `result` are two different boxes

Good names make code easier to read. `first_number` tells you more
than just `x`.

### Calculator Connection

The real app stores what the user typed:

```python
first_number = float(input("Enter first number: "))
second_number = float(input("Enter second number: "))
```

Then it stores the result:

```python
result = first_number + second_number
```

These three variables travel through the whole calculation together.
Without them, the app would forget the numbers the moment they were
typed.

### Check Your Brain

If `first_number` is `6` and `second_number` is `3`, what is `result`
after this line?

```python
result = first_number + second_number
```

Answer: `9`

What is `result` after this line runs next?

```python
result = result * 2
```

Answer: `18`

---

## Lesson 4: Files Are Saved Instructions

### Big Idea

Typing in Python one line at a time is useful for testing, but an app
needs a file.

### Kid Meaning

A Python file is like a recipe book page. The computer reads it from top
to bottom and carries out every step.

When you close the Python terminal, everything you typed is gone.
A file saves your instructions so you can run them again any time.

### Real-Life Example

A calculator instruction sheet does not just say:

```text
Add.
```

It says:

```text
Type the first number.
Type the second number.
Add them.
Show the answer.
```

A Python file works the same way. Every instruction is written down in
order so nothing is forgotten.

Think of a board game rule book. The rules are written in a file (the
book) so the game can be played again and again without anyone having
to remember every rule from scratch.

### Try It

Create a file named `calc_test.py`.

Put this inside:

```python
first_number = 10
second_number = 3
result = first_number + second_number
print("Answer:", result)
```

Run it:

Mac:

```bash
python3 calc_test.py
```

Windows:

```bash
python calc_test.py
```

### What Happened?

Python opened the file, read every line from top to bottom, and showed
the answer.

You can run it again and again. The result is always the same because the
instructions are saved.

### Changing The File

Now try editing the numbers:

```python
first_number = 25
second_number = 7
result = first_number + second_number
print("Answer:", result)
```

Run it again. The answer changes because the instructions changed.

### Important Detail

The file must be saved before you run it. If you edit the file and forget
to save, Python runs the old version.

Most code editors save automatically. If yours does not, use Ctrl+S on
Windows or Cmd+S on Mac before running.

### Calculator Connection

The real project file is named:

```text
calculator.py
```

That file holds all 60+ lines of the full calculator. Every time you
type `python calculator.py`, Python reads that file from start to finish
and runs the whole app.

---

## Lesson 5: Getting Input From The User

### Big Idea

`input` lets the computer ask the user to type something.

### Kid Meaning

`input` is like the computer raising its hand and asking a question.
The program stops completely and waits for you to type. Nothing else
happens until you press Enter.

### Real-Life Example

When a cashier says "How many bags would you like?", they wait for your
answer before they can continue packing.

`input` works the same way. The program is the cashier. It stops and
waits for you to answer before moving on.

Another example: a vending machine shows a screen that says "Enter
your selection." The machine does nothing until you press the buttons.

### Try It

```python
name = input("What is your name? ")
print("Hello,", name)
```

### What Happened?

The program showed the question.
You typed your name and pressed Enter.
The program stored your answer in `name`.
Then it said hello using your name.

### More Examples

Try asking for more things:

```python
favourite_number = input("What is your favourite number? ")
print("Cool! Your favourite number is", favourite_number)
```

Or ask multiple questions in a row:

```python
city = input("What city do you live in? ")
colour = input("What is your favourite colour? ")
print(city, "sounds great! And", colour, "is a lovely colour.")
```

### What `input` Always Gives Back

Whatever the user types, `input` gives it back as text.

Even if the user types `42`, Python holds it as the text `"42"`,
not the number `42`.

This is why the next lesson is so important.

### Calculator Connection

The app asks the user to type numbers:

```python
first_number = input("Enter the first number: ")
second_number = input("Enter the second number: ")
```

Kid meaning:

```text
Stop here and wait for the user to type a number.
Store what they type in first_number.
Stop again and wait for the second number.
Store that in second_number.
```

### Check Your Brain

Does `input` give back a number or text?

Answer: Text. We have to convert it to a number ourselves.

If the user types `7`, what does Python think it received?

Answer: The text `"7"`, not the number `7`.

---

## Lesson 6: Converting Text To Numbers

### Big Idea

`input` always gives text. To do math, you must convert that text to
a real number.

### Kid Meaning

The user types `"7"`. Python sees the word seven, not the number 7.
`float` turns that text into a real number that Python can do math with.

Without this step, trying to add two inputs would join them like words
instead of adding them like numbers.

### Real-Life Example

Imagine writing the word "five" on a slip of paper and feeding it into
a calculator. It would not work. You must write `5`.

`float` does that conversion for Python. It takes the paper label and
turns it into a real usable number.

### What Happens Without float

Try this to see the problem:

```python
a = input("First number: ")
b = input("Second number: ")
print(a + b)
```

If you type `3` and then `4`, what do you see?

```text
34
```

Python joined the two pieces of text `"3"` and `"4"` together instead
of adding them. This is called string concatenation, not addition.

### The Fix

```python
a = float(input("First number: "))
b = float(input("Second number: "))
print(a + b)
```

Now if you type `3` and `4`, you see:

```text
7.0
```

Python converted each piece of text into a real number first, then
added them.

### Try It

```python
typed = input("Type a number: ")
number = float(typed)
print("Double it:", number * 2)
print("Half of it:", number / 2)
print("Plus ten:", number + 10)
```

### What Happened?

Every calculation worked because `float` gave Python a real number to
work with.

Try typing `7.5` as your number. It still works because `float` handles
decimals.

Try typing `hello` and see what error you get. That error is Python
telling you it cannot turn a word into a number.

### Calculator Connection

The real app does this every time the user types a number:

```python
first_number = float(input("Enter first number: "))
```

Kid meaning:

```text
Ask for input, then immediately convert the text to a number.
```

Both steps are on one line. Python reads them right to left:
first it runs `input`, then it wraps the result in `float`.

### Helpful Detail

`float` means decimal number. It can hold numbers like `3.5` or `10.0`
or `-2.75`. The calculator uses `float` so it works with whole numbers
AND decimals without needing two different types.

`int` is another option, but it only holds whole numbers. `float` is
safer for a calculator because someone might type `3.5`.

---

## Lesson 7: The Four Operations

### Big Idea

Python can add, subtract, multiply, and divide using simple symbols.

### Kid Meaning

These four operations are the heart of the calculator. Each one uses
a special symbol:

```text
+   addition
-   subtraction
*   multiplication
/   division
```

### Real-Life Example

These are the same four operations on every calculator you have ever
used. The only difference is the symbols.

On a physical calculator you press `x` for multiply. In Python you
type `*`. On a physical calculator you press `÷` for divide. In Python
you type `/`.

### Try It

```python
a = 10
b = 3

print("Add:     ", a + b)
print("Subtract:", a - b)
print("Multiply:", a * b)
print("Divide:  ", a / b)
```

### What Happened?

```text
Add:      13
Subtract: 7
Multiply: 30
Divide:   3.3333333333333335
```

Division can give a long decimal. Lesson 17 shows how to tidy that up.

### More Examples

Try bigger numbers:

```python
a = 100
b = 7

print(a + b)
print(a - b)
print(a * b)
print(a / b)
```

Try negative numbers:

```python
a = -5
b = 3

print(a + b)
print(a - b)
print(a * b)
print(a / b)
```

Negative numbers work exactly the same way.

### Order Of Operations

Python follows the same order as maths class:

```text
Brackets first.
Then multiply and divide.
Then add and subtract.
```

Try this:

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

First line: multiply first, then add.

```text
14
```

Second line: brackets first, then multiply.

```text
20
```

When in doubt, use brackets to make the order clear.

### Calculator Connection

The app does the chosen operation and stores the result:

```python
result = first_number + second_number
result = first_number - second_number
result = first_number * second_number
result = first_number / second_number
```

Only one of those lines runs at a time, depending on what the user
picked from the menu.

### Tiny Challenge

What does `5 ** 2` mean in Python?

Try it and see. Answer: `25`. The `**` symbol means "to the power of."

So `5 ** 2` means 5 squared, which is `5 * 5`.

What does `2 ** 10` give? Answer: `1024`.

---

## Lesson 8: Loops Do Repeating Jobs

### Big Idea

A loop repeats code without you having to write the same thing over and
over again.

### Kid Meaning

A loop means "do this again."

Without loops, you would have to write out every single step by hand.
With a loop, you write the step once and tell Python how many times to
do it.

### Real-Life Example

If your teacher says:

```text
Practise your times tables 5 times.
```

They do not need to say:

```text
Do times tables.
Do times tables.
Do times tables.
Do times tables.
Do times tables.
```

The instruction "5 times" is the loop.

A washing machine is another good example. You do not press "wash" once
for each item of clothing. You press "start" once and the machine loops
through its cycle automatically.

### The for Loop

```python
for number in range(5):
    print("Calculation number", number + 1)
```

Important: the second line is indented with spaces. In Python,
indentation tells the computer what belongs inside the loop.

### What Happened?

```text
Calculation number 1
Calculation number 2
Calculation number 3
Calculation number 4
Calculation number 5
```

Python ran the indented line 5 times. The variable `number` was 0, then
1, then 2, then 3, then 4. Adding 1 made it show 1, 2, 3, 4, 5.

### The while Loop

There is another kind of loop that keeps going until a condition changes:

```python
count = 0

while count < 3:
    print("Count is", count)
    count = count + 1

print("Done!")
```

What do you see?

```text
Count is 0
Count is 1
Count is 2
Done!
```

Kid meaning: Keep going while `count` is less than 3. Stop when it
reaches 3.

### The Endless Loop

This loop runs forever on purpose:

```python
while True:
    print("Still running...")
```

Press Ctrl+C to stop it.

`while True` means "keep going because True never becomes False."

The calculator app uses this on purpose. It wants to keep showing the
menu until the user chooses to quit.

### Calculator Connection

The real app uses `while True` so the menu keeps appearing after each
calculation:

```python
while True:
    # show menu
    # get choice
    # do the calculation
```

Kid meaning: `while True` means "keep going until we tell you to stop."

The loop only ends when the user picks quit and the app runs `break`.
You will learn about `break` in Lesson 16.

### Tiny Challenge

Change `range(5)` to `range(10)`.

What changes?

Answer: It prints 10 times instead of 5.

Now change it to `range(1, 6)`.

What do you see?

Answer: It counts from 1 to 5 instead of 0 to 4.

---

## Lesson 9: If Statements Make Choices

### Big Idea

An `if` statement lets the computer choose what to do based on a
condition.

### Kid Meaning

`if` means "check something, then decide."

Every decision in the calculator goes through an `if` statement. Which
operation to run, whether to divide by zero, whether to quit — all of
those are `if` statements.

### Real-Life Example

Your brain uses if statements all day:

```text
If it is raining, take an umbrella.
If it is sunny, wear sunglasses.
```

Or for the calculator:

```text
If the user picks plus, add.
If the user picks minus, subtract.
If the user picks times, multiply.
If the user picks divide, divide.
```

Apps think exactly like that.

### Try It

```python
choice = "add"

if choice == "add":
    print("Adding!")
elif choice == "subtract":
    print("Subtracting!")
elif choice == "multiply":
    print("Multiplying!")
elif choice == "divide":
    print("Dividing!")
else:
    print("I do not know that operation.")
```

### What Happened?

Python checked `choice`. It matched `"add"`, so it printed `Adding!` and
skipped the rest.

Change `choice = "add"` to `choice = "multiply"` and run it again.

Now it prints `Multiplying!`.

Change it to `choice = "something_else"` and run it again.

Now it prints `I do not know that operation.` because none of the
earlier checks matched.

### The Three Parts

```text
if   -> check this first
elif -> if that failed, check this next (you can have many of these)
else -> if everything failed, do this
```

You can have as many `elif` lines as you need. You only ever have one
`if` and one `else`.

### Comparing Values

The `==` symbol means "is equal to." It is different from `=`.

```text
=   means "put this value into the box" (assignment)
==  means "check if these two things are equal" (comparison)
```

```python
score = 10       # put 10 into the score box
if score == 10:  # check if score equals 10
    print("Ten!")
```

Other comparison symbols:

```text
>   greater than
<   less than
>=  greater than or equal to
<=  less than or equal to
!=  not equal to
```

### Calculator Connection

The app checks the menu number the user picked:

```python
if choice == "1":
    result = first_number + second_number
elif choice == "2":
    result = first_number - second_number
elif choice == "3":
    result = first_number * second_number
elif choice == "4":
    result = first_number / second_number
```

Kid meaning:

```text
Look at the choice number.
Do the matching operation.
Only one branch runs, then the rest are skipped.
```

### Check Your Brain

What should happen if the user types something that is not on the menu?

Answer: The app should tell them to pick a valid number.

Which part of the if statement handles that?

Answer: The `else` block.

---

## Lesson 10: Functions Are Mini Machines

### Big Idea

A function is a named set of instructions you can use again and again.

### Kid Meaning

A function is like a small machine. You give it something, it does a job,
and sometimes it gives something back.

Without functions, you would have to write the same instructions every
time you needed them. With functions, you write them once and call them
by name whenever you need them.

### Real-Life Example

A calculator button is like a function:

```text
Input: two numbers
Job: add them
Output: the answer
```

Press the button ten times with different numbers. The button does the
same job every time. You did not have to redesign the button.

A microwave is another good example. Press the "popcorn" button and it
runs a set of instructions (time, power level, listening for pops). You
do not re-enter those instructions every time. You just press the button.

### Try It

```python
def add(a, b):
    return a + b

print(add(5, 3))
print(add(10, 7))
print(add(100, 200))
```

### What Happened?

`def` means "define a new function called `add`."
`a` and `b` are the inputs. They are called parameters.
`return` means "give this answer back."

Each `print(add(...))` call sends two numbers in and gets one number
back.

### A Function With More Steps

A function can do many things before returning:

```python
def describe_result(a, b):
    total = a + b
    doubled = total * 2
    print("The sum is", total)
    print("Doubled it is", doubled)
    return total

answer = describe_result(4, 6)
print("Returned value:", answer)
```

### Functions Without Return

Some functions just do a job and do not give anything back:

```python
def greet(name):
    print("Hello,", name)
    print("Welcome to the calculator!")

greet("Ava")
greet("Ben")
```

These are useful for printing menus and messages.

### Calculator Connection

The project has a function for each operation:

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    return a / b
```

Each function has one job. When the app needs to add, it calls `add`.
When it needs to divide, it calls `divide`. The app never has to write
out the operation itself — it just calls the right function.

There is also a function for the menu:

```python
def print_menu():
    print("\n--- Calculator Menu ---")
    print("1. Add")
    print("2. Subtract")
    print("3. Multiply")
    print("4. Divide")
    print("5. Show history")
    print("6. Quit")
```

Kid meaning:

```text
Instead of writing all those print lines every time the menu is needed,
just call print_menu() and it does the whole job.
```

### Kid Meanings

`add` means:

```text
Add two numbers and give back the answer.
```

`subtract` means:

```text
Subtract the second number from the first and give back the answer.
```

`multiply` means:

```text
Multiply two numbers together and give back the answer.
```

`divide` means:

```text
Divide the first number by the second and give back the answer.
```

`print_menu` means:

```text
Print all six menu options neatly on the screen.
```

---

## Lesson 11: Lists Store Many Things

### Big Idea

A list stores many values in a row, in order.

### Kid Meaning

A list is like a receipt. Each item has its own slot. New items join at
the back. The order is remembered.

### Real-Life Example

A shopping receipt:

```text
apples
bread
milk
```

That is a list. Each item is on its own line, and the order is the order
they were bought.

In Python, lists look like this:

```python
shopping = ["apples", "bread", "milk"]
```

The square brackets `[]` hold all the items. Commas separate them.

### Try It

```python
history = []

history.append("10 + 3 = 13")
history.append("7 - 2 = 5")
history.append("4 * 6 = 24")

print(history)
print("Number of calculations:", len(history))
```

### What Happened?

`[]` makes an empty list.
`.append(...)` adds one item to the end.
`len(history)` counts how many items are in the list.

### Accessing Items

You can get one item out of a list using its position number.

Position numbers start at 0.

```python
history = ["10 + 3 = 13", "7 - 2 = 5", "4 * 6 = 24"]

print(history[0])   # first item
print(history[1])   # second item
print(history[2])   # third item
print(history[-1])  # last item (counting from the back)
```

You see:

```text
10 + 3 = 13
7 - 2 = 5
4 * 6 = 24
4 * 6 = 24
```

Kid meaning: `history[-1]` is a shortcut for "give me the last one."

### Checking If A List Is Empty

```python
history = []

if len(history) == 0:
    print("No calculations yet.")
else:
    print("You have", len(history), "calculations.")
```

The real calculator app uses this to show a friendly message when the
user asks for history before doing any calculations.

### Calculator Connection

The app creates an empty history list before the loop starts:

```python
history = []
```

After each answer, it adds a new entry:

```python
history.append(f"{first_number} {symbol} {second_number} = {answer}")
```

Kid meaning:

```text
Add this calculation to the end of the history list.
The list grows by one item after every calculation.
```

### Check Your Brain

If you `.append` three times to an empty list, how many items are in
the list?

Answer: 3

What position number is the first item in a list?

Answer: 0

---

## Lesson 12: Going Through A List

### Big Idea

A `for` loop can go through every item in a list, one at a time.

### Kid Meaning

"Go through the list and do something with each item."

The loop picks up the first item, does the job, then moves to the
second item, does the job again, and keeps going until the list ends.

### Real-Life Example

Reading out a receipt means reading line one, then line two, then line
three, until the receipt is finished. You do not skip any line.

A teacher calling the register does the same thing. They go through
every name on the list, one by one, from top to bottom.

### Try It

```python
history = ["10 + 3 = 13", "7 - 2 = 5", "4 * 6 = 24"]

for entry in history:
    print(entry)
```

### What Happened?

Python went through the list. For each item it put the item into `entry`
and ran the indented code.

You see:

```text
10 + 3 = 13
7 - 2 = 5
4 * 6 = 24
```

### Adding Numbers With A Loop

You can do more than just print. This loop adds up all the results:

```python
numbers = [5, 12, 3, 8, 20]
total = 0

for n in numbers:
    total = total + n

print("Total:", total)
```

You see:

```text
Total: 48
```

Kid meaning: go through every number, add it to total.

### Numbering The History

You can show which number each entry is:

```python
history = ["10 + 3 = 13", "7 - 2 = 5", "4 * 6 = 24"]
count = 1

for entry in history:
    print(count, ".", entry)
    count = count + 1
```

You see:

```text
1 . 10 + 3 = 13
2 . 7 - 2 = 5
3 . 4 * 6 = 24
```

### Calculator Connection

The app shows the history when the user picks option 5:

```python
if not history:
    print("No calculations yet.")
else:
    print("\n--- History ---")
    for entry in history:
        print(entry)
```

Kid meaning:

```text
If the list is empty, say so.
Otherwise, go through every saved calculation and show it.
```

---

## Lesson 13: Protecting Against Division By Zero

### Big Idea

Dividing by zero is impossible. The app must check for it before
dividing, otherwise it crashes.

### Kid Meaning

If someone asks "what is 5 divided by 0?", there is no answer.
Mathematics has no answer. A calculator that tries it will crash with
an error.

The app must check before it tries.

### Real-Life Example

Imagine splitting 5 cookies among 0 people. That question does not
make sense. There is nobody to give the cookies to.

Or think about slicing a pizza into 0 slices. The pizza cannot be cut
into zero pieces. The question is impossible.

The app needs to catch this mistake before it causes a crash and give
a friendly message instead.

### What The Crash Looks Like

Run this:

```python
print(10 / 0)
```

You see:

```text
ZeroDivisionError: division by zero
```

Python stopped running because the instruction was impossible. This is
called an error or an exception.

### The Fix

Check before you divide:

```python
second_number = 0

if second_number == 0:
    print("Cannot divide by zero!")
else:
    print(10 / second_number)
```

### What Happened?

The `if` statement caught the problem before Python ever tried to divide.
Instead of a crash, the user got a clear message.

### Testing Both Cases

Try `second_number = 0` and run. You see the warning.
Try `second_number = 4` and run. You see the answer `2.5`.

Only one branch ever runs. If the check catches zero, the divide line
never runs.

### Calculator Connection

The real app checks for zero inside the divide option:

```python
elif choice == "4":
    if second_number == 0:
        print("Error: Cannot divide by zero.")
        continue
    result = divide(first_number, second_number)
```

Kid meaning:

```text
If the second number is zero, warn the user and skip to the next turn.
Otherwise, divide safely.
```

The `continue` word skips the rest of that loop turn. It means the app
does not try to show an answer when there was no answer to give.

### Check Your Brain

What happens if you remove the zero check and the user divides by zero?

Answer: The app crashes with a `ZeroDivisionError`.

What does `continue` do in the app?

Answer: It skips the rest of that loop turn and goes back to the menu.

---

## Lesson 14: F-Strings Show Answers Neatly

### Big Idea

An f-string lets you mix fixed text and variable values in one neat line.

### Kid Meaning

An f-string is like filling in the blanks on a sentence.

```python
f"The answer is {result}"
```

The `f` at the start tells Python this is an f-string. The `{}` curly
braces mark where a real value should go. Python swaps in the actual
value of the variable automatically.

### Real-Life Example

A fill-in-the-blank worksheet says:

```text
_______ plus _______ equals _______.
```

An f-string fills in those blanks with real values automatically, every
time the code runs, using whatever is currently in the variables.

Think of a name badge template:

```text
Hello, my name is _______.
```

An f-string is how Python fills that blank for you.

### Try It

```python
first_number = 8
second_number = 5
result = first_number + second_number

print(f"{first_number} + {second_number} = {result}")
```

### What Happened?

Python replaced `{first_number}` with `8`, `{second_number}` with `5`,
and `{result}` with `13`.

You see:

```text
8 + 5 = 13
```

### More Examples

You can put any expression inside the curly braces:

```python
name = "Ava"
score = 42

print(f"Player {name} scored {score} points.")
print(f"Double the score is {score * 2}.")
print(f"The score has {len(str(score))} digits.")
```

You see:

```text
Player Ava scored 42 points.
Double the score is 84.
The score has 2 digits.
```

### The Old Way Without F-Strings

Before f-strings, code looked like this:

```python
print("Player " + name + " scored " + str(score) + " points.")
```

F-strings are much easier to read and write.

### Calculator Connection

The app uses f-strings to show the answer and save to history:

```python
answer = round(result, 2)
print(f"Answer: {answer}")
history.append(f"{first_number} {symbol} {second_number} = {answer}")
```

Kid meaning:

```text
Fill in the numbers, the symbol, and the answer inside the message.
Both the display line and the history entry use the same values.
```

If `first_number` is `10`, `symbol` is `+`, `second_number` is `5`,
and `answer` is `15.0`, the history entry saved is:

```text
10.0 + 5.0 = 15.0
```

---

## Lesson 15: The Menu Shows Choices

### Big Idea

A menu is a printed list of options the user can pick from.

### Kid Meaning

A menu is like a restaurant menu. You read the choices, pick a number,
and the app does that thing.

The menu appears at the start of every loop turn so the user always
knows what they can do.

### Real-Life Example

```text
1. Cheese pizza
2. Pasta
3. Salad
```

You say "I'll have number 2." The waiter knows what to bring without
you having to describe the whole dish.

An ATM machine works the same way:

```text
1. Withdraw cash
2. Check balance
3. Transfer money
4. Exit
```

You press a number. The machine does that job.

### Try It

```python
print("What do you want to do?")
print("1. Add")
print("2. Subtract")
print("3. Multiply")
print("4. Divide")
print("5. Show history")
print("6. Quit")

choice = input("Pick a number: ")
print("You picked:", choice)

if choice == "1":
    print("You chose Add!")
elif choice == "6":
    print("Goodbye!")
else:
    print("Option", choice, "is coming soon.")
```

### What Happened?

The menu printed. The app waited for a number. Then the `if` statement
responded to whatever you picked.

Try running it several times with different choices.

### Putting The Menu In A Function

In the real app, the menu is inside a function so it can be called
easily from inside the loop:

```python
def print_menu():
    print("\n--- Calculator Menu ---")
    print("1. Add")
    print("2. Subtract")
    print("3. Multiply")
    print("4. Divide")
    print("5. Show history")
    print("6. Quit")
    print("-----------------------")
```

Then inside the loop:

```python
while True:
    print_menu()
    choice = input("Your choice: ")
```

### Calculator Connection

The real app prints this menu inside the loop so it appears every round:

```python
print("\n--- Calculator Menu ---")
print("1. Add")
print("2. Subtract")
print("3. Multiply")
print("4. Divide")
print("5. Show history")
print("6. Quit")
```

Kid meaning:

```text
Show the choices every time the loop starts so the user always knows
what they can do.
```

### Helpful Detail

The `\n` at the start of the first print puts a blank line before the
menu. This makes the screen easier to read between calculations because
each new menu has a little breathing room above it.

Try removing `\n` from the first line and running several calculations
in a row. Notice how crowded the screen looks without it.

---

## Lesson 16: Stopping The Loop

### Big Idea

The app needs a way to stop the `while True` loop and exit cleanly.

### Kid Meaning

`break` means "stop the loop right now and leave it."

Without `break`, a `while True` loop runs forever. `break` is the exit
door.

### Real-Life Example

A vending machine has a cancel button. Pressing it stops the whole
process and returns the machine to the waiting screen.

`break` is the cancel button for a loop.

Think of a game of musical chairs. The music is the `while True` loop
— it keeps playing. Someone stopping the music is `break`. The moment
the music stops, everything freezes.

### Try It

```python
while True:
    choice = input("Type 'q' to quit or press Enter to continue: ")
    if choice == "q":
        print("Goodbye!")
        break
    print("Still going...")

print("The loop has ended.")
```

### What Happened?

The loop ran. Each time you pressed Enter without typing `q`, it
continued. The moment you typed `q`, `break` stopped the loop and the
code jumped to `print("The loop has ended.")`.

### What Happens Without break

Run this and press Ctrl+C to force-stop it:

```python
while True:
    print("Running...")
```

It never stops on its own. `while True` without `break` runs forever.

This is exactly why the calculator needs a quit option with `break`.

### Multiple Breaks

You can have `break` in more than one place:

```python
while True:
    choice = input("Enter a number or 'q' to quit: ")
    if choice == "q":
        print("User chose to quit.")
        break
    number = float(choice)
    if number < 0:
        print("Negative number found. Stopping.")
        break
    print("You entered:", number)
```

The first `break` handles a normal quit. The second handles an unusual
case. Whichever one runs first stops the loop.

### Calculator Connection

The real app checks if the user picked quit:

```python
elif choice == "6":
    print("Goodbye!")
    break
```

Kid meaning:

```text
If the user picks 6, say goodbye and stop the loop.
The app ends cleanly.
```

### Check Your Brain

What happens if you remove the `break` line from the quit option?

Answer: The loop never stops. Even when the user picks 6 and sees
"Goodbye!", the menu appears again immediately.

What is the difference between `break` and `continue`?

Answer: `break` stops the whole loop. `continue` skips just the current
turn and starts the next turn of the same loop.

---

## Lesson 17: Rounding Answers

### Big Idea

Division answers can produce very long decimals. Rounding trims them to
a clean, readable length.

### Kid Meaning

`round(number, 2)` means "keep only 2 decimal places and cut the rest."

### Real-Life Example

A calculator screen shows `3.33` instead of `3.3333333333333335` because
the display would be far too full otherwise.

When you pay for something and the price is `$4.666...`, the shop rounds
it to `$4.67`. That is rounding in real life.

### Why Division Produces Long Decimals

Some divisions are infinite in decimal form. `1 ÷ 3` in mathematics is
`0.333333...` going on forever. Computers store as many digits as they
can, which is a lot. That is why you see:

```text
0.3333333333333333
```

It is mathematically correct, but hard to read.

### Try It

```python
answer = 10 / 3
print("Unrounded:", answer)
print("2 places: ", round(answer, 2))
print("1 place:  ", round(answer, 1))
print("0 places: ", round(answer, 0))
```

### What Happened?

```text
Unrounded: 3.3333333333333335
2 places:  3.33
1 place:   3.3
0 places:  3.0
```

The second number in `round` tells Python how many decimal places to keep.

### More Examples

```python
print(round(7.5678, 3))   # 7.568
print(round(7.5678, 2))   # 7.57
print(round(7.5678, 1))   # 7.6
print(round(7.5678, 0))   # 8.0
print(round(2.5))         # 2  (no decimals at all)
```

Notice that Python rounds `7.5678` to `7.568` — it rounds up the last
kept digit when the next digit is 5 or more.

### When Addition And Subtraction Also Get Messy

Floats can be slightly imprecise in Python:

```python
print(0.1 + 0.2)
```

You might see:

```text
0.30000000000000004
```

This is a known quirk of how computers store decimal numbers. Rounding
fixes the display problem:

```python
print(round(0.1 + 0.2, 2))
```

You see:

```text
0.3
```

The calculator rounds all answers before showing them for exactly this
reason.

### Calculator Connection

The app rounds before showing the answer:

```python
answer = round(result, 2)
print(f"Answer: {answer}")
```

Kid meaning:

```text
Show a tidy answer with only 2 decimal places.
```

### Tiny Challenge

What does `round(7.5678, 1)` give?

Answer: `7.6`

What does `round(9.995, 2)` give?

Answer: `10.0` — the last kept digit rounds up and carries.

---

## Lesson 18: Putting It All Together

### Big Idea

The finished calculator uses all the ideas from the lessons working
together at the same time.

### Kid Meaning

Every lesson taught one building block. This lesson is the full picture
showing how they all connect.

None of the pieces work alone. `input` needs `float`. `float` feeds
variables. Variables go into functions. Functions return results.
Results go into f-strings. F-strings go into the history list.
The list lives inside the `while True` loop. The loop runs until
`break` stops it.

### What Happens When The App Runs

```text
1.  Python reads calculator.py from top to bottom.
2.  It defines the four operation functions.
3.  It defines print_menu.
4.  It runs main().
5.  main() prints the welcome message.
6.  main() creates an empty history list.
7.  main() starts the while True loop.
8.  The loop calls print_menu() to show the choices.
9.  The loop asks for a choice with input().
10. If choice is 1–4, it asks for two numbers.
11. It calls the right function (add, subtract, multiply, divide).
12. For divide, it checks for zero first.
13. It rounds the result.
14. It prints the answer with an f-string.
15. It appends the entry to history.
16. If choice is 5, it loops through history and prints each entry.
17. If choice is 6, it prints goodbye and breaks the loop.
18. If anything else, it tells the user to pick 1–6.
19. The loop starts again from step 8.
```

### Each Lesson In The Code

```text
Lesson 1  -> print()
Lesson 2  -> text vs numbers ("7" vs 7)
Lesson 3  -> variables (first_number, result, history)
Lesson 4  -> the calculator.py file itself
Lesson 5  -> input()
Lesson 6  -> float()
Lesson 7  -> + - * /
Lesson 8  -> while True loop and for loop
Lesson 9  -> if / elif / else
Lesson 10 -> def add, def subtract, def multiply, def divide, def print_menu
Lesson 11 -> history = [] and history.append(...)
Lesson 12 -> for entry in history: print(entry)
Lesson 13 -> if second_number == 0
Lesson 14 -> f"{first_number} {symbol} {second_number} = {answer}"
Lesson 15 -> the menu printed each loop turn
Lesson 16 -> break on quit, continue on zero-divide error
Lesson 17 -> round(result, 2)
```

### Calculator Connection

The full app loop looks like this:

```python
while True:
    print_menu()
    choice = input("Your choice: ").strip()

    if choice in ("1", "2", "3", "4"):
        first_number = float(input("First number: "))
        second_number = float(input("Second number: "))

        if choice == "1":
            result = add(first_number, second_number)
            symbol = "+"
        elif choice == "2":
            result = subtract(first_number, second_number)
            symbol = "-"
        elif choice == "3":
            result = multiply(first_number, second_number)
            symbol = "*"
        elif choice == "4":
            if second_number == 0:
                print("Error: Cannot divide by zero.")
                continue
            result = divide(first_number, second_number)
            symbol = "/"

        answer = round(result, 2)
        print(f"Answer: {answer}")
        history.append(f"{first_number} {symbol} {second_number} = {answer}")

    elif choice == "5":
        if not history:
            print("No calculations yet.")
        else:
            print("\n--- History ---")
            for entry in history:
                print(entry)

    elif choice == "6":
        print("Goodbye!")
        break

    else:
        print("Please pick a number from 1 to 6.")
```

Kid meaning:

```text
Every round: show the menu, get a choice, do the job, go again.
The loop stops only when the user picks 6.
```

### Following One Calculation

Imagine the user picks `1` (add), types `12`, then types `8`.

```text
choice = "1"
first_number = float("12") = 12.0
second_number = float("8") = 8.0
result = add(12.0, 8.0) = 20.0
symbol = "+"
answer = round(20.0, 2) = 20.0
print("Answer: 20.0")
history.append("12.0 + 8.0 = 20.0")
```

Then the loop starts again and shows the menu.

---

## Lesson 19: Run The Real Project

### Step 1: Open The Project Folder

Go into the folder:

Mac:

```bash
cd python_calculator
```

Windows:

```bash
cd python_calculator
```

### Step 2: Check Python Is Installed

```bash
python --version
```

or on Mac:

```bash
python3 --version
```

You need Python 3.6 or newer. Any version from 3.6 upward will work.

### Step 3: Run The App

Windows:

```bash
python calculator.py
```

Mac:

```bash
python3 calculator.py
```

### Step 4: Try Each Option

Work through the menu:

```text
Pick 1, type 10, type 5   -> you should see 15.0
Pick 2, type 10, type 5   -> you should see 5.0
Pick 3, type 10, type 5   -> you should see 50.0
Pick 4, type 10, type 5   -> you should see 2.0
Pick 4, type 10, type 0   -> you should see the zero error message
Pick 5                    -> you should see the four calculations
Pick 6                    -> you should see Goodbye!
```

### Controls

```text
1 -> add
2 -> subtract
3 -> multiply
4 -> divide
5 -> show history
6 -> quit
```

### Important Word

`continue` appears in the divide-by-zero check. It means "skip the rest
of this loop turn and start the next one."

If the user divides by zero:
1. The error message prints.
2. `continue` runs.
3. Python jumps straight back to the top of the loop.
4. The menu appears again.
5. The app never tries to show or save an answer because there was none.

Without `continue`, the app would try to print and save an answer that
was never calculated. That would cause a crash.

---

## Full Project Map

Here is the whole project in kid words.

```text
Start
  |
  v
Define add, subtract, multiply, divide, print_menu
  |
  v
Print welcome message
  |
  v
Create empty history list
  |
  v
Repeat forever
  |
  +--> Call print_menu() to show the 6 choices
  |
  +--> Ask for choice with input()
  |
  +--> If choice is 1, 2, 3, or 4:
  |       Ask for first_number with float(input())
  |       Ask for second_number with float(input())
  |       Call the right function (add/subtract/multiply/divide)
  |       If dividing and second_number is 0, warn and continue
  |       Round the result to 2 decimal places
  |       Print the answer with an f-string
  |       Append the entry to history
  |
  +--> If choice is 5:
  |       If history is empty, say so
  |       Otherwise loop through history and print each entry
  |
  +--> If choice is 6:
  |       Print Goodbye
  |       break — exit the loop
  |
  +--> Else:
          Print "please pick 1 to 6"
```

---

## Words You Now Know

### Python

A language for giving instructions to a computer.

### Variable

A labeled box that stores a value.

### Loop

Instructions that repeat.

### If Statement

A choice the computer makes after checking something.

### Function

A named mini machine that does one job.

### List

Many values stored in a row, in order.

### f-string

A sentence with curly-brace blanks that Python fills in with real values.

### input

A command that asks the user to type something and waits.

### float

A command that converts typed text into a decimal number.

### round

A command that trims a number to a set number of decimal places.

### break

A command that stops a loop completely.

### continue

A command that skips the rest of the current loop turn and starts the next.

### Menu

A printed list of numbered choices the user can pick from.

### History

A list that stores every calculation the app has done in this session.

### Parameter

A variable inside a function that holds the input value.

### Return

The value a function gives back after doing its job.

---

## Kid-Friendly Debugging Guide

Debugging means finding and fixing problems.

### Problem: Python Says "command not found"

Kid meaning:

```text
The computer does not know where Python is.
```

Try:

```bash
python --version
```

or:

```bash
python3 --version
```

If neither works, Python may not be installed. Go to python.org and
download the latest version for your operating system.

### Problem: ValueError

If you see:

```text
ValueError: could not convert string to float
```

Kid meaning:

```text
The app tried to turn a word into a number and failed.
```

Fix: make sure you type only digits when the app asks for a number.
Do not type letters or spaces.

Also check that your code has `float(input(...))` and not just
`input(...)` on its own.

### Problem: ZeroDivisionError

If you see:

```text
ZeroDivisionError: division by zero
```

Kid meaning:

```text
The app tried to divide by zero before checking.
```

Fix: make sure the divide-by-zero check from Lesson 13 is in the code,
and that it comes before the divide line, not after.

### Problem: The App Goes On Forever

If the loop never stops, check that your quit option uses `break`.

Also check that you are comparing strings, not numbers:

```python
if choice == "6":   # correct — input gives text
if choice == 6:     # wrong — 6 without quotes is a number
```

`input` always gives text. Comparing text `"6"` to number `6` will
never be equal in Python, so the quit branch never runs.

### Problem: History Is Empty

If history shows nothing when you pick option 5, check these:

- Make sure `history = []` is before the loop, not inside it.
  If it is inside the loop, it resets to empty every turn.
- Make sure you call `history.append(...)` after every calculation.
- Make sure you are using the same variable name throughout. `history`
  and `History` are two different variables in Python.

### Problem: The Answer Shows Too Many Decimals

Add `round(result, 2)` before the `print` line:

```python
answer = round(result, 2)
print(f"Answer: {answer}")
```

### Problem: IndentationError

If you see:

```text
IndentationError: unexpected indent
```

Kid meaning:

```text
A line has the wrong number of spaces at the front.
```

Fix: make sure every line inside a loop, if, or function is indented
by the same number of spaces. Use 4 spaces consistently. Do not mix
spaces and tabs.

---

## Mini Experiments

Change only one thing at a time. After each change, run the app and
test it.

### Show More Decimal Places

Find:

```python
round(result, 2)
```

Try:

```python
round(result, 4)
```

Now divide 10 by 3 and see more decimal places in the answer.

### Add A Running Total

Add a variable above the loop:

```python
total = 0
```

After each calculation, add to it and display it:

```python
total = total + result
print(f"Running total: {round(total, 2)}")
```

### Count How Many Calculations Were Done

Add a counter above the loop:

```python
count = 0
```

After each calculation:

```python
count = count + 1
print(f"Calculations so far: {count}")
```

### Clear The History

Add to `print_menu`:

```python
print("7. Clear history")
```

Add to the if chain:

```python
elif choice == "7":
    history = []
    print("History cleared.")
```

### Make The App Say The Operation Name

Instead of showing a symbol, show the full name:

```python
if choice == "1":
    result = add(first_number, second_number)
    operation_name = "plus"
```

Then use it in the f-string:

```python
print(f"{first_number} {operation_name} {second_number} = {answer}")
```

---

## Build Challenge Path

After the main app works, try these in order.

### Challenge 1: Add A Square Root Option

New idea:

```text
Press 7 to find the square root of one number.
```

The square root of 9 is 3 because 3 * 3 = 9.
The square root of 25 is 5 because 5 * 5 = 25.

Hint: Python has a `math` module.

```python
import math
result = math.sqrt(number)
```

Only ask for one number. There is no second number for square root.

### Challenge 2: Add A Power Operation

New idea:

```text
Press 8 to raise a number to a power.
For example: 2 to the power of 8 = 256.
```

Hint:

```python
result = first_number ** second_number
```

### Challenge 3: Save History To A File

New idea:

```text
When the user quits, write all history to a file called calc_history.txt.
Next time the app runs, load that file and add it to the history list.
```

Hint for saving:

```python
with open("calc_history.txt", "w") as file:
    for entry in history:
        file.write(entry + "\n")
```

Hint for loading at startup:

```python
try:
    with open("calc_history.txt", "r") as file:
        history = [line.strip() for line in file]
except FileNotFoundError:
    history = []
```

### Challenge 4: Add A Repeat Last Calculation Button

New idea:

```text
Press 9 to redo the last calculation with the same numbers and operation.
```

Hint: store the last operation, first_number, and second_number in
variables before the loop. Update them after each calculation. When
the user picks 9, use those stored values again.

### Challenge 5: Make The Menu Look Fancy

New idea:

```text
Use dashes and spaces to make the menu look like a real calculator panel.
```

Example style:

```text
+-----------------------+
|   PYTHON CALCULATOR   |
+-----------------------+
| 1. Add                |
| 2. Subtract           |
| 3. Multiply           |
| 4. Divide             |
| 5. History            |
| 6. Quit               |
+-----------------------+
```

All you need is carefully placed `print` statements with spaces and
dashes.

---

## Teacher Notes

Use these questions to check understanding.

### After Lesson 3

Ask:

```text
What is a variable?
```

Good answer:

```text
A labeled box that stores a value that can change.
```

Follow-up: if `result = 10` and then `result = result + 5`, what is
`result` now?

Good answer: `15`

### After Lesson 6

Ask:

```text
Why do we use float() on user input?
```

Good answer:

```text
Because input() gives text, and we need a real number to do math.
Without float, adding "3" and "4" gives "34" instead of 7.
```

### After Lesson 9

Ask:

```text
What does elif mean?
```

Good answer:

```text
Else if. Check this next condition only if the earlier checks were false.
```

Follow-up: how many `elif` lines can you have?

Good answer: as many as you need.

### After Lesson 13

Ask:

```text
Why must we check for zero before dividing?
```

Good answer:

```text
Dividing by zero is impossible in mathematics. Python crashes with a
ZeroDivisionError if you try it. The check catches the problem first.
```

### After Lesson 16

Ask:

```text
What does break do?
```

Good answer:

```text
It stops the loop immediately.
```

Follow-up: what is the difference between `break` and `continue`?

Good answer:

```text
break ends the loop completely.
continue skips just this turn and starts the next one.
```

### After Lesson 17

Ask:

```text
What does round(7.555, 2) give?
```

Good answer: `7.56`

---

## Final Encouragement

If you understand the simple version, you can understand the real code.

The real project may look long, but it is made from small pieces:

```text
print
input
variables
float
loops
if statements
functions
lists
f-strings
round
break
continue
```

That is programming: small pieces working together.

Keep building. Run the app. Break it a little. Fix it. Change it. Explain it.
That is how kids become real builders.
