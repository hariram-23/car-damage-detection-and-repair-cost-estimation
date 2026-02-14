# API URL Update Summary

## Changes Made

All frontend API calls have been updated to use your Render backend URL instead of localhost.

### 1. Environment Variables Updated

**Frontend `.env`:**
```
VITE_API_URL=https://car-damage-detection-and-repair-cost.onrender.com
```

**Frontend `.env.example`:**
```
VITE_API_URL=https://car-damage-detection-and-repair-cost.onrender.com
```

### 2. Axios Base URL Configuration

**File:** `frontend/src/context/AuthContext.jsx`

Added global axios configuration:
```javascript
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

This ensures all axios requests use the environment variable URL with localhost as fallback.

### 3. Image URL Updates

Updated hardcoded localhost image URLs in the following files:

- **Report.jsx** - Vehicle damage image display
- **History.jsx** - Analysis history thumbnails  
- **Dashboard.jsx** - Recent analysis images
- **BatchAnalyze.jsx** - Batch analysis result images

All now use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

### 4. Files Modified

1. `frontend/.env`
2. `frontend/.env.example`
3. `frontend/src/context/AuthContext.jsx`
4. `frontend/src/pages/Report.jsx`
5. `frontend/src/pages/History.jsx`
6. `frontend/src/pages/Dashboard.jsx`
7. `frontend/src/pages/BatchAnalyze.jsx`

## How It Works

1. **API Calls:** All axios requests automatically use the base URL from `VITE_API_URL`
2. **Image URLs:** Image paths are constructed using the same environment variable
3. **Fallback:** If environment variable is not set, falls back to `http://localhost:5000` for local development

## Next Steps for Deployment

### On Vercel (Frontend):

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `VITE_API_URL` = `https://car-damage-detection-and-repair-cost.onrender.com`
4. Redeploy your frontend

### On Render (Backend):

1. Go to your Render dashboard
2. Navigate to Environment Variables
3. Add: `FRONTEND_URL` = `https://your-vercel-app.vercel.app` (your actual Vercel URL)
4. This enables CORS for your frontend

## Testing

After deployment:

1. ✅ Login/Signup should work
2. ✅ Image upload and analysis should work
3. ✅ Dashboard should load statistics
4. ✅ History should display past analyses
5. ✅ Images should load correctly
6. ✅ PDF download should work
7. ✅ Password reset emails should send

## Troubleshooting

If you encounter issues:

1. **CORS errors:** Verify `FRONTEND_URL` is set on Render with your exact Vercel URL
2. **API not connecting:** Check `VITE_API_URL` is set in Vercel environment variables
3. **Images not loading:** Ensure backend `/uploads` endpoint is accessible
4. **After env changes:** Redeploy both frontend and backend

## Local Development

To switch back to local backend for development:

```bash
# In frontend/.env
VITE_API_URL=http://localhost:5000
```

Then restart your dev server.
