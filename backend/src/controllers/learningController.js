const { body, validationResult } = require('express-validator');
const {
  createLearningProject,
  getLearningProjects,
  getLearningProjectById,
  addLearningContentChunk,
  getLearningContentChunks,
  addLearningProjectAsset,
  getLearningProjectAssets,
  addLearningRoadmapDay,
  getLearningRoadmapDays,
} = require('../models/learningModel');
const {
  canAccessProject,
  filterProjectsForUser,
} = require('../services/projectAccessService');

const validateProject = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('subject').optional().trim(),
  body('grade').trim().notEmpty().withMessage('grade is required'),
  body('class_name').trim().notEmpty().withMessage('class_name is required'),
  body('description').optional().trim(),
  body('learning_goals').optional().trim(),
  body('difficulty_level').optional().trim(),
  body('duration_months').optional().isInt({ min: 1 }).withMessage('duration_months must be a positive integer'),
  body('expected_section_count').optional().isInt({ min: 1 }).withMessage('expected_section_count must be a positive integer'),
];

const validateContentChunk = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('content').trim().notEmpty().withMessage('content is required'),
  body('audience').optional().isIn(['student', 'teacher', 'both']).withMessage('audience must be student, teacher or both'),
  body('step_number').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage('step_number must be a positive integer'),
];

const validateAsset = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('file_name').trim().notEmpty().withMessage('file_name is required'),
  body('file_path').trim().notEmpty().withMessage('file_path is required'),
];

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

const requireProjectAccess = async (req, res, project) => {
  if (await canAccessProject(req.user, project)) return true;

  res.status(403).json({ message: 'Project access denied for this class' });
  return false;
};

const sanitizeAssetsForUser = (user, assets) => {
  if (['admin', 'agent'].includes(user.role)) {
    return assets;
  }

  return assets.map(({ file_path, ...asset }) => asset);
};

const buildDefaultRoadmapDays = (project) => {
  const totalSections = Math.max(1, Number(project.expected_section_count) || 16);
  return Array.from({ length: totalSections }, (_, index) => {
    const dayNumber = index + 1;
    const sectionLabel = `Section ${dayNumber}`;
    return {
      day_number: dayNumber,
      month_number: Math.floor(index / 4) + 1,
      week_number: (index % 4) + 1,
      section_number: dayNumber,
      section_label: sectionLabel,
      title: `${project.title} - ${sectionLabel}`,
      teacher_goal: `Guide learners through ${sectionLabel.toLowerCase()} of ${project.title}.`,
      student_goal: `Understand and practice the key ideas for ${sectionLabel.toLowerCase()}.`,
      activities: [
        'Review the previous lesson briefly',
        'Introduce the section concept with a practical example',
        'Let learners practice and ask questions',
        'Close with a quick check for understanding',
      ],
      materials: [
        project.source_doc_name || 'Approved project content',
        'Student devices or notebooks',
      ],
      code_explanation_focus: project.code_explanation_required
        ? 'Explain any code or keyboard steps in plain language before students practice.'
        : 'Explain the practical steps clearly before students practice.',
      end_of_day_checklist: [
        'Students attempted the main task',
        'Teacher recorded areas of confusion',
        'Support needs were noted for the next lesson',
      ],
      teacher_report_prompts: [
        'What did students complete today?',
        'What did students understand well?',
        'Where did students need support?',
      ],
      next_day_prep: `Prepare the next section of ${project.title} and bring forward any support needs from today.`,
    };
  });
};

const ensureDefaultRoadmap = async (project) => {
  const existingDays = await getLearningRoadmapDays(project.id);
  if (existingDays.length > 0) return;

  const days = buildDefaultRoadmapDays(project);
  for (const day of days) {
    await addLearningRoadmapDay(project.id, day);
  }
};

const listProjects = async (req, res) => {
  try {
    const includeInactive = req.user.role === 'admin' && req.query.includeInactive === 'true';
    const projects = await getLearningProjects({ includeInactive });
    const visibleProjects = await filterProjectsForUser(req.user, projects);
    res.status(200).json({ projects: visibleProjects });
  } catch (error) {
    console.error('List learning projects error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createProject = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    const project = await createLearningProject({
      ...req.body,
      created_by_role: req.user.role,
      created_by_id: req.user.id,
    });
    await ensureDefaultRoadmap(project);

    res.status(201).json({ message: 'Learning project saved', project });
  } catch (error) {
    console.error('Create learning project error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const listProjectContent = async (req, res) => {
  try {
    const project = await getLearningProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found' });
    }
    if (!(await requireProjectAccess(req, res, project))) return;

    const audience = req.query.audience || 'both';
    const content = await getLearningContentChunks(req.params.id, audience);
    res.status(200).json({ project, content });
  } catch (error) {
    console.error('List learning content error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProjectContent = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    const project = await getLearningProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found' });
    }
    if (!(await requireProjectAccess(req, res, project))) return;

    const content = await addLearningContentChunk(req.params.id, req.body);
    res.status(201).json({ message: 'Learning content added', content });
  } catch (error) {
    console.error('Add learning content error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const listProjectAssets = async (req, res) => {
  try {
    const project = await getLearningProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found' });
    }
    if (!(await requireProjectAccess(req, res, project))) return;

    const assets = await getLearningProjectAssets(req.params.id);
    res.status(200).json({ project, assets: sanitizeAssetsForUser(req.user, assets) });
  } catch (error) {
    console.error('List learning assets error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProjectAsset = async (req, res) => {
  try {
    if (!checkValidation(req, res)) return;

    const project = await getLearningProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Learning project not found' });
    }
    if (!(await requireProjectAccess(req, res, project))) return;

    const asset = await addLearningProjectAsset(req.params.id, req.body);
    res.status(201).json({ message: 'Learning asset added', asset });
  } catch (error) {
    console.error('Add learning asset error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProjectAsset = async (req, res) => {
  try {
    const project = await getLearningProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Learning project not found' });
    if (!(await requireProjectAccess(req, res, project))) return;

    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const asset = await addLearningProjectAsset(req.params.id, {
      title: req.body.title || req.file.originalname,
      file_name: req.file.originalname,
      file_path: `/uploads/learning/${req.file.filename}`,
      asset_type: req.body.asset_type || 'file',
      mime_type: req.file.mimetype,
    });

    res.status(201).json({ message: 'Asset uploaded', asset });
  } catch (error) {
    console.error('Upload learning asset error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  validateProject,
  validateContentChunk,
  validateAsset,
  listProjects,
  createProject,
  listProjectContent,
  addProjectContent,
  listProjectAssets,
  addProjectAsset,
  uploadProjectAsset,
};
