# Prompt: Backend Gateway — Node.js + WebSockets

You are a backend engineer. Implement a Node.js gateway that serves REST endpoints and WebSocket events per ERD.

## Scope
- REST endpoints:
  - `POST /api/sessions` create session (category, roundConfig)
  - `POST /api/sessions/:code/join` join (displayName, teamName?)
  - `POST /api/sessions/:code/team` create team
  - `GET /api/sessions/:code/state` session state
  - `POST /api/sessions/:code/start` start game
  - `POST /api/sessions/:code/round/next` next round
- WebSocket (Socket.IO): rooms per session; events per ERD.

## Data
- MongoDB models per ERD with indexes on `code`, `sessionId`, `category`.
- Rate limiting and validation.

## Output
- Server file structure, core handlers, and example payloads.
- Environment variable specification and local run instructions.
