@echo off
REM Remark42 Setup Script for Windows
REM This script helps you start the Remark42 comment system

echo 🚀 Starting Remark42 Comment System Setup
echo ========================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if ngrok is installed
where ngrok >nul 2>&1
if errorlevel 1 (
    echo ❌ ngrok is not installed.
    echo 📦 Please install ngrok from: https://ngrok.com/download
    pause
    exit /b 1
)

echo ✅ Docker and ngrok are available

REM Start ngrok in the background
echo 🔗 Starting ngrok tunnel...
start /b ngrok http 8080

REM Wait for ngrok to start
timeout /t 5 /nobreak >nul

REM Get the ngrok URL using PowerShell
for /f "tokens=*" %%i in ('powershell -command "(Invoke-RestMethod -Uri http://localhost:4040/api/tunnels).tunnels | Where-Object {$_.proto -eq 'https'} | Select-Object -First 1 -ExpandProperty public_url"') do set NGROK_URL=%%i

if "%NGROK_URL%"=="" (
    echo ❌ Failed to get ngrok URL
    echo 💡 Make sure ngrok is properly configured with your authtoken
    echo    Visit: https://dashboard.ngrok.com/get-started/your-authtoken
    pause
    exit /b 1
)

echo ✅ ngrok tunnel created: %NGROK_URL%

REM Update configuration
echo ⚙️ Updating configuration files...
if exist "update-ngrok.js" (
    node update-ngrok.js "%NGROK_URL%"
    if errorlevel 1 (
        echo ❌ Failed to update configuration
        pause
        exit /b 1
    )
    echo ✅ Configuration updated successfully
) else (
    echo ❌ update-ngrok.js not found
    pause
    exit /b 1
)

REM Wait for Docker to be ready
echo ⏳ Waiting for Remark42 server to be ready...
timeout /t 10 /nobreak >nul

REM Test if Remark42 is responding using PowerShell
powershell -command "try { Invoke-RestMethod -Uri '%NGROK_URL%/api/v1/ping' -ErrorAction Stop; Write-Host '✅ Remark42 server is ready!' } catch { Write-Host '⚠️ Remark42 server is starting up (this may take a moment)' }" >nul 2>&1

echo.
echo 🎉 Setup Complete!
echo ==================
echo 📝 Remark42 URL: %NGROK_URL%
echo 🌐 Blog URL: http://localhost:3000
echo.
echo Next steps:
echo 1. Start your Docusaurus dev server: npm start
echo 2. Visit http://localhost:3000 and navigate to any blog post
echo 3. You should see the Remark42 comment widget
echo.
echo 💡 Keep this window open - ngrok is running here
echo 🛑 Press Ctrl+C to stop ngrok when you're done
echo.

REM Keep the script running so ngrok stays active
echo ⏸️ Press any key to stop ngrok and exit...
pause >nul

REM Kill ngrok processes
taskkill /f /im ngrok.exe >nul 2>&1
echo 🛑 ngrok stopped.