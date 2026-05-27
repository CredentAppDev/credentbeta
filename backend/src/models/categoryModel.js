const pool = require('../config/db');

const createCategoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ Categories table ready');
};

const getAllCategories = async () => {
  const result = await pool.query(
    `SELECT c.*, u.full_name as created_by_name
     FROM categories c
     LEFT JOIN users u ON c.created_by = u.id
     ORDER BY c.name ASC`
  );
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const createCategory = async ({ name, description, created_by }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description || null, created_by]
  );
  return result.rows[0];
};

const updateCategory = async (id, { name, description }) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = COALESCE($1, name),
         description = COALESCE($2, description)
     WHERE id = $3
     RETURNING *`,
    [name, description, id]
  );
  return result.rows[0];
};

const deleteCategory = async (id) => {
  await pool.query(
    'DELETE FROM categories WHERE id = $1',
    [id]
  );
};

module.exports = {
  createCategoriesTable,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};