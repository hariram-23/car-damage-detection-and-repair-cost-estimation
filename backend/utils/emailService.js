const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('\n⚠️  WARNING: Email credentials not configured in .env file');
    console.warn('Please set EMAIL_USER and EMAIL_PASSWORD in backend/.env');
    console.warn('See EMAIL_SETUP_GUIDE.md for instructions\n');
    return null;
  }

  // For Gmail, you need to:
  // 1. Enable 2-factor authentication
  // 2. Generate an "App Password" from Google Account settings
  // 3. Use that app password in EMAIL_PASSWORD
  
  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl, userName) => {
  try {
    const transporter = createTransporter();

    // If transporter is null, email is not configured
    if (!transporter) {
      throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file. See EMAIL_SETUP_GUIDE.md for instructions.');
    }

    const mailOptions = {
      from: `"AI Damage System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - AI Damage System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
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
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background: #00b8d4;
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="logo">🚗 AI DAMAGE SYSTEM</div>
              
              <h2>Password Reset Request</h2>
              
              <p>Hello ${userName || 'User'},</p>
              
              <p>We received a request to reset your password for your AI Damage System account. If you didn't make this request, you can safely ignore this email.</p>
              
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #00d9ff;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>This link can only be used once</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              
              <p>Best regards,<br>
              <strong>AI Damage System Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2025 AI Damage System. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n' + '='.repeat(80));
    console.log('📧 EMAIL SENT SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`✅ Message ID: ${info.messageId}`);
    console.log(`📬 To: ${email}`);
    console.log(`📝 Subject: Password Reset Request`);
    console.log('='.repeat(80) + '\n');
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ EMAIL SENDING FAILED');
    console.error('='.repeat(80));
    console.error(error);
    console.error('='.repeat(80) + '\n');
    
    throw new Error('Failed to send email. Please check your email configuration.');
  }
};

module.exports = {
  sendPasswordResetEmail
};
