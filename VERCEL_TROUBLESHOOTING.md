# Vercel 404 Error Troubleshooting

If you're getting a 404 error on Vercel, follow these steps:

## Step 1: Check Build Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Go to the "Deployments" tab
4. Click on the failed deployment
5. Check the "Build Logs" section

**Look for:**
- Build errors (red text)
- Missing dependencies
- TypeScript errors
- Environment variable warnings

## Step 2: Verify Environment Variables

1. In Vercel dashboard → Your Project → Settings → Environment Variables
2. Make sure you have:
   - **Name:** `NEXT_PUBLIC_INSTANT_APP_ID`
   - **Value:** `fda6ef94-6b35-4f00-aa6b-741cde16c47b`
   - **Environment:** Production, Preview, Development (check all)

3. After adding/updating, **redeploy** your project

## Step 3: Check Vercel Project Settings

1. Go to Settings → General
2. Verify:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (or leave empty for auto-detect)
   - **Output Directory:** (leave empty for Next.js)
   - **Install Command:** `npm install` (or leave empty)

## Step 4: Common Issues & Fixes

### Issue: Build Fails
**Solution:** Check build logs for specific errors. Common fixes:
- Update dependencies: `npm update`
- Clear `.next` folder: Delete `.next` directory
- Check Node.js version in Vercel (should be 18.x or 20.x)

### Issue: Environment Variable Not Found
**Solution:** 
- Add `NEXT_PUBLIC_INSTANT_APP_ID` in Vercel dashboard
- Make sure it's set for all environments
- Redeploy after adding

### Issue: Next.js Canary Version Issues
**Solution:** The canary version might have issues. Consider:
- Updating to stable Next.js version (see below)

### Issue: Routing Not Working
**Solution:**
- Make sure `app/page.tsx` exists (it does)
- Check that `app/layout.tsx` exists (it does)
- Verify no conflicting routes

## Step 5: Update Next.js Version (If Needed)

If the canary version is causing issues, update to stable:

```json
// In package.json, change:
"next": "^16.0.2-canary.27"
// To:
"next": "^14.2.0"
```

Then:
```powershell
npm install
npm run build  # Test locally
git add .
git commit -m "Update Next.js to stable version"
git push
```

## Step 6: Force Redeploy

1. In Vercel dashboard → Deployments
2. Click the "..." menu on latest deployment
3. Click "Redeploy"
4. Or push a new commit to trigger redeploy

## Step 7: Check Deployment URL

Make sure you're visiting the correct URL:
- Production: `your-project.vercel.app`
- Preview: `your-project-git-branch.vercel.app`

The 404 might be on a preview deployment, not production.

## Still Not Working?

1. **Check Vercel Status:** [status.vercel.com](https://status.vercel.com)
2. **Check Build Output:** Look for any warnings or errors
3. **Try a Fresh Deployment:**
   - Delete the project in Vercel
   - Re-import from GitHub
   - Set environment variables again
   - Deploy

## Quick Fix Checklist

- [ ] Environment variable `NEXT_PUBLIC_INSTANT_APP_ID` is set in Vercel
- [ ] Environment variable is set for all environments (Production, Preview, Development)
- [ ] Build completes successfully (check logs)
- [ ] No TypeScript errors in build logs
- [ ] Visiting the correct deployment URL
- [ ] Tried redeploying after fixing issues

