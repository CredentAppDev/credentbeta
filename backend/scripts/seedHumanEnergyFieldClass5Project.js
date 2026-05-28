const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');
const { createSchoolTables } = require('../src/models/schoolModel');
const {
  createLearningTables,
  createLearningProject,
  replaceLearningContentChunks,
  replaceLearningProjectAssets,
  replaceLearningRoadmapDays,
} = require('../src/models/learningModel');

const sourceDir = process.env.HUMAN_ENERGY_FIELD_SOURCE_DIR
  || '/Users/macbookpro/Downloads';

const assets = [
  {
    title: 'Class 5 student guide source PDF',
    file_name: 'Human Energy Field Project Guide.pdf',
    file_path: path.join(sourceDir, 'Human Energy Field Project Guide.pdf'),
    asset_type: 'pdf',
    mime_type: 'application/pdf',
  },
  {
    title: 'Technical build source PDF',
    file_name: 'AI Human Energy Field Project.pdf',
    file_path: path.join(sourceDir, 'AI Human Energy Field Project.pdf'),
    asset_type: 'pdf',
    mime_type: 'application/pdf',
  },
];

const chunks = [
  {
    step_number: 1,
    title: 'Project verification: one project, two documents',
    source_type: 'teacher_rule',
    audience: 'teacher',
    tags: ['verification', 'source-documents', 'class-5'],
    content: [
      'The two source documents describe one learning project, not two different projects.',
      'The technical document explains the full build, code, hardware, and system architecture.',
      'The project guide explains the same idea in a student-friendly curriculum style.',
      'For Class 5, use one project title: Human Energy Field: AI Particle Art.',
    ].join(' '),
  },
  {
    step_number: 2,
    title: 'Project overview for Class 5',
    source_type: 'lesson',
    audience: 'both',
    tags: ['overview', 'ai', 'computer-vision', 'creative-coding'],
    content: [
      'Students build an interactive AI art system that turns human detection data into colorful particle figures.',
      'Instead of showing a normal detection box around a person, the project turns position, size, and movement into a glowing energy field.',
      'When more than one person appears, students observe how particle systems can connect, overlap, and create flow between people.',
      'The Class 5 goal is to understand the idea, identify the hardware layers, safely connect the boards with teacher guidance, and explain the data-to-art process in simple language.',
    ].join(' '),
  },
  {
    step_number: 3,
    title: 'Class 5 learning goals',
    source_type: 'lesson',
    audience: 'both',
    tags: ['goals', 'assessment', 'class-5'],
    content: [
      'By the end of the project, students should be able to explain how AI detection can find people in a camera view.',
      'They should describe the three system layers: the camera eye, the bridge board, and the Processing art program.',
      'They should identify the XIAO ESP32S3 Sense, XIAO ESP32C3, jumper wires, Arduino IDE, Processing IDE, and SenseCraft AI.',
      'They should explain that TX connects to RX, RX connects to TX, and GND connects to GND when using UART.',
      'They should demonstrate or describe how detection data becomes particles, colors, motion, and connections.',
    ].join(' '),
  },
  {
    step_number: 4,
    title: 'Main components learners will use',
    source_type: 'hardware',
    audience: 'both',
    tags: ['components', 'hardware', 'software'],
    content: [
      'Hardware parts: Seeed Studio XIAO ESP32S3 Sense, Seeed Studio XIAO ESP32C3, three female-to-female jumper wires, double-sided tape, and USB cables.',
      'Software tools: Arduino IDE, Processing IDE, and Seeed Studio SenseCraft AI.',
      'The XIAO ESP32S3 Sense is the eye that runs human detection.',
      'The XIAO ESP32C3 is the bridge that receives and sends detection data.',
      'Processing is the art layer that draws the particle-based human energy field.',
    ].join(' '),
  },
  {
    step_number: 5,
    title: 'Three-layer system architecture',
    source_type: 'lesson',
    audience: 'both',
    tags: ['architecture', 'ai-layer', 'bridge-layer', 'art-layer'],
    content: [
      'Layer 1 is vision recognition. The XIAO ESP32S3 Sense uses its camera and AI model to detect people.',
      'Layer 2 is data transmission. The ESP32C3 receives the detection data through UART and sends it to the computer.',
      'Layer 3 is particle generation. Processing receives the data and draws moving particles that represent each person.',
      'Class 5 students should focus on explaining what each layer does and why the bridge layer is needed.',
    ].join(' '),
  },
  {
    step_number: 6,
    title: 'Important bridge lesson',
    source_type: 'lesson',
    audience: 'both',
    tags: ['uart', 'bridge', 'esp32c3', 'debugging'],
    content: [
      'A key engineering lesson is that Processing cannot directly read the packaged AI output from the S3 Sense while it is busy running its AI firmware.',
      'That is why the ESP32C3 is added as a messenger board.',
      'Students should be able to say: the S3 Sense sees, the C3 carries the message, and Processing draws the art.',
      'This explanation is more important for Class 5 than memorizing advanced code details.',
    ].join(' '),
  },
  {
    step_number: 7,
    title: 'Wiring safety and UART rule',
    source_type: 'hardware',
    audience: 'both',
    tags: ['wiring', 'uart', 'safety', 'teacher-check'],
    content: [
      'All wiring should be checked by the teacher before power is applied.',
      'The three-wire UART connection is TX on the S3 Sense to RX on the C3, RX on the S3 Sense to TX on the C3, and GND to GND.',
      'Students can remember TX as the talking pin and RX as the listening pin.',
      'One board talking should connect to the other board listening.',
    ].join(' '),
  },
  {
    step_number: 8,
    title: 'Code explanation rule for AI help',
    source_type: 'code_rule',
    audience: 'both',
    tags: ['code', 'ai-assessment', 'processing', 'arduino'],
    content: [
      'The AI assistant must explain code before asking students to use it.',
      'For Class 5, code explanations should use short steps: what this code does, what data it receives, what it sends, and what students should see.',
      'The assistant should not give a final answer only. It should ask students to explain one part back in their own words.',
      'If a student is stuck, the assistant should diagnose one layer at a time: camera eye, bridge board, serial port, or Processing art.',
    ].join(' '),
  },
  {
    step_number: 9,
    title: 'Processing particle art concept',
    source_type: 'lesson',
    audience: 'both',
    tags: ['processing', 'particles', 'creative-coding'],
    content: [
      'Processing reads data such as a person center point, width, and height.',
      'Those values are mapped to the screen so the program can draw a particle silhouette in the correct area.',
      'Particles can have colors, movement, trails, and connections.',
      'Students should be assessed on whether they can explain the transformation from data numbers into visual art.',
    ].join(' '),
  },
  {
    step_number: 10,
    title: 'Assessment evidence the AI should look for',
    source_type: 'assessment_rule',
    audience: 'both',
    tags: ['assessment', 'rubric', 'evidence'],
    content: [
      'The AI can assess students using four kinds of evidence: explanation, practical progress, teamwork, and reflection.',
      'Explanation means the student can describe the three layers and why the C3 bridge is needed.',
      'Practical progress means the group can identify parts, follow safe wiring checks, run or observe the AI model, and test the Processing output.',
      'Teamwork means the student helps the group, listens, shares roles, and explains ideas to peers.',
      'Reflection means the student can say how AI data became art and what they would improve next.',
    ].join(' '),
  },
  {
    step_number: 11,
    title: 'Class 5 rubric',
    source_type: 'assessment_rule',
    audience: 'teacher',
    tags: ['rubric', 'teacher', 'class-5'],
    content: [
      'Use a four-level rubric.',
      'Level 4: student explains the full system clearly, contributes safely, helps others, and connects AI data to creative expression.',
      'Level 3: student explains the main layers, completes assigned tasks with small support, and can describe the final visual result.',
      'Level 2: student identifies some parts and ideas but needs support to connect the layers or explain the bridge.',
      'Level 1: student participates but cannot yet explain the system, safety rule, or data-to-art idea without major help.',
    ].join(' '),
  },
  {
    step_number: 12,
    title: 'Teacher reporting rule',
    source_type: 'teacher_rule',
    audience: 'teacher',
    tags: ['teacher-report', 'progress', 'ai-assessment'],
    content: [
      'After each section, the teacher should report what the group completed, who had the strongest positive impact, who should lead next, what students understood, and what needs support.',
      'The AI uses these saved reports and group updates to assess progress over time.',
      'The lead should be based on impact, teamwork, explanation quality, and responsibility, not only speed.',
    ].join(' '),
  },
];

