# Meme Generator & Feed - Next.js + InstantDB

A full-stack meme generator and sharing platform built with Next.js and InstantDB.

## Features

- 🎨 **Meme Generator**: Create memes with custom text overlays
- 📤 **Post Memes**: Share your creations with the community
- 👍 **Upvote System**: Vote on your favorite memes
- 🔐 **Authentication**: Sign in required for posting and upvoting
- ⚡ **Real-time Updates**: See new memes and upvotes instantly
- 📱 **Responsive Design**: Works on desktop and mobile

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
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

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with InstantDB provider
│   ├── page.tsx             # Main page with auth and navigation
│   └── globals.css          # Global styles
├── components/
│   ├── Auth.tsx             # Authentication component
│   ├── MemeGenerator.tsx    # Meme creation tool
│   ├── MemeFeed.tsx         # Feed of all memes
│   └── InstantDBProvider.tsx # InstantDB context provider
├── lib/
│   └── db.ts                # InstantDB initialization
├── public/
│   └── Assets/              # Template images
├── instant.schema.ts        # Database schema definition
└── package.json            # Dependencies
```

## Database Schema

### Memes
- `imageUrl`: URL to the meme image (stored in InstantDB)
- `text`: Meme text overlay
- `textConfig`: JSON configuration for text positioning/styling
- `createdAt`: Timestamp
- `userId`: Creator's user ID
- `upvoteCount`: Cached upvote count

### Votes
- `memeId`: Reference to meme
- `userId`: Voter's user ID
- `createdAt`: Timestamp

## Usage

1. **Sign In/Sign Up**: Create an account or sign in
2. **Create Meme**: 
   - Choose a template or upload your own image
   - Add text and customize
   - Click "Post Meme" to share
3. **Browse Feed**: View all posted memes
4. **Upvote**: Click the upvote button on memes you like

## Technologies

- **Next.js 14**: React framework
- **InstantDB**: Real-time database and authentication
- **TypeScript**: Type safety
- **React**: UI library

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel
```

Make sure to set the `NEXT_PUBLIC_INSTANT_APP_ID` environment variable in your deployment platform.

