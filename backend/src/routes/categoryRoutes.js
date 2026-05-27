const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { isAgent, isAdmin } = require('../middleware/roles');

// All category routes require login
router.use(protect);

// @route   GET /api/categories
// @access  All agents
router.get('/', isAgent, getCategories);

// @route   GET /api/categories/:id
// @access  All agents
router.get('/:id', isAgent, getCategory);

// @route   POST /api/categories
// @access  Admin only
router.post('/', isAdmin, addCategory);

// @route   PATCH /api/categories/:id
// @access  Admin only
router.patch('/:id', isAdmin, editCategory);

// @route   DELETE /api/categories/:id
// @access  Admin only
router.delete('/:id', isAdmin, removeCategory);

module.exports = router;