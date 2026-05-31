"""
Jarvis Voice Assistant — JHS 3 reference build.

A friendly desktop assistant with a glowing UI that:
  • wakes up when you clap twice,
  • shows a beautiful glowing orb,
  • asks what you want,
  • listens to you,
  • and talks back.

This is the COMPLETE assembled program the lessons build toward. It is written
to still run and show the UI even if some optional libraries are missing, so you
can always see the "outlook":

  Required to see the UI:   customtkinter   (falls back to plain tkinter)
  For talking back:         pyttsx3         (falls back to on-screen text)
  For clap detection:       sounddevice + numpy (falls back to a "Wake" button)
  For hearing you:          SpeechRecognition + a mic (falls back to a text box)

Install everything for the full experience:
    pip install customtkinter pyttsx3 sounddevice numpy SpeechRecognition

Run:
    python jarvis.py
"""

import threading
import time
import queue
import platform
import shutil
import subprocess

OS_NAME = platform.system()   # 'Windows', 'Darwin' (Mac), or 'Linux'

# ── Optional libraries: import softly so the app always launches ──────────────
try:
    import customtkinter as ctk
    HAS_CTK = True
except Exception:
    import tkinter as ctk  # type: ignore
    HAS_CTK = False

try:
    import numpy as np
    import sounddevice as sd
    HAS_AUDIO = True
except Exception:
    HAS_AUDIO = False

try:
    import pyttsx3
    HAS_PYTTSX3 = True
except Exception:
    HAS_PYTTSX3 = False

# We can also speak using each OS's built-in tool, so TTS works even without
# pyttsx3: macOS has the `say` command; many Linux systems have `espeak`.
HAS_MAC_SAY = (OS_NAME == "Darwin" and shutil.which("say") is not None)
HAS_ESPEAK = (shutil.which("espeak") is not None or shutil.which("espeak-ng") is not None)
HAS_TTS = HAS_PYTTSX3 or HAS_MAC_SAY or HAS_ESPEAK

try:
    import speech_recognition as sr
    HAS_SR = True
except Exception:
    HAS_SR = False

# We capture the user's voice with sounddevice (no PyAudio needed) and hand the
# raw audio to SpeechRecognition. So "can we hear you" depends on BOTH the
# recognizer library AND a working audio input — not on PyAudio.
CAN_LISTEN = HAS_SR and HAS_AUDIO


# ── Brand colours (match the Credent / Emrys glow palette) ────────────────────
ORB_AWAKE = "#33EBFF"   # cyan
ORB_SLEEP = "#274a52"   # dim cyan
ACCENT = "#6C5CE7"      # indigo
BG = "#0b0f1a"          # dark stage


# ── Speaking (text-to-speech) ─────────────────────────────────────────────────
# On Windows, pyttsx3 uses SAPI5 (COM). A single long-lived worker thread can
# silently stall because COM wants per-call setup, which is why the queued
# version went quiet even though pyttsx3 works standalone. The reliable pattern
# is: speak each phrase in its own short-lived thread with a FRESH engine, and
# serialize them with a lock so they don't overlap.
_speak_lock = threading.Lock()

# Current voice gender: "male" or "female". Changed at runtime by voice command.
VOICE_GENDER = "male"


def _pick_voice(engine, gender):
    """Choose a SAPI voice id matching the requested gender, if available."""
    try:
        voices = engine.getProperty("voices")
    except Exception:
        return None
    want_female = (gender == "female")
    # Common Windows voices: 'David' (male), 'Zira'/'Hazel' (female).
    female_hints = ("zira", "hazel", "female", "eva", "susan")
    male_hints = ("david", "mark", "male", "george")
    for v in voices:
        name = (getattr(v, "name", "") or "").lower()
        gtag = ""
        try:
            gtag = " ".join(str(g).lower() for g in (getattr(v, "gender", "") or "",))
        except Exception:
            pass
        hints = female_hints if want_female else male_hints
        if any(h in name or h in gtag for h in hints):
            return v.id
    return None


