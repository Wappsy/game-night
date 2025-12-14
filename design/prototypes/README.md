# Game Night - UI Prototypes

Interactive HTML prototypes for Game Night UI design. Open `index.html` in a browser to view and iterate on designs.

## Features

- **Host Page** - Session creation with category/timer/questions settings, copy-to-clipboard for code & invite link
- **Join Page** - Paste from clipboard, team creation/joining UI
- **Lobby** - Player & team roster, start round button
- **Question State** - Multiple choice display with timer, submitted state feedback
- **Leaderboard** - Ranked teams with progress bars, animated gold/silver/bronze rankings
- **Host Controls** - Copy invite link, force end question, next round buttons
- **Reconnect Banner** - "Rejoined mid-question" alert with remaining time
- **Game Over** - Final leaderboard and play again CTA

## Design System

- **Colors**: Neon console theme (cyan `#00ff88`, magenta `#ff006e`, dark bg `#0a0e27`)
- **Typography**: Monospace (Courier New) for retro feel
- **Spacing**: 8px grid with rounded corners (8px radius)
- **Effects**: Neon glow, hover animations, progress bars with smooth transitions

## Notes

- Fully responsive grid layout
- All interactive elements have hover states
- Progress bars animate on score updates
- Status indicators pulse for real-time feedback
- Color-coded rankings (gold/silver/bronze)

## Next Steps

- Export these designs to Figma or Adobe XD
- Use as reference for React component styling
- Test accessibility (contrast, focus states)
- Add dark/light mode toggle if needed
