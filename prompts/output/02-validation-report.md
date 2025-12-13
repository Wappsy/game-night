# Validation Report — 80s Pop Culture Dataset

## Summary
- Items: 30
- Topics: Movies(8), Music(6), TV(6), Tech(6), Sports(4), Fashion(4)
- Difficulty: easy(12), medium(12), hard(6)

## Schema Checks
- Required fields present in all items: id, category, topic, difficulty, prompt, choices[4], correctIndex, source, media.
- `correctIndex` bounds: 0–3 OK across all items.
- Unique `id`: No duplicates found.
- Duplicate prompts: None detected.

## Ambiguity & Wording
- All prompts have single unambiguous correct answers.
- Wording concise; options plausible.

## Sensitivity & Copyright
- No lyrics or media-dependent answers; factual references only.

## Balance Notes
- Starter set is reasonably balanced; target for full 180-item dataset:
  - Movies ≥ 30, Music ≥ 30, TV ≥ 30, Tech ≥ 30, Sports ≥ 30, Fashion ≥ 30.
  - Difficulty split ~30 easy / 90 medium / 60 hard.

## Suggested Next Steps
- Expand dataset in batches of 50 with validation after each batch.
- Add lightweight script to enforce schema and distribution rules before commit.
