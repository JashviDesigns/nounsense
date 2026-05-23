# NounSense

A digital sticky-note game that helps German learners master grammatical gender (**der**, **die**, **das**) through visual scene exploration — no pressure, no rote memorization.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scene image

Add your living room artwork:

```
public/scenes/living-room.png
```

Until that file exists, a pastel placeholder is shown. Hotspot positions (numbered 1–12) are in `data/living-room.ts` — adjust `top` / `left` % after you add art.

## Features

- Living room with 12 labelable objects (PRD noun list)
- Tap hotspots or noun buttons, then pick **der** / **die** / **das**
- 8-bit chiptune BGM + arcade SFX
- XP, streaks, success overlay
- PRD color palette

## Roadmap

Custom scene art, kitchen/café worlds, drag-and-drop labels, Focus/Exam modes.
