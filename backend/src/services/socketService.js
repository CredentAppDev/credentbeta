const jwt = require('jsonwebtoken');
const { createNotification } = require('../models/notificationModel');
const { getSessionById, getActiveParticipant } = require('../models/screenSessionModel');
const {
  getCallSessionById,
  getCallParticipants,
  saveCallSignal,
} = require('../models/groupCallModel');

const SESSION_CODE_TTL_MS = 5 * 60 * 1000;

const parseScreenSessionId = (value) => {
  const raw = value && typeof value === 'object'
    ? value.session_id ?? value.sessionId
    : value;
  const sessionId = Number(raw);
  return Number.isInteger(sessionId) && sessionId > 0 ? sessionId : null;
};

const isWaitingSessionExpired = (session) => {
  if (!session || session.status !== 'waiting' || !session.created_at) return false;
  const createdAt = Date.parse(session.created_at);
  return Number.isFinite(createdAt) && (Date.now() - createdAt) > SESSION_CODE_TTL_MS;
};

const canUseScreenSession = async (sessionId, userId, userRole) => {
  const session = await getSessionById(sessionId);
  if (!session || session.status === 'ended' || isWaitingSessionExpired(session)) return false;
  if (Number(session.host_id) === Number(userId) && session.host_role === userRole) return true;
  return Boolean(await getActiveParticipant(sessionId, userId, userRole));
};

// ── Group call signaling bridge helpers ─────────────────────────────────────
//
// The desktop (Electron) speaks WebRTC signaling over socket.io.
// Android + iOS speak the same signaling over HTTP polling against the
// `group_call_signals` table. These helpers translate between the two:
//   • A signal arriving via socket is also written to the DB so polling
//     mobile clients pick it up.
//   • A signal arriving via HTTP POST (`/api/group-calls/:callId/signal`)
//     is also broadcast on the socket room `call_<callId>` so connected
//     desktop clients see it in real time.
// Net effect: every platform interoperates regardless of which channel a
// given client speaks.

