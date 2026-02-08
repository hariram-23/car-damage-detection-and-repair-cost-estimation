const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Send email using SendGrid (preferred method)
const sendEmailWithSendGrid = async (email, resetUrl, userName) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
    subject: 'Password Reset Request - AI Damage System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 10px;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
          }
          .logo {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #00d9ff;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #00d9ff;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 12px;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              padding: 15px;
            }
            .content {
              padding: 20px;
            }
            .button {
              display: block;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="logo">🚗 AI DAMAGE SYSTEM</div>
            
            <h2>Password Reset Request</h2>
            
            <p>Hello ${userName || 'User'},</p>
            
            <p>We received a request to reset your password for your AI Damage System account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #00d9ff; font-size: 12px;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link expires in 1 hour</li>
                <li>This link can only be used once</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email.</p>
            
            <p>Best regards,<br>
            <strong>AI Damage System Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2025 AI Damage System. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await sgMail.send(msg);
};

// Send email using Nodemailer (fallback method)
const sendEmailWithNodemailer = async (email, resetUrl, userName) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials not configured');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"AI Damage System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - AI Damage System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 10px;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
          }
          .logo {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #00d9ff;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 15px 30px;
            background: #00d9ff;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 12px;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              padding: 15px;
            }
            .content {
              padding: 20px;
            }
            .button {
              display: block;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <div class="logo">🚗 AI DAMAGE SYSTEM</div>
            
            <h2>Password Reset Request</h2>
            
            <p>Hello ${userName || 'User'},</p>
            
            <p>We received a request to reset your password for your AI Damage System account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #00d9ff; font-size: 12px;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link expires in 1 hour</li>
                <li>This link can only be used once</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email.</p>
            
            <p>Best regards,<br>
            <strong>AI Damage System Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© 2025 AI Damage System. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Main function to send password reset email
const sendPasswordResetEmail = async (email, resetUrl, userName) => {
  try {
    // Try SendGrid first (more reliable for production)
    if (process.env.SENDGRID_API_KEY) {
      await sendEmailWithSendGrid(email, resetUrl, userName);
      console.log('\n' + '='.repeat(80));
      console.log('📧 EMAIL SENT SUCCESSFULLY (via SendGrid)');
      console.log('='.repeat(80));
      console.log(`✅ To: ${email}`);
      console.log(`📝 Subject: Password Reset Request`);
      console.log(`🔗 Reset URL: ${resetUrl}`);
      console.log('='.repeat(80) + '\n');
      return { success: true, method: 'sendgrid' };
    }
    
    // Fallback to Nodemailer (Gmail)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await sendEmailWithNodemailer(email, resetUrl, userName);
      console.log('\n' + '='.repeat(80));
      console.log('📧 EMAIL SENT SUCCESSFULLY (via Gmail)');
      console.log('='.repeat(80));
      console.log(`✅ To: ${email}`);
      console.log(`📝 Subject: Password Reset Request`);
      console.log(`🔗 Reset URL: ${resetUrl}`);
      console.log('='.repeat(80) + '\n');
      return { success: true, method: 'nodemailer' };
    }
    
    // No email service configured
    throw new Error('No email service configured. Please set up SendGrid or Gmail credentials.');
    
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ EMAIL SENDING FAILED');
    console.error('='.repeat(80));
    console.error(`Error: ${error.message}`);
    console.error('='.repeat(80) + '\n');
    
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};
