# ⚡ Quick Deploy - 15 Minutes

Follow these steps to deploy your AI Damage Detection system quickly.

---

## Step 1: MongoDB Atlas (5 min)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE M0 cluster
3. Create database user (save password!)
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string:
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Railway (5 min)

1. Go to https://railway.app/
2. New Project → Deploy from GitHub
3. Select your repo
4. Settings → Root Directory: `backend`
5. Variables → Add:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=your-secret-key-change-this
   NODE_ENV=production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   FRONTEND_URL=http://localhost:5173
   ```
6. Wait for deployment
7. Settings → Generate Domain
8. Copy URL: `https://your-app.up.railway.app`

---

## Step 3: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com/
2. New Project → Import from GitHub
3. Root Directory: `frontend`
4. Environment Variables:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```
5. Deploy
6. Copy URL: `https://your-app.vercel.app`

---

## Step 4: Update Backend URL

1. Railway → Variables → Edit `FRONTEND_URL`
2. Set to: `https://your-app.vercel.app`
3. Save (auto-redeploys)

---

## ✅ Test

1. Open: `https://your-app.vercel.app`
2. Signup → Login → Upload image → Analyze

**Done! Your app is live!** 🎉

---

## 🆘 Issues?

**Backend not connecting to MongoDB?**
- Check MONGODB_URI format
- Verify password has no `<>` brackets
- Ensure IP `0.0.0.0/0` is whitelisted

**Frontend can't reach backend?**
- Check VITE_API_URL in Vercel
- Verify Railway backend is running
- Check CORS settings

**Email not working?**
- Use Gmail App Password (not regular password)
- Enable 2FA in Google Account
- Generate App Password: https://myaccount.google.com/apppasswords

---

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.
