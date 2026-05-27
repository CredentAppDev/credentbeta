const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../models/categoryModel');

// ─── Get All Categories ──────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get categories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Single Category ─────────────────────────────────────────
const getCategory = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.error('Get category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Create Category ─────────────────────────────────────────────
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await createCategory({
      name,
      description,
      created_by: req.user.id,
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Category name already exists' });
    }
    console.error('Create category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Update Category ─────────────────────────────────────────────
const editCategory = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updated = await updateCategory(req.params.id, req.body);
    res.status(200).json({ message: 'Category updated', category: updated });
  } catch (error) {
    console.error('Update category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Delete Category ─────────────────────────────────────────────
const removeCategory = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await deleteCategory(req.params.id);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
};