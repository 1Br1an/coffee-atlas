import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { MapPin, Sparkles, X } from 'lucide-react'
import { origins } from '../data'
import type { Origin } from '../data/types'
import { BeanBeltMap } from '../components/BeanBeltMap'
import { AttributeBars } from '../components/AttributeBars'
import { profileBars } from '../components/profile'
import type { SectionProps } from './registry'

const intro: Record<SectionProps['level'], string> = {
  drinker:
    'Every coffee starts somewhere. Tap a country to see how its home shapes the cup.',
  curious:
    'All specialty coffee grows in one warm band around the equator. Tap a pin to explore each origin.',
  brewer:
    'Origin sets the ceiling. Tap a pin for elevation, varieties, processing and the full flavour profile.',
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

function Chips({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span key={v} className="ca-chip">
          {v}
        </span>
      ))}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.div variants={item}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-faint">{label}</p>
      {children}
    </motion.div>
  )
}

function ElevationBar({
  range,
  domain,
}: {
  range: [number, number]
  domain: [number, number]
}) {
  const [lo, hi] = range
  const [dMin, dMax] = domain
  const span = dMax - dMin
  const left = ((lo - dMin) / span) * 100
  const width = ((hi - lo) / span) * 100
  return (
    <div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-sand">
        <div
          className="absolute inset-y-0 rounded-full bg-gradient-to-r from-amber to-accent transition-all duration-500 ease-out"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs tabular-nums text-soft">
        <span className="font-medium text-ink">{lo.toLocaleString()} m</span>
        <span className="font-medium text-ink">{hi.toLocaleString()} m</span>
      </div>
    </div>
  )
}

function OriginDetail({ origin, domain }: { origin: Origin; domain: [number, number] }) {
  return (
    <motion.div
      key={origin.id}
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      <motion.div variants={item}>
        <p className="ca-kicker flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          {origin.region}
        </p>
        <h3 className="mt-1 font-serif text-3xl font-medium text-ink">{origin.country}</h3>
      </motion.div>

      <motion.p variants={item} className="text-[15px] leading-relaxed text-soft">
        {origin.blurb}
      </motion.p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Elevation">
          <ElevationBar range={origin.elevationM} domain={domain} />
        </Field>
        <Field label="Harvest">
          <p className="text-[15px] text-ink">{origin.harvest}</p>
        </Field>
      </div>

      <Field label="Varieties">
        <Chips values={origin.varieties} />
      </Field>

      <Field label="Processing">
        <Chips values={origin.processing} />
      </Field>

      <Field label="Flavour profile">
        <AttributeBars items={profileBars(origin.profile)} />
      </Field>

      <Field label="Tasting notes">
        <Chips values={origin.tastingNotes} />
      </Field>

      <motion.div
        variants={item}
        className="flex gap-3 rounded-2xl border border-accent-soft bg-accent-soft/30 p-4"
      >
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
        <p className="text-sm leading-relaxed text-ink">{origin.funFact}</p>
      </motion.div>
    </motion.div>
  )
}

export function Origins({ level }: SectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = origins.find((o) => o.id === selectedId) ?? null

  // Elevation scale derived from the data — no magic numbers.
  const domain = useMemo<[number, number]>(() => {
    const lows = origins.map((o) => o.elevationM[0])
    const highs = origins.map((o) => o.elevationM[1])
    return [Math.min(...lows), Math.max(...highs)]
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="ca-kicker">Origins</p>
      <h2 className="mt-2 max-w-2xl font-serif text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
        The Bean Belt
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">{intro[level]}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="ca-card overflow-hidden p-3 sm:p-5">
            <BeanBeltMap origins={origins} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <p className="mt-3 flex items-center gap-2 px-1 text-sm text-faint">
            <span className="inline-block h-2.5 w-6 rounded-full bg-accent/25 ring-1 ring-accent/40" />
            Highlighted band: 25°N – 25°S, where all specialty coffee grows.
          </p>
        </div>

        {/* Inline detail on large screens. */}
        <div className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-24 ca-card min-h-[30rem] p-7">
            <AnimatePresence mode="wait">
              {selected ? (
                <OriginDetail key={selected.id} origin={selected} domain={domain} />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sand">
                    <MapPin className="h-6 w-6 text-accent" strokeWidth={1.75} />
                  </div>
                  <p className="mt-4 font-serif text-xl text-ink">Choose an origin</p>
                  <p className="mt-1 max-w-[16rem] text-sm text-soft">
                    Select any pin on the map to reveal its story and flavour profile.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom sheet on small screens. */}
      <AnimatePresence>
        {selected && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-ink/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              key={selected.id}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-line bg-paper px-5 pb-10 pt-3 shadow-[0_-20px_50px_-30px_rgba(42,33,27,0.6)]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) setSelectedId(null)
              }}
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-sand text-soft"
              >
                <X className="h-4 w-4" />
              </button>
              <OriginDetail origin={selected} domain={domain} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
