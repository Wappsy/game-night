# Trivia Gameplay Engine — Outline

## State Machine
- states: `lobby` → `round_start` → `question_active` → `question_end` → `score_update` → `next_round` → `game_end`

## Pseudocode
```
startGame(session) {
  round = 1
  while (round <= totalRounds) {
    emit('round_start', { round })
    q = selectQuestion({ category, balanceByTopicAndDifficulty })
    emit('question_start', { q, timerSec })
    startTimer(timerSec)
    lockAnswersOnTimeout()
    computeScoresAndBonuses()
    emit('question_end', { correctIndex: q.correctIndex })
    emit('scoreboard_update', { scores })
    round++
  }
  emit('game_end', { finalScores })
}
```

## Scoring
- base points: correct = +100
- time bonus: `bonus = max(0, floor(50 * (remainingSec / timerSec)))`
- tie-breaker: lowest average response time wins

## Anti-cheat
- one submission per player per question
- reject after timeout
- server-authoritative scoring
