const express = require('express');
const router = express.Router();
const {
  getChannels,
  startDM,
  createGroup,
  getMessages,
  sendMsg,
  sendAudioMsg,
  removeMessage,
  addMember,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { isAgent, isAdmin, allowRoles } = require('../middleware/roles');

const isMessagingUser = allowRoles(
  'agent',
  'admin',
  'student',
  'teacher'
);

// All message routes require login
router.use(protect);

// @route   GET /api/messages/channels
// @desc    Get all channels for current user
router.get('/channels', isMessagingUser, getChannels);

// @route   POST /api/messages/dm
// @desc    Start or get a DM channel
router.post('/dm', isMessagingUser, startDM);

// @route   POST /api/messages/group
// @desc    Create a group channel (Agents/Admin)
router.post('/group', isAgent, createGroup);

// @route   GET /api/messages/channels/:id
// @desc    Get messages in a channel
router.get('/channels/:id', isMessagingUser, getMessages);

// @route   POST /api/messages/channels/:id
// @desc    Send a message in a channel
router.post('/channels/:id', isMessagingUser, sendMsg);

// @route   POST /api/messages/channels/:id/audio
// @desc    Save a raw voice message and persist its media URL in the channel.
router.post(
  '/channels/:id/audio',
  isMessagingUser,
  express.raw({ type: () => true, limit: '12mb' }),
  sendAudioMsg
);

// @route   POST /api/messages/channels/:id/members
// @desc    Add member to group channel
router.post('/channels/:id/members', isAgent, addMember);
// @route   DELETE /api/messages/:messageId
// @desc    Delete a message (Admin only)
router.delete('/:messageId', isAdmin, removeMessage);

module.exports = router;
