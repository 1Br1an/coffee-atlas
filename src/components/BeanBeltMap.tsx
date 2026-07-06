import { useMemo } from 'react'
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import { motion } from 'framer-motion'
import worldData from 'world-atlas/countries-110m.json'
import type { Origin } from '../data/types'

const WIDTH = 960
const HEIGHT = 480
// The Bean Belt: the tropical band where all specialty coffee grows.
const BELT_LAT = 25

interface BeanBeltMapProps {
  origins: Origin[]
  selectedId: string | null
  onSelect: (id: string) => void
}

// One shared projection for both the SVG geometry and the HTML pin overlay,
// so pins land exactly on their coordinates at any screen size.
const projection = geoNaturalEarth1().fitExtent(
  [
    [8, 8],
    [WIDTH - 8, HEIGHT - 8],
  ],
  { type: 'Sphere' },
)
const pathGen = geoPath(projection)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countries = feature(worldData as any, (worldData as any).objects.countries)
const countryFeatures = (countries as unknown as { features: unknown[] }).features

// Build the belt as a real polygon so it curves with the projection.
const beltRing: [number, number][] = []
for (let lng = -180; lng <= 180; lng += 4) beltRing.push([lng, BELT_LAT])
for (let lng = 180; lng >= -180; lng -= 4) beltRing.push([lng, -BELT_LAT])
beltRing.push([-180, BELT_LAT])
const beltPath =
  pathGen({ type: 'Polygon', coordinates: [beltRing] } as never) ?? undefined
const spherePath = pathGen({ type: 'Sphere' } as never) ?? undefined
const graticulePath = pathGen(geoGraticule10()) ?? undefined

export function BeanBeltMap({ origins, selectedId, onSelect }: BeanBeltMapProps) {
  const pins = useMemo(
    () =>
      origins
        .map((o) => {
          const p = projection([o.lng, o.lat])
          if (!p) return null
          return { origin: o, xPct: (p[0] / WIDTH) * 100, yPct: (p[1] / HEIGHT) * 100 }
        })
        .filter((p): p is NonNullable<typeof p> => p !== null),
    [origins],
  )

  return (
    <div className="relative w-full">
      <div className="relative aspect-[2/1] w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="World map highlighting the Bean Belt between 25°N and 25°S"
        >
          <path d={spherePath} className="fill-paper" />
          <path
            d={graticulePath}
            className="fill-none stroke-line"
            strokeWidth={0.4}
            opacity={0.7}
          />
          {countryFeatures.map((f, i) => (
            <path
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              key={(f as any).id ?? i}
              d={pathGen(f as never) ?? undefined}
              className="fill-sand stroke-line"
              strokeWidth={0.4}
            />
          ))}
          <path d={beltPath} className="fill-accent" opacity={0.14} />
          <path
            d={beltPath}
            className="fill-none stroke-accent"
            strokeWidth={0.8}
            opacity={0.4}
            strokeDasharray="2 3"
          />
        </svg>

        {/* HTML pin overlay — guarantees ≥44px tap targets on mobile. */}
        <div className="absolute inset-0">
          {pins.map(({ origin, xPct, yPct }, i) => {
            const active = origin.id === selectedId
            return (
              <button
                key={origin.id}
                type="button"
                onClick={() => onSelect(origin.id)}
                aria-label={`${origin.country} — ${origin.region}`}
                aria-pressed={active}
                className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus:outline-none"
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
              >
                {active && (
                  <motion.span
                    layoutId="pin-halo"
                    className="absolute h-6 w-6 rounded-full bg-accent/30"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.05,
                    type: 'spring',
                    stiffness: 400,
                    damping: 24,
                  }}
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