def _speak_via_sapi(text, gender):
    """
    Speak using Windows SAPI directly via win32com. This is the most reliable
    way to honour a per-phrase voice change, because pyttsx3.init() returns a
    CACHED engine whose voice property doesn't always re-apply across threads —
    which is why "change to female" appeared to do nothing. Returns True if it
    spoke, False to let the caller fall back to pyttsx3.
    """
    try:
        import pythoncom
        from win32com.client import Dispatch
        pythoncom.CoInitialize()
        voice = Dispatch("SAPI.SpVoice")
        want_female = (gender == "female")
        female_hints = ("zira", "hazel", "eva", "susan", "female")
        male_hints = ("david", "mark", "george", "male")
        hints = female_hints if want_female else male_hints
        tokens = voice.GetVoices()
        for i in range(tokens.Count):
            desc = tokens.Item(i).GetDescription().lower()
            if any(h in desc for h in hints):
                voice.Voice = tokens.Item(i)
                break
        voice.Rate = 1   # slightly faster than default
        voice.Speak(text)
        return True
    except Exception as e:
        print("SAPI speak error:", e)
        return False


def _speak_via_mac(text, gender):
    """macOS: use the built-in `say` command. Voices: Daniel/Alex (male),
    Samantha/Victoria (female). No extra install needed."""
    try:
        voice = "Samantha" if gender == "female" else "Daniel"
        subprocess.run(["say", "-v", voice, text], check=False)
        return True
    except Exception as e:
        print("mac say error:", e)
        return False


def _speak_via_espeak(text, gender):
    """Linux: use espeak/espeak-ng. '+f3' is a female variant, '+m3' male."""
    try:
        exe = shutil.which("espeak-ng") or shutil.which("espeak")
        if not exe:
            return False
        variant = "en+f3" if gender == "female" else "en+m3"
        subprocess.run([exe, "-v", variant, "-s", "165", text], check=False)
        return True
    except Exception as e:
        print("espeak error:", e)
        return False


def _speak_blocking(text):
    if not HAS_TTS:
        return
    # Pick the speech engine by operating system.
    if OS_NAME == "Darwin" and HAS_MAC_SAY:
        if _speak_via_mac(text, VOICE_GENDER):
            return
    if OS_NAME == "Linux" and HAS_ESPEAK:
        if _speak_via_espeak(text, VOICE_GENDER):
            return
    # Windows: prefer direct SAPI (honours voice switching reliably).
    if OS_NAME == "Windows" and _speak_via_sapi(text, VOICE_GENDER):
        return
    # Cross-platform fallback: pyttsx3 if available.
    if not HAS_PYTTSX3:
        return
    try:
        try:
            import pythoncom
            pythoncom.CoInitialize()
        except Exception:
            pass
        engine = pyttsx3.init()
        engine.setProperty("rate", 170)
        vid = _pick_voice(engine, VOICE_GENDER)
        if vid:
            engine.setProperty("voice", vid)
        engine.say(text)
        engine.runAndWait()
        engine.stop()
    except Exception as e:
        print("TTS error:", e)


def set_voice_gender(gender):
    """Switch between 'male' and 'female' for future spoken phrases."""
    global VOICE_GENDER
    if gender in ("male", "female"):
        VOICE_GENDER = gender
        return True
    return False


def speak(text):
    """Speak a phrase out loud (no-op if TTS missing). Non-blocking."""
    if not HAS_TTS:
        return
    def run():
        with _speak_lock:           # one phrase at a time, in order
            _speak_blocking(text)
    threading.Thread(target=run, daemon=True).start()


# ── Clap detection (loudness spike, continuous stream) ────────────────────────
# The old version opened a fresh sd.rec() for each check, leaving dead gaps where
# claps were missed and making the two-clap timing unreliable. Instead we open
# ONE continuous input stream and feed every audio block to a small detector.
SAMPLE_RATE = 44100
CLAP_THRESHOLD = 0.25      # a clap peaks ~0.6–0.9; normal talk stays well below
BLOCK_S = 0.05             # 50 ms blocks → responsive, no gaps
CLAP_COOLDOWN_S = 0.25     # ignore the tail of the same clap
SECOND_CLAP_WINDOW_S = 1.5 # the 2nd clap must land within this after the 1st


