# 🚀 Deploy Frontend to Vercel

## Your Backend URL:
```
https://ai-damage-system-of-cars.onrender.com
```

✅ Frontend is already configured to use this URL!

---

## Step-by-Step Vercel Deployment (5 Minutes)

### Step 1: Go to Vercel
1. Open: https://vercel.com/
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find your repository: `car-damage-detection-and-repair-cost-estimation`
3. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset**: Vite (should auto-detect)

**Root Directory**: Click **"Edit"** → Type: `frontend`

**Build Settings**:
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

### Step 4: Add Environment Variable

Click **"Environment Variables"** section:

**Key**: `VITE_API_URL`

**Value**: `https://ai-damage-system-of-cars.onrender.com/api`

Click **"Add"**

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll see: "🎉 Congratulations!"

### Step 6: Get Your Frontend URL

Copy your Vercel URL (looks like):
```
https://car-damage-detection.vercel.app
```

---

## Step 7: Update Backend CORS

Now you need to update your backend to allow requests from your Vercel URL.

### Option A: Update in Render Dashboard

1. Go to: https://dashboard.render.com/
2. Click on your service: `ai-damage-system-of-cars`
3. Click **"Environment"** tab
4. Find or Add: `FRONTEND_URL`
5. Set value to your Vercel URL: `https://car-damage-detection.vercel.app`
6. Click **"Save Changes"**
7. Service will auto-redeploy

---

## Verify Everything Works

### 1. Test Backend Health
Open: https://ai-damage-system-of-cars.onrender.com/health

Should see:
```json
{
  "status": "OK",
  "database": "connected",
  "environment": "production"
}
```

### 2. Test Frontend
Open your Vercel URL: `https://your-app.vercel.app`

Should see:
- Landing page loads
- Can navigate to Login/Signup
- Can create account
- Can login
- Can upload image
- Can analyze damage

---

## Troubleshooting

### ❌ "Failed to fetch" or CORS Error

**Problem**: Backend doesn't allow requests from your frontend URL

**Fix**:
1. Add `FRONTEND_URL` environment variable in Render
2. Set to your Vercel URL
3. Wait for backend to redeploy
4. Refresh frontend

### ❌ Build Failed on Vercel

**Problem**: Missing dependencies or build errors

**Fix**:
1. Check build logs in Vercel
2. Verify `Root Directory` is set to `frontend`
3. Verify `VITE_API_URL` environment variable is set
4. Click "Redeploy" in Vercel

### ❌ "Network Error" when testing features

**Problem**: Backend URL is wrong or backend is down

**Fix**:
1. Test backend health: https://ai-damage-system-of-cars.onrender.com/health
2. If backend is down, check Render logs
3. Render free tier sleeps after 15 min - first request takes 30-60 seconds to wake up

### ❌ Images not uploading

**Problem**: File size too large or backend storage issue

**Fix**:
1. Ensure images are under 10MB
2. Use JPG or PNG format
3. Check backend logs in Render

---

## Important Notes

### Render Free Tier:
- ⚠️ **Sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds
- Subsequent requests are fast
- Consider upgrading to paid tier ($7/month) for always-on

### Vercel Free Tier:
- ✅ Always on (no sleep)
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

---

## Environment Variables Summary

### Backend (Render):
```
PORT=5000
MONGODB_URI=mongodb+srv://hari:hari@cluster0.isork0b.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
JWT_SECRET=ai_damage_detection_secret_key_2025_production_secure
NODE_ENV=production
EMAIL_USER=hari211415@gmail.com
EMAIL_PASSWORD=kpkdekssubkykbtv
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Frontend (Vercel):
```
VITE_API_URL=https://ai-damage-system-of-cars.onrender.com/api
```

---

## Post-Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend health check works
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads correctly
- [ ] User signup works
- [ ] User login works
- [ ] Image upload works
- [ ] Damage analysis works
- [ ] PDF download works
- [ ] Email OTP works
- [ ] Password reset works
- [ ] FRONTEND_URL updated in Render

---

## Your URLs

**Backend**: https://ai-damage-system-of-cars.onrender.com

**Frontend**: (You'll get this after Vercel deployment)

**GitHub**: https://github.com/hariram-23/car-damage-detection-and-repair-cost-estimation

---

## Quick Commands

### Test Backend API:
```bash
# Health check
curl https://ai-damage-system-of-cars.onrender.com/health

# Test signup
curl -X POST https://ai-damage-system-of-cars.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Redeploy Frontend:
1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments" tab
4. Click "..." on latest deployment
5. Click "Redeploy"

---

## Success! 🎉

Once both are deployed:
1. Share your Vercel URL with users
2. Test all features thoroughly
3. Monitor Render logs for any errors
4. Consider upgrading to paid tiers for production use

---

**Your app is now live!** 🚀

Frontend: `https://your-app.vercel.app`
Backend: `https://ai-damage-system-of-cars.onrender.com`
