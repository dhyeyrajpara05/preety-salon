# Preety Salon - Unified Startup Script
# This script starts MongoDB, Backend Servers, and Frontend Dev Servers.

Write-Host "🚀 Starting Preety Salon Ecosystem..." -ForegroundColor Cyan

# 1. Start MongoDB in a separate window/process
Write-Host "📦 Initializing Database..." -ForegroundColor Yellow
Start-Process mongod -ArgumentList "--dbpath `"d:\PREETY SALON\db`"" -NoNewWindow

# 2. Wait a moment for DB to initialize
Start-Sleep -Seconds 2

# 3. Start the project services using concurrently
Write-Host "🌐 Launching Services (Client, Admin, Backend)..." -ForegroundColor Green
npm start
