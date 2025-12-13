# Game Night - Vercel Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub
```bash
# Create a new GitHub repository at github.com/new
# Then push your local repo:
git remote add origin https://github.com/YOUR_USERNAME/game-night.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `game-night` repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave default)
   
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL (see Backend Deployment below)
   - `NEXT_PUBLIC_WS_URL` = Same as API URL
   
6. Click "Deploy"

## Backend Deployment

### Option A: Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `game-night` repository
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
   
5. Add Environment Variables:
   - `MONGO_URL` = Your MongoDB Atlas connection string
   - `MONGO_DB` = `game-night`
   - `PORT` = `4000`
   
6. Copy the generated Railway URL (e.g., `https://game-night-production.up.railway.app`)
7. Update Vercel environment variables with this URL

### Option B: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: game-night-server
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
5. Add Environment Variables (same as Railway)
6. Copy the Render URL and update Vercel

### MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Add your backend hosting IP to Network Access (or use `0.0.0.0/0` for testing)
5. Get connection string from "Connect" → "Connect your application"
6. Format: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Post-Deployment

1. Test the deployed frontend URL
2. Create a test session to verify backend connectivity
3. Check that MongoDB persistence works by restarting the backend
4. Monitor logs for any errors

## Troubleshooting

- **CORS errors**: Ensure backend allows your Vercel domain in CORS settings
- **WebSocket connection fails**: Check that `NEXT_PUBLIC_WS_URL` points to your backend
- **MongoDB connection errors**: Verify connection string and Network Access whitelist
- **Environment variables not working**: Redeploy after adding/changing variables
