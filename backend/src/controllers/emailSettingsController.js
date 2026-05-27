const pool = require('../config/db');

// ─── Create Email Settings Table ─────────────────────────────────
const createEmailSettingsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_settings (
      id SERIAL PRIMARY KEY,
      provider VARCHAR(20) DEFAULT 'sendgrid',
      api_key VARCHAR(255),
      from_address VARCHAR(100),
      from_name VARCHAR(100),
      inbound_domain VARCHAR(100),
      updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('✅ Email settings table ready');
};

// ─── Get Email Settings ──────────────────────────────────────────
const getEmailSettings = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM email_settings ORDER BY id DESC LIMIT 1'
    );

    if (!result.rows[0]) {
      return res.status(200).json({
        settings: {
          provider: 'sendgrid',
          from_address: process.env.EMAIL_FROM,
          from_name: process.env.EMAIL_FROM_NAME,
          api_key: '***hidden***',
          inbound_domain: null,
        }
      });
    }

    // Hide API key
    const settings = {
      ...result.rows[0],
      api_key: '***hidden***',
    };

    res.status(200).json({ settings });
  } catch (error) {
    console.error('Get email settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Update Email Settings ───────────────────────────────────────
const updateEmailSettings = async (req, res) => {
  try {
    const { provider, api_key, from_address, from_name, inbound_domain } = req.body;

    // Validate provider
    if (provider && !['sendgrid', 'mailgun'].includes(provider)) {
      return res.status(400).json({ message: 'Provider must be sendgrid or mailgun' });
    }

    // Check if settings already exist
    const existing = await pool.query('SELECT id FROM email_settings LIMIT 1');

    let result;
    if (existing.rows[0]) {
      // Update existing
      result = await pool.query(
        `UPDATE email_settings SET
          provider = COALESCE($1, provider),
          api_key = COALESCE($2, api_key),
          from_address = COALESCE($3, from_address),
          from_name = COALESCE($4, from_name),
          inbound_domain = COALESCE($5, inbound_domain),
          updated_by = $6,
          updated_at = NOW()
        WHERE id = $7
        RETURNING *`,
        [provider, api_key, from_address, from_name,
         inbound_domain, req.user.id, existing.rows[0].id]
      );
    } else {
      // Create new
      result = await pool.query(
        `INSERT INTO email_settings
          (provider, api_key, from_address, from_name, inbound_domain, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [provider || 'sendgrid', api_key, from_address,
         from_name, inbound_domain, req.user.id]
      );
    }

    res.status(200).json({
      message: 'Email settings updated',
      settings: { ...result.rows[0], api_key: '***hidden***' }
    });
  } catch (error) {
    console.error('Update email settings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Test Email Settings ─────────────────────────────────────────
const testEmailSettings = async (req, res) => {
  try {
    const { test_email } = req.body;
    if (!test_email) {
      return res.status(400).json({ message: 'Test email address is required' });
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: test_email,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      subject: 'Credent Support — Email Test',
      html: `
        <div style="font-family:'Times New Roman',Times,serif; max-width:600px; margin:40px auto; padding:30px; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="background:#1E3A5F; padding:24px; border-radius:6px 6px 0 0; text-align:center;">
            <h1 style="color:#fff; margin:0; font-size:24px;">Credent Support</h1>
          </div>
          <div style="padding:30px;">
            <h2 style="color:#1E3A5F;">Email Configuration Test</h2>
            <p style="color:#444; font-size:16px; line-height:1.8;">
              This is a test email to verify your Credent Support email configuration is working correctly.
            </p>
            <p style="color:#888; font-size:14px;">
              If you received this email your SendGrid integration is set up correctly.
            </p>
          </div>
        </div>
      `,
      text: 'This is a test email from Credent Support. Your email configuration is working correctly.',
    });

    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error.message);
    res.status(500).json({ message: 'Failed to send test email' });
  }
};

module.exports = {
  createEmailSettingsTable,
  getEmailSettings,
  updateEmailSettings,
  testEmailSettings,
};