const { body, query, validationResult } = require('express-validator');
const pool = require('../config/db');
const {
  getLearningProjects,
  getLearningProjectById,
  getLearningContentChunks,
  getLearningRoadmapDays,
  getLearningRoadmapDay,
  addLearningRoadmapDay,
  saveLearningGroupProjectUpdate,
  getLearningGroupProjectUpdates,
  getTeacherReadiness,
  saveTeacherReadiness,
  createAiInteraction,
  saveTeacherAiDailyReport,
  getTeacherAiDailyReports,
  getAiInteractionsForRequester,
} = require('../models/learningModel');
const { addGroupMessage } = require('../models/schoolModel');
const {
  canAccessProject,
  filterProjectsForUser,
  projectMatchesClass,
} = require('../services/projectAccessService');
const {
  TEACHER_READINESS_QUESTION,
  findRelevantChunks,
  buildControlledAnswer,
  buildRoadmapResponse,
  buildDayTeachingLesson,
  buildDailyReportGuidance,
} = require('../services/controlledAiTutorService');

const buildDefaultRoadmapDays = (project) => {
  const totalSections = Math.max(1, Number(project.expected_section_count) || 16);
  return Array.from({ length: totalSections }, (_, index) => {
    const dayNumber = index + 1;
    const sectionLabel = `Section ${dayNumber}`;
    const isFirstSection = dayNumber === 1;
    return {
      day_number: dayNumber,
      month_number: Math.floor(index / 4) + 1,
      week_number: (index % 4) + 1,
      section_number: dayNumber,
      section_label: sectionLabel,
      title: `${project.title} - ${sectionLabel}`,
      teacher_goal: isFirstSection
        ? `Start ${project.title} from zero: show the goal, explain what learners will build, and confirm the first setup or concept step.`
        : `Continue ${project.title} only from the last confirmed checkpoint, then guide learners through ${sectionLabel.toLowerCase()} one small action at a time.`,
      student_goal: isFirstSection
        ? 'Students can explain the project goal and complete the first tiny setup/concept checkpoint without assuming any finished code already exists.'
        : `Students understand and practice the next key idea for ${sectionLabel.toLowerCase()} after proving the previous foundation.`,
      activities: isFirstSection
        ? [
            'Show the project outcome or manual target so learners know where they are going',
            'Ask what learners already have installed, wired, opened, or understood',
            'Teach the first concept with a practical example before any copying',
            'Complete one tiny classroom action together and check understanding before moving on',
          ]
        : [
            'Review the latest saved teacher report or confirmed classroom checkpoint',
            'Name the next tiny concept/action and why it matters for the final project',
            'Model the action once, then let learners try it in pairs',
            'Close with a checkpoint that proves whether the class can continue or must revisit the foundation',
          ],
      materials: [
        project.source_doc_name || 'Approved project manual/target content',
        'Student devices or notebooks',
      ],
      code_explanation_focus: project.code_explanation_required
        ? 'Treat any finished code as the teacher manual/target. Explain the idea first, then create or inspect only the next small code block before students practice.'
        : 'Treat the project material as the teacher manual/target. Explain the practical step clearly before students practice.',
      end_of_day_checklist: [
        'Students completed or attempted the exact checkpoint for today',
        'Teacher recorded what was actually finished, not what the manual contains',
        'Support needs and the next unfinished foundation were noted for the next lesson',
      ],
      teacher_report_prompts: [
        'What did students complete today?',
        'What did students understand well?',
        'Where did students need support?',
        'What is the first unfinished foundation for the next lesson?',
      ],
      next_day_prep: `Prepare only the next unfinished step of ${project.title}; do not assume students have code, files, setup, or hardware ready unless today's report confirms it.`,
    };
  });
};

const ensureRoadmapDays = async (project) => {
  const existingDays = await getLearningRoadmapDays(project.id);
  if (existingDays.length > 0) return existingDays;

  const days = [];
  for (const day of buildDefaultRoadmapDays(project)) {
    days.push(await addLearningRoadmapDay(project.id, day));
  }
  return days;
};

const validateAskAi = [
  body('question').trim().notEmpty().withMessage('question is required'),
  body('project_id')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('project_id must be an integer'),
  body('group_id').optional().isInt().withMessage('group_id must be an integer'),
  body('help_request_id').optional().isInt().withMessage('help_request_id must be an integer'),
  body('teacher_readiness').optional().isObject().withMessage('teacher_readiness must be an object'),
  body('share_to_group').optional().isBoolean().withMessage('share_to_group must be a boolean'),
];

const validateRoadmapRequest = [
  query('project_id')
    .exists({ checkFalsy: true })
    .withMessage('project_id is required')
    .bail()
    .isInt()
    .withMessage('project_id must be an integer'),
];

const validateTeacherDailyReport = [
  body('project_id').notEmpty().isInt().withMessage('project_id must be an integer'),
  body('day_number').notEmpty().isInt({ min: 1 }).withMessage('day_number must be a positive integer'),
  body('completed_items').optional().isArray().withMessage('completed_items must be an array'),
  body('student_understanding').optional().trim(),
  body('challenges').optional().trim(),
  body('support_needed').optional().trim(),
  body('teacher_notes').optional().trim(),
];

const validateTeacherGroupProjectUpdate = [
  body('project_id').notEmpty().isInt().withMessage('project_id must be an integer'),
  body('group_id').notEmpty().isInt().withMessage('group_id must be an integer'),
  body('day_number').notEmpty().isInt({ min: 1 }).withMessage('day_number must be a positive integer'),
  body('section_number').optional().isInt({ min: 1 }).withMessage('section_number must be a positive integer'),
  body('impact_student_id').optional({ nullable: true }).isInt().withMessage('impact_student_id must be an integer'),
  body('lead_student_id').optional({ nullable: true }).isInt().withMessage('lead_student_id must be an integer'),
  body('completed_items').optional().isArray().withMessage('completed_items must be an array'),
  body('impact_summary').optional().trim(),
  body('group_progress').optional().trim(),
  body('next_actions').optional().trim(),
  body('teacher_notes').optional().trim(),
];

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

