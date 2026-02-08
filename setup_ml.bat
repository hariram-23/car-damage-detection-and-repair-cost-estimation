@echo off
echo ========================================
echo AI Damage Detection - ML Setup
echo ========================================
echo.

echo Step 1: Installing Python dependencies...
cd backend\ml_service
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to install dependencies
    echo Please make sure Python is installed and added to PATH
    pause
    exit /b 1
)

echo.
echo Step 2: Testing ML service...
python test_model.py
if %errorlevel% neq 0 (
    echo.
    echo Error: ML service test failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo You can now start the backend server:
echo   cd backend
echo   npm start
echo.
pause
