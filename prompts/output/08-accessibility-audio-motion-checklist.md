# Accessibility, Audio, Motion — Checklist

## Accessibility
- Keyboard: Tab order consistent; Enter/Space activate; Arrow keys for answer choices
- Focus: visible neon focus ring; skip-to-content link
- ARIA: roles on buttons, dialogs, lists; labels on inputs
- Contrast: WCAG AA (>=4.5:1); avoid color-only correctness indicators

## Audio
- Default SFX: on at low volume; global mute toggle
- Respect OS: reduced motion/audio preferences
- Events: join, ready, start, correct, incorrect, round end, game end

## Motion
- Transforms: use translate/scale; avoid layout thrash
- Durations: 120–220ms micro; 300–400ms reveal
- Easing: inOut standard; outBack for celebratory
- Performance: target 60 FPS; avoid animating large lists
