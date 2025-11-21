# Quick start script for development server
# This sets PATH and starts the Next.js dev server

# Add Node.js to PATH for this session
$env:Path += ";C:\Program Files\nodejs"

# Verify Node.js is available
Write-Host "Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if ($nodeVersion -and $npmVersion) {
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Cyan
    Write-Host "Open http://localhost:3000 in your browser" -ForegroundColor Yellow
    Write-Host ""
    
    # Start the dev server
    npm run dev
} else {
    Write-Host "Error: Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    pause
}

