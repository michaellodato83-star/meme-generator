# Script to add Node.js to PATH permanently
# Run this script as Administrator

$nodePath = "C:\Program Files\nodejs"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$nodePath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$nodePath", "User")
    Write-Host "Node.js has been added to your PATH!" -ForegroundColor Green
    Write-Host "Please restart your terminal for changes to take effect." -ForegroundColor Yellow
} else {
    Write-Host "Node.js is already in your PATH." -ForegroundColor Green
}

# Also update current session
$env:Path += ";$nodePath"
Write-Host "`nCurrent session updated. You can now use 'node' and 'npm' commands." -ForegroundColor Green

