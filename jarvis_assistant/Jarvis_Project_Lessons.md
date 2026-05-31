# Jarvis Voice Assistant Lessons: JHS 3 Edition

Build your own "Jarvis" — a friendly desktop assistant with an Iron-Man style
glowing arc-reactor screen that **wakes up when you clap twice**, **asks your
name**, **holds a friendly conversation**, **answers questions**, **opens
websites**, and can even **switch between a male and female voice**.

This project is for JHS 3. It uses Python on a normal school computer. Every
lesson matches the real `jarvis.py` code exactly, and **every line of code is
explained** so you truly understand what it does — not just copy it.

---

## How To Use These Lessons

Each lesson has the same shape:

- **Big Idea** — the one thing this lesson teaches.
- **Kid Meaning** — the idea in very simple words.
- **Jarvis Connection** — how this fits the real Jarvis.
- **The Code** — the actual code from `jarvis.py`.
- **Line by Line** — every important line explained.
- **Check Your Brain** — quick questions.

Teach one lesson at a time. Explain the idea first, then the code, then let
students type it and run it themselves.

The whole program is in `jarvis.py`. The lessons build it piece by piece.

**This course has two parts:**
- **Part 1 — Python Foundations (Lessons 0–8):** start from zero. Learn the basic
  building blocks of Python using tiny Jarvis-themed examples. No assistant yet —
  just the skills you need.
- **Part 2 — Building Jarvis (Lessons 9+):** use those skills to build the real
  `jarvis.py`, with every line explained.

A note for teachers: do not skip Part 1. Just like learning to write letters
before writing sentences, learners must understand print, variables, input,
decisions, loops, functions, and lists before the project will make sense.

Works on **Windows, Mac, and Linux**. Where something is different per computer,
the lesson says so.

---

# PART 1 — PYTHON FOUNDATIONS

---

## Lesson 0: Getting Ready

### Big Idea
Before building Jarvis we install Python and the helper libraries it needs.

### Kid Meaning
You cannot cook without a kitchen and ingredients. Setup is getting ready first.

### Jarvis Connection
Jarvis needs helpers to draw the screen, talk, listen, and detect claps.

### The Code
```bash
pip install customtkinter pyttsx3 sounddevice numpy SpeechRecognition
```

### Line by Line
- `pip install` — `pip` is Python's tool for downloading code other people wrote.
- `customtkinter` — draws the modern dark window.
- `pyttsx3` — lets the computer **talk** on Windows (text to speech).
- `sounddevice` + `numpy` — record the microphone and measure how loud it is.
- `SpeechRecognition` — turns your recorded voice into text.

### Different Computers (important)
- **Windows**: install everything above. Talking uses the built-in Windows voice.
- **Mac**: talking uses the built-in `say` command — you do NOT need `pyttsx3`.
- **Linux**: talking can use `espeak` (install with `sudo apt install espeak`).
Jarvis checks your computer and picks the right one automatically.

### How to start Python
- **Windows**: type `python` in Command Prompt.
- **Mac / Linux**: type `python3` in Terminal.

### Check Your Brain
Which helper makes Jarvis talk on Windows? **pyttsx3.** On a Mac? **the `say` command.**

---

## Lesson 1: Saying Things with print()

### Big Idea
`print()` shows a message on the screen. It is the first thing every coder learns.

### Kid Meaning
`print` is how the computer "speaks" in text — it shows whatever you put inside.

### Jarvis Connection
Before Jarvis can talk with a voice, it can talk with text. Every message starts here.

### The Code
```python
print("Hello, I am Jarvis.")
print("I am learning to help you.")
```

### Line by Line
- `print(...)` — show on the screen whatever is inside the brackets.
- `"Hello, I am Jarvis."` — the text to show. Text in quotes is called a **string**.
- Python runs the lines **in order**, top to bottom, one at a time.

### Try It
Type both lines and run them. You should see two messages appear.

### Check Your Brain
What does `print` do? **Shows text on the screen.** What is text in quotes called?
**A string.**

