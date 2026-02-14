# 🚗 Vehicle Damage Detection System

Web application for vehicle damage detection and cost estimation with cyber-themed UI.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install Node.js dependencies
npm run install-all
```

### 2. Setup ML Service (Required for Damage Detection)

**Windows:**
```bash
setup_ml.bat
```

**Linux/Mac:**
```bash
cd backend/ml_service
pip install -r requirements.txt
python test_repackaged_model.py
```

**Verify Model:**
```bash
cd backend/ml_service
python test_repackaged_model.py
```

Expected output: Model loaded with 6 damage classes (dent, scratch, crack, glass shatter, lamp broken, tire flat)

See [SETUP_ML.md](SETUP_ML.md) for detailed instructions.

### 3. Setup Environment Files

**backend/.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-damage-detection
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access Application
Open browser: **http://localhost:5173**

## 📁 Project Structure

```
ai-damage-detection/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # Node.js + Express + MongoDB
│   └── ml_service/    # Python ML service for YOLOv8
├── Model/             # Trained YOLOv8 model
└── README.md
```

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, Framer Motion, Recharts  
**Backend:** Node.js, Express, MongoDB, JWT, Multer, PDFKit  
**ML Service:** Python, YOLOv8, PyTorch, Ultralytics

## ✨ Features

- User authentication (signup/login)
- Image upload with drag & drop
- **AI-powered damage detection using trained YOLOv8 model**
- **Detects 6 damage types:** dent, scratch, crack, glass shatter, lamp broken, tire flat
- **Real-time damage classification with confidence scores**
- **Automatic severity assessment (Minor/Moderate/Severe)**
- Cost estimation based on damage and vehicle category
- Dashboard with analytics
- PDF report generation with bounding boxes
- Cyber-themed responsive UI

## 🔧 Prerequisites

- Node.js v18+
- Python 3.8+ (for ML service)
- MongoDB (or MongoDB Atlas)

## 📝 Usage

1. Sign up and create account
2. Upload car damage image
3. Select vehicle details (optional)
4. Click "Analyze Damage"
5. View report with cost estimate
6. Download PDF report

## 🐛 Troubleshooting

**ML Service not working?**  
- Ensure Python 3.8+ is installed
- Run: `pip install -r backend/ml_service/requirements.txt`
- Test model: `python backend/ml_service/test_repackaged_model.py`
- Verify `Model/best_model.pt` exists (~50 MB)
- See [SETUP_ML.md](SETUP_ML.md) for details

**No damage detected?**
- Image must contain one of 6 trained damage types
- Ensure good lighting and clear focus
- Damage should be clearly visible

**MongoDB not connecting?**  
Use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas

**Port already in use?**  
Change PORT in backend/.env

## 📄 License

MIT License
