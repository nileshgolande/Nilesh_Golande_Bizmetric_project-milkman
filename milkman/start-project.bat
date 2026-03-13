@echo off
REM Start Milk Project - Django and React (Vite)
REM This script launches both servers in separate windows

cls
echo.
echo ================================
echo   Milk Project Startup
echo ================================
echo.

REM Get the current directory
set PROJECT_DIR=%~dp0

REM Start Django Backend in a new window
echo Starting Django Backend Server...
start cmd /k "cd /d %PROJECT_DIR% && python manage.py runserver"

REM Wait a moment for Django to start
timeout /t 2 /nobreak

REM Start React Frontend (Vite) in a new window
echo Starting React Frontend Server...
start cmd /k "cd /d %PROJECT_DIR%frontend && npm run dev"

REM Wait for servers to fully start
timeout /t 3 /nobreak

cls
echo.
echo ================================
echo   Servers Started Successfully!
echo ================================
echo.
echo 📱 React Frontend:  http://localhost:5173
echo ⚙️  Django Backend:  http://localhost:8000
echo 🔧 Django Admin:    http://localhost:8000/admin
echo.
echo Opening React Frontend in browser...
start http://localhost:5173

echo.
echo Press any key to exit this window...
pause >nul
