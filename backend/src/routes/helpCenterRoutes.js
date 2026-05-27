const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  addArticle,
  editArticle,
  removeArticle,
} = require('../controllers/helpCenterController');
const { protect } = require('../middleware/auth');
const { isAgent, isAdmin } = require('../middleware/roles');

// @route   GET /api/help
// @desc    Get all published articles (public)
router.get('/', getArticles);

// @route   GET /api/help/:id
// @desc    Get single article (public)
router.get('/:id', getArticle);

// @route   POST /api/help
// @desc    Create article (Admin only)
router.post('/', protect, isAdmin, addArticle);

// @route   PATCH /api/help/:id
// @desc    Update article (Admin only)
router.patch('/:id', protect, isAdmin, editArticle);

// @route   DELETE /api/help/:id
// @desc    Delete article (Admin only)
router.delete('/:id', protect, isAdmin, removeArticle);

module.exports = router;