---

## Lesson 2: Variables — Boxes That Remember

### Big Idea
A variable is a named box that stores a value so you can use it later.

### Kid Meaning
It is like writing your name on a box and putting something inside to use later.

### Jarvis Connection
Jarvis stores your name in a variable so it can greet you by name all session.

### The Code
```python
name = "Ama"
print("Hello, " + name)
```

### Line by Line
- `name = "Ama"` — make a box called `name` and put the string `"Ama"` inside.
- `=` means "put the right side into the left side" (it is NOT equals in math).
- `"Hello, " + name` — join two strings together with `+`. This shows `Hello, Ama`.

### Try It
Change `"Ama"` to your own name and run it.

### Check Your Brain
What does `=` do in Python? **Puts a value into a variable (a box).**

---

## Lesson 3: Getting Input From the User

### Big Idea
`input()` lets the program ask a question and read what the user types.

### Kid Meaning
The computer asks, you answer, and it remembers your answer in a variable.

### Jarvis Connection
This is the simple text version of "Jarvis asks your name and you reply."

### The Code
```python
name = input("What is your name? ")
print("Nice to meet you, " + name)
```

### Line by Line
- `input("What is your name? ")` — show the question and wait for the user to type.
- Whatever they type is handed back and stored in the `name` box.
- Then we greet them using that stored name.

### Try It
Run it, type your name, and watch Jarvis greet you.

### Check Your Brain
What does `input()` give back? **Whatever the user typed (as a string).**

---

## Lesson 4: Making Decisions with if

### Big Idea
`if` lets the program choose what to do based on a condition.

### Kid Meaning
"IF this is true, do that." Like: if it is raining, take an umbrella.

### Jarvis Connection
Jarvis uses `if` to pick the right reply — if you say "hello", it greets you back.

### The Code
```python
word = input("Say something: ")
if "hello" in word:
    print("Hello to you too!")
else:
    print("I am still learning that.")
```

### Line by Line
- `if "hello" in word:` — is the text "hello" inside what the user said?
- The `:` and the **indented** line below belong to the `if`.
- `else:` — what to do when the `if` was not true.
- Indentation (the spaces) is how Python knows which lines go together.

### Try It
Run it. Type something with "hello", then something without it.

### Check Your Brain
What does `else` do? **Runs when the `if` condition is false.**

---

## Lesson 5: Functions — Reusable Machines

### Big Idea
A function is a named block of code you can run many times.

### Kid Meaning
It is like a recipe: write it once, use it whenever you want.

### Jarvis Connection
Jarvis wraps "speak this text" in a function so every answer can reuse it.

### The Code
```python
def greet(name):
    print("Hello, " + name + "!")

greet("Ama")
greet("Kojo")
```

### Line by Line
- `def greet(name):` — define a function called `greet` that takes one input, `name`.
- The indented lines are the function's body — what it does.
- `name` is a **parameter**: a box that gets filled when you call the function.
- `greet("Ama")` — run the function, putting `"Ama"` into `name`. Then again with `"Kojo"`.

### Try It
Call `greet` with three different names.

### Check Your Brain
Why use a function? **So we write code once and reuse it many times.**

---

## Lesson 6: Repeating with Loops

### Big Idea
A loop repeats a block of code without writing it many times.

### Kid Meaning
Instead of saying "listen, listen, listen", we say "keep listening".

### Jarvis Connection
Jarvis uses a loop to keep chatting — listen, reply, repeat — until you say bye.

### The Code
```python
while True:
    word = input("Say something (or 'bye'): ")
    if word == "bye":
        break
    print("You said: " + word)
```

### Line by Line
- `while True:` — repeat forever (until we tell it to stop).
- `if word == "bye":` — `==` checks if two things are equal (different from `=`).
- `break` — jump out of the loop and stop repeating.
- Without `break`, the loop would never end.

### Try It
Run it, type a few things, then type `bye` to stop.

