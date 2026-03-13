# Start Milk Project With Both Django and Node Servers

Write-Host "================================" -ForegroundColor Green
Write-Host "Milk Project Startup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Start Django Backend
Write-Host "Starting Django Backend..." -ForegroundColor Yellow
$djangoPath = "C:\Users\pradi\Downloads\NILESH\milkproject\day2"
Start-Process powershell -Arguments "-NoExit", "-Command", "cd '$djangoPath\milkman'; python manage.py runserver"
Start-Sleep -Seconds 2

# Start Node Frontend Server  
Write-Host "Starting Node Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -Arguments "-NoExit", "-Command", "cd '$djangoPath\backend'; npm start"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Products Page:   http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Admin Dashboard: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host "⚙️  Django Admin:    http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "The products page should open automatically in your browser." -ForegroundColor Magenta
Write-Host "If it doesn't, manually visit: http://localhost:3000" -ForegroundColor Magenta
Write-Host ""
