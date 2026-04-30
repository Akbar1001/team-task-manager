@echo off
REM Team Task Manager - Quick Start Script for Windows
REM This script starts both backend and frontend servers

cls
echo.
echo ========================================
echo   Team Task Manager - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it first.
    echo    Download from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected:
node --version
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found
    echo    Creating default .env file...
    echo.
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true^&w=majority
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
        echo JWT_EXPIRE=7d
        echo NODE_ENV=development
    ) > backend\.env
    echo ⚠️  Please update backend\.env with your MongoDB credentials
    echo.
)

REM Start backend
echo.
echo Starting Backend Server...
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

cd backend
start "Backend Server" cmd /k npm run dev
cd ..
echo ✅ Backend started
echo    Running on: http://localhost:5000
echo.

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting Frontend Server...
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

cd frontend
start "Frontend Server" cmd /k npm run dev
cd ..
echo ✅ Frontend started
echo    Running on: http://localhost:5173
echo.

REM Display information
echo.
echo ========================================
echo   🎉 Both servers started!
echo ========================================
echo.
echo 📌 URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo    API:      http://localhost:5000/api
echo.
echo 📝 Available commands:
echo    - Check backend logs: See "Backend Server" window
echo    - Check frontend logs: See "Frontend Server" window
echo    - Open in browser: http://localhost:5173
echo.
echo 💡 Tips:
echo    - Default test email: testuser@example.com
echo    - Password: TestPassword123
echo    - Or sign up with a new email
echo.
echo ⚠️  Keep this window open to maintain servers
echo.
pause
