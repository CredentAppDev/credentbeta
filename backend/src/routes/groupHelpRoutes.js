const express = require('express');
const router = express.Router();

const {
  createHelpRequestHandler,
  getHelpRequestsHandler,
  getHelpRequestHandler,
  getGroupHelpRequestsHandler,
  assignTeacherHandler,
  updateHelpRequestStatusHandler,
  closeTeacherSessionHandler,
  addGroupMessageHandler,
  getGroupMessagesHandler,
} = require('../controllers/groupHelpController');

const { protect } = require('../middleware/auth');
const { isAgent, isAdmin } = require('../middleware/roles');

// All routes require staff login for now
router.use(protect);

// Help requests
router.get('/', isAgent, getHelpRequestsHandler);
router.post('/', isAgent, createHelpRequestHandler);
router.get('/:id', isAgent, getHelpRequestHandler);
router.patch('/:id/status', isAgent, updateHelpRequestStatusHandler);

// Teacher assignment / session
router.patch('/:id/assign-teacher', isAgent, assignTeacherHandler);
router.patch('/:id/close-session', isAgent, closeTeacherSessionHandler);

// Group-scoped help requests
router.get('/group/:groupId', isAgent, getGroupHelpRequestsHandler);

// Group messages
router.get('/group/:groupId/messages', isAgent, getGroupMessagesHandler);
router.post('/group/messages', isAgent, addGroupMessageHandler);

module.exports = router;