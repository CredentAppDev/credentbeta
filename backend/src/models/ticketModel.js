const pool = require('../config/db');

const createTicketsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('open', 'pending', 'closed')),
      priority VARCHAR(20) DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
      assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      closed_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ticket_replies (
      id SERIAL PRIMARY KEY,
      ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      body TEXT NOT NULL,
      is_internal_note BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );

    ALTER TABLE tickets ADD COLUMN IF NOT EXISTS source VARCHAR(80);
    ALTER TABLE tickets ADD COLUMN IF NOT EXISTS support_channel_id INTEGER;
    ALTER TABLE tickets ADD COLUMN IF NOT EXISTS requester_type VARCHAR(40);
    ALTER TABLE tickets ADD COLUMN IF NOT EXISTS requester_id INTEGER;
  `;
  await pool.query(query);
  console.log('✅ Tickets table ready');
};

const getAllTickets = async (filters = {}, userRole, userId) => {
  let baseQuery = `
    SELECT 
      t.*,
      c.full_name as customer_name,
      c.email as customer_email,
      u.full_name as assigned_to_name,
      cat.name as category_name
    FROM tickets t
    LEFT JOIN customers c ON t.customer_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    WHERE 1=1
  `;

  const values = [];
  let paramCount = 1;

  // Filters
  if (filters.status) {
    baseQuery += ` AND t.status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  if (filters.priority) {
    baseQuery += ` AND t.priority = $${paramCount}`;
    values.push(filters.priority);
    paramCount++;
  }

  if (filters.category_id) {
    baseQuery += ` AND t.category_id = $${paramCount}`;
    values.push(filters.category_id);
    paramCount++;
  }

  if (filters.assigned_to) {
    baseQuery += ` AND t.assigned_to = $${paramCount}`;
    values.push(filters.assigned_to);
    paramCount++;
  }

  if (filters.search) {
    baseQuery += ` AND (
      t.title ILIKE $${paramCount} OR
      t.description ILIKE $${paramCount} OR
      c.full_name ILIKE $${paramCount} OR
      c.email ILIKE $${paramCount}
    )`;
    values.push(`%${filters.search}%`);
    paramCount++;
  }

  baseQuery += ' ORDER BY t.updated_at DESC';

  const result = await pool.query(baseQuery, values);
  return result.rows;
};

const getTicketById = async (id) => {
  const result = await pool.query(
    `SELECT 
      t.*,
      c.full_name as customer_name,
      c.email as customer_email,
      c.phone as customer_phone,
      c.company as customer_company,
      u.full_name as assigned_to_name,
      cat.name as category_name
    FROM tickets t
    LEFT JOIN customers c ON t.customer_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN categories cat ON t.category_id = cat.id
    WHERE t.id = $1`,
    [id]
  );
  return result.rows[0];
};

const createTicket = async ({
  title,
  description,
  priority,
  category_id,
  customer_id,
  assigned_to,
  created_by,
  source,
  support_channel_id,
  requester_type,
  requester_id
}) => {
  const result = await pool.query(
    `INSERT INTO tickets 
      (
        title,
        description,
        priority,
        category_id,
        customer_id,
        assigned_to,
        created_by,
        source,
        support_channel_id,
        requester_type,
        requester_id
      )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      title,
      description,
      priority || 'normal',
      category_id || null,
      customer_id,
      assigned_to || null,
      created_by || null,
      source || null,
      support_channel_id || null,
      requester_type || null,
      requester_id || null
    ]
  );
  return result.rows[0];
};

const updateTicket = async (id, fields) => {
  const {
    title, description, status,
    priority, category_id, assigned_to
  } = fields;

  const closedAt = status === 'closed' ? 'NOW()' : null;

  const result = await pool.query(
    `UPDATE tickets SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      priority = COALESCE($4, priority),
      category_id = COALESCE($5, category_id),
      assigned_to = COALESCE($6, assigned_to),
      updated_at = NOW(),
      closed_at = CASE 
        WHEN $3 = 'closed' THEN NOW() 
        ELSE closed_at 
      END
    WHERE id = $7
    RETURNING *`,
    [title, description, status, priority, category_id, assigned_to, id]
  );
  return result.rows[0];
};

const deleteTicket = async (id) => {
  await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
};

const getTicketReplies = async (ticketId) => {
  const query = `
    SELECT 
      tr.*,
      u.full_name as author_name,
      u.role as author_role
    FROM ticket_replies tr
    LEFT JOIN users u ON tr.author_id = u.id
    WHERE tr.ticket_id = $1
    ORDER BY tr.created_at ASC
  `;

  const result = await pool.query(query, [ticketId]);
  return result.rows;
};

const addReply = async ({
  ticket_id, author_id, body, is_internal_note
}) => {
  const result = await pool.query(
    `INSERT INTO ticket_replies 
      (ticket_id, author_id, body, is_internal_note)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ticket_id, author_id, body, is_internal_note || false]
  );

  // Update ticket updated_at
  await pool.query(
    'UPDATE tickets SET updated_at = NOW() WHERE id = $1',
    [ticket_id]
  );

  return result.rows[0];
};

const getCustomerTickets = async (customerId) => {
  const result = await pool.query(
    `SELECT t.*, cat.name as category_name
     FROM tickets t
     LEFT JOIN categories cat ON t.category_id = cat.id
     WHERE t.customer_id = $1
     ORDER BY t.created_at DESC`,
    [customerId]
  );
  return result.rows;
};

module.exports = {
  createTicketsTable,
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketReplies,
  addReply,
  getCustomerTickets,
};