def wait_for_two_claps(stop_event, on_clap=None):
    """
    Block until two distinct claps happen within SECOND_CLAP_WINDOW_S.
    Uses one continuous InputStream so no claps are dropped between reads.
    `on_clap(n)` (optional) is called with 1 or 2 for live UI feedback.
    """
    if not HAS_AUDIO:
        return False

    first_clap_time = [None]      # mutable holders for the callback
    got_two = threading.Event()
    last_clap_time = [0.0]

    def on_block(indata, frames, time_info, status):
        peak = float(np.abs(indata).max())
        now = time.time()
        if peak > CLAP_THRESHOLD and (now - last_clap_time[0]) > CLAP_COOLDOWN_S:
            last_clap_time[0] = now
            if first_clap_time[0] is None:
                first_clap_time[0] = now            # this is clap #1
                if on_clap:
                    on_clap(1)
            elif now - first_clap_time[0] <= SECOND_CLAP_WINDOW_S:
                got_two.set()                        # clap #2 in time → wake!
                if on_clap:
                    on_clap(2)
            else:
                first_clap_time[0] = now            # too late; treat as new #1
                if on_clap:
                    on_clap(1)

    try:
        with sd.InputStream(samplerate=SAMPLE_RATE, channels=1,
                            blocksize=int(BLOCK_S * SAMPLE_RATE),
                            callback=on_block):
            while not stop_event.is_set():
                if got_two.wait(timeout=0.1):
                    return True
                # If the first clap is stale (no 2nd came), reset so it doesn't
                # linger forever after a single accidental clap.
                if (first_clap_time[0] is not None
                        and time.time() - first_clap_time[0] > SECOND_CLAP_WINDOW_S):
                    first_clap_time[0] = None
    except Exception as e:
        print("Clap stream error:", e)
        return False
    return False


# ── Listening (speech to text) ────────────────────────────────────────────────
# Capture with sounddevice (works without PyAudio), then convert the raw PCM
# into a SpeechRecognition AudioData object for recognize_google().
def listen_for_speech(seconds=4):
    """Record a few seconds and return recognized text, or '' on failure."""
    if not CAN_LISTEN:
        return ""
    try:
        rec = sd.rec(int(seconds * SAMPLE_RATE), samplerate=SAMPLE_RATE,
                     channels=1, dtype="int16")
        sd.wait()
        audio = sr.AudioData(rec.tobytes(), SAMPLE_RATE, 2)  # 2 bytes = int16
        r = sr.Recognizer()
        return r.recognize_google(audio)
    except Exception:
        return ""


# ── Friendly conversation engine (remembers your name + the last question) ─────
import re
import random


def _extract_name(text):
    """Pull a likely name out of phrases like 'my name is Ama' or just 'Ama'."""
    t = text.strip()
    m = re.search(r"(?:my name is|i am|i'm|call me|it's|its|this is)\s+([A-Za-z][A-Za-z'-]+)", t, re.I)
    if m:
        return m.group(1).capitalize()
    # A single word answer to "what's your name?" is taken as the name.
    words = re.findall(r"[A-Za-z'-]+", t)
    if len(words) == 1 and words[0].lower() not in {"hello", "hi", "hey", "yes", "no", "yeah", "nope"}:
        return words[0].capitalize()
    return None


