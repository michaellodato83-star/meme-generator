# Quick server startup script
# This sets PATH and starts the Next.js dev server

# Add Node.js to PATH
$env:Path += ";C:\Program Files\nodejs"

Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the dev server
npm run dev

