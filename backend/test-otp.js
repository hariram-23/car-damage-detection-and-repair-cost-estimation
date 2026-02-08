// Test OTP email sending
require('dotenv').config();
const { sendOTPEmail } = require('./utils/otpEmailService');

async function testOTP() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING OTP EMAIL');
  console.log('='.repeat(80));
  
  const testEmail = process.env.EMAIL_USER || 'test@example.com';
  const testOTP = '123456';
  const testName = 'Test User';

  console.log(`\n📧 Sending OTP to: ${testEmail}`);
  console.log(`🔐 OTP: ${testOTP}`);
  
  try {
    await sendOTPEmail(testEmail, testOTP, testName);
    console.log('\n✅ SUCCESS! Check your email inbox (and spam folder)');
    console.log('='.repeat(80) + '\n');
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. EMAIL_USER and EMAIL_PASSWORD are set in .env');
    console.log('2. You\'re using Gmail App Password (not regular password)');
    console.log('3. Generate new App Password at: https://myaccount.google.com/apppasswords');
    console.log('='.repeat(80) + '\n');
  }
}

testOTP();
