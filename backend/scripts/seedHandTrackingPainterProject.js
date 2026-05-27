/*
 * Seed: Hand Tracking Painter
 *
 * Adds the "Hand Tracking Painter" learning project (Python + OpenCV +
 * MediaPipe) to the SAME class where the "Fire Fighter Robot" project
 * already lives — i.e. the class Emmanuel Osei teaches. We resolve the
 * class dynamically by looking up Fire Fighter Robot's class_name so the
 * script keeps working even if the class is renamed.
 *
 * Run with:   node backend/scripts/seedHandTrackingPainterProject.js
 */

const pool = require('../src/config/db');
const {
  createLearningTables,
  createLearningProject,
  replaceLearningContentChunks,
  replaceLearningRoadmapDays,
} = require('../src/models/learningModel');

const PROJECT_TITLE = 'Hand Tracking Painter';
const FALLBACK_CLASS_NAME = 'Class 5';

// ── Chunks (the actual teaching content) ───────────────────────────────────
const chunks = [
  {
    step_number: 1,
    title: 'Project overview: Hand Tracking Painter',
    source_type: 'lesson',
    audience: 'both',
    tags: ['overview', 'computer-vision', 'python', 'opencv', 'mediapipe'],
    content: [
      'The Hand Tracking Painter (also called AI Air Painter) is a Python program that watches your hand through a webcam and lets you draw on the screen by moving your fingers in the air.',
      'The program uses two main libraries: OpenCV to read the camera and draw, and MediaPipe to find 21 landmark points on your hand 30 times every second.',
      'Different finger gestures do different things — one finger draws, two fingers pick a color, an open palm erases, and a thumb-and-index pinch makes a firework. Students will read these gestures from real hand landmarks.',
    ].join(' '),
  },
  {
    step_number: 1,
    title: 'What students will learn',
    source_type: 'lesson',
    audience: 'both',
    tags: ['outcomes', 'skills'],
    content: [
      'By the end of this project students can: install Python and a virtual environment, run a webcam-based program, understand x/y coordinates on an image, use OpenCV to draw lines and shapes, read MediaPipe hand landmarks, write a simple gesture rule (which finger is up?), and save their final artwork.',
      'They will also practice debugging real errors: camera not opening, MediaPipe not installing on the wrong Python version, and lag from too many drawing operations per frame.',
    ].join(' '),
  },
  {
    step_number: 2,
    title: 'Python and the virtual environment',
    source_type: 'setup',
    audience: 'both',
    tags: ['python', 'venv', 'pip', 'setup'],
    content: [
      'Use Python 3.11 or 3.12 — MediaPipe does not yet ship a wheel for Python 3.14, so a brand-new Mac may need: brew install python@3.11.',
      'Create a virtual environment so packages do not pollute the system: python3.11 -m venv .venv, then source .venv/bin/activate (on Windows: .venv\\Scripts\\activate).',
      'Install the three dependencies pinned in requirements.txt: opencv-python 4.10, mediapipe 0.10.21, numpy 1.26.4. Run: pip install -r requirements.txt.',
      'A virtual environment is just a folder that holds its own copy of Python and its installed libraries. Always activate it before running the program.',
    ].join(' '),
  },
  {
    step_number: 3,
    title: 'How MediaPipe finds the hand',
    source_type: 'lesson',
    audience: 'both',
    tags: ['mediapipe', 'landmarks', 'computer-vision'],
    content: [
      'MediaPipe Hands is a pre-trained machine-learning model. We feed it each camera frame and it returns up to 21 landmark points per hand — one for each knuckle and fingertip — with x, y, and z values between 0 and 1.',
      'x and y are fractions of the image width and height. To convert to pixel coordinates we multiply: px = int(x * width), py = int(y * height).',
      'The important landmark indexes for this project: 4 = thumb tip, 8 = index tip, 12 = middle tip, 16 = ring tip, 20 = pinky tip. The "pip" joints (6, 10, 14, 18) sit one knuckle below each tip and tell us if the finger is curled or straight.',
      'A finger counts as "up" when its tip y-value is HIGHER on the screen than its pip y-value (smaller y = higher because OpenCV uses top-left as origin).',
    ].join(' '),
  },
  {
    step_number: 4,
    title: 'Drawing on the screen with OpenCV',
    source_type: 'lesson',
    audience: 'both',
    tags: ['opencv', 'drawing', 'canvas'],
    content: [
      'OpenCV represents an image as a NumPy array of shape (height, width, 3). Each pixel has three numbers in BGR order: blue, green, red. White is (255,255,255), pure red is (0,0,255), pure blue is (255,0,0).',
      'We keep a separate canvas image the same size as the camera frame and draw onto it with cv2.line(canvas, start, end, color, thickness). To show both on screen we blend them: cv2.addWeighted(frame, 0.7, canvas, 1.0, 0).',
      'To erase, we draw a filled black circle on the canvas at the palm position: cv2.circle(canvas, (x, y), ERASER_RADIUS, (0,0,0), -1). The -1 means filled.',
      'Smoothing makes drawing feel less shaky: instead of using the raw fingertip x, we mix the previous and current position: x = (1 - SMOOTHING) * prev_x + SMOOTHING * new_x.',
    ].join(' '),
  },
  {
    step_number: 5,
    title: 'Reading gestures from finger state',
    source_type: 'lesson',
    audience: 'both',
    tags: ['gestures', 'logic', 'rules'],
    content: [
      'A gesture is just a rule that checks which fingers are up. We build a dict like {"index": True, "middle": False, ...} and then ask simple questions of it.',
      'Draw gesture — only the index finger is up: fingers["index"] and not fingers["middle"]. Use the index fingertip position as the pen.',
      'Pick a color or tool — index AND middle are up. Use the midpoint between the two fingertips as a cursor; if it sits inside one of the swatches in the top bar, that color becomes active.',
      'Erase gesture — index, middle, ring, and pinky are all up (open palm). Use the palm centre to erase a big circle from the canvas.',
      'Spark gesture — thumb and index are close together (distance(thumb_tip, index_tip) < PINCH_DISTANCE). Spawn 8–12 particles at that point that fade over 30 frames.',
    ].join(' '),
  },
  {
    step_number: 6,
    title: 'Colors, eraser, save, clear',
    source_type: 'lesson',
    audience: 'both',
    tags: ['ui', 'controls', 'persistence'],
    content: [
      'The top bar shows six color swatches: cyan, pink, yellow, green, blue, white. Each swatch is just a coloured rectangle drawn onto every frame so students always see what tool is active.',
      'Keyboard shortcuts: press c to clear the canvas (canvas[:] = 0), press s to save (cv2.imwrite("drawing.png", canvas)), press v to switch between a black background and the live camera background.',
      'Pressing q or Esc cleanly quits the program. Always release the camera (cap.release()) and destroy windows (cv2.destroyAllWindows()) at shutdown — otherwise the camera stays locked.',
    ].join(' '),
  },
  {
    step_number: 7,
    title: 'Particles: how the firework effect works',
    source_type: 'lesson',
    audience: 'both',
    tags: ['particles', 'animation', 'dataclasses'],
    content: [
      'A Particle is a small Python @dataclass that stores its position (x, y), velocity (vx, vy), remaining life in frames, and color. Every frame we update it: x += vx, y += vy, then we multiply velocity by 0.96 so it slows down, and subtract 1 from life.',
      'When the pinch gesture fires, we spawn 8–12 particles with random angles around the pinch point. We use math.cos(angle) and math.sin(angle) so they spread evenly in a circle.',
      'On each frame, we draw every particle as a small filled circle, then remove the ones whose life dropped to zero. This is the same pattern used by every game engine.',
    ].join(' '),
  },
  {
    step_number: 8,
    title: 'Classroom extension ideas (and how to add them)',
    source_type: 'extension',
    audience: 'both',
    tags: ['extension', 'student-project', 'creative'],
    content: [
      'Add a new color: append a tuple to the COLORS list and the swatch loop will draw it automatically. Discuss BGR ordering when picking the value.',
      'Add a new gesture: write a new finger_up combination, e.g. a peace sign (index + middle up, ring + pinky down) to drop a stamp shape instead of a line.',
      'Add a sound effect on pinch using the playsound or simpleaudio library — a good introduction to combining vision input with audio output.',
      'Save the final drawing automatically every minute using time.time(). Discuss with students why writing to disk too often is a bad idea.',
    ].join(' '),
  },
  // ── Project-wide chunks (no step_number) ────────────────────────────────
  {
    title: 'Hardware and software needed',
    source_type: 'reference',
    audience: 'both',
    tags: ['materials', 'reference'],
    content: [
      'Hardware: any laptop or desktop with a built-in or USB webcam, a screen, and enough light so the hand is visible against the background.',
      'Software: Python 3.11 or 3.12 (NOT 3.14), pip, and the three packages in requirements.txt — opencv-python, mediapipe, numpy.',
      'Optional: a clean wall or sheet of paper behind the student so the camera sees the hand clearly; a USB hub if multiple webcams are shared.',
    ].join(' '),
  },
  {
    title: 'Safety and classroom rules',
    source_type: 'teacher_rule',
    audience: 'teacher',
    tags: ['safety', 'classroom'],
    content: [
      'Hand-tracking apps are not biometric — MediaPipe runs locally and does not upload faces or hands. Tell students nothing is being recorded unless they hit the save key.',
      'Remind students not to point cameras at other children\'s faces during testing — frame the camera so it only sees their own hand and workspace.',
      'If a student gets eye strain or wrist fatigue, switch to keyboard controls for a turn. The point is to learn the code, not to drag for an hour.',
    ].join(' '),
  },
];

