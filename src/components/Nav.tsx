import { motion } from 'framer-motion'
import { Coffee, Repeat } from 'lucide-react'
import type { SectionDef } from '../sections/registry'

interface NavProps {
  sections: SectionDef[]
  activeId: string
  onNavigate: (id: string) => void
  onChangeLevel: () => void
}

export function Nav({ sections, activeId, onNavigate, onChangeLevel }: NavProps) {
  return (
    <>
      {/* Top bar — brand + (desktop) section pills + change level. */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate(sections[0]?.id)}
            className="flex shrink-0 items-center gap-2 font-serif text-lg font-semibold text-ink"
          >
            <Coffee className="h-5 w-5 text-accent" strokeWidth={1.75} />
            <span>Coffee Atlas</span>
          </button>

          {/* Desktop pills only — mobile uses the bottom bar below. */}
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {sections.map((s) => {
              const active = s.id === activeId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onNavigate(s.id)}
                  className={[
                    'relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                    active ? 'text-cream' : 'text-soft hover:text-ink',
                  ].join(' ')}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <s.icon className="h-4 w-4" strokeWidth={1.75} />
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={onChangeLevel}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-soft transition-colors hover:border-accent/50 hover:text-accent md:ml-0"
            title="Change your reading level"
          >
            <Repeat className="h-4 w-4" strokeWidth={1.75} />
            <span className="hidden lg:inline">Change level</span>
          </button>
        </nav>
      </header>

      {/* Mobile bottom tab bar. */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {sections.map((s) => {
            const active = s.id === activeId
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate(s.id)}
                aria-label={s.label}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                  active ? 'text-accent' : 'text-faint',
                ].join(' ')}
              >
                <s.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                <span className="text-[10px] font-medium leading-none">{s.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