const askAi = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    const userRole = req.user.role;
    const allowedRoles = ['student', 'teacher', 'agent', 'admin'];
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'AI assistance is not available for this role' });
    }

    // A student asking about their own records/progress is answered straight
    // from their real scores + class standing (with encouragement) — this runs
    // BEFORE project resolution so it works even when no project is in scope.
    if (userRole === 'student') {
      const studentRecords = await buildStudentProgressAnswer(req.user, req.body.question);
      if (studentRecords) {
        const interaction = await createAiInteraction({
          project_id: null,
          group_id: req.body.group_id || null,
          help_request_id: null,
          requester_type: userRole,
          requester_id: req.user.id,
          audience: 'student',
          question: req.body.question,
          answer: studentRecords.answer,
          sources: studentRecords.sources,
          metadata: requestMetadata(req),
        });

        return res.status(200).json({
          message: 'Emrys AI response',
          requires_teacher_readiness: false,
          project: null,
          answer_text: studentRecords.answer,
          answer: studentRecords.answer,
          steps: studentRecords.steps,
          sources: studentRecords.sources,
          next_action: studentRecords.next_action,
          interaction,
          group_message: null,
          saved_group_message: null,
          policy: {
            syllabus_bound: false,
            in_scope: true,
            audience: 'student',
            data_source: 'progress_records',
          },
        });
      }
    }

    const project = await resolveProject(req.user, req.body.project_id, req.body.group_id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found or not available for this class' });
    }

    if (req.body.group_id) {
      const groupAccess = await assertGroupAccess({
        user: req.user,
        groupId: Number(req.body.group_id),
        helpRequestId: req.body.help_request_id ? Number(req.body.help_request_id) : null,
      });

      if (!groupAccess.allowed) {
        return res.status(groupAccess.status).json({ message: groupAccess.message });
      }

      const groupProjectMatch = await assertGroupMatchesProject({
        groupId: Number(req.body.group_id),
        project,
      });
      if (!groupProjectMatch.allowed) {
        return res.status(groupProjectMatch.status).json({ message: groupProjectMatch.message });
      }
    }

    let readiness = null;
    let readinessAnswer = null;

    if (userRole === 'teacher' && project.teacher_readiness_required) {
      readiness = await getTeacherReadiness(req.user.id, project.id);

      if (req.body.teacher_readiness) {
        readiness = await saveTeacherReadiness(req.user.id, project.id, {
          is_good_typer: Boolean(req.body.teacher_readiness.is_good_typer),
          knows_keyboard_letters: Boolean(req.body.teacher_readiness.knows_keyboard_letters),
          note: req.body.teacher_readiness.note || null,
        });
        readinessAnswer = JSON.stringify(req.body.teacher_readiness);
      }

      if (!readiness) {
        return res.status(200).json({
          requires_teacher_readiness: true,
          message: TEACHER_READINESS_QUESTION,
          project: minimalProject(project),
        });
      }
    }

    const audience = resolveAudience(userRole);
    const allChunks = await getLearningContentChunks(project.id, audience);
    const relevantChunks = findRelevantChunks(allChunks, req.body.question, 4);

    const recentHistory = await getAiInteractionsForRequester({
      requesterType: userRole,
      requesterId: req.user.id,
      projectId: project.id,
      limit: 6,
    });

    const progressEvidence = await getProgressEvidenceForAi({
      user: req.user,
      project,
      groupId: req.body.group_id ? Number(req.body.group_id) : null,
    });

    const answer = await buildControlledAnswer({
      project,
      question: req.body.question,
      chunks: relevantChunks,
      allChunks,
      audience,
      readiness,
      conversationHistory: recentHistory,
      progressEvidence,
    });

    const interaction = await createAiInteraction({
      project_id: project.id,
      group_id: req.body.group_id || null,
      help_request_id: req.body.help_request_id || null,
      requester_type: userRole,
      requester_id: req.user.id,
      audience,
      question: req.body.question,
      answer: answer.answer,
      sources: answer.sources,
      readiness_answer: readinessAnswer,
      metadata: requestMetadata(req),
    });

    // Emrys deliberately does NOT post its answer into the group chat. The
    // tutor is a 1:1 surface — answers live in the AI conversation history,
    // not the group thread. The previous code wrote `sender_type='ai'` rows
    // into `group_messages` when callers set share_to_group=true (or passed
    // a help_request_id). That leaked Emrys into normal group conversations,
    // which is what we're now closing. `group_message` stays null in the
    // response so existing client code that reads it keeps working.
    const groupMessage = null;

    res.status(200).json({
      message: 'AI tutor response generated from approved Credent content',
      requires_teacher_readiness: false,
      project: minimalProject(project),
      answer_text: answer.answer,
      answer: answer.answer,
      steps: answer.steps,
      sources: answer.sources,
      next_action: answer.next_action,
      interaction,
      group_message: groupMessage,
      saved_group_message: groupMessage,
      policy: {
        syllabus_bound: true,
        uses_teacher_intelligence: true,
        uses_model_knowledge_within_syllabus: true,
        project_is_textbook_reference: true,
        code_explanation_required: Boolean(project.code_explanation_required),
        in_scope: Boolean(answer.in_scope),
        audience,
      },
    });
  } catch (error) {
    console.error('Ask AI error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Agent General AI Ask — no project_id required ───────────────
const validateAgentAskAi = [
  body('question').trim().notEmpty().withMessage('question is required'),
];

const validateAiHistoryRequest = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];

const agentAskAi = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!['agent', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'This endpoint is for agents and admins only' });
    }

    const { question } = req.body;

    const progressAnswer = await buildAgentProgressAnswer(question);
    if (progressAnswer) {
      const interaction = await createAiInteraction({
        project_id: progressAnswer.project_id || null,
        group_id: progressAnswer.group_id || null,
        help_request_id: null,
        requester_type: req.user.role,
        requester_id: req.user.id,
        audience: 'agent',
        question,
        answer: progressAnswer.answer,
        sources: progressAnswer.sources,
        metadata: requestMetadata(req),
      });

      return res.status(200).json({
        message: 'Emrys AI response',
        answer_text: progressAnswer.answer,
        answer: progressAnswer.answer,
        steps: progressAnswer.steps,
        sources: progressAnswer.sources,
        next_action: progressAnswer.next_action,
        project: progressAnswer.project || null,
        interaction,
        policy: {
          syllabus_bound: true,
          uses_teacher_intelligence: true,
          uses_model_knowledge_within_syllabus: true,
          project_is_textbook_reference: true,
          in_scope: true,
          audience: 'agent',
          data_source: 'progress_records',
        },
      });
    }

    const allProjects = await getLearningProjects();

    if (!allProjects.length) {
      const answerText = [
        'I cannot find any active learning projects yet.',
        'Seed the learning projects first, then ask me again and I can use the project lessons, source code, and classroom progress records.',
      ].join('\n\n');

      const interaction = await createAiInteraction({
        project_id: null,
        group_id: null,
        help_request_id: null,
        requester_type: req.user.role,
        requester_id: req.user.id,
        audience: 'agent',
        question,
        answer: answerText,
        sources: [],
        metadata: requestMetadata(req),
      });

      return res.status(200).json({
        message: 'Emrys AI response',
        answer_text: answerText,
        answer: answerText,
        steps: [],
        sources: [],
        next_action: 'Run the learning project seed/import scripts against the production database.',
        project: null,
        interaction,
        policy: {
          syllabus_bound: false,
          uses_teacher_intelligence: false,
          uses_model_knowledge_within_syllabus: false,
          project_is_textbook_reference: false,
          in_scope: false,
          audience: 'agent',
          data_source: 'no_active_projects',
        },
      });
    }

    let bestRelevantChunks = [];
    let bestAllChunks = [];
    let bestProject = allProjects[0] || null;
    let bestScore = -1;

    for (const project of allProjects) {
      const projectChunks = await getLearningContentChunks(project.id, 'teacher');
      const relevant = findRelevantChunks(projectChunks, question, 4);
      if (relevant.length > bestScore) {
        bestScore = relevant.length;
        bestRelevantChunks = relevant;
        bestAllChunks = projectChunks;
        bestProject = project;
      }
    }

    const agentHistory = await getAiInteractionsForRequester({
      requesterType: req.user.role,
      requesterId: req.user.id,
      projectId: bestProject?.id || null,
      limit: 6,
    });

    const progressEvidence = bestProject
      ? await getProgressEvidenceForAi({ user: req.user, project: bestProject, groupId: null })
      : { dailyReports: [], groupUpdates: [] };

    const answer = await buildControlledAnswer({
      project: bestProject,
      question,
      chunks: bestRelevantChunks,
      allChunks: bestAllChunks,
      audience: 'agent',
      readiness: null,
      conversationHistory: agentHistory,
      progressEvidence,
    });

    const interaction = await createAiInteraction({
      project_id: bestProject?.id || null,
      group_id: null,
      help_request_id: null,
      requester_type: req.user.role,
      requester_id: req.user.id,
      audience: 'agent',
      question,
      answer: answer.answer,
      sources: answer.sources || [],
      metadata: requestMetadata(req),
    });

    res.status(200).json({
      message: 'Emrys AI response',
      answer_text: answer.answer,
      answer: answer.answer,
      steps: answer.steps || [],
      sources: answer.sources || [],
      next_action: answer.next_action || '',
      project: bestProject ? minimalProject(bestProject) : null,
      interaction,
      policy: {
        syllabus_bound: true,
        uses_teacher_intelligence: true,
        uses_model_knowledge_within_syllabus: true,
        project_is_textbook_reference: true,
        in_scope: answer.in_scope !== false,
        audience: 'agent',
      },
    });
  } catch (error) {
    console.error('Agent ask AI error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAiHistory = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    const allowedRoles = ['student', 'teacher', 'agent', 'admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'AI history is not available for this role' });
    }

    const interactions = await getAiInteractionsForRequester({
      requesterType: req.user.role,
      requesterId: req.user.id,
      limit: Number(req.query.limit || 50),
    });

    const messages = [];
    interactions.forEach((interaction) => {
      messages.push({
        id: `${interaction.id}-user`,
        interaction_id: interaction.id,
        role: 'user',
        text: interaction.question,
        created_at: interaction.created_at,
        project_id: interaction.project_id,
        project_title: interaction.project_title,
      });
      messages.push({
        id: `${interaction.id}-assistant`,
        interaction_id: interaction.id,
        role: 'assistant',
        text: interaction.answer,
        created_at: interaction.created_at,
        project_id: interaction.project_id,
        project_title: interaction.project_title,
        sources: interaction.sources || [],
      });
    });

    res.status(200).json({ messages, interactions });
  } catch (error) {
    console.error('Get AI history error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeachingRoadmap = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    if (!['teacher', 'agent', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Teaching roadmap is available for teachers, agents and admins only' });
    }

    const project = await resolveProject(req.user, req.query.project_id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found or not available for this class' });
    }

    let readiness = null;
    let reports = [];
    if (req.user.role === 'teacher') {
      readiness = await getTeacherReadiness(req.user.id, project.id);
      reports = await getTeacherAiDailyReports(project.id, req.user.id);

      if (project.teacher_readiness_required && !readiness) {
        return res.status(200).json({
          requires_teacher_readiness: true,
          message: TEACHER_READINESS_QUESTION,
          project: minimalProject(project),
        });
      }
    }

    const days = await ensureRoadmapDays(project);
    const roadmap = buildRoadmapResponse({ project, days, readiness });

    // Return the roadmap immediately — current_day_lesson is loaded on-demand
    // by the frontend via GET /api/ai/teaching-lesson, so we don't block this
    // response on the Claude call.
    const reportedDays = new Set(reports.map((r) => Number(r.day_number)));
    const nextDay = days.find((d) => !reportedDays.has(Number(d.day_number))) || days[days.length - 1];

    res.status(200).json({
      message: roadmap.message,
      project: minimalProject(project),
      roadmap: roadmap.roadmap,
      current_day_lesson: null,
      next_day_number: nextDay ? nextDay.day_number : null,
      prior_reports: reports,
      policy: {
        syllabus_bound: true,
        uses_teacher_intelligence: true,
        uses_model_knowledge_within_syllabus: true,
        project_is_textbook_reference: true,
        teacher_readiness_required: Boolean(project.teacher_readiness_required),
      },
    });
  } catch (error) {
    console.error('Get AI teaching roadmap error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/ai/teaching-lesson?project_id=X&day_number=N
// Returns the FULL teach-ready lesson for one specific day. Lazy companion
// to /api/ai/roadmap — the roadmap call returns a slim list of days and the
// current day's full lesson; this endpoint lets the teacher click any other
// day to load that day's full lesson on demand.
const getTeachingDayLesson = async (req, res) => {
  try {
    if (!['teacher', 'agent', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Teaching lessons are available for teachers, agents and admins only' });
    }

    const project = await resolveProject(req.user, req.query.project_id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found or not available for this class' });
    }

    const dayNumber = Number(req.query.day_number);
    if (!Number.isFinite(dayNumber) || dayNumber < 1) {
      return res.status(400).json({ message: 'day_number must be a positive integer' });
    }

    let readiness = null;
    let reports = [];
    if (req.user.role === 'teacher') {
      readiness = await getTeacherReadiness(req.user.id, project.id);
      reports = await getTeacherAiDailyReports(project.id, req.user.id);

      if (project.teacher_readiness_required && !readiness) {
        return res.status(200).json({
          requires_teacher_readiness: true,
          message: TEACHER_READINESS_QUESTION,
          project: minimalProject(project),
        });
      }
    }

    await ensureRoadmapDays(project);
    const day = await getLearningRoadmapDay(project.id, dayNumber);
    if (!day) {
      return res.status(404).json({ message: `Day ${dayNumber} is not in the roadmap for this project` });
    }

    const allChunks = await getLearningContentChunks(project.id);

    const lesson = await buildDayTeachingLesson({
      project,
      day,
      allChunks,
      readiness,
      recentReports: reports.slice(-3),
    });

    res.status(200).json({
      project: minimalProject(project),
      lesson,
    });
  } catch (error) {
    console.error('Get AI teaching day lesson error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitTeacherDailyReport = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can submit AI daily teaching reports' });
    }

    const project = await resolveProject(req.user, req.body.project_id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found or not available for this class' });
    }

    const readiness = await getTeacherReadiness(req.user.id, project.id);
    if (project.teacher_readiness_required && !readiness) {
      return res.status(200).json({
        requires_teacher_readiness: true,
        message: TEACHER_READINESS_QUESTION,
        project: minimalProject(project),
      });
    }

    const dayNumber = Number(req.body.day_number);
    await ensureRoadmapDays(project);
    const roadmapDay = await getLearningRoadmapDay(project.id, dayNumber);
    if (!roadmapDay) {
      return res.status(404).json({ message: 'Roadmap day not found for this project' });
    }

    const reportInput = {
      project_id: project.id,
      teacher_id: req.user.id,
      day_number: dayNumber,
      completed_items: req.body.completed_items || [],
      student_understanding: req.body.student_understanding || null,
      challenges: req.body.challenges || null,
      support_needed: req.body.support_needed || null,
      teacher_notes: req.body.teacher_notes || null,
    };

    const aiNextSteps = await buildDailyReportGuidance({
      project,
      roadmapDay,
      report: reportInput,
      readiness,
    });

    const report = await saveTeacherAiDailyReport({
      ...reportInput,
      ai_next_steps: aiNextSteps,
    });

    const nextDay = await getLearningRoadmapDay(project.id, dayNumber + 1);

    res.status(201).json({
      message: 'Teacher AI daily report saved',
      project: minimalProject(project),
      roadmap_day: roadmapDay,
      report,
      ai_next_steps: aiNextSteps,
      next_roadmap_day: nextDay || null,
      policy: {
        syllabus_bound: true,
        uses_teacher_intelligence: true,
        uses_model_knowledge_within_syllabus: true,
        project_is_textbook_reference: true,
      },
    });
  } catch (error) {
    console.error('Submit teacher AI daily report error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitTeacherGroupProjectUpdate = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can update group project impact and lead records' });
    }

    const project = await resolveProject(req.user, req.body.project_id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found or not available for this class' });
    }

    const groupId = Number(req.body.group_id);
    const groupAccess = await assertGroupAccess({
      user: req.user,
      groupId,
      helpRequestId: null,
    });

    if (!groupAccess.allowed) {
      return res.status(groupAccess.status).json({ message: groupAccess.message });
    }

    const groupProjectMatch = await assertGroupMatchesProject({ groupId, project });
    if (!groupProjectMatch.allowed) {
      return res.status(groupProjectMatch.status).json({ message: groupProjectMatch.message });
    }

    const dayNumber = Number(req.body.day_number);
    await ensureRoadmapDays(project);
    const roadmapDay = await getLearningRoadmapDay(project.id, dayNumber);
    if (!roadmapDay) {
      return res.status(404).json({ message: 'Roadmap section/day not found for this project' });
    }

    const impactStudentId = req.body.impact_student_id ? Number(req.body.impact_student_id) : null;
    const leadStudentId = req.body.lead_student_id ? Number(req.body.lead_student_id) : null;

    if (impactStudentId) {
      const impactStudent = await getStudentInGroupClass(groupId, impactStudentId);
      if (!impactStudent) {
        return res.status(400).json({ message: 'Impact student must belong to this group and class' });
      }
    }

    if (leadStudentId) {
      const leadStudent = await getStudentInGroupClass(groupId, leadStudentId);
      if (!leadStudent) {
        return res.status(400).json({ message: 'Lead student must belong to this group and class' });
      }
    }

    const update = await saveLearningGroupProjectUpdate({
      project_id: project.id,
      group_id: groupId,
      teacher_id: req.user.id,
      roadmap_day_id: roadmapDay.id,
      day_number: dayNumber,
      section_number: req.body.section_number || roadmapDay.section_number || dayNumber,
      impact_student_id: impactStudentId,
      lead_student_id: leadStudentId,
      impact_summary: req.body.impact_summary || null,
      group_progress: req.body.group_progress || null,
      completed_items: req.body.completed_items || [],
      next_actions: req.body.next_actions || null,
      teacher_notes: req.body.teacher_notes || null,
    });

    const history = await getLearningGroupProjectUpdates({
      projectId: project.id,
      groupId,
    });

    res.status(201).json({
      message: 'Group project section update saved',
      project: minimalProject(project),
      roadmap_section: roadmapDay,
      update,
      group_history: history,
      teacher_guidance: [
        'Use this update to decide who leads the next section.',
        'The lead should be based on impact, teamwork, explanation quality, and responsibility, not only who finished first.',
      ].join(' '),
    });
  } catch (error) {
    console.error('Submit teacher group project update error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const resolveProject = async (user, projectId, groupId = null) => {
  if (projectId) {
    const project = await getLearningProjectById(projectId);
    if (!project) return null;
    return (await canAccessProject(user, project)) ? project : null;
  }

  const projects = await getLearningProjects();
  const visibleProjects = await filterProjectsForUser(user, projects);

  if (groupId) {
    const groupResult = await pool.query(
      'SELECT grade, class_name FROM student_groups WHERE id = $1',
      [groupId]
    );
    const group = groupResult.rows[0];
    if (group) {
      const exactMatch = visibleProjects.find((project) => projectMatchesClass(project, group));
      if (exactMatch) return exactMatch;

      const classMatch = visibleProjects.find((project) =>
        project.class_name
        && group.class_name
        && String(project.class_name).trim().toLowerCase() === String(group.class_name).trim().toLowerCase()
      );
      if (classMatch) return classMatch;
    }
  }

  return visibleProjects[0];
};

const resolveAudience = (role) => (['teacher', 'agent', 'admin'].includes(role) ? 'teacher' : 'student');

const requestMetadata = (req) => ({
  user_agent: req.get('user-agent') || null,
  platform: req.get('x-client-platform') || null,
  app_version: req.get('x-app-version') || null,
  has_device_token: Boolean(req.get('x-device-token')),
});

const getProgressEvidenceForAi = async ({ user, project, groupId = null }) => {
  if (!project?.id) {
    return { dailyReports: [], groupUpdates: [] };
  }

  const [dailyReports, groupUpdates] = await Promise.all([
    user.role === 'teacher'
      ? getTeacherAiDailyReports(project.id, user.id)
      : Promise.resolve([]),
    groupId
      ? getLearningGroupProjectUpdates({ projectId: project.id, groupId })
      : Promise.resolve([]),
  ]);

  return { dailyReports, groupUpdates };
};

const isProgressQuestion = (question) => {
  return /progress|student|understanding|report|challenge|support|group|impact|lead|completed|stuck|behind|performance|update|leaderboard|score|scores|rank|ranking|grade|record|records|standing|top\s+group|where\s+(are|is)\s+(they|the\s+students?|the\s+group|the\s+class)|how\s+(are|is)\s+(they|the\s+students?|the\s+group|the\s+class)\s+doing/i
    .test(String(question || ''));
};

const buildAgentProgressAnswer = async (question) => {
  if (!isProgressQuestion(question)) return null;

  const [updatesResult, reportsResult, leadersResult] = await Promise.all([
    pool.query(
      `SELECT lgpu.*,
              lp.title AS project_title,
              sg.name AS group_name,
              impact.full_name AS impact_student_name,
              lead.full_name AS lead_student_name
       FROM learning_group_project_updates lgpu
       JOIN learning_projects lp ON lp.id = lgpu.project_id
       JOIN student_groups sg ON sg.id = lgpu.group_id
       LEFT JOIN students impact ON impact.id = lgpu.impact_student_id
       LEFT JOIN students lead ON lead.id = lgpu.lead_student_id
       ORDER BY lgpu.updated_at DESC
       LIMIT 5`
    ),
    pool.query(
      `SELECT tair.*,
              lp.title AS project_title,
              t.full_name AS teacher_name
       FROM teacher_ai_daily_reports tair
       JOIN learning_projects lp ON lp.id = tair.project_id
       JOIN teachers t ON t.id = tair.teacher_id
       ORDER BY tair.updated_at DESC
       LIMIT 5`
    ),
    // Top groups by rating — gives the agent the leaderboard standings too.
    pool.query(
      `SELECT sg.name AS group_name,
              gr.project_name,
              ROUND(AVG(gr.score))::int AS score
       FROM group_ratings gr
       JOIN student_groups sg ON sg.id = gr.group_id
       GROUP BY sg.name, gr.project_name
       ORDER BY AVG(gr.score) DESC
       LIMIT 5`
    ),
  ]);

  const updates = updatesResult.rows;
  const reports = reportsResult.rows;
  const leaders = leadersResult.rows;
  const primaryProjectId = updates[0]?.project_id || reports[0]?.project_id || null;
  const primaryGroupId = updates[0]?.group_id || null;
  const primaryProject = primaryProjectId
    ? {
        id: primaryProjectId,
        title: updates[0]?.project_title || reports[0]?.project_title,
      }
    : null;

  if (updates.length === 0 && reports.length === 0 && leaders.length === 0) {
    return {
      project_id: null,
      group_id: null,
      project: null,
      answer: [
        'I do not see saved student progress records yet.',
        'Progress will appear here after a teacher submits a daily AI report or a group project section update.',
        'Agent next move: ask the teacher to submit today’s project report, or open the group project update flow after class activity.',
      ].join('\n\n'),
      steps: [],
      sources: [],
      next_action: 'Ask the teacher to submit a daily report or group project update so Emrys can summarize real progress.',
    };
  }

  const lines = [];
  lines.push('Source: saved Credent progress records.');
  lines.push('Here is the latest saved student progress from Credent records.');

  if (updates.length > 0) {
    lines.push('');
    lines.push('Group project updates:');
    updates.forEach((update, index) => {
      const parts = [
        `${index + 1}. ${update.group_name} on "${update.project_title}", day ${update.day_number}`,
      ];
      if (update.group_progress) parts.push(`progress: ${update.group_progress}`);
      if (update.impact_summary) parts.push(`impact: ${update.impact_summary}`);
      if (update.lead_student_name) parts.push(`lead: ${update.lead_student_name}`);
      if (update.impact_student_name) parts.push(`impact student: ${update.impact_student_name}`);
      if (Array.isArray(update.completed_items) && update.completed_items.length > 0) {
        parts.push(`completed: ${update.completed_items.join(', ')}`);
      }
      if (update.next_actions) parts.push(`next: ${update.next_actions}`);
      lines.push(parts.join('; '));
    });
  }

  if (reports.length > 0) {
    lines.push('');
    lines.push('Teacher daily reports:');
    reports.forEach((report, index) => {
      const parts = [
        `${index + 1}. ${report.teacher_name} on "${report.project_title}", day ${report.day_number}`,
      ];
      if (report.student_understanding) parts.push(`understanding: ${report.student_understanding}`);
      if (report.challenges) parts.push(`challenge: ${report.challenges}`);
      if (report.support_needed) parts.push(`support needed: ${report.support_needed}`);
      if (report.ai_next_steps) parts.push(`AI next steps: ${report.ai_next_steps}`);
      lines.push(parts.join('; '));
    });
  }

  if (leaders.length > 0) {
    lines.push('');
    lines.push('Leaderboard (top groups by rating):');
    leaders.forEach((leader, index) => {
      lines.push(`${index + 1}. ${leader.group_name} — ${leader.score} pts on "${leader.project_name}"`);
    });
  }

  lines.push('');
  lines.push('Agent next move: follow up on the newest challenge or support-needed item first, then ask the teacher to update the report after the next class activity.');

  // Structured facts → Claude writes a natural agent briefing (varies each
  // time). The deterministic `lines` above stay as the fallback when the LLM
  // is unavailable. Facts are the source of truth; the model only rephrases.
  const facts = {
    group_updates: updates.map((u) => ({
      group: u.group_name,
      project: u.project_title,
      day: u.day_number,
      progress: u.group_progress || null,
      impact: u.impact_summary || null,
      lead: u.lead_student_name || null,
      impact_student: u.impact_student_name || null,
      completed: Array.isArray(u.completed_items) ? u.completed_items : [],
      next: u.next_actions || null,
    })),
    teacher_reports: reports.map((r) => ({
      teacher: r.teacher_name,
      project: r.project_title,
      day: r.day_number,
      understanding: r.student_understanding || null,
      challenge: r.challenges || null,
      support_needed: r.support_needed || null,
      ai_next_steps: r.ai_next_steps || null,
    })),
    leaderboard: leaders.map((l, i) => ({
      rank: i + 1,
      group: l.group_name,
      project: l.project_name,
      points: l.score,
    })),
  };

  const phrased = await phraseAgentProgressWithLLM(facts);
  const answer = phrased || lines.join('\n');

  const steps = [
    ...updates.slice(0, 3).map((update, index) => ({
      position: index + 1,
      chunk_id: 0,
      step_number: update.day_number,
      label: `Group update ${index + 1}`,
      title: `${update.group_name} progress`,
      summary: update.group_progress || update.impact_summary || update.next_actions || 'Saved group project update',
    })),
    ...reports.slice(0, 2).map((report, index) => ({
      position: updates.slice(0, 3).length + index + 1,
      chunk_id: 0,
      step_number: report.day_number,
      label: `Teacher report ${index + 1}`,
      title: `${report.teacher_name} daily report`,
      summary: report.student_understanding || report.challenges || report.support_needed || 'Saved teacher daily report',
    })),
  ];

  return {
    project_id: primaryProjectId,
    group_id: primaryGroupId,
    project: primaryProject ? minimalProject({
      id: primaryProject.id,
      title: primaryProject.title,
      subject: null,
      grade: null,
      class_name: null,
      duration_months: null,
      expected_section_count: null,
    }) : null,
    answer,
    steps,
    sources: [
      ...updates.map((update) => ({
        source_type: 'group_project_update',
        update_id: update.id,
        project_id: update.project_id,
        group_id: update.group_id,
        day_number: update.day_number,
      })),
      ...reports.map((report) => ({
        source_type: 'teacher_daily_report',
        report_id: report.id,
        project_id: report.project_id,
        teacher_id: report.teacher_id,
        day_number: report.day_number,
      })),
    ],
    next_action: 'Follow up on the newest challenge or support-needed item, then ask for a fresh report after the next class activity.',
  };
};

// A student asking specifically about THEIR OWN records / progress / standing.
// Tighter than isProgressQuestion: we require "my <record-word>" or an explicit
// leaderboard/standing phrase so ordinary project questions that merely contain
// the word "progress" don't get hijacked away from the controlled tutor.
const isStudentRecordsQuestion = (question) => {
  const s = String(question || '').toLowerCase();
  return (
    /\bmy\s+(progress|score|scores|result|results|grade|grades|mark|marks|record|records|rank|ranking|standing|position)\b/.test(s)
    || /\b(leaderboard|how\s+am\s+i\s+doing|how\s+i'?m\s+doing|am\s+i\s+(doing|improving|passing)|where\s+am\s+i\b|what'?s\s+my\s+(score|rank|grade|position|standing))\b/.test(s)
  );
};

// Pick a short, warm, age-appropriate motivation line keyed off the best score.
// Emrys "sometimes motivates the child" — the tone scales with how they're doing
// so a struggling learner gets encouragement, not empty praise.
const motivationForScore = (bestScore) => {
  if (bestScore == null) {
    return "Every champion starts at zero — your first score is just around the corner. Keep showing up! 🌱";
  }
  if (bestScore >= 90) return "Outstanding work — you're shining! ⭐ Keep that curiosity burning and help a teammate level up too.";
  if (bestScore >= 75) return "Really strong work! 💪 You're close to the top — one more push and you'll get there.";
  if (bestScore >= 60) return "You're getting there, step by step. 🚀 Keep practising the tricky parts and your score will climb.";
  return "Every expert was once a beginner. 🌟 Don't give up — ask questions, try again, and you'll surprise yourself.";
};

// Concrete, friendly study tip per scored skill (used in the deterministic
// fallback and offered to the LLM as a hint).
const SKILL_TIPS = {
  creativity: 'try adding one of your own ideas to the next project',
  execution: 'break the build into tiny steps and finish them one at a time',
  teamwork: 'share a task with a groupmate and check in on each other',
  presentation: 'practise explaining your project out loud in 3 short sentences',
};

// Lowest-scored skill on a rating row → { skill, value } (or null).
const weakestSkill = (rating) => {
  if (!rating) return null;
  const dims = Object.keys(SKILL_TIPS).filter(
    (k) => rating[k] !== null && rating[k] !== undefined
  );
  if (!dims.length) return null;
  dims.sort((a, b) => Number(rating[a]) - Number(rating[b]));
  return { skill: dims[0], value: Number(rating[dims[0]]) };
};

const tipForWeakestSkill = (rating) => {
  const w = weakestSkill(rating);
  if (!w) return null;
  return `Tip: your lowest area is ${w.skill} — ${SKILL_TIPS[w.skill]}.`;
};

// Ask Claude to phrase the student's real records as a warm, varied,
// kid-friendly motivational message. Returns the text, or null if the model is
// unavailable (caller then falls back to the deterministic template). Reuses
// callClaudeForTutor (= callClaudeWithHistory) so model + key handling match the
// rest of the tutor flow. `facts` is the structured truth — the model only
// rephrases it, it does not invent numbers.
const phraseStudentRecordsWithLLM = async (facts) => {
  const systemPrompt = [
    'You are Emrys, a warm, encouraging AI teacher for children on the Credent learning platform.',
    "You will be given ONE student's real learning records as JSON. Write a short message (3 to 5 sentences) spoken directly TO the child by their first name.",
    'Rules:',
    '- Use simple, friendly words a child understands. A couple of emojis are welcome; do not overdo it.',
    '- Use ONLY the numbers in the JSON (class rank, points, project scores). Never invent or change a number.',
    '- Mention their class leaderboard rank and a notable project score.',
    '- Celebrate what is going well, then gently encourage them on their weakest_skill with ONE concrete, doable tip.',
    '- Always end on a motivating note. If records are missing or scores are low, be reassuring and kind — never discouraging.',
    '- Plain prose only: no markdown headings, no bullet lists, no preamble like "Sure" or "Here is".',
  ].join('\n');

  try {
    const raw = await callClaudeForTutor(
      systemPrompt,
      [{ role: 'user', content: JSON.stringify(facts) }],
      400
    );
    return raw && raw.trim() ? raw.trim() : null;
  } catch (e) {
    console.warn('phraseStudentRecordsWithLLM failed:', e.message);
    return null;
  }
};

// Ask Claude to turn the agent's saved progress records into a natural, concise
// operational briefing (varies each time). Professional tone — this is for
// staff managing schools/teachers/groups, NOT a child. Returns text or null
// (caller falls back to the deterministic summary). The JSON facts are the
// source of truth; the model only rephrases them.
const phraseAgentProgressWithLLM = async (facts) => {
  const systemPrompt = [
    'You are Emrys, the AI assistant for a Credent agent/admin who manages schools, teachers and student groups.',
    'You will be given the latest saved progress records as JSON: recent group project updates, teacher daily reports, and the current leaderboard (top groups).',
    'Write a concise briefing for the agent:',
    '- 2 to 4 short sentences (a couple of short bullet lines are fine if they aid scanning).',
    '- Use ONLY the facts and numbers in the JSON. Never invent names, scores, or events.',
    '- Surface what matters operationally: who is progressing, any challenges or support-needed flags, and the top leaderboard groups.',
    '- End with ONE clear next move for the agent.',
    '- Professional, clear tone for staff (not a child). No markdown headings, no preamble like "Sure" or "Here is".',
  ].join('\n');

  try {
    const raw = await callClaudeForTutor(
      systemPrompt,
      [{ role: 'user', content: JSON.stringify(facts) }],
      500
    );
    return raw && raw.trim() ? raw.trim() : null;
  } catch (e) {
    console.warn('phraseAgentProgressWithLLM failed:', e.message);
    return null;
  }
};

// Builds Emrys's answer when a STUDENT asks about their own records/progress.
// Pulls real scores + feedback from group_ratings and the student's class
// leaderboard standing, then wraps them in an encouraging, kid-friendly note.
// Returns null when the question isn't a records question so the normal tutor
// flow runs instead.
const buildStudentProgressAnswer = async (student, question) => {
  if (!isStudentRecordsQuestion(question)) return null;

  const [ratingsResult, standingResult] = await Promise.all([
    pool.query(
      `SELECT gr.project_name,
              ROUND(gr.score)::int AS score,
              gr.feedback,
              gr.creativity, gr.execution, gr.teamwork, gr.presentation,
              sg.name AS group_name,
              gr.submitted_at
       FROM group_ratings gr
       JOIN student_groups sg ON sg.id = gr.group_id
       JOIN group_members gm ON gm.group_id = sg.id
       WHERE gm.student_id = $1
       ORDER BY gr.submitted_at DESC NULLS LAST
       LIMIT 8`,
      [student.id]
    ),
    pool.query(
      `WITH class_scope AS (
         SELECT sg.id AS group_id, sg.name AS group_name, AVG(gr.score) AS avg_score
         FROM group_ratings gr
         JOIN student_groups sg ON sg.id = gr.group_id
         JOIN students viewer_s
           ON viewer_s.id = $1
          AND viewer_s.school_id = sg.school_id
          AND (
               sg.class_name IS NULL
            OR viewer_s.class_name IS NULL
            OR LOWER(sg.class_name) = LOWER(viewer_s.class_name)
          )
         GROUP BY sg.id, sg.name
       ),
       ranked AS (
         SELECT group_id, group_name,
                ROUND(avg_score)::int AS score,
                ROW_NUMBER() OVER (ORDER BY avg_score DESC) AS rank,
                COUNT(*) OVER () AS total_groups
         FROM class_scope
       )
       SELECT r.rank, r.group_name, r.score, r.total_groups
       FROM ranked r
       JOIN group_members gm ON gm.group_id = r.group_id
       WHERE gm.student_id = $1
       ORDER BY r.rank ASC
       LIMIT 1`,
      [student.id]
    ),
  ]);

  const ratings = ratingsResult.rows;
  const standing = standingResult.rows[0] || null;
  const hasData = ratings.length > 0 || !!standing;

  const scores = ratings.map((r) => Number(r.score)).filter((n) => Number.isFinite(n));
  if (standing && Number.isFinite(Number(standing.score))) scores.push(Number(standing.score));
  const bestScore = scores.length ? Math.max(...scores) : null;

  const firstName = student.full_name ? String(student.full_name).split(' ')[0] : null;
  const weakest = weakestSkill(ratings[0]);

  // ── Deterministic fallback text (used verbatim if the LLM is unavailable) ──
  const lines = [];
  if (!hasData) {
    lines.push(`Hi ${firstName || 'there'}! 👋`);
    lines.push("You don't have any project scores yet — that's totally fine, it just means your adventure is only getting started.");
    lines.push('Your scores and class ranking will show up here as soon as your teacher rates your group on a project.');
    lines.push(motivationForScore(null));
  } else {
    lines.push(`Here's your learning record so far, ${firstName || 'champ'} 🌟`);
    if (standing) {
      const place = standing.rank === 1
        ? "you're at the TOP"
        : `you're ranked #${standing.rank} of ${standing.total_groups}`;
      lines.push('');
      lines.push(`🏆 In your class leaderboard, ${place} with ${standing.group_name} (${standing.score} pts).`);
    }
    if (ratings.length > 0) {
      lines.push('');
      lines.push('📊 Your project scores:');
      ratings.forEach((r) => {
        const parts = [`• ${r.project_name}: ${r.score}/100`];
        if (r.feedback) parts.push(`teacher said: "${r.feedback}"`);
        lines.push(parts.join(' — '));
      });
    }
    lines.push('');
    lines.push(motivationForScore(bestScore));
    const tip = tipForWeakestSkill(ratings[0]);
    if (tip) lines.push(tip);
  }
  const fallbackText = lines.join('\n');

  // ── Structured facts → Claude phrases them naturally (varies each time) ──
  const facts = {
    name: firstName || 'friend',
    has_records: hasData,
    class_rank: standing
      ? {
          rank: standing.rank,
          total_groups: standing.total_groups,
          group: standing.group_name,
          points: standing.score,
        }
      : null,
    best_score: bestScore,
    projects: ratings.map((r) => ({
      project: r.project_name,
      score: r.score,
      feedback: r.feedback || null,
    })),
    weakest_skill: weakest
      ? { skill: weakest.skill, value: weakest.value, suggested_tip: SKILL_TIPS[weakest.skill] }
      : null,
  };

  const phrased = await phraseStudentRecordsWithLLM(facts);
  const answer = phrased || fallbackText;

  const sources = ratings.map((r) => ({
    source_type: 'group_rating',
    project_name: r.project_name,
    group_name: r.group_name,
    score: r.score,
  }));

  return {
    answer,
    steps: [],
    sources,
    next_action: !hasData
      ? 'Keep taking part in your group projects — your first score is on its way.'
      : bestScore != null && bestScore < 75
        ? 'Pick one tricky topic and ask Emrys to explain it again — small wins add up.'
        : 'Keep up the great work and aim for your next project score.',
  };
};

const minimalProject = (project) => ({
  id: project.id,
  title: project.title,
  subject: project.subject,
  project_type: project.project_type || 'software',
  grade: project.grade,
  class_name: project.class_name,
  duration_months: project.duration_months,
  expected_section_count: project.expected_section_count,
});

const assertGroupAccess = async ({ user, groupId, helpRequestId }) => {
  const group = await pool.query('SELECT id FROM student_groups WHERE id = $1', [groupId]);
  if (!group.rows[0]) {
    return { allowed: false, status: 404, message: 'Group not found' };
  }

  if (helpRequestId) {
    const helpRequest = await pool.query(
      'SELECT id FROM group_help_requests WHERE id = $1 AND group_id = $2',
      [helpRequestId, groupId]
    );
    if (!helpRequest.rows[0]) {
      return { allowed: false, status: 400, message: 'Help request does not belong to this group' };
    }
  }

  if (['admin', 'agent'].includes(user.role)) {
    return { allowed: true };
  }

  if (user.role === 'student') {
    const membership = await pool.query(
      `SELECT 1
       FROM group_members gm
       JOIN student_groups sg ON sg.id = gm.group_id
       JOIN students s ON s.id = gm.student_id
       WHERE gm.group_id = $1
         AND gm.student_id = $2
         AND s.school_id = sg.school_id
         AND (
           sg.grade IS NULL
           OR s.grade IS NULL
           OR LOWER(s.grade) = LOWER(sg.grade)
         )
         AND (
           sg.class_name IS NULL
           OR s.class_name IS NULL
           OR LOWER(s.class_name) = LOWER(sg.class_name)
         )
         AND (
           (sg.semester IS NULL AND s.semester IS NULL)
           OR (sg.semester IS NOT NULL AND s.semester IS NOT NULL AND LOWER(s.semester) = LOWER(sg.semester))
         )
       LIMIT 1`,
      [groupId, user.id]
    );
    return membership.rows[0]
      ? { allowed: true }
      : { allowed: false, status: 403, message: 'Access denied for this group' };
  }

  if (user.role === 'teacher') {
    const access = await pool.query(
      `SELECT 1
       FROM teacher_group_access
       WHERE group_id = $1 AND teacher_id = $2 AND is_active = true
       LIMIT 1`,
      [groupId, user.id]
    );
    return access.rows[0]
      ? { allowed: true }
      : { allowed: false, status: 403, message: 'Access denied for this group' };
  }

  return { allowed: false, status: 403, message: 'Access denied for this group' };
};

const assertGroupMatchesProject = async ({ groupId, project }) => {
  if (!project.grade || !project.class_name) {
    return {
      allowed: false,
      status: 403,
      message: 'Project must be assigned to a class before it can be used in a group',
    };
  }

  const result = await pool.query(
    `SELECT 1
     FROM student_groups
     WHERE id = $1
       AND (
         grade IS NULL
         OR LOWER(grade) = LOWER($2)
       )
       AND (
         class_name IS NULL
         OR LOWER(class_name) = LOWER($3)
       )
     LIMIT 1`,
    [groupId, project.grade, project.class_name]
  );

  return result.rows[0]
    ? { allowed: true }
    : { allowed: false, status: 403, message: 'Project access denied for this group class' };
};

const getStudentInGroupClass = async (groupId, studentId) => {
  const result = await pool.query(
    `SELECT s.id, s.student_id, s.full_name, s.class_name, s.semester
     FROM group_members gm
     JOIN student_groups sg ON sg.id = gm.group_id
     JOIN students s ON s.id = gm.student_id
     WHERE gm.group_id = $1
       AND gm.student_id = $2
       AND s.school_id = sg.school_id
       AND (
         sg.grade IS NULL
         OR s.grade IS NULL
         OR LOWER(s.grade) = LOWER(sg.grade)
       )
       AND (
         sg.class_name IS NULL
         OR s.class_name IS NULL
         OR LOWER(s.class_name) = LOWER(sg.class_name)
       )
       AND (
         (sg.semester IS NULL AND s.semester IS NULL)
         OR (sg.semester IS NOT NULL AND s.semester IS NOT NULL AND LOWER(s.semester) = LOWER(sg.semester))
       )
     LIMIT 1`,
    [groupId, studentId]
  );
  return result.rows[0];
};

const getTeacherReports = async (req, res) => {
  try {
    const allowedRoles = ['teacher', 'agent', 'admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not available for this role' });
    }

    let rows;
    if (req.user.role === 'teacher') {
      const result = await pool.query(
        `SELECT tair.*,
                lp.title AS project_title
         FROM teacher_ai_daily_reports tair
         JOIN learning_projects lp ON lp.id = tair.project_id
         WHERE tair.teacher_id = $1
         ORDER BY tair.updated_at DESC
         LIMIT 50`,
        [req.user.id]
      );
      rows = result.rows;
    } else {
      const result = await pool.query(
        `SELECT tair.*,
                lp.title AS project_title,
                t.full_name AS teacher_name
         FROM teacher_ai_daily_reports tair
         JOIN learning_projects lp ON lp.id = tair.project_id
         JOIN teachers t ON t.id = tair.teacher_id
         ORDER BY tair.updated_at DESC
         LIMIT 50`
      );
      rows = result.rows;
    }

    const reports = rows.map((r) => ({
      id: r.id,
      project_title: r.project_title,
      teacher_name: r.teacher_name || null,
      day_number: r.day_number,
      summary: [r.student_understanding, r.challenges, r.support_needed]
        .filter(Boolean).join(' | ') || r.ai_next_steps || 'Report saved',
      date: r.updated_at ? new Date(r.updated_at).toISOString().slice(0, 10) : null,
      ai_next_steps: r.ai_next_steps || null,
      score: null,
    }));

    res.status(200).json({ reports });
  } catch (error) {
    console.error('Get teacher reports error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Transcribe Audio (OpenAI Whisper → Deepgram fallback) ───────────────────
// Used by the desktop "Teach" mode for live voice commands. Tries OpenAI
// Whisper first (best accuracy); falls back to Deepgram (free tier, $200
// credit) if no OpenAI key is configured. Either provider can be used —
// agents can swap freely without code changes.
const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'audio file is required (field: file)' });
    }

    const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: f }) => f(...args)));
    const openaiKey   = process.env.OPENAI_API_KEY;
    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    // Treat common placeholder shapes as "not set" so a forgotten dummy
    // value doesn't get sent to the API.
    const isPlaceholder = (v) => !v || /your[-_]?(api[-_]?)?key[-_]?here|\.\.\.|^x{3,}$|^sk-\.\.\./i.test(v);
    const hasOpenai   = !isPlaceholder(openaiKey);
    const hasDeepgram = !isPlaceholder(deepgramKey);

    if (!hasOpenai && !hasDeepgram) {
      return res.status(503).json({
        message: 'Transcription not configured. Set OPENAI_API_KEY or DEEPGRAM_API_KEY in backend .env.',
      });
    }

    // ── Provider 1: OpenAI Whisper (preferred when available) ────────
    if (hasOpenai) {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: req.file.originalname || 'audio.webm',
        contentType: req.file.mimetype || 'audio/webm',
      });
      form.append('model', 'whisper-1');
      form.append('response_format', 'json');
      if (req.body.language) form.append('language', String(req.body.language));

      const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${openaiKey}`, ...form.getHeaders() },
        body: form,
      });
      const data = await r.json();
      if (!r.ok) {
        // If OpenAI is misconfigured but Deepgram is available, fall through.
        if (!hasDeepgram) {
          return res.status(502).json({ message: data?.error?.message || 'OpenAI transcription failed' });
        }
        console.warn('[transcribe] OpenAI failed, falling back to Deepgram:', data?.error?.message);
      } else {
        return res.status(200).json({ text: data.text || '', provider: 'openai' });
      }
    }

    // ── Provider 2: Deepgram (free-tier friendly) ────────────────────
    // Send raw audio bytes with the source content-type. Deepgram's nova-2
    // model is fast and accurate enough for short command utterances.
    const params = new URLSearchParams({
      model: 'nova-2',
      smart_format: 'true',
      punctuate: 'true',
    });
    if (req.body.language) params.set('language', String(req.body.language));

    // Some Deepgram routes reject the `;codecs=opus` suffix on the mime
    // type — strip it down to the base type, which Deepgram auto-detects.
    const baseMime = String(req.file.mimetype || 'audio/webm').split(';')[0].trim();
    const r = await fetch(`https://api.deepgram.com/v1/listen?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${deepgramKey}`,
        'Content-Type': baseMime,
      },
      body: req.file.buffer,
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(502).json({ message: data?.err_msg || data?.error || 'Deepgram transcription failed' });
    }
    const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    return res.status(200).json({ text: transcript, provider: 'deepgram' });
  } catch (error) {
    console.error('transcribeAudio error:', error.message);
    return res.status(500).json({ message: 'Server error transcribing audio' });
  }
};

