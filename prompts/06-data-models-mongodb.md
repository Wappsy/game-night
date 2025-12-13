# Prompt: MongoDB Data Models

You are a data engineer. Define Mongoose schemas and indexes for all entities.

## Entities
- Session, Team, Player, Question, Answer, Event.

## Requirements
- Schemas with types and validation aligned to ERD.
- Indexes: `code` unique (Session), `sessionId` compound where relevant, `category+difficulty` for questions.
- TTL/archival: optional automatic expiry for inactive sessions.

## Output
- Mongoose schema code snippets.
- Migration/seed script outline for `80s-pop-culture.json`.
