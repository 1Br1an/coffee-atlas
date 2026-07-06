import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Lightbulb, Droplets } from 'lucide-react'
import { recipes } from '../data'
import type { PourEvent, Recipe } from '../data/types'
import type { SectionProps } from './registry'

const intro: Record<SectionProps['level'], string> = {
  drinker:
    'A pour-over is just water, poured in stages. Drag the timeline to watch a champion’s recipe unfold.',
  curious:
    'Great brews are recipes in time. Scrub through a championship pour-over and see what each pour is for.',
  brewer:
    'Four championship recipes, pour by pour. Scrub the timeline, read the intent, then compare them side by side.',
}

// --- pure helpers -----------------------------------------------------------

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Scale weight (grams) on the scale at time t, given cumulative pour targets. */
function waterAt(pours: PourEvent[], t: number): number {
  let w = 0
  for (const p of pours) {
    if (t >= p.end) {
      w = p.targetWeight
      continue
    }
    if (t > p.start) {
      const frac = (t - p.start) / (p.end - p.start)
      return p.targetWeight - p.pourWeight + frac * p.pourWeight
    }
    return w // before this pour begins — hold the last completed weight
  }
  return w
}

/** Index of the pour that is active at time t (or the most recent one). */
function activePourIndex(pours: PourEvent[], t: number): number {
  for (let i = 0; i < pours.length; i++) {
    if (t >= pours[i].start && t <= pours[i].end) return i
  }
  let idx = 0
  for (let i = 0; i < pours.length; i++) {
    if (t >= pours[i].start) idx = i
  }
  return idx
}

// --- pieces -----------------------------------------------------------------

function SpecChips({ recipe }: { recipe: Recipe }) {
  const specs = [
    { label: 'Coffee', value: `${recipe.coffeeG} g` },
    { label: 'Water', value: `${recipe.waterG} g` },
    { label: 'Ratio', value: recipe.ratio },
    { label: 'Grind', value: recipe.grind },
    { label: 'Temp', value: recipe.tempC },
    { label: 'Dripper', value: recipe.method },
  ]
  return (
    <div className="flex flex-wrap gap-1.5">
      {specs.map((s) => (
        <span key={s.label} className="ca-chip">
          <span className="text-faint">{s.label}</span>
          <span className="font-medium text-ink">{s.value}</span>
        </span>
      ))}
    </div>
  )
}

function Timeline({
  recipe,
  t,
  onScrub,
}: {
  recipe: Recipe
  t: number
  onScrub: (t: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const total = recipe.totalTimeSec
  const activeIdx = activePourIndex(recipe.pours, t)

  const scrubTo = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    onScrub(frac * total)
  }

  return (
    <div>
      <div
        ref={trackRef}
        role="slider"
        aria-label="Brew timeline"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.round(t)}
        aria-valuetext={`${formatTime(t)} of ${formatTime(total)}`}
        tabIndex={0}
        className="relative h-16 cursor-pointer touch-none select-none rounded-2xl bg-sand ring-1 ring-line focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          scrubTo(e.clientX)
        }}
        onPointerMove={(e) => {
          if (dragging.current) scrubTo(e.clientX)
        }}
        onPointerUp={(e) => {
          dragging.current = false
          e.currentTarget.releasePointerCapture(e.pointerId)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onScrub(Math.max(0, t - 5))
          if (e.key === 'ArrowRight') onScrub(Math.min(total, t + 5))
        }}
      >
        {/* pour windows */}
        {recipe.pours.map((p, i) => (
          <div
            key={i}
            className={[
              'absolute inset-y-2 rounded-lg transition-colors',
              i === activeIdx ? 'bg-accent' : 'bg-accent/45',
            ].join(' ')}
            style={{
              left: `${(p.start / total) * 100}%`,
              width: `${Math.max(1, ((p.end - p.start) / total) * 100)}%`,
            }}
          />
        ))}
        {/* playhead */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10"
          style={{ left: `${(t / total) * 100}%` }}
        >
          <div className="absolute inset-y-1 w-0.5 -translate-x-1/2 rounded-full bg-ink" />
          <div className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-md ring-4 ring-cream" />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-faint">
        <span>0:00</span>
        <span>{formatTime(total)}</span>
      </div>
    </div>
  )
}

