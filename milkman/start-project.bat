@echo off
REM Start Milk Project - Both Django and Node Servers
REM This script launches both servers in separate windows

cls
echo.
echo ================================
echo   Milk Project Startup
echo ================================
echo.

REM Get the project directory
cd /d "C:\Users\pradi\Downloads\NILESH\milkproject\day2"

REM Start Django Backend in a new window
echo Starting Django Backend Server...
start cmd /k "cd milkman && python manage.py runserver"

REM Wait a moment for Django to start
timeout /t 2 /nobreak

REM Start Node Frontend Server in a new window
echo Starting Node Frontend Server...
start cmd /k "cd backend && npm start"

REM Wait for servers to fully start
timeout /t 3 /nobreak

cls
echo.
echo ================================
echo   Servers Started Successfully!
echo ================================
echo.
echo 📱 Products Page:   http://localhost:3000
echo 🔧 Admin Dashboard: http://localhost:3000/admin
echo ⚙️  Django Admin:    http://localhost:8000/admin
echo.
echo Opening products page in browser...
start http://localhost:3000

echo.
echo Press any key to exit this window...
pause >nul
