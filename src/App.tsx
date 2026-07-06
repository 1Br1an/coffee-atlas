import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Coffee } from 'lucide-react'
import type { Level } from './data/types'
import { Onboarding } from './components/Onboarding'
import { Nav } from './components/Nav'
import { orderedSections } from './sections/registry'

const STORAGE_KEY = 'coffee-atlas-level'

function App() {
  const [level, setLevel] = useState<Level | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'drinker' || saved === 'curious' || saved === 'brewer' ? saved : null
  })
  const [activeId, setActiveId] = useState('')

  const sections = useMemo(() => (level ? orderedSections(level) : []), [level])
  const sectionEls = useRef<Record<string, HTMLElement | null>>({})

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      sectionEls.current[id] = el
    },
    [],
  )

  // Keep the nav in sync with whichever section is centred in the viewport.
  useEffect(() => {
    if (!level) return
    setActiveId(sections[0]?.id ?? '')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    for (const s of sections) {
      const el = sectionEls.current[s.id]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [level, sections])

  const handleChoose = (chosen: Level) => {
    localStorage.setItem(STORAGE_KEY, chosen)
    setLevel(chosen)
    window.scrollTo({ top: 0 })
  }

  const handleNavigate = (id: string) => {
    sectionEls.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleChangeLevel = () => {
    setLevel(null)
    window.scrollTo({ top: 0 })
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* App content renders as soon as a level is set and is visible by
          default — its reveal is CSS, never gated on a JS animation. */}
      {level && (
        <div>
          <Nav
            sections={sections}
            activeId={activeId}
            onNavigate={handleNavigate}
            onChangeLevel={handleChangeLevel}
          />

          <main>
            {sections.map(({ id, Component }, i) => (
              <section
                key={id}
                id={id}
                ref={setSectionRef(id)}
                className="ca-reveal scroll-mt-20 border-b border-line/60 last:border-b-0"
                style={{ animationDelay: `${0.05 + i * 0.08}s` }}
              >
                <Component level={level} />
              </section>
            ))}
          </main>

          <footer className="border-t border-line bg-paper/50">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center">
              <Coffee className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <p className="font-serif text-lg text-ink">Coffee Atlas</p>
              <p className="max-w-md text-sm text-soft">
                An interactive field guide to specialty coffee — origins, processing and the
                pour-over. Explore, don't just read.
              </p>
            </div>
          </footer>
        </div>
      )}

      {/* Onboarding overlays on top and fades out; content already sits behind it. */}
      <AnimatePresence>
        {!level && <Onboarding key="onboarding" onChoose={handleChoose} />}
      </AnimatePresence>
    </MotionConfig>
  )
}

export default App
