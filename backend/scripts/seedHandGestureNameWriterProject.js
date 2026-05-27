/*
 * Seed: Hand Gesture Name Writer
 *
 * Real per-session lesson content (no roadmap). Each session ends with a
 * runnable mini-program the kid types in class, plus a "Try this" tryout.
 *
 * Run with:   node backend/scripts/seedHandGestureNameWriterProject.js
 */

const pool = require('../src/config/db');
const {
  createLearningTables,
  createLearningProject,
  replaceLearningContentChunks,
} = require('../src/models/learningModel');

const PROJECT_TITLE = 'Hand Gesture Name Writer';
const FALLBACK_CLASS_NAME = 'Class 4';
const SECTION_COUNT = 5;

const chunks = [
  // ── Project-wide setup chunk ──────────────────────────────────────────────
  {
    title: 'Before we start: what you need on the laptop',
    source_type: 'setup',
    audience: 'both',
    tags: ['setup', 'python', 'install'],
    content: [
      'For this project you need Python 3.11 or 3.12 — do not use Python 3.14, MediaPipe will not install on it.',
      'In the Terminal, go to the project folder and create a virtual environment, then install the three libraries we need:',
      '',
      '    cd hand_gesture_name_writer',
      '    python3.11 -m venv .venv',
      '    source .venv/bin/activate    # Windows: .venv\\Scripts\\activate',
      '    pip install opencv-python mediapipe numpy',
      '',
      'Make a file called name_writer.py inside that folder. Every session below adds to that same file.',
      'When you run the program you type:  python name_writer.py.  Press Q in the program window to close it.',
    ].join('\n'),
  },

  // ── Session 1 ─────────────────────────────────────────────────────────────
  {
    step_number: 1,
    title: 'Section 1: Today we open the camera and see ourselves on screen',
    source_type: 'lesson',
    audience: 'both',
    tags: ['session-1', 'opencv', 'camera'],
    content: [
      'TODAY: We get the webcam working. By the end of class you will see live video of yourself in a window, mirrored like a selfie. That is it. Small win, but everything else builds on it.',
      '',
      'WHY THIS MATTERS: Every hand-gesture program starts the same way — grab a frame from the camera, do something with it, show it back. We just need the loop running first.',
      '',
      'TYPE THIS into name_writer.py:',
      '',
      '    import cv2',
      '    camera = cv2.VideoCapture(0)',
      '    while True:',
      '        ok, frame = camera.read()',
      '        if not ok:',
      '            break',
      '        frame = cv2.flip(frame, 1)   # mirror like a selfie',
      '        cv2.imshow("Name Writer", frame)',
      '        if cv2.waitKey(1) & 0xFF == ord("q"):',
      '            break',
      '    camera.release()',
      '    cv2.destroyAllWindows()',
      '',
      'RUN IT:  python name_writer.py.  You should see yourself. Press Q to quit.',
      '',
      'WHAT EACH LINE DOES: VideoCapture(0) means "open the first webcam". camera.read() grabs one picture (a frame). cv2.flip(frame, 1) flips it left-to-right so it feels like a mirror. cv2.imshow opens a window and paints the picture in it. waitKey(1) waits 1 millisecond for a key press — that is what makes the video update smoothly.',
      '',
      'TRY THIS BEFORE NEXT CLASS: Change the window title from "Name Writer" to your own name. Then try removing the cv2.flip line and see how strange it feels — that is why every selfie camera flips the picture.',
    ].join('\n'),
  },

  // ── Session 2 ─────────────────────────────────────────────────────────────
  {
    step_number: 2,
    title: 'Section 2: Today we put a dot on your fingertip',
    source_type: 'lesson',
    audience: 'both',
    tags: ['session-2', 'mediapipe', 'landmarks'],
    content: [
      'TODAY: We add MediaPipe. It is a free program from Google that finds 21 points on your hand. We will draw a circle on point number 8 — your index fingertip. When you move your finger, the dot follows.',
      '',
      'WHY THIS MATTERS: Once we can find the fingertip, everything else (drawing, erasing, gestures) is just "do something at that point".',
      '',
      'REPLACE your name_writer.py with this version:',
      '',
      '    import cv2',
      '    import mediapipe as mp',
      '    mp_hands = mp.solutions.hands',
      '    camera = cv2.VideoCapture(0)',
      '    with mp_hands.Hands(max_num_hands=1) as hands:',
      '        while True:',
      '            ok, frame = camera.read()',
      '            if not ok: break',
      '            frame = cv2.flip(frame, 1)',
      '            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)',
      '            result = hands.process(rgb)',
      '            if result.multi_hand_landmarks:',
      '                h, w = frame.shape[:2]',
      '                lm = result.multi_hand_landmarks[0].landmark[8]',
      '                x, y = int(lm.x * w), int(lm.y * h)',
      '                cv2.circle(frame, (x, y), 16, (255, 255, 0), -1)',
      '            cv2.imshow("Name Writer", frame)',
      '            if cv2.waitKey(1) & 0xFF == ord("q"): break',
      '    camera.release()',
      '    cv2.destroyAllWindows()',
      '',
      'RUN IT. Hold your hand up. A yellow dot should stick to the tip of your index finger.',
      '',
      'WHAT EACH NEW LINE DOES: mp.solutions.hands loads the trained model. We convert the picture to RGB because MediaPipe expects RGB, not the BGR that OpenCV uses by default. landmark[8] is the index fingertip (each landmark has x and y as fractions between 0 and 1 — we multiply by width/height to get real pixel positions).',
      '',
      'TRY THIS: Change (255, 255, 0) to (0, 255, 0) — what color does the dot become? (Hint: OpenCV uses Blue-Green-Red order, not Red-Green-Blue.) Then change landmark[8] to landmark[4] — where does the dot move to now?',
    ].join('\n'),
  },

  // ── Session 3 ─────────────────────────────────────────────────────────────
  {
    step_number: 3,
    title: 'Section 3: Today the finger leaves a line behind — we are drawing!',
    source_type: 'lesson',
    audience: 'both',
    tags: ['session-3', 'canvas', 'drawing'],
    content: [
      'TODAY: We make a black canvas (an empty picture the same size as the camera). Every frame, we draw a line from where the finger WAS to where it IS NOW. Move your finger — the line grows. This is the heart of every drawing app ever made.',
      '',
      'WHY THIS MATTERS: The canvas remembers the drawing between frames. The camera does not. So we keep two pictures: the live camera, and a black canvas with just our lines, and we add them together at the end.',
      '',
      'REPLACE name_writer.py with this:',
      '',
      '    import cv2, numpy as np, mediapipe as mp',
      '    mp_hands = mp.solutions.hands',
      '    camera = cv2.VideoCapture(0)',
      '    canvas = None',
      '    previous = None',
      '    with mp_hands.Hands(max_num_hands=1) as hands:',
      '        while True:',
      '            ok, frame = camera.read()',
      '            if not ok: break',
      '            frame = cv2.flip(frame, 1)',
      '            if canvas is None:',
      '                canvas = np.zeros_like(frame)',
      '            result = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))',
      '            if result.multi_hand_landmarks:',
      '                h, w = frame.shape[:2]',
      '                lm = result.multi_hand_landmarks[0].landmark[8]',
      '                point = (int(lm.x * w), int(lm.y * h))',
      '                if previous is not None:',
      '                    cv2.line(canvas, previous, point, (255, 255, 0), 8)',
      '                previous = point',
      '            else:',
      '                previous = None',
      '            display = cv2.addWeighted(frame, 0.3, canvas, 1.0, 0)',
      '            cv2.imshow("Name Writer", display)',
      '            key = cv2.waitKey(1) & 0xFF',
      '            if key == ord("q"): break',
      '            if key == ord("c"): canvas[:] = 0',
      '    camera.release(); cv2.destroyAllWindows()',
      '',
      'RUN IT. Move your index finger slowly in the air. A line should follow. Press C to clear the canvas. Press Q to quit. Try to write the letter "A".',
      '',
      'WHAT IS NEW: np.zeros_like(frame) makes a fully black picture the same size as the camera frame. cv2.line(canvas, previous, point, ...) draws a line on the canvas from the last fingertip position to the new one. cv2.addWeighted(frame, 0.3, canvas, 1.0, 0) blends 30% of the camera with 100% of the canvas so the drawing pops on top of a dim mirror.',
      '',
      'TRY THIS: Change the line color, then change the thickness (the last number 8). Bigger number = thicker pen. What thickness feels best for writing your name?',
    ].join('\n'),
  },

  // ── Session 4 ─────────────────────────────────────────────────────────────
  {
    step_number: 4,
    title: 'Section 4: Today we add gestures — open palm pauses, pinch erases',
    source_type: 'lesson',
    audience: 'both',
    tags: ['session-4', 'gestures', 'logic'],
    content: [
      'TODAY: Right now your line never stops — even when you do not want to draw. We fix that with gestures. Only the index finger up = drawing. Open palm = pause (lift the pen). Pinch (thumb + index touching) = eraser.',
      '',
      'WHY THIS MATTERS: A gesture is just a YES/NO question about the hand. "Is the index finger up but the middle finger down?" If yes, we draw. That is all "AI gesture recognition" really is — a few if-statements on landmark positions.',
      '',
      'ADD THESE TWO HELPER FUNCTIONS at the top of name_writer.py (after the imports):',
      '',
      '    def finger_up(lms, tip, pip):',
      '        return lms[tip].y < lms[pip].y - 0.015',
      '    def distance(a, b):',
      '        import math; return math.hypot(a[0]-b[0], a[1]-b[1])',
      '',
      'Then REPLACE the if result.multi_hand_landmarks: block with:',
      '',
      '    if result.multi_hand_landmarks:',
      '        h, w = frame.shape[:2]',
      '        lms = result.multi_hand_landmarks[0].landmark',
      '        index_pt = (int(lms[8].x * w), int(lms[8].y * h))',
      '        thumb_pt = (int(lms[4].x * w), int(lms[4].y * h))',
      '        index_on  = finger_up(lms, 8, 6)',
      '        middle_on = finger_up(lms, 12, 10)',
      '        ring_on   = finger_up(lms, 16, 14)',
      '        pinky_on  = finger_up(lms, 20, 18)',
      '        pinching  = distance(index_pt, thumb_pt) < 45',
      '        open_palm = index_on and middle_on and ring_on and pinky_on',
      '        only_index = index_on and not middle_on and not ring_on and not pinky_on',
      '        if pinching:',
      '            cv2.circle(canvas, index_pt, 42, (0, 0, 0), -1)',
      '            previous = None',
      '        elif open_palm:',
      '            previous = None',
      '        elif only_index:',
      '            if previous is not None:',
      '                cv2.line(canvas, previous, index_pt, (255, 255, 0), 8)',
      '            previous = index_pt',
      '        else:',
      '            previous = None',
      '    else:',
      '        previous = None',
      '',
      'RUN IT. Index only = draw. Open palm = lift pen. Pinch thumb + index = erase a black circle on the canvas. Practise writing your first name — pause between letters by opening your palm.',
      '',
      'HOW finger_up WORKS: Each landmark has a y value. y is SMALLER when the finger is higher on the screen (because the top of the picture is y=0). So if the fingertip y is smaller than the knuckle y, the finger is sticking up. The "- 0.015" stops tiny shakes from flipping the answer.',
      '',
      'TRY THIS: Invent your own gesture. For example, peace sign = index + middle up, ring + pinky down. Add an extra elif that uses that gesture to draw a thicker line (thickness 18 instead of 8). Hint: the condition is  index_on and middle_on and not ring_on and not pinky_on.',
    ].join('\n'),
  },

  // ── Session 5 ─────────────────────────────────────────────────────────────
  {
    step_number: 5,
    title: 'Section 5: Today we polish it — top bar, smoothing, and SAVE the picture',
    source_type: 'lesson',
    audience: 'both',
    tags: ['session-5', 'polish', 'save', 'showcase'],
    content: [
      'TODAY: We finish the project. We smooth out the shakes so your handwriting is cleaner, add a black bar at the top with instructions, and add a SAVE key so you can save your name as a real PNG file and show your parents.',
      '',
      'WHY THIS MATTERS: A messy program nobody can use is not a finished project. Tiny polish — a title bar, smoothing, save — is what makes it feel real.',
      '',
      'ADD this just before the while True loop:',
      '',
      '    import time',
      '    from pathlib import Path',
      '    smoothed = None',
      '    SMOOTHING = 0.35',
      '',
      'INSIDE the loop, before you set index_pt into the gesture logic, smooth it:',
      '',
      '    raw = (int(lms[8].x * w), int(lms[8].y * h))',
      '    if smoothed is None:',
      '        smoothed = raw',
      '    else:',
      '        smoothed = (int(smoothed[0]*(1-SMOOTHING) + raw[0]*SMOOTHING),',
      '                    int(smoothed[1]*(1-SMOOTHING) + raw[1]*SMOOTHING))',
      '    index_pt = smoothed',
      '',
      'ADD a top bar before cv2.imshow:',
      '',
      '    cv2.rectangle(display, (0,0), (display.shape[1], 60), (15,15,25), -1)',
      '    cv2.putText(display, "Index=draw  Palm=pause  Pinch=erase  C=clear  S=save  Q=quit",',
      '                (16, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)',
      '',
      'ADD save support in the key handling:',
      '',
      '    if key == ord("s"):',
      '        Path("saved_names").mkdir(exist_ok=True)',
      '        name = f"saved_names/name_{time.strftime(\'%Y%m%d_%H%M%S\')}.png"',
      '        cv2.imwrite(name, canvas)',
      '        print("saved", name)',
      '',
      'RUN IT and write your full name. Press S to save. A new file appears inside the saved_names/ folder — open it and you should see your handwritten name on black.',
      '',
      'HOW SMOOTHING WORKS: SMOOTHING = 0.35 means the new point is 35% the raw position + 65% the OLD smoothed position. So sudden shakes get averaged out. Try SMOOTHING = 0.1 (very smooth, feels laggy) and SMOOTHING = 0.9 (almost no smoothing, jittery) to feel the difference.',
      '',
      'TRYOUT FOR HOME: Write the names of three people in your family, save each one, and bring them on a USB to next class for the showcase. Bonus: change the writing color for each name. EXTRA CHALLENGE: add a key "1" / "2" / "3" that switches the line color between cyan, pink, and yellow.',
    ].join('\n'),
  },
];

