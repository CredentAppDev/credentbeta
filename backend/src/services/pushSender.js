/**
 * Cross-platform push delivery for the Credent backend.
 *
 *   sendDataPush({ user_id, user_role, type, payload, priority })  → standard data push
 *   sendVoipPush({ user_id, user_role, payload })                  → iOS VoIP / Android high-priority data push (call ringing)
 *
 * Drivers (firebase-admin, apn) are loaded lazily so the server keeps booting
 * even before someone installs them and drops in credentials. When credentials
 * are missing, both functions resolve to a no-op and log once — your app keeps
 * working off the existing in-app polling fallback.
 *
 * Required env to enable:
 *   FCM_SERVICE_ACCOUNT_PATH=/abs/path/to/firebase-service-account.json
 *   APNS_KEY_PATH=/abs/path/to/AuthKey_XXXXXXXXXX.p8
 *   APNS_KEY_ID=XXXXXXXXXX
 *   APNS_TEAM_ID=YYYYYYYYYY
 *   APNS_BUNDLE_ID=com.credent.app
 *   APNS_PRODUCTION=false        (true for App Store / TestFlight builds)
 *
 * See backend/PUSH_SETUP.md for end-to-end provisioning instructions.
 */

const fs = require('fs');
const { getTokensForUser, deleteTokenByValue } = require('../models/devicePushTokenModel');

let _fcm = null;          // firebase-admin app singleton
let _fcmDisabled = false; // log-once
let _apn = null;          // { provider, voipProvider }
let _apnDisabled = false;

function getFcm() {
  if (_fcm || _fcmDisabled) return _fcm;
  const path = process.env.FCM_SERVICE_ACCOUNT_PATH;
  if (!path || !fs.existsSync(path)) {
    if (!_fcmDisabled) console.warn('[push] FCM disabled — set FCM_SERVICE_ACCOUNT_PATH to enable Android push');
    _fcmDisabled = true;
    return null;
  }
  try {
    const admin = require('firebase-admin');
    const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'));
    _fcm = admin.initializeApp(
      { credential: admin.credential.cert(serviceAccount) },
      'credent-push'
    );
    console.log('[push] FCM initialized for project', serviceAccount.project_id);
    return _fcm;
  } catch (err) {
    console.warn('[push] FCM init failed:', err.message);
    _fcmDisabled = true;
    return null;
  }
}

function getApn() {
  if (_apn || _apnDisabled) return _apn;
  const keyPath = process.env.APNS_KEY_PATH;
  const keyId = process.env.APNS_KEY_ID;
  const teamId = process.env.APNS_TEAM_ID;
  const bundleId = process.env.APNS_BUNDLE_ID;
  if (!keyPath || !keyId || !teamId || !bundleId || !fs.existsSync(keyPath)) {
    if (!_apnDisabled) console.warn('[push] APNs disabled — set APNS_KEY_PATH / APNS_KEY_ID / APNS_TEAM_ID / APNS_BUNDLE_ID to enable iOS push');
    _apnDisabled = true;
    return null;
  }
  try {
    const apn = require('apn');
    const production = process.env.APNS_PRODUCTION === 'true';
    const opts = {
      token: { key: keyPath, keyId, teamId },
      production,
    };
    _apn = {
      bundleId,
      provider: new apn.Provider(opts),
      // VoIP push requires the topic suffix `.voip` and a separate provider so
      // the apns-push-type header gets set correctly per-notification.
      voipProvider: new apn.Provider(opts),
      apn,
    };
    console.log('[push] APNs initialized (production=%s)', production);
    return _apn;
  } catch (err) {
    console.warn('[push] APNs init failed:', err.message);
    _apnDisabled = true;
    return null;
  }
}

const _fcmTokensFor = (rows) => rows.filter((r) => r.platform === 'android').map((r) => r.token);
const _apnsRowsFor = (rows) => rows.filter((r) => r.platform === 'ios');

