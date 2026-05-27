const ticketReplyTemplate = ({ customerName, replyBody, agentName }) => {
  return {
    subject: `You have a new message from Credent Support`,
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
            .body h2 { color: #1E3A5F; font-size: 22px; font-family: 'Times New Roman', Times, serif; margin-bottom: 16px; }
            .body p { color: #444; font-size: 16px; line-height: 1.8; font-family: 'Times New Roman', Times, serif; }
            .reply-box { background: #f8f9fa; border-left: 4px solid #2E75B6; padding: 18px 20px; border-radius: 4px; margin: 24px 0; color: #555; font-size: 15px; line-height: 1.8; font-family: 'Times New Roman', Times, serif; }
            .agent-signature { margin-top: 28px; padding-top: 16px; border-top: 1px solid #eeeeee; }
            .agent-signature p { margin: 4px 0; font-size: 15px; font-family: 'Times New Roman', Times, serif; }
            .agent-name { font-weight: bold; color: #1E3A5F; font-size: 16px; }
            .agent-title { color: #888; font-size: 14px; }
            .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 13px; color: #999; font-family: 'Times New Roman', Times, serif; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Credent Support</h1>
              <p>A message from our support team</p>
            </div>
            <div class="body">
              <h2>Hello ${customerName},</h2>
              <p>You have received a new message from our support team regarding your request.</p>
              <div class="reply-box">${replyBody}</div>
              <div class="agent-signature">
                <p class="agent-name">${agentName}</p>
                <p class="agent-title">Credent Support Team</p>
              </div>
              <p style="margin-top:24px; color:#888; font-size:14px; font-family:'Times New Roman',Times,serif;">Please do not reply to this email. Use the app to continue this conversation.</p>
            </div>
            <div class="footer">
              <p>Credent Support &copy; ${new Date().getFullYear()}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${customerName}, ${agentName} from Credent Support has sent you a message: ${replyBody}`
  };
};

module.exports = ticketReplyTemplate;