// ─── Ask with Attachment (file or transcribed audio) ──────────────────────────
const askWithAttachment = async (req, res) => {
  try {
    const { question = '', transcribed_audio = '' } = req.body;
    const userQuestion = (transcribed_audio || question).trim();

    if (!req.file && !userQuestion) {
      return res.status(400).json({ message: 'Attach a file or type a question.' });
    }

    const Anthropic = require('@anthropic-ai/sdk');
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      return res.status(503).json({ message: 'AI service not configured' });
    }
    const anthropic = new Anthropic({ apiKey });

    const role = req.user?.role || 'student';
    const systemPrompt = `You are Emrys, the AI teacher on the Credent education platform. You help ${role}s understand content shared with you. When given a file or image, analyse it fully and answer any question about it. When given a voice transcription, treat it as the user's spoken question.

Teaching rule: Emrys is the active teacher for the lesson, not only a reference book or roadmap writer. The learners are children and beginners, so explain at kids level with simple words, tiny steps, familiar examples, and no unexplained technical terms. Use full teaching and technical knowledge inside the project scope to identify likely requirements before starting, including apps, files, packages, libraries, hardware, accounts, internet access, folders, and setup steps. Treat project files, code, roadmap notes, screenshots, and manuals as source material and a final target. They are not proof that students already have the code, setup, wiring, or files. If the user is teaching a project, start from the first unfinished foundation unless they clearly say earlier work is complete.

Answer rule: do not give only a roadmap. If the project is starting or setup is uncertain, first ask whether students have downloaded/opened the required tools, installed requirements, saved files in the right folder, and prepared any needed hardware or internet access. If anything is missing, teach that setup first at beginner level. Then answer the question directly with actual teaching notes, clear explanation, class wording, examples, and usable code or solution steps when relevant. If the user is a teacher, provide what they can say and show to the class without relying on their own prior experience. For code, explain each important line like students are seeing code for the first time. End with a short checkpoint or practice task so the learner proves understanding.`;

    let contentBlocks = [];

    // Attach file if provided
    if (req.file) {
      const mime = req.file.mimetype;
      const buf = req.file.buffer;

      if (mime === 'application/pdf') {
        // Claude supports PDF as base64 document
        contentBlocks.push({
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: buf.toString('base64'),
          },
        });
      } else if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(mime)) {
        const imgMime = mime === 'image/jpg' ? 'image/jpeg' : mime;
        contentBlocks.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: imgMime,
            data: buf.toString('base64'),
          },
        });
      } else {
        // Try to decode as text (CSV, txt, code, JSON, etc.). buf.toString
        // never throws, so we sniff for binary instead: a NUL byte or a high
        // ratio of replacement chars (U+FFFD) means this is really a binary
        // format (.docx/.xlsx/.zip/…) that we'd otherwise hand Claude as
        // mojibake. Reject those with a clear message rather than guessing.
        const text = buf.toString('utf-8');
        const sample = text.slice(0, 4096);
        const replacementChars = (sample.match(/�/g) || []).length;
        // A NUL byte is the strongest signal of a binary file; the UTF-8
        // replacement char (U+FFFD) appears when raw bytes weren't valid
        // UTF-8. Either at meaningful frequency => treat as binary and reject.
        const looksBinary =
          new RegExp('\\u0000').test(sample) ||
          (sample.length > 0 && replacementChars / sample.length > 0.1);

        if (looksBinary) {
          return res.status(422).json({
            message:
              'That file type can’t be read as text. Please send a PDF, an image (PNG/JPG), or a plain-text/code/CSV file. ' +
              'For Word/Excel/PowerPoint, export to PDF first.',
          });
        }

        // Cap very large text files so we don't blow the model's context or
        // the response budget. ~120k chars ≈ well within Claude's window while
        // leaving room for the answer.
        const MAX_TEXT_CHARS = 120000;
        const clipped = text.length > MAX_TEXT_CHARS
          ? `${text.slice(0, MAX_TEXT_CHARS)}\n\n…[truncated ${text.length - MAX_TEXT_CHARS} more characters]`
          : text;
        contentBlocks.push({ type: 'text', text: `File content (${req.file.originalname}):\n${clipped}` });
      }
    }

    // Add the user question / transcribed audio
    const prompt = userQuestion
      ? userQuestion
      : req.file
        ? `Please describe and summarise what you see in this ${req.file.mimetype.includes('image') ? 'image' : 'file'}.`
        : 'Hello';
    contentBlocks.push({ type: 'text', text: prompt });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 1800,
      system: systemPrompt,
      messages: [{ role: 'user', content: contentBlocks }],
    });

    const answer = (response.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim() || 'I was unable to process that. Please try again.';

    // Save to interaction history so messages persist across sessions
    try {
      await createAiInteraction({
        project_id: null,
        group_id: null,
        help_request_id: null,
        requester_type: role,
        requester_id: req.user.id,
        audience: role === 'student' ? 'student' : 'teacher',
        question: prompt,
        answer,
        sources: [],
        metadata: requestMetadata(req),
      });
    } catch (_) {}

    return res.status(200).json({
      message: 'Emrys AI response',
      answer_text: answer,
      answer,
    });
  } catch (error) {
    // Surface the real reason. Anthropic SDK errors carry .status and a
    // structured .error; log the full shape and pass a useful message back so
    // failures (bad model name, image too large, API error) are diagnosable
    // instead of an opaque 500.
    const detail =
      error?.error?.error?.message ||
      error?.error?.message ||
      error?.message ||
      'Unknown error';
    console.error('askWithAttachment error:', {
      status: error?.status,
      type: error?.error?.error?.type || error?.name,
      message: detail,
    });
    const status = Number.isInteger(error?.status) ? error.status : 500;
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      message: `Emrys could not process that attachment: ${detail}`,
    });
  }
};

