@echo off
set PATH=%PATH%;C:\Program Files\nodejs
echo Installing dependencies...
call npm install
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Success! Dependencies installed.
    echo.
    echo IMPORTANT: To use 'npm' and 'node' commands in the future, you need to:
    echo 1. Close and reopen your terminal/PowerShell, OR
    echo 2. Run: set PATH=%%PATH%%;C:\Program Files\nodejs
    echo.
) else (
    echo.
    echo Installation had some issues. Please check the errors above.
)
pause

