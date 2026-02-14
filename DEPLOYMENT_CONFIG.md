# Deployment Configuration Guide

## Backend (Render)

Your backend is deployed at: `https://car-damage-detection-and-repair-cost.onrender.com`

### Required Environment Variables on Render:

1. `MONGODB_URI` - Your MongoDB connection string
2. `JWT_SECRET` - Secret key for JWT tokens
3. `ML_SERVICE_URL` - URL for ML service (if separate)
4. `NODE_ENV` - Set to `production`
5. `EMAIL_USER` - Gmail address for sending emails
6. `EMAIL_PASSWORD` - Gmail app password
7. `FRONTEND_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

**Important:** Set `FRONTEND_URL` to your Vercel deployment URL to enable CORS.

## Frontend (Vercel)

### Environment Variables on Vercel:

1. `VITE_API_URL` - Set to `https://car-damage-detection-and-repair-cost.onrender.com`

This is already configured in your `.env` file for local development.

## Local Development

### Frontend (.env):
```
VITE_API_URL=https://car-damage-detection-and-repair-cost.onrender.com
```

Or for local backend testing:
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- `http://localhost:3000` (alternative local port)
- The URL specified in `FRONTEND_URL` environment variable

Make sure to set `FRONTEND_URL` on Render to your Vercel deployment URL.

## Testing the Deployment

1. Ensure backend is running on Render
2. Set `VITE_API_URL` in Vercel environment variables
3. Deploy frontend to Vercel
4. Test authentication, image upload, and analysis features
5. Check browser console for any CORS errors

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` is set correctly on Render
- Check that the Vercel URL matches exactly (including https://)
- Restart the Render service after changing environment variables

### API Connection Issues
- Verify `VITE_API_URL` is set in Vercel
- Check that the backend URL is accessible
- Ensure MongoDB connection is working on Render

### Image Loading Issues
- Images are served from the backend at `/uploads` endpoint
- Verify the backend URL is correct in environment variables
- Check that uploaded images are being stored correctly
