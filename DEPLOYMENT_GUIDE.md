# 🚀 Complete Deployment Guide - AI Damage Detection System

## Overview
This guide will help you deploy:
- **Backend**: Railway (Node.js + Python ML service)
- **Frontend**: Vercel (React + Vite)
- **Database**: MongoDB Atlas (Free tier)

---

## 📋 Prerequisites

Before starting, ensure you have:
- GitHub account (to connect repositories)
- MongoDB Atlas account (free)
- Railway account (free tier available)
- Vercel account (free tier available)

---

## Part 1: Setup MongoDB Atlas (5 minutes)

### Step 1: Create Database

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google for faster setup)
3. Click "Build a Database"
4. Choose **M0 FREE** tier
5. Select region closest to you
6. Click "Create"

### Step 2: Create Database User

1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `admin`
4. Click "Autogenerate Secure Password" → **SAVE THIS PASSWORD!**
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### Step 3: Whitelist All IPs

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP: `0.0.0.0/0` (auto-fills)
5. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>` with your saved password**
6. **Add database name before `?`**:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
   ```

**Save this connection string - you'll need it for Railway!**

---

## Part 2: Deploy Backend to Railway (10 minutes)

### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub
2. Make sure `backend/` folder contains:
   - `package.json`
   - `server.js`
   - `railway.json`
   - `Procfile`
   - `ml_service/requirements.txt`

### Step 2: Create Railway Project

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Railway will detect Node.js automatically

### Step 3: Configure Root Directory

1. Click on your service
2. Go to "Settings" tab
3. Find "Root Directory"
4. Set to: `backend`
5. Click "Save"

### Step 4: Add Environment Variables

1. Click "Variables" tab
2. Click "New Variable" and add each:

```env
PORT=5000

MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection?retryWrites=true&w=majority

JWT_SECRET=ai_damage_detection_secret_key_2025_production_secure_change_this

NODE_ENV=production

EMAIL_USER=your-email@gmail.com

EMAIL_PASSWORD=your-gmail-app-password

FRONTEND_URL=http://localhost:5173
```

**Important**:
- Replace `YOUR_PASSWORD` in MONGODB_URI with your MongoDB password
- Replace `cluster0.xxxxx` with your actual cluster address
- For EMAIL_PASSWORD: Use Gmail App Password (see below)
- Update FRONTEND_URL after deploying frontend

### Step 5: Get Gmail App Password

1. Enable 2-Factor Authentication in Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and generate password
4. Copy the 16-character password
5. Use this as EMAIL_PASSWORD in Railway

### Step 6: Deploy

1. Railway will auto-deploy after adding variables
2. Wait 3-5 minutes for build to complete
3. Check "Deployments" tab for progress

### Step 7: Get Backend URL

1. Go to "Settings" tab
2. Find "Domains" section
3. Click "Generate Domain"
4. Copy your URL: `https://your-app.up.railway.app`

### Step 8: Verify Deployment

Open in browser:
```
https://your-app.up.railway.app/health
```

Should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "connected",
  "environment": "production"
}
```

---

## Part 3: Deploy Frontend to Vercel (5 minutes)

### Step 1: Prepare Frontend

1. Ensure `frontend/` folder contains:
   - `package.json`
   - `vite.config.js`
   - `vercel.json`

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variable

1. In Vercel project settings
2. Go to "Environment Variables"
3. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-railway-backend-url.up.railway.app/api
   ```
4. Click "Add"

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Vercel will provide your URL: `https://your-app.vercel.app`

### Step 5: Update Backend FRONTEND_URL

1. Go back to Railway dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Edit `FRONTEND_URL`
5. Set to: `https://your-app.vercel.app`
6. Save (Railway will auto-redeploy)

---

## Part 4: Final Testing

### Test Backend

1. Health check:
   ```
   https://your-railway-url.up.railway.app/health
   ```

2. Root endpoint:
   ```
   https://your-railway-url.up.railway.app/
   ```

### Test Frontend

1. Open: `https://your-app.vercel.app`
2. Try signup/login
3. Upload test image
4. Verify damage detection works

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "ECONNREFUSED 127.0.0.1:27017"**
- You're using localhost MongoDB
- Solution: Use MongoDB Atlas connection string in Railway variables

**Error: "Authentication failed"**
- Wrong MongoDB password
- Solution: Reset password in MongoDB Atlas → Update MONGODB_URI

**Error: "Server selection timed out"**
- IP not whitelisted
- Solution: Add `0.0.0.0/0` to Network Access in MongoDB Atlas

**Error: "MONGODB_URI is not defined"**
- Environment variable not set
- Solution: Add MONGODB_URI in Railway Variables tab

### Frontend Issues

**Error: "Network Error" or "Failed to fetch"**
- Backend URL incorrect
- Solution: Check VITE_API_URL in Vercel environment variables

**CORS Error**
- Frontend URL not whitelisted in backend
- Solution: Update FRONTEND_URL in Railway variables

### ML Service Issues

**Error: "Python not found"**
- Railway should auto-install Python
- Check railway.json has correct build command

**Error: "Model not found"**
- Ensure `backend/yolov8n.pt` is in repository
- Check file size (should be ~6MB)

---

## 📊 Deployment Checklist

Before going live, verify:

- [ ] MongoDB Atlas cluster created and running
- [ ] Database user created with password saved
- [ ] IP `0.0.0.0/0` whitelisted in MongoDB
- [ ] Backend deployed to Railway
- [ ] All environment variables set in Railway
- [ ] Backend health check returns "connected"
- [ ] Frontend deployed to Vercel
- [ ] VITE_API_URL set in Vercel
- [ ] FRONTEND_URL updated in Railway
- [ ] Can signup/login on frontend
- [ ] Can upload and analyze images
- [ ] Email notifications working (test forgot password)

---

## 🔒 Security Recommendations

1. **Change JWT_SECRET**: Use a strong random string
2. **Use App Passwords**: Never use actual Gmail password
3. **Environment Variables**: Never commit .env files
4. **MongoDB**: Use strong password, enable IP whitelist
5. **CORS**: Only allow your frontend domain in production

---

## 💰 Cost Estimate

- **MongoDB Atlas**: FREE (M0 tier, 512MB)
- **Railway**: FREE tier ($5 credit/month, then $0.000231/GB-hour)
- **Vercel**: FREE (100GB bandwidth/month)

**Total**: FREE for small-medium traffic

---

## 📈 Monitoring

### Railway Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Vercel Logs
- Go to Vercel dashboard
- Click on your project
- View "Deployments" → Click deployment → "Logs"

---

## 🚀 Quick Deploy Commands

If you need to redeploy:

**Backend (Railway)**:
```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys
```

**Frontend (Vercel)**:
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

---

## 📞 Support

If you encounter issues:

1. Check Railway logs: Dashboard → Deployments → View logs
2. Check Vercel logs: Dashboard → Deployments → Function logs
3. Verify environment variables are set correctly
4. Test MongoDB connection string locally first

---

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ Railway health check shows "connected"
2. ✅ Frontend loads without errors
3. ✅ Can create account and login
4. ✅ Can upload images
5. ✅ Damage detection returns results
6. ✅ Can download PDF reports
7. ✅ Email notifications work

---

## 🎉 You're Live!

Share your app:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.up.railway.app`

**Congratulations on deploying your AI Damage Detection System!** 🚗✨
