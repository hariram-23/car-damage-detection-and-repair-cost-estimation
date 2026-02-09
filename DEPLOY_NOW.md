# 🚀 Quick Deployment Guide

## Before You Start

Make sure you have:
- [ ] GitHub account (code already pushed ✅)
- [ ] Gmail App Password ready
- [ ] 15 minutes of time

---

## Option 1: Railway (RECOMMENDED - Easiest for Python + Node.js)

### Why Railway?
- ✅ Auto-detects Python + Node.js
- ✅ No complex configuration
- ✅ 500 hours free/month
- ✅ Faster deployment

### Steps:

**1. Create MongoDB Database (5 minutes)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create cluster (M0 Free)
4. Database Access → Add User:
   - Username: `admin`
   - Password: (generate strong password, save it!)
5. Network Access → Add IP: `0.0.0.0/0`
6. Connect → Get connection string:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection
   ```
   (Replace YOUR_PASSWORD with actual password)

**2. Deploy Backend on Railway (5 minutes)**
1. Go to: https://railway.app/
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose: `car-damage-detection-and-repair-cost-estimation`
6. Railway will auto-detect and deploy!

**3. Add Environment Variables**
Click "Variables" tab and add:
```
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection
JWT_SECRET=my_super_secret_key_for_jwt_tokens_min_32_chars
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-16-chars
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**4. Get Backend URL**
- Click "Settings" → Copy the domain
- Example: `https://ai-damage-backend.up.railway.app`

**5. Deploy Frontend on Vercel (3 minutes)**
1. Go to: https://vercel.com/
2. Sign in with GitHub
3. "Add New" → "Project"
4. Import your repository
5. Configure:
   - Framework: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```
7. Click "Deploy"

**6. Update Backend FRONTEND_URL**
1. Go back to Railway
2. Update `FRONTEND_URL` variable with your Vercel URL
3. Service will auto-redeploy

**✅ DONE! Test your app**

---

## Option 2: Render (Free but slower)

### Steps:

**1. Create MongoDB** (same as above)

**2. Deploy Backend on Render**
1. Go to: https://render.com/
2. Sign in with GitHub
3. "New +" → "Web Service"
4. Connect repository
5. Configure:
   - Name: `ai-damage-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && pip install -r ml_service/requirements.txt`
   - Start Command: `node server.js`
6. Add environment variables (same as Railway)
7. Create service

**3. Deploy Frontend** (same as Railway option)

---

## Gmail App Password Setup (2 minutes)

**If you don't have Gmail App Password yet:**

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Gmail
3. Create app password:
   - App: "Mail"
   - Device: "Other" → Type: "AI Damage Detection"
4. Click "Generate"
5. Copy the 16-character password (no spaces)
6. Use this as `EMAIL_PASSWORD` in environment variables

**Note**: You need 2-Step Verification enabled on your Google account first!

---

## Testing After Deployment

### 1. Test Backend
Open: `https://your-backend-url/health`
Should see: `{"status":"OK","timestamp":"..."}`

### 2. Test Frontend
Open: `https://your-frontend-url`
Should see: Landing page

### 3. Test Features
- [ ] Sign up new user
- [ ] Login
- [ ] Upload car image
- [ ] Get damage analysis
- [ ] View report
- [ ] Download PDF
- [ ] Test forgot password (OTP email)
- [ ] Reset password

---

## Common Issues & Quick Fixes

### ❌ "Cannot connect to database"
**Fix**: 
1. Check MongoDB IP whitelist: `0.0.0.0/0`
2. Verify connection string has correct password
3. No `<>` brackets in password

### ❌ "Email not sending"
**Fix**:
1. Use Gmail App Password (not regular password)
2. Enable 2-Step Verification on Google account
3. Check EMAIL_USER is full email: `user@gmail.com`

### ❌ "CORS error"
**Fix**:
1. Update `FRONTEND_URL` in backend environment variables
2. Use exact Vercel URL (with https://)
3. Redeploy backend

### ❌ "Build failed"
**Fix**:
1. Check deployment logs
2. Verify Node version (18+)
3. Try Railway instead of Render

---

## Cost

**Everything is FREE for development/testing:**
- Railway: 500 hours/month free
- Render: Free (sleeps after 15 min)
- Vercel: Free (100GB bandwidth)
- MongoDB Atlas: Free (512MB)

**Total: $0/month** 🎉

---

## Need Help?

1. Check deployment logs first
2. Read `DEPLOYMENT_FIXES.md` for detailed troubleshooting
3. Verify all environment variables are set
4. Test locally first: `cd backend && npm start`

---

## Pro Tips

💡 **Use Railway** - Much easier for projects with Python + Node.js
💡 **Test locally first** - Make sure everything works before deploying
💡 **Save your passwords** - Keep MongoDB password and Gmail App Password safe
💡 **Check logs** - Most errors are clearly shown in deployment logs
💡 **Free tier limits** - Render sleeps after 15 min inactivity (Railway doesn't)

---

## Quick Commands

```bash
# Test backend locally
cd backend
npm install
npm start

# Test frontend locally
cd frontend
npm install
npm run dev

# Push changes
git add .
git commit -m "Update for deployment"
git push origin main
```

---

**Ready to deploy? Start with Railway - it's the easiest!** 🚀

Good luck! 🎉
