const agentPasskeyTemplate = ({ agentName, passkey, expiryHours = 24, expiryLabel }) => {
  // expiryLabel (e.g. "30 days") overrides the hours wording when provided.
  const expiryText = expiryLabel || `${expiryHours} hours`;
  return {
    subject: `Your Credent Access Passkey`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Times New Roman', Times, serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: #1E3A5F; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-family: 'Times New Roman', Times, serif; }
            .header p { color: #a0b4c8; margin: 8px 0 0; font-size: 15px; font-family: 'Times New Roman', Times, serif; }
            .body { padding: 36px; }
            .body h2 { color: #1E3A5F; font-size: 22px; font-family: 'Times New Roman', Times, serif; }
            .body p { color: #444; font-size: 16px; line-height: 1.8; font-family: 'Times New Roman', Times, serif; }
            .passkey-box { background: #1E3A5F; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
            .passkey-label { color: #a0b4c8; font-size: 14px; font-family: 'Times New Roman', Times, serif; margin: 0 0 10px; letter-spacing: 2px; text-transform: uppercase; }
            .passkey-number { color: #ffffff; font-size: 42px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 8px; margin: 0; }
            .expiry-box { background: #FFF3E0; border-left: 4px solid #E65100; padding: 14px 18px; border-radius: 4px; margin: 20px 0; }
            .expiry-box p { margin: 0; color: #E65100; font-size: 14px; font-family: 'Times New Roman', Times, serif; }
            .steps { background: #f8f9fa; border-radius: 6px; padding: 20px 24px; margin: 20px 0; }
            .steps p { margin: 8px 0; color: #555; font-size: 15px; font-family: 'Times New Roman', Times, serif; }
            .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 13px; color: #999; font-family: 'Times New Roman', Times, serif; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Credent Support</h1>
              <p>Your account is ready</p>
            </div>
            <div class="body">
              <h2>Welcome, ${agentName}!</h2>
              <p>Your Credent Support agent account has been created. Use the passkey below to access your account on the mobile app.</p>
              <div class="passkey-box">
                <p class="passkey-label">Your Access Passkey</p>
                <p class="passkey-number">${passkey}</p>
              </div>
              <div class="expiry-box">
                <p>⏰ This passkey expires in <strong>${expiryText}</strong>. Enter it in the app before it expires.</p>
              </div>
              <div class="steps">
                <p><strong>How to get started:</strong></p>
                <p>1. Download the Credent Support app</p>
                <p>2. Enter your email address</p>
                <p>3. Enter your 10-digit passkey above</p>
                <p>4. You will never need to enter it again</p>
              </div>
              <p style="color:#888; font-size:14px; font-family:'Times New Roman',Times,serif;">
                If your passkey expires before you log in, you can request a new one from the app login screen. Do not share this passkey with anyone.
              </p>
            </div>
            <div class="footer">
              <p>Credent Support System &copy; ${new Date().getFullYear()}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Welcome ${agentName}! Your Credent passkey is: ${passkey}. It expires in ${expiryText}. Enter it in the app to activate your account.`
  };
};

module.exports = agentPasskeyTemplate;