// ── Roadmap (each section = ~1 hour class period) ──────────────────────────
const roadmapDays = [
  {
    day_number: 1,
    section_number: 1,
    title: 'What is AI Air Painter and how does the computer see a hand?',
    teacher_goal: 'Show the finished demo, then explain what hand tracking actually is so students get excited and understand the goal.',
    student_goal: 'Students can describe in their own words how a webcam image becomes 21 dots on a hand, and why the computer needs those dots.',
    activities: [
      'Run the demo program in front of the class and draw the project name in the air.',
      'Pause the program and show a single frozen frame with the 21 landmark dots drawn on the hand.',
      'Ask students which dot they think is the index fingertip, then reveal it is landmark index 8.',
      'Discuss x, y coordinates using the projected frame: top-left is (0, 0), bottom-right is (width, height).',
    ],
    materials: ['Working laptop with webcam', 'projector', 'Hand Tracking Painter code', 'printout of the 21 landmarks'],
    code_explanation_focus: 'Open air_draw.py and point only at the constants block (WINDOW_NAME, CAMERA_WIDTH, etc.) so students see we will change values, not the whole code.',
    end_of_day_checklist: [
      'Demo ran without errors',
      'Students can point at landmark 8 on the printout',
      'Students can say what (x, y) means on the screen',
      'Camera is closed cleanly before leaving',
    ],
    teacher_report_prompts: [
      'Which students were most engaged with the demo?',
      'Did anyone ask a deep question about how it sees?',
      'Was the camera setup smooth or did anything fail?',
    ],
    next_day_prep: 'Make sure every student laptop has Python 3.11 installed and pip works. Prepare a 3-minute "what is a virtual environment" explainer.',
  },
  {
    day_number: 2,
    section_number: 2,
    title: 'Setting up Python, the virtual environment, and the camera',
    teacher_goal: 'Get every student to a state where they can run `python air_draw.py` and see the camera window open.',
    student_goal: 'Students can create a venv, install requirements, and open the camera window from the terminal.',
    activities: [
      'Walk through python3.11 -m venv .venv and activation, one terminal line at a time.',
      'Install requirements together: pip install -r requirements.txt.',
      'Run python air_draw.py and confirm the camera window opens.',
      'If a webcam does not appear, troubleshoot CAMERA_INDEX = 0 versus 1.',
      'Practice quitting cleanly with q so the camera light turns off.',
    ],
    materials: ['Student laptops with Python 3.11', 'project folder shared on USB or download', 'requirements.txt'],
    code_explanation_focus: 'Explain the import block at the top of air_draw.py and the try/except ImportError that gives a friendly error if pip install was skipped.',
    end_of_day_checklist: [
      'Every student created a working venv',
      'opencv, mediapipe, numpy installed successfully',
      'Camera window opened on every machine',
      'Students can press q to quit cleanly',
    ],
    teacher_report_prompts: [
      'Which laptops had install problems?',
      'Did anyone hit the Python 3.14 incompatibility issue?',
      'Which students helped others — record them as section leads.',
    ],
    next_day_prep: 'Bring the 21-landmark printout and prepare to draw on it with a marker during class.',
  },
  {
    day_number: 3,
    section_number: 3,
    title: 'MediaPipe basics: from camera pixels to 21 hand landmarks',
    teacher_goal: 'Make MediaPipe feel concrete — show students the dots, the indexes, and how landmarks become pixel positions.',
    student_goal: 'Students can read the landmark_point() function and predict which (x, y) it returns for landmark 8.',
    activities: [
      'Project the 21-landmark diagram and ask students to point to thumb tip (4), index tip (8), middle tip (12).',
      'Walk through the landmark_point() helper in air_draw.py: multiply x and y by width/height to get pixels.',
      'Ask each group to predict the pixel position of their own index finger if the camera is 1280×720 and the finger is in the centre.',
      'Comment out the drawing code and let students just see the dots — this proves the tracking is working before any "art" is added.',
    ],
    materials: ['21-landmark printout', 'air_draw.py code', 'projector', 'student laptops'],
    code_explanation_focus: 'Walk through landmark_point() line by line; emphasise the int() cast and why pixel coordinates must be whole numbers.',
    end_of_day_checklist: [
      'Students can name landmark 4, 8, 12, 16, 20',
      'Students can explain why we multiply by width and height',
      'The dots appear on every student screen',
      'Students grouped into pairs for next session',
    ],
    teacher_report_prompts: [
      'Could every student name landmark 8?',
      'Did anyone discover their hand was outside the camera frame?',
      'Best explainer for landmark math — record for section lead rotation.',
    ],
    next_day_prep: 'Prepare a blank canvas image (np.zeros) demo for next class — students will draw on it.',
  },
  {
    day_number: 4,
    section_number: 4,
    title: 'Drawing on the canvas with OpenCV',
    teacher_goal: 'Get students from "seeing dots" to "drawing a line" by tracking the index fingertip across frames.',
    student_goal: 'Students can draw a continuous line in the air using their index finger and explain how cv2.line() connects two points.',
    activities: [
      'Show np.zeros((720, 1280, 3), dtype=np.uint8) and ask students what each parameter means.',
      'Walk through cv2.line(canvas, prev_point, current_point, color, thickness).',
      'Demonstrate SMOOTHING by setting it to 0.1 (jerky), 0.35 (default), and 0.9 (laggy) so students feel the trade-off.',
      'Let each student draw their initials in the air and screenshot it.',
      'Discuss cv2.addWeighted() and why we blend the camera and canvas instead of choosing one.',
    ],
    materials: ['Student laptops with the project running', 'projector', 'optional: paper to compare drawing styles'],
    code_explanation_focus: 'Walk through the draw section: prev_point, current_point, the cv2.line call, and the smoothing math.',
    end_of_day_checklist: [
      'Every student drew their initials in the air',
      'Students can explain why smoothing exists',
      'Students can identify the cv2.line arguments in order',
      'Best artwork from each pair selected for showcase',
    ],
    teacher_report_prompts: [
      'Which students mastered smoothing intuitively?',
      'Did anyone change the line thickness or color on their own?',
      'Who needs more help with x/y coordinates?',
    ],
    next_day_prep: 'Print or sketch the gesture chart (one finger / two fingers / palm / pinch) for next class.',
  },
  {
    day_number: 5,
    section_number: 5,
    title: 'Gestures: rules that decide what the hand is doing',
    teacher_goal: 'Teach students that a gesture is just a Python condition on finger state — no AI magic.',
    student_goal: 'Students can write the boolean expression for "only index up" and predict what each gesture triggers.',
    activities: [
      'Project the get_fingers() function and walk through finger_up() landmark-by-landmark.',
      'Ask students to draw a truth table for each gesture: which fingers up, which gesture, what action.',
      'Have pairs invent a NEW gesture (e.g. peace sign, thumbs-up) and write the boolean condition for it on paper before any coding.',
      'Modify the code together to add the peace-sign gesture as "drop a star stamp" — talk through every change.',
    ],
    materials: ['Gesture chart printout', 'student laptops', 'paper for truth tables'],
    code_explanation_focus: 'Step through finger_up() and the gesture branch in the main loop — show why ordering of checks matters (pinch first because palm includes index up too).',
    end_of_day_checklist: [
      'Students can write fingers["index"] and not fingers["middle"] without help',
      'Every pair invented a new gesture on paper',
      'At least one new gesture was added to the code',
      'Section lead for next class assigned',
    ],
    teacher_report_prompts: [
      'Which pair invented the most creative gesture?',
      'Where did students get confused with boolean logic?',
      'Who explained the truth table best — record as lead.',
    ],
    next_day_prep: 'Prepare the top color bar code section for next class. Pre-load alternate color palettes for students to try.',
  },
  {
    day_number: 6,
    section_number: 6,
    title: 'Colors, eraser, save, clear: the painter\'s controls',
    teacher_goal: 'Show how a small UI (the swatches) combines with gestures to build a real tool.',
    student_goal: 'Students can change the color list, save their artwork, and clear the canvas without help.',
    activities: [
      'Walk through the COLORS list and the swatch drawing loop.',
      'Ask each student to add their favourite color (with BGR values) and verify it appears as a swatch.',
      'Demonstrate s to save, c to clear, v to toggle background — let every student try each one.',
      'Open the saved PNG file together — discuss how cv2.imwrite chose the file format from the extension.',
    ],
    materials: ['Student laptops', 'projector', 'list of BGR color references'],
    code_explanation_focus: 'Walk through the keyboard handling block: cv2.waitKey(1), the & 0xFF mask, and each key branch.',
    end_of_day_checklist: [
      'Every student added a new color to COLORS',
      'Every student saved at least one drawing',
      'Students can describe the v toggle in their own words',
      'Saved PNGs collected and named for showcase',
    ],
    teacher_report_prompts: [
      'Whose color choice was most creative?',
      'Did anyone discover the BGR vs RGB confusion?',
      'Who is ready to lead the particles section next?',
    ],
    next_day_prep: 'Prepare the Particle dataclass walkthrough and a slow-motion demo of the firework spawn.',
  },
  {
    day_number: 7,
    section_number: 7,
    title: 'Particles and the firework effect — animation from math',
    teacher_goal: 'Show students that "effects" in games and creative tools are just small classes updated every frame.',
    student_goal: 'Students can explain what x, y, vx, vy, and life mean for a Particle and predict where one will be 10 frames later.',
    activities: [
      'Walk through the @dataclass Particle and the update() method.',
      'On paper, simulate one particle for 5 frames given x=100, y=100, vx=4, vy=-3 — students do the math.',
      'Demonstrate spawn_particles() and slow it down by setting count=2 and life=120 so students see each dot.',
      'Let pairs change the velocity range or particle color and observe the effect.',
    ],
    materials: ['Student laptops', 'paper and pencil for hand-simulation', 'projector'],
    code_explanation_focus: 'Walk through Particle.update(): position update, velocity damping (×0.96), and life countdown.',
    end_of_day_checklist: [
      'Students can simulate a particle on paper for 5 frames',
      'Every pair tweaked at least one particle parameter',
      'Students can explain why velocity is damped',
      'Best effect saved for the showcase',
    ],
    teacher_report_prompts: [
      'Who connected the particle math to other games they know?',
      'Did anyone create a striking visual effect?',
      'Where did students struggle with the velocity math?',
    ],
    next_day_prep: 'Build a simple showcase slide template — name, gesture invented, screenshot.',
  },
  {
    day_number: 8,
    section_number: 8,
    title: 'Showcase: every pair demos their painter and explains one change',
    teacher_goal: 'Shift the floor to students — every pair explains one part of the code they changed and what they learned.',
    student_goal: 'Students can demo their painter, point at the lines of code they modified, and answer one peer question.',
    activities: [
      'Each pair takes 2 minutes to demo their painter live and show their saved artwork.',
      'After the demo, the pair points at one block of code they changed and explains the change.',
      'Class asks one question per pair — the demoing pair answers without the teacher.',
      'Teacher records the strongest impact student and the best peer explainer.',
    ],
    materials: ['Student laptops', 'projector', 'saved PNGs', 'showcase slide template'],
    code_explanation_focus: 'Whatever block each pair chose to change — the showcase IS the code explanation, in students\' own words.',
    end_of_day_checklist: [
      'Every pair demoed live without crashing',
      'Every pair pointed at and explained one code change',
      'Every pair answered at least one peer question',
      'Strongest impact student and best explainer recorded for the project report',
    ],
    teacher_report_prompts: [
      'Who taught their peers most clearly?',
      'Whose change was most ambitious?',
      'Which student grew the most across the 8 sections?',
    ],
    next_day_prep: 'Wrap project, archive saved PNGs, and post the showcase slides for parents.',
  },
];

