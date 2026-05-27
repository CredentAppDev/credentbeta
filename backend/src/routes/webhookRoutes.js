const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { createTicket } = require('../models/ticketModel');
const { getCustomerByEmail, createCustomer } = require('../models/customerModel');
const { sendNotificationToRole } = require('../services/socketService');
const { emitTicketEvent } = require('../services/socketService');

// @route   POST /api/webhook/inbound-email
// @desc    Handle inbound emails from SendGrid
// @access  Public (verified by SendGrid signature)
router.post('/inbound-email', async (req, res) => {
  try {
    const {
      from,
      subject,
      text,
      html,
    } = req.body;

    if (!from || !subject) {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    // Extract email and name from from field
    // Format is usually "John Doe <john@example.com>" or just "john@example.com"
    let customerEmail = from;
    let customerName = 'Unknown';

    const emailMatch = from.match(/<(.+)>/);
    if (emailMatch) {
      customerEmail = emailMatch[1];
      customerName = from.split('<')[0].trim();
    }

    // Get or create customer
    let customer = await getCustomerByEmail(customerEmail);
    if (!customer) {
      customer = await createCustomer({
        full_name: customerName || customerEmail,
        email: customerEmail,
      });
    }

    // Get default category (first one available)
    const categoryResult = await pool.query(
      'SELECT id FROM categories ORDER BY id ASC LIMIT 1'
    );
    const category_id = categoryResult.rows[0]?.id || null;

    // Get system admin as creator
    const adminResult = await pool.query(
      `SELECT id FROM users WHERE role = 'admin' AND is_active = true LIMIT 1`
    );
    const created_by = adminResult.rows[0]?.id || null;

    // Create ticket from email
    const ticket = await createTicket({
      title: subject,
      description: text || html || 'No content',
      priority: 'normal',
      category_id,
      customer_id: customer.id,
      created_by,
    });

    // Notify agents
    await sendNotificationToRole({
      role: 'agent',
      type: 'ticket:created',
      title: 'New Ticket from Email',
      body: `Email from ${customerEmail}: "${subject}"`,
      reference_id: ticket.id,
      reference_type: 'ticket',
    });

    // Emit real-time event
    emitTicketEvent('ticket:created', ticket);

    console.log(`✅ Inbound email ticket created: #${ticket.id} from ${customerEmail}`);

    // SendGrid expects a 200 response
    res.status(200).json({ message: 'Webhook received', ticket_id: ticket.id });
  } catch (error) {
    console.error('Inbound email webhook error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
