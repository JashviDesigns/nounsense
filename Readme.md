# NounSense

A digital sticky-note game that helps German learners master grammatical gender (**der**, **die**, **das**) through visual scene exploration.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 10 worlds

| Scene | Image path | Status |
|-------|------------|--------|
| 🏠 Living Room | `public/scenes/living-room.jpg` | ✅ calibrated |
| 🍳 Kitchen | `public/scenes/kitchen.jpg` | add image + calibrate |
| 🍽️ Restaurant | `public/scenes/restaurant.jpg` | add image + calibrate |
| 🚗 Street | `public/scenes/street.jpg` | add image + calibrate |
| 💻 Office | `public/scenes/office.jpg` | add image + calibrate |
| 🛁 Bathroom | `public/scenes/bathroom.jpg` | add image + calibrate |
| 🛏️ Bedroom | `public/scenes/bedroom.jpg` | add image + calibrate |
| 🛒 Supermarket | `public/scenes/supermarket.jpg` | add image + calibrate |
| 🏫 School | `public/scenes/school.jpg` | add image + calibrate |
| 🌿 Nature | `public/scenes/nature.jpg` | add image + calibrate |

Each scene has **10 nouns** from the PRD A1–B1 list. Switch worlds from the picker on the home screen.

### Calibrate a new scene

1. Add `public/scenes/{scene-id}.jpg`
2. Open `http://localhost:3000/calibrate?scene=kitchen` (etc.)
3. Place **highlight** on each object, then **marker** for the number
4. Copy the TypeScript snippet into `data/scenes/{scene-id}.ts`

## Features

- Image scenes with object highlights + numbered markers
- 8-bit sound, XP, streaks, success overlay
- Smart hints with ending rules (`lib/article-hints.ts`)

## Roadmap

- **Weak noun vault** — save misses in `localStorage`, resurface in review
- Richer hints (mnemonics, not just category rules)
- Focus / Exam modes, drag-and-drop labels