// ─── Tutor mode (10-rule patient teacher; conversational, multi-turn) ───────
// Distinct from the "quick answer" askAi flow. Uses ai_tutoring_sessions to
// persist state across turns (and across days) so Emrys remembers what the
// student already learned, what they tried, and which topic is current.
//
// Flow per request:
//   1. Resolve or create the active session (1-hour TTL).
//   2. Pull project context (description + chunks) — full grounding per
//      user's preference.
//   3. Build the system prompt: 10 rules verbatim, plus session memory,
//      plus a HARD CAP of 5 lines of code per response and the
//      [advance:] / [checkpoint:] marker contract.
//   4. Call Claude with the last N turns as multi-turn messages.
//   5. Strip the markers from the answer (but use them to update session).
//   6. Persist the turn + return answer + session metadata.

const {
  getOrCreateActiveTutoringSession,
  appendTutoringTurn,
  endTutoringSession,
  getActiveTutoringSession,
  createAiInteraction: persistTutorTurn,
} = require('../models/learningModel');
const {
  getLearningProjectById: getProjectForTutor,
  getLearningContentChunks: getChunksForTutor,
} = require('../models/learningModel');
const { callClaudeWithHistory: callClaudeForTutor } = require('../services/controlledAiTutorService');

const TUTOR_RULES = `You are Emrys, a patient coding teacher for absolute beginners.

YOUR TEACHING RULES — never break these:

1. NEVER give the full code upfront.
   Always build in small steps, one concept at a time.

2. TEACH the concept in plain English before showing any code.
   Example: explain what a variable IS before writing one.

3. After explaining, ask the student to TRY writing it first.
   Only correct them after they attempt it.

4. Ask an understanding-check question before moving to the next step.
   Example: "Before we continue — can you tell me in your own words
   what this line does?"

5. When the student makes an error, DO NOT fix it immediately.
   Ask: "What do you think this error is telling you?"
   Guide them to find the answer themselves.

6. Use real-world analogies for every new concept.
   Example: "A function is like a recipe — you write it once,
   use it many times."

7. Celebrate small wins. Every working step is progress.

8. Never assume the student knows anything. Always define terms.

9. Keep each step small enough to finish in under 5 minutes.

10. At the end of every session ask:
    "What did you learn today? Explain it back to me."

YOUR GOAL: The student should be able to rebuild the project
themselves from memory after completing it with you.
You are not here to impress them with code.
You are here to make them capable.

HARD OUTPUT CAPS (enforced by code, do not break):
- Maximum 5 lines of code per response. If more is needed, split across turns.
- One concept per response. Never bundle two topics.
- Prefer plain English over code in every turn.

STATE MARKERS — append at the very end of your response when applicable:
- When you move to a new topic, write: [advance: <topic name>]
- When the student has clearly grasped a concept, write: [checkpoint: <concept>]
- Markers are stripped before the student sees the response. They update memory.

GREETINGS & SMALL TALK — IMPORTANT (read carefully):
- This applies to WHOEVER you're chatting with — a student, or a teacher
  running the class. Treat a greeting the same warm way for everyone.
- If their latest message is just a greeting or small talk ("hi", "good
  morning", "how are you", "thanks", "I'm back", etc.), reply the way a warm
  human teacher would: greet them back, react to what they actually said, and
  ask ONE light, friendly question — how they're doing, or whether they're
  ready to start today. Keep it to 2–4 short, easy sentences.
- On a greeting, do NOT pitch the project, do NOT list what it will do, do NOT
  lay out the roadmap, and do NOT start a lesson. Ease in like a person — let
  them settle in first. It is fine for the whole first reply to just be a warm
  hello and a "ready when you are 😊".
- Only AFTER they show they want to begin (e.g. "let's start", "I'm ready",
  "what are we building?", or they ask a real question) do you move toward the
  project — and even then, keep it to 1–2 friendly lines about what they'll
  build, then invite them into the FIRST tiny step. Never dump the syllabus.

When they ARE ready to start (the first real lesson turn): greet warmly if you
haven't already, name the project in a single line, use one quick real-world
analogy, ask which part they'd like to begin with, and stop there. Do NOT dump
the syllabus.`;