### Check Your Brain
Difference between `=` and `==`? **`=` stores a value; `==` checks if equal.**

---

## Lesson 7: Lists and Dictionaries — Storing Many Things

### Big Idea
A list holds many items in order; a dictionary maps names to values.

### Kid Meaning
A list is like a shopping list. A dictionary is like a phone book: a name → a number.

### Jarvis Connection
Jarvis keeps websites in a dictionary: the name "youtube" maps to its web address.

### The Code
```python
friends = ["Ama", "Kojo", "Adwoa"]
print(friends[0])

sites = {"youtube": "https://youtube.com", "google": "https://google.com"}
print(sites["youtube"])
```

### Line by Line
- `["Ama", "Kojo", "Adwoa"]` — a **list**, written with square brackets.
- `friends[0]` — get the first item. Counting starts at 0, so 0 is the first.
- `{ "youtube": "..." }` — a **dictionary**, written with curly braces.
- `sites["youtube"]` — look up the value stored under the name "youtube".

### Try It
Add your own website to the `sites` dictionary and print it.

### Check Your Brain
In `sites["youtube"]`, what is "youtube"? **The key we look up.**

---

## Lesson 8: Strings and f-strings

### Big Idea
f-strings let you drop variables straight into text neatly.

### Kid Meaning
Instead of gluing pieces with `+`, you write the variable right inside the text.

### Jarvis Connection
Jarvis uses f-strings everywhere, like `f"Hello, {who}!"`, to greet you by name.

### The Code
```python
name = "Ama"
age = 13
print(f"Hello {name}, you are {age} years old.")
```

### Line by Line
- The `f` before the quote makes it an **f-string**.
- `{name}` and `{age}` — Python replaces these with the values in the boxes.
- This is cleaner and easier to read than joining with `+`.

### Try It
Make an f-string that says your name and your favourite colour.

### Check Your Brain
What does the `f` before the quotes do? **Lets you put variables inside `{ }`.**

---

# PART 2 — BUILDING JARVIS

Now you have the building blocks. From here, every lesson is the real `jarvis.py`
code, explained line by line.

---

## Lesson 9: Importing Tools Safely

### Big Idea
We "import" libraries, but wrap them so the program still runs if one is missing.

### Kid Meaning
We try to pick up each tool. If a tool is missing, we make a note and keep going
instead of crashing.

### Jarvis Connection
This is the very top of `jarvis.py`. It decides what Jarvis can do today.

### The Code
```python
import threading
import time

try:
    import customtkinter as ctk
    HAS_CTK = True
except Exception:
    import tkinter as ctk
    HAS_CTK = False
```

### Line by Line
- `import threading` — lets Jarvis do two things at once (listen AND show the screen).
- `import time` — lets us wait, and read the clock.
- `try:` — "attempt this, but be ready if it fails."
- `import customtkinter as ctk` — load the pretty UI library, nickname it `ctk`.
- `HAS_CTK = True` — remember that we have it.
- `except Exception:` — if the import failed (library not installed)...
- `import tkinter as ctk` — fall back to Python's built-in basic window, same nickname.
- `HAS_CTK = False` — remember we are using the basic version.

### Check Your Brain
What does `try/except` protect us from? **A crash when a library is missing.**

---

## Lesson 10: Remembering What Jarvis Can Do

### Big Idea
We store True/False flags for each ability so the rest of the code can check them.

### Kid Meaning
Jarvis keeps a checklist: "Can I talk? Can I hear? Can I detect claps?"

### Jarvis Connection
These flags decide whether Jarvis speaks aloud or just shows text.

### The Code
```python
try:
    import pyttsx3
    HAS_TTS = True
except Exception:
    HAS_TTS = False

CAN_LISTEN = HAS_SR and HAS_AUDIO
```

### Line by Line
- The `try/except` sets `HAS_TTS` to True only if the talking library loaded.
- `CAN_LISTEN = HAS_SR and HAS_AUDIO` — Jarvis can listen ONLY if it has BOTH the
  recognizer AND working audio. `and` means both must be True.

