// Test the complete forgot password flow
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testForgotPasswordFlow() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING FORGOT PASSWORD FLOW');
  console.log('='.repeat(80));

  // Test email (use a real email you have access to)
  const testEmail = 'aicardamagedetection@gmail.com';

  console.log(`\n📧 Testing with email: ${testEmail}`);
  console.log('📤 Sending forgot password request...\n');

  try {
    // Step 1: Request OTP
    const response = await axios.post(`${API_URL}/forgot-password`, {
      email: testEmail
    });

    console.log('✅ SUCCESS!');
    console.log('Response:', response.data);
    console.log('\n📧 Check your email inbox for the OTP!');
    console.log('📧 Sender should be: aicardamagedetection@gmail.com');
    console.log('\n' + '='.repeat(80));
    console.log('NEXT STEPS:');
    console.log('1. Check email inbox (and spam folder)');
    console.log('2. Copy the 6-digit OTP from the email');
    console.log('3. Use the OTP to verify and reset password');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    console.log('\n💡 Make sure:');
    console.log('1. Backend server is running (npm start)');
    console.log('2. MongoDB is connected');
    console.log('3. Email credentials are configured in .env');
    console.log('='.repeat(80) + '\n');
  }
}

testForgotPasswordFlow();
