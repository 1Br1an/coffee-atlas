// ---------------------------------------------------------------------------
// Type definitions for the Coffee Atlas data pack.
// Components receive these shapes as props and render them generically — no
// country names, ratios or tasting notes are ever hardcoded in a component.
// ---------------------------------------------------------------------------

export interface FlavorProfile {
  acidity: number
  sweetness: number
  body: number
  fruitiness: number
}

export interface Origin {
  id: string
  country: string
  region: string
  lat: number
  lng: number
  elevationM: [number, number]
  harvest: string
  varieties: string[]
  processing: string[]
  profile: FlavorProfile
  tastingNotes: string[]
  blurb: string
  funFact: string
}

export interface ProcessingMethod {
  id: string
  name: string
  order: number
  oneLiner: string
  profile: FlavorProfile & { clarity: number }
  tastingNotes: string[]
  detail: string
}

export interface PourEvent {
  start: number
  end: number
  targetWeight: number
  pourWeight: number
  label: string
  purpose: string
}

export interface Recipe {
  id: string
  brewer: string
  name: string
  accolade: string
  method: string
  coffeeG: number
  waterG: number
  ratio: string
  grind: string
  tempC: string
  totalTimeSec: number
  bigIdea: string
  cupProfile: string
  pours: PourEvent[]
}

export interface BrewMethod {
  id: string
  name: string
  body: number
  clarity: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  brewTimeMin: string
  grindSize: string
  roastRec: string
  notes: string[]
}

// The persona chosen at onboarding. Drives copy depth + default section order.
export type Level = 'drinker' | 'curious' | 'brewer'
