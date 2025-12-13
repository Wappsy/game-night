# Game Night — Engineering Requirements (ERD)

## Architecture Overview
- Frontend: React (Vite or Next.js on Vercel). Prioritize SSR/ISR for lobby/share pages; client-heavy for gameplay.
- Backend: Node.js with WebSocket gateway. API via REST for CRUD; WebSocket for gameplay events.
- Database: MongoDB (Atlas) for sessions, teams, players, questions, and results.
- Hosting: Vercel (frontend + serverless functions) with optional dedicated Node server (if persistent WebSockets required). Consider Vercel Edge for presence.
- Realtime: Socket.IO or `ws` with rooms per session; presence and pub/sub.

## Key Modules
- Session Service: create/join/close sessions; manage codes and lifecycle.
- Team Service: team CRUD, membership, avatars.
- Player Service: join, leave, presence, input validation.
- Trivia Engine: rounds, timers, question selection, scoring, anti-cheat.
- Leaderboard Service: team/individual scoring, tie-breakers.
- Content Service: category registry, question store, difficulty filters.
- Telemetry: event logging, analytics, error tracking.

## Data Model (MongoDB)
- sessions: { _id, code, status, hostId, category, roundConfig, createdAt, updatedAt }
- teams: { _id, sessionId, name, emblem, score, createdAt }
- players: { _id, sessionId, teamId, displayName, isHost, joinedAt, disconnectedAt }
- questions: { _id, category, difficulty, prompt, choices: [string], correctIndex, media?, source?, createdAt }
- answers: { _id, sessionId, questionId, playerId, teamId, isCorrect, responseIndex, timeMs, createdAt }
- events (optional): { _id, sessionId, type, payload, createdAt }

## API Endpoints (REST)
- POST /api/sessions: create session { category, roundConfig }
- POST /api/sessions/:code/join: join session { displayName, teamName? }
- POST /api/sessions/:code/team: create team { name, emblem? }
- GET /api/sessions/:code/state: current lobby/game state
- POST /api/sessions/:code/start: start game
- POST /api/sessions/:code/round/next: advance round
- GET /api/questions?category=80s&difficulty=easy: fetch subset (host-only)

## WebSocket Events
- server→client: session_state, question_start, question_end, scoreboard_update, round_start, round_end, game_end, presence_update.
- client→server: join, leave, answer_submit, ready, host_command(start|next|end), heartbeat.

## Gameplay Logic
- Rounds: configurable count (e.g., 10 questions). Timer per question (e.g., 20s).
- Scoring: base points per correct answer; bonus curve for faster responses.
- Anti-cheat: single submission per player per question; cut-off on timer end.
- Tie-breakers: fastest average response time.

## UX/UI Implementation
- Design System: tokens (colors, spacing, typography), components (Cards, Buttons, Panels), motion presets.
- Visual Style: console-like neon/dark theme, glow effects, animated transitions.
- Accessibility: WCAG AA contrast, semantic roles, keyboard focus ring.
- Audio: HTML5 Audio sprites; global mute; gentle defaults.

## Security & Privacy
- Minimal PII: displayName only; no email required for players.
- Rate limiting on join and answer_submit.
- Session codes: 6–8 chars, unique, expire after inactivity.
- Transport security (HTTPS/WSS); input validation; XSS/CSRF protections.

## Testing Strategy
- Unit: trivia engine, scoring, timers, reducers.
- Integration: session join flow, team creation, websocket events.
- E2E: lobby → play → results (Playwright).
- Load: simulate 100–500 concurrent players with k6/Artillery.

## Telemetry & Analytics
- Client events: joins, answers, correctness, round time, drop-offs.
- Backend metrics: event latency, message throughput, error rates.
- Crash reporting: Sentry or similar.

## CI/CD
- GitHub Actions: lint, test, build, preview deploy to Vercel per PR.
- Main branch: auto-deploy to production.

## Infrastructure
- Vercel project with environment variables.
- MongoDB Atlas cluster; IP access rules; secrets via Vercel.
- Optional Redis (Upstash) for presence, rate limiting, and pub/sub.

## Performance Targets
- WebSocket event latency: p95 < 150ms.
- Page load (lobby): LCP < 2.5s on mid-tier devices.
- Cold start (serverless): p95 < 800ms; consider edge functions for presence.

## Risks & Mitigations
- WebSocket persistence on serverless: use dedicated Node or Socket.IO adapter (Redis) to maintain rooms.
- Content scale: build a validation pipeline; add linters for question structure.
- Audio/animation performance: use GPU-accelerated transforms; limit DOM reflow.

## Milestones
- M0: Repo scaffold, design tokens, WebSocket gateway skeleton.
- M1: Session/join/team flows, lobby UI.
- M2: Trivia engine + question rendering + scoring.
- M3: Leaderboard + polish + E2E tests.
- M4: Content complete (80s Pop Culture) + production deploy.
