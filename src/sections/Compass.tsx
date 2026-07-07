import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Coffee, Compass, FlaskConical, MapPin, RefreshCcw } from 'lucide-react'
import { brewMethods, origins, processingMethods } from '../data'
import type { BrewMethod, Origin, ProcessingMethod } from '../data/types'
import type { SectionProps } from './registry'

const intro: Record<SectionProps['level'], string> = {
  drinker: 'Four quick questions, no jargon — get an origin, a process and a brewer to try.',
  curious: 'Answer four questions and we match your taste against every profile in the atlas.',
  brewer: 'Dial in a target profile in four taps; we run it against the full data set.',
}

// The taste profile the quiz builds up. Values live on the same 0–100 scale as
// the data pack; adventure is 0 (classic) → 2 (experimental).
interface Targets {
  acidity: number
  fruitiness: number
  body: number
  clarity: number
  adventure: number
}

const defaultTargets: Targets = { acidity: 65, fruitiness: 60, body: 60, clarity: 65, adventure: 1 }

interface Option {
  label: string
  caption?: string
  targets: Partial<Targets>
}

interface Question {
  id: string
  prompt: string
  options: Option[]
}

const questions: Question[] = [
  {
    id: 'acidity',
    prompt: 'How do you feel about acidity?',
    options: [
      { label: 'Love it', caption: 'Bright, juicy, mouth-watering', targets: { acidity: 90 } },
      { label: 'Neutral', caption: 'A little brightness is fine', targets: { acidity: 65 } },
      { label: 'Avoid it', caption: 'Smooth and mellow, please', targets: { acidity: 40 } },
    ],
  },
  {
    id: 'flavour',
    prompt: 'Chocolate & nutty, or fruity & floral?',
    options: [
      { label: 'Chocolate & nutty', caption: 'Comforting and rich', targets: { fruitiness: 40 } },
      { label: 'Fruity & floral', caption: 'Expressive and aromatic', targets: { fruitiness: 85 } },
    ],
  },
  {
    id: 'texture',
    prompt: 'Clean and tea-like, or heavy and syrupy?',
    options: [
      { label: 'Clean & tea-like', caption: 'Delicate and transparent', targets: { body: 42, clarity: 88 } },
      { label: 'Heavy & syrupy', caption: 'Weighty and coating', targets: { body: 85, clarity: 40 } },
    ],
  },
  {
    id: 'adventure',
    prompt: 'How adventurous are you?',
    options: [
      { label: 'Classic', caption: 'The proven crowd-pleasers', targets: { adventure: 0 } },
      { label: 'Curious', caption: 'Happy to try something new', targets: { adventure: 1 } },
      { label: 'Experimental', caption: 'Bring on the wild stuff', targets: { adventure: 2 } },
    ],
  },
]

// --- scoring: simple weighted distance, lower is better -------------------

function scoreOrigin(o: Origin, t: Targets): number {
  return (
    2 * Math.abs(o.profile.acidity - t.acidity) +
    1.5 * Math.abs(o.profile.fruitiness - t.fruitiness) +
    Math.abs(o.profile.body - t.body)
  )
}

function scoreProcessing(m: ProcessingMethod, t: Targets): number {
  // Adventure maps onto the clean→fruit-forward order axis of the methods.
  const preferredOrder = [0.5, 2, 3.5][t.adventure] ?? 2
  return (
    1.5 * Math.abs(m.profile.acidity - t.acidity) +
    1.5 * Math.abs(m.profile.fruitiness - t.fruitiness) +
    Math.abs(m.profile.body - t.body) +
    Math.abs(m.profile.clarity - t.clarity) +
    14 * Math.abs(m.order - preferredOrder)
  )
}

function scoreBrew(b: BrewMethod, t: Targets): number {
  const difficultyPenalty =
    b.difficulty === 'Hard' && t.adventure < 2 ? 30 : b.difficulty === 'Medium' && t.adventure === 0 ? 8 : 0
  return (
    1.5 * Math.abs(b.body - t.body) + 1.5 * Math.abs(b.clarity - t.clarity) + difficultyPenalty
  )
}

