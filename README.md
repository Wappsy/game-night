# Game Night

Real-time trivia game with MongoDB persistence, team scoring, and WebSocket-powered gameplay.

## Project Structure

- `/web` - Next.js frontend
- `/server` - Express/Socket.IO backend
- `/data` - Question datasets
- `/docs` - Product and engineering requirements

## Highlights
- Multiple teams per session with custom names
- Real-time gameplay via WebSockets with responsive UI
- Category-based trivia (80s Pop Culture)
- MongoDB persistence - sessions survive server restarts
- Mid-question recovery - reconnect during active questions
- Copy-to-clipboard session codes and invite links
- Team-based leaderboard with progress bars
- Sound effects toggle
- Host controls (force end question, start rounds)

## Tech Stack
- Frontend: Next.js 14, React, Socket.IO client
- Backend: Node.js, Express, Socket.IO, MongoDB
- Database: MongoDB Atlas
- Hosting: Vercel (frontend), any Node.js host (backend)

## Getting Started (Dev)

### Server
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
npm run dev
```

### Web
```bash
cd web
npm install
export NEXT_PUBLIC_API_URL=http://localhost:4000
export NEXT_PUBLIC_WS_URL=http://localhost:4000
npm run dev
```

## Deployment


### Frontend (Vercel)
Deploy the `/web` directory to Vercel. Set environment variables:
- `NEXT_PUBLIC_API_URL` - Your server API URL (e.g., https://your-server.railway.app)
- `NEXT_PUBLIC_WS_URL` - Your server WebSocket URL (same as API URL)

### Backend
Deploy `/server` to any Node.js hosting (Railway, Render, Fly.io, etc). Set:
- `MONGO_URL` - MongoDB Atlas connection string
- `MONGO_DB` - Database name (default: game-night)
- `PORT` - Server port (default: 4000)

## Project Docs
- Product Requirements: `docs/product-requirements.md`
- Engineering Requirements: `docs/engineering-requirements.md`
- Content Dataset: `data/80s-pop-culture.json`

## Roadmap
- MVP: ✅ Lobby + join + 80s Pop Culture trivia + leaderboard + MongoDB persistence
- Next: More categories, enhanced audio/visual polish, spectator mode
