# How to Push Your Code to GitHub

Follow these steps to push your meme generator project to GitHub.

## Step 1: Create a GitHub Repository

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Sign in (or create an account if you don't have one)

2. **Create a New Repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Repository name: `meme-generator` (or any name you like)
   - Description: "Full-stack Next.js meme generator with InstantDB"
   - Choose **Public** (so you can deploy for free on Vercel)
   - **DO NOT** check "Initialize with README" (you already have files)
   - Click "Create repository"

3. **Copy the Repository URL**
   - GitHub will show you a URL like: `https://github.com/yourusername/meme-generator.git`
   - Copy this URL - you'll need it in Step 4

---

## Step 2: Stage All Your Files

Open PowerShell in your project directory and run:

```powershell
git add .
```

This adds all your files to be committed.

---

## Step 3: Commit Your Changes

```powershell
git commit -m "Initial commit: Next.js meme generator with InstantDB"
```

---

## Step 4: Connect to GitHub and Push

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```powershell
# Add GitHub as remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin master
```

**Note:** If your default branch is `main` instead of `master`, use:
```powershell
git push -u origin main
```

---

## Step 5: Verify

1. Go back to your GitHub repository page
2. Refresh the page
3. You should see all your files!

---

## Troubleshooting

### If you get "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you get authentication errors
GitHub requires authentication. You have two options:

**Option A: Use GitHub Desktop (Easiest)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository"

**Option B: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token
5. When pushing, use the token as your password:
   ```powershell
   git push -u origin master
   # Username: your-github-username
   # Password: paste-your-token-here
   ```

### If your branch is named `main` instead of `master`
Check your branch name:
```powershell
git branch
```

If it shows `main`, use:
```powershell
git push -u origin main
```

---

## What Gets Pushed?

✅ **Will be pushed:**
- All your source code (`app/`, `components/`, `lib/`)
- Configuration files (`package.json`, `tsconfig.json`, `next.config.js`)
- Documentation files (`.md` files)
- Public assets (`public/Assets/`)

❌ **Won't be pushed** (thanks to `.gitignore`):
- `node_modules/` (dependencies - will be installed on deployment)
- `.next/` (build files - generated during deployment)
- `.env.local` (local environment variables)
- `.vercel/` (Vercel config)

---

## After Pushing

Once your code is on GitHub, you can:

1. **Deploy to Vercel** (see `DEPLOYMENT.md`)
   - Vercel can automatically deploy from GitHub
   - Every push will trigger a new deployment

2. **Share your code** with others
3. **Collaborate** with team members
4. **Track changes** with version control

---

## Quick Reference Commands

```powershell
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push -u origin master  # or 'main'

# View remote
git remote -v

# Pull latest changes (if working with others)
git pull
```