function best<T>(items: T[], score: (item: T) => number): T {
  return items.reduce((a, b) => (score(b) < score(a) ? b : a))
}

// ---------------------------------------------------------------------------

interface ResultCardProps {
  icon: typeof MapPin
  kicker: string
  title: string
  subtitle?: string
  why: string
  delay: number
}

function ResultCard({ icon: Icon, kicker, title, subtitle, why, delay }: ResultCardProps) {
  return (
    <motion.div
      className="ca-card flex flex-col gap-3 p-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="ca-kicker flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        {kicker}
      </p>
      <div>
        <h3 className="font-serif text-2xl font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-sm text-soft">{subtitle}</p>}
      </div>
      <p className="text-sm leading-relaxed text-soft">{why}</p>
    </motion.div>
  )
}

export function CoffeeCompass({ level }: SectionProps) {
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState<Partial<Targets>[]>([])
  const done = step >= questions.length

  const targets = useMemo<Targets>(
    () => picks.reduce<Targets>((acc, p) => ({ ...acc, ...p }), { ...defaultTargets }),
    [picks],
  )

  const results = useMemo(() => {
    if (!done) return null
    return {
      origin: best(origins, (o) => scoreOrigin(o, targets)),
      processing: best(processingMethods, (m) => scoreProcessing(m, targets)),
      brew: best(brewMethods, (b) => scoreBrew(b, targets)),
    }
  }, [done, targets])

  const choose = (option: Option) => {
    setPicks((prev) => [...prev, option.targets])
    setStep((s) => s + 1)
  }

  const retake = () => {
    setPicks([])
    setStep(0)
  }

  const question = questions[Math.min(step, questions.length - 1)]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="ca-kicker">Coffee Compass</p>
      <h2 className="mt-2 max-w-2xl font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
        Find your cup
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">{intro[level]}</p>

      <div className="mx-auto mt-10 max-w-2xl">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="text-sm tabular-nums text-faint">
                  {step + 1} / {questions.length}
                </span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-500 ease-out"
                    style={{ width: `${(step / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                {question.prompt}
              </h3>

              <div className="mt-6 flex flex-col gap-3">
                {question.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => choose(opt)}
                    className="ca-card group flex items-center gap-4 px-5 py-4 text-left transition-colors hover:border-accent/50"
                  >
                    <span className="min-w-0">
                      <span className="block font-serif text-lg font-semibold text-ink">
                        {opt.label}
                      </span>
                      {opt.caption && (
                        <span className="block text-sm text-soft">{opt.caption}</span>
                      )}
                    </span>
                    <span className="ml-auto text-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            results && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-accent" strokeWidth={1.75} />
                  <h3 className="font-serif text-2xl font-semibold text-ink">Your matches</h3>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <ResultCard
                    icon={MapPin}
                    kicker="Your origin"
                    title={results.origin.country}
                    subtitle={results.origin.region}
                    why={`The closest flavour profile to your answers — expect ${results.origin.tastingNotes
                      .slice(0, 3)
                      .join(', ')}.`}
                    delay={0.1}
                  />
                  <ResultCard
                    icon={FlaskConical}
                    kicker="Your process"
                    title={results.processing.name}
                    why={results.processing.oneLiner}
                    delay={0.22}
                  />
                  <ResultCard
                    icon={Coffee}
                    kicker="Your brewer"
                    title={results.brew.name}
                    subtitle={`${results.brew.difficulty} · ${results.brew.brewTimeMin} min`}
                    why={`Matches the body and clarity you asked for — ${results.brew.notes.join(', ')}.`}
                    delay={0.34}
                  />
                </div>

                <div className="mt-7 text-center">
                  <button
                    type="button"
                    onClick={retake}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-soft transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <RefreshCcw className="h-4 w-4" strokeWidth={1.75} />
                    Retake the quiz
                  </button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
