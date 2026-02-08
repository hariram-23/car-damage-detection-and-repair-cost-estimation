// Test email sending
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING EMAIL CONFIGURATION');
  console.log('='.repeat(80));
  
  // Check environment variables
  console.log(`\n📧 Email User: ${process.env.EMAIL_USER}`);
  console.log(`🔑 Password Set: ${process.env.EMAIL_PASSWORD ? 'Yes' : 'No'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('\n❌ ERROR: EMAIL_USER or EMAIL_PASSWORD not set in .env file');
    console.log('\n💡 Please update backend/.env file with your email credentials');
    process.exit(1);
  }

  // Clean password (remove spaces)
  const cleanPassword = process.env.EMAIL_PASSWORD.replace(/\s/g, '');

  // Create transporter
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanPassword
      }
    });
  } catch (error) {
    console.error('❌ Failed to create transporter:', error.message);
    process.exit(1);
  }

  // Test connection
  console.log('\n🔌 Testing Gmail connection...');
  try {
    await transporter.verify();
    console.log('✅ Gmail connection successful!');
  } catch (error) {
    console.error('❌ Gmail connection failed:');
    console.error(error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Make sure you\'re using an App Password (not your regular Gmail password)');
    console.log('2. Generate a new App Password at: https://myaccount.google.com/apppasswords');
    console.log('3. Enable 2-Factor Authentication first');
    console.log('4. Update EMAIL_USER and EMAIL_PASSWORD in backend/.env file');
    process.exit(1);
  }

  // Send test email
  console.log('\n📤 Sending test email...');
  const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
  
  try {
    const info = await transporter.sendMail({
      from: `"AI Damage System Test" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: 'Test Email - AI Damage System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00d9ff;">✅ Email Test Successful!</h2>
          <p>If you're reading this, your email configuration is working correctly.</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Email: ${process.env.EMAIL_USER}</li>
            <li>Service: Gmail</li>
            <li>Status: ✅ Working</li>
          </ul>
          <p>You can now use the forgot password feature in your application.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email from AI Damage System</p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📧 Sent to: ${testEmail}`);
    console.log('\n🎉 SUCCESS! Check your email inbox (and spam folder)');
    console.log('='.repeat(80) + '\n');
    
  } catch (error) {
    console.error('❌ Failed to send test email:');
    console.error(error.message);
    console.log('\n💡 Check the error above and try again');
    process.exit(1);
  }
}

testEmail();
