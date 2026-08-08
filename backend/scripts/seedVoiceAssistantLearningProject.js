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

const projectAssetPath = process.env.VOICE_ASSISTANT_ASSET_DIR
  || path.resolve(__dirname, '../assets/voice-assistant');

const chunks = [
  {
    step_number: 1,
    title: 'Project overview: Voice-Controlled AI Assistant',
    source_type: 'lesson',
    audience: 'both',
    tags: ['overview', 'voice', 'assistant', 'esp32', 'credent-firmware', 'mcp'],
    content: [
      'This Class 6 project teaches learners to build a voice-controlled AI assistant using the ESP32-S3 AI Cam, the Credent Mino firmware, and MCP.',
      'The assistant can listen to voice commands and use approved tools to do actions such as turn lights on or off, read sensor values, create meetings, or check meeting details.',
      'The goal is not to copy answers from AI. The goal is to understand the hardware, the wiring, the software bridge, and the safe command flow step by step.',
    ].join(' '),
  },
  {
    step_number: 2,
    title: 'Teacher readiness: typing and keyboard check',
    source_type: 'teacher_rule',
    audience: 'teacher',
    tags: ['teacher', 'readiness', 'typing', 'keyboard'],
    content: [
      'Before a teacher starts guiding this project, the AI assistant must ask whether the teacher is a great typer and whether the teacher knows the keyboard letters well enough to guide learners.',
      'This check is only for teachers. Students should not be blocked by this readiness question; they should be allowed to ask for help directly.',
      'If the teacher is not confident with typing or keyboard letters, the assistant should slow down, use shorter steps, and avoid rushing code entry.',
    ].join(' '),
  },
  {
    step_number: 3,
    title: 'What MCP means in this project',
    source_type: 'lesson',
    audience: 'both',
    tags: ['mcp', 'tools', 'bridge', 'json', 'safe-control'],
    content: [
      'MCP means Model Context Protocol. In this project, MCP is the bridge between the AI brain in the cloud and the ESP32 device.',
      'A simple way to explain it to children is: MCP is like USB for AI. It gives AI a known, safe way to connect with tools and hardware.',
      'The AI should not randomly control hardware. It should use predefined MCP tools with clear JSON inputs and outputs so every command is predictable.',
    ].join(' '),
  },
  {
    step_number: 4,
    title: 'Main components learners will use',
    source_type: 'lesson',
    audience: 'both',
    tags: ['components', 'parts', 'battery', 'speaker', 'enclosure'],
    content: [
      'The main parts are a DFRobot ESP32-S3 AI Cam, an IP5306 Type-C BMS charging/power board, a Li-Po battery, a mini switch, a speaker, screws, and the enclosure parts.',
      'The enclosure assets for this project are Cover.stl, Housing.stl, and Mino.stl.',
      'Students should identify each component first before wiring or coding, because knowing the part names makes debugging much easier.',
    ].join(' '),
  },
  {
    step_number: 5,
    title: 'Power wiring: battery, BMS, and mini switch',
    source_type: 'hardware',
    audience: 'both',
    tags: ['battery', 'bms', 'switch', 'wiring', 'power'],
    content: [
      'The Li-Po battery connects to the BMS input: red wire to positive and black wire to negative.',
      'The red output wire from the BMS should pass through the mini switch in series before going to the ESP32 positive input.',
      'The black output wire goes straight from the BMS negative output to the ESP32 negative input.',
      'This lets the switch control power safely while the BMS handles charging and battery protection.',
    ].join(' '),
  },
  {
    step_number: 6,
    title: 'ESP32 power soldering checks',
    source_type: 'hardware',
    audience: 'both',
    tags: ['esp32', 'soldering', 'power', 'pw', 'check'],
    content: [
      'Power wires should be soldered to the ESP32 power pads, often marked PW+ and PW-.',
      'Before switching on, learners should check polarity: red to positive, black to negative.',
      'A teacher should ask students to point to each wire and explain where it goes before power is applied.',
    ].join(' '),
  },
  {
    step_number: 7,
    title: 'Speaker wiring with MAX98357A amplifier',
    source_type: 'hardware',
    audience: 'both',
    tags: ['speaker', 'amplifier', 'max98357a', 'i2s', 'wiring'],
    content: [
      'The speaker should not be connected directly to the ESP32.',
      'Use the MAX98357A amplifier. Connect ESP32 5V and GND to amplifier VIN and GND.',
      'Connect the I2S signal pins from the ESP32 to the amplifier pins: BCLK, LRC, and DIN.',
      'The physical speaker wires go to SPK+ and SPK- on the amplifier.',
    ].join(' '),
  },
  {
    step_number: 8,
    title: 'Housing and final assembly',
    source_type: 'prototype',
    audience: 'both',
    tags: ['housing', 'cover', 'mino', 'assembly', 'stl'],
    content: [
      'The housing includes space for the board, speaker, BMS, switch, battery, and cover.',
      'Mount the ESP32 board on the standoffs with M2 screws. Place the BMS upside down so the Type-C charging port lines up with the cutout.',
      'Fix the mini switch in its opening with a small amount of quick glue. Hold the battery with double-sided tape.',
      'Close the enclosure with the cover and the three screws only after checking that no wire is pinched.',
    ].join(' '),
  },
  {
    step_number: 9,
    title: 'Wi-Fi setup and Credent device pairing',
    source_type: 'setup',
    audience: 'both',
    tags: ['credent-firmware', 'wifi', 'pairing', 'console', 'configuration'],
    content: [
      'After powering on Mino, connect to the "Credent-Mino" Wi-Fi hotspot from a phone or computer.',
      'A Wi-Fi setup page opens in your browser (go to 192.168.1.4 if it does not); enter your home or school Wi-Fi details so Mino can get online.',
      'The device then shows and speaks a six-digit pairing code. Enter that code on the Credent pairing page at credentgh.com/esp-pair.html to add the device — no account needed.',
      'Students should not skip the pairing step: once paired, Mino automatically pulls its live configuration (the Credent manifest) from the server, which controls how the assistant behaves.',
    ].join(' '),
  },
  {
    step_number: 10,
    title: 'Code and MCP explanation rule',
    source_type: 'code_rule',
    audience: 'both',
    tags: ['code', 'explain', 'json', 'mcp', 'step-by-step'],
    content: [
      'Every code example must be explained before learners use it.',
      'The AI assistant should first explain what the code or MCP tool is for, then explain the important parts line by line, then give one small next action.',
      'For MCP JSON, explain the tool name, each input field, what the ESP32 should do, and what response is expected.',
      'The assistant should not give a final answer without teaching the concept behind the code.',
    ].join(' '),
  },

  // ─── Board-specific reference chunks ────────────────────────────────────────

  {
    step_number: 11,
    title: 'Board-specific pin assignments: I2S audio output (MAX98357A)',
    source_type: 'reference',
    audience: 'both',
    tags: ['gpio', 'i2s', 'pins', 'bclk', 'lrc', 'dout', 'max98357a'],
    content: [
      'On the DFRobot ESP32-S3 AI Cam, the I2S output pins for the MAX98357A amplifier are fixed by the board design.',
      'BCLK (bit clock) connects to GPIO 45.',
      'LRC (left-right clock, also called LRCLK or WS) connects to GPIO 46.',
      'DOUT (data out to amplifier DIN) connects to GPIO 42.',
      'In Arduino code this is written as: audio.setPinout(45, 46, 42) where the order is BCLK, LRC, DOUT.',
      'These pin numbers must not be changed. They are hardwired on the board to the onboard amplifier circuit.',
    ].join(' '),
  },
  {
    step_number: 12,
    title: 'Board-specific pin assignments: PDM microphone',
    source_type: 'reference',
    audience: 'both',
    tags: ['gpio', 'pdm', 'microphone', 'mic', 'pins', 'clock', 'data'],
    content: [
      'The onboard PDM microphone on the DFRobot ESP32-S3 AI Cam uses two dedicated pins.',
      'MIC_CLK (microphone clock) is GPIO 38.',
      'MIC_DATA (microphone data) is GPIO 39.',
      'In Arduino code the setup is: i2s.setPinsPdmRx(38, 39) where the order is clock then data.',
      'This microphone is what the Credent firmware uses to capture voice commands, so these pins must be initialized correctly before voice interaction will work.',
    ].join(' '),
  },
  {
    step_number: 13,
    title: 'Board-specific pin assignments: onboard LED and button',
    source_type: 'reference',
    audience: 'both',
    tags: ['gpio', 'led', 'button', 'pin', 'indicator'],
    content: [
      'The onboard LED on the DFRobot ESP32-S3 AI Cam is connected to GPIO 3.',
      'To turn the LED on in code use: digitalWrite(3, HIGH). To turn it off use: digitalWrite(3, LOW).',
      'GPIO 0 is the onboard boot button, which can also be used as a push button input in your project.',
      'Teachers can use the LED as a simple visual indicator to show students when the board is recording or processing.',
    ].join(' '),
  },
  {
    step_number: 14,
    title: 'Board-specific facts: power, Gravity port, and USB',
    source_type: 'reference',
    audience: 'both',
    tags: ['power', 'gravity', 'uart', 'usb', 'type-c', 'bms', 'charging'],
    content: [
      'The DFRobot ESP32-S3 AI Cam is programmed and powered via its USB Type-C port.',
      'In Arduino IDE the board should be selected as ESP32S3 Dev Module, not any other variant.',
      'The board has a Gravity 4-pin interface exposing 3.3V, GND, GPIO44 (RX), and GPIO43 (TX) for connecting external sensors.',
      'Important: On board version V1.1 the first pin of the Gravity interface is a 3.3V OUTPUT, not an input. Do not connect 5V to this pin or you will damage the board.',
      'When the BMS external power circuit is used, the red wire from the BMS output goes to the board positive power pad and the black wire goes to the negative pad, separate from the USB port.',
    ].join(' '),
  },
  {
    step_number: 15,
    title: 'MCP tool JSON example: toggle a GPIO output',
    source_type: 'reference',
    audience: 'both',
    tags: ['mcp', 'json', 'tool', 'example', 'gpio', 'output', 'command'],
    content: [
      'A basic MCP tool command for controlling a GPIO output looks like this: { "tool": "set_gpio", "input": { "pin": 3, "state": "HIGH" } }.',
      'The tool name tells the ESP32 which action to run. The input object gives the exact values it needs.',
      'Pin is the GPIO number. State is either HIGH to turn on or LOW to turn off.',
      'The expected response from the ESP32 is: { "result": "ok", "pin": 3, "state": "HIGH" }.',
      'If the response is missing or shows an error, the teacher should first check that the board is powered, connected to Wi-Fi, and paired with Credent before assuming the code is wrong.',
    ].join(' '),
  },
  {
    step_number: 16,
    title: 'Common failure points and how to diagnose them',
    source_type: 'reference',
    audience: 'teacher',
    tags: ['troubleshooting', 'debug', 'wifi', 'pairing', 'audio', 'power', 'failure'],
    content: [
      'Power failure: if the board does not turn on, check that the mini switch is in the ON position and that the red wire passes through the switch before reaching PW+.',
      'No audio output: if the speaker is silent, confirm GPIO 45, 46, and 42 are wired to the correct amplifier pins and that the amplifier VIN is connected to the ESP32 5V pin, not 3.3V.',
      'Wi-Fi setup failure: if the board does not broadcast the "Credent-Mino" hotspot after power on, press the reset button once and wait 10 seconds before trying again.',
      'Pairing code not appearing: open the serial monitor at baud rate 115200 after connecting USB. The six-digit code is printed there if the browser at 192.168.1.4 does not show it.',
      'MCP tool not responding: confirm the device is paired and has pulled its Credent configuration, and that the tool name in the JSON matches exactly what the configuration expects, including letter case.',
    ].join(' '),
  },
];

