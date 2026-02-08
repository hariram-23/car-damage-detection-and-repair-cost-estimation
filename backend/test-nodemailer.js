const nodemailer = require('nodemailer');

console.log('Nodemailer version:', nodemailer);
console.log('createTransport type:', typeof nodemailer.createTransport);

if (typeof nodemailer.createTransport === 'function') {
  console.log('✅ nodemailer.createTransport is a function');
} else {
  console.log('❌ nodemailer.createTransport is NOT a function');
  console.log('Available methods:', Object.keys(nodemailer));
}
