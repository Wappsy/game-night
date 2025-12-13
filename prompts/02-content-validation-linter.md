# Prompt: Validate and Lint Trivia Dataset

You are a content validator. Given a JSON dataset as described in `01-content-80s-pop-culture.md`, perform validation and linting.

## Tasks
- Verify schema: required fields, types, `correctIndex` bounds.
- Check uniqueness of `id` and no duplicate prompts.
- Detect ambiguity: multiple correct answers or unclear wording.
- Balance: topic and difficulty distribution per requirements.
- Flag sensitive/biased phrasing; suggest neutral alternatives.

## Output
- A report listing:
  - Summary counts by topic and difficulty.
  - Validation errors with item `id`s and suggested fixes.
  - Ambiguity notes and proposed revised prompts/choices.
- Provide a cleaned JSON (if possible) with fixed items.
