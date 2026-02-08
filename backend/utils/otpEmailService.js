const nodemailer = require('nodemailer');

// Send OTP email
async function sendOTPEmail(email, otp, userName) {
  try {
    let transporter;

    // Use configured Gmail
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const cleanPassword = process.env.EMAIL_PASSWORD.replace(/\s/g, '');
      
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: cleanPassword
        }
      });

      // Test connection
      try {
        await transporter.verify();
        console.log('✅ Gmail connected for OTP');
      } catch (verifyError) {
        console.error('❌ Gmail failed:', verifyError.message);
        throw new Error('Email service not configured. Please set up Gmail credentials in .env file.');
      }
    } else {
      throw new Error('Email credentials not configured in .env file');
    }

    // Email content
    const mailOptions = {
      from: `"AI Damage System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - AI Damage System',
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
            .otp-box {
              background: #f8f9fa;
              border: 2px dashed #00d9ff;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #00d9ff;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
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
              .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="logo">🚗 AI DAMAGE SYSTEM</div>
              
              <h2>Password Reset OTP</h2>
              
              <p>Hello ${userName || 'User'},</p>
              
              <p>You requested to reset your password. Use the OTP below to proceed:</p>
              
              <div class="otp-box">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Your OTP Code</div>
                <div class="otp-code">${otp}</div>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                Enter this code on the password reset page
              </p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>This OTP expires in 10 minutes</li>
                  <li>This OTP can only be used once</li>
                  <li>Never share this OTP with anyone</li>
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
    console.log('📧 OTP EMAIL SENT SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`✅ To: ${email}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log(`⏰ Expires in: 10 minutes`);
    console.log('='.repeat(80) + '\n');

    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ OTP EMAIL SENDING FAILED');
    console.error('='.repeat(80));
    console.error(`Error: ${error.message}`);
    console.error('='.repeat(80) + '\n');
    
    throw error;
  }
}

module.exports = {
  sendOTPEmail
};