const roadmapDays = [
  {
    day_number: 1,
    title: 'Project launch: computer vision as art',
    teacher_goal: 'Introduce Human Energy Field as one Class 5 AI art project and connect the two source PDFs into one learning path.',
    student_goal: 'Students can explain that the project turns human detection data into particle art.',
    activities: [
      'Show the project idea: a person becomes a colorful particle field instead of a box.',
      'Discuss how computers see people as data and how artists can transform data into expression.',
      'Ask students to draw what an energy field might look like around a person.',
      'Record which students explain the idea clearly.',
    ],
    materials: ['Human Energy Field source PDFs', 'board or slides', 'student notebooks'],
    code_explanation_focus: 'No code yet. Explain the idea that numbers from a camera can control art on a screen.',
    end_of_day_checklist: [
      'Students know this is one project',
      'Students can describe bounding boxes in simple terms',
      'Students can describe particles as visual art',
      'Teacher records initial understanding',
    ],
    teacher_report_prompts: [
      'Could students explain the project idea?',
      'Who connected AI data to art most clearly?',
      'What words or concepts need review?',
      'Who should lead the next parts-identification activity?',
    ],
    next_day_prep: 'Prepare hardware parts or pictures of the S3 Sense, C3, jumper wires, and USB cables.',
  },
  {
    day_number: 2,
    title: 'Meet the hardware: eye, bridge, and computer',
    teacher_goal: 'Help students identify each hardware part and assign it to a system role.',
    student_goal: 'Students can point to the S3 Sense as the eye and the C3 as the bridge.',
    activities: [
      'Show the XIAO ESP32S3 Sense and identify the camera.',
      'Show the XIAO ESP32C3 and explain that it carries messages.',
      'Let groups sort parts into eye, bridge, connection, and computer categories.',
      'Ask each group to explain one part back to the class.',
    ],
    materials: ['XIAO ESP32S3 Sense', 'XIAO ESP32C3', 'jumper wires', 'USB cables', 'double-sided tape'],
    code_explanation_focus: 'Explain that hardware sends information before software can draw anything.',
    end_of_day_checklist: [
      'Students identify S3 Sense',
      'Students identify ESP32C3',
      'Students identify jumper wires',
      'Group explanation recorded',
    ],
    teacher_report_prompts: [
      'Which parts did students identify correctly?',
      'Which student gave the clearest hardware explanation?',
      'Which groups need more parts practice?',
    ],
    next_day_prep: 'Prepare SenseCraft AI model deployment demonstration.',
  },
  {
    day_number: 3,
    title: 'Giving the camera an AI brain',
    teacher_goal: 'Introduce SenseCraft AI and the human/personnel detection model.',
    student_goal: 'Students can explain that the camera uses an AI model to detect people.',
    activities: [
      'Open SenseCraft AI and show the personnel detection model.',
      'Explain that the model looks for people in the camera view.',
      'Demonstrate how moving closer or farther can change the detected size.',
      'Ask students to predict what data changes when a person moves.',
    ],
    materials: ['SenseCraft AI', 'XIAO ESP32S3 Sense', 'computer', 'projector if available'],
    code_explanation_focus: 'Explain model deployment as giving the camera a prepared skill.',
    end_of_day_checklist: [
      'Students know the model detects people',
      'Students can predict position or size changes',
      'Teacher notes prediction quality',
    ],
    teacher_report_prompts: [
      'Could students explain what an AI model does?',
      'Who made a strong prediction about data changes?',
      'What needs review before looking at raw data?',
    ],
    next_day_prep: 'Prepare a simple raw-data observation activity.',
  },
  {
    day_number: 4,
    title: 'Raw detection data: numbers behind the art',
    teacher_goal: 'Show that AI detection produces values such as position, width, and height.',
    student_goal: 'Students can describe that AI output includes numbers, not only pictures.',
    activities: [
      'Show sample detection output with x, y, w, and h values.',
      'Explain x and y as position and w and h as size.',
      'Let students move in front of the camera and observe what changes.',
      'Ask students to connect the numbers to where a particle figure should appear.',
    ],
    materials: ['S3 Sense detection output', 'sample data lines', 'student notebooks'],
    code_explanation_focus: 'Explain x, y, width, and height using classroom position examples.',
    end_of_day_checklist: [
      'Students know x and y mean position',
      'Students know w and h mean size',
      'Students connect data to screen location',
    ],
    teacher_report_prompts: [
      'Which students understood x/y position?',
      'Which students understood width/height?',
      'What data idea needs another example?',
    ],
    next_day_prep: 'Prepare bridge-board explanation and UART vocabulary.',
  },
  {
    day_number: 5,
    title: 'The bridge problem: why we need the ESP32C3',
    teacher_goal: 'Teach the hard-earned lesson that the C3 bridge is needed because the S3 Sense is busy running AI firmware.',
    student_goal: 'Students can explain: S3 sees, C3 carries, Processing draws.',
    activities: [
      'Review the three system layers.',
      'Explain why the S3 Sense cannot do every job at the same time.',
      'Introduce the ESP32C3 as a messenger.',
      'Have students act out eye, bridge, and artist roles.',
    ],
    materials: ['S3 Sense', 'ESP32C3', 'layer diagram'],
    code_explanation_focus: 'Explain system roles before showing any serial code.',
    end_of_day_checklist: [
      'Students can name the bridge board',
      'Students can explain why a bridge is needed',
      'Students can repeat the eye-bridge-art sentence',
    ],
    teacher_report_prompts: [
      'Who explained the bridge clearly?',
      'Which group still thinks one board does everything?',
      'Who should lead wiring vocabulary next?',
    ],
    next_day_prep: 'Prepare UART wiring demonstration with no power applied.',
  },
  {
    day_number: 6,
    title: 'UART wiring: TX talks, RX listens',
    teacher_goal: 'Teach the three-wire UART rule with a strong teacher safety check.',
    student_goal: 'Students can state TX to RX, RX to TX, and GND to GND.',
    activities: [
      'Explain TX as talk and RX as listen.',
      'Demonstrate TX on S3 to RX on C3, RX on S3 to TX on C3, and GND to GND.',
      'Let groups trace the connection with boards unpowered.',
      'Teacher checks each group before anything is powered.',
    ],
    materials: ['S3 Sense', 'ESP32C3', 'three jumper wires', 'wiring diagram'],
    code_explanation_focus: 'Explain that correct wiring lets data travel from AI detection to the bridge.',
    end_of_day_checklist: [
      'TX to RX identified',
      'RX to TX identified',
      'GND to GND identified',
      'Teacher safety check completed',
    ],
    teacher_report_prompts: [
      'Which groups traced UART correctly?',
      'Who helped with safe checking?',
      'Were there wiring misconceptions?',
    ],
    next_day_prep: 'Prepare Arduino IDE setup and board-selection demonstration.',
  },
  {
    day_number: 7,
    title: 'Arduino IDE and bridge code purpose',
    teacher_goal: 'Introduce Arduino IDE and explain what the bridge code is for before any upload.',
    student_goal: 'Students can explain that bridge code formats detection data for the computer.',
    activities: [
      'Open Arduino IDE and show board/port selection.',
      'Explain that the C3 needs code to read and pass along messages.',
      'Show a short sample serial line from a detected person.',
      'Ask students what information Processing will need from that line.',
    ],
    materials: ['Arduino IDE', 'ESP32C3', 'sample serial output'],
    code_explanation_focus: 'Explain purpose first: receive AI detection data, format it, and send it to the computer.',
    end_of_day_checklist: [
      'Students know Arduino IDE uploads code',
      'Students know the C3 formats data',
      'Students can identify at least one useful data value',
    ],
    teacher_report_prompts: [
      'Could students explain the bridge code purpose?',
      'Who identified useful data values?',
      'What setup step was confusing?',
    ],
    next_day_prep: 'Prepare Processing IDE and a simple drawing sketch.',
  },
  {
    day_number: 8,
    title: 'Processing IDE: the digital sketchbook',
    teacher_goal: 'Introduce Processing as the art program that draws the particle field.',
    student_goal: 'Students can create or observe a simple Processing sketch with shapes and color.',
    activities: [
      'Open Processing IDE and explain it as a digital sketchbook.',
      'Demonstrate canvas size, background, color, and a simple moving shape.',
      'Connect the idea of shape position to x and y data.',
      'Let students sketch how a person could become particles.',
    ],
    materials: ['Processing IDE', 'computer', 'projector', 'student notebooks'],
    code_explanation_focus: 'Explain canvas, color, and position before using serial data.',
    end_of_day_checklist: [
      'Students know Processing draws the art',
      'Students connect x/y to screen position',
      'Students describe particles as many small moving points',
    ],
    teacher_report_prompts: [
      'Who understood Processing as the art layer?',
      'Which students connected position data to screen position?',
      'Who should lead the first particle activity?',
    ],
    next_day_prep: 'Prepare particle-system explanation and sample visuals.',
  },
  {
    day_number: 9,
    title: 'Particles: turning one person into many points',
    teacher_goal: 'Explain how detection data can generate a particle silhouette.',
    student_goal: 'Students can describe how one detected person becomes many moving particles.',
    activities: [
      'Show a simple particle visual.',
      'Explain that particles are small points with position, color, and movement.',
      'Map center, width, and height to where particles appear.',
      'Ask groups to choose colors or motion ideas for their field.',
    ],
    materials: ['Processing particle demo', 'sample data', 'student design notes'],
    code_explanation_focus: 'Explain that each particle follows simple rules: where it starts, how it moves, and how it fades.',
    end_of_day_checklist: [
      'Students know what particles are',
      'Students can connect person size to particle area',
      'Groups choose a visual style idea',
    ],
    teacher_report_prompts: [
      'Who explained particles clearly?',
      'Which group made a strong visual design choice?',
      'What data-to-art concept needs review?',
    ],
    next_day_prep: 'Prepare serial-port explanation for connecting Processing to data.',
  },
  {
    day_number: 10,
    title: 'Serial port connection: getting data into Processing',
    teacher_goal: 'Teach that Processing must listen to the correct serial port to receive bridge data.',
    student_goal: 'Students can explain that the port is the computer path used by the board.',
    activities: [
      'Show Processing printing the available serial ports.',
      'Explain why the correct Serial.list index may need to change.',
      'Remind students to close Arduino IDE so the port is not occupied.',
      'Run a teacher-led connection test.',
    ],
    materials: ['Processing IDE', 'ESP32C3', 'USB cable', 'sample port list'],
    code_explanation_focus: 'Explain Serial.list as a list of possible board paths and the index as the selected path.',
    end_of_day_checklist: [
      'Students know Arduino IDE can occupy the port',
      'Students know Processing must select the correct port',
      'Connection test attempted or issue recorded',
    ],
    teacher_report_prompts: [
      'Which groups connected successfully?',
      'Which groups had port issues?',
      'Who helped diagnose the problem calmly?',
    ],
    next_day_prep: 'Prepare full loop test: camera to bridge to Processing.',
  },
  {
    day_number: 11,
    title: 'Full loop test: see, carry, draw',
    teacher_goal: 'Run the first complete test from camera detection through bridge data into particle art.',
    student_goal: 'Students can explain what happened at each layer during the full loop test.',
    activities: [
      'Review S3 sees, C3 carries, Processing draws.',
      'Run the camera and bridge with Processing open.',
      'Have one student move in front of the camera while others observe the screen.',
      'Record what worked and what failed by layer.',
    ],
    materials: ['S3 Sense', 'ESP32C3', 'Processing sketch', 'USB cables'],
    code_explanation_focus: 'If the test fails, explain and test one layer at a time.',
    end_of_day_checklist: [
      'Full loop test attempted',
      'Working layers identified',
      'Problems sorted by layer',
      'Teacher update submitted',
    ],
    teacher_report_prompts: [
      'Which layer worked best?',
      'Which layer caused trouble?',
      'Who made the strongest debugging contribution?',
      'Who should lead the next troubleshooting section?',
    ],
    next_day_prep: 'Prepare troubleshooting checklist for camera, bridge, port, and Processing.',
  },
  {
    day_number: 12,
    title: 'Troubleshooting by layer',
    teacher_goal: 'Use group reports to debug one layer at a time and record impact.',
    student_goal: 'Students can name the layer they are testing and describe the result.',
    activities: [
      'Sort problems into camera eye, bridge board, serial port, or Processing art.',
      'Choose one issue per group.',
      'Test one fix before changing anything else.',
      'Record the impact student and next section lead.',
    ],
    materials: ['Troubleshooting checklist', 'project devices', 'group report notes'],
    code_explanation_focus: 'Explain the suspected code or setup issue before making a change.',
    end_of_day_checklist: [
      'Each group identified one issue',
      'Each group tested one fix',
      'Impact student recorded',
      'Next lead assigned',
    ],
    teacher_report_prompts: [
      'What issue did each group test?',
      'What was the result?',
      'Who helped the group understand the cause?',
      'What should be reviewed next?',
    ],
    next_day_prep: 'Prepare multi-person interaction test.',
  },
  {
    day_number: 13,
    title: 'Two people on screen: connections and flow',
    teacher_goal: 'Explore what happens when more than one person appears in the camera view.',
    student_goal: 'Students can describe how multiple particle figures can connect or interact.',
    activities: [
      'Run the particle visualization with one person.',
      'Add a second person and observe connection, overlap, or flow effects.',
      'Ask students what changed in the data and what changed in the art.',
      'Let groups propose one creative interaction improvement.',
    ],
    materials: ['Working project setup', 'Processing sketch', 'observation sheet'],
    code_explanation_focus: 'Explain that multiple detections can create multiple particle systems with relationships between them.',
    end_of_day_checklist: [
      'Students observed one-person behavior',
      'Students observed two-person behavior',
      'Students described at least one change',
      'Creative improvement idea recorded',
    ],
    teacher_report_prompts: [
      'Could students explain what changed with two people?',
      'Who gave the strongest observation?',
      'Which improvement idea is practical?',
    ],
    next_day_prep: 'Prepare reflection discussion on technology, people, and space.',
  },
  {
    day_number: 14,
    title: 'Tech with heart: reflection and responsible AI',
    teacher_goal: 'Connect the technical work to human expression and responsible AI use.',
    student_goal: 'Students can explain how AI can be used for creative expression instead of only tracking.',
    activities: [
      'Discuss why a bounding box feels different from an energy field.',
      'Ask students how technology can feel warmer or more human.',
      'Write one responsible AI rule for camera-based projects.',
      'Share reflections in groups.',
    ],
    materials: ['Reflection prompts', 'student notebooks', 'project demo'],
    code_explanation_focus: 'Explain that design choices change how technology feels to people.',
    end_of_day_checklist: [
      'Each group wrote one responsible AI rule',
      'Students explained AI as creative expression',
      'Reflection evidence recorded',
    ],
    teacher_report_prompts: [
      'Which reflection was most thoughtful?',
      'Could students discuss privacy and respect?',
      'Who should speak during final showcase?',
    ],
    next_day_prep: 'Prepare final showcase roles and assessment checklist.',
  },
  {
    day_number: 15,
    title: 'Final showcase rehearsal and assessment check',
    teacher_goal: 'Rehearse the final presentation and assess readiness using the Class 5 rubric.',
    student_goal: 'Students can explain their contribution and one technical idea from the project.',
    activities: [
      'Assign roles: hardware explainer, AI explainer, bridge explainer, Processing explainer, and demo lead.',
      'Practice the demo flow.',
      'Ask every student to explain one part in simple language.',
      'Teacher records rubric evidence and final blockers.',
    ],
    materials: ['Assessment checklist', 'working setup', 'student role cards'],
    code_explanation_focus: 'Every group must explain the system idea, not just show the visual result.',
    end_of_day_checklist: [
      'Roles assigned',
      'Demo rehearsed',
      'Every student explained one part',
      'Final blockers recorded',
    ],
    teacher_report_prompts: [
      'Who is ready to explain hardware?',
      'Who is ready to explain AI detection?',
      'Who is ready to explain Processing art?',
      'Which student needs support before showcase?',
    ],
    next_day_prep: 'Prepare final showcase, reflection prompts, and project completion report.',
  },
  {
    day_number: 16,
    title: 'Final showcase: Human Energy Field gallery',
    teacher_goal: 'Complete the project with demos, student explanations, reflection, and a teacher completion report.',
    student_goal: 'Students can demonstrate or describe the full workflow from AI detection to particle art.',
    activities: [
      'Run final group demos or show documented progress if hardware is incomplete.',
      'Ask each role to explain their layer of the system.',
      'Ask each student to share one thing they learned and one thing they would improve.',
      'Teacher submits final impact, lead, and rubric evidence report.',
    ],
    materials: ['Final setup', 'reflection prompts', 'teacher completion report'],
    code_explanation_focus: 'Students explain S3 sees, C3 carries, and Processing draws in their own words.',
    end_of_day_checklist: [
      'Final demo completed or blocker documented',
      'Students explained the workflow',
      'Reflection completed',
      'Final teacher report submitted',
    ],
    teacher_report_prompts: [
      'Which group made the strongest progress?',
      'Who had the strongest project impact?',
      'Who led responsibly?',
      'What should the AI help review next for Class 5?',
    ],
    next_day_prep: 'Use the completion report to plan review, support, or the next Class 5 project.',
  },
];

