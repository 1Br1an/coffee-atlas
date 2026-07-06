import type { ProcessingMethod } from './types'

export const processingMethods: ProcessingMethod[] = [
  {
    id: 'washed',
    name: 'Washed',
    order: 0,
    oneLiner:
      "All fruit is stripped off before the bean is dried, so only the seed's own flavour remains.",
    profile: { acidity: 85, sweetness: 50, body: 40, fruitiness: 30, clarity: 95 },
    tastingNotes: ['clean', 'bright', 'floral', 'citrus'],
    detail:
      'The cherry’s skin and sticky mucilage are removed and the beans are fermented and washed before drying. This is the most transparent method — it lets the origin, variety and altitude speak, which is why competition coffees prizing clarity are often washed.',
  },
  {
    id: 'honey',
    name: 'Honey',
    order: 1,
    oneLiner:
      'The skin comes off but some sweet fruit mucilage is left on the bean during drying.',
    profile: { acidity: 65, sweetness: 78, body: 62, fruitiness: 55, clarity: 70 },
    tastingNotes: ['syrupy', 'honey', 'stone fruit', 'rounded'],
    detail:
      'A middle path: leaving mucilage on adds sweetness and body while keeping some clarity. The amount left (and drying speed) creates white, yellow, red and black honey styles — darker names mean more mucilage and more intensity.',
  },
  {
    id: 'natural',
    name: 'Natural',
    order: 2,
    oneLiner:
      'The whole cherry is dried intact, so sugars from the fruit soak into the bean.',
    profile: { acidity: 48, sweetness: 82, body: 82, fruitiness: 88, clarity: 45 },
    tastingNotes: ['berry', 'wine', 'heavy body', 'jammy'],
    detail:
      "The oldest method and, done well, the fruitiest. Drying the bean inside the fruit pushes big berry and wine notes and a heavy body, at the cost of some cleanliness — the coffee tastes noticeably 'of the fruit' rather than just the seed.",
  },
  {
    id: 'anaerobic',
    name: 'Anaerobic',
    order: 3,
    oneLiner:
      'Cherries ferment in sealed, oxygen-free tanks, steering flavour with controlled fermentation.',
    profile: { acidity: 55, sweetness: 72, body: 75, fruitiness: 90, clarity: 40 },
    tastingNotes: ['boozy', 'cinnamon', 'tropical', 'funky'],
    detail:
      'By locking cherries in oxygen-free tanks, producers control which microbes drive fermentation, generating intense, sometimes wild flavours — think rum, spice and overripe tropical fruit. A modern, experimental, polarising style.',
  },
  {
    id: 'carbonic-maceration',
    name: 'Carbonic Maceration',
    order: 4,
    oneLiner:
      'A winemaking technique: whole cherries ferment under CO₂ pressure for extreme fruit intensity.',
    profile: { acidity: 60, sweetness: 80, body: 70, fruitiness: 95, clarity: 42 },
    tastingNotes: ['wine gum', 'candied fruit', 'syrupy', 'intense'],
    detail:
      'Borrowed from Beaujolais winemaking, whole cherries are sealed under carbon-dioxide pressure so fermentation happens inside each fruit. The result is some of the most exaggerated, candy-like fruit flavour in coffee — a showpiece process.',
  },
]
