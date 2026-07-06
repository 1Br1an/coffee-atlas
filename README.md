# Coffee Atlas

An interactive learning experience for specialty coffee. A beginner should leave
understanding why Ethiopian coffee tastes different, why processing matters, and
how pour-over recipes work — all learned through exploration, not reading.

Design north star: Notion's restraint × Apple's polish × an interactive museum.

## Run it

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## The three sections

1. **Origins** — a stylised d3-geo world map with the Bean Belt (25°N–25°S)
   highlighted and a pin at each origin. Tap a pin for elevation, harvest,
   varieties, processing, an animated flavour profile, tasting notes and a fun
   fact (inline panel on desktop, bottom sheet on mobile).
2. **Processing Lab** — step Washed → Honey → Natural → Anaerobic → Carbonic
   Maceration and watch the flavour bars, tasting notes and bean colour change.
   An A/B mode pits two methods side by side.
3. **Pour Over Studio** — a scrubbable, playable timeline for each championship
   recipe. The playhead drives a live water-level beaker, the current pour label
   and its purpose. A compare mode stacks two recipes on a shared time axis.

Onboarding asks what kind of drinker you are (`drinker` / `curious` / `brewer`),
which sets the copy depth and default section order.

## Architecture

```
src/
  data/          all coffee data + TypeScript types (the single source of truth)
    types.ts     interfaces
    origins.ts   processing.ts  recipes.ts  (data pack, rendered verbatim)
    index.ts     barrel export
  sections/
    registry.ts  the modular section spine + per-level ordering
    Origins.tsx  Processing.tsx  PourOver.tsx
  components/
    BeanBeltMap.tsx   isolated, swappable d3-geo map
    AttributeBars.tsx reusable animated bars
    Onboarding.tsx    Nav.tsx  profile.ts
  App.tsx  main.tsx  index.css
```

Principles: **data lives only in `src/data`** and is passed to components as
props (no country name or ratio is hardcoded in a component); **sections come
from a registry array**, so adding/removing/reordering one is a one-line change.

## Stack

Vite · React · TypeScript · Tailwind CSS (v4) · Framer Motion · d3-geo +
topojson-client + world-atlas (map only) · lucide-react. Static, no backend,
deployable to Vercel.

## Notes on motion & accessibility

- Primary content is visible by default; section reveals use CSS animation
  (not requestAnimationFrame), so nothing is left blank in a background tab.
- `prefers-reduced-motion` is respected globally.
- Every hover has a tap equivalent; map pins are ≥44px touch targets; the
  origin detail opens as a drag-to-dismiss bottom sheet on phones.
