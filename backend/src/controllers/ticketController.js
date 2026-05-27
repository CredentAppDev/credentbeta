const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketReplies,
  addReply,
} = require('../models/ticketModel');
const { getCustomerById } = require('../models/customerModel');
const {
  sendTicketCreatedEmail,
  sendTicketReplyEmail,
  sendTicketClosedEmail,
} = require('../services/emailService');
const {
  sendNotificationToUser,
  sendNotificationToRole,
  emitTicketEvent,
} = require('../services/socketService');

// ─── Get All Tickets ─────────────────────────────────────────────
const getTickets = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      category_id: req.query.category_id,
      assigned_to: req.query.assigned_to,
      search: req.query.search,
    };

    const tickets = await getAllTickets(
      filters,
      req.user.role,
      req.user.id
    );

    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Single Ticket ───────────────────────────────────────────
const getTicket = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const replies = await getTicketReplies(req.params.id);

    res.status(200).json({ ticket, replies });
  } catch (error) {
    console.error('Get ticket error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Create Ticket ───────────────────────────────────────────────
const createNewTicket = async (req, res) => {
  try {
    const {
      title, description, priority,
      category_id, customer_id, assigned_to
    } = req.body;

    if (!title || !description || !customer_id) {
      return res.status(400).json({
        message: 'Title, description and customer are required'
      });
    }

    const ticket = await createTicket({
      title,
      description,
      priority,
      category_id,
      customer_id,
      assigned_to,
      created_by: req.user.id,
    });

    // Send email to customer
    const customer = await getCustomerById(customer_id);
    if (customer) {
      await sendTicketCreatedEmail({
        customerEmail: customer.email,
        customerName: customer.full_name,
        agentName: req.user.full_name,
        description: ticket.description,
      });
    }

    // Notify assigned agent if ticket was assigned
    if (assigned_to) {
      await sendNotificationToUser({
        userId: assigned_to,
        type: 'ticket:assigned',
        title: 'Ticket Assigned to You',
        body: `Ticket "${ticket.title}" has been assigned to you`,
        reference_id: ticket.id,
        reference_type: 'ticket',
      });
    }

    // Notify all agents of new ticket
    await sendNotificationToRole({
      role: 'agent',
      type: 'ticket:created',
      title: 'New Ticket Created',
      body: `A new ticket "${ticket.title}" has been submitted`,
      reference_id: ticket.id,
      reference_type: 'ticket',
    });

    // Notify agents if high or urgent priority
    if (priority === 'high' || priority === 'urgent') {
      await sendNotificationToRole({
        role: 'agent',
        type: 'ticket:high_priority',
        title: '⚠️ High Priority Ticket',
        body: `A ${priority} priority ticket "${ticket.title}" has been submitted`,
        reference_id: ticket.id,
        reference_type: 'ticket',
      });
    }

    // Emit real-time event
    emitTicketEvent('ticket:created', ticket);

    res.status(201).json({ message: 'Ticket created', ticket });
  } catch (error) {
    console.error('Create ticket error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
  
// ─── Update Ticket ───────────────────────────────────────────────
const editTicket = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const { status, priority, assigned_to, category_id } = req.body;

    const updated = await updateTicket(req.params.id, req.body);

    // Send closed email to customer
    if (status === 'closed') {
      const customer = await getCustomerById(ticket.customer_id);
      if (customer) {
        await sendTicketClosedEmail({
          customerEmail: customer.email,
          customerName: customer.full_name,
          agentName: req.user.full_name,
        });
      }
    }

    // Notify assigned agent if ticket was assigned
    if (assigned_to) {
      await sendNotificationToUser({
        userId: assigned_to,
        type: 'ticket:assigned',
        title: 'Ticket Assigned to You',
        body: `Ticket "${ticket.title}" has been assigned to you`,
        reference_id: ticket.id,
        reference_type: 'ticket',
      });
    }

    // Notify agents if ticket was closed
    if (status === 'closed') {
      await sendNotificationToRole({
        role: 'agent',
        type: 'ticket:closed',
        title: 'Ticket Closed',
        body: `Ticket "${ticket.title}" has been closed`,
        reference_id: ticket.id,
        reference_type: 'ticket',
      });
    }

    // Notify agents if priority changed to high or urgent
    if (priority === 'high' || priority === 'urgent') {
      await sendNotificationToRole({
        role: 'agent',
        type: 'ticket:high_priority',
        title: '⚠️ High Priority Ticket',
        body: `Ticket "${ticket.title}" has been set to ${priority} priority`,
        reference_id: ticket.id,
        reference_type: 'ticket',
      });
    }

    // Emit real-time event
    emitTicketEvent('ticket:updated', updated);

    // Emit specific closed event when ticket is closed
    if (status === 'closed') {
      emitTicketEvent('ticket:closed', updated);
    }

    res.status(200).json({ message: 'Ticket updated', ticket: updated });
  } catch (error) {
    console.error('Update ticket error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Delete Ticket ───────────────────────────────────────────────
const removeTicket = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await deleteTicket(req.params.id);
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (error) {
    console.error('Delete ticket error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Add Reply or Internal Note ──────────────────────────────────
const addTicketReply = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const { body, is_internal_note } = req.body;
    if (!body) {
      return res.status(400).json({ message: 'Reply body is required' });
    }

    const reply = await addReply({
      ticket_id: req.params.id,
      author_id: req.user.id,
      body,
      is_internal_note: is_internal_note || false,
    });

    // Send email only for public replies
    if (!is_internal_note) {
      const customer = await getCustomerById(ticket.customer_id);
      if (customer) {
        await sendTicketReplyEmail({
          customerEmail: customer.email,
          customerName: customer.full_name,
          replyBody: body,
          agentName: req.user.full_name,
        });
      }
    }

    // Notify assigned agent of new reply
    if (ticket.assigned_to && ticket.assigned_to !== req.user.id) {
      await sendNotificationToUser({
        userId: ticket.assigned_to,
        type: 'ticket:reply',
        title: 'New Reply on Ticket',
        body: `${req.user.full_name} replied on ticket "${ticket.title}"`,
        reference_id: ticket.id,
        reference_type: 'ticket',
      });
    }

    // Emit real-time event
    emitTicketEvent('ticket:reply', { ticket_id: ticket.id, reply });

    res.status(201).json({ message: 'Reply added', reply });
  } catch (error) {
    console.error('Add reply error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Get Ticket Replies ──────────────────────────────────────────
const getTicketRepliesHandler = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const replies = await getTicketReplies(req.params.id);

    res.status(200).json({ replies });
  } catch (error) {
    console.error('Get replies error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTickets,
  getTicket,
  createNewTicket,
  editTicket,
  removeTicket,
  addTicketReply,
  getTicketRepliesHandler,
};
