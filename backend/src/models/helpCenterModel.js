const pool = require('../config/db');

const createHelpCenterTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS help_articles (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100),
      is_published BOOLEAN DEFAULT true,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Help center table ready');
};

const getAllArticles = async (search = null) => {
  let query = `
    SELECT id, title, category, is_published, created_at
    FROM help_articles
    WHERE is_published = true
  `;
  const values = [];

  if (search) {
    query += ` AND (title ILIKE $1 OR content ILIKE $1)`;
    values.push(`%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, values);
  return result.rows;
};

const getArticleById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM help_articles WHERE id = $1 AND is_published = true',
    [id]
  );
  return result.rows[0];
};

const createArticle = async ({ title, content, category, created_by }) => {
  const result = await pool.query(
    `INSERT INTO help_articles (title, content, category, created_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, category || null, created_by]
  );
  return result.rows[0];
};

const updateArticle = async (id, { title, content, category, is_published }) => {
  const result = await pool.query(
    `UPDATE help_articles SET
      title = COALESCE($1, title),
      content = COALESCE($2, content),
      category = COALESCE($3, category),
      is_published = COALESCE($4, is_published),
      updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [title, content, category, is_published, id]
  );
  return result.rows[0];
};

const deleteArticle = async (id) => {
  await pool.query('DELETE FROM help_articles WHERE id = $1', [id]);
};

module.exports = {
  createHelpCenterTable,
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};