@echo off
title Nihongo Setu - 48-Hour Continuous Public Host
echo ========================================================
echo   NIHONGO SETU: 48-HOUR CONTINUOUS HOST RUNNER
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js environment...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not found in your PATH. Please install Node.js.
    pause
    exit /b 1
)

echo [2/3] Starting Next.js Production Server on port 3000...
start "Nihongo Setu Next.js Server" /min cmd /c "npm run start"

echo Waiting 3 seconds for Next.js to initialize...
timeout /t 3 /nobreak >nul

echo [3/3] Starting Cloudflare Tunnel with Auto-Reconnect Watchdog...
echo.
echo ========================================================
echo IMPORTANT FOR 48-HOUR CONTINUOUS AVAILABILITY:
echo 1. Keep this command window open.
echo 2. Keep your computer awake (Set Windows Sleep to 'Never').
echo 3. Keep your Wi-Fi / Internet connection active.
echo ========================================================
echo.

:TUNNEL_LOOP
echo [%date% %time%] Connecting Cloudflare Tunnel to http://localhost:3000...
.\cloudflared.exe tunnel --url http://localhost:3000 --ha-connections 2 --protocol quic
echo.
echo WARNING: Tunnel disconnected! Automatically reconnecting in 5 seconds...
timeout /t 5 /nobreak >nul
goto TUNNEL_LOOP

