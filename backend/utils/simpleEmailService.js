const nodemailer = require('nodemailer');

// Create a test account automatically if no credentials provided
async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('\n' + '='.repeat(80));
    console.log('📧 USING TEST EMAIL ACCOUNT (Ethereal)');
    console.log('='.repeat(80));
    console.log('✅ Test account created automatically');
    console.log('📬 You can view sent emails at: https://ethereal.email');
    console.log('='.repeat(80) + '\n');
    return testAccount;
  } catch (error) {
    console.error('Failed to create test account:', error.message);
    return null;
  }
}

// Send password reset email
async function sendPasswordResetEmail(email, resetUrl, userName) {
  try {
    let transporter;
    let usingTestAccount = false;

    // Try to use configured Gmail first
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const cleanPassword = process.env.EMAIL_PASSWORD.replace(/\s/g, '');
      
      transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: cleanPassword
        }
      });

      // Test the connection
      try {
        await transporter.verify();
        console.log('✅ Using Gmail:', process.env.EMAIL_USER);
      } catch (verifyError) {
        console.warn('⚠️  Gmail authentication failed:', verifyError.message);
        console.log('📧 Falling back to test email service...');
        transporter = null;
      }
    }

    // If Gmail doesn't work, use Ethereal test account
    if (!transporter) {
      const testAccount = await createTestAccount();
      if (!testAccount) {
        throw new Error('Failed to create email service');
      }

      transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      usingTestAccount = true;
    }

    // Email content
    const mailOptions = {
      from: usingTestAccount ? '"AI Damage System" <noreply@aidamage.com>' : `"AI Damage System" <${process.env.EMAIL_USER}>`,
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

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('\n' + '='.repeat(80));
    console.log('📧 EMAIL SENT SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`✅ To: ${email}`);
    console.log(`📝 Subject: Password Reset Request`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    
    if (usingTestAccount) {
      console.log('\n⚠️  USING TEST EMAIL SERVICE');
      console.log('📬 View email at: ' + nodemailer.getTestMessageUrl(info));
      console.log('💡 For production, configure Gmail or SendGrid in .env');
    }
    
    console.log('='.repeat(80) + '\n');

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: usingTestAccount ? nodemailer.getTestMessageUrl(info) : null
    };

  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ EMAIL SENDING FAILED');
    console.error('='.repeat(80));
    console.error(`Error: ${error.message}`);
    console.error('='.repeat(80) + '\n');
    
    throw error;
  }
}

module.exports = {
  sendPasswordResetEmail
};
