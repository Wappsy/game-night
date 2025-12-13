# Frontend Scaffold Plan — Next.js (App Router)

## Tech
- Next.js 14+, TypeScript, ESLint/Prettier
- Zustand for client state; Socket.IO client for realtime
- Tailwind CSS with tokens mapped; or CSS Modules if preferred

## Pages/Routes
- `/` — Landing: pitch, create/join CTA
- `/host` — Host dashboard: create session (category, rounds)
- `/join` — Join: enter code + display name, choose team
- `/session/[code]` — Lobby/gameplay: team cards, presence, question/answers, leaderboard

## Components
- `TeamCard`, `LeaderboardRow`, `QuestionPanel`, `AnswerChoice`, `ScoreToast`, `AudioToggle`

## State
- `useSessionStore`: code, status, teams, players, me, currentQuestion, scores
- `useAudio`: sfx enabled, play cue

## Integration
- REST: initial fetch `/api/sessions/:code/state`
- WS: subscribe to events `session_state`, `question_start/end`, `scoreboard_update`

## Dev Commands
- `pnpm create next-app game-night` (or `npx create-next-app`)
- Add Tailwind/Zustand/Socket.IO client; wire env vars
