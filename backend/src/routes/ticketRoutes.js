const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  createNewTicket,
  editTicket,
  removeTicket,
  addTicketReply,
  getTicketRepliesHandler,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const { isAgent, isAdmin } = require('../middleware/roles');

// All ticket routes require login
router.use(protect);

// @route   GET /api/tickets
// @access  All agents (agents see only assigned)
router.get('/', isAgent, getTickets);

// @route   POST /api/tickets
// @access  All agents
router.post('/', isAgent, createNewTicket);

// @route   GET /api/tickets/:id
// @access  All agents
router.get('/:id', isAgent, getTicket);

// @route   PATCH /api/tickets/:id
// @access  All agents (with role restrictions inside)
router.patch('/:id', isAgent, editTicket);

// @route   DELETE /api/tickets/:id
// @access  Admin only
router.delete('/:id', isAdmin, removeTicket);

// @route   GET /api/tickets/:id/replies
// @access  All agents
router.get('/:id/replies', isAgent, getTicketRepliesHandler);

// @route   POST /api/tickets/:id/replies
// @access  All agents
router.post('/:id/replies', isAgent, addTicketReply);

module.exports = router;