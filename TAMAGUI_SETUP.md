# Tamagui Migration - Game Night

## Setup Complete ✅

Your Game Night app is now set up with **Tamagui**, a modern design system framework.

### What Was Done

1. **Installed Tamagui** (`tamagui@1.140.3`)
   - Core design system framework
   - Supports both web and native (React Native)

2. **Created `tamagui.config.ts`**
   - Custom tokens for colors, spacing, sizing, radius, shadows
   - Dark theme configuration
   - Color palette:
     - **Primary**: `#4ef3ff` (cyan neon)
     - **Accent**: `#ff3bbd` (magenta)
     - **Status**: success (`#4ef3a1`), warning (`#ffc94e`), danger (`#ff5e5e`)
     - **Backgrounds**: Multiple shades for depth
   - Spacing scale: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
   - Radius scale: `0`, `xs`, `sm`, `md`, `lg`, `xl`, `full`

3. **Updated `globals.css`**
   - Preserved legacy CSS variable support (for backward compatibility)
   - Added reset styles
   - Maintained all existing button/input styling

4. **Updated `layout.tsx`**
   - Wrapped app with `<TamaguiProvider />`
   - Tamagui components now available throughout app

5. **Created Reusable Components**
   - `LeaderboardItem` - Displays rank, name, score + progress bar
   - `RankCard` - Medal, name, score card (for header)
   - `ChoiceButton` - Interactive choice with states (correct/incorrect/selected)
   - `QuestionPanel` - Question text + timer + children slots

## How to Use

### Using Tamagui Components in Your Pages

```tsx
import { YStack, XStack, Text, Button } from 'tamagui';
import { RankCard } from '@/components/RankCard';
import { ChoiceButton } from '@/components/ChoiceButton';

export default function Page() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="700">
        Hello Tamagui!
      </Text>
      
      {/* Use spacing tokens */}
      <XStack gap="$3">
        <RankCard medal="🥇" name="Team A" score={500} />
        <RankCard medal="🥈" name="Team B" score={400} />
      </XStack>
    </YStack>
  );
}
```

### Token System

- **Colors**: `$primary`, `$accent`, `$success`, `$text`, `$bg`, `$border`, etc.
- **Spacing**: `$1` (4px), `$2` (8px), `$3` (12px), `$4` (16px), ..., `$12` (48px)
- **Sizes**: `$xs` (24px), `$sm` (32px), `$md` (48px), `$lg` (64px), `$xl` (80px)
- **Radius**: `$1` (4px), `$2` (8px), `$3` (12px), `$4` (16px)

### Styling Props

All Tamagui components support shorthand props:

```tsx
<YStack
  padding="$4"           // 16px
  gap="$2"               // 8px
  backgroundColor="$bg"
  borderRadius="$3"      // 12px
  borderWidth={1}
  borderColor="$border"
>
  <Text color="$text" fontSize="$4" fontWeight="700">
    Styled with tokens!
  </Text>
</YStack>
```

## Next Steps

1. **Update Session Page** (`app/session/[code]/page.tsx`)
   - Replace inline styles with Tamagui components
   - Use `LeaderboardItem`, `RankCard`, `ChoiceButton`, `QuestionPanel`
   - Example:
     ```tsx
     import { YStack, XStack } from 'tamagui';
     import { LeaderboardItem } from '@/components/LeaderboardItem';
     
     <YStack>
       {teamScores.map((team) => (
         <LeaderboardItem 
           key={team.name}
           rank={...}
           name={team.name}
           score={team.score}
           maxScore={maxScore}
         />
       ))}
     </YStack>
     ```

2. **Update Host Page** (`app/host/page.tsx`)
   - Use Tamagui `Button`, `TextInput`, `XStack`, `YStack`

3. **Update Join Page** (`app/join/page.tsx`)
   - Same as host page

4. **Create Additional Components** as needed:
   - `TeamCard` - Display team info in sidebar
   - `SessionHeader` - Top bar with title + mini leaderboard
   - `GameOverModal` - End game results

## Benefits

✅ **Consistent Design**: All components use same token system  
✅ **Responsive**: Built-in support for responsive design  
✅ **Type-Safe**: Full TypeScript support  
✅ **Performant**: Optimized rendering and style injection  
✅ **Themeable**: Easy to swap colors/tokens app-wide  
✅ **Web + Native**: Same components work on both web and React Native  

## Token Reference

See `tamagui.config.ts` for full token definitions.

Key colors:
- `$primary` = `#4ef3ff` (cyan)
- `$accent` = `#ff3bbd` (magenta)
- `$success` = `#4ef3a1`
- `$danger` = `#ff5e5e`
- `$bg` = `#0b0f1a` (dark background)
- `$bgLight` = `#12172a`
- `$text` = `#e6ecff` (light text)

Spacing/sizes: `$1` (4px), `$2` (8px), `$3` (12px), `$4` (16px), `$5` (20px), ..., `$12` (48px)
