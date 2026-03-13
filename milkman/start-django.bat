@echo off
REM Start only the Django backend (runs on port 8000)
cd /d "%~dp0\milkman"
echo Starting Django server in this window...
python manage.py runserver 8000