### Check Your Brain
If `HAS_AUDIO` is False, what is `CAN_LISTEN`? **False** — because `and` needs both.

---

## Lesson 11: Colours and Variables

### Big Idea
We store our colours in variables so we can reuse them everywhere.

### Kid Meaning
Instead of writing the colour code many times, we name it once.

### Jarvis Connection
These are Jarvis's brand colours — the cyan glow of the arc reactor.

### The Code
```python
ORB_AWAKE = "#33EBFF"   # cyan
ACCENT = "#6C5CE7"      # indigo
BG = "#0b0f1a"          # dark background
```

### Line by Line
- `ORB_AWAKE = "#33EBFF"` — a variable holding a colour. `#33EBFF` is cyan in hex.
- The `#` text after a line is a **comment** — a note for humans, ignored by Python.
- We reuse `BG` for every dark background so the whole app matches.

### Check Your Brain
Why use a variable for a colour instead of typing it each time?
**So we change it in one place and it updates everywhere.**

---

## Lesson 12: Making Jarvis Talk (Text to Speech)

### Big Idea
We use Windows SAPI to turn text into spoken sound, and we can pick the voice.

### Kid Meaning
We give Jarvis a mouth, and we can choose a male or female voice.

### Jarvis Connection
Every answer Jarvis speaks uses this. The voice can be switched by command.

### The Code
```python
VOICE_GENDER = "male"

def _speak_via_sapi(text, gender):
    import pythoncom
    from win32com.client import Dispatch
    pythoncom.CoInitialize()
    voice = Dispatch("SAPI.SpVoice")
    hints = ("zira", "female") if gender == "female" else ("david", "male")
    tokens = voice.GetVoices()
    for i in range(tokens.Count):
        if any(h in tokens.Item(i).GetDescription().lower() for h in hints):
            voice.Voice = tokens.Item(i)
            break
    voice.Speak(text)
```

### Line by Line
- `VOICE_GENDER = "male"` — remembers the current voice; starts as male.
- `def _speak_via_sapi(text, gender):` — defines a function (a reusable machine)
  that takes the words to say and which voice to use.
- `Dispatch("SAPI.SpVoice")` — asks Windows for its built-in speaking voice.
- `hints = ... if gender == "female" else ...` — choose words to search for:
  if female, look for "zira"; otherwise look for "david".
- `for i in range(tokens.Count):` — go through every voice installed on the computer.
- `if any(h in ...GetDescription().lower() ...)` — does this voice's name match our hint?
- `voice.Voice = tokens.Item(i)` — select that voice. `break` — stop searching, we found it.
- `voice.Speak(text)` — finally, say the words out loud.

> Why SAPI directly? An earlier version used a library that **cached** one voice,
> so switching to female did nothing. Talking to Windows directly fixes that —
> a real bug we found and fixed. This is what real debugging looks like!

### Check Your Brain
What does `break` do in the loop? **Stops the loop once the voice is found.**

---

## Lesson 13: Switching the Voice

### Big Idea
A tiny function changes a global setting so future speech uses the new voice.

### Kid Meaning
Flip a switch: from now on, talk like a woman (or a man).

### Jarvis Connection
This is what runs when you say "change your voice to female".

### The Code
```python
def set_voice_gender(gender):
    global VOICE_GENDER
    if gender in ("male", "female"):
        VOICE_GENDER = gender
        return True
    return False
```

### Line by Line
- `global VOICE_GENDER` — tells Python we want to CHANGE the shared setting, not
  make a new local one.
- `if gender in ("male", "female"):` — only allow these two values (safety).
- `VOICE_GENDER = gender` — actually change the setting.
- `return True` — report success. `return False` — report it was an invalid value.

### Check Your Brain
Why do we need the word `global`? **So we change the shared setting, not a copy.**

---

## Lesson 14: Hearing the Microphone (Loudness)

### Big Idea
The microphone turns room sound into numbers; a clap makes a big number.

