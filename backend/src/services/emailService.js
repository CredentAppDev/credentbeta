const sgMail = require('@sendgrid/mail');
const ticketCreatedTemplate = require('../templates/ticketCreated');
const ticketReplyTemplate = require('../templates/ticketReply');
const ticketClosedTemplate = require('../templates/ticketClosed');
require('dotenv').config();

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM;
const FROM_NAME = process.env.EMAIL_FROM_NAME;

// ─── Base Send Function ──────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await sgMail.send({
      to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject,
      html,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    return false;
  }
};

// ─── Send Ticket Created Email ───────────────────────────────────
const sendTicketCreatedEmail = async ({ customerEmail, customerName, agentName, description }) => {
  const template = ticketCreatedTemplate({
    customerName,
    agentName,
    description,
  });

  return sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

// ─── Send Ticket Reply Email ─────────────────────────────────────
const sendTicketReplyEmail = async ({ customerEmail, customerName, replyBody, agentName }) => {
  const template = ticketReplyTemplate({
    customerName,
    replyBody,
    agentName,
  });

  return sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

// ─── Send Ticket Closed Email ────────────────────────────────────
const sendTicketClosedEmail = async ({ customerEmail, customerName, agentName }) => {
  const template = ticketClosedTemplate({
    customerName,
    agentName,
  });

  return sendEmail({
    to: customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

module.exports = {
  sendTicketCreatedEmail,
  sendTicketReplyEmail,
  sendTicketClosedEmail,
};