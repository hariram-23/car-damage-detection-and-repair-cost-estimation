# CORS Fix Guide

## Problem
Getting "Blocked by CORS policy: No 'Access-Control-Allow-Origin' header" error when frontend tries to connect to backend.

## Solution Applied

### 1. Updated CORS Configuration in `backend/server.js`

**Changes Made:**
- Added your Vercel URL to allowed origins: `https://car-damage-detection-and-repair-cos-nine.vercel.app`
- Implemented dynamic origin checking function
- Added explicit preflight OPTIONS handling
- Configured proper CORS headers for credentials, methods, and headers
- Added logging for blocked origins (helps debugging)

**New CORS Configuration:**
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://172.16.25.103:5173',
  'https://car-damage-detection-and-repair-cos-nine.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
}));

app.options('*', cors());
```

### 2. Key Features

✅ **Handles Preflight Requests** - OPTIONS requests are properly handled
✅ **Credentials Support** - Allows cookies and authorization headers
✅ **Multiple Origins** - Supports localhost (dev) and Vercel (production)
✅ **Environment Variable** - Can add more origins via FRONTEND_URL
✅ **Debug Logging** - Logs blocked origins for troubleshooting
✅ **Proper Order** - CORS middleware is before all routes

## Deployment Steps

### Step 1: Push Changes to GitHub

```bash
cd ai-damage-detection
git add .
git commit -m "Fix CORS configuration for Vercel frontend"
git push origin main
```

### Step 2: Update Render Environment Variables

Go to your Render dashboard → Your service → Environment

**Option A: Use the hardcoded URL (Recommended)**
No additional environment variable needed! The Vercel URL is already hardcoded in the allowed origins.

**Option B: Use environment variable (Flexible)**
Add this if you want to easily change the frontend URL later:
- **Key:** `FRONTEND_URL`
- **Value:** `https://car-damage-detection-and-repair-cos-nine.vercel.app`

### Step 3: Redeploy Backend on Render

After pushing to GitHub:
1. Render will auto-deploy if connected to GitHub
2. Or manually trigger a deploy from Render dashboard
3. Wait for deployment to complete
4. Check logs for "✅ Server running" message

### Step 4: Test the Connection

1. Open your Vercel frontend: `https://car-damage-detection-and-repair-cos-nine.vercel.app`
2. Open browser DevTools (F12) → Console tab
3. Try to login or signup
4. Check for CORS errors - should be gone!

## Verification Checklist

After deployment, verify:

- [ ] Backend is running on Render (check health endpoint)
- [ ] Frontend loads without errors
- [ ] Login/Signup works without CORS errors
- [ ] API calls succeed (check Network tab)
- [ ] Images load correctly
- [ ] No CORS errors in browser console

## Testing Endpoints

### Test Backend Health
```bash
curl https://car-damage-detection-and-repair-cost.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "...",
  "database": "connected",
  "environment": "production"
}
```

### Test CORS Headers
```bash
curl -H "Origin: https://car-damage-detection-and-repair-cos-nine.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v https://car-damage-detection-and-repair-cost.onrender.com/api/auth/login
```

Should see headers:
```
Access-Control-Allow-Origin: https://car-damage-detection-and-repair-cos-nine.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
```

## Troubleshooting

### Still Getting CORS Errors?

**1. Check Render Logs**
```
Render Dashboard → Your Service → Logs
```
Look for:
- "❌ CORS blocked origin: ..." messages
- Server startup messages
- Any error messages

**2. Verify Frontend URL**
Make sure your Vercel URL is exactly:
```
https://car-damage-detection-and-repair-cos-nine.vercel.app
```
(no trailing slash, correct spelling)

**3. Clear Browser Cache**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache completely
- Try incognito/private mode

**4. Check Network Tab**
- Open DevTools → Network tab
- Try an API call
- Click on the failed request
- Check "Response Headers" for CORS headers
- Check "Request Headers" for Origin

**5. Verify Environment Variables**
In Render dashboard, check:
- All required env variables are set
- No typos in FRONTEND_URL
- Service was restarted after changes

### Common Issues

**Issue:** "Origin null is not allowed"
**Fix:** This happens with file:// protocol. Always use http:// or https://

**Issue:** "Credentials flag is true, but Access-Control-Allow-Credentials is not"
**Fix:** Already handled - credentials: true is set

**Issue:** "Method X is not allowed by Access-Control-Allow-Methods"
**Fix:** Already handled - all methods are allowed

**Issue:** CORS works in Postman but not browser
**Fix:** Postman doesn't enforce CORS. This is normal browser security.

## Additional Security (Optional)

For production, consider:

1. **Rate Limiting**
```bash
npm install express-rate-limit
```

2. **Helmet for Security Headers**
```bash
npm install helmet
```

3. **Environment-Specific Origins**
Only allow production URLs in production:
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://car-damage-detection-and-repair-cos-nine.vercel.app']
  : ['http://localhost:5173', 'http://localhost:3000'];
```

## Summary

✅ CORS is now properly configured
✅ Your Vercel frontend URL is whitelisted
✅ Preflight requests are handled
✅ Credentials are supported
✅ All HTTP methods are allowed
✅ Proper headers are set

The CORS error should be resolved after deploying these changes to Render!
