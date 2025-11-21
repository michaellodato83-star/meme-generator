# Installing Node.js for Windows

Node.js is required to run the Next.js application. Follow these steps:

## Option 1: Download from Official Website (Recommended)

1. **Visit the Node.js website**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support) - this is the most stable version

2. **Install Node.js**
   - Run the downloaded installer (`.msi` file)
   - Follow the installation wizard
   - **Important**: Make sure to check "Add to PATH" during installation (it's usually checked by default)
   - Complete the installation

3. **Verify Installation**
   - Close and reopen your terminal/PowerShell
   - Run these commands to verify:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., `v20.10.0` and `10.2.3`)

## Option 2: Using Chocolatey (If you have it installed)

If you have Chocolatey package manager installed:
```powershell
choco install nodejs-lts
```

## Option 3: Using Winget (Windows Package Manager)

If you have Windows Package Manager (Windows 11 or Windows 10 with winget):
```powershell
winget install OpenJS.NodeJS.LTS
```

## After Installation

1. **Restart your terminal/PowerShell** - This is important so it picks up the new PATH
2. **Navigate to your project directory**:
   ```powershell
   cd "C:\Users\lodat\OneDrive\Documents\001_Cursor_Video_V.01\Cursor_Project_2"
   ```
3. **Install dependencies**:
   ```powershell
   npm install
   ```
4. **Start the development server**:
   ```powershell
   npm run dev
   ```

## Troubleshooting

If `npm` is still not recognized after installation:
1. Make sure you **closed and reopened** your terminal/PowerShell
2. Check if Node.js is in your PATH:
   ```powershell
   $env:PATH -split ';' | Select-String node
   ```
3. If Node.js is not in PATH, you may need to add it manually or reinstall Node.js

## What Version to Install?

- **Recommended**: Node.js LTS (v20.x or v18.x)
- The project will work with Node.js 18+ or 20+