async function _sendFcmDataMessage({ tokens, type, payload, highPriority }) {
  const app = getFcm();
  if (!app || !tokens.length) return { sent: 0 };

  // Stringify everything — FCM data fields are string-only.
  const data = { type, ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])) };

  const messaging = require('firebase-admin').messaging(app);
  const message = {
    tokens,
    data,
    android: {
      priority: highPriority ? 'high' : 'normal',
      // Android-side ttl: drop call rings after 30 s, code rings after 5 min.
      ttl: type === 'incoming_call' ? 30 * 1000 : 5 * 60 * 1000,
    },
  };

  try {
    const resp = await messaging.sendEachForMulticast(message);
    // Clean up tokens FCM tells us are dead.
    resp.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code || '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
          deleteTokenByValue('android', tokens[i]).catch(() => {});
        }
      }
    });
    return { sent: resp.successCount };
  } catch (err) {
    console.warn('[push] FCM send failed:', err.message);
    return { sent: 0 };
  }
}

async function _sendApnsAlert({ rows, type, payload }) {
  const a = getApn();
  if (!a || !rows.length) return { sent: 0 };
  const note = new a.apn.Notification();
  note.topic = a.bundleId;
  note.expiry = Math.floor(Date.now() / 1000) + 5 * 60;
  note.priority = 10;
  note.alert = {
    title: payload.title || 'Credent',
    body: payload.body || '',
  };
  note.sound = 'default';
  note.payload = { type, ...payload };

  const tokens = rows.map((r) => r.token);
  try {
    const result = await a.provider.send(note, tokens);
    result.failed.forEach((f) => {
      const reason = f.response?.reason || '';
      if (reason === 'BadDeviceToken' || reason === 'Unregistered') {
        deleteTokenByValue('ios', f.device).catch(() => {});
      }
    });
    return { sent: result.sent.length };
  } catch (err) {
    console.warn('[push] APNs alert send failed:', err.message);
    return { sent: 0 };
  }
}

async function _sendApnsVoip({ rows, payload }) {
  const a = getApn();
  if (!a) return { sent: 0 };
  const voipRows = rows.filter((r) => r.voip_token);
  if (!voipRows.length) return { sent: 0 };

  const note = new a.apn.Notification();
  note.topic = `${a.bundleId}.voip`;
  note.expiry = Math.floor(Date.now() / 1000) + 30;
  note.priority = 10;
  note.pushType = 'voip';
  note.payload = { type: 'incoming_call', ...payload };

  const tokens = voipRows.map((r) => r.voip_token);
  try {
    const result = await a.voipProvider.send(note, tokens);
    return { sent: result.sent.length };
  } catch (err) {
    console.warn('[push] APNs VoIP send failed:', err.message);
    return { sent: 0 };
  }
}

/**
 * Send a normal data/alert push (e.g. desktop login code, new message).
 */
async function sendDataPush({ user_id, user_role, type, payload = {}, highPriority = false }) {
  if (!user_id || !user_role || !type) return { sent: 0 };

  const rows = await getTokensForUser(user_id, user_role).catch(() => []);
  if (!rows.length) return { sent: 0 };

  const fcmTokens = _fcmTokensFor(rows);
  const apnsRows = _apnsRowsFor(rows);

  const [fcm, apns] = await Promise.all([
    _sendFcmDataMessage({ tokens: fcmTokens, type, payload, highPriority }),
    _sendApnsAlert({ rows: apnsRows, type, payload }),
  ]);

  return { sent: fcm.sent + apns.sent };
}

/**
 * Send a VoIP-class push that wakes the phone for a ringing call.
 *
 * Android: high-priority FCM data message — receiver dispatches to
 *   IncomingCallActivity via a wake-on-receive BroadcastReceiver.
 * iOS: PushKit VoIP push to the device's VoIP token, which always launches
 *   the app and gives it a few seconds to report a CallKit incoming call.
 */
async function sendVoipPush({ user_id, user_role, payload = {} }) {
  if (!user_id || !user_role) return { sent: 0 };

  const rows = await getTokensForUser(user_id, user_role).catch(() => []);
  if (!rows.length) return { sent: 0 };

  const fcmTokens = _fcmTokensFor(rows);
  const apnsRows = _apnsRowsFor(rows);

  const [fcm, apns] = await Promise.all([
    _sendFcmDataMessage({
      tokens: fcmTokens,
      type: 'incoming_call',
      payload,
      highPriority: true,
    }),
    _sendApnsVoip({ rows: apnsRows, payload }),
  ]);

  return { sent: fcm.sent + apns.sent };
}

module.exports = { sendDataPush, sendVoipPush };
