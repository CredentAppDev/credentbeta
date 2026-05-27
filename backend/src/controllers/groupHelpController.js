const {
  createGroupHelpRequest,
  getGroupHelpRequestById,
  getGroupHelpRequests,
  getGroupHelpRequestsByGroup,
  assignTeacherToHelpRequest,
  updateGroupHelpRequestStatus,
  closeTeacherGroupSession,
  addGroupMessage,
  getGroupMessages,
  getGroupMessagesByHelpRequest,
} = require('../models/schoolModel');

const {
  createTicket,
  updateTicket,
} = require('../models/ticketModel');

const {
  emitTicketEvent,
  sendNotificationToUser,
} = require('../services/socketService');

const VALID_HELP_REQUEST_STATUSES = new Set([
  'open',
  'assigned',
  'active',
  'resolved',
  'closed',
]);

const normalizeHelpRequestStatus = (status) => {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  // Keep backward compatibility with older frontend status names.
  if (normalized === 'in_progress') {
    return 'active';
  }

  return normalized;
};

// ── Create Help Request From Student Group ────────────────────────
const createHelpRequestHandler = async (req, res) => {
  try {
    const {
      group_id,
      requested_by_student_id,
      title,
      description,
      priority,
      category_id,
      customer_id,
      assigned_agent_id,
    } = req.body;

    if (!group_id || !requested_by_student_id || !title) {
      return res.status(400).json({
        message: 'group_id, requested_by_student_id and title are required',
      });
    }

    // Create linked ticket record first
    const ticket = await createTicket({
      title,
      description: description || title,
      priority: priority || 'normal',
      category_id: category_id || null,
      customer_id: customer_id || null,
      assigned_to: assigned_agent_id || null,
      created_by: req.user?.id || null,
    });

    const helpRequest = await createGroupHelpRequest({
      group_id,
      requested_by_student_id,
      ticket_id: ticket.id,
      assigned_agent_id: assigned_agent_id || null,
      title,
      description: description || null,
      priority: priority || 'normal',
    });

    await addGroupMessage({
      group_id,
      help_request_id: helpRequest.id,
      sender_type: 'system',
      sender_id: null,
      body: `Help request created: ${title}`,
      message_type: 'system',
    });

    res.status(201).json({
      message: 'Help request created successfully',
      helpRequest,
      ticket,
    });

    // Emit real-time assistance events
    emitTicketEvent('ticket.created.assistance', {
      helpRequest,
      ticket,
      group_id: group_id,
    });

    if (assigned_agent_id) {
      emitTicketEvent('ticket.assigned.agent', {
        helpRequest,
        ticket,
        agent_id: assigned_agent_id,
      });
    }
  } catch (error) {
    console.error('Create help request error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Get All Help Requests ─────────────────────────────────────────
const getHelpRequestsHandler = async (req, res) => {
  try {
    const helpRequests = await getGroupHelpRequests();
    res.status(200).json({ helpRequests });
  } catch (error) {
    console.error('Get help requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Get Single Help Request ───────────────────────────────────────
const getHelpRequestHandler = async (req, res) => {
  try {
    const helpRequest = await getGroupHelpRequestById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    const messages = await getGroupMessagesByHelpRequest(
      req.params.id,
      req.user ? { role: req.user.role, id: req.user.id } : null
    );

    res.status(200).json({ helpRequest, messages });
  } catch (error) {
    console.error('Get help request error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Get Help Requests For A Group ─────────────────────────────────
const getGroupHelpRequestsHandler = async (req, res) => {
  try {
    const helpRequests = await getGroupHelpRequestsByGroup(req.params.groupId);
    res.status(200).json({ helpRequests });
  } catch (error) {
    console.error('Get group help requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Assign Teacher To Help Request ────────────────────────────────
const assignTeacherHandler = async (req, res) => {
  try {
    const { teacher_id } = req.body;

    if (!teacher_id) {
      return res.status(400).json({ message: 'teacher_id is required' });
    }

    const helpRequest = await getGroupHelpRequestById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    const updated = await assignTeacherToHelpRequest(
      req.params.id,
      teacher_id,
      req.user.id
    );

    if (helpRequest.ticket_id) {
      await updateTicket(helpRequest.ticket_id, {
        status: 'pending',
      });
    }

    await addGroupMessage({
      group_id: helpRequest.group_id,
      help_request_id: helpRequest.id,
      sender_type: 'system',
      sender_id: null,
      body: `Teacher assigned to this group help request`,
      message_type: 'system',
    });

    res.status(200).json({
      message: 'Teacher assigned successfully',
      helpRequest: updated,
    });

    // Emit real-time events for teacher assignment workflow
    emitTicketEvent('ticket.assigned.teacher', {
      helpRequest: updated,
      teacher_id,
      assigned_by: req.user.id,
    });

    emitTicketEvent('teacher.joined.group', {
      helpRequest: updated,
      teacher_id,
      group_id: helpRequest.group_id,
    });

    emitTicketEvent('teacher.accepted.case', {
      helpRequest: updated,
      teacher_id,
    });
  } catch (error) {
    console.error('Assign teacher error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Update Help Request Status ────────────────────────────────────
const updateHelpRequestStatusHandler = async (req, res) => {
  try {
    const normalizedStatus = normalizeHelpRequestStatus(req.body?.status);

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'status is required' });
    }

    if (!VALID_HELP_REQUEST_STATUSES.has(normalizedStatus)) {
      return res.status(400).json({
        message: 'status must be one of: open, assigned, active, resolved, closed',
      });
    }

    const helpRequest = await getGroupHelpRequestById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    const updated = await updateGroupHelpRequestStatus(req.params.id, normalizedStatus);

    if (!updated) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    if (helpRequest.ticket_id) {
      const ticketStatus =
        normalizedStatus === 'resolved' || normalizedStatus === 'closed'
          ? 'closed'
          : 'pending';

      await updateTicket(helpRequest.ticket_id, {
        status: ticketStatus,
      });
    }

    await addGroupMessage({
      group_id: helpRequest.group_id,
      help_request_id: helpRequest.id,
      sender_type: 'system',
      sender_id: null,
      body: `Help request status changed to ${normalizedStatus}`,
      message_type: 'system',
    });

    res.status(200).json({
      message: 'Help request status updated successfully',
      helpRequest: updated,
    });

    // Emit real-time status events
    if (normalizedStatus === 'active') {
      emitTicketEvent('ticket.status.active', {
        helpRequest: updated,
      });
    } else if (normalizedStatus === 'resolved' || normalizedStatus === 'closed') {
      emitTicketEvent('ticket.status.resolved', {
        helpRequest: updated,
      });
    }
  } catch (error) {
    console.error('Update help request status error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Close Teacher Session ─────────────────────────────────────────
const closeTeacherSessionHandler = async (req, res) => {
  try {
    const { teacher_id } = req.body;

    if (!teacher_id) {
      return res.status(400).json({ message: 'teacher_id is required' });
    }

    const helpRequest = await getGroupHelpRequestById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({ message: 'Help request not found' });
    }

    const session = await closeTeacherGroupSession(req.params.id, teacher_id);

    if (!session) {
      return res.status(404).json({ message: 'Active teacher session not found' });
    }

    await addGroupMessage({
      group_id: helpRequest.group_id,
      help_request_id: helpRequest.id,
      sender_type: 'system',
      sender_id: null,
      body: `Teacher session closed`,
      message_type: 'system',
    });

    res.status(200).json({
      message: 'Teacher session closed successfully',
      session,
    });

    // Emit teacher access revoked event
    emitTicketEvent('teacher.access.revoked', {
      helpRequest,
      teacher_id,
      session,
    });
  } catch (error) {
    console.error('Close teacher session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Add Group Message ─────────────────────────────────────────────
const addGroupMessageHandler = async (req, res) => {
  try {
    const {
      group_id,
      help_request_id,
      sender_type,
      sender_id,
      body,
      message_type,
    } = req.body;

    if (!group_id || !sender_type || !body) {
      return res.status(400).json({
        message: 'group_id, sender_type and body are required',
      });
    }

    const message = await addGroupMessage(
      {
        group_id,
        help_request_id: help_request_id || null,
        sender_type,
        sender_id: sender_id || null,
        body,
        message_type: message_type || 'text',
      },
      req.user ? { role: req.user.role, id: req.user.id } : null
    );

    res.status(201).json({
      message: 'Group message sent successfully',
      groupMessage: message,
    });
  } catch (error) {
    console.error('Add group message error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── Get Group Messages ────────────────────────────────────────────
const getGroupMessagesHandler = async (req, res) => {
  try {
    const messages = await getGroupMessages(
      req.params.groupId,
      req.user ? { role: req.user.role, id: req.user.id } : null
    );
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get group messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createHelpRequestHandler,
  getHelpRequestsHandler,
  getHelpRequestHandler,
  getGroupHelpRequestsHandler,
  assignTeacherHandler,
  updateHelpRequestStatusHandler,
  closeTeacherSessionHandler,
  addGroupMessageHandler,
  getGroupMessagesHandler,
};
