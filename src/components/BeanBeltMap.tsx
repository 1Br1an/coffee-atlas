import { useEffect, useMemo, useRef, useState } from 'react'
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from 'd3-geo'
import { feature } from 'topojson-client'
import { motion } from 'framer-motion'
import worldData from 'world-atlas/countries-110m.json'
import type { Origin } from '../data/types'

const SIZE = 520
// The Bean Belt: the tropical band where all specialty coffee grows.
const BELT_LAT = 25
// Degrees per second of idle auto-rotation — slow enough to read as alive.
const AUTO_SPIN_DEG_PER_SEC = 3.2
// How long after the user lets go before the globe starts spinning again.
const IDLE_RESUME_MS = 3500

interface BeanBeltMapProps {
  origins: Origin[]
  selectedId: string | null
  onSelect: (id: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countries = feature(worldData as any, (worldData as any).objects.countries)
const countryFeatures = (countries as unknown as { features: unknown[] }).features

// Build the belt as a real polygon so it wraps the sphere at the equator.
const beltRing: [number, number][] = []
for (let lng = -180; lng <= 180; lng += 4) beltRing.push([lng, BELT_LAT])
for (let lng = 180; lng >= -180; lng -= 4) beltRing.push([lng, -BELT_LAT])
beltRing.push([-180, BELT_LAT])
const beltPolygon = { type: 'Polygon', coordinates: [beltRing] } as never
const sphere = { type: 'Sphere' } as never
const graticule = geoGraticule10()

export function BeanBeltMap({ origins, selectedId, onSelect }: BeanBeltMapProps) {
  // [lambda, phi] — start framed on the Atlantic so pins on three continents peek out.
  const [rotation, setRotation] = useState<[number, number]>([25, -8])
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)
  const movedRef = useRef(false)
  const idleUntilRef = useRef(0)
  const inViewRef = useRef(true)

  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // One projection instance; rotation is applied each render.
  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(SIZE / 2 - 12)
        .translate([SIZE / 2, SIZE / 2])
        .clipAngle(90),
    [],
  )
  projection.rotate([rotation[0], rotation[1]])
  const pathGen = geoPath(projection)

  // Only spin while the globe is actually on screen.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Idle auto-rotation. Purely decorative, so pausing (hidden tab, reduced
  // motion) is harmless — the globe still renders and drags fine without it.
  useEffect(() => {
    if (reduceMotion) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (inViewRef.current && !dragRef.current && now > idleUntilRef.current) {
        setRotation(([l, p]) => [l + (dt / 1000) * AUTO_SPIN_DEG_PER_SEC, p])
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  // Drag-to-spin. Listeners live on window so a drag that leaves the globe
  // keeps working; no pointer capture, so pin taps still land on the pins.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) > 5) {
        movedRef.current = true
      }
      dragRef.current = { ...d, x: e.clientX, y: e.clientY }
      setRotation(([l, p]) => [
        l + dx * 0.28,
        Math.max(-65, Math.min(65, p - dy * 0.28)),
      ])
    }
    const onUp = () => {
      if (!dragRef.current) return
      dragRef.current = null
      idleUntilRef.current = performance.now() + IDLE_RESUME_MS
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  // Pins: project to screen space and hide the ones on the far hemisphere.
  const viewCenter: [number, number] = [-rotation[0], -rotation[1]]
  const pins = origins
    .map((o) => {
      const facing = geoDistance([o.lng, o.lat], viewCenter) < Math.PI / 2 - 0.06
      const p = projection([o.lng, o.lat])
      if (!facing || !p) return null
      return { origin: o, xPct: (p[0] / SIZE) * 100, yPct: (p[1] / SIZE) * 100 }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div
        ref={wrapRef}
        className="relative aspect-square w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          dragRef.current = {
            x: e.clientX,
            y: e.clientY,
            startX: e.clientX,
            startY: e.clientY,
          }
          movedRef.current = false
        }}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Interactive globe highlighting the Bean Belt between 25°N and 25°S. Drag to rotate."
        >
          <defs>
            {/* Soft top-left light so the sphere reads as 3D. */}
            <radialGradient id="globeShade" cx="36%" cy="30%" r="80%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(42,33,27,0.16)" />
            </radialGradient>
          </defs>
          <path d={pathGen(sphere) ?? undefined} className="fill-paper" />
          <path
            d={pathGen(graticule) ?? undefined}
            className="fill-none stroke-line"
            strokeWidth={0.5}
            opacity={0.6}
          />
          {countryFeatures.map((f, i) => (
            <path
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              key={(f as any).id ?? i}
              d={pathGen(f as never) ?? undefined}
              className="fill-sand stroke-line"
              strokeWidth={0.5}
            />
          ))}
          <path d={pathGen(beltPolygon) ?? undefined} className="fill-accent" opacity={0.14} />
          <path
            d={pathGen(beltPolygon) ?? undefined}
            className="fill-none stroke-accent"
            strokeWidth={0.9}
            opacity={0.4}
            strokeDasharray="2 3"
          />
          <path d={pathGen(sphere) ?? undefined} fill="url(#globeShade)" />
          <path
            d={pathGen(sphere) ?? undefined}
            className="fill-none stroke-line"
            strokeWidth={1.2}
          />
        </svg>

        {/* HTML pin overlay — guarantees ≥44px tap targets on mobile. */}
        <div className="absolute inset-0">
          {pins.map(({ origin, xPct, yPct }) => {
            const active = origin.id === selectedId
            return (
              <button
                key={origin.id}
                type="button"
                onClick={() => {
                  // A drag that started on a pin shouldn't count as a tap.
                  if (!movedRef.current) onSelect(origin.id)
                }}
                aria-label={`${origin.country} — ${origin.region}`}
                aria-pressed={active}
                className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus:outline-none"
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
              >
                {active && (
                  <motion.span
                    className="absolute h-6 w-6 rounded-full bg-accent/30"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <span
                  className={[
                    'relative block rounded-full ring-2 ring-paper transition-all duration-200',
                    active
                      ? 'h-4 w-4 bg-accent shadow-[0_2px_8px_rgba(162,72,42,0.5)]'
                      : 'h-3 w-3 bg-berry group-hover:h-3.5 group-hover:w-3.5 group-hover:bg-accent',
                  ].join(' ')}
                />
                <span
                  className={[
                    'pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/90 px-2 py-0.5 text-[11px] font-medium text-cream transition-opacity duration-200',
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                >
                  {origin.country}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
