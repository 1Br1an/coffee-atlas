import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Globe2, FlaskConical, Timer } from 'lucide-react'
import type { Level } from '../data/types'
import { Origins } from './Origins'
import { Processing } from './Processing'
import { PourOver } from './PourOver'

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
]

// Default reading order per persona — copy depth is handled inside each section.
export const sectionOrder: Record<Level, string[]> = {
  drinker: ['origins', 'pour-over', 'processing'],
  curious: ['origins', 'processing', 'pour-over'],
  brewer: ['pour-over', 'processing', 'origins'],
}

export function orderedSections(level: Level): SectionDef[] {
  const order = sectionOrder[level]
  const byId = new Map(sections.map((s) => [s.id, s]))
  const ordered = order.map((id) => byId.get(id)).filter((s): s is SectionDef => Boolean(s))
  // Any section missing from the order still gets appended — safe extensibility.
  const extra = sections.filter((s) => !order.includes(s.id))
  return [...ordered, ...extra]
}
