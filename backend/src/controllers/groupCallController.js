const {
  isStudentInGroup,
  isTeacherAllowedInGroup,
  getGroupStudentParticipants,
  getGroupTeacherParticipants,
  getActiveCallByGroup,
  createGroupCallSession,
  getCallSessionById,
  getCallParticipants,
  seedCallParticipantsForGroup,
  joinCallParticipant,
  leaveCallParticipant,
  declineCallParticipant,
  countJoinedParticipants,
  endGroupCallSession,
  saveCallSignal,
  getSignalsForCall,
  getCallHistoryForUser,
} = require('../models/groupCallModel');
const {
  getIO,
  broadcastCallSignal,
  broadcastCallEvent,
  normaliseCallPayload,
} = require('../services/socketService');
const { sendVoipPush } = require('../services/pushSender');

// Notify every member of the group (students + teachers) EXCEPT the caller
// that an incoming call is ringing. Previously this only fired for
// teacher-initiated calls AND only notified students — so student-initiated
// calls produced no incoming-call UI for anyone, and teacher-vs-teacher calls
// silently dropped on the other teacher too. Now it works for any initiator
// and reaches every other member.
const emitIncomingCall = async ({ call, initiator, participants }) => {
  if (!call) return;

  const io = getIO();
  if (!io) return;

  const [students, teachers] = await Promise.all([
    getGroupStudentParticipants(call.group_id),
    getGroupTeacherParticipants(call.group_id),
  ]);

  const initiatorName = initiator?.full_name || (call.initiated_by_type === 'teacher' ? 'Your teacher' : 'A classmate');
  const payload = {
    call,
    participants,
    group_id: call.group_id,
    call_id: call.id,
    call_type: call.call_type,
    initiated_by_type: call.initiated_by_type,
    initiated_by_id: call.initiated_by_id,
    initiator_name: initiatorName,
    title: call.call_type === 'video' ? 'Incoming video call' : 'Incoming voice call',
    body: `${initiatorName} started a ${call.call_type === 'video' ? 'video' : 'voice'} call`,
  };

  // Helper: emit + VoIP push to one recipient, but skip the caller themselves.
  const ringRecipient = (recipient, role) => {
    if (call.initiated_by_type === role && Number(call.initiated_by_id) === Number(recipient.id)) return;
    io.to(`user_${recipient.id}`).emit('group-call:incoming', payload);
    // VoIP/high-priority push so closed/backgrounded apps still ring.
    // Android: wakes IncomingCallActivity via a wake-on-receive receiver.
    // iOS: routes to PushKit/CallKit so the OS shows the native call UI.
    sendVoipPush({
      user_id: recipient.id,
      user_role: role,
      payload: {
        call_id: call.id,
        group_id: call.group_id,
        call_type: call.call_type,
        initiator_name: initiatorName,
        title: payload.title,
        body: payload.body,
      },
    }).catch((e) => console.warn('[groupCall] voip push failed:', e.message));
  };

  students.forEach((s) => ringRecipient(s, 'student'));
  teachers.forEach((t) => ringRecipient(t, 'teacher'));
};

const ensureCanAccessGroup = async (req, groupId) => {
  if (req.user.role === 'student') {
    return isStudentInGroup(req.user.id, groupId);
  }

  if (req.user.role === 'teacher') {
    return isTeacherAllowedInGroup(req.user.id, groupId);
  }

  return false;
};

const ensureCanAccessCall = async (req, call) => {
  return ensureCanAccessGroup(req, call.group_id);
};

