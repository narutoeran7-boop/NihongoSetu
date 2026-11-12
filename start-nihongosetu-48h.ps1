# Nihongo Setu - 48-Hour Continuous Public Host Watchdog
$Host.UI.RawUI.WindowTitle = "Nihongo Setu - 48-Hour Continuous Public Host"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   NIHONGO SETU: 48-HOUR CONTINUOUS HOST RUNNER" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

Set-Location $PSScriptRoot

Write-Host "[1/3] Verifying Next.js Production Server on port 3000..." -ForegroundColor Yellow
$serverRunning = $false
try {
    $res = Invoke-WebRequest -Uri "http://localhost:3000/login" -Method Head -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($res.StatusCode -eq 200) { $serverRunning = $true }
} catch {}

if (-not $serverRunning) {
    Write-Host "      Starting Next.js production server in background..." -ForegroundColor Gray
    Start-Process -FilePath "npm.cmd" -ArgumentList "run start" -WindowStyle Minimized
    Start-Sleep -Seconds 3
} else {
    Write-Host "      Next.js server is already running on http://localhost:3000" -ForegroundColor Green
}

Write-Host "[2/3] Cloudflare Tunnel Host Loop Initiated..." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host " IMPORTANT FOR 48-HOUR CONTINUOUS AVAILABILITY:" -ForegroundColor Magenta
Write-Host " 1. Keep this PowerShell window open." -ForegroundColor Magenta
Write-Host " 2. Set Windows Sleep to 'Never' (plug in laptop charger)." -ForegroundColor Magenta
Write-Host " 3. Keep your Wi-Fi / Internet connection active." -ForegroundColor Magenta
Write-Host "========================================================`n" -ForegroundColor Magenta

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Connecting Cloudflare Tunnel to http://localhost:3000..." -ForegroundColor Cyan
    & ".\cloudflared.exe" tunnel --url http://localhost:3000 --ha-connections 2 --protocol quic
    Write-Host "Tunnel connection closed. Reconnecting in 5 seconds..." -ForegroundColor Red
    Start-Sleep -Seconds 5
}

