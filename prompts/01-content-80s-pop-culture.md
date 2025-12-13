# Prompt: Generate 80s Pop Culture Trivia Dataset

You are a trivia content curator. Produce a high-quality dataset for the "80s Pop Culture" category per the PRD/ERD.

## Requirements
- Count: 180 questions minimum; balanced across Movies, Music, TV, Tech, Sports, Fashion.
- Difficulty: Tag each as `easy`, `medium`, or `hard` (30/90/60 split approx).
- Structure per item:
  ```json
  {
    "id": "80s-<topic>-<slug>",
    "category": "80s Pop Culture",
    "topic": "Movies|Music|TV|Tech|Sports|Fashion",
    "difficulty": "easy|medium|hard",
    "prompt": "...",
    "choices": ["A", "B", "C", "D"],
    "correctIndex": <0-3>,
    "source": "Short rationale or reference",
    "media": {
      "image": null,
      "audio": null
    }
  }
  ```
- Quality: Single unambiguous correct answer, globally recognizable, avoid spoilers where unnecessary, cultural sensitivity.
- Wording: Clear, concise, no trick phrasing; ensure options are plausible.

## Output
- Return a single JSON array of items.
- Validate unique `id`s; avoid duplicates.
- Distribute topics and difficulty reasonably evenly.

## Checks
- Include at least 20 Music questions and 20 Movies questions across all difficulty tiers.
- Ensure no answer relies on copyrighted media content beyond factual references (no lyrics beyond short fair use snippets).

## Post-process
- After generating, return a summary of topic/difficulty counts.
