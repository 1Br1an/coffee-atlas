import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { processingMethods } from '../data'
import type { ProcessingMethod } from '../data/types'
import { AttributeBars } from '../components/AttributeBars'
import { processingBars } from '../components/profile'
import type { SectionProps } from './registry'

const intro: Record<SectionProps['level'], string> = {
  drinker:
    'Same beans, five ways of drying them — and very different cups. Step through from clean to fruit-forward.',
  curious:
    'Processing is what happens to the cherry after picking. Step through the methods to feel how much it changes flavour.',
  brewer:
    'From washed clarity to carbonic-maceration fruit bombs — step through, or pit two methods head-to-head.',
}

// Visual hint for the bean's drying/fermentation state. Colour only — not a
// stated fact — running clean (pale) → fruit-forward (deep wine).
const beanColor: Record<string, string> = {
  washed: '#b9c19c',
  honey: '#d7a24e',
  natural: '#8f3f34',
  anaerobic: '#5f3a6b',
  'carbonic-maceration': '#7c2f4c',
}

type Mode = 'step' | 'compare'

function Bean({ methodId, fruitiness }: { methodId: string; fruitiness: number }) {
  const color = beanColor[methodId] ?? 'var(--color-accent)'
  const speckle = Math.min(0.55, fruitiness / 150)
  return (
    <svg viewBox="0 0 120 140" className="h-40 w-40" aria-hidden="true">
      <defs>
        <radialGradient id="beanShine" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <g transform="rotate(-20 60 70)">
        <motion.ellipse
          cx={60}
          cy={70}
          rx={38}
          ry={50}
          initial={false}
          animate={{ fill: color }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        {/* fermentation speckle — more visible the fruitier the method */}
        <motion.g animate={{ opacity: speckle }} transition={{ duration: 0.5 }}>
          {[
            [45, 45],
            [72, 55],
            [52, 78],
            [78, 90],
            [40, 95],
            [64, 108],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 2 ? 3.4 : 2.4} fill="#2a140f" />
          ))}
        </motion.g>
        {/* centre crease */}
        <path
          d="M60 22 C 52 50, 52 90, 60 118"
          fill="none"
          stroke="rgba(30,18,12,0.45)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <ellipse cx={60} cy={70} rx={38} ry={50} fill="url(#beanShine)" />
      </g>
    </svg>
  )
}

function MethodPicker({
  methods,
  activeId,
  onSelect,
  layoutId,
}: {
  methods: ProcessingMethod[]
  activeId: string
  onSelect: (id: string) => void
  layoutId: string
}) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {methods.map((m) => {
        const active = m.id === activeId
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className={[
              'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active ? 'text-cream' : 'text-soft hover:text-ink',
            ].join(' ')}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{m.name}</span>
          </button>
        )
      })}
    </div>
  )
}

function NoteChips({ notes }: { notes: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {notes.map((n) => (
        <span key={n} className="ca-chip">
          {n}
        </span>
      ))}
    </div>
  )
}

export function Processing({ level }: SectionProps) {
  const methods = useMemo(
    () => [...processingMethods].sort((a, b) => a.order - b.order),
    [],
  )
  const [mode, setMode] = useState<Mode>('step')
  const [activeId, setActiveId] = useState(methods[0].id)
  const [aId, setAId] = useState(methods[0].id)
  const [bId, setBId] = useState(methods[2]?.id ?? methods[methods.length - 1].id)

  const active = methods.find((m) => m.id === activeId) ?? methods[0]
  const a = methods.find((m) => m.id === aId) ?? methods[0]
  const b = methods.find((m) => m.id === bId) ?? methods[1]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="ca-kicker">Processing Lab</p>
      <h2 className="mt-2 max-w-2xl font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
        How drying changes everything
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">{intro[level]}</p>

      {/* Mode toggle */}
      <div className="mt-8 inline-flex rounded-full border border-line bg-paper p-1">
        {(['step', 'compare'] as Mode[]).map((m) => (
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
                layoutId="proc-mode"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{m === 'step' ? 'Step through' : 'Compare A / B'}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'step' ? (
          <motion.div
            key="step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-[0.14em] text-faint">
              <span>Clean</span>
              <span className="h-px flex-1 bg-line" />
              <span>Fruit-forward</span>
            </div>
            <MethodPicker
              methods={methods}
              activeId={activeId}
              onSelect={setActiveId}
              layoutId="proc-step-pill"
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="ca-card flex flex-col items-center justify-center gap-4 p-8">
                <Bean methodId={active.id} fruitiness={active.profile.fruitiness} />
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-semibold text-ink">{active.name}</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-soft">
                    {active.oneLiner}
                  </p>
                </div>
              </div>

              <div className="ca-card p-7">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-faint">
                  Flavour profile
                </p>
                <AttributeBars items={processingBars(active.profile)} />
                <div className="my-6 h-px bg-line" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-faint">
                      Tasting notes
                    </p>
                    <NoteChips notes={active.tastingNotes} />
                    <p className="mt-5 text-[15px] leading-relaxed text-soft">{active.detail}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
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
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { side: 'A', method: a, id: aId, set: setAId, layout: 'proc-a-pill' },
                { side: 'B', method: b, id: bId, set: setBId, layout: 'proc-b-pill' },
              ].map(({ side, method, id, set, layout }) => (
                <div key={side} className="ca-card p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
                      {side}
                    </span>
                    <span className="text-sm text-soft">Choose a method</span>
                  </div>
                  <MethodPicker methods={methods} activeId={id} onSelect={set} layoutId={layout} />
                  <div className="mt-5 flex items-center gap-4">
                    <Bean methodId={method.id} fruitiness={method.profile.fruitiness} />
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-ink">{method.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-soft">{method.oneLiner}</p>
                    </div>
                  </div>
                  <div className="my-5 h-px bg-line" />
                  <AttributeBars items={processingBars(method.profile)} />
                  <div className="mt-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={method.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <NoteChips notes={method.tastingNotes} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-sm text-faint">
              Two methods, same bars — the gap between them is how much processing alone moves the cup.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
