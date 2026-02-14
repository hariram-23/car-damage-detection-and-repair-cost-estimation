# Vercel Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Updated all API calls to use environment variables
- [x] Configured axios base URL
- [x] Updated image URLs to use backend URL
- [x] Set VITE_API_URL in .env file
- [x] No hardcoded localhost URLs in production code

## 📋 Vercel Deployment Steps

### 1. Push Changes to GitHub

```bash
cd ai-damage-detection
git add .
git commit -m "Update API URLs for Render backend deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory
5. Vercel will auto-detect Vite configuration

### 3. Configure Environment Variables on Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add:
- **Name:** `VITE_API_URL`
- **Value:** `https://car-damage-detection-and-repair-cost.onrender.com`
- **Environment:** Production, Preview, Development (select all)

Click "Save"

### 4. Update Backend CORS on Render

In Render Dashboard → Your Service → Environment:

Add/Update:
- **Name:** `FRONTEND_URL`
- **Value:** `https://your-app-name.vercel.app` (use your actual Vercel URL)

Click "Save" and wait for service to restart.

### 5. Redeploy Frontend

After adding environment variables:
- Go to Vercel Dashboard → Deployments
- Click "Redeploy" on the latest deployment
- Or push a new commit to trigger automatic deployment

## 🧪 Testing Checklist

After deployment, test these features:

- [ ] Landing page loads correctly
- [ ] Login with existing account
- [ ] Signup new account
- [ ] Forgot password (email sent)
- [ ] Dashboard loads with statistics
- [ ] Upload and analyze single image
- [ ] Batch analyze multiple images
- [ ] Compare two images
- [ ] View analysis history
- [ ] View detailed report
- [ ] Download PDF report
- [ ] Images display correctly
- [ ] Logout functionality

## 🔍 Troubleshooting

### CORS Error
**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
1. Check `FRONTEND_URL` on Render matches your Vercel URL exactly
2. Include `https://` in the URL
3. Restart Render service after changing environment variables

### API Connection Failed
**Problem:** "Network Error" or "Failed to fetch"

**Solution:**
1. Verify `VITE_API_URL` is set in Vercel
2. Check Render backend is running (visit the URL in browser)
3. Check Render logs for errors

### Images Not Loading
**Problem:** Images show broken icon

**Solution:**
1. Verify backend URL is correct
2. Check `/uploads` folder exists on Render
3. Ensure images are being uploaded correctly

### Environment Variables Not Working
**Problem:** Still using localhost

**Solution:**
1. Redeploy after adding environment variables
2. Clear browser cache
3. Check Vercel build logs for environment variable confirmation

## 📝 Important Notes

1. **Environment Variables:** Vercel requires redeployment after adding/changing environment variables
2. **CORS:** Backend must whitelist your Vercel URL in `FRONTEND_URL`
3. **Build Command:** Vercel auto-detects `npm run build` for Vite projects
4. **Output Directory:** Vercel auto-detects `dist` folder
5. **Node Version:** Ensure package.json specifies compatible Node version

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Login/signup works
- ✅ Images upload and analyze correctly
- ✅ Dashboard shows data
- ✅ No CORS errors in browser console
- ✅ Images display from backend
- ✅ All features work as in local development

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- Your Backend: https://car-damage-detection-and-repair-cost.onrender.com
- Your Frontend: (will be provided after deployment)

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Vercel deployment logs
3. Check Render service logs
4. Verify all environment variables are set correctly
