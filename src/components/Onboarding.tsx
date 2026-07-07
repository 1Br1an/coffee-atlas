import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Level } from '../data/types'

interface Choice {
  level: Level
  emoji: string
  title: string
  caption: string
}

// Presentational copy only — no coffee facts asserted here.
const choices: Choice[] = [
  { level: 'drinker', emoji: '☕', title: 'I just drink coffee', caption: 'Show me the essentials, kept simple.' },
  { level: 'curious', emoji: '🌱', title: "I'm curious about specialty", caption: 'Walk me through what makes it special.' },
  { level: 'brewer', emoji: '🫖', title: 'I already brew pour-over', caption: 'Get me to the recipes and the detail.' },
]

interface OnboardingProps {
  onChoose: (level: Level) => void
}

export function Onboarding({ onChoose }: OnboardingProps) {
  // Cursor-reactive drift for the accent shapes (inert on touch — no mousemove).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 55, damping: 18 })
  const sy = useSpring(py, { stiffness: 55, damping: 18 })
  const blobAX = useTransform(sx, (v) => v * -0.03)
  const blobAY = useTransform(sy, (v) => v * -0.03)
  const blobBX = useTransform(sx, (v) => v * 0.05)
  const blobBY = useTransform(sy, (v) => v * 0.05)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-cream px-5 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      onMouseMove={(e) => {
        px.set(e.clientX - window.innerWidth / 2)
        py.set(e.clientY - window.innerHeight / 2)
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{ x: blobAX, y: blobAY }}
        className="pointer-events-none absolute left-[12%] top-[18%] h-56 w-56 rounded-full bg-accent/15 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: blobBX, y: blobBY }}
        className="pointer-events-none absolute bottom-[12%] right-[10%] h-64 w-64 rounded-full bg-amber/15 blur-3xl"
      />
      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="ca-kicker text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          Coffee Atlas
        </motion.p>
        <motion.h1
          className="mt-3 text-center font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          What kind of coffee
          <br className="hidden sm:block" /> drinker are you?
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-md text-center text-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
        >
          Pick one and we'll set the pace. You can change it any time.
        </motion.p>

        <div className="mt-9 flex flex-col gap-3 sm:mt-11">
          {choices.map((c, i) => (
            <motion.button
              key={c.level}
              type="button"
              onClick={() => onChoose(c.level)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className="ca-card group flex items-center gap-4 px-5 py-4 text-left transition-colors hover:border-accent/50"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sand text-2xl transition-colors group-hover:bg-accent-soft">
                {c.emoji}
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-lg font-semibold text-ink">{c.title}</span>
                <span className="block text-sm text-soft">{c.caption}</span>
              </span>
              <span className="ml-auto text-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent">
                →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
