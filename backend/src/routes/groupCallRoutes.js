const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const {
  startGroupCall,
  getActiveGroupCall,
  getCallByIdHandler,
  getCallParticipantsHandler,
  joinGroupCall,
  leaveGroupCall,
  declineGroupCall,
  endGroupCall,
  sendCallSignal,
  getCallSignals,
  getCallHistoryHandler,
} = require('../controllers/groupCallController');

router.use(protect);

router.get('/history', getCallHistoryHandler);

router.post('/group/:groupId/start', startGroupCall);
router.get('/group/:groupId/active', getActiveGroupCall);

router.get('/:callId', getCallByIdHandler);
router.get('/:callId/participants', getCallParticipantsHandler);

router.post('/:callId/join', joinGroupCall);
router.post('/:callId/leave', leaveGroupCall);
router.post('/:callId/decline', declineGroupCall);
router.post('/:callId/end', endGroupCall);

router.post('/:callId/signal', sendCallSignal);
router.get('/:callId/signals', getCallSignals);

module.exports = router;