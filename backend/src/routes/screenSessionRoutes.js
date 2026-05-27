const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createSession,
  getSession,
  joinSessionHandler,
  leaveSessionHandler,
  endSessionHandler,
  sendSignalHandler,
  getSignalsHandler,
  recordAuditFromClient,
} = require('../controllers/screenSessionController');

const router = express.Router();

router.use(protect);

router.post('/', createSession);
// ICE config — STUN + TURN servers the WebRTC peer should use. Driven by
// env vars so credentials can be rotated (or TURN swapped in production)
// without an app rebuild. Defaults to the free OpenRelay TURN service so
// classroom networks behind symmetric NAT still connect during the beta.
//
// Env vars:
//   TURN_URLS       (comma-separated, e.g. "turn:turn.example.com:3478?transport=udp,turn:...:443?transport=tcp")
//   TURN_USERNAME
//   TURN_CREDENTIAL
router.get('/ice-config', (req, res) => {
  const stunServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  // Custom TURN from env (preferred for production / paid TURN provider).
  const customTurnUrls = (process.env.TURN_URLS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (customTurnUrls.length && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    return res.status(200).json({
      iceServers: [
        ...stunServers,
        {
          urls: customTurnUrls,
          username: process.env.TURN_USERNAME,
          credential: process.env.TURN_CREDENTIAL,
        },
      ],
      provider: 'custom',
    });
  }

  // Free fallback — Metered's OpenRelay project. Limited to 50GB/mo total
  // across all users of the project; plenty for closed-beta testing.
  // https://www.metered.ca/tools/openrelay/
  return res.status(200).json({
    iceServers: [
      ...stunServers,
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp',
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
    ],
    provider: 'openrelay-fallback',
  });
});
router.get('/:code', getSession);
router.post('/join', joinSessionHandler);
router.post('/:code/leave', leaveSessionHandler);
router.post('/:code/end', endSessionHandler);
router.post('/:code/signal', sendSignalHandler);
router.get('/:code/signals', getSignalsHandler);
router.post('/:code/audit', recordAuditFromClient);

module.exports = router;
