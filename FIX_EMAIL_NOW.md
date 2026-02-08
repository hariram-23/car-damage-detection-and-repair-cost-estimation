# 🚨 FIX EMAIL IN 5 MINUTES

Your email is NOT working because the credentials are incorrect. Follow these steps:

## Step 1: Generate New Gmail App Password

1. Open: https://myaccount.google.com/apppasswords
2. Sign in with: **hari211415@gmail.com**
3. Click "Create" or "Generate"
4. App name: **AI Damage System**
5. Copy the 16-character password (example: `abcd efgh ijkl mnop`)

## Step 2: Update .env File

1. Open: `ai-damage-detection/backend/.env`
2. Find these lines:
   ```env
   EMAIL_USER=hari211415@gmail.com
   EMAIL_PASSWORD=kpkdekssubkykbtv
   ```
3. Replace with YOUR new app password (NO SPACES):
   ```env
   EMAIL_USER=hari211415@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   ⚠️ Remove ALL spaces from the password!

## Step 3: Test Email

1. Open terminal in `backend` folder
2. Run: `node test-email.js`
3. You should see: ✅ Email sent successfully!
4. Check your email inbox

## Step 4: Restart Server

```bash
cd backend
npm start
```

## Step 5: Test Forgot Password

1. Go to login page
2. Click "Forgot password?"
3. Enter: **hari211415@gmail.com**
4. Click "Send Reset Link"
5. Check your phone's Gmail app
6. Click the link in email
7. Reset password on your phone

---

## ⚠️ Common Issues

### "Invalid login" error
- Your app password is wrong
- Generate a NEW app password
- Make sure 2FA is enabled first

### "App Passwords" option not showing
- Enable 2-Factor Authentication first
- Go to: https://myaccount.google.com/security
- Enable "2-Step Verification"
- Then try generating app password again

### Still not working?
Use SendGrid instead (easier):

1. Sign up: https://sendgrid.com/free/
2. Get API key
3. Update `.env`:
   ```env
   SENDGRID_API_KEY=SG.your-key-here
   SENDGRID_FROM_EMAIL=hari211415@gmail.com
   ```
4. Restart server

---

## 📱 How It Will Work

Once fixed:

1. **Any user** clicks "Forgot Password"
2. **Any user** enters their email (gmail, yahoo, outlook, etc.)
3. System sends email to **that user's email**
4. User receives email on **their phone**
5. User clicks link and resets password on **their phone**

**You only need to configure email ONCE (in .env file)**
**Users don't need to configure anything!**

---

## Need Help?

The password in your .env (`kpkdekssubkykbtv`) is either:
1. Wrong
2. Expired
3. Not an App Password

Generate a NEW one and try again!