class Conversation:
    """A small, stateful, friendly chat. Greets, asks the user's name, then
    keeps a warm back-and-forth. Designed for JHS 3 learners to read and extend."""

    # Friendly names → URLs for the "open ..." command.
    SITES = {
        "youtube": ("https://www.youtube.com", "YouTube"),
        "google": ("https://www.google.com", "Google"),
        "gmail": ("https://mail.google.com", "Gmail"),
        "facebook": ("https://www.facebook.com", "Facebook"),
        "whatsapp": ("https://web.whatsapp.com", "WhatsApp"),
        "wikipedia": ("https://www.wikipedia.org", "Wikipedia"),
        "github": ("https://github.com", "GitHub"),
        "credent": ("https://www.google.com/search?q=Credent", "Credent"),
        "weather": ("https://www.google.com/search?q=weather", "the weather"),
        "news": ("https://news.google.com", "Google News"),
        "maps": ("https://maps.google.com", "Google Maps"),
    }

    def __init__(self):
        self.name = None
        self.awaiting = "name"     # what Jarvis is expecting: 'name' | None
        self.pending_action = None  # e.g. ("open_url", url) for the app to run

    def greeting(self):
        """First thing Jarvis says when it wakes up."""
        self.awaiting = "name"
        return "Hello! I am Jarvis, your assistant. What is your name?"

    def _website_from(self, low):
        """Find which known site the user asked to open; returns (url, label)."""
        for key, val in self.SITES.items():
            if key in low:
                return val
        # "open example.com" → open that domain directly.
        m = re.search(r"\b([a-z0-9-]+\.(?:com|org|net|io|gov|edu|co))\b", low)
        if m:
            return ("https://" + m.group(1), m.group(1))
        return None

    @staticmethod
    def _try_math(low):
        """Answer simple spoken math: 'what is 7 plus 5', '12 times 3', '8 / 2'."""
        words = (low.replace("plus", "+").replace("add", "+")
                    .replace("minus", "-").replace("subtract", "-")
                    .replace("times", "*").replace("multiplied by", "*").replace("multiply", "*")
                    .replace("divided by", "/").replace("divide", "/").replace("over", "/"))
        m = re.search(r"(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)", words)
        if not m:
            return None
        a, op, b = float(m.group(1)), m.group(2), float(m.group(3))
        try:
            r = {"+": a+b, "-": a-b, "*": a*b, "/": (a/b if b else None)}[op]
        except Exception:
            return None
        if r is None:
            return "undefined (you cannot divide by zero)"
        return int(r) if float(r).is_integer() else round(r, 3)

    def reply(self, text):
        t = (text or "").strip()
        low = t.lower()

        if not t:
            return "Sorry, I did not catch that. Could you say it again?"

        # ── Step 1: we are waiting to learn the user's name ──
        if self.awaiting == "name" and not self.name:
            name = _extract_name(t)
            if name:
                self.name = name
                self.awaiting = None
                return random.choice([
                    f"Nice to meet you, {name}! How are you feeling today?",
                    f"Lovely to meet you, {name}! How is your day going?",
                ])
            return "I would love to know your name. You can say, my name is ..."

        # ── Friendly small talk once we know the name ──
        who = self.name or "friend"

        def has_word(*words):
            return any(re.search(rf"\b{re.escape(w)}\b", low) for w in words)

        # Goodbye first so "good night"/"goodbye" don't trip the mood check.
        if has_word("bye", "goodbye", "good night", "see you", "stop", "exit"):
            return f"Goodbye, {who}! Clap twice whenever you need me again."

        # ── Change voice (male/female) ──
        if ("voice" in low or "tone" in low) and any(w in low for w in
                ["female", "woman", "girl", "lady", "male", "man", "boy", "change", "switch"]):
            if any(w in low for w in ["female", "woman", "girl", "lady"]):
                set_voice_gender("female")
                return f"Okay {who}, I have switched to my female voice. How do I sound?"
            if any(w in low for w in ["male", "man", "boy"]):
                set_voice_gender("male")
                return f"Okay {who}, I have switched to my male voice. How do I sound?"
            return "Would you like my male voice or my female voice?"

        # ── Open a website / app by voice ──
        if has_word("open", "launch", "go to", "browse") or "website" in low:
            site = self._website_from(low)
            if site:
                url, label = site
                self.pending_action = ("open_url", url)
                return f"Opening {label} for you, {who}."
            self.pending_action = None
            return f"Which website should I open, {who}? For example, say open YouTube."

        # ── Search the web ──
        m = re.search(r"(?:search|google|look up)\s+(?:for\s+)?(.+)", low)
        if m and m.group(1).strip():
            q = m.group(1).strip()
            self.pending_action = ("open_url", "https://www.google.com/search?q=" + q.replace(" ", "+"))
            return f"Searching the web for {q}, {who}."

        # ── More questions Jarvis can answer ──
        if "your name" in low or "who are you" in low:
            return "My name is Jarvis. I am your friendly assistant."
        if "who made you" in low or "who created you" in low or "who built you" in low:
            return "I was built with Python as a Credent learning project. You can build me too!"
        if "what can you do" in low or "help" in low or "what do you do" in low:
            return ("I can tell the time and date, tell jokes, do simple math, open websites, "
                    "search the web, change my voice, and chat with you. Just ask!")
        if "date" in low or "today" in low or "what day" in low:
            return f"Today is {time.strftime('%A, %B %d, %Y')}, {who}."
        # Simple math like "what is 7 plus 5" or "12 times 3".
        math_ans = self._try_math(low)
        if math_ans is not None:
            return f"That is {math_ans}, {who}."
        if "weather" in low:
            return ("I cannot check live weather yet, but I can open a weather site for you — "
                    "just say, open weather.")
        if "my name" in low or "remember me" in low:
            return (f"Of course — your name is {who}!" if self.name
                    else "I do not know your name yet. What is it?")
        if "how are you" in low or "and you" in low:
            return f"I am doing great, thank you for asking, {who}! What would you like to talk about?"
        if "time" in low:
            return f"It is {time.strftime('%I:%M %p')}, {who}."
        if "joke" in low:
            return random.choice([
                "Why did the computer go to the doctor? It had a virus!",
                "Why was the math book sad? It had too many problems!",
            ])
        if has_word("thanks", "thank"):
            return f"You are very welcome, {who}!"
        if has_word("sad", "tired", "bad", "stressed", "unhappy"):
            return f"I am sorry to hear that, {who}. I hope your day gets brighter. I am here with you."
        if has_word("good", "fine", "great", "happy", "okay", "ok", "well", "nice"):
            return f"That is wonderful to hear, {who}! What shall we do today?"
        if has_word("hello", "hi", "hey"):
            return f"Hello again, {who}!"

        # Friendly catch-all that keeps the conversation going.
        return random.choice([
            f"That is interesting, {who}! Tell me more.",
            f"I hear you, {who}. What else is on your mind?",
            f"Nice, {who}! Ask me the time, for a joke, or just chat with me.",
        ])


