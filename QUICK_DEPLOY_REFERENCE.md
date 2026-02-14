# 🚀 Quick Deploy Reference

## Backend (Render) - Already Deployed ✅

**URL:** `https://car-damage-detection-and-repair-cost.onrender.com`

### Environment Variables Required:
```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_secret_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=5000
```

### Build Configuration:
```
Build Command: npm install && pip install -r ml_service/requirements.txt
Start Command: node server.js
```

**Note:** ML service is integrated - no separate deployment needed!

---

## Frontend (Vercel) - Ready to Deploy

### Vercel Settings:

**Root Directory:**
```
frontend
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### Environment Variables:
```
VITE_API_URL=https://car-damage-detection-and-repair-cost.onrender.com
```

---

## Deployment Order

1. ✅ **Backend** - Already deployed on Render
2. 🔄 **Frontend** - Deploy now on Vercel
3. 🔧 **Update CORS** - Add Vercel URL to Render's `FRONTEND_URL`

---

## After Frontend Deployment

### Update Backend CORS:

1. Go to Render Dashboard
2. Select your backend service
3. Go to Environment
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-actual-app.vercel.app
   ```
5. Save (service will restart automatically)

---

## Testing Checklist

After both are deployed:

- [ ] Frontend loads at Vercel URL
- [ ] Login/Signup works
- [ ] Dashboard loads
- [ ] Image upload works
- [ ] Damage analysis works (ML service)
- [ ] Images display correctly
- [ ] History shows past analyses
- [ ] PDF download works
- [ ] No CORS errors in browser console

---

## Quick Troubleshooting

### CORS Error
→ Update `FRONTEND_URL` on Render with exact Vercel URL

### API Not Connecting
→ Check `VITE_API_URL` is set in Vercel environment variables

### Images Not Loading
→ Verify backend URL is correct and accessible

### ML Analysis Fails
→ Check Render logs for Python errors
→ Verify model file exists: `Model/best_model.pt`

---

## Important URLs

- **Backend:** https://car-damage-detection-and-repair-cost.onrender.com
- **Frontend:** (will be provided after Vercel deployment)
- **GitHub:** https://github.com/hariram-23/car-damage-detection-and-repair-cost-estimation
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## Support Files

- `ML_DEPLOYMENT_GUIDE.md` - Detailed ML service explanation
- `RENDER_ML_SETUP.md` - ML setup verification
- `DEPLOYMENT_CONFIG.md` - Environment variables guide
- `VERCEL_DEPLOYMENT_CHECKLIST.md` - Step-by-step Vercel guide
- `API_UPDATE_SUMMARY.md` - API changes summary

---

## Key Points

✅ ML service runs **inside** backend (no separate deployment)
✅ Model file is in repository and tracked by git
✅ Python dependencies install automatically on Render
✅ Frontend uses environment variables for API URL
✅ CORS is configured via `FRONTEND_URL` variable

---

## Need Help?

1. Check Render logs for backend errors
2. Check Vercel logs for frontend build errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