const parseCallId = (value) => {
  const raw = value && typeof value === 'object'
    ? value.call_id ?? value.callId
    : value;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const canUseGroupCall = async (callId, userId, userRole) => {
  const call = await getCallSessionById(callId);
  if (!call) return false;
  if (call.status === 'ended') return false;
  // The initiator always has access.
  if (Number(call.initiated_by_id) === Number(userId) && call.initiated_by_type === userRole) return true;
  // Otherwise check the call_participants roster.
  const participants = await getCallParticipants(callId);
  return participants.some(
    (p) => Number(p.participant_id) === Number(userId) && p.participant_type === userRole
  );
};

/**
 * Canonical payload formats used across all platforms after normalisation.
 *   offer/answer → { sdp: string, type?: 'offer'|'answer' }
 *   ice          → { candidate: string, sdpMid: string,
 *                    sdpMLineIndex: number, sdpMlineIndex: number }
 * Mobile clients use `sdpMlineIndex` (lowercase m); browser/RTCIceCandidate
 * uses `sdpMLineIndex` (uppercase M). We populate both keys so each side
 * picks the one it expects.
 */
const normaliseCallPayload = (signalType, raw = {}) => {
  if (!raw || typeof raw !== 'object') return {};
  if (signalType === 'offer' || signalType === 'answer') {
    // Accept either a plain { sdp } or a full RTCSessionDescription
    // ({ type, sdp }).
    const sdp = raw.sdp || raw.SDP || '';
    return { sdp, type: signalType };
  }
  if (signalType === 'ice_candidate' || signalType === 'ice-candidate') {
    const candidate = raw.candidate || raw.sdp || '';
    const sdpMid = raw.sdpMid || raw.sdp_mid || null;
    const idx =
      raw.sdpMLineIndex ?? raw.sdpMlineIndex ?? raw.sdp_m_line_index ?? 0;
    return {
      candidate,
      sdpMid,
      sdpMLineIndex: Number(idx),
      sdpMlineIndex: Number(idx),
    };
  }
  return raw;
};

/**
 * Stable peer identifier used in `from` / `to` fields. Same value across
 * socket reconnects so desktop's peerConnections Map keeps working.
 */
const peerKeyFor = (id, role) => `user_${id}_${role}`;

/**
 * Broadcast a call signal to every socket in the call's room except the
 * sender. Mobile clients won't be in the room (they poll), so this only
 * reaches desktop clients — which is the point.
 *
 * Event body shape (matches what desktop renderer expects):
 *   call:offer          { call_id, offer:    {sdp, type}, from: peerKey }
 *   call:answer         { call_id, answer:   {sdp, type}, from: peerKey }
 *   call:ice-candidate  { call_id, candidate:{candidate, sdpMid, sdpMLineIndex, sdpMlineIndex}, from: peerKey }
 */
const broadcastCallSignal = ({ callId, signalType, payload, senderType, senderId, exceptSocketId = null }) => {
  if (!io || !callId) return;
  const room = `call_${callId}`;
  const event = signalType === 'ice_candidate' ? 'call:ice-candidate' : `call:${signalType}`;
  const fromPeerKey = senderId != null ? peerKeyFor(senderId, senderType) : null;
  const msg = { call_id: callId, from: fromPeerKey };
  if (signalType === 'offer')         msg.offer = payload;
  else if (signalType === 'answer')   msg.answer = payload;
  else if (signalType === 'ice_candidate') msg.candidate = payload;
  else msg.payload = payload;
  const target = exceptSocketId
    ? io.to(room).except(exceptSocketId)
    : io.to(room);
  target.emit(event, msg);
};

/**
 * Notify desktops in a call room that a new participant joined / left /
 * the call ended. Used by HTTP controllers to mirror what mobile clients
 * already learn through their poll loop on /participants.
 */
const broadcastCallEvent = (callId, event, payload = {}) => {
  if (!io || !callId) return;
  io.to(`call_${callId}`).emit(event, { call_id: callId, ...payload });
};

let io;

// ─── Initialize Socket.io ────────────────────────────────────────
const initSocket = (server) => {
  const allowedWebOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  io = require('socket.io')(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV === 'development') return callback(null, true);
        if (allowedWebOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Socket CORS: origin '${origin}' is not permitted`));
      },
      methods: ['GET', 'POST'],
    },
  });

  // ─── JWT authentication middleware ───────────────────────────────
  // Clients must send their access token via socket.handshake.auth.token
  // or the Authorization header before any events are processed.
  io.use((socket, next) => {
    const authHeader = socket.handshake.headers?.authorization || '';
      const token =
        socket.handshake.auth?.token ||
        (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader);

    if (!token) {
      return next(new Error('Socket authentication required: provide token in handshake.auth.token'));
    }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id || !decoded?.role) return next(new Error('Invalid token payload'));
        // Attach verified userId so join events cannot be spoofed
        socket.authenticatedUserId = String(decoded.id);
        socket.authenticatedRole = decoded.role;
        next();
      } catch (err) {
        next(new Error('Invalid or expired token'));
      }
  });

  // Store connected users — maps userId to socketId
  const connectedUsers = {};

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} (user ${socket.authenticatedUserId})`);
    socket.authorizedScreenSessions = new Set();
    socket.authorizedCalls = new Set();

    // ─── User claims a room — verified against JWT identity ─────────
    socket.on('join', (userId) => {
      if (String(userId) !== socket.authenticatedUserId) {
        console.warn(`⚠️  Socket join mismatch: claimed ${userId}, authenticated ${socket.authenticatedUserId}`);
        socket.disconnect(true);
        return;
      }
      connectedUsers[userId] = socket.id;
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined socket`);
    });

    // ─── Screen session room join ────────────────────────────────────
    socket.on('screen-session:join-room', async (payload) => {
      const sessionId = parseScreenSessionId(payload);
      if (!sessionId) {
        socket.emit('screen-session:error', { message: 'Invalid session id' });
        return;
      }
      if (!(await canUseScreenSession(sessionId, socket.authenticatedUserId, socket.authenticatedRole))) {
        console.warn(`⚠️  Screen-session join denied: user ${socket.authenticatedUserId} role ${socket.authenticatedRole} session ${sessionId}`);
        socket.emit('screen-session:error', { message: 'Not allowed to join this screen session' });
        return;
      }

      socket.authorizedScreenSessions.add(String(sessionId));
      socket.join(`screen_session_${sessionId}`);
      console.log(`📺 User ${socket.authenticatedUserId} joined screen session room ${sessionId}`);
    });

    // ─── Screen session WebRTC signal relay ──────────────────────────
    socket.on('screen-session:signal', async (data = {}) => {
      const sessionId = parseScreenSessionId(data);
      const { toId, signal } = data;
      if (!sessionId) return;
      if (
        !socket.authorizedScreenSessions.has(String(sessionId)) &&
        !(await canUseScreenSession(sessionId, socket.authenticatedUserId, socket.authenticatedRole))
      ) {
        console.warn(`⚠️  Screen-session signal denied: user ${socket.authenticatedUserId} role ${socket.authenticatedRole} session ${sessionId}`);
        socket.emit('screen-session:error', { message: 'Not allowed to signal this screen session' });
        return;
      }
      socket.authorizedScreenSessions.add(String(sessionId));

      if (toId) {
        io.to(`user_${toId}`).emit('screen-session:signal', {
          sessionId,
          fromId: Number(socket.authenticatedUserId),
          signal,
        });
      } else {
        socket.to(`screen_session_${sessionId}`).emit('screen-session:signal', {
          sessionId,
          fromId: Number(socket.authenticatedUserId),
          signal,
        });
      }
    });

    // ─── Pointer / annotation relay ──────────────────────────────────
    socket.on('screen-session:pointer', async (data = {}) => {
      const sessionId = parseScreenSessionId(data);
      const { x, y, type } = data;
      if (!sessionId) return;
      if (
        !socket.authorizedScreenSessions.has(String(sessionId)) &&
        !(await canUseScreenSession(sessionId, socket.authenticatedUserId, socket.authenticatedRole))
      ) {
        console.warn(`⚠️  Screen-session pointer denied: user ${socket.authenticatedUserId} role ${socket.authenticatedRole} session ${sessionId}`);
        socket.emit('screen-session:error', { message: 'Not allowed to control this screen session' });
        return;
      }
      socket.authorizedScreenSessions.add(String(sessionId));

      socket.to(`screen_session_${sessionId}`).emit('screen-session:pointer', {
        fromId: Number(socket.authenticatedUserId),
        x, y, type,
      });
    });

    // ─── Group call: join the call's socket room ─────────────────────
    socket.on('call:join-room', async (payload) => {
      const callId = parseCallId(payload);
      if (!callId) {
        socket.emit('call:error', { message: 'Invalid call id' });
        return;
      }
      if (!(await canUseGroupCall(callId, socket.authenticatedUserId, socket.authenticatedRole))) {
        console.warn(`⚠️  call:join-room denied: user ${socket.authenticatedUserId} role ${socket.authenticatedRole} call ${callId}`);
        socket.emit('call:error', { message: 'Not allowed to join this call' });
        return;
      }
      socket.authorizedCalls.add(String(callId));
      socket.join(`call_${callId}`);
      console.log(`📞 User ${socket.authenticatedUserId} joined call room ${callId}`);
      // Tell the other room members that someone joined — desktops use
      // this to know they should send an offer to the new peer.
      socket.to(`call_${callId}`).emit('call:peer-joined', {
        call_id: callId,
        peer_id: peerKeyFor(socket.authenticatedUserId, socket.authenticatedRole),
        socket_id: socket.id,
        user_id: Number(socket.authenticatedUserId),
        user_role: socket.authenticatedRole,
      });
    });

    socket.on('call:leave-room', (payload) => {
      const callId = parseCallId(payload);
      if (!callId) return;
      socket.authorizedCalls.delete(String(callId));
      socket.leave(`call_${callId}`);
      socket.to(`call_${callId}`).emit('call:peer-left', {
        call_id: callId,
        peer_id: peerKeyFor(socket.authenticatedUserId, socket.authenticatedRole),
        socket_id: socket.id,
        user_id: Number(socket.authenticatedUserId),
        user_role: socket.authenticatedRole,
      });
    });

    // ─── Group call: WebRTC signaling bridge ─────────────────────────
    // Save every signal to the DB (so mobile polling clients see it) AND
    // broadcast over sockets in the same room (so desktop clients see it
    // in real time). One handler covers offer / answer / ice-candidate.
    const bridgeCallSignal = (signalType) => async (data = {}) => {
      const callId = parseCallId(data);
      if (!callId) return;
      // Authorise lazily — a client that's emitting signals is implicitly
      // claiming to be in the call.
      if (
        !socket.authorizedCalls.has(String(callId)) &&
        !(await canUseGroupCall(callId, socket.authenticatedUserId, socket.authenticatedRole))
      ) {
        console.warn(`⚠️  call signal denied: user ${socket.authenticatedUserId} role ${socket.authenticatedRole} call ${callId}`);
        socket.emit('call:error', { message: 'Not allowed to signal this call' });
        return;
      }
      socket.authorizedCalls.add(String(callId));
      socket.join(`call_${callId}`);

      // Desktop sends `{ offer: {...} }` for offer / `{ answer: {...} }`
      // for answer / `{ candidate: {...} }` for ICE. Mobile sends a flat
      // payload. Normalise so mobile + desktop both decode it.
      const rawPayload =
        signalType === 'offer'         ? (data.offer || data.payload || {}) :
        signalType === 'answer'        ? (data.answer || data.payload || {}) :
        signalType === 'ice_candidate' ? (data.candidate || data.payload || {}) :
        (data.payload || {});
      const payload = normaliseCallPayload(signalType, rawPayload);

      // Persist for mobile polling clients.
      try {
        await saveCallSignal({
          call_session_id: callId,
          sender_type: socket.authenticatedRole,
          sender_id: Number(socket.authenticatedUserId),
          signal_type: signalType,
          payload,
        });
      } catch (e) {
        console.warn(`[call bridge] saveCallSignal failed: ${e.message}`);
      }

      // Real-time relay to other desktops in the room.
      broadcastCallSignal({
        callId,
        signalType,
        payload,
        senderType: socket.authenticatedRole,
        senderId: Number(socket.authenticatedUserId),
        exceptSocketId: socket.id,
      });
    };

    socket.on('call:offer',          bridgeCallSignal('offer'));
    socket.on('call:answer',         bridgeCallSignal('answer'));
    socket.on('call:ice-candidate',  bridgeCallSignal('ice_candidate'));
    socket.on('call:ice_candidate',  bridgeCallSignal('ice_candidate'));

    // ─── Cleanup on disconnect ───────────────────────────────────────
    socket.on('disconnect', () => {
      // Tell any call rooms the user was in that they've left.
      socket.authorizedCalls.forEach((callId) => {
        socket.to(`call_${callId}`).emit('call:peer-left', {
          call_id: Number(callId),
          peer_id: peerKeyFor(socket.authenticatedUserId, socket.authenticatedRole),
          socket_id: socket.id,
          user_id: Number(socket.authenticatedUserId),
          user_role: socket.authenticatedRole,
        });
      });
      socket.authorizedCalls.clear();
    });

    // Original disconnect cleanup follows. (Kept the existing handler
    // below as-is — both fire on the same `disconnect` event.)
    socket.on('disconnect', () => {
      Object.keys(connectedUsers).forEach((userId) => {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          console.log(`👤 User ${userId} disconnected`);
        }
      });
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
};

// ─── Send Notification to a Specific User ───────────────────────
const sendNotificationToUser = async ({
  userId, type, title, body,
  reference_id, reference_type
}) => {
  try {
    const notification = await createNotification({
      user_id: userId,
      type,
      title,
      body,
      reference_id,
      reference_type,
    });

    if (io) {
      io.to(`user_${userId}`).emit('notification:new', notification);
    }

    return notification;
  } catch (error) {
    console.error('Send notification error:', error.message);
  }
};

// ─── Send Notification to Multiple Users ────────────────────────
const sendNotificationToMany = async ({
  userIds, type, title, body,
  reference_id, reference_type
}) => {
  const notifications = await Promise.all(
    userIds.map(userId =>
      sendNotificationToUser({
        userId, type, title, body,
        reference_id, reference_type
      })
    )
  );
  return notifications;
};

// ─── Send Notification to a Role ────────────────────────────────
const sendNotificationToRole = async ({
  role, type, title, body,
  reference_id, reference_type
}) => {
  try {
    const pool = require('../config/db');

    const result = await pool.query(
      `SELECT id FROM users WHERE role = $1 AND is_active = true`,
      [role]
    );

    const userIds = result.rows.map(u => u.id);

    if (userIds.length > 0) {
      await sendNotificationToMany({
        userIds, type, title, body,
        reference_id, reference_type
      });
    }
  } catch (error) {
    console.error('Send role notification error:', error.message);
  }
};

// ─── Emit Real-Time Ticket Event ─────────────────────────────────
const emitTicketEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

const getIO = () => io;

module.exports = {
  initSocket,
  sendNotificationToUser,
  sendNotificationToMany,
  sendNotificationToRole,
  emitTicketEvent,
  getIO,
  // Group call bridge helpers — called by the HTTP signaling controller
  // so HTTP-originated signals also reach connected desktops in real time.
  broadcastCallSignal,
  broadcastCallEvent,
  normaliseCallPayload,
};
