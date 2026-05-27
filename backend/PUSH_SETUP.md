# Push notifications — provisioning checklist

The backend is wired to send two kinds of push:

- **Data push** — used by `desktopAuthController.initiate` to deliver the 5-digit
  desktop login code to the user's mobile Credent app.
- **VoIP push** — used by `groupCallController.emitIncomingTeacherCall` to wake
  closed/backgrounded mobile apps when a call rings, so Android shows
  `IncomingCallActivity` and iOS routes through CallKit.

Until you drop in credentials, both calls become no-ops and the apps fall back
to in-app polling (which is what's wired today). The server keeps booting fine.

---

## 1. Install the optional driver packages

```bash
cd backend
npm install firebase-admin apn
```

`firebase-admin` powers Android delivery; `apn` powers iOS (alerts + VoIP).
Neither is required for the server to start — the loader in
`src/services/pushSender.js` lazy-requires them only when credentials exist.

## 2. Android (FCM)

1. In the Firebase console, go to **Project settings → Service accounts**.
2. Click **Generate new private key** and download the JSON file.
3. Save it somewhere outside the repo, e.g. `~/credent-secrets/firebase-service-account.json`.
4. Add the path to your `.env`:

   ```
   FCM_SERVICE_ACCOUNT_PATH=/Users/you/credent-secrets/firebase-service-account.json
   ```

5. In the **Android app** (Credent), drop the matching `google-services.json`
   into `app/` and apply the `com.google.gms.google-services` Gradle plugin.
   Wiring detail is in [Credent](../Credent) — `CredentFcmService.kt` is the
   entry point.

## 3. iOS (APNs alerts + VoIP)

1. Apple Developer → **Certificates, IDs & Profiles → Keys → +**.
2. Create a key with **Apple Push Notifications service (APNs)** enabled.
3. Download the `.p8` file (Apple lets you do this once — keep it safe).
4. Note the **Key ID** (visible after creation) and your **Team ID**.
5. Save the `.p8` to `~/credent-secrets/AuthKey_XXXXXXXXXX.p8`.
6. Add to `.env`:

   ```
   APNS_KEY_PATH=/Users/you/credent-secrets/AuthKey_XXXXXXXXXX.p8
   APNS_KEY_ID=XXXXXXXXXX
   APNS_TEAM_ID=YYYYYYYYYY
   APNS_BUNDLE_ID=com.credent.app
   APNS_PRODUCTION=false
   ```

   Set `APNS_PRODUCTION=true` for App Store / TestFlight builds. Development
   builds (Xcode → device) use the sandbox host — leave it `false`.

7. In **CredentSwiftUI**, enable the *Push Notifications* and *Background Modes →
   Voice over IP* capabilities in Xcode and confirm the bundle id matches
   `APNS_BUNDLE_ID`. Wiring detail is in `CredentSwiftUI/Engine/PushManager.swift`.

## 4. Mobile token registration

Both apps call `POST /api/devices/push-token` (Bearer-authenticated) with:

```json
{
  "platform": "android" | "ios",
  "token":     "<FCM token | APNs alert token>",
  "voip_token": "<iOS only — PushKit token>",
  "app_version": "1.2.3"
}
```

Tokens rotate on the device; calling this endpoint is idempotent (it ON-CONFLICTs
on `(platform, token)`). Call it on login, on token refresh, and at app start
when the cached token has changed. On logout call the same path with `DELETE`.

## 5. Verifying it works

1. Boot the server. You should see one of:
   - `[push] FCM initialized for project credent-...` — credentials loaded.
   - `[push] FCM disabled — set FCM_SERVICE_ACCOUNT_PATH...` — running no-op.
   Likewise for APNs.
2. Trigger a desktop login from the desktop app. With FCM/APNs enabled,
   the mobile app should receive a push within a couple seconds (versus
   waiting up to ~5 s for the polling fallback).
3. Start a group call as a teacher with a student's phone backgrounded.
   The phone should ring even with the app closed.

## 6. Troubleshooting

- **`InvalidRegistration` on FCM** — the Android app sent a token from a
  different Firebase project. Re-download `google-services.json` and rebuild.
- **`BadDeviceToken` on APNs** — usually `APNS_PRODUCTION` doesn't match the
  build (sandbox build with `production:true`, or vice versa).
- **VoIP push doesn't ring on iOS** — the device might not have registered a
  VoIP token yet (only happens after the app calls `PKPushRegistry`). Check
  the `voip_token` column for the user's row.
- **Tokens disappearing** — `pushSender.js` cleans up tokens that FCM/APNs
  report as dead. That's expected. The mobile app will re-register on next
  launch.
