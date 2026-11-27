@echo off
title UniTrace - Campus Lost & Found System
echo ========================================================
echo   Starting UniTrace - University Lost & Found App
echo ========================================================
echo.

set PATH=C:\Users\HP\AppData\Local\Programs\portable-tools\nodejs;C:\Users\HP\AppData\Local\Programs\portable-tools\git\cmd;%PATH%

cd /d "%~dp0"

echo Opening browser at http://localhost:3000 in 3 seconds...
start "" timeout /t 3 /nobreak >nul & start http://localhost:3000

echo Starting Next.js development server...
echo Press Ctrl+C in this window anytime to stop the server.
echo.
npm.cmd run dev
pause