### Kid Meaning
Quiet = small numbers. A clap = a sudden big number.

### Jarvis Connection
Measuring loudness is how Jarvis notices a clap.

### The Code
```python
import sounddevice as sd
import numpy as np

block = sd.rec(int(0.2 * 44100), samplerate=44100, channels=1)
sd.wait()
peak = float(np.abs(block).max())
```

### Line by Line
- `sd.rec(...)` — record a short piece of audio (0.2 seconds).
- `44100` — how many samples per second (CD quality).
- `sd.wait()` — wait until the recording finishes.
- `np.abs(block)` — make every number positive (loudness has no negative).
- `.max()` — take the single loudest sample in that piece.
- `peak` now holds how loud the loudest moment was.

### Check Your Brain
Why use `.max()` and not the average for a clap? **A clap is a short spike; the
peak catches it, the average would hide it.**

---

## Lesson 15: Detecting Two Claps (Continuous Listening)

### Big Idea
We keep the microphone open all the time and react the instant a clap arrives.

### Kid Meaning
Instead of taking quick photos with gaps, we record a smooth video so we never
miss a clap.

### Jarvis Connection
This is the real wake-up trigger: two claps within about 1.5 seconds.

### The Code
```python
CLAP_THRESHOLD = 0.25

def on_block(indata, frames, time_info, status):
    peak = float(np.abs(indata).max())
    now = time.time()
    if peak > CLAP_THRESHOLD and (now - last_clap_time[0]) > 0.25:
        last_clap_time[0] = now
        if first_clap_time[0] is None:
            first_clap_time[0] = now            # clap #1
        elif now - first_clap_time[0] <= 1.5:
            got_two.set()                        # clap #2 in time → WAKE
```

### Line by Line
- `CLAP_THRESHOLD = 0.25` — how loud counts as a clap. Higher = stricter.
- `on_block(...)` — this runs automatically for every little piece of live audio.
- `if peak > CLAP_THRESHOLD ...` — was this piece loud enough to be a clap?
- `(now - last_clap_time[0]) > 0.25` — a cooldown so one clap is not counted twice.
- `if first_clap_time[0] is None:` — if we have no first clap yet, this is clap #1.
- `elif now - first_clap_time[0] <= 1.5:` — if a second clap comes within 1.5s...
- `got_two.set()` — signal "two claps happened — wake up!"

> An earlier version recorded with gaps and **missed claps**. Switching to one
> continuous stream fixed it. Another real bug we solved.

### Check Your Brain
Why a cooldown after a clap? **So the same clap is not counted as two.**

---

## Lesson 16: Listening to Your Words (Speech to Text)

### Big Idea
We record a few seconds, then turn that audio into text.

### Kid Meaning
Jarvis writes down what you said so it can understand it.

### Jarvis Connection
After Jarvis asks a question, this captures your spoken answer.

### The Code
```python
import speech_recognition as sr

def listen_for_speech(seconds=4):
    rec = sd.rec(int(seconds * SAMPLE_RATE), samplerate=SAMPLE_RATE,
                 channels=1, dtype="int16")
    sd.wait()
    audio = sr.AudioData(rec.tobytes(), SAMPLE_RATE, 2)
    return sr.Recognizer().recognize_google(audio)
```

### Line by Line
- `def listen_for_speech(seconds=4):` — record for 4 seconds by default.
- `sd.rec(...)` — record your voice.
- `dtype="int16"` — the number format the recognizer expects.
- `sr.AudioData(rec.tobytes(), ...)` — wrap the recording so SpeechRecognition can read it.
- `recognize_google(audio)` — send it to Google's free service and get back text.

> This needs **internet**. If offline, the program lets you type instead — that
> is why Jarvis always shows a text box too.

### Check Your Brain
What does `recognize_google` return? **The text of what you said.**

---

## Lesson 17: The Conversation Brain — Remembering Your Name

### Big Idea
A class stores memory (your name) and decides what to say back.

