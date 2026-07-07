import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface LoaderProps {
  onDone: () => void
}

/**
 * First note of the app's motion language: a line-art V60 with coffee filling
 * the carafe, wordmark alongside. Pure SVG + Framer Motion. ~1.5s, then it
 * fades and scales away into the onboarding card.
 */
export function Loader({ onDone }: LoaderProps) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(onDone, reduce ? 300 : 1650)
    return () => clearTimeout(t)
  }, [onDone, reduce])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-cream px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
    >
      <svg viewBox="0 0 160 150" className="w-40 max-w-[45vw]" aria-hidden="true">
        <defs>
          <clipPath id="carafe-clip">
            <path d="M44 96 h72 l-9 34 a10 10 0 0 1 -10 8 h-34 a10 10 0 0 1 -10 -8 z" />
          </clipPath>
        </defs>

        {/* coffee rising in the carafe */}
        <g clipPath="url(#carafe-clip)">
          <motion.rect
            x="40"
            width="80"
            initial={{ y: 142, height: 0 }}
            animate={reduce ? { y: 104, height: 44 } : { y: 104, height: 44 }}
            transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fill-accent"
          />
        </g>

        {/* V60 cone */}
        <motion.path
          d="M34 30 h92 l-38 52 h-16 z"
          fill="none"
          className="stroke-ink"
          strokeWidth={3}
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        {/* cone ribs */}
        <motion.path
          d="M52 30 l24 52 M80 30 v52 M108 30 l-24 52"
          fill="none"
          className="stroke-line"
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
        {/* drip */}
        <motion.line
          x1="80"
          y1="84"
          x2="80"
          y2="96"
          className="stroke-accent"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 1] }}
          transition={{ delay: 0.9, duration: 0.8, ease: 'easeInOut' }}
        />
        {/* carafe outline */}
        <motion.path
          d="M44 96 h72 l-9 34 a10 10 0 0 1 -10 8 h-34 a10 10 0 0 1 -10 -8 z"
          fill="none"
          className="stroke-ink"
          strokeWidth={3}
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeInOut' }}
        />
      </svg>

      <motion.p
        className="mt-6 font-serif text-2xl font-semibold tracking-tight text-ink"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Coffee Atlas
      </motion.p>
    </motion.div>
  )
}
