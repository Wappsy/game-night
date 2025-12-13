# Game Night - Deployment Guide

## Overview

- **Frontend**: Deploy to Vercel (Next.js app in `/web`)
- **Backend**: Deploy to Railway or Render (Node.js server in `/server`)
- **Database**: MongoDB Atlas (free tier available)

---

## 1. Database Setup (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user with password
4. Network Access: Add `0.0.0.0/0` (allow from anywhere) for testing
5. Get connection string: Click "Connect" → "Connect your application"
   - Format: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Save this for backend deployment

---

## 2. Backend Deployment

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `Wappsy/game-night`
4. Railway will auto-detect the server:
   - Root directory: `server`
   - Start command: `npm start`
5. Add Environment Variables in Railway dashboard:
   ```
   MONGO_URL=mongodb+srv://...your-connection-string
   MONGO_DB=game-night
   PORT=4000
   ```
6. Deploy and copy the generated URL (e.g., `https://game-night-production.up.railway.app`)
7. **Save this URL** - you'll need it for Vercel

### Option B: Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect `Wappsy/game-night` repository
4. Configure:
   - **Name**: game-night-server
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables (same as Railway)
6. Deploy and copy the Render URL

---

## 3. Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import `Wappsy/game-night` repository
4. Vercel will auto-detect settings from `vercel.json`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_WS_URL=https://your-backend-url.railway.app
   ```
   (Use the URL from step 2)
6. Click "Deploy"
7. Your app will be live at `https://game-night-xxxxx.vercel.app`

---

## 4. Post-Deployment Testing

1. Visit your Vercel URL
2. Click "Host a Game" and create a session
3. Copy the session code
4. Open another browser/incognito window
5. Click "Join a Game" and paste the code
6. Test gameplay, team scoring, and reconnection

---

## 5. Troubleshooting

**CORS errors**:
- Backend logs show CORS error → Check server CORS is set to `*` or includes your Vercel domain

**WebSocket connection fails**:
- Check `NEXT_PUBLIC_WS_URL` in Vercel env vars
- Ensure backend is running and accessible

**MongoDB connection errors**:
- Verify `MONGO_URL` connection string is correct
- Check MongoDB Atlas Network Access whitelist includes `0.0.0.0/0`

**Build fails on Vercel**:
- Check build logs for missing dependencies
- Verify `vercel.json` paths are correct

**Environment variables not working**:
- Redeploy after adding/changing variables in Vercel or Railway dashboard

---

## 6. Optional: Custom Domain

### Vercel (Frontend)
1. In Vercel project settings → Domains
2. Add your custom domain (e.g., `gamenight.yoursite.com`)
3. Follow DNS instructions

### Railway (Backend)
1. In Railway project settings → Domains
2. Generate a Railway subdomain or add custom domain

---

## Repository Structure
```
game-night/
├── web/              # Next.js frontend (deployed to Vercel)
├── server/           # Express backend (deployed to Railway/Render)
├── data/             # Question datasets
├── vercel.json       # Vercel config (auto-detected)
├── render.yaml       # Render config (optional)
└── server/railway.json # Railway config (optional)
```