const buildTutorSystemPrompt = (session, project, chunks) => {
  const completed = Array.isArray(session.completed_topics) ? session.completed_topics : [];
  const projectTitle = project?.title || '(no project selected)';
  const projectDesc = project?.description || '';
  const projectGoals = project?.learning_goals || '';
  const chunkLines = (chunks || []).slice(0, 30).map(c => {
    const title = c.title || 'Untitled';
    const body = (c.content || '').replace(/\s+/g, ' ').slice(0, 600);
    return `- ${title}: ${body}`;
  }).join('\n');

  // Hard class-scope rule: Emrys teaches ONLY this class's assigned project.
  // If the learner asks to build a different/unrelated project, it must decline
  // and redirect to the assigned project — it must not free-build anything.
  const scopeRule = project
    ? `CLASS PROJECT LOCK (critical):
- This class is assigned EXACTLY ONE project: "${projectTitle}".
- Teach ONLY this project. Do NOT start, plan, or build any other project.
- If the learner asks for a different project (e.g. "build me a game/website/app" that is not this one), politely refuse and steer them back: say that for this class you teach "${projectTitle}", and offer the next step of THIS project.
- You may still answer small general concept questions (e.g. "what is a variable?"), but always tie the lesson back to "${projectTitle}".`
    : `CLASS PROJECT LOCK (critical):
- No project is assigned to this class. Do NOT build or plan any project.
- Only help with small general concepts and tell the learner a project must be assigned to their class first.`;

  return `${TUTOR_RULES}

${scopeRule}

CURRENT SESSION:
- Project: ${projectTitle}
- Current topic: ${session.current_topic || '(starting fresh)'}
- Topics already covered: ${completed.length ? completed.join(', ') : '(none yet)'}
- Student's last attempt: ${session.last_attempt || '(none yet)'}
- Turn count so far: ${session.turn_count || 0}

PROJECT GROUNDING (prefer this material; it is the source of truth for THIS project):
Description: ${projectDesc}
Learning goals: ${projectGoals}
${chunkLines ? `\nReference material:\n${chunkLines}` : ''}

USING THE MATERIAL vs YOUR OWN KNOWLEDGE:
- ALWAYS prefer the reference material above. When the answer IS in it, teach from it and stay faithful to its components, steps, libraries, and order.
- When the student's question is NOT covered by the material (a gap, an error they hit, a "why", a debugging issue, a related concept), DO NOT refuse and DO NOT go blank — use your own expert knowledge to help them, while keeping it tied to "${projectTitle}" and consistent with the material.
- Stay within this project's scope: don't switch to teaching a DIFFERENT project, but freely use general knowledge to unblock the student on THIS one.

Now respond to the student's latest message. Remember: small step, plain English first, ask them to try. Stay on "${projectTitle}".`;
};

