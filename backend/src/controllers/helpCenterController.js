const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../models/helpCenterModel');

// ─── Get All Articles ────────────────────────────────────────────
const getArticles = async (req, res) => {
  try {
    const search = req.query.search || null;
    const articles = await getAllArticles(search);
    res.status(200).json({ articles });
  } catch (error) {
    console.error('Get articles error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Single Article ──────────────────────────────────────────
const getArticle = async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json({ article });
  } catch (error) {
    console.error('Get article error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Create Article ──────────────────────────────────────────────
const addArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const article = await createArticle({
      title, content, category,
      created_by: req.user.id
    });
    res.status(201).json({ message: 'Article created', article });
  } catch (error) {
    console.error('Create article error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Update Article ──────────────────────────────────────────────
const editArticle = async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const updated = await updateArticle(req.params.id, req.body);
    res.status(200).json({ message: 'Article updated', article: updated });
  } catch (error) {
    console.error('Update article error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Delete Article ──────────────────────────────────────────────
const removeArticle = async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    await deleteArticle(req.params.id);
    res.status(200).json({ message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getArticles,
  getArticle,
  addArticle,
  editArticle,
  removeArticle,
};