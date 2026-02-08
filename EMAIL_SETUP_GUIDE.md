# Email Setup Guide for Password Reset

To enable email functionality for password reset, you need to configure your email credentials.

## Option 1: Gmail (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification"
4. Follow the setup process

### Step 2: Generate App Password
1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Windows Computer" (or your device) as the device
4. Click "Generate"
5. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update .env File
Open `backend/.env` and update these lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:5173
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with the app password you generated

### Step 4: Restart Server
After updating the .env file, restart your backend server:

```bash
cd backend
npm start
```

---

## Option 2: Other Email Providers

### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

Update `backend/utils/emailService.js`:
```javascript
service: 'outlook'  // Change from 'gmail' to 'outlook'
```

### Yahoo
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

Update `backend/utils/emailService.js`:
```javascript
service: 'yahoo'  // Change from 'gmail' to 'yahoo'
```

### Custom SMTP Server
If you want to use a custom SMTP server, update `backend/utils/emailService.js`:

```javascript
return nodemailer.createTransport({
  host: 'smtp.your-domain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

---

## Testing the Email

1. Start your backend server
2. Go to the login page
3. Click "Forgot password?"
4. Enter your email address
5. Click "Send Reset Link"
6. Check your email inbox (and spam folder)

---

## Troubleshooting

### "Failed to send email" error

**Check 1: Verify credentials**
- Make sure EMAIL_USER and EMAIL_PASSWORD are correct in .env
- For Gmail, ensure you're using the App Password, not your regular password

**Check 2: Check server console**
- Look for error messages in the terminal where your backend is running
- Common errors:
  - "Invalid login" = Wrong email or password
  - "Connection timeout" = Firewall or network issue
  - "Authentication failed" = Need to enable 2FA and use App Password

**Check 3: Gmail security settings**
- Ensure 2-Factor Authentication is enabled
- Ensure you generated an App Password (not using regular password)
- Check if "Less secure app access" is needed (older accounts)

**Check 4: Firewall/Antivirus**
- Some firewalls block SMTP connections
- Try temporarily disabling firewall to test

### Email not arriving

**Check 1: Spam folder**
- Check your spam/junk folder
- Mark the email as "Not Spam" if found there

**Check 2: Email address**
- Verify you entered the correct email address
- Check for typos

**Check 3: Server logs**
- Check backend console for "EMAIL SENT SUCCESSFULLY" message
- If you see this, the email was sent successfully

---

## Development Mode Fallback

If email is not configured, the system will:
1. Log the reset link to the console
2. Return the reset URL in the API response (development only)
3. You can copy the link from the console and paste it in your browser

Look for this in your backend console:
```
================================================================================
🔐 PASSWORD RESET REQUEST
================================================================================
📧 Email: user@example.com
🔗 Reset Link: http://localhost:5173/reset-password/abc123...
⏰ Expires: 1/1/2025, 12:00:00 PM
================================================================================
```

Copy the reset link and paste it in your browser to reset the password.

---

## Production Deployment

For production, update these in your .env:

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
EMAIL_USER=noreply@your-domain.com
EMAIL_PASSWORD=your-secure-password
```

Consider using:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (pay as you go)
- **Postmark** (free tier: 100 emails/month)

These services are more reliable for production than Gmail.

---

## Security Notes

⚠️ **Important:**
- Never commit your .env file to Git
- Never share your App Password
- Use environment variables in production
- Rotate passwords regularly
- Use a dedicated email account for sending (not your personal email)

---

## Need Help?

If you're still having issues:
1. Check the backend console for error messages
2. Verify all steps above
3. Try using a different email provider
4. Contact support with the error message from console
