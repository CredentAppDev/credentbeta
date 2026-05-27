const pool = require('../config/db');

const createCustomersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      company VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ Customers table ready');
};

const getAllCustomers = async () => {
  const result = await pool.query(
    'SELECT * FROM customers ORDER BY created_at DESC'
  );
  return result.rows;
};

const getCustomerById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM customers WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getCustomerByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM customers WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const createCustomer = async ({ full_name, email, phone, company }) => {
  const result = await pool.query(
    `INSERT INTO customers (full_name, email, phone, company)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [full_name, email, phone || null, company || null]
  );
  return result.rows[0];
};

const updateCustomer = async (id, { full_name, email, phone, company }) => {
  const result = await pool.query(
    `UPDATE customers
     SET full_name = COALESCE($1, full_name),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         company = COALESCE($4, company),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [full_name, email, phone, company, id]
  );
  return result.rows[0];
};

module.exports = {
  createCustomersTable,
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
};