roadmapDays.forEach((day) => {
  day.section_number = day.day_number;
  day.week_number = day.day_number;
  day.month_number = Math.ceil(day.day_number / 4);
  day.section_label = `Month ${day.month_number}, Week ${day.week_number}, Section ${day.section_number}`;
});

const seed = async () => {
  await createSchoolTables();
  await createLearningTables();

  const availableAssets = assets.filter((asset) => fs.existsSync(asset.file_path));
  const missingAssets = assets.filter((asset) => !fs.existsSync(asset.file_path));
  if (missingAssets.length > 0) {
    console.warn(
      `Human Energy Field source PDFs not found, seeding curriculum without PDF asset records: `
      + `${missingAssets.map((asset) => asset.file_path).join(', ')}. `
      + 'Set HUMAN_ENERGY_FIELD_SOURCE_DIR to attach them later.'
    );
  }

  const project = await createLearningProject({
    title: 'Human Energy Field: AI Particle Art',
    subject: 'AI, Computer Vision, Creative Coding',
    grade: 'Class 5',
    class_name: 'Class 5',
    description: 'A Credent Class 5 project where students turn AI human-detection data into real-time particle art using XIAO ESP32S3 Sense, ESP32C3, SenseCraft AI, Arduino IDE, and Processing.',
    learning_goals: 'Understand how AI detects people, explain the eye-bridge-art system layers, identify the hardware and software tools, follow safe UART wiring checks, and describe how position and size data becomes creative particle visuals.',
    difficulty_level: 'class-5-guided',
    duration_months: 4,
    expected_section_count: 16,
    audience_scope: 'student_teacher',
    teacher_readiness_required: true,
    code_explanation_required: true,
    source_doc_name: 'Human Energy Field Project Guide.pdf; AI Human Energy Field Project.pdf',
    created_by_role: 'system',
  });

  const createdChunks = await replaceLearningContentChunks(project.id, chunks);
  const createdAssets = await replaceLearningProjectAssets(project.id, availableAssets);
  const createdRoadmapDays = await replaceLearningRoadmapDays(project.id, roadmapDays);

  return {
    project,
    verification: 'The two PDFs were treated as one Human Energy Field project and adapted for Class 5 assessment.',
    chunk_count: createdChunks.length,
    asset_count: createdAssets.length,
    roadmap_day_count: createdRoadmapDays.length,
  };
};

seed()
  .then((result) => {
    console.log('Human Energy Field Class 5 learning project seeded');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('Failed to seed Human Energy Field Class 5 learning project:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
