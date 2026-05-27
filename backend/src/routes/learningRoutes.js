const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const { isAgent } = require('../middleware/roles');
const {
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
} = require('../controllers/learningController');

// On Render free tier the local FS is wiped on every deploy. Set UPLOAD_DIR
// to a persistent disk mount path (e.g. /var/data/uploads) to keep files.
// Fallback: in-repo ./uploads — fine locally, ephemeral on Render.
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const LEARNING_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'learning');

const learningStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(LEARNING_UPLOAD_DIR, { recursive: true });
    cb(null, LEARNING_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, `asset-${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const uploadLearning = multer({
  storage: learningStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = express.Router();

router.get('/projects', protect, listProjects);
router.post('/projects', protect, isAgent, validateProject, createProject);

router.get('/projects/:id/content', protect, listProjectContent);
router.post('/projects/:id/content', protect, isAgent, validateContentChunk, addProjectContent);

router.get('/projects/:id/assets', protect, listProjectAssets);
router.post('/projects/:id/assets', protect, isAgent, validateAsset, addProjectAsset);
router.post('/projects/:id/assets/upload', protect, isAgent, uploadLearning.single('file'), uploadProjectAsset);

module.exports = router;
