# Render Environment Variables Setup

## Required Environment Variables

Set these in your Render dashboard → Your Service → Environment:

### 1. Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```
**Important:** 
- Replace with your actual MongoDB Atlas connection string
- Ensure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas

### 2. Authentication
```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
```
**Important:** Use a strong, random string (at least 32 characters)

### 3. Server Configuration
```
PORT=5000
NODE_ENV=production
```

### 4. Email Service (for password reset)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```
**Important:** 
- Use Gmail App Password, not your regular password
- Generate at: https://myaccount.google.com/apppasswords
- Enable 2FA first

### 5. Frontend URL (Optional but Recommended)
```
FRONTEND_URL=https://car-damage-detection-and-repair-cos-nine.vercel.app
```
**Note:** Already hardcoded in server.js, but this allows easy updates

### 6. ML Service (if using separate ML service)
```
ML_SERVICE_URL=http://localhost:8000
```
**Note:** Update if you deploy ML service separately

## Complete Environment Variables List

Copy and paste these into Render (update values):

```env
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# Authentication
JWT_SECRET=your-secret-key-min-32-characters

# Server
PORT=5000
NODE_ENV=production

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend (Optional)
FRONTEND_URL=https://car-damage-detection-and-repair-cos-nine.vercel.app

# ML Service (Optional)
ML_SERVICE_URL=http://localhost:8000
```

## How to Add Environment Variables in Render

1. Go to https://dashboard.render.com
2. Select your service
3. Click "Environment" in the left sidebar
4. Click "Add Environment Variable"
5. Enter Key and Value
6. Click "Save Changes"
7. Service will automatically redeploy

## Verification

After adding all variables, check Render logs for:

```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: production
```

If you see errors:
- ❌ MONGODB_URI is not defined → Add MONGODB_URI
- ❌ MongoDB Connection Error → Check connection string and IP whitelist
- ❌ CORS blocked origin → Verify FRONTEND_URL or check server.js

## Security Best Practices

1. ✅ Never commit .env files to Git
2. ✅ Use strong JWT_SECRET (32+ characters)
3. ✅ Use Gmail App Password, not regular password
4. ✅ Set NODE_ENV=production in production
5. ✅ Whitelist 0.0.0.0/0 in MongoDB Atlas for Render
6. ✅ Keep environment variables secret

## Quick Test

After setup, test your backend:

```bash
# Health check
curl https://car-damage-detection-and-repair-cost.onrender.com/health

# Should return:
# {"status":"OK","timestamp":"...","database":"connected","environment":"production"}
```

## Troubleshooting

### MongoDB Connection Failed
- Check MONGODB_URI is correct
- Verify IP whitelist in MongoDB Atlas includes 0.0.0.0/0
- Check database user has read/write permissions

### Email Not Sending
- Verify EMAIL_USER is correct Gmail address
- Verify EMAIL_PASSWORD is App Password (16 chars, no spaces)
- Check 2FA is enabled on Gmail account
- Generate new App Password if needed

### CORS Errors
- Verify FRONTEND_URL matches your Vercel URL exactly
- Check server.js has your Vercel URL in allowedOrigins
- Restart service after changing environment variables

### Service Won't Start
- Check Render logs for specific error
- Verify all required variables are set
- Check for typos in variable names
- Ensure MongoDB is accessible

## Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Check MongoDB Atlas: Ensure cluster is running
3. Test endpoints: Use curl or Postman
4. Review CORS_FIX_GUIDE.md for CORS issues
