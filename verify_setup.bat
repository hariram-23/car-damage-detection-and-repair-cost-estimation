@echo off
echo ========================================
echo AI Damage Detection - Setup Verification
echo ========================================
echo.

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found. Please install Node.js from https://nodejs.org/
    goto :error
) else (
    node --version
    echo [OK] Node.js installed
)
echo.

echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Python not found. Please install Python from https://python.org/
    goto :error
) else (
    python --version
    echo [OK] Python installed
)
echo.

echo Checking backend dependencies...
if not exist "backend\node_modules" (
    echo [!] Backend dependencies not installed
    echo     Run: npm run install-all
    goto :error
) else (
    echo [OK] Backend dependencies installed
)
echo.

echo Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo [!] Frontend dependencies not installed
    echo     Run: npm run install-all
    goto :error
) else (
    echo [OK] Frontend dependencies installed
)
echo.

echo Checking ML model...
if not exist "Model\best_damage_yolov8.pt" (
    echo [X] Model file not found at: Model\best_damage_yolov8.pt
    goto :error
) else (
    echo [OK] Model file found
)
echo.

echo Checking Python ML dependencies...
cd backend\ml_service
python -c "import torch; import ultralytics; import PIL" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python ML dependencies not installed
    echo     Run: setup_ml.bat
    cd ..\..
    goto :error
) else (
    echo [OK] Python ML dependencies installed
)
cd ..\..
echo.

echo Checking environment files...
if not exist "backend\.env" (
    echo [!] backend\.env not found
    echo     Copy backend\.env.example to backend\.env and configure
) else (
    echo [OK] backend\.env exists
)

if not exist "frontend\.env" (
    echo [!] frontend\.env not found
    echo     Copy frontend\.env.example to frontend\.env and configure
) else (
    echo [OK] frontend\.env exists
)
echo.

echo ========================================
echo [SUCCESS] Setup verification complete!
echo ========================================
echo.
echo You can now start the application:
echo   Terminal 1: cd backend ^&^& npm run dev
echo   Terminal 2: cd frontend ^&^& npm run dev
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo [ERROR] Setup incomplete
echo ========================================
echo.
echo Please follow the installation guide:
echo   See INSTALLATION.md for detailed steps
echo.
pause
exit /b 1
