import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Globe2, FlaskConical, Timer, Compass, Coffee } from 'lucide-react'
import type { Level } from '../data/types'
import { Origins } from './Origins'
import { Processing } from './Processing'
import { PourOver } from './PourOver'
import { CoffeeCompass } from './Compass'
import { BrewMethods } from './BrewMethods'

// Every section receives the persona level and nothing else; each pulls the
// data slice it needs from '../data' and renders it through shared components.
export interface SectionProps {
  level: Level
}

export interface SectionDef {
  id: string
  label: string
  tagline: string
  icon: LucideIcon
  Component: ComponentType<SectionProps>
}

// The spine. Adding, removing or reordering a section is a one-line change.
export const sections: SectionDef[] = [
  { id: 'origins', label: 'Origins', tagline: 'Where it grows', icon: Globe2, Component: Origins },
  { id: 'processing', label: 'Processing', tagline: 'How it dries', icon: FlaskConical, Component: Processing },
  { id: 'pour-over', label: 'Pour Over', tagline: 'How it brews', icon: Timer, Component: PourOver },
  { id: 'compass', label: 'Compass', tagline: 'Find your cup', icon: Compass, Component: CoffeeCompass },
  { id: 'brew-methods', label: 'Brew Methods', tagline: 'Pick your brewer', icon: Coffee, Component: BrewMethods },
]

// Default reading order per persona — copy depth is handled inside each section.
export const sectionOrder: Record<Level, string[]> = {
  drinker: ['origins', 'compass', 'brew-methods', 'pour-over', 'processing'],
  curious: ['origins', 'processing', 'brew-methods', 'pour-over', 'compass'],
  brewer: ['pour-over', 'brew-methods', 'processing', 'origins', 'compass'],
}

export function orderedSections(level: Level): SectionDef[] {
  const order = sectionOrder[level]
  const byId = new Map(sections.map((s) => [s.id, s]))
  const ordered = order.map((id) => byId.get(id)).filter((s): s is SectionDef => Boolean(s))
  // Any section missing from the order still gets appended — safe extensibility.
  const extra = sections.filter((s) => !order.includes(s.id))
  return [...ordered, ...extra]
}