function Beaker({ recipe, t }: { recipe: Recipe; t: number }) {
  const grams = waterAt(recipe.pours, t)
  const pct = (grams / recipe.waterG) * 100
  const target = recipe.pours[activePourIndex(recipe.pours, t)].targetWeight
  const targetPct = (target / recipe.waterG) * 100

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-56 w-40">
        {/* glass */}
        <div className="absolute inset-0 overflow-hidden rounded-b-[2.2rem] rounded-t-xl border-2 border-line bg-paper/60">
          {/* water */}
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent-strong via-accent to-amber transition-[height] duration-150 ease-out"
            style={{ height: `${pct}%` }}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
          </div>
          {/* target marker */}
          <div
            className="absolute inset-x-0 flex items-center transition-[bottom] duration-300"
            style={{ bottom: `${targetPct}%` }}
          >
            <div className="h-px w-full border-t border-dashed border-ink/40" />
          </div>
        </div>
        <span
          className="absolute -right-2 translate-x-full whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-cream transition-[bottom] duration-300"
          style={{ bottom: `calc(${targetPct}% - 10px)` }}
        >
          → {target} g
        </span>
      </div>
      <div className="mt-4 text-center">
        <div className="font-serif text-3xl tabular-nums text-ink">{Math.round(grams)} g</div>
        <div className="text-xs text-faint">of {recipe.waterG} g water</div>
      </div>
    </div>
  )
}

function Studio({ recipe }: { recipe: Recipe }) {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const total = recipe.totalTimeSec
  const activeIdx = activePourIndex(recipe.pours, t)
  const activePour = recipe.pours[activeIdx]

  // reset whenever the recipe changes
  useEffect(() => {
    setT(0)
    setPlaying(false)
  }, [recipe.id])

  // real-time playback
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setT((prev) => {
        const next = prev + dt
        if (next >= total) {
          setPlaying(false)
          return total
        }
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, total])

  const togglePlay = () => {
    if (!playing && t >= total) setT(0)
    setPlaying((p) => !p)
  }
  const handleScrub = (nt: number) => {
    setPlaying(false)
    setT(nt)
  }

  return (
    <div>
      {/* header */}
      <div className="ca-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="ca-kicker">{recipe.brewer}</p>
            <h3 className="mt-1 font-serif text-3xl font-medium text-ink">{recipe.name}</h3>
            <p className="mt-1 text-sm text-soft">{recipe.accolade}</p>
          </div>
        </div>

        <div className="mt-5">
          <SpecChips recipe={recipe} />
        </div>

        <div className="mt-6 flex gap-3 rounded-2xl border border-accent-soft bg-accent-soft/30 p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={2} />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">Big idea</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink">{recipe.bigIdea}</p>
          </div>
        </div>
      </div>

      {/* interactive */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="ca-card p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform hover:scale-105 active:scale-95"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                setT(0)
              }}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-soft transition-colors hover:text-ink"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="ml-1 font-serif text-2xl tabular-nums text-ink">
              {formatTime(t)}
              <span className="text-base text-faint"> / {formatTime(total)}</span>
            </div>
          </div>

          <div className="mt-6">
            <Timeline recipe={recipe} t={t} onScrub={handleScrub} />
          </div>

          {/* live pour readout — the teaching payload */}
          <div className="mt-6 rounded-2xl bg-sand/60 p-5">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-accent" strokeWidth={2} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-serif text-lg text-ink"
                >
                  {activePour.label}
                </motion.span>
              </AnimatePresence>
              <span className="ml-auto text-xs tabular-nums text-faint">
                {formatTime(activePour.start)}–{formatTime(activePour.end)}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-2 text-[15px] leading-relaxed text-soft"
              >
                {activePour.purpose}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="ca-card flex flex-col items-center justify-center p-6 lg:w-64">
          <Beaker recipe={recipe} t={t} />
          <div className="mt-5 w-full border-t border-line pt-4 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">In the cup</p>
            <p className="mt-1 text-sm leading-relaxed text-soft">{recipe.cupProfile}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecipePicker({
  activeId,
  onSelect,
  layoutId,
}: {
  activeId: string
  onSelect: (id: string) => void
  layoutId: string
}) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {recipes.map((r) => {
        const active = r.id === activeId
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            className={[
              'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active ? 'text-cream' : 'text-soft hover:text-ink',
            ].join(' ')}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{r.brewer}</span>
          </button>
        )
      })}
    </div>
  )
}

