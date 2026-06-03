const { body, validationResult } = require('express-validator');
const {
  createLearningProject,
  getLearningProjects,
  getLearningProjectById,
  addLearningContentChunk,
  getLearningContentChunks,
  replaceLearningContentChunks,
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

// Upload ONE PDF that contains all of a project's content. We extract its text,
// ask Claude to organise it into clean titled lesson chunks, and REPLACE the
// project's content chunks with them — so Emrys/Build teach grounded in this PDF.
// Agent/admin only (route-guarded). Uses pdf-parse (already a dependency).
const uploadProjectContentPdf = async (req, res) => {
  try {
    const project = await getLearningProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Learning project not found' });
    if (!(await requireProjectAccess(req, res, project))) return;
    if (!req.file) return res.status(400).json({ message: 'PDF file is required' });
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'File must be a PDF' });
    }

    // 1) Extract text from the PDF buffer. pdf-parse v2 exposes a PDFParse class:
    //    new PDFParse({ data: buffer }) → await getText() → { text }.
    let text = '';
    try {
      const { PDFParse } = require('pdf-parse');
      const parser = new PDFParse({ data: req.file.buffer });
      const parsed = await parser.getText();
      try { await parser.destroy?.(); } catch (_) {}
      const _nbsp = String.fromCharCode(160);
      text = String(parsed.text || '')
        .split(_nbsp).join(' ')
        .replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gim, '')  // strip pdf-parse page markers
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    } catch (e) {
      console.error('PDF parse failed:', e.message);
      return res.status(422).json({ message: 'Could not read this PDF. Make sure it has selectable text (not a scan).' });
    }
    if (text.length < 30) {
      return res.status(422).json({ message: 'This PDF had almost no readable text (it may be a scanned image).' });
    }
    // Cap to keep the AI call bounded (≈ first ~40k chars ~ a long doc).
    const docText = text.slice(0, 40000);

    // 2) Ask Claude to structure the text into titled lesson chunks (JSON).
    let chunks = null;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'your_anthropic_api_key_here') {
      try {
        const Anthropic = require('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey });
        const sys = `You organise raw lesson/document text into a clean, ordered set of teaching chunks for an AI tutor to quote from. Return ONLY minified JSON: {"chunks":[{"title":string,"content":string,"step_number":number}]}. Rules: preserve the document's real content and order; 5-25 chunks; each chunk one coherent topic/section with a short clear title; keep code/commands/steps intact inside content; step_number is the 1-based order; do not invent material not in the text.`;
        const resp = await anthropic.messages.create({
          model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
          max_tokens: 6000,
          system: [{ type: 'text', text: sys, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: `Project: ${project.title}\n\nDocument text:\n${docText}` }],
        });
        const raw = (resp.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
        const slice = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
        let obj = null;
        try { obj = JSON.parse(slice); }
        catch { try { obj = JSON.parse(slice.replace(/,\s*([}\]])/g, '$1')); } catch (_) {} }
        if (obj && Array.isArray(obj.chunks)) {
          chunks = obj.chunks
            .filter(c => c && c.content && String(c.content).trim())
            .map((c, i) => ({
              title: String(c.title || `Section ${i + 1}`).slice(0, 250),
              content: String(c.content).trim(),
              step_number: Number.isFinite(c.step_number) ? c.step_number : (i + 1),
              source_type: 'pdf',
              audience: 'both',
            }));
        }
      } catch (e) {
        console.warn('PDF AI-structuring failed, will fall back to paragraph split:', e.message);
      }
    }

    // 3) Fallback: if AI structuring unavailable/failed, split on blank lines.
    if (!chunks || !chunks.length) {
      const blocks = docText.split(/\n\s*\n+/).map(s => s.trim()).filter(s => s.length > 40);
      chunks = blocks.slice(0, 40).map((b, i) => ({
        title: (b.split('\n')[0] || `Section ${i + 1}`).slice(0, 120),
        content: b,
        step_number: i + 1,
        source_type: 'pdf',
        audience: 'both',
      }));
    }
    if (!chunks.length) return res.status(422).json({ message: 'Could not derive any content from this PDF.' });

    // 4) Replace the project's content chunks with the PDF-derived ones.
    const created = await replaceLearningContentChunks(req.params.id, chunks);

    // 5) Best-effort: record the source PDF name on the project + as an asset.
    try {
      await createLearningProject({ ...project, source_doc_name: req.file.originalname });
    } catch (_) {}

    return res.status(201).json({
      message: `Project content set from PDF — ${chunks.length} sections.`,
      count: chunks.length,
      chunks: created || chunks,
    });
  } catch (error) {
    console.error('Upload project content PDF error:', error.message);
    return res.status(500).json({ message: 'Server error' });
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
  uploadProjectContentPdf,
};
