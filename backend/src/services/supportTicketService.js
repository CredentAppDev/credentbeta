const pool = require('../config/db');
const {
  createCustomer,
  getCustomerByEmail,
  updateCustomer,
} = require('../models/customerModel');
const { createTicket } = require('../models/ticketModel');
const {
  findPrincipalDMChannel,
  createPrincipalDMChannel,
} = require('../models/messageModel');
const {
  sendNotificationToUser,
  emitTicketEvent,
} = require('./socketService');

const clean = (value) => String(value || '').trim();

const getChannelById = async (channelId) => {
  if (!channelId) return null;
  const result = await pool.query(
    `SELECT *
     FROM channels
     WHERE id = $1
     LIMIT 1`,
    [channelId]
  );
  return result.rows[0] || null;
};

const getAgentForSupportTicket = async (ticket, channelId = null) => {
  if (ticket && ticket.assigned_to) {
    const assigned = await pool.query(
      `SELECT id, full_name, email, role
       FROM users
       WHERE id = $1
         AND is_active = true
         AND role = 'agent'
       LIMIT 1`,
      [ticket.assigned_to]
    );
    if (assigned.rows[0]) return assigned.rows[0];
  }

  if (channelId) {
    const channelAgent = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.role
       FROM channel_members cm
       JOIN users u ON u.id = cm.member_id
       WHERE cm.channel_id = $1
         AND cm.member_type = 'staff'
         AND u.is_active = true
         AND u.role = 'agent'
       ORDER BY cm.id ASC
       LIMIT 1`,
      [channelId]
    );
    if (channelAgent.rows[0]) return channelAgent.rows[0];
  }

  return getDefaultSupportAgent();
};

const getDefaultSupportAgent = async () => {
  const result = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.role,
            COALESCE(cm.dm_count, 0) AS dm_count
     FROM users u
     LEFT JOIN (
       SELECT cm.member_id, COUNT(*) AS dm_count
       FROM channel_members cm
       JOIN channels c ON c.id = cm.channel_id
       WHERE c.type = 'dm'
         AND cm.member_type = 'staff'
       GROUP BY cm.member_id
     ) cm ON cm.member_id = u.id
     WHERE u.is_active = true
       AND u.role = 'agent'
     ORDER BY dm_count ASC, u.id ASC
     LIMIT 1`
  );

  return result.rows[0] || null;
};

const ensureCustomer = async ({
  full_name,
  email,
  phone,
  company,
  requester_type,
  requester_id,
}) => {
  const fallbackEmail =
    requester_type && requester_id
      ? `${requester_type}-${requester_id}@credent.local`
      : null;
  const normalizedEmail = clean(email || fallbackEmail).toLowerCase();

  if (!normalizedEmail) {
    const error = new Error('Customer email is required');
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    full_name: clean(full_name) || 'Credent Customer',
    email: normalizedEmail,
    phone: clean(phone) || null,
    company: clean(company) || null,
  };

  const existing = await getCustomerByEmail(normalizedEmail);
  if (existing) {
    return updateCustomer(existing.id, payload);
  }

  return createCustomer(payload);
};

const findOpenSupportTicket = async ({ channelId, requesterType, requesterId }) => {
  const result = await pool.query(
    `SELECT *
     FROM tickets
     WHERE status IN ('open', 'pending')
       AND (
         ($1::integer IS NOT NULL AND support_channel_id = $1::integer)
         OR (
           requester_type = $2
           AND $3::integer IS NOT NULL
           AND requester_id = $3::integer
         )
       )
     ORDER BY updated_at DESC
     LIMIT 1`,
    [channelId || null, requesterType || null, requesterId || null]
  );

  return result.rows[0] || null;
};

const notifyAssignedAgent = async ({ ticket, agent, title, body }) => {
  if (!agent || !agent.id) return;

  await sendNotificationToUser({
    userId: agent.id,
    type: 'ticket:created',
    title,
    body,
    reference_id: ticket.id,
    reference_type: 'ticket',
  });

  emitTicketEvent('ticket:created', ticket);
};

const formatAppSupportDescription = ({ requester, requesterType }) => {
  const label = requesterType === 'teacher' ? 'Teacher' : 'Student';
  const lines = [
    `${label} opened a customer support chat from the Credent app.`,
    '',
    `Name: ${requester.full_name || 'Unknown'}`,
  ];

  if (requester.email) lines.push(`Email: ${requester.email}`);
  if (requester.phone_number) lines.push(`Phone: ${requester.phone_number}`);
  if (requester.student_id) lines.push(`Student ID: ${requester.student_id}`);
  if (requester.teacher_id) lines.push(`Teacher ID: ${requester.teacher_id}`);
  if (requester.school_name) lines.push(`School: ${requester.school_name}`);

  lines.push('', 'Messages are stored in the linked support conversation.');
  return lines.join('\n');
};