function PourStrip({ recipe, maxTotal }: { recipe: Recipe; maxTotal: number }) {
  return (
    <div className="ca-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div>
          <p className="ca-kicker">{recipe.brewer}</p>
          <h4 className="font-serif text-xl text-ink">{recipe.name}</h4>
        </div>
        <p className="text-sm text-soft">
          {recipe.pours.length} pours · {formatTime(recipe.totalTimeSec)} · {recipe.ratio}
        </p>
      </div>

      <div className="relative mt-6 h-12 rounded-xl bg-sand ring-1 ring-line">
        {recipe.pours.map((p, i) => (
          <div
            key={i}
            className="absolute inset-y-1.5 flex items-center justify-center rounded-md bg-accent/70"
            style={{
              left: `${(p.start / maxTotal) * 100}%`,
              width: `${Math.max(2.5, ((p.end - p.start) / maxTotal) * 100)}%`,
            }}
          >
            <span className="absolute -top-5 whitespace-nowrap text-[11px] font-medium tabular-nums text-soft">
              {p.targetWeight}g
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-faint">
        <span>0:00</span>
        <span>{formatTime(maxTotal)}</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-soft">{recipe.bigIdea}</p>
    </div>
  )
}

type Mode = 'studio' | 'compare'

export function PourOver({ level }: SectionProps) {
  const [mode, setMode] = useState<Mode>('studio')
  const [recipeId, setRecipeId] = useState(recipes[0].id)
  const [aId, setAId] = useState(recipes[0].id)
  const [bId, setBId] = useState(recipes[1]?.id ?? recipes[0].id)

  const recipe = recipes.find((r) => r.id === recipeId) ?? recipes[0]
  const a = recipes.find((r) => r.id === aId) ?? recipes[0]
  const b = recipes.find((r) => r.id === bId) ?? recipes[1]
  const maxTotal = Math.max(a.totalTimeSec, b.totalTimeSec)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="ca-kicker">Pour Over Studio</p>
      <h2 className="mt-2 max-w-2xl font-serif text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
        Recipes, pour by pour
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">{intro[level]}</p>

      <div className="mt-8 inline-flex rounded-full border border-line bg-paper p-1">
        {(['studio', 'compare'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={[
              'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              mode === m ? 'text-cream' : 'text-soft hover:text-ink',
            ].join(' ')}
          >
            {mode === m && (
              <motion.span
                layoutId="pour-mode"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{m === 'studio' ? 'Studio' : 'Compare'}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'studio' ? (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <RecipePicker activeId={recipeId} onSelect={setRecipeId} layoutId="pour-studio-pill" />
            <div className="mt-6">
              <Studio recipe={recipe} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-soft">Recipe A</p>
                <RecipePicker activeId={aId} onSelect={setAId} layoutId="pour-a-pill" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-soft">Recipe B</p>
                <RecipePicker activeId={bId} onSelect={setBId} layoutId="pour-b-pill" />
              </div>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <PourStrip recipe={a} maxTotal={maxTotal} />
              <PourStrip recipe={b} maxTotal={maxTotal} />
            </div>
            <p className="mt-5 text-center text-sm text-faint">
              Same axis, stacked — the spacing and height of each pour is where the recipes really differ.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
