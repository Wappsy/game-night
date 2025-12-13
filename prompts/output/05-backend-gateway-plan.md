# Backend Gateway Plan — Node.js + Socket.IO

## Tech
- Node.js 20+, Fastify or Express
- Socket.IO server with Redis adapter (optional Upstash)
- MongoDB driver or Mongoose

## REST Endpoints
- POST `/api/sessions` — create session { category, roundConfig }
- POST `/api/sessions/:code/join` — { displayName, teamName? }
- POST `/api/sessions/:code/team` — { name, emblem? }
- GET `/api/sessions/:code/state` — current state
- POST `/api/sessions/:code/start` — start game
- POST `/api/sessions/:code/round/next` — advance round

## WS Rooms & Events
- Room per `code`
- server→client: `session_state`, `round_start`, `question_start`, `question_end`, `scoreboard_update`, `game_end`, `presence_update`
- client→server: `join`, `leave`, `answer_submit`, `ready`, `host_command`, `heartbeat`

## Env Vars
- `MONGODB_URI`, `REDIS_URL` (optional), `JWT_SECRET` (future auth), `ORIGIN`

## Run
- `pnpm dev` — REST + WS, hot reload
- Health: `/api/health`
