# Quick Start Guide

## Starting the Development Server

Since `npm` isn't in your PATH permanently yet, use one of these methods:

### Method 1: Use the Startup Script (Easiest)

Just double-click `start-dev.ps1` or run:
```powershell
.\start-dev.ps1
```

### Method 2: Set PATH Manually Each Time

Before running `npm run dev`, run this command first:
```powershell
$env:Path += ";C:\Program Files\nodejs"
npm run dev
```

### Method 3: Make PATH Permanent (One-Time Setup)

**Option A: Using PowerShell (Recommended)**
1. Open PowerShell as Administrator
2. Run:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Program Files\nodejs", "User")
   ```
3. Close and reopen your terminal
4. Now `npm` and `node` will work automatically!

**Option B: Using Windows GUI**
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "User variables", select "Path" and click "Edit"
4. Click "New" and add: `C:\Program Files\nodejs`
5. Click OK on all dialogs
6. Close and reopen your terminal

## After Server Starts

Once the server is running, open your browser to:
**http://localhost:3000**

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

## Troubleshooting

If you still get "npm is not recognized":
1. Make sure you've set PATH in the current session: `$env:Path += ";C:\Program Files\nodejs"`
2. Verify Node.js is installed: `& "C:\Program Files\nodejs\node.exe" --version`
3. Try using the full path: `& "C:\Program Files\nodejs\npm.cmd" run dev`

