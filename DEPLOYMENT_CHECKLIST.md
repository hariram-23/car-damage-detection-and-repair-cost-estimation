# ✅ Deployment Checklist

Use this checklist to ensure successful deployment.

---

## Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] All dependencies listed in package.json
- [ ] Environment variables documented in .env.example
- [ ] No sensitive data in code (passwords, API keys)
- [ ] ML model file exists: `backend/yolov8n.pt`

---

## MongoDB Atlas Setup

- [ ] Account created at mongodb.com
- [ ] M0 FREE cluster created
- [ ] Database user created
- [ ] Password saved securely
- [ ] IP whitelist: `0.0.0.0/0` added
- [ ] Connection string copied
- [ ] Database name added to connection string: `/ai-damage-detection`
- [ ] Password replaced in connection string (no `<>` brackets)

**Connection String Format:**
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-damage-detection?retryWrites=true&w=majority
```

---

## Railway Backend Deployment

- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] Root directory set to: `backend`
- [ ] Environment variables added:
  - [ ] PORT=5000
  - [ ] MONGODB_URI (from MongoDB Atlas)
  - [ ] JWT_SECRET (strong random string)
  - [ ] NODE_ENV=production
  - [ ] EMAIL_USER (Gmail address)
  - [ ] EMAIL_PASSWORD (Gmail App Password)
  - [ ] FRONTEND_URL (update after Vercel deploy)
- [ ] Build completed successfully
- [ ] Domain generated
- [ ] Backend URL copied

**Test Backend:**
```
https://your-railway-url.up.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "database": "connected",
  "environment": "production"
}
```

---

## Gmail App Password Setup

- [ ] 2-Factor Authentication enabled on Google Account
- [ ] App Password generated at: https://myaccount.google.com/apppasswords
- [ ] 16-character password copied
- [ ] Added as EMAIL_PASSWORD in Railway

---

## Vercel Frontend Deployment

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to: `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL=https://your-railway-url.up.railway.app/api
- [ ] Deployment successful
- [ ] Frontend URL copied

**Test Frontend:**
```
https://your-vercel-url.vercel.app
```

---

## Post-Deployment Configuration

- [ ] Update FRONTEND_URL in Railway to Vercel URL
- [ ] Railway auto-redeployed after variable update
- [ ] Wait 2-3 minutes for changes to propagate

---

## Final Testing

### Backend Tests
- [ ] Health endpoint returns "connected"
- [ ] Root endpoint returns API info
- [ ] MongoDB connection successful (check Railway logs)

### Frontend Tests
- [ ] Homepage loads without errors
- [ ] Can navigate to signup page
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Can upload image (drag & drop)
- [ ] Can analyze damage
- [ ] Results display correctly
- [ ] Can download PDF report
- [ ] Can view history
- [ ] Can logout

### Email Tests
- [ ] Click "Forgot Password" on login
- [ ] Enter email and submit
- [ ] Receive OTP email
- [ ] Enter OTP and reset password
- [ ] Can login with new password

### Mobile Tests
- [ ] Responsive design works on mobile
- [ ] Can upload images on mobile
- [ ] All features work on mobile

---

## Monitoring Setup

- [ ] Railway logs accessible
- [ ] Vercel logs accessible
- [ ] MongoDB Atlas monitoring enabled
- [ ] Error tracking configured (optional)

---

## Security Verification

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB password is strong
- [ ] Gmail App Password used (not regular password)
- [ ] No .env files committed to GitHub
- [ ] CORS configured correctly
- [ ] Only allowed origins in backend CORS

---

## Performance Checks

- [ ] Frontend loads in < 3 seconds
- [ ] Image upload works smoothly
- [ ] Damage detection completes in < 10 seconds
- [ ] PDF generation works
- [ ] No console errors in browser

---

## Documentation

- [ ] README.md updated with deployment URLs
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] User guide created (optional)

---

## Backup & Recovery

- [ ] MongoDB Atlas automatic backups enabled
- [ ] GitHub repository backed up
- [ ] Environment variables saved securely
- [ ] Deployment configuration documented

---

## Cost Monitoring

- [ ] Railway usage tracked (FREE tier: $5/month credit)
- [ ] Vercel usage tracked (FREE tier: 100GB bandwidth)
- [ ] MongoDB Atlas usage tracked (FREE tier: 512MB)

---

## Common Issues Resolved

- [ ] "ECONNREFUSED" → Using MongoDB Atlas (not localhost)
- [ ] "Authentication failed" → Correct password in MONGODB_URI
- [ ] "CORS error" → FRONTEND_URL updated in Railway
- [ ] "Network Error" → VITE_API_URL correct in Vercel
- [ ] "Email not sending" → Using Gmail App Password

---

## Success Criteria

✅ All items checked above
✅ Backend health check returns "connected"
✅ Frontend loads and all features work
✅ Can signup, login, upload, analyze, download
✅ Email notifications working
✅ No errors in logs
✅ Mobile responsive

---

## Next Steps After Deployment

1. Share app URL with users
2. Monitor Railway and Vercel logs
3. Set up custom domain (optional)
4. Configure analytics (optional)
5. Set up error tracking (Sentry, etc.)
6. Create user documentation
7. Plan for scaling if needed

---

## Support Resources

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Deployment Guide**: See DEPLOYMENT_GUIDE.md
- **Quick Deploy**: See QUICK_DEPLOY.md

---

**Deployment Date**: _________________

**Backend URL**: _________________

**Frontend URL**: _________________

**Deployed By**: _________________

---

🎉 **Congratulations on your successful deployment!**
