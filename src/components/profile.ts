import type { AttributeDatum } from './AttributeBars'
import type { FlavorProfile } from '../data/types'

// Presentational colour mapping for flavour attributes — reused by every
// section so the same attribute always reads in the same hue.
const COLORS = {
  acidity: 'var(--color-amber)',
  sweetness: 'var(--color-accent)',
  body: '#6f4a34',
  fruitiness: 'var(--color-berry)',
  clarity: '#6f9ea0',
}

export function profileBars(p: FlavorProfile): AttributeDatum[] {
  return [
    { label: 'Acidity', value: p.acidity, color: COLORS.acidity },
    { label: 'Sweetness', value: p.sweetness, color: COLORS.sweetness },
    { label: 'Body', value: p.body, color: COLORS.body },
    { label: 'Fruitiness', value: p.fruitiness, color: COLORS.fruitiness },
  ]
}

export function processingBars(p: FlavorProfile & { clarity: number }): AttributeDatum[] {
  return [{ label: 'Clarity', value: p.clarity, color: COLORS.clarity }, ...profileBars(p)]
}
