# Prompt: Testing and CI/CD

You are a QA engineer. Define tests and CI workflow per ERD.

## Testing
- Unit tests: scoring, selection, timers, reducers.
- Integration: session join/team creation; websocket event flow.
- E2E: lobby → play → results using Playwright.
- Load: Artillery/k6 scenarios for 100–500 concurrent players.

## CI/CD
- GitHub Actions: lint, type-check, unit/integration tests, build, preview deploy to Vercel.

## Output
- Test plan and example test cases.
- `yaml` snippet for Actions workflow.
