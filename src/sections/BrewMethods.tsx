import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Cog, Flame } from 'lucide-react'
import { brewMethods } from '../data'
import type { BrewMethod } from '../data/types'
import { AttributeBars } from '../components/AttributeBars'
import { brewMethodBars } from '../components/profile'
import type { SectionProps } from './registry'

const intro: Record<SectionProps['level'], string> = {
  drinker:
    'Seven ways to turn the same beans into very different cups. Compare them side by side and find yours.',
  curious:
    'The brewer you pick sets body and clarity before the coffee even touches water. All seven, one grid.',
  brewer:
    'Body vs. clarity, grind, time and roast fit for all seven brewers — the trade-offs at a glance.',
}

type DifficultyFilter = 'All' | BrewMethod['difficulty']
const filters: DifficultyFilter[] = ['All', 'Easy', 'Medium', 'Hard']

const difficultyStyle: Record<BrewMethod['difficulty'], string> = {
  Easy: 'bg-sand text-soft',
  Medium: 'bg-accent-soft text-accent-strong',
  Hard: 'bg-berry/10 text-berry',
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" strokeWidth={2} />
      <span className="w-20 shrink-0 text-faint">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}

function MethodCard({ method, index }: { method: BrewMethod; index: number }) {
  return (
    <motion.div
      className="ca-card flex flex-col gap-5 p-6"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-2xl font-semibold text-ink">{method.name}</h3>
        <span
          className={[
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
            difficultyStyle[method.difficulty],
          ].join(' ')}
        >
          {method.difficulty}
        </span>
      </div>

      <AttributeBars items={brewMethodBars(method)} />

      <div className="h-px bg-line" />

      <div className="flex flex-col gap-2">
        <SpecRow icon={Clock} label="Brew time" value={`${method.brewTimeMin} min`} />
        <SpecRow icon={Cog} label="Grind" value={method.grindSize} />
        <SpecRow icon={Flame} label="Roast" value={method.roastRec} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {method.notes.map((n) => (
          <span key={n} className="ca-chip">
            {n}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function BrewMethods({ level }: SectionProps) {
  const [filter, setFilter] = useState<DifficultyFilter>('All')
  const shown = brewMethods.filter((m) => filter === 'All' || m.difficulty === filter)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="ca-kicker">Brew Methods</p>
      <h2 className="mt-2 max-w-2xl font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
        Pick your brewer
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">{intro[level]}</p>

      {/* Difficulty filter */}
      <div className="mt-8 inline-flex rounded-full border border-line bg-paper p-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f ? 'text-cream' : 'text-soft hover:text-ink',
            ].join(' ')}
          >
            {filter === f && (
              <motion.span
                layoutId="brew-filter"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{f}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m, i) => (
          <MethodCard key={m.id} method={m} index={i} />
        ))}
      </div>
    </div>
  )
}
