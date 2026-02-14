# 🚂 Railway Environment Variables

## Copy these EXACT values to Railway Dashboard

Go to: https://railway.app/ → Your Service → Variables Tab

---

## Required Variables:

### 1. PORT
```
5000
```

### 2. MONGODB_URI
```
mongodb+srv://hari:hari@cluster0.isork0b.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
```

### 3. JWT_SECRET
```
ai_damage_detection_secret_key_2025_production_secure
```

### 4. NODE_ENV
```
production
```

### 5. EMAIL_USER
```
aicardamagedetection@gmail.com
```

### 6. EMAIL_PASSWORD
```
uzezehjeuiitdzsl
```

### 7. FRONTEND_URL (Update after deploying frontend)
```
http://localhost:5173
```
**Note**: Change this to your Vercel URL after frontend deployment

---

## How to Add Variables in Railway:

1. Click "Variables" tab
2. Click "New Variable"
3. Paste variable name (e.g., `MONGODB_URI`)
4. Paste value
5. Click "Add"
6. Repeat for all variables
7. Railway will auto-redeploy

---

## After Adding Variables:

1. Wait 2-3 minutes for deployment
2. Check logs for: `✅ MongoDB Connected Successfully`
3. Test health endpoint: `https://your-railway-url.up.railway.app/health`

Should see:
```json
{
  "status": "OK",
  "timestamp": "2025-02-09T...",
  "database": "connected",
  "environment": "production"
}
```

---

## ✅ Checklist:

- [ ] All 7 variables added in Railway
- [ ] MONGODB_URI has `/ai-damage-detection` in it
- [ ] Deployment successful (check logs)
- [ ] Health endpoint returns "database": "connected"
- [ ] No errors in Railway logs

---

## Next Steps After Backend Works:

1. **Deploy Frontend on Vercel**:
   - Go to https://vercel.com/
   - Import GitHub repo
   - Root Directory: `frontend`
   - Add env var: `VITE_API_URL=https://your-railway-url.up.railway.app`

2. **Update FRONTEND_URL in Railway**:
   - Change from `http://localhost:5173`
   - To your Vercel URL: `https://your-app.vercel.app`

---

## Troubleshooting:

**If deployment still fails**:
1. Check Railway logs for specific error
2. Verify MongoDB Atlas IP whitelist: `0.0.0.0/0`
3. Test connection string locally first
4. Ensure all 7 variables are set

**Test locally**:
```bash
cd backend
# Update .env with MongoDB Atlas URI
npm start
# Should see: ✅ MongoDB Connected Successfully
```

---

Good luck! 🚀