// ── Resolve which class to assign this to ──────────────────────────────────
const resolveTargetClass = async () => {
  // Prefer the class that already hosts Fire Fighter Robot — that's
  // Emmanuel Osei's class. If it's not there yet, fall back to Class 5.
  const result = await pool.query(
    `SELECT class_name, grade
       FROM learning_projects
      WHERE LOWER(title) LIKE '%fire fighter%'
        AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1`
  );
  const row = result.rows[0];
  if (row && row.class_name) {
    return { class_name: row.class_name, grade: row.grade || row.class_name };
  }
  console.warn(`⚠️  Fire Fighter Robot not found — falling back to "${FALLBACK_CLASS_NAME}".`);
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
      'A webcam-based AI air painter that uses OpenCV and MediaPipe to track 21 hand landmarks and let students draw, erase, change colors, and trigger firework effects with finger gestures. Project-paced over 8 one-hour sections, ending in a class showcase.',
    learning_goals:
      'Set up Python and a virtual environment, understand image coordinates and BGR color, read MediaPipe hand landmarks, design simple gesture rules with boolean logic, draw on a canvas with OpenCV, animate particles from physics, and confidently demo a working program to peers.',
    difficulty_level: 'beginner',
    duration_months: 2,
    expected_section_count: 8,
    audience_scope: 'student_teacher',
    teacher_readiness_required: false,
    code_explanation_required: true,
    source_doc_name: 'hand_tracking_painter/README.md',
    created_by_role: 'system',
  });

  const createdChunks = await replaceLearningContentChunks(project.id, chunks);
  const createdRoadmapDays = await replaceLearningRoadmapDays(project.id, roadmapDays);

  return {
    project,
    class_name,
    chunk_count: createdChunks.length,
    roadmap_day_count: createdRoadmapDays.length,
  };
};

seed()
  .then((result) => {
    console.log('✅ Hand Tracking Painter learning project seeded');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('❌ Failed to seed Hand Tracking Painter project:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