const assets = [
  {
    title: 'Voice assistant cover STL',
    file_name: 'Cover.stl',
    file_path: `${projectAssetPath}/Cover.stl`,
    asset_type: 'stl',
    mime_type: 'model/stl',
  },
  {
    title: 'Voice assistant housing STL',
    file_name: 'Housing.stl',
    file_path: `${projectAssetPath}/Housing.stl`,
    asset_type: 'stl',
    mime_type: 'model/stl',
  },
  {
    title: 'Mino voice assistant STL',
    file_name: 'Mino.stl',
    file_path: `${projectAssetPath}/Mino.stl`,
    asset_type: 'stl',
    mime_type: 'model/stl',
  },
];

const roadmapDays = [
  {
    day_number: 1,
    title: 'Project launch, AI safety, MCP story, and parts identification',
    teacher_goal: 'Introduce the voice assistant project, check teacher keyboard readiness, explain MCP in child-friendly language, and help learners identify every physical component.',
    student_goal: 'Students can explain what the assistant will do, describe MCP as a safe bridge, and name the main parts before touching wires.',
    activities: [
      'Ask the teacher readiness questions before instruction starts.',
      'Show the finished idea of the Mino voice assistant and explain what it can control.',
      'Explain MCP as a safe bridge between AI and hardware.',
      'Let learners identify ESP32-S3 AI Cam, BMS, battery, switch, speaker, screws, cover, housing, and Mino enclosure.',
      'Ask each group to explain one part back to the class.',
    ],
    materials: ['Class 6 lesson note', 'ESP32-S3 AI Cam', 'BMS board', 'battery', 'switch', 'speaker', 'Cover.stl', 'Housing.stl', 'Mino.stl'],
    code_explanation_focus: 'No final code yet. Explain that future code/MCP tools will be broken into purpose, input, action, and result.',
    end_of_day_checklist: [
      'Teacher readiness answer saved',
      'Students can describe MCP as a safe bridge',
      'Students can name the main components',
      'No wiring was done before safety explanation',
    ],
    teacher_report_prompts: [
      'Could students explain MCP in their own words?',
      'Which components confused learners?',
      'Did the teacher need slower typing or keyboard support?',
      'What needs to be reviewed before wiring begins?',
    ],
    next_day_prep: 'Prepare batteries, BMS boards, mini switches, red/black wires, and a polarity safety demonstration.',
  },
  {
    day_number: 2,
    title: 'Power path: battery, BMS, switch, and ESP32 polarity',
    teacher_goal: 'Guide learners through the power path slowly and safely without rushing soldering.',
    student_goal: 'Students can trace red and black wires from battery to BMS, switch, and ESP32 power pads.',
    activities: [
      'Review Day 1 parts and MCP meaning.',
      'Draw the battery-to-BMS-to-switch-to-ESP32 power path.',
      'Explain red as positive and black as negative.',
      'Demonstrate the mini switch in series with the red output wire.',
      'Have each group point to PW+ and PW- before applying power.',
    ],
    materials: ['Battery', 'IP5306 Type-C BMS', 'mini switch', 'red and black wires', 'ESP32-S3 AI Cam'],
    code_explanation_focus: 'Connect hardware action to future software control: code can only work when the power path is correct.',
    end_of_day_checklist: [
      'Students can trace the red positive wire path',
      'Students can trace the black negative wire path',
      'Students know the switch controls the red output wire',
      'Polarity check completed before power-on',
    ],
    teacher_report_prompts: [
      'Which groups traced the power path correctly?',
      'Were there polarity mistakes?',
      'Was any part missing or damaged?',
      'Should Day 3 start with a power review?',
    ],
    next_day_prep: 'Prepare MAX98357A amplifier modules, speakers, and a simple I2S pin explanation.',
  },
  {
    day_number: 3,
    title: 'Speaker output, amplifier wiring, and enclosure dry fit',
    teacher_goal: 'Teach why the speaker needs an amplifier and guide groups through safe speaker/enclosure planning.',
    student_goal: 'Students can explain why the speaker does not connect directly to ESP32 and identify BCLK, LRC, DIN, SPK+, and SPK-.',
    activities: [
      'Review power safety before adding audio.',
      'Explain why the MAX98357A amplifier is needed.',
      'Map ESP32 5V/GND to amplifier VIN/GND.',
      'Explain I2S signal pins: BCLK (GPIO 45), LRC (GPIO 46), and DOUT (GPIO 42).',
      'Dry-fit board, speaker, BMS, switch, battery, and cover in the housing.',
    ],
    materials: ['MAX98357A amplifier', 'speaker', 'ESP32-S3 AI Cam', 'Housing.stl print', 'Cover.stl print', 'Mino.stl print'],
    code_explanation_focus: 'Explain that audio code sends digital sound data through I2S pins before the amplifier drives the speaker.',
    end_of_day_checklist: [
      'Students know speaker cannot connect directly to ESP32',
      'Students can identify amplifier power pins',
      'Students can identify BCLK (GPIO 45), LRC (GPIO 46), DOUT (GPIO 42), SPK+ and SPK-',
      'Enclosure dry fit completed without pinched wires',
    ],
    teacher_report_prompts: [
      'Could students explain why the amplifier is needed?',
      'Which I2S pin names need review?',
      'Did the enclosure fit all components?',
      'What should be fixed before Wi-Fi setup?',
    ],
    next_day_prep: 'Prepare phone/computer Wi-Fi access, "Credent-Mino" hotspot instructions, and the Credent pairing page (credentgh.com/esp-pair.html).',
  },
  {
    day_number: 4,
    title: 'Device setup, Credent pairing, and MCP tool/code explanation',
    teacher_goal: 'Connect the device to Wi-Fi, pair it with Credent, and explain MCP tools before learners use any code.',
    student_goal: 'Students can follow the pairing flow and explain what a tool command is supposed to do before running it.',
    activities: [
      'Power on Mino and connect to the "Credent-Mino" hotspot.',
      'Open 192.168.1.4 and enter Wi-Fi details.',
      'Collect the six-digit pairing code.',
      'Enter the code on the Credent pairing page (credentgh.com/esp-pair.html) to add the device.',
      'Explain one MCP JSON/tool example by purpose, input fields, hardware action, and expected response.',
    ],
    materials: ['Mino device', 'phone or computer', 'Wi-Fi details', 'Credent pairing page (credentgh.com/esp-pair.html)', 'project code/MCP example'],
    code_explanation_focus: 'Every tool or JSON example must be explained line by line: tool name, input fields, device action, and expected output.',
    end_of_day_checklist: [
      'Device connects to the "Credent-Mino" hotspot',
      'Wi-Fi credentials entered through 192.168.1.4',
      'Pairing code received',
      'Device paired on the Credent pairing page',
      'Students can explain one MCP tool before using it',
    ],
    teacher_report_prompts: [
      'Which groups paired successfully?',
      'Which groups failed Wi-Fi or pairing?',
      'Could students explain the MCP tool fields?',
      'What code/tool explanation needs to be repeated?',
    ],
    next_day_prep: 'Prepare final assembly tools, demo checklist, troubleshooting notes, and learner reflection questions.',
  },
  {
    day_number: 5,
    title: 'First assembly checkpoint, demo attempt, and troubleshooting',
    teacher_goal: 'Help groups close the enclosure when ready, try the first demo, and record what needs more work before the project continues.',
    student_goal: 'Students can attempt a simple demo, explain what worked, and describe what still needs fixing.',
    activities: [
      'Review power, speaker, enclosure, Wi-Fi, and MCP flow.',
      'Close the enclosure only after checking wire clearance.',
      'Run a short voice assistant demo.',
      'Troubleshoot one issue at a time using the project checklist.',
      'Ask each group to explain the full flow from voice command to hardware response.',
    ],
    materials: ['Assembled Mino device', 'cover screws', 'demo commands', 'troubleshooting checklist', 'teacher final report'],
    code_explanation_focus: 'If any code or MCP issue appears, explain the failing line/tool field first, then try one fix.',
    end_of_day_checklist: [
      'Enclosure closed with no pinched wires',
      'Assistant demo completed or issue documented',
      'Students can explain voice command to MCP to ESP32 action',
      'Teacher section report submitted',
    ],
    teacher_report_prompts: [
      'Which groups completed the demo?',
      'Which groups need another troubleshooting session?',
      'What did students understand best?',
      'What should the next troubleshooting section focus on?',
    ],
    next_day_prep: 'Use the report to plan the next troubleshooting and improvement section.',
  },
];