### Kid Meaning
This is Jarvis's brain. It remembers who you are and chooses friendly replies.

### Jarvis Connection
This is why Jarvis can ask your name and use it for the whole chat.

### The Code
```python
class Conversation:
    def __init__(self):
        self.name = None
        self.awaiting = "name"

    def greeting(self):
        return "Hello! I am Jarvis, your assistant. What is your name?"
```

### Line by Line
- `class Conversation:` — a blueprint that bundles memory + behaviour together.
- `def __init__(self):` — runs once when we create the brain; sets up its memory.
- `self.name = None` — we do not know the name yet (`None` means "empty").
- `self.awaiting = "name"` — Jarvis is currently expecting you to say your name.
- `greeting()` — returns the first thing Jarvis says when it wakes.

### Check Your Brain
What does `self.name = None` mean? **Jarvis does not know your name yet.**

---

## Lesson 18: Pulling the Name Out of a Sentence

### Big Idea
We search the user's words for their name using a pattern (regex).

### Kid Meaning
If you say "my name is Ama", Jarvis grabs the word "Ama".

### Jarvis Connection
This is how Jarvis learns your name from a full sentence.

### The Code
```python
import re

def _extract_name(text):
    m = re.search(r"(?:my name is|i am|i'm|call me)\s+([A-Za-z'-]+)", text, re.I)
    if m:
        return m.group(1).capitalize()
    return None
```

### Line by Line
- `import re` — Python's pattern-matching tool ("regular expressions").
- `re.search(pattern, text, re.I)` — look for the pattern; `re.I` ignores capital letters.
- `(?:my name is|i am|...)` — match any of these phrases.
- `\s+` — one or more spaces.
- `([A-Za-z'-]+)` — capture the actual name (letters, apostrophes, hyphens).
- `m.group(1)` — the captured name. `.capitalize()` — make the first letter big.
- `return None` — if no name was found.

### Check Your Brain
What does `re.I` do? **Makes the search ignore upper/lower case.**

---

## Lesson 19: Choosing a Friendly Reply

### Big Idea
We check the user's words and return the matching answer, in order.

### Kid Meaning
Jarvis listens for keywords and gives the right friendly response.

### Jarvis Connection
This is the heart of the conversation — greetings, mood, jokes, and more.

### The Code
```python
def reply(self, text):
    low = text.lower()
    who = self.name or "friend"

    def has_word(*words):
        return any(re.search(rf"\b{w}\b", low) for w in words)

    if has_word("bye", "goodbye"):
        return f"Goodbye, {who}! Clap twice whenever you need me again."
    if "how are you" in low:
        return f"I am doing great, thank you, {who}!"
```

### Line by Line
- `low = text.lower()` — make everything lowercase so matching is easier.
- `who = self.name or "friend"` — use the name if we know it, else say "friend".
- `def has_word(*words):` — a small helper: is any of these whole words present?
- `\b{w}\b` — `\b` means "word boundary" so "good" does not match inside "goodbye".
- `if has_word("bye", "goodbye"):` — checks for a goodbye first.
- `f"Goodbye, {who}!"` — an **f-string**: it drops the value of `who` into the text.

> Order matters: we check "goodbye" BEFORE the word "good", or "goodbye" would
> wrongly trigger the happy-mood reply. Another real bug we fixed.

### Check Your Brain
Why check whole words with `\b`? **So "good" does not match inside "goodbye".**

---

## Lesson 20: Answering More Questions (Time, Date, Math)

### Big Idea
Jarvis can answer facts: the time, the date, and simple math.

### Kid Meaning
Ask "what is the time" or "what is 7 plus 5" and Jarvis answers.

### Jarvis Connection
These make Jarvis genuinely useful, not just chatty.

### The Code
```python
if "time" in low:
    return f"It is {time.strftime('%I:%M %p')}, {who}."

@staticmethod
def _try_math(low):
    words = low.replace("plus", "+").replace("times", "*")
    m = re.search(r"(-?\d+)\s*([+\-*/])\s*(-?\d+)", words)
    if not m:
        return None
    a, op, b = float(m.group(1)), m.group(2), float(m.group(3))
    return a + b if op == "+" else a * b
```

