# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variable**
   
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_INSTANT_APP_ID=fda6ef94-6b35-4f00-aa6b-741cde16c47b
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## What's Been Done

✅ Converted vanilla JS app to Next.js  
✅ Set up InstantDB with your app ID  
✅ Created authentication system (sign in/sign up required)  
✅ Implemented meme posting with InstantDB storage  
✅ Created meme feed with real-time updates  
✅ Added upvote functionality  
✅ Moved assets to public folder for Next.js  

## Project Structure

- `app/` - Next.js app directory
  - `layout.tsx` - Root layout with InstantDB provider
  - `page.tsx` - Main page with navigation
  - `globals.css` - Global styles
- `components/` - React components
  - `Auth.tsx` - Authentication UI
  - `MemeGenerator.tsx` - Meme creation tool
  - `MemeFeed.tsx` - Feed display
  - `InstantDBProvider.tsx` - Database provider
- `lib/db.ts` - InstantDB initialization
- `instant.schema.ts` - Database schema
- `public/Assets/` - Template images

## Features

- **Authentication**: Users must sign in to post/upvote
- **Meme Creation**: Full-featured meme generator
- **Storage**: Images stored in InstantDB
- **Real-time**: Feed updates automatically
- **Upvoting**: One vote per user per meme

## Next Steps

1. Run `npm install` to install dependencies
2. Create `.env.local` with your InstantDB app ID
3. Run `npm run dev` to start development server
4. Test the authentication and meme posting flow

## Notes

- The app uses InstantDB's built-in authentication
- Images are uploaded to InstantDB storage (with base64 fallback)
- Real-time updates work automatically via InstantDB subscriptions
- Upvote counts are cached in the meme entity for performance