roadmapDays.push(
  {
    day_number: 6,
    title: 'Troubleshooting power, audio, and pairing issues',
    teacher_goal: 'Use group reports to fix one problem at a time and teach students how to debug safely.',
    student_goal: 'Students can describe the problem, test one cause, and explain the result.',
    activities: [
      'Review group reports from the first demo checkpoint.',
      'Separate problems into power, audio, Wi-Fi, pairing, and MCP/tool categories.',
      'Let each group test only one change before retesting.',
      'Record which student made the best debugging impact and assign the next section lead.',
    ],
    materials: ['Troubleshooting checklist', 'multimeter if available', 'assembled Mino device', 'teacher group reports'],
    code_explanation_focus: 'If code appears in troubleshooting, explain the suspected line or tool field before changing it.',
    end_of_day_checklist: [
      'Each group identified one main issue',
      'Each group tested one safe fix',
      'Best impact student recorded',
      'Next section lead assigned',
    ],
    teacher_report_prompts: [
      'Which issue affected each group?',
      'Who made the strongest debugging impact?',
      'Who should lead the next section?',
      'What needs review before deeper MCP work?',
    ],
    next_day_prep: 'Prepare a simple MCP tool command and a line-by-line explanation format.',
  },
  {
    day_number: 7,
    title: 'MCP tool behavior and command safety',
    teacher_goal: 'Teach learners how one MCP tool receives inputs and produces a safe hardware action.',
    student_goal: 'Students can explain tool name, input, hardware action, and expected response.',
    activities: [
      'Review what MCP means using the project device.',
      'Show one tool command and explain every field.',
      'Ask groups to predict what the hardware should do before running anything.',
      'Record impact and assign lead based on explanation quality.',
    ],
    materials: ['MCP example', 'project note', 'Mino device'],
    code_explanation_focus: 'Break the MCP tool into purpose, inputs, action, and expected output.',
    end_of_day_checklist: [
      'Students can explain one MCP tool field by field',
      'Groups predicted action before testing',
      'Best explainer recorded',
      'Next section lead assigned',
    ],
    teacher_report_prompts: [
      'Could students explain the MCP fields?',
      'Which group predicted the action correctly?',
      'Who should lead the next tool explanation?',
    ],
    next_day_prep: 'Prepare a controlled voice command practice and safety reminder.',
  },
  {
    day_number: 8,
    title: 'Voice command practice and response checking',
    teacher_goal: 'Help groups practice voice commands and compare expected versus actual responses.',
    student_goal: 'Students can say a command clearly, observe the result, and explain whether it matched the expected action.',
    activities: [
      'Review the tool/action expectation before voice testing.',
      'Have groups test short voice commands.',
      'Compare expected result with actual result.',
      'Record strongest impact and next lead for each group.',
    ],
    materials: ['Mino device', 'demo commands', 'teacher observation sheet'],
    code_explanation_focus: 'Connect voice command intent to the MCP tool that performs the action.',
    end_of_day_checklist: [
      'Each group tested at least one voice command',
      'Expected versus actual result recorded',
      'Best impact student recorded',
      'Next section lead assigned',
    ],
    teacher_report_prompts: [
      'Which commands worked?',
      'Which commands failed or confused the assistant?',
      'Who helped the group understand the result?',
    ],
    next_day_prep: 'Prepare a mini-presentation template for groups to explain their build.',
  },
  {
    day_number: 9,
    title: 'Group explanation practice and peer teaching',
    teacher_goal: 'Shift leadership to students by having group leads explain one part of the project.',
    student_goal: 'Students can teach peers one part of hardware, MCP, or setup using simple language.',
    activities: [
      'Let the assigned lead explain the group progress.',
      'Ask another member to explain a different part.',
      'Have peers ask one question.',
      'Update impact and lead records based on teamwork and clarity.',
    ],
    materials: ['Project parts', 'roadmap checklist', 'group progress notes'],
    code_explanation_focus: 'Students explain code/tool ideas in plain language before technical words.',
    end_of_day_checklist: [
      'Each group lead explained one section',
      'At least one peer question answered',
      'Leadership rotation recorded',
      'Teacher group update submitted',
    ],
    teacher_report_prompts: [
      'Who explained most clearly?',
      'Who helped another student understand?',
      'Who should lead the next build improvement?',
    ],
    next_day_prep: 'Prepare improvement tasks based on each group report.',
  },
  {
    day_number: 10,
    title: 'Build improvement and enclosure quality',
    teacher_goal: 'Guide groups to improve wire management, enclosure fit, and demo reliability.',
    student_goal: 'Students can improve the build safely and explain why the improvement matters.',
    activities: [
      'Review each group report and choose one improvement.',
      'Check for pinched wires, loose boards, or weak speaker placement.',
      'Retest after the improvement.',
      'Record impact and next lead.',
    ],
    materials: ['Enclosure parts', 'screws', 'tape or glue where appropriate', 'checklist'],
    code_explanation_focus: 'Explain that physical reliability affects software/demo reliability.',
    end_of_day_checklist: [
      'Each group chose one improvement',
      'Wire clearance checked',
      'Retest completed',
      'Impact and lead update submitted',
    ],
    teacher_report_prompts: [
      'What did the group improve?',
      'Did reliability improve after retest?',
      'Who led the improvement responsibly?',
    ],
    next_day_prep: 'Prepare a controlled demo script for testing consistency.',
  },
  {
    day_number: 11,
    title: 'Controlled demo script and repeated testing',
    teacher_goal: 'Make demos repeatable by using the same command and observation steps.',
    student_goal: 'Students can run the same demo more than once and compare results.',
    activities: [
      'Create a short demo script with the class.',
      'Run the same command twice.',
      'Record whether the result was consistent.',
      'Assign lead based on careful testing and record keeping.',
    ],
    materials: ['Demo script', 'Mino device', 'group test log'],
    code_explanation_focus: 'Explain why repeated testing helps find real bugs instead of guessing.',
    end_of_day_checklist: [
      'Demo script created',
      'Repeated test completed',
      'Results recorded',
      'Next lead assigned',
    ],
    teacher_report_prompts: [
      'Were results consistent?',
      'Who kept the clearest test record?',
      'What should be retested next?',
    ],
    next_day_prep: 'Prepare a student reflection prompt about AI safety and hardware control.',
  },
  {
    day_number: 12,
    title: 'AI safety reflection and responsible control',
    teacher_goal: 'Connect the technical project to responsible AI behavior and safe hardware control.',
    student_goal: 'Students can explain why AI should only use predefined safe tools.',
    activities: [
      'Discuss why the assistant should not control hardware randomly.',
      'Review MCP as safe predefined tools.',
      'Ask groups to write one safety rule.',
      'Record impact based on thoughtful explanation and leadership.',
    ],
    materials: ['Safety discussion prompt', 'MCP explanation', 'project notes'],
    code_explanation_focus: 'Explain that code/tools must have limits, inputs, and expected outputs.',
    end_of_day_checklist: [
      'Each group wrote one AI safety rule',
      'Students connected MCP to safety',
      'Impact student recorded',
      'Next lead assigned',
    ],
    teacher_report_prompts: [
      'Which safety rule was strongest?',
      'Who explained responsible AI clearly?',
      'What misconception needs review?',
    ],
    next_day_prep: 'Prepare final demo improvement tasks for Month 4.',
  },
  {
    day_number: 13,
    title: 'Final demo preparation and role assignment',
    teacher_goal: 'Assign presentation roles and help each group prepare a reliable final demo.',
    student_goal: 'Students know their demo role: builder, speaker, tester, explainer, or lead.',
    activities: [
      'Review each group project update history.',
      'Assign roles based on impact and growth.',
      'Practice the final demo flow.',
      'Record lead and role notes.',
    ],
    materials: ['Group update history', 'demo checklist', 'assembled devices'],
    code_explanation_focus: 'Each group must explain one code/tool idea during the demo.',
    end_of_day_checklist: [
      'Final demo roles assigned',
      'Demo flow practiced',
      'Lead confirmed',
      'Teacher update submitted',
    ],
    teacher_report_prompts: [
      'Who is final lead for each group?',
      'Which group needs extra help?',
      'Which explanation should each group prepare?',
    ],
    next_day_prep: 'Prepare final testing and peer feedback forms.',
  },
  {
    day_number: 14,
    title: 'Final testing and peer feedback',
    teacher_goal: 'Let groups test final demos and receive peer feedback before final presentation.',
    student_goal: 'Students can give and receive useful feedback about the project.',
    activities: [
      'Run a practice final demo.',
      'Let another group give one helpful feedback point.',
      'Fix one issue based on feedback.',
      'Update impact and final lead if needed.',
    ],
    materials: ['Peer feedback form', 'demo script', 'assembled devices'],
    code_explanation_focus: 'Feedback should include whether the code/tool explanation was understandable.',
    end_of_day_checklist: [
      'Practice demo completed',
      'Peer feedback received',
      'One improvement made',
      'Impact and lead update submitted',
    ],
    teacher_report_prompts: [
      'Which feedback helped most?',
      'Who responded well to feedback?',
      'Is the final lead still correct?',
    ],
    next_day_prep: 'Prepare final presentation order and final report template.',
  },
  {
    day_number: 15,
    title: 'Final presentation rehearsal and teacher assessment',
    teacher_goal: 'Assess readiness for final presentation and identify any last blockers.',
    student_goal: 'Students can rehearse the final presentation and explain their contribution.',
    activities: [
      'Run the final presentation rehearsal.',
      'Check hardware, voice command, MCP explanation, and teamwork.',
      'Teacher records final blockers.',
      'Confirm the final lead based on impact history.',
    ],
    materials: ['Assessment checklist', 'group update history', 'assembled devices'],
    code_explanation_focus: 'Every group must explain the code/tool behavior, not just show the result.',
    end_of_day_checklist: [
      'Presentation rehearsal completed',
      'Final blockers recorded',
      'Final lead confirmed',
      'Teacher assessment notes submitted',
    ],
    teacher_report_prompts: [
      'Which group is fully ready?',
      'Which group has blockers?',
      'Who showed the strongest long-term impact?',
    ],
    next_day_prep: 'Prepare final showcase, reflection, and project completion report.',
  },
  {
    day_number: 16,
    title: 'Final showcase, reflection, and project completion report',
    teacher_goal: 'Complete the 4-month project with final demos, learner reflection, and a teacher completion report.',
    student_goal: 'Students can demonstrate the assistant, explain the full workflow, and reflect on what they learned.',
    activities: [
      'Run final group demos.',
      'Ask each lead to explain the project workflow.',
      'Ask every member to share one thing they learned.',
      'Teacher submits final impact and lead report.',
    ],
    materials: ['Final demo checklist', 'reflection prompts', 'teacher completion report'],
    code_explanation_focus: 'Students explain voice command to MCP tool to ESP32 action in their own words.',
    end_of_day_checklist: [
      'Final demo completed or blocker documented',
      'Every group explained the workflow',
      'Final impact student recorded',
      'Final teacher completion report submitted',
    ],
    teacher_report_prompts: [
      'Which group made the strongest progress?',
      'Who had the strongest project impact?',
      'Who led responsibly?',
      'What should the next 4-month project build on?',
    ],
    next_day_prep: 'Use the completion report to decide review needs and the next Credent project path.',
  },
);

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
      `Voice assistant STL assets not found, seeding curriculum without STL asset records: `
      + `${missingAssets.map((asset) => asset.file_path).join(', ')}. `
      + 'Set VOICE_ASSISTANT_ASSET_DIR to attach them later.'
    );
  }

  const project = await createLearningProject({
    title: 'Voice-Controlled AI Assistant',
    subject: 'AI, Embedded Systems, Coding',
    grade: 'Class 6',
    class_name: 'Class 6',
    description: 'A Credent Class 6 project for building a voice-controlled assistant with ESP32-S3 AI Cam, the Credent Mino firmware, MCP, speaker output, battery power, and a 3D printed enclosure.',
    learning_goals: 'Understand MCP as a safe bridge for AI tools, identify hardware parts, wire the BMS/switch/speaker correctly, pair the device with Credent, and explain every code or MCP step before using it.',
    difficulty_level: 'intermediate',
    duration_months: 4,
    expected_section_count: 16,
    audience_scope: 'student_teacher',
    teacher_readiness_required: true,
    code_explanation_required: true,
    source_doc_name: 'Class 6.docx',
    created_by_role: 'system',
  });

  const createdChunks = await replaceLearningContentChunks(project.id, chunks);
  const createdAssets = await replaceLearningProjectAssets(project.id, availableAssets);
  const createdRoadmapDays = await replaceLearningRoadmapDays(project.id, roadmapDays);

  return {
    project,
    chunk_count: createdChunks.length,
    asset_count: createdAssets.length,
    roadmap_day_count: createdRoadmapDays.length,
  };
};

seed()
  .then((result) => {
    console.log('✅ Voice assistant learning project seeded');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('❌ Failed to seed voice assistant learning project:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
