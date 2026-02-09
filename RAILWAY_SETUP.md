# 🚂 Railway Deployment - Step by Step Fix

## Your Current Error

**Error**: `MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017`

**Cause**: Railway is trying to connect to `localhost:27017` but you need MongoDB Atlas (cloud database)

---

## ✅ SOLUTION: Follow These Steps Exactly

### Step 1: Create MongoDB Atlas Database (5 minutes)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (use Google sign-in for faster setup)
3. **Create FREE Cluster**:
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select region closest to you
   - Click "Create"

4. **Create Database User**:
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Click "Autogenerate Secure Password" and SAVE IT!
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist All IPs**:
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - IP: `0.0.0.0/0` (should auto-fill)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **IMPORTANT**: Replace `<password>` with the password you saved earlier
   - **IMPORTANT**: Add database name before `?`:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
   ```

---

### Step 2: Configure Railway Environment Variables

1. **Go to Railway Dashboard**: https://railway.app/
2. **Click on your service** (car-damage-detection)
3. **Click "Variables" tab**
4. **Add these environment variables** (click "New Variable" for each):

```
PORT
5000

MONGODB_URI
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection?retryWrites=true&w=majority

JWT_SECRET
ai_damage_detection_secret_key_2025_production_secure

NODE_ENV
production

EMAIL_USER
hari211415@gmail.com

EMAIL_PASSWORD
kpkdekssubkykbtv

FRONTEND_URL
http://localhost:5173
```

**CRITICAL**: 
- Replace `YOUR_PASSWORD` in MONGODB_URI with your actual MongoDB password
- Replace `cluster0.xxxxx` with your actual cluster address
- Update `FRONTEND_URL` later when you deploy frontend

5. **Click "Deploy"** or wait for auto-redeploy

---

### Step 3: Verify Deployment

1. **Check Logs**:
   - Click "Deployments" tab
   - Click on latest deployment
   - Look for: `✅ MongoDB Connected Successfully`

2. **Test Health Endpoint**:
   - Copy your Railway URL (e.g., `https://car-damage-detection-production.up.railway.app`)
   - Open in browser: `https://your-url.up.railway.app/health`
   - Should see:
   ```json
   {
     "status": "OK",
     "timestamp": "...",
     "database": "connected",
     "environment": "production"
   }
   ```

---

## Common Issues & Fixes

### ❌ Still getting ECONNREFUSED?

**Check**:
1. MONGODB_URI is set in Railway (not using .env file)
2. Password in connection string has NO `<>` brackets
3. Database name is added: `/ai-damage-detection?`

**Fix**: Delete and re-add MONGODB_URI variable in Railway

---

### ❌ "Authentication failed"

**Cause**: Wrong password or username

**Fix**:
1. Go to MongoDB Atlas → Database Access
2. Edit user → Reset password
3. Update MONGODB_URI in Railway with new password

---

### ❌ "Server selection timed out"

**Cause**: IP not whitelisted

**Fix**:
1. Go to MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is in the list
3. Wait 2-3 minutes for changes to apply

---

### ❌ "Cannot read property 'MONGODB_URI' of undefined"

**Cause**: Environment variables not set in Railway

**Fix**:
1. Railway Dashboard → Your Service → Variables
2. Add all required variables listed in Step 2
3. Redeploy

---

## Example Connection String

**WRONG** ❌:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/
```

**CORRECT** ✅:
```
mongodb+srv://admin:MySecurePass123@cluster0.abc123.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
```

**Key Points**:
- Replace `<password>` with actual password (no brackets!)
- Add `/ai-damage-detection` before `?`
- Keep `?retryWrites=true&w=majority` at the end

---

## Quick Checklist

Before redeploying, verify:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] IP `0.0.0.0/0` whitelisted
- [ ] Connection string copied and password replaced
- [ ] Database name `/ai-damage-detection` added to connection string
- [ ] All environment variables added in Railway
- [ ] MONGODB_URI has correct format (no `<>` brackets)

---

## After Successful Deployment

1. **Test Backend**:
   ```
   https://your-railway-url.up.railway.app/health
   ```

2. **Deploy Frontend** (Vercel):
   - Go to https://vercel.com/
   - Import your GitHub repo
   - Root Directory: `frontend`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-railway-url.up.railway.app
     ```

3. **Update Backend FRONTEND_URL**:
   - Railway → Variables → Edit FRONTEND_URL
   - Set to your Vercel URL: `https://your-app.vercel.app`

---

## Need More Help?

**Check Railway Logs**:
1. Railway Dashboard → Your Service
2. Click "Deployments"
3. Click latest deployment
4. Read error messages

**Common Log Messages**:

✅ **"MongoDB Connected Successfully"** = Working!
❌ **"MONGODB_URI is not defined"** = Add environment variable
❌ **"ECONNREFUSED"** = Using localhost, need MongoDB Atlas
❌ **"Authentication failed"** = Wrong password
❌ **"Server selection timed out"** = IP not whitelisted

---

## Pro Tips

💡 **Test MongoDB connection locally first**:
```bash
cd backend
# Update .env with MongoDB Atlas URI
npm start
# Should see: ✅ MongoDB Connected Successfully
```

💡 **Use Railway CLI for faster debugging**:
```bash
npm i -g @railway/cli
railway login
railway logs
```

💡 **MongoDB Atlas is FREE** for up to 512MB storage

💡 **Railway auto-redeploys** when you push to GitHub

---

## Summary

1. ✅ Create MongoDB Atlas cluster
2. ✅ Get connection string with password
3. ✅ Add MONGODB_URI to Railway variables
4. ✅ Redeploy and check logs
5. ✅ Test /health endpoint

**Your backend will be live in 5 minutes!** 🚀
