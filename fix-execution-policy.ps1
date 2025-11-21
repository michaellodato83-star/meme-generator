# Fix PowerShell Execution Policy for npm
# This allows npm to run in PowerShell

Write-Host "Fixing PowerShell Execution Policy..." -ForegroundColor Cyan
Write-Host ""

# Set execution policy for current user (recommended)
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✓ Execution policy set successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now use npm commands." -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing npm..." -ForegroundColor Cyan
    npm --version
} catch {
    Write-Host "Error: Could not set execution policy." -ForegroundColor Red
    Write-Host "You may need to run PowerShell as Administrator." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix manually:" -ForegroundColor Yellow
    Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host "2. Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
}

