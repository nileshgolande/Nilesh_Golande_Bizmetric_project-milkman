@echo off
REM Start only the Node frontend server (serves products page). Uses port configured in backend/server.js (3001).
cd /d "%~dp0\backend"
echo Starting Node server in this window...
npm start
