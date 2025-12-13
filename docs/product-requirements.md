# Game Night — Product Requirements Document (PRD)

## Overview
Game Night is a modern, fast, and social trivia game designed for in-person and remote play. It features multiple teams per session, cross-device participation (laptop/desktop), and category-based trivia starting with an 80s Pop Culture set. The experience aims to feel like a polished console game (e.g., Xbox), with dynamic animations, sound cues, and a fun, competitive UI.

## Goals
- Deliver a highly engaging, modern trivia experience for groups.
- Support both co-located and remote multiplayer sessions with low friction.
- Provide category-driven content, starting with 80s Pop Culture.
- Deploy quickly and reliably using Vercel and a Node backend.
- Establish a foundation for future game modes beyond trivia.

## Non-Goals (Phase 1)
- Mobile native apps (iOS/Android) — PWA-friendly UI only.
- Complex user profiles/social graph. Auth is minimal.
- Custom question creation by users (Phase 2+).
- Monetization beyond simple free tier (Phase 2+).

## Target Users & Personas
- Host: Organizes the session, shares a code/URL, controls rounds.
- Player: Joins via link+code, joins/creates a team, answers questions.
- Spectator (optional, Phase 2): Views leaderboard without participation.

## User Stories
- As a host, I can create a game session and share a join code.
- As a player, I can join a session from my computer and pick a team.
- As a host, I can select a trivia category and start rounds.
- As a player, I can answer questions in timed rounds.
- As a host, I can view and broadcast scores, round results, and leaderboards.
- As a player, I can see my team’s current standing in realtime.

## Core Features (MVP)
1. Session Management
   - Create/join sessions with a short alphanumeric code.
   - Multiple teams per session; custom team names; avatar/emblem selection.
2. Onboarding Flow
   - Host dashboard: create session, pick category, configure round length.
   - Player join: name input, team select or create, simple avatar.
3. Trivia Gameplay
   - Round-based play with timed questions.
   - Multiple-choice questions (initially 4 options).
   - Immediate feedback (correct/incorrect) and round summaries.
4. Scoring & Leaderboards
   - Points per correct answer with optional time-based bonus.
   - Team leaderboard updated in realtime.
5. Content: 80s Pop Culture
   - Minimum 150 curated Q&As across movies, music, TV, tech, sports.
   - Difficulty tiers: Easy/Medium/Hard.
6. Polished UI/UX
   - Console-quality visuals: bold typography, neon accents, micro-animations.
   - Sound effects (join, correct/incorrect, round start/end) with mute.
   - Accessibility: keyboard navigation, color-contrast, screen-reader labels.
7. Deployment
   - Hosted on Vercel; backend accessible via serverless or dedicated Node service.

## Modern & Fun UI Principles
- Dynamic lobby with animated team cards and presence indicators.
- Question screens with high-contrast choices and motion cues.
- Score reveal animations; end-of-round recap with highlights.
- Theming: neon/glow accents on dark background; subtle gradients.
- Sound design: crisp feedback; optional background loop.

## Content Requirements — 80s Pop Culture
- Topics: Movies (blockbusters), Music (pop/rock/new wave), TV (sitcoms/dramas), Tech (devices/events), Sports (icons/moments), Fashion.
- Structure per question: id, category, difficulty, prompt, choices[4], correctIndex, optional media (image/audio), source/ref.
- Quality rules: clear wording, single correct answer, avoid ambiguity.
- Diversity: mix difficulty and topics; avoid regional bias when possible.

## Success Metrics
- Session creation-to-start time under 60 seconds.
- Realtime latency under 150ms for most interactions.
- First-week retention (players return to play again): 25%+.
- NPS > 40 for hosts.
- 95%+ successful joins without support.

## Constraints & Assumptions
- Desktop web is primary; mobile web usable but not fully optimized initially.
- Realtime via WebSockets or server-sent events; fallback polling allowed.
- Minimal authentication (display name only) to reduce friction.

## Risks
- Realtime sync complexity under network variability.
- Content accuracy/quality impacts trust.
- UX polish demand is high for console-like feel.

## Roadmap (Phase 0 → Phase 2)
- Phase 0: PRD/ERD, design system, content pipeline, scaffolding.
- Phase 1 (MVP): Lobby, session/join, 80s Pop trivia, scoring, leaderboard, deploy.
- Phase 2: Additional categories, question media, auth optionality, spectator mode, moderation tools.

## Acceptance Criteria (MVP)
- Host can create a session, pick 80s Pop Culture, start game.
- Players can join via code, pick team, play rounds.
- Questions render clearly with animations; scoring is correct and fast.
- Leaderboard updates in realtime; end-of-game recap displayed.
- Deployed on Vercel; runs reliably with <300ms TTFB.
