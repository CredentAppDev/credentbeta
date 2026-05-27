const ticketClosedTemplate = ({ customerName, agentName }) => {
  return {
    subject: `Your support request has been resolved`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Times New Roman', Times, serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: #1B5E20; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-family: 'Times New Roman', Times, serif; }
            .header p { color: #a5d6a7; margin: 8px 0 0; font-size: 15px; font-family: 'Times New Roman', Times, serif; }
            .body { padding: 36px; }
            .body h2 { color: #1E3A5F; font-size: 22px; font-family: 'Times New Roman', Times, serif; margin-bottom: 16px; }
            .body p { color: #444; font-size: 16px; line-height: 1.8; font-family: 'Times New Roman', Times, serif; }
            .resolved-box { background: #f1f8f1; border-left: 4px solid #2E7D32; padding: 18px 20px; border-radius: 4px; margin: 24px 0; color: #2E7D32; font-size: 15px; font-family: 'Times New Roman', Times, serif; }
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
              <p>Your request has been resolved</p>
            </div>
            <div class="body">
              <h2>Hello ${customerName},</h2>
              <p>We are pleased to let you know that your support request has been successfully resolved by our team.</p>
              <div class="resolved-box">
                ✅ Your request has been marked as resolved.
              </div>
              <p>If you are still experiencing issues or have further questions, please do not hesitate to submit a new request through the app and we will be happy to assist you.</p>
              <p>Thank you for choosing Credent Support. We hope we were able to help!</p>
              <div class="agent-signature">
                <p class="agent-name">${agentName}</p>
                <p class="agent-title">Credent Support Team</p>
              </div>
            </div>
            <div class="footer">
              <p>Credent Support &copy; ${new Date().getFullYear()}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${customerName}, your support request has been resolved by ${agentName}. Thank you for choosing Credent Support!`
  };
};

module.exports = ticketClosedTemplate;