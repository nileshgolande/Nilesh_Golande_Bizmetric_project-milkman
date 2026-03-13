# Start Milk Project With Django and React (Vite)

Write-Host "================================" -ForegroundColor Green
Write-Host "Milk Project Startup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Get the script directory
$projectDir = $PSScriptRoot

# Start Django Backend
Write-Host "Starting Django Backend..." -ForegroundColor Yellow
Start-Process powershell -Arguments "-NoExit", "-Command", "cd '$projectDir'; python manage.py runserver"
Start-Sleep -Seconds 2

# Start React Frontend (Vite)
Write-Host "Starting React Frontend..." -ForegroundColor Yellow
Start-Process powershell -Arguments "-NoExit", "-Command", "cd '$projectDir\frontend'; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 React Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "⚙️  Django Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "🔧 Django Admin:    http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "The React frontend should open automatically in your browser." -ForegroundColor Magenta
Write-Host "If it doesn't, manually visit: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