### Line by Line
- `time.strftime('%I:%M %p')` — formats the clock as e.g. "04:16 PM".
- `_try_math` — turns spoken words like "plus" into symbols like "+".
- The regex finds `number  symbol  number`.
- `float(...)` — turn the matched text into real numbers we can calculate with.
- Then it returns the answer of the operation.

### Check Your Brain
What does `time.strftime` give us? **The current time as readable text.**

---

## Lesson 21: Opening Websites and Searching

### Big Idea
Jarvis can open a website or search the web in your browser.

### Kid Meaning
Say "open YouTube" and YouTube opens. Say "search for cats" and it searches.

### Jarvis Connection
This turns Jarvis from a talker into a real assistant that DOES things.

### The Code
```python
SITES = {
    "youtube": ("https://www.youtube.com", "YouTube"),
    "google": ("https://www.google.com", "Google"),
}

if has_word("open", "launch"):
    site = self._website_from(low)
    if site:
        url, label = site
        self.pending_action = ("open_url", url)
        return f"Opening {label} for you, {who}."
```
And later, the app runs the action:
```python
import webbrowser
webbrowser.open(url)
```

### Line by Line
- `SITES = { ... }` — a **dictionary**: each friendly name maps to (web address, label).
- `self._website_from(low)` — find which known site the user named.
- `url, label = site` — unpack the pair into two variables.
- `self.pending_action = ("open_url", url)` — remember an action for the app to run.
- `webbrowser.open(url)` — actually open the page in the default browser.

### Check Your Brain
What kind of Python object is `SITES`? **A dictionary (name → value pairs).**

---

## Lesson 22: The Glowing Arc Reactor (Drawing)

### Big Idea
We draw Jarvis's face as circles and lines on a Canvas, and animate them.

### Kid Meaning
We paint a glowing Iron-Man reactor and make it spin and pulse.

### Jarvis Connection
This is the beautiful UI — it brightens when listening and flares when speaking.

### The Code
```python
def _draw_reactor(self, intensity=0.45):
    c = self.canvas
    c.delete("all")
    cx, cy = self.W / 2, self.H * 0.40
    r2 = R * 0.46
    c.create_oval(cx - r2, cy - r2, cx + r2, cy + r2, outline=glow, width=3)
    c.create_oval(cx - r_core, cy - r_core, cx + r_core, cy + r_core,
                  fill=core, outline=glow, width=2)
```

### Line by Line
- `c.delete("all")` — clear the old frame before drawing the new one.
- `cx, cy` — the centre point of the reactor on the screen.
- `create_oval(x1, y1, x2, y2, ...)` — draw a circle inside that box.
- `outline=glow` — the ring colour. `width=3` — how thick the ring is.
- `fill=core` — the bright filled centre of the reactor.
- `intensity` — how bright to glow; higher when listening or speaking.

### Check Your Brain
Why call `delete("all")` each frame? **To clear the old drawing before the new one,
so the animation does not smear.**

---

## Lesson 23: Animation — Glow When Listening and Speaking

### Big Idea
A function redraws the reactor many times a second, brighter when active.

### Kid Meaning
Like a flip-book: redraw fast, change a little each time, and it looks alive.

### Jarvis Connection
This makes the reactor pulse calmly when idle, brighten when listening, and
**flare with a shimmer when Jarvis is answering**.

### The Code
```python
def _animate_hud(self):
    if self._speaking:
        base = 0.85 + 0.15 * (0.5 + 0.5 * math.sin(math.radians(self._hud_phase * 9)))
        spin = 9
    elif self._listening:
        base, spin = 0.92, 7
    else:
        base, spin = 0.40, 2.5
    self._hud_phase = (self._hud_phase + spin) % 360
    self._draw_reactor(intensity=base)
    self.app.after(40, self._animate_hud)
```