// Parse [advance:] / [checkpoint:] markers from the end of the response.
// Returns { cleanAnswer, advanceTopic, checkpoint }.
const parseTutorMarkers = (raw) => {
  if (!raw) return { cleanAnswer: '', advanceTopic: null, checkpoint: null };
  let cleanAnswer = raw;
  let advanceTopic = null;
  let checkpoint = null;
  const advanceMatch = raw.match(/\[advance:\s*([^\]]+)\]/i);
  if (advanceMatch) {
    advanceTopic = advanceMatch[1].trim();
    cleanAnswer = cleanAnswer.replace(advanceMatch[0], '');
  }
  const checkpointMatch = raw.match(/\[checkpoint:\s*([^\]]+)\]/i);
  if (checkpointMatch) {
    checkpoint = checkpointMatch[1].trim();
    cleanAnswer = cleanAnswer.replace(checkpointMatch[0], '');
  }
  return { cleanAnswer: cleanAnswer.trim(), advanceTopic, checkpoint };
};

// Defensive cap — if Claude ignores the 5-line code rule, truncate every
// code block to its first 5 lines and append an honest "(truncated)" note.
const enforceCodeLineCap = (answer) => {
  return String(answer || '').replace(/```([\s\S]*?)```/g, (full, body) => {
    const lines = body.split('\n');
    // Drop the language label line if present at top.
    const langLine = lines[0];
    const isLang = !langLine.includes(' ') && langLine.trim().length > 0 && langLine.trim().length < 20;
    const start = isLang ? 1 : 0;
    const codeLines = lines.slice(start);
    if (codeLines.length <= 5) return full;
    const kept = codeLines.slice(0, 5).join('\n');
    const lang = isLang ? langLine : '';
    return `\`\`\`${lang}\n${kept}\n// … (truncated — one step at a time)\n\`\`\``;
  });
};

