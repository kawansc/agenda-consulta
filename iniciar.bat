@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Instale o Node.js em https://nodejs.org e rode este arquivo de novo. & pause & exit /b)
if not exist node_modules call npm install
call npm run dev -- --open
pause
