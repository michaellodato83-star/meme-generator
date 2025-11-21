# Fix npm PATH Issue

## The Problem
Node.js is installed but not in your PATH, so `npm` and `node` commands aren't recognized.

## Quick Fix (Temporary - Current Session Only)

**Option 1: Use the batch file**
```powershell
.\install-dependencies.bat
```

**Option 2: Manually set PATH in PowerShell**
```powershell
$env:Path += ";C:\Program Files\nodejs"
npm install
```

## Permanent Fix

### Method 1: Using PowerShell (Recommended)

1. **Open PowerShell as Administrator**:
   - Right-click on PowerShell
   - Select "Run as Administrator"

2. **Run this command**:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Program Files\nodejs", "User")
   ```

3. **Close and reopen your terminal**

4. **Verify it works**:
   ```powershell
   node --version
   npm --version
   ```

### Method 2: Using Windows GUI

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "User variables", select "Path" and click "Edit"
4. Click "New" and add: `C:\Program Files\nodejs`
5. Click OK on all dialogs
6. **Close and reopen your terminal**

### Method 3: Run the PowerShell Script

1. Right-click `fix-path.ps1`
2. Select "Run with PowerShell"
3. If you get an execution policy error, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Then run the script again

## After Fixing PATH

Once PATH is fixed, you can use:
```powershell
npm install
npm run dev
```

## Verify Installation

After fixing PATH and restarting terminal:
```powershell
node --version  # Should show: v24.11.1
npm --version   # Should show: 11.6.2
```