const tutorAsk = async (req, res) => {
  try {
    const question = String(req.body.question || '').trim();
    if (!question) return res.status(400).json({ message: 'question is required' });
    const projectId = req.body.project_id ? parseInt(req.body.project_id, 10) : null;
    const mode = req.body.mode === 'presenter' ? 'presenter' : 'student';

    // A student asking about their OWN records/progress/standing is answered
    // straight from real scores + class leaderboard standing (with a little
    // encouragement), short-circuiting the project tutor flow. The chat sends
    // students through this endpoint, so the intercept has to live here too
    // (mirrors the one in askAi). Returns a tutor-shaped payload.
    if (req.user.role === 'student') {
      const studentRecords = await buildStudentProgressAnswer(req.user, question);
      if (studentRecords) {
        try {
          await persistTutorTurn({
            project_id: null,
            group_id: null,
            requester_type: req.user.role,
            requester_id: req.user.id,
            audience: 'student',
            question,
            answer: studentRecords.answer,
            sources: studentRecords.sources,
            metadata: { source: 'tutor', kind: 'records' },
          });
        } catch (e) {
          console.warn('tutorAsk: records persist failed:', e.message);
        }
        return res.status(200).json({
          session_id: null,
          answer: studentRecords.answer,
          current_topic: null,
          completed_topics: [],
          turn_count: 0,
          advanced: false,
          checkpoint: null,
          data_source: 'progress_records',
        });
      }
    }

    // ── Access gate + class scoping ──────────────────────────────────────
    // Without this, a teacher with no assignment to project X can POST
    // /api/ai/tutor with project_id=X and receive that project's chunks
    // rendered into a tutor answer — a real cross-class data leak path.
    // Load + verify access BEFORE we touch the session or the model.
    let project = null;
    let chunks = [];
    if (projectId) {
      project = await getProjectForTutor(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      const allowed = await canAccessProject(req.user, project);
      if (!allowed) return res.status(403).json({ message: 'Access denied' });
      chunks = await getChunksForTutor(projectId);
    } else {
      // No explicit project: Emrys must teach ONLY the project assigned to this
      // user's class — never free-build an arbitrary or unrelated project.
      // filterProjectsForUser already restricts to the user's class scope
      // (student: their class; teacher: their assigned classes).
      const allProjects = await getLearningProjects();
      const classProjects = await filterProjectsForUser(req.user, allProjects);

      if (classProjects.length === 0) {
        // Nothing is assigned to this class. Say so plainly and tell them to
        // contact their agent — do NOT fall back to generic warm-up questions
        // (e.g. "are you a great typer?"), which is confusing and goes nowhere.
        return res.status(200).json({
          session_id: null,
          answer: [
            'No project found for your class yet.',
            'Please contact your agent to have a project assigned. Once a project is assigned, I will teach it with you step by step.',
          ].join('\n\n'),
          current_topic: null,
          completed_topics: [],
          turn_count: 0,
          advanced: false,
          checkpoint: null,
          no_project_for_class: true,
        });
      }

      // Use the class's project (the single class project; if a class somehow
      // has more than one, take the first — students have exactly one class).
      project = classProjects[0];
      chunks = await getChunksForTutor(project.id);
    }

    // Use the RESOLVED project's id (project.id), not the raw request value —
    // for class-scoped sessions projectId is null but we still teach project.id,
    // and the session must record it so progress/topics persist correctly.
    const sessionProjectId = project ? project.id : projectId;
    const session = await getOrCreateActiveTutoringSession({
      userType: req.user.role,
      userId: req.user.id,
      projectId: sessionProjectId,
      mode,
    });

    const systemPrompt = buildTutorSystemPrompt(session, project, chunks);

    // Multi-turn payload: replay the session's stored turns, then append the
    // current user question.
    const priorTurns = Array.isArray(session.turns) ? session.turns : [];
    const messages = priorTurns
      .map(t => ({
        role: t.role === 'emrys' ? 'assistant' : 'user',
        content: String(t.content || ''),
      }))
      .concat([{ role: 'user', content: question }]);

    const raw = await callClaudeForTutor(systemPrompt, messages, 800);
    if (!raw) {
      return res.status(503).json({ message: 'AI service unavailable — set ANTHROPIC_API_KEY' });
    }
    const { cleanAnswer, advanceTopic, checkpoint } = parseTutorMarkers(raw);
    const finalAnswer = enforceCodeLineCap(cleanAnswer);

    // Persist both turns in one go (user, then emrys).
    await appendTutoringTurn(session.id, {
      role: 'user', content: question,
      lastAttempt: question.length > 30 ? question : null,
    });
    const updated = await appendTutoringTurn(session.id, {
      role: 'emrys', content: finalAnswer,
      advanceTopic, checkpoint,
    });

    // Mirror the turn into ai_interactions so getAiHistory (the cross-device
    // restore path) surfaces it. tagged with metadata.source='tutor' so the
    // client can filter if it ever needs to separate quick-answer from tutor
    // history. Best-effort — failures here don't break the response.
    try {
      await persistTutorTurn({
        project_id: sessionProjectId || null,
        group_id: null,
        requester_type: req.user.role,
        requester_id: req.user.id,
        audience: req.user.role,
        question,
        answer: finalAnswer,
        sources: [],
        metadata: {
          source: 'tutor',
          session_id: session.id,
          mode,
          turn_count: updated?.turn_count || 0,
          current_topic: updated?.current_topic || null,
        },
      });
    } catch (e) {
      console.warn('tutorAsk: persistTurn failed:', e.message);
    }

    return res.status(200).json({
      session_id: session.id,
      answer: finalAnswer,
      project: project ? minimalProject(project) : null,   // carries project_type for client routing
      current_topic: updated?.current_topic || null,
      completed_topics: updated?.completed_topics || [],
      turn_count: updated?.turn_count || 0,
      advanced: !!advanceTopic,
      checkpoint: checkpoint || null,
    });
  } catch (error) {
    console.error('tutorAsk error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const tutorEnd = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({ message: 'Invalid session id' });
    }
    // Authorize: only the original user may end their own session.
    const active = await getActiveTutoringSession({
      userType: req.user.role,
      userId: req.user.id,
      projectId: null, // We don't care about project — match on id directly below.
    }).catch(() => null);
    // (Soft check — if the session isn't active by TTL it's already effectively closed.)
    const ended = await endTutoringSession(sessionId);
    if (!ended) return res.status(404).json({ message: 'Session not found' });
    return res.status(200).json({
      session_id: ended.id,
      completed_topics: ended.completed_topics || [],
      turn_count: ended.turn_count || 0,
      ended_at: ended.ended_at,
    });
  } catch (error) {
    console.error('tutorEnd error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── Build Studio: dedicated 3D build-plan endpoint ──────────────────────────
// POST /api/ai/build-plan { topic }  →  { plan }
// Generates a structured 3D BUILD ANIMATION PLAN for any project. The system
// prompt lives here (server-side, not exposed to the client) and uses Claude
// prompt caching so the large prompt is cheap/fast on repeat calls. Returns
// validated JSON; the desktop Build Studio falls back to its own path if this
// endpoint is unavailable, so nothing breaks if AI is down.
const BUILD_PLAN_SYSTEM = `You are Emrys, an expert maker who can plan how to build ANY project — robotics, electronics, DIY hardware, mechanical, woodworking, science gadgets, anything documented anywhere on the internet. Use your full knowledge to produce a REAL, accurate, buildable plan, then express it as a 3D BUILD ANIMATION PLAN.
Return ONLY valid minified JSON (no prose, no markdown fences) matching this schema:
{"title":string,"summary":string,"difficulty":"beginner"|"intermediate"|"advanced","estimatedTime":string,"billOfMaterials":[{"name":string,"qty":number}],"steps":[{"title":string,"instruction":string,"parts":[{"name":string,"shape":"box"|"plate"|"cylinder"|"wheel"|"sphere"|"cone"|"capsule"|"torus"|"rod"|"tube"|"screw"|"gear"|"propeller"|"frame","size":{"x":num,"y":num,"z":num,"r":num,"h":num,"t":num,"teeth":num,"blades":num},"position":{"x":num,"y":num,"z":num},"rotation":{"x":deg,"y":deg,"z":deg},"from":{"x":num,"y":num,"z":num},"material":"metal"|"aluminum"|"plastic"|"pcb"|"copper"|"rubber"|"motor"|"battery"|"gold"|"silver"|"glass"|"wood"|"accent"|"cyan"|"wire"|"led"|"sensor","color":string,"sub":[{"shape":...,"size":{...},"offset":{"x":num,"y":num,"z":num},"rotation":{"x":deg,"y":deg,"z":deg},"material":...,"color":string}]}]}]}
Rules:
- Be FAITHFUL to how the project is really built — correct components, correct assembly order, correct relationships.
- Pick the BEST shape+material per real part (board=plate+pcb; motor=cylinder/box+motor; wheel=wheel+rubber; frame=frame or box+aluminum; sensor=box+sensor; LED=cylinder+led; wire=tube+wire; standoff/axle=rod; bolt=screw+metal; gear=gear+metal with "teeth"; propeller=propeller+plastic with "blades"; lens/screen=glass; wood parts=wood). Use "color" (hex) so distinct parts read clearly. Name each part with its REAL component name.
- DETAIL with "sub": for parts that are visually compound, add a "sub" array of extra shapes RELATIVE to the part (their "offset" is local to the part's position). Examples: a DC motor = cylinder body + a thin "rod" shaft sub + a small "box" mount sub; an ultrasonic sensor = box body + two "cylinder" eyes subs; a wheel = wheel + a "cylinder" hub sub; a screw = cylinder shank + a wider short "cylinder" head sub. Keep subs to 1-4 per part, only where they add realism. Subs inherit the part's material/color unless they set their own.
- World units ~cm scaled so the whole build fits ~6x6x6 centered near origin, on the ground (y>=0); sensible proportions; don't overlap parts that shouldn't touch.
- Build BOTTOM-UP in real assembly order. 5-9 steps. Every step introduces at least one part. Output JSON ONLY.`;

const generateBuildPlan = async (req, res) => {
  try {
    const topic = String(req.body?.topic || '').trim();
    if (!topic) return res.status(400).json({ message: 'topic required' });
    if (topic.length > 300) return res.status(400).json({ message: 'topic too long' });

    const Anthropic = require('@anthropic-ai/sdk');
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      return res.status(503).json({ message: 'AI service not configured' });
    }
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 4500,
      // Prompt caching on the big system block → cheaper + faster on repeats.
      system: [{ type: 'text', text: BUILD_PLAN_SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Build request: ${topic}` }],
    });

    const raw = (response.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();

    // Tolerant parse: strip fences, take the first balanced {...}, fix trailing commas.
    let text = raw.replace(/```(?:json)?\s*([\s\S]*?)```/i, '$1').trim();
    const s = text.indexOf('{'), e = text.lastIndexOf('}');
    let plan = null;
    if (s !== -1 && e > s) {
      const slice = text.slice(s, e + 1);
      try { plan = JSON.parse(slice); }
      catch { try { plan = JSON.parse(slice.replace(/,\s*([}\]])/g, '$1')); } catch (_) {} }
    }
    if (!plan || !Array.isArray(plan.steps) || !plan.steps.length) {
      return res.status(422).json({ message: 'Could not generate a valid plan', raw: raw.slice(0, 200) });
    }
    // Keep only steps that introduce renderable parts (matches the client viewer).
    plan.steps = plan.steps.filter(st => Array.isArray(st.parts) && st.parts.length);
    if (!plan.steps.length) return res.status(422).json({ message: 'Plan had no renderable parts' });

    // Best-effort usage log (non-fatal) so we can see what people build.
    try {
      await createAiInteraction({
        project_id: null, group_id: null, help_request_id: null,
        requester_type: req.user?.role || 'student', requester_id: req.user?.id,
        audience: (req.user?.role === 'student') ? 'student' : 'teacher',
        question: `[build-plan] ${topic}`, answer: plan.title || '', sources: [],
        metadata: requestMetadata(req),
      });
    } catch (_) {}

    return res.status(200).json({ plan });
  } catch (error) {
    console.error('Build plan error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ── Organic 3D generation (Tripo text-to-3D) ─────────────────────────────────
// Build Studio prefetches one organic mesh PER PART while Emrys is still teaching
// earlier steps, so by the time the animation reaches a step its real 3D model is
// ready. We use Tripo (genuinely-free API: free monthly + signup credits; Meshy's
// API is paywalled). The API key lives ONLY here (server-side); if it's unset OR
// out of credits, we respond `fallback:true` and the client silently uses its
// instant procedural geometry, so nothing breaks without a key.
//
// Two endpoints (shape is service-agnostic so the client never changes):
//   POST /api/ai/generate-3d        { prompt } -> { taskId }     (kick off a job)
//   GET  /api/ai/generate-3d/:id               -> { status, progress, glb? }
// The client kicks off jobs ahead of time and polls; we DON'T block one request
// for the whole job (that would tie up a worker + risk gateway timeouts).
//
// Tripo API: POST https://api.tripo3d.ai/v2/openapi/task {type:"text_to_model",
// prompt} -> {code:0,data:{task_id}}; GET .../task/:id -> data.status
// (queued|running|success|failed|...) + data.output.{pbr_model|model|base_model}.
const TRIPO_BASE = 'https://api.tripo3d.ai/v2/openapi';
const _genFetch = () => (global.fetch || ((...a) => import('node-fetch').then(({ default: f }) => f(...a))));
const _genKey = () => process.env.TRIPO_API_KEY || process.env.MESHY_API_KEY; // TRIPO preferred
const _genUnset = (k) => !k || k === 'your_tripo_api_key_here' || k === 'your_meshy_api_key_here';

// Normalise Tripo's status vocabulary to the SUCCEEDED/FAILED set the client uses.
function _normGenStatus(s) {
  const v = String(s || '').toLowerCase();
  if (v === 'success' || v === 'succeeded') return 'SUCCEEDED';
  if (v === 'failed' || v === 'cancelled' || v === 'canceled' || v === 'banned' || v === 'expired') return 'FAILED';
  return 'IN_PROGRESS'; // queued | running | unknown
}
// Tolerant pull of a GLB url from Tripo's task output (field names have varied).
function _genGlbUrl(out) {
  if (!out || typeof out !== 'object') return null;
  const cand = out.pbr_model || out.model || out.base_model || out.rendered_model || out.glb;
  if (typeof cand === 'string' && /^https?:\/\//.test(cand)) return cand;
  if (cand && typeof cand === 'object' && typeof cand.url === 'string') return cand.url;
  return null;
}

const generate3DPart = async (req, res) => {
  try {
    const prompt = String(req.body?.prompt || '').trim();
    if (!prompt) return res.status(400).json({ message: 'prompt required' });
    if (prompt.length > 300) return res.status(400).json({ message: 'prompt too long' });

    const key = _genKey();
    if (_genUnset(key)) {
      // No key configured → tell the client to use its procedural fallback.
      return res.status(503).json({ message: '3D generation not configured', fallback: true });
    }

    const fetch = _genFetch();
    const r = await fetch(`${TRIPO_BASE}/task`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'text_to_model',
        prompt: `${prompt}, single isolated object, clean studio model, neutral, centered`,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || (data && typeof data.code === 'number' && data.code !== 0)) {
      // Out of credits / rate limited / bad request → let client fall back.
      const st = (r.status === 402 || r.status === 429) ? r.status : 502;
      console.warn(`[3d] tripo create FAILED http=${r.status} code=${data?.code} msg=${data?.message || data?.suggestion || ''}`);
      return res.status(st).json({ message: data?.message || data?.suggestion || 'Tripo create failed', fallback: true });
    }
    const taskId = data?.data?.task_id || data?.data?.taskId || data?.task_id;
    if (!taskId) {
      console.warn('[3d] tripo create OK but no task_id; keys=' + Object.keys(data?.data || data || {}).join(','));
      return res.status(502).json({ message: 'No task id from 3D service', fallback: true });
    }
    console.log(`[3d] tripo task started id=${taskId} prompt="${prompt.slice(0, 60)}"`);
    return res.status(202).json({ taskId });
  } catch (error) {
    console.error('generate-3d error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error', fallback: true });
  }
};

const get3DPartStatus = async (req, res) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!id) return res.status(400).json({ message: 'id required' });
    const key = _genKey();
    if (_genUnset(key)) {
      return res.status(503).json({ message: '3D generation not configured', fallback: true });
    }
    const fetch = _genFetch();
    const r = await fetch(`${TRIPO_BASE}/task/${encodeURIComponent(id)}`, {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ message: data?.message || '3D poll failed', fallback: true });
    const d = data?.data || data;
    const status = _normGenStatus(d?.status);
    const glb = status === 'SUCCEEDED' ? _genGlbUrl(d?.output) : null;
    if (status === 'SUCCEEDED') console.log(`[3d] tripo task ${id} SUCCEEDED glb=${glb ? 'yes' : 'MISSING'}`);
    else if (status === 'FAILED') console.warn(`[3d] tripo task ${id} FAILED raw=${d?.status}`);
    return res.status(200).json({
      status,                                       // IN_PROGRESS | SUCCEEDED | FAILED
      progress: Number(d?.progress) || 0,
      glb,
    });
  } catch (error) {
    console.error('generate-3d status error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error', fallback: true });
  }
};

module.exports = {
  validateAskAi,
  validateRoadmapRequest,
  validateTeacherDailyReport,
  validateTeacherGroupProjectUpdate,
  validateAgentAskAi,
  validateAiHistoryRequest,
  askAi,
  agentAskAi,
  getAiHistory,
  getTeachingRoadmap,
  getTeachingDayLesson,
  getTeacherReports,
  submitTeacherDailyReport,
  submitTeacherGroupProjectUpdate,
  askWithAttachment,
  transcribeAudio,
  tutorAsk,
  tutorEnd,
  generateBuildPlan,
  generate3DPart,
  get3DPartStatus,
};
