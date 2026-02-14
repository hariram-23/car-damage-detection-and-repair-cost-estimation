# ML Service Deployment Guide for Render

## Current Setup

Your ML service is **already integrated** with the backend! It runs as a Python script called directly by Node.js, not as a separate service. This is perfect for Render deployment.

## How It Works

```
Backend (Node.js) → Spawns Python Process → predict.py → Returns Results
```

The backend calls `ml_service/predict.py` directly using Node.js `spawn()` function.

## Deployment Steps on Render

### 1. Update Render Build Configuration

You need to install both Node.js AND Python dependencies on Render.

#### Option A: Using Render Build Command (Recommended)

In your Render dashboard, set the **Build Command** to:

```bash
npm install && pip install -r ml_service/requirements.txt
```

#### Option B: Using render.yaml (Better for automation)

Update your `backend/render.yaml`:

```yaml
services:
  - type: web
    name: car-damage-backend
    env: node
    buildCommand: npm install && pip install -r ml_service/requirements.txt
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: EMAIL_USER
        sync: false
      - key: EMAIL_PASSWORD
        sync: false
      - key: FRONTEND_URL
        sync: false
```

### 2. Ensure Python is Available

Render's Node.js environment includes Python by default, so you don't need to do anything special.

### 3. Include Model File

Make sure your trained model file is in the repository:

```
backend/
├── ml_service/
│   ├── predict.py
│   └── requirements.txt
└── Model/
    └── best_model.pt  ← This must be in your repo!
```

**Important:** Check if `Model/best_model.pt` exists and is tracked by git:

```bash
cd ai-damage-detection
git add Model/best_model.pt
git commit -m "Add trained ML model"
git push
```

### 4. Update .gitignore (if needed)

Make sure your `.gitignore` doesn't exclude the model file:

```gitignore
# Don't ignore the trained model
!Model/best_model.pt
```

### 5. Environment Variables on Render

You **don't need** `ML_SERVICE_URL` because the ML service runs locally within the same container.

Required environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `FRONTEND_URL`
- `NODE_ENV=production`

### 6. Python Dependencies

Your `ml_service/requirements.txt` includes:
```
ultralytics>=8.0.0
torch>=2.0.0
torchvision>=0.15.0
pillow>=9.0.0
opencv-python>=4.7.0
numpy>=1.24.0
```

**Note:** These are large packages (~2GB). Render's build might take 5-10 minutes.

## Alternative: Optimize for Faster Builds

If builds are too slow, you can use CPU-only PyTorch:

Update `ml_service/requirements.txt`:
```
ultralytics>=8.0.0
torch>=2.0.0
torchvision>=0.15.0
pillow>=9.0.0
opencv-python-headless>=4.7.0
numpy>=1.24.0
--extra-index-url https://download.pytorch.org/whl/cpu
```

## Deployment Checklist

- [ ] Model file (`Model/best_model.pt`) is in repository
- [ ] Model file is not in `.gitignore`
- [ ] `ml_service/requirements.txt` exists
- [ ] Build command includes Python dependencies: `npm install && pip install -r ml_service/requirements.txt`
- [ ] All environment variables are set on Render
- [ ] Push changes to GitHub
- [ ] Trigger Render deployment

## Testing After Deployment

1. Check Render logs for Python installation:
   ```
   Installing collected packages: torch, ultralytics...
   ```

2. Test the analyze endpoint:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/analysis/analyze \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "image=@test-image.jpg" \
     -F "carCategory=sedan"
   ```

3. Check for Python errors in Render logs

## Common Issues & Solutions

### Issue 1: "python: command not found"

**Solution:** Render's Node environment includes Python. If this error occurs, add to render.yaml:
```yaml
buildCommand: apt-get update && apt-get install -y python3 python3-pip && npm install && pip3 install -r ml_service/requirements.txt
```

### Issue 2: "Model file not found"

**Solution:** 
1. Verify model path in `predict.py`:
   ```python
   MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'Model', 'best_model.pt')
   ```
2. Ensure model is committed to git
3. Check Render logs for file structure

### Issue 3: "Out of memory during build"

**Solution:** 
1. Upgrade Render plan (free tier has limited memory)
2. Use CPU-only PyTorch (see optimization section above)

### Issue 4: Build takes too long (>15 minutes)

**Solution:**
1. Use `opencv-python-headless` instead of `opencv-python`
2. Consider using a Docker deployment with pre-built image
3. Upgrade to paid Render plan for faster builds

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         Render Container                │
│                                         │
│  ┌──────────────┐                      │
│  │   Node.js    │                      │
│  │   Backend    │                      │
│  │  (Port 5000) │                      │
│  └──────┬───────┘                      │
│         │                               │
│         │ spawn()                       │
│         ▼                               │
│  ┌──────────────┐                      │
│  │   Python     │                      │
│  │  predict.py  │                      │
│  │   + YOLO     │                      │
│  └──────────────┘                      │
│                                         │
└─────────────────────────────────────────┘
```

## Performance Considerations

- **First request:** May be slow (~5-10 seconds) as model loads
- **Subsequent requests:** Faster (~2-3 seconds)
- **Cold starts:** Render free tier sleeps after inactivity, first request after sleep will be slow
- **Memory:** ML model requires ~1-2GB RAM, ensure Render plan supports this

## Monitoring

Check Render logs for:
```
✅ MongoDB Connected Successfully
🔍 STARTING DAMAGE ANALYSIS
📁 Image Path: /uploads/...
🤖 Model: .../Model/best_model.pt
✅ ANALYSIS COMPLETED SUCCESSFULLY
```

## Summary

**You don't need a separate ML service deployment!** Your ML service is already integrated into the backend and will deploy automatically with it. Just ensure:

1. Python dependencies are installed during build
2. Model file is in the repository
3. Build command: `npm install && pip install -r ml_service/requirements.txt`

That's it! Your ML service will run alongside your Node.js backend on Render.