const startGroupCall = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);
    const { call_type, help_request_id } = req.body;

    if (!groupId || !call_type) {
      return res.status(400).json({ message: 'groupId and call_type are required' });
    }

    if (!['audio', 'video'].includes(call_type)) {
      return res.status(400).json({ message: 'call_type must be audio or video' });
    }

    if (!['student', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only students and teachers can start calls' });
    }

    const allowed = await ensureCanAccessGroup(req, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to start call in this group' });
    }

    const existing = await getActiveCallByGroup(groupId);
    if (existing) {
      const participants = await getCallParticipants(existing.id);
      return res.status(200).json({
        message: 'Active call already exists',
        call: existing,
        participants,
      });
    }

    const call = await createGroupCallSession({
      group_id: groupId,
      help_request_id: help_request_id || null,
      initiated_by_type: req.user.role,
      initiated_by_id: req.user.id,
      call_type,
    });

    const participants = await seedCallParticipantsForGroup(call);
    const freshCall = await getCallSessionById(call.id);
    await emitIncomingCall({
      call: freshCall,
      initiator: req.user,
      participants,
    });

    return res.status(201).json({
      message: 'Call started successfully',
      call: freshCall,
      participants,
    });
  } catch (error) {
    console.error('startGroupCall error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getActiveGroupCall = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId, 10);

    const allowed = await ensureCanAccessGroup(req, groupId);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to access this group' });
    }

    const call = await getActiveCallByGroup(groupId);
    if (!call) {
      return res.status(404).json({ message: 'No active call found' });
    }

    const participants = await getCallParticipants(call.id);

    return res.status(200).json({
      call,
      participants,
    });
  } catch (error) {
    console.error('getActiveGroupCall error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCallByIdHandler = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to access this call' });
    }

    const participants = await getCallParticipants(call.id);

    return res.status(200).json({
      call,
      participants,
    });
  } catch (error) {
    console.error('getCallByIdHandler error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCallParticipantsHandler = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to access this call' });
    }

    const participants = await getCallParticipants(call.id);
    return res.status(200).json({ participants });
  } catch (error) {
    console.error('getCallParticipantsHandler error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const joinGroupCall = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    if (!['student', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only students and teachers can join calls' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to join this call' });
    }

    const participant = await joinCallParticipant(callId, req.user.role, req.user.id);
    const freshCall = await getCallSessionById(callId);
    const participants = await getCallParticipants(callId);

    // Notify desktops sitting in the call's socket room that a new
    // participant joined — gives them the cue to send an offer.
    broadcastCallEvent(callId, 'call:peer-joined', {
      peer_id: `user_${req.user.id}_${req.user.role}`,
      user_id: req.user.id,
      user_role: req.user.role,
      origin: 'http',
      participant,
    });

    return res.status(200).json({
      message: 'Joined call successfully',
      call: freshCall,
      participant,
      participants,
    });
  } catch (error) {
    console.error('joinGroupCall error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const leaveGroupCall = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to leave this call' });
    }

    const participant = await leaveCallParticipant(callId, req.user.role, req.user.id);

    const joinedCount = await countJoinedParticipants(callId);
    let freshCall = await getCallSessionById(callId);

    if (joinedCount === 0 && freshCall && ['ringing', 'active'].includes(freshCall.status)) {
      freshCall = await endGroupCallSession(callId, 'ended');
    }

    const participants = await getCallParticipants(callId);

    // Tell remaining desktops in the room that this peer left.
    broadcastCallEvent(callId, 'call:peer-left', {
      peer_id: `user_${req.user.id}_${req.user.role}`,
      user_id: req.user.id,
      user_role: req.user.role,
    });
    // If the leave ended the call, tell everyone it's over.
    if (freshCall?.status === 'ended') {
      broadcastCallEvent(callId, 'call:ended', { reason: 'last_participant_left' });
    }

    return res.status(200).json({
      message: 'Left call successfully',
      call: freshCall,
      participant,
      participants,
    });
  } catch (error) {
    console.error('leaveGroupCall error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const declineGroupCall = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to decline this call' });
    }

    const participant = await declineCallParticipant(callId, req.user.role, req.user.id);
    const participants = await getCallParticipants(callId);

    return res.status(200).json({
      message: 'Declined call successfully',
      call,
      participant,
      participants,
    });
  } catch (error) {
    console.error('declineGroupCall error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const endGroupCall = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to end this call' });
    }

    const ended = await endGroupCallSession(callId, 'ended');
    const participants = await getCallParticipants(callId);

    // Notify desktops in the room that the call is over.
    broadcastCallEvent(callId, 'call:ended', {
      reason: 'host_ended',
      ended_by: { id: req.user.id, role: req.user.role },
    });

    return res.status(200).json({
      message: 'Call ended successfully',
      call: ended,
      participants,
    });
  } catch (error) {
    console.error('endGroupCall error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const sendCallSignal = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const { signal_type, payload } = req.body;

    if (!signal_type || !payload) {
      return res.status(400).json({ message: 'signal_type and payload are required' });
    }

    const call = await getCallSessionById(callId);
    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to send signal to this call' });
    }

    // Normalise the payload so socket and HTTP clients see the same shape.
    const normalisedPayload = normaliseCallPayload(signal_type, payload);

    const signal = await saveCallSignal({
      call_session_id: callId,
      sender_type: req.user.role,
      sender_id: req.user.id,
      signal_type,
      payload: normalisedPayload,
    });

    // Mirror the signal over sockets so connected desktops see it without
    // having to poll the HTTP signals endpoint.
    broadcastCallSignal({
      callId,
      signalType: signal_type,
      payload: normalisedPayload,
      senderType: req.user.role,
      senderId: req.user.id,
    });

    return res.status(201).json({
      message: 'Signal sent successfully',
      signal,
    });
  } catch (error) {
    console.error('sendCallSignal error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCallSignals = async (req, res) => {
  try {
    const callId = parseInt(req.params.callId, 10);
    const call = await getCallSessionById(callId);

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    const allowed = await ensureCanAccessCall(req, call);
    if (!allowed) {
      return res.status(403).json({ message: 'Not allowed to access signals for this call' });
    }

    const signals = await getSignalsForCall(callId);

    return res.status(200).json({ signals });
  } catch (error) {
    console.error('getCallSignals error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCallHistoryHandler = async (req, res) => {
  try {
    const userType = req.user.role;
    const userId = req.user.id;

    if (!['student', 'teacher', 'agent'].includes(userType)) {
      return res.status(403).json({ message: 'Only students, teachers and agents can view call history' });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const calls = await getCallHistoryForUser(userType, userId, limit);

    return res.status(200).json({
      calls,
    });
  } catch (err) {
    console.error('getCallHistoryHandler error:', err);
    return res.status(500).json({ message: 'Failed to fetch call history' });
  }
};

module.exports = {
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
};
