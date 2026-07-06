import type { Origin } from './types'

export const origins: Origin[] = [
  {
    id: 'ethiopia',
    country: 'Ethiopia',
    region: 'Yirgacheffe & Guji',
    lat: 6.16,
    lng: 38.2,
    elevationM: [1500, 2200],
    harvest: 'October – January',
    varieties: ['Indigenous Heirloom / Landrace', 'Kurume', '74110 & 74112 selections'],
    processing: ['Washed', 'Natural'],
    profile: { acidity: 88, sweetness: 70, body: 45, fruitiness: 80 },
    tastingNotes: ['jasmine', 'bergamot', 'lemon', 'blueberry (natural)', 'black tea'],
    blurb:
      'The birthplace of Arabica. Thousands of undocumented native varieties plus very high altitude give famously floral, tea-like, high-clarity cups; washing keeps them delicate and citrusy, while natural processing pushes them toward ripe berry.',
    funFact:
      "Ethiopian coffee is rarely a single named variety — it's grown as a genetic mix of local 'heirloom' plants, which is a big part of why it tastes so complex.",
  },
  {
    id: 'kenya',
    country: 'Kenya',
    region: 'Nyeri & Kirinyaga',
    lat: -0.42,
    lng: 37.08,
    elevationM: [1400, 2000],
    harvest: 'October – December (main crop)',
    varieties: ['SL28', 'SL34', 'Ruiru 11', 'Batian'],
    processing: ['Washed (double-washed / Kenyan)'],
    profile: { acidity: 92, sweetness: 68, body: 55, fruitiness: 72 },
    tastingNotes: ['blackcurrant', 'grapefruit', 'tomato', 'cane sugar'],
    blurb:
      "Volcanic soil, the acid-forward SL28/SL34 varieties bred by Scott Laboratories, and a meticulous double-wash produce Kenya's signature juicy, blackcurrant-like brightness — arguably the most intense acidity in coffee.",
    funFact:
      "The 'SL' in SL28 stands for Scott Laboratories, the Nairobi lab that selected the variety in the 1930s for drought tolerance and cup quality.",
  },
  {
    id: 'colombia',
    country: 'Colombia',
    region: 'Huila & Nariño',
    lat: 2.54,
    lng: -75.88,
    elevationM: [1200, 2000],
    harvest: 'Two crops: main Oct–Feb, mitaca Apr–Jun',
    varieties: ['Caturra', 'Castillo', 'Colombia', 'Typica', 'Bourbon'],
    processing: ['Washed'],
    profile: { acidity: 72, sweetness: 75, body: 60, fruitiness: 62 },
    tastingNotes: ['caramel', 'red apple', 'citrus', 'brown sugar'],
    blurb:
      'Diverse microclimates and two harvest seasons make Colombia the great all-rounder: balanced, sweet, clean and approachable — the coffee most people first fall for.',
    funFact:
      "Colombia's mountains let it harvest year-round overall, which is why Colombian coffee is so consistently available worldwide.",
  },
  {
    id: 'brazil',
    country: 'Brazil',
    region: 'Cerrado & Sul de Minas',
    lat: -18.1,
    lng: -47.6,
    elevationM: [800, 1350],
    harvest: 'May – September',
    varieties: ['Yellow Bourbon', 'Mundo Novo', 'Catuaí', 'Bourbon'],
    processing: ['Natural', 'Pulped Natural'],
    profile: { acidity: 40, sweetness: 78, body: 82, fruitiness: 45 },
    tastingNotes: ['milk chocolate', 'peanut', 'hazelnut', 'caramel'],
    blurb:
      "Grown at lower elevation and usually natural-processed, Brazilian coffee is nutty, chocolatey, low-acid and heavy-bodied — which is exactly why it's the backbone of most espresso blends.",
    funFact:
      'Brazil produces roughly a third of all the world’s coffee — more than the next several countries combined.',
  },
  {
    id: 'guatemala',
    country: 'Guatemala',
    region: 'Antigua & Huehuetenango',
    lat: 14.56,
    lng: -90.73,
    elevationM: [1300, 2000],
    harvest: 'December – March',
    varieties: ['Bourbon', 'Caturra', 'Catuaí', 'Typica'],
    processing: ['Washed'],
    profile: { acidity: 70, sweetness: 74, body: 66, fruitiness: 55 },
    tastingNotes: ['cocoa', 'baking spice', 'orange', 'toffee'],
    blurb:
      'Volcanic Antigua soil and cool highland nights give Guatemalan coffee a rich, chocolate-and-spice character with enough acidity to stay lively — structured and complex.',
    funFact:
      'Antigua sits in a valley ringed by three volcanoes; the mineral-rich volcanic soil and ash are a big part of the region’s reputation.',
  },
  {
    id: 'costa-rica',
    country: 'Costa Rica',
    region: 'Tarrazú',
    lat: 9.66,
    lng: -84.02,
    elevationM: [1200, 1900],
    harvest: 'November – March',
    varieties: ['Caturra', 'Catuaí', 'Villa Sarchí', 'Geisha'],
    processing: ['Honey', 'Washed'],
    profile: { acidity: 78, sweetness: 80, body: 58, fruitiness: 60 },
    tastingNotes: ['honey', 'stone fruit', 'citrus', 'brown sugar'],
    blurb:
      'Costa Rica pioneered and popularised honey processing (leaving fruit mucilage on the bean during drying), giving clean but noticeably sweeter, syrupy cups — a national style, not just a method.',
    funFact:
      'Costa Rica once legally banned lower-quality Robusta cultivation to protect its specialty Arabica reputation.',
  },
  {
    id: 'panama',
    country: 'Panama',
    region: 'Boquete (Chiriquí)',
    lat: 8.78,
    lng: -82.43,
    elevationM: [1400, 1800],
    harvest: 'December – March',
    varieties: ['Geisha (Gesha)', 'Caturra', 'Catuaí'],
    processing: ['Washed', 'Natural'],
    profile: { acidity: 85, sweetness: 82, body: 48, fruitiness: 88 },
    tastingNotes: ['jasmine', 'bergamot', 'tropical fruit', 'peach'],
    blurb:
      'Home of the modern Geisha phenomenon: an Ethiopian-origin variety that, grown high in Boquete, produces astonishingly floral, tea-like, tropical cups — and record-breaking auction prices.',
    funFact:
      'Panamanian Geisha has repeatedly sold for over US$1,000 per pound at auction, making it some of the most expensive coffee on earth.',
  },
  {
    id: 'indonesia',
    country: 'Indonesia',
    region: 'Sumatra (Aceh & Lintong)',
    lat: 3.5,
    lng: 97.8,
    elevationM: [900, 1500],
    harvest: 'October – December (varies by island)',
    varieties: ['Typica', 'Ateng', 'Tim Tim', 'Catimor'],
    processing: ['Wet-hulled (Giling Basah)'],
    profile: { acidity: 35, sweetness: 65, body: 90, fruitiness: 40 },
    tastingNotes: ['cedar', 'tobacco', 'dark chocolate', 'earth', 'herbal'],
    blurb:
      "Sumatra's unique wet-hulled 'giling basah' process — hulling the bean while still wet — creates an unmistakable earthy, herbal, syrupy-bodied, very low-acid cup that people either chase or avoid.",
    funFact:
      "Wet-hulling gives the green beans a distinctive blue-green colour and is a direct response to Sumatra's humid climate, where fully drying beans slowly is impractical.",
  },
]
