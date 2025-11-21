# Fix PowerShell Execution Policy Error

## The Problem
PowerShell is blocking npm scripts due to security policies. This is a Windows security feature.

## Quick Fix (Recommended)

### Option 1: Run the Fix Script
1. Right-click `fix-execution-policy.ps1`
2. Select "Run with PowerShell"
3. If it asks for permission, click "Yes"

### Option 2: Manual Fix (PowerShell as Administrator)

1. **Open PowerShell as Administrator**:
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Run this command**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Type `Y` when prompted** to confirm

4. **Close and reopen your terminal**

5. **Test it**:
   ```powershell
   npm --version
   ```

### Option 3: Quick Fix (Current Session Only)

If you just need npm to work right now:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm --version
```

This only works for the current PowerShell session.

## What This Does

- **RemoteSigned**: Allows local scripts to run, and remote scripts only if they're signed
- **CurrentUser**: Only affects your user account (safe)
- This is the recommended setting for developers

## After Fixing

Once the execution policy is set, npm will work normally:
```powershell
npm --version
npm install
npm run dev
```

## Alternative: Use Command Prompt Instead

If you prefer not to change PowerShell settings, you can use Command Prompt (cmd.exe) instead:
- npm works in Command Prompt without execution policy issues
- Just open Command Prompt and use npm commands normally

## Security Note

This change is safe and commonly used by developers. It only affects your user account and allows you to run npm scripts, which is necessary for Node.js development.