# ── The Jarvis app (UI + the conversation loop) ───────────────────────────────
class JarvisApp:
    def __init__(self):
        self.convo = Conversation()      # remembers the user's name + flow
        self._greeted = False            # have we asked the name yet this wake?
        if HAS_CTK:
            ctk.set_appearance_mode("dark")
            self.app = ctk.CTk()
        else:
            self.app = ctk.Tk()
            self.app.configure(bg=BG)

        self.app.title("J.A.R.V.I.S.")
        self.W, self.H = 760, 760
        self.app.geometry(f"{self.W}x{self.H}")
        self.app.configure(bg=BG)
        self.stop_event = threading.Event()

        # ── One full-window Canvas holds the whole HUD: background grid, corner
        #    brackets, side data readouts, AND the animated arc-reactor. ──
        import tkinter as tk
        self.canvas = tk.Canvas(self.app, width=self.W, height=self.H,
                                bg=BG, highlightthickness=0)
        self.canvas.place(x=0, y=0)
        self.CANVAS_SIZE = self.W          # reactor sizing reference
        self._hud_phase = 0.0              # drives rotation
        self._listening = False            # brighter + faster when awake
        self._speaking = False             # strongest flare while answering

        # Text widgets are overlaid ON TOP of the canvas with .place().
        if HAS_CTK:
            self.status = ctk.CTkLabel(self.app, text="Clap twice to wake me",
                                       font=("Consolas", 22), text_color="#8be9ff",
                                       fg_color=BG)
            self.transcript = ctk.CTkLabel(self.app, text="", font=("Consolas", 15),
                                           text_color="#cfd6da", fg_color=BG, wraplength=600)
        else:
            self.status = ctk.Label(self.app, text="Clap twice to wake me", fg="#8be9ff",
                                    bg=BG, font=("Consolas", 22))
            self.transcript = ctk.Label(self.app, text="", fg="#cfd6da", bg=BG,
                                        font=("Consolas", 15), wraplength=600)
        self.status.place(relx=0.5, y=self.H*0.70, anchor="center")
        self.transcript.place(relx=0.5, y=self.H*0.76, anchor="center")

        # Fallback "Wake" button when there's no microphone/audio for claps.
        if not HAS_AUDIO:
            self._add_wake_button()

        # Always offer a text box too (reliable input + fallback for voice).
        self.text_entry = None
        self._add_text_input()

        self._draw_reactor(intensity=0.45)
        self.app.protocol("WM_DELETE_WINDOW", self.on_close)

    # ---- UI helpers ----------------------------------------------------------
    def _add_wake_button(self):
        label = "◉ WAKE JARVIS"
        if HAS_CTK:
            btn = ctk.CTkButton(self.app, text=label, fg_color=ACCENT,
                                hover_color="#5346c4", command=self.manual_wake)
        else:
            btn = ctk.Button(self.app, text=label, command=self.manual_wake)
        btn.place(relx=0.5, y=self.H*0.83, anchor="center")

    def _add_text_input(self):
        if HAS_CTK:
            self.text_entry = ctk.CTkEntry(self.app, placeholder_text="Type a command, then Enter",
                                           width=460, height=42, font=("Consolas", 15),
                                           border_color="#33EBFF", fg_color="#0d1622")
        else:
            self.text_entry = ctk.Entry(self.app, width=46)
        self.text_entry.place(relx=0.5, y=self.H*0.90, anchor="center")
        self.text_entry.bind("<Return>", self._on_text_submit)

    def set_status(self, msg):
        self.status.configure(text=msg)

    def set_transcript(self, msg):
        self.transcript.configure(text=msg)

    def set_listening(self, on):
        self._listening = on

    def set_speaking(self, on):
        self._speaking = on

    # ---- Iron-Man HUD + arc reactor (animated) ------------------------------
    @staticmethod
    def _blend(hex_from, hex_to, t):
        a = tuple(int(hex_from[i:i+2], 16) for i in (1, 3, 5))
        b = tuple(int(hex_to[i:i+2], 16) for i in (1, 3, 5))
        return "#%02x%02x%02x" % tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

    def _draw_hud_background(self, glow, dim):
        """Fill the empty space: grid, corner brackets, title, side readouts."""
        import time as _t
        c = self.canvas
        W, H = self.W, self.H

        # Faint grid so the dark areas read as a HUD, not emptiness.
        step = 40
        grid = self._blend(BG, glow, 0.06)
        for x in range(0, W, step):
            c.create_line(x, 0, x, H, fill=grid)
        for y in range(0, H, step):
            c.create_line(0, y, W, y, fill=grid)

        # Corner brackets.
        m, ln = 22, 46
        for (cxp, cyp, dx, dy) in [(m, m, 1, 1), (W-m, m, -1, 1),
                                   (m, H-m, 1, -1), (W-m, H-m, -1, -1)]:
            c.create_line(cxp, cyp, cxp + dx*ln, cyp, fill=glow, width=2)
            c.create_line(cxp, cyp, cxp, cyp + dy*ln, fill=glow, width=2)

        # Top title bar.
        c.create_text(W/2, 30, text="J . A . R . V . I . S .",
                      fill=glow, font=("Consolas", 18, "bold"))
        c.create_line(W*0.18, 48, W*0.82, 48, fill=dim, width=1)

        # Left readout panel.
        clock = _t.strftime("%H:%M:%S")
        left = [
            "SYSTEM", "────────",
            f"TIME   {clock}",
            f"STATUS {'LISTEN' if self._listening else 'IDLE'}",
            "VOICE  ONLINE" if HAS_TTS else "VOICE  OFF",
            "AUDIO  ONLINE" if HAS_AUDIO else "AUDIO  OFF",
        ]
        for i, line in enumerate(left):
            c.create_text(34, 90 + i*22, text=line, anchor="w",
                          fill=dim if i else glow, font=("Consolas", 12))

        # Right readout panel (decorative signal bars).
        import math
        for i in range(6):
            bx = W - 130 + i*16
            h = 10 + (abs(int(40*math.sin((self._hud_phase/20)+i))) % 40)
            c.create_rectangle(bx, 150 - h, bx+8, 150, outline="", fill=self._blend(BG, glow, 0.5))
        c.create_text(W-34, 90, text="SIGNAL", anchor="e", fill=glow, font=("Consolas", 12))
        c.create_text(W-34, 112, text="────────", anchor="e", fill=dim, font=("Consolas", 12))

    def _draw_reactor(self, intensity=0.45):
        """Draw the HUD background + the animated arc-reactor core."""
        import math
        c = self.canvas
        c.delete("all")
        S = min(self.W, self.H)
        cx = self.W / 2
        cy = self.H * 0.40          # reactor sits in the upper-middle
        phase = self._hud_phase

        glow = self._blend("#0a2a33", "#33EBFF", intensity)
        core = self._blend("#0a2a33", "#bdf6ff", intensity)
        dim = self._blend(BG, "#33EBFF", 0.30)

        self._draw_hud_background(glow, dim)

        R = S * 0.30                # reactor overall radius

        # Outer soft glow halo.
        for i, r in enumerate(range(int(R*1.18), int(R*0.78), -6)):
            shade = self._blend(BG, glow, 0.10 + i*0.035)
            c.create_oval(cx-r, cy-r, cx+r, cy+r, outline=shade, width=2)

        # Rotating tick marks around the rim.
        ticks = 36
        r_in, r_out = R*0.86, R*1.02
        for k in range(ticks):
            ang = math.radians(k * (360/ticks) + phase)
            lit = (k % 3 == 0)
            col = glow if lit else self._blend(BG, glow, 0.35)
            c.create_line(cx + r_in*math.cos(ang), cy + r_in*math.sin(ang),
                          cx + r_out*math.cos(ang), cy + r_out*math.sin(ang),
                          fill=col, width=3 if lit else 1)

        # Counter-rotating inner arc segments.
        r_arc = R*0.66
        for seg in range(3):
            start = (phase*-2) + seg*120
            c.create_arc(cx-r_arc, cy-r_arc, cx+r_arc, cy+r_arc,
                         start=start, extent=70, style="arc", outline=glow, width=4)

        # Inner ring.
        r2 = R*0.46
        c.create_oval(cx-r2, cy-r2, cx+r2, cy+r2, outline=glow, width=3)

        # Bright pulsing core.
        pulse = 0.5 + 0.5*math.sin(math.radians(phase*4))
        r_core = R*0.22 * (0.85 + 0.25*pulse*intensity*2)
        c.create_oval(cx-r_core, cy-r_core, cx+r_core, cy+r_core,
                      fill=core, outline=glow, width=2)
        rh = r_core*0.5
        c.create_oval(cx-rh, cy-rh, cx+rh, cy+rh,
                      fill="#eaffff" if intensity > 0.6 else core, outline="")

    def _animate_hud(self):
        import math
        # Speaking = strongest flare with an extra shimmer; listening = bright;
        # idle = calm. The shimmer makes the glow visibly "talk".
        if self._speaking:
            base = 0.85 + 0.15 * (0.5 + 0.5 * math.sin(math.radians(self._hud_phase * 9)))
            spin = 9
        elif self._listening:
            base, spin = 0.92, 7
        else:
            base, spin = 0.40, 2.5
        self._hud_phase = (self._hud_phase + spin) % 360
        self._draw_reactor(intensity=base)
        self.app.after(40, self._animate_hud)   # ~25 fps

    # ---- Interaction paths ---------------------------------------------------
    def manual_wake(self):
        threading.Thread(target=self._one_conversation, daemon=True).start()

    def _on_text_submit(self, _event=None):
        said = self.text_entry.get().strip()
        self.text_entry.delete(0, "end")
        threading.Thread(target=lambda: self._respond(said), daemon=True).start()

    def _say(self, text):
        """Show + speak one Jarvis line, and wait for the speech to finish."""
        self.app.after(0, lambda: self.set_status(text))
        self.app.after(0, lambda: self.set_speaking(True))   # flare the reactor
        speak(text)
        # Rough wait so we don't record our own voice / talk over ourselves.
        time.sleep(min(5.0, 1.0 + len(text) / 14.0) if HAS_TTS else 0.3)
        self.app.after(0, lambda: self.set_speaking(False))  # stop flaring

    def _run_pending_action(self):
        """Execute any action the conversation queued (e.g. open a website)."""
        action = getattr(self.convo, "pending_action", None)
        if not action:
            return
        self.convo.pending_action = None
        kind, value = action
        if kind == "open_url":
            try:
                import webbrowser
                webbrowser.open(value)
            except Exception as e:
                print("open_url error:", e)

    def _respond(self, said):
        """Typed-input path: one friendly turn through the conversation."""
        if not said:
            return
        self._greeted = True   # typing counts as engaging; no forced greeting
        self.app.after(0, lambda: self.set_transcript(f"You: {said}"))
        reply = self.convo.reply(said)
        self._say(reply)
        self._run_pending_action()

    def _one_conversation(self):
        """Clap/voice path: greet (ask name if unknown), then chat back & forth."""
        self.app.after(0, lambda: self.set_listening(True))

        # First wake, or name not known yet → greet and ask the name.
        if not self.convo.name:
            self._say(self.convo.greeting())
        else:
            self._say(f"Yes {self.convo.name}, I am listening. What would you like?")

        if not CAN_LISTEN:
            self.app.after(0, lambda: self.set_status("Type your reply below, then Enter."))
            speak("You can type your reply below.")
            self.app.after(0, lambda: self.set_listening(False))
            return

        # Multi-turn friendly conversation until the user says goodbye or goes quiet.
        misses = 0
        while not self.stop_event.is_set():
            self.app.after(0, lambda: self.set_status("Listening… speak now"))
            said = listen_for_speech(seconds=4)
            if not said:
                misses += 1
                if misses >= 2:
                    self._say("Okay, I will rest now. Clap twice when you need me.")
                    break
                self._say("Sorry, I did not catch that. Please say it again.")
                continue
            misses = 0
            self.app.after(0, lambda s=said: self.set_transcript(f"You: {s}"))
            reply = self.convo.reply(said)
            self._say(reply)
            self._run_pending_action()
            if any(w in said.lower() for w in ["bye", "goodbye", "see you", "good night", "stop"]):
                break

        self.app.after(0, lambda: self.set_listening(False))
        self.app.after(0, lambda: self.set_status("Clap twice to wake me"))

    # ---- Background clap loop ------------------------------------------------
    def _on_clap_feedback(self, n):
        # Live confirmation so you can SEE claps registering.
        if n == 1:
            self.app.after(0, lambda: self.set_status("Clap detected (1/2)… clap again"))
        else:
            self.app.after(0, lambda: self.set_status("Two claps! Waking up…"))

    def _clap_loop(self):
        while not self.stop_event.is_set():
            if wait_for_two_claps(self.stop_event, on_clap=self._on_clap_feedback):
                self._one_conversation()

    def run(self):
        if HAS_AUDIO:
            threading.Thread(target=self._clap_loop, daemon=True).start()
        # Start the HUD glow animation.
        self._animate_hud()
        # Friendly first greeting so you immediately see + hear it working.
        self.app.after(600, lambda: self.set_status(
            "Clap twice to wake me" if HAS_AUDIO else "Press the Wake button to start"))
        speak("Jarvis is ready. Clap twice to wake me." if HAS_AUDIO else "Jarvis is ready.")
        self.app.mainloop()

    def on_close(self):
        self.stop_event.set()
        self.app.destroy()


def _print_capabilities():
    if OS_NAME == "Darwin" and HAS_MAC_SAY:
        tts = "macOS say"
    elif OS_NAME == "Linux" and HAS_ESPEAK:
        tts = "espeak"
    elif OS_NAME == "Windows" and HAS_PYTTSX3:
        tts = "Windows SAPI"
    elif HAS_PYTTSX3:
        tts = "pyttsx3"
    else:
        tts = "OFF (text only)"
    print(f"Jarvis starting on {OS_NAME} with:")
    print(f"  UI         : {'customtkinter (pretty)' if HAS_CTK else 'tkinter (basic fallback)'}")
    print(f"  Talk back  : {tts}")
    print(f"  Clap wake  : {'sounddevice (continuous)' if HAS_AUDIO else 'OFF (Wake button) — pip install sounddevice numpy'}")
    print(f"  Hear you   : {'sounddevice + SpeechRecognition' if CAN_LISTEN else 'OFF (type instead)'}")
    print()


if __name__ == "__main__":
    _print_capabilities()
    JarvisApp().run()