const startSupportChatForRequester = async ({ requester, requesterType }) => {
  const existingTicket = await findOpenSupportTicket({
    requesterType,
    requesterId: requester.id,
  });

  if (existingTicket && existingTicket.support_channel_id) {
    const existingChannel = await getChannelById(existingTicket.support_channel_id);
    const existingAgent = await getAgentForSupportTicket(
      existingTicket,
      existingTicket.support_channel_id
    );

    if (existingChannel && existingAgent) {
      return {
        agent: {
          id: existingAgent.id,
          full_name: existingAgent.full_name,
          email: existingAgent.email,
          role: existingAgent.role,
        },
        channel: existingChannel,
        ticket: existingTicket,
        created: false,
      };
    }
  }

  const agent = await getAgentForSupportTicket(existingTicket);
  if (!agent) {
    const error = new Error('No agents available right now');
    error.statusCode = 404;
    throw error;
  }

  const requesterPrincipal = { type: requesterType, id: requester.id };
  const agentPrincipal = { type: 'staff', id: agent.id };

  let channel = await findPrincipalDMChannel(requesterPrincipal, agentPrincipal);
  if (!channel) {
    channel = await createPrincipalDMChannel(requesterPrincipal, agentPrincipal);
  }

  let ticket = existingTicket || await findOpenSupportTicket({
    channelId: channel.id,
    requesterType,
    requesterId: requester.id,
  });

  let created = false;

  if (!ticket) {
    const customer = await ensureCustomer({
      full_name: requester.full_name,
      email: requester.email,
      phone: requester.phone_number,
      company: requester.school_name,
      requester_type: requesterType,
      requester_id: requester.id,
    });

    ticket = await createTicket({
      title: `Support chat: ${requester.full_name || requesterType}`,
      description: formatAppSupportDescription({ requester, requesterType }),
      priority: 'normal',
      customer_id: customer.id,
      assigned_to: agent.id,
      created_by: agent.id,
      source: 'app_support_chat',
      support_channel_id: channel.id,
      requester_type: requesterType,
      requester_id: requester.id,
    });
    created = true;

    await notifyAssignedAgent({
      ticket,
      agent,
      title: 'New Support Chat',
      body: `${requester.full_name || requesterType} opened a customer support chat`,
    });
  } else if (!ticket.support_channel_id || Number(ticket.support_channel_id) !== Number(channel.id)) {
    const updated = await pool.query(
      `UPDATE tickets
       SET support_channel_id = $1,
           assigned_to = COALESCE(assigned_to, $2),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [channel.id, agent.id, ticket.id]
    );
    ticket = updated.rows[0] || ticket;
  }

  return {
    agent: {
      id: agent.id,
      full_name: agent.full_name,
      email: agent.email,
      role: agent.role,
    },
    channel,
    ticket,
    created,
  };
};

const createWebsiteSupportTicket = async (payload) => {
  const agent = await getDefaultSupportAgent();
  if (!agent) {
    const error = new Error('No agents available right now');
    error.statusCode = 404;
    throw error;
  }

  const fullName = clean(payload.full_name || payload.name);
  const email = clean(payload.email).toLowerCase();
  const message = clean(payload.message || payload.description);
  const source = clean(payload.source) || 'credent_robotics_website';

  if (!email || !message) {
    const error = new Error('Email and message are required');
    error.statusCode = 400;
    throw error;
  }

  const customer = await ensureCustomer({
    full_name: fullName || 'Website Visitor',
    email,
    phone: payload.phone,
    company: payload.company || payload.school_name,
    requester_type: 'website',
  });

  const title =
    clean(payload.title) ||
    `Website message from ${fullName || email}`;

  const description = clean(payload.description) || [
    `Website source: ${source}`,
    '',
    `Name: ${fullName || 'Website Visitor'}`,
    `Email: ${email}`,
    payload.phone ? `Phone: ${clean(payload.phone)}` : null,
    payload.company || payload.school_name
      ? `Organization: ${clean(payload.company || payload.school_name)}`
      : null,
    '',
    message,
  ].filter(Boolean).join('\n');

  const ticket = await createTicket({
    title,
    description,
    priority: payload.priority || 'normal',
    customer_id: customer.id,
    assigned_to: agent.id,
    created_by: agent.id,
    source,
    requester_type: 'website',
  });

  await notifyAssignedAgent({
    ticket,
    agent,
    title: 'New Website Ticket',
    body: `${fullName || email} submitted a message from Credent Robotics`,
  });

  return {
    ticket,
    agent: {
      id: agent.id,
      full_name: agent.full_name,
      email: agent.email,
      role: agent.role,
    },
  };
};

module.exports = {
  getDefaultSupportAgent,
  startSupportChatForRequester,
  createWebsiteSupportTicket,
};
