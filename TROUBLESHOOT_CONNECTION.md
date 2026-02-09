# 🔍 Troubleshoot Connection Issues

## Your Error: "Signup failed"

This means frontend can't connect to backend. Let's diagnose:

---

## Step 1: Check Backend is Running

### Test Backend Health:
Open this URL in your browser:
```
https://ai-damage-system-of-cars.onrender.com/health
```

**Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-02-09T...",
  "database": "connected",
  "environment": "production"
}
```

### If Backend Returns 404 or Error:
- ⚠️ Backend is sleeping (Render free tier)
- Wait 30-60 seconds and try again
- Render free tier sleeps after 15 min inactivity

### If Backend Shows "database": "disconnected":
- MongoDB connection issue
- Check Render environment variables
- Verify MONGODB_URI is set correctly

---

## Step 2: Check CORS Configuration

### Verify Backend FRONTEND_URL:

1. Go to: https://dashboard.render.com/
2. Click service: `ai-damage-system-of-cars`
3. Click "Environment" tab
4. Check `FRONTEND_URL` is set to:
   ```
   https://car-damage-detection-and-repair-cost-estimation-nk11i2ot4.vercel.app
   ```

### If FRONTEND_URL is Wrong or Missing:
1. Add/Update the variable
2. Click "Save Changes"
3. Wait 2-3 minutes for redeploy
4. Try signup again

---

## Step 3: Check Frontend Environment Variable

### Verify Vercel Environment Variable:

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click "Settings" → "Environment Variables"
4. Check `VITE_API_URL` is set to:
   ```
   https://ai-damage-system-of-cars.onrender.com/api
   ```

### If Variable is Wrong or Missing:
1. Add/Update the variable
2. Go to "Deployments" tab
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Wait 2-3 minutes

---

## Step 4: Test Backend API Directly

### Test Signup Endpoint:

Open browser console (F12) and run:

```javascript
fetch('https://ai-damage-system-of-cars.onrender.com/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Expected Response:
```json
{
  "message": "User registered successfully",
  "token": "...",
  "user": {...}
}
```

### If You Get CORS Error:
- FRONTEND_URL not set correctly in Render
- Update it and redeploy backend

### If You Get Network Error:
- Backend is sleeping or down
- Wait 30-60 seconds for backend to wake up
- Try again

---

## Step 5: Check Browser Console

1. Open your frontend: https://car-damage-detection-and-repair-cost-estimation-nk11i2ot4.vercel.app
2. Press F12 to open Developer Tools
3. Click "Console" tab
4. Try to sign up
5. Look for error messages

### Common Errors:

**"Failed to fetch"**
- Backend is sleeping (wait 30-60 seconds)
- Backend is down (check Render logs)

**"CORS policy blocked"**
- FRONTEND_URL not set in Render
- Update and redeploy backend

**"Network request failed"**
- Backend URL is wrong
- Check VITE_API_URL in Vercel

**"500 Internal Server Error"**
- Backend code error
- Check Render logs for details

---

## Step 6: Check Render Logs

1. Go to: https://dashboard.render.com/
2. Click service: `ai-damage-system-of-cars`
3. Click "Logs" tab
4. Look for errors when you try to sign up

### Common Log Errors:

**"MongoDB Connection Error"**
- MONGODB_URI not set or wrong
- Check environment variables

**"ECONNREFUSED"**
- MongoDB not accessible
- Check MongoDB Atlas IP whitelist

**"Authentication failed"**
- Wrong MongoDB password
- Update MONGODB_URI with correct password

---

## Quick Fix Checklist

Try these in order:

1. **Wake up backend**:
   - Open: https://ai-damage-system-of-cars.onrender.com/health
   - Wait 30-60 seconds if it's waking up
   - Refresh until you see "status": "OK"

2. **Verify environment variables**:
   - Render: Check all 7 variables are set
   - Vercel: Check VITE_API_URL is set

3. **Check CORS**:
   - Render → Environment → FRONTEND_URL
   - Must match your Vercel URL exactly

4. **Redeploy if needed**:
   - Render: Click "Manual Deploy" → "Deploy latest commit"
   - Vercel: Deployments → "Redeploy"

5. **Clear browser cache**:
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Try again

---

## Test Commands

### Test Backend Health:
```bash
curl https://ai-damage-system-of-cars.onrender.com/health
```

### Test Signup API:
```bash
curl -X POST https://ai-damage-system-of-cars.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Expected Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test",
    "email": "test@test.com"
  }
}
```

---

## Most Common Issue: Backend Sleeping

**Render free tier sleeps after 15 minutes of inactivity.**

### Solution:
1. Open backend health check: https://ai-damage-system-of-cars.onrender.com/health
2. Wait 30-60 seconds for it to wake up
3. You'll see "status": "OK" when ready
4. Now try signup on frontend

### To Avoid This:
- Upgrade to Render paid tier ($7/month) for always-on
- Or accept 30-60 second delay on first request

---

## Still Not Working?

### Share These Details:

1. **Backend health response**:
   - What do you see at: https://ai-damage-system-of-cars.onrender.com/health

2. **Browser console errors**:
   - Press F12 → Console tab
   - Copy any red error messages

3. **Render logs**:
   - Dashboard → Logs
   - Copy recent error messages

4. **Environment variables**:
   - Screenshot of Render environment variables (hide passwords!)
   - Screenshot of Vercel environment variables

---

## Expected Behavior

### First Request (Backend Sleeping):
1. Click "Sign Up"
2. Wait 30-60 seconds (backend waking up)
3. Signup succeeds
4. Redirected to dashboard

### Subsequent Requests (Backend Awake):
1. Click "Sign Up"
2. Instant response (< 2 seconds)
3. Signup succeeds
4. Redirected to dashboard

---

## Quick Test

Try this right now:

1. Open: https://ai-damage-system-of-cars.onrender.com/health
2. Wait until you see: `{"status":"OK",...}`
3. Immediately go to frontend and try signup
4. Should work instantly

If it still fails, check browser console (F12) for specific error message.

---

Good luck! 🚀