### Line by Line
- `if self._speaking:` — strongest glow with a shimmer while Jarvis talks.
- `math.sin(...)` — a wave that goes up and down, giving the gentle pulsing.
- `spin` — how fast the rings rotate (faster when active).
- `self._hud_phase = (... ) % 360` — advance the rotation, wrapping at 360 degrees.
- `self.app.after(40, self._animate_hud)` — run again in 40 ms → about 25 frames/sec.

### Check Your Brain
What makes the glow "breathe" up and down? **The sine wave (`math.sin`).**

---

## Lesson 24: Doing Two Things at Once (Threads)

### Big Idea
Threads let Jarvis listen for claps while the screen keeps animating smoothly.

### Kid Meaning
Jarvis can walk and chew gum: one part listens, another part draws.

### Jarvis Connection
Without this, the window would freeze while waiting for claps.

### The Code
```python
import threading

threading.Thread(target=self._clap_loop, daemon=True).start()

def speak(text):
    def run():
        with _speak_lock:
            _speak_blocking(text)
    threading.Thread(target=run, daemon=True).start()
```

### Line by Line
- `threading.Thread(target=..., daemon=True)` — create a helper worker.
- `target=self._clap_loop` — the job that worker will do (listen for claps).
- `daemon=True` — the worker stops automatically when the app closes.
- `.start()` — begin the worker right away.
- `with _speak_lock:` — make sure only ONE phrase is spoken at a time, in order.

### Check Your Brain
Why do we need threads here? **So listening does not freeze the screen.**

---

## Lesson 25: Putting It All Together — The Conversation Loop

### Big Idea
When Jarvis wakes, it greets, asks the name, then chats turn by turn.

### Kid Meaning
This is the full routine that ties every part into one friendly Jarvis.

### Jarvis Connection
This is what happens after you clap twice.

### The Code
```python
def _one_conversation(self):
    self.set_listening(True)
    if not self.convo.name:
        self._say(self.convo.greeting())
    while not self.stop_event.is_set():
        said = listen_for_speech(seconds=4)
        if not said:
            break
        reply = self.convo.reply(said)
        self._say(reply)
        self._run_pending_action()
        if "bye" in said.lower():
            break
    self.set_listening(False)
```

### Line by Line
- `self.set_listening(True)` — brighten the reactor; we are awake.
- `if not self.convo.name:` — if we do not know the name, greet and ask it.
- `while not self.stop_event.is_set():` — keep chatting until we should stop.
- `listen_for_speech(4)` — capture what you say.
- `if not said: break` — if nothing was understood, stop this chat.
- `reply = self.convo.reply(said)` — let the brain decide the answer.
- `self._say(reply)` — show it, speak it, and flare the reactor.
- `self._run_pending_action()` — if the reply asked to open a website, do it now.
- `if "bye" in said.lower(): break` — end politely when you say bye.

### Check Your Brain
Explain the loop in one sentence.
**Listen, decide, speak, maybe open a site — and repeat until I say bye.**

---

## Lesson 26: Showcase and Reflection

### Big Idea
Present Jarvis and explain, in your own words, how each part works.

### Kid Meaning
Show your friends your clapping, talking, glowing assistant — and explain it.

### Jarvis Connection
This completes the project: a working Jarvis you fully understand.

### Try It — explain each part to the class:
```text
- Clap wake     → a loud spike heard on a continuous stream.
- Hears you     → record audio, send to recognizer, get text.
- Brain         → the Conversation class remembers your name and chooses replies.
- Talks back    → Windows SAPI speaks; the voice can be male or female.
- Glowing face  → a Canvas arc reactor that pulses, brightens, and flares.
- Two-at-once   → threads let it listen and animate at the same time.
```

### Check Your Brain
Explain Jarvis in one sentence.
**Jarvis wakes on two claps, asks my name, chats, answers questions, opens
websites, talks back in a voice I choose, and glows while it does it.**
