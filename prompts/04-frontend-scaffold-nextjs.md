# Prompt: Frontend Scaffold — Next.js (Vercel)

You are a full-stack engineer. Scaffold a Next.js app suitable for Vercel deployment aligned to the PRD/ERD.

## Requirements
- Pages: `/` (marketing/landing), `/host` (create session), `/join` (enter code), `/session/[code]` (lobby/gameplay).
- State: Client store (Zustand/Redux) for session and player state.
- UI: Import design tokens and components (from `03-design-system-neon-console.md`).
- Accessibility: Keyboard-first flows; ARIA roles and labels.
- Audio: Lightweight sound manager with global mute.

## Tech
- Next.js (App Router), TypeScript, ESLint, Prettier.
- Socket.IO client for realtime; REST for initial fetch.
- Tailwind or CSS Modules with tokens mapped.

## Output
- Project file tree, key files with initial implementations, and instructions to run.