// ── Resolve which class to assign this to ────────────────────────────────────
const resolveTargetClass = async () => {
  const result = await pool.query(
    `SELECT class_name, grade
       FROM learning_projects
      WHERE class_name = $1 AND is_active = true
      LIMIT 1`,
    [FALLBACK_CLASS_NAME]
  );
  if (result.rows[0]) {
    return { class_name: result.rows[0].class_name, grade: result.rows[0].grade || FALLBACK_CLASS_NAME };
  }
  console.warn(`⚠️  No existing "${FALLBACK_CLASS_NAME}" project found — creating one fresh.`);
  return { class_name: FALLBACK_CLASS_NAME, grade: FALLBACK_CLASS_NAME };
};

const seed = async () => {
  await createLearningTables();
  const { class_name, grade } = await resolveTargetClass();
  console.log(`📚 Assigning "${PROJECT_TITLE}" to class: ${class_name}`);

  const project = await createLearningProject({
    title: PROJECT_TITLE,
    subject: 'Computer Vision, Python, Creative Coding',
    grade,
    class_name,
    description:
      'A 5-section starter project where students build a webcam app that lets them write their name in the air with their index finger. Each session adds one runnable piece — camera, fingertip tracking, drawing, gestures, save. By the end every student can write and save their own name as a PNG.',
    learning_goals:
      'Open and read a webcam with OpenCV, find a fingertip with MediaPipe, draw lines on an image, write boolean gesture rules from finger positions, smooth jittery input, and save a result to disk.',
    difficulty_level: 'beginner',
    duration_months: 1,
    expected_section_count: SECTION_COUNT,
    audience_scope: 'student_teacher',
    teacher_readiness_required: false,
    code_explanation_required: true,
    source_doc_name: 'hand_gesture_name_writer/name_writer.py',
    created_by_role: 'system',
  });

  const createdChunks = await replaceLearningContentChunks(project.id, chunks);

  return { project, class_name, chunk_count: createdChunks.length, sessions: SECTION_COUNT };
};

seed()
  .then((result) => {
    console.log('✅ Hand Gesture Name Writer learning project seeded');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('❌ Failed to seed Hand Gesture Name Writer project:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
