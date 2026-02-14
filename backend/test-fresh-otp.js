// Fresh OTP test to verify sender email
require('dotenv').config();
const { sendOTPEmail } = require('./utils/otpEmailService');

async function testFreshOTP() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING OTP EMAIL WITH CORRECT SENDER');
  console.log('='.repeat(80));
  
  console.log(`\n📧 Configured Sender: ${process.env.EMAIL_USER}`);
  console.log(`🔑 Password Configured: ${process.env.EMAIL_PASSWORD ? 'Yes' : 'No'}`);
  
  // Send to a test email (you can change this)
  const recipientEmail = 'aicardamagedetection@gmail.com'; // Change to your test email
  const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const testName = 'Test User';

  console.log(`\n📤 Sending OTP to: ${recipientEmail}`);
  console.log(`🔐 OTP Code: ${testOTP}`);
  console.log(`👤 User Name: ${testName}`);
  
  try {
    await sendOTPEmail(recipientEmail, testOTP, testName);
    console.log('\n✅ SUCCESS! Check the email inbox');
    console.log(`📧 The email should show sender as: ${process.env.EMAIL_USER}`);
    console.log('='.repeat(80) + '\n');
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    console.log('='.repeat(80) + '\n');
  }
}

testFreshOTP();
