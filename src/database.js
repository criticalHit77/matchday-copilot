// Pre-seeded database simulating MongoDB Atlas collections for MatchDay 2026

export const initialMatches = [
  {
    id: "match_01",
    matchNumber: 1,
    teams: "Mexico vs Ecuador",
    date: "2026-06-11",
    time: "17:00 CST",
    venueId: "stadium_cdmx",
    stage: "Group Stage (Opening Match)",
    ticketPrice: 250
  },
  {
    id: "match_02",
    matchNumber: 2,
    teams: "USA vs Bolivia",
    date: "2026-06-12",
    time: "19:00 PST",
    venueId: "stadium_la",
    stage: "Group Stage",
    ticketPrice: 300
  },
  {
    id: "match_03",
    matchNumber: 3,
    teams: "Canada vs Morocco",
    date: "2026-06-12",
    time: "16:00 PST",
    venueId: "stadium_vancouver",
    stage: "Group Stage",
    ticketPrice: 180
  },
  {
    id: "match_15",
    matchNumber: 15,
    teams: "Brazil vs Spain",
    date: "2026-06-15",
    time: "20:00 EST",
    venueId: "stadium_ny_nj",
    stage: "Group Stage",
    ticketPrice: 450
  },
  {
    id: "match_28",
    matchNumber: 28,
    teams: "Argentina vs Belgium",
    date: "2026-06-18",
    time: "18:00 CST",
    venueId: "stadium_dallas",
    stage: "Group Stage",
    ticketPrice: 400
  },
  {
    id: "match_42",
    matchNumber: 42,
    teams: "USA vs Germany",
    date: "2026-06-21",
    time: "19:00 EST",
    venueId: "stadium_miami",
    stage: "Group Stage",
    ticketPrice: 350
  },
  {
    id: "match_64",
    matchNumber: 64,
    teams: "England vs Netherlands",
    date: "2026-06-25",
    time: "17:00 EST",
    venueId: "stadium_ny_nj",
    stage: "Group Stage",
    ticketPrice: 380
  },
  {
    id: "match_88",
    matchNumber: 88,
    teams: "Quarter Final 1",
    date: "2026-07-04",
    time: "15:00 CST",
    venueId: "stadium_dallas",
    stage: "Quarter Final",
    ticketPrice: 600
  },
  {
    id: "match_104",
    matchNumber: 104,
    teams: "World Cup Final",
    date: "2026-07-19",
    time: "16:00 EST",
    venueId: "stadium_ny_nj",
    stage: "World Cup Final",
    ticketPrice: 1200
  }
];

export const initialVenues = [
  {
    id: "stadium_cdmx",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87523,
    transitStatus: "Moderate Congestion",
    transitLines: ["Metro Line 2", "Tren Ligero"],
    fanZoneName: "Zócalo Fan Festival",
    coordinates: { x: 50, y: 85 } // Relative percentages on our map UI
  },
  {
    id: "stadium_la",
    name: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    capacity: 70240,
    transitStatus: "Heavy Congestion",
    transitLines: ["Metro K Line", "SoFi Express Shuttle"],
    fanZoneName: "Santa Monica Pier Fan Zone",
    coordinates: { x: 15, y: 45 }
  },
  {
    id: "stadium_vancouver",
    name: "BC Place",
    city: "Vancouver",
    country: "Canada",
    capacity: 54500,
    transitStatus: "Normal",
    transitLines: ["SkyTrain Expo Line", "Aquabus Ferry"],
    fanZoneName: "Plaza of Nations Fan Zone",
    coordinates: { x: 22, y: 15 }
  },
  {
    id: "stadium_ny_nj",
    name: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    capacity: 82500,
    transitStatus: "Heavy Congestion",
    transitLines: ["NJ Transit Meadowlands Rail", "Coach USA Buses"],
    fanZoneName: "Central Park Fan Festival",
    coordinates: { x: 88, y: 32 }
  },
  {
    id: "stadium_dallas",
    name: "AT&T Stadium",
    city: "Dallas (Arlington)",
    country: "USA",
    capacity: 92967,
    transitStatus: "Moderate Congestion",
    transitLines: ["TRE Commuter Rail", "Arlington Stadium Shuttle"],
    fanZoneName: "Fair Park Fan Festival",
    coordinates: { x: 52, y: 55 }
  },
  {
    id: "stadium_miami",
    name: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    capacity: 64767,
    transitStatus: "Normal",
    transitLines: ["Brightline Shuttle", "Metrobus Route 297"],
    fanZoneName: "Wynwood Fan Zone & Art Festival",
    coordinates: { x: 80, y: 68 }
  }
];

export const initialRestaurants = [
  // Dallas AT&T Stadium
  {
    id: "rest_dallas_1",
    name: "Lockhart Smokehouse",
    venueId: "stadium_dallas",
    cuisine: "Texas BBQ",
    rating: 4.8,
    averageCost: 35,
    distanceMiles: 2.1,
    description: "Authentic, post-oak smoked brisket and legendary sausage. A Texas staple with plenty of large screens.",
    tags: ["texas bbq", "brisket", "big screens", "lively vibe", "casual", "craft beer"],
    // Simulating 5-dimension normalized embedding vectors for vector search:
    // [FoodQuality, LivelyVibe/Screens, CostFactor(lower is higher), Accessibility, VegetarianOptions]
    embedding: [0.95, 0.90, 0.50, 0.80, 0.10]
  },
  {
    id: "rest_dallas_2",
    name: "Jillians Sports Bar & Grill",
    venueId: "stadium_dallas",
    cuisine: "American Pub",
    rating: 4.3,
    averageCost: 20,
    distanceMiles: 1.2,
    description: "Gigantic sports lounge directly across the venue. Dozens of TVs, arcade games, and pub food.",
    tags: ["sports bar", "pub food", "big screens", "arcades", "cheap beer", "loud"],
    embedding: [0.70, 0.98, 0.80, 0.85, 0.30]
  },
  {
    id: "rest_dallas_3",
    name: "Mariano's Hacienda",
    venueId: "stadium_dallas",
    cuisine: "Tex-Mex",
    rating: 4.6,
    averageCost: 30,
    distanceMiles: 3.5,
    description: "Home of the original frozen margarita machine. Excellent sizzling fajitas and family-friendly patio seating.",
    tags: ["mexican", "fajitas", "margaritas", "patio", "family friendly", "outdoor seating"],
    embedding: [0.85, 0.75, 0.60, 0.90, 0.60]
  },

  // NY/NJ MetLife Stadium
  {
    id: "rest_ny_1",
    name: "Redd's Restaurant & Bar",
    venueId: "stadium_ny_nj",
    cuisine: "German Pub & Sports Bar",
    rating: 4.4,
    averageCost: 28,
    distanceMiles: 0.8,
    description: "Famous game-day hangout offering park-and-ride shuttles straight to MetLife. Giant projection screens and extensive beer taps.",
    tags: ["sports bar", "shuttle service", "big screens", "beer garden", "outdoor seating"],
    embedding: [0.75, 0.95, 0.65, 0.95, 0.25]
  },
  {
    id: "rest_ny_2",
    name: "Lafayette Pizza & Italian",
    venueId: "stadium_ny_nj",
    cuisine: "Italian Pizza",
    rating: 4.7,
    averageCost: 18,
    distanceMiles: 2.4,
    description: "Voted best New York style thin-crust pizza in East Rutherford. Quick service, casual vibe.",
    tags: ["pizza", "italian", "family friendly", "quick bite", "vegetarian friendly"],
    embedding: [0.90, 0.50, 0.85, 0.70, 0.80]
  },

  // Vancouver BC Place
  {
    id: "rest_van_1",
    name: "Steamworks Brewpub",
    venueId: "stadium_vancouver",
    cuisine: "Gastropub",
    rating: 4.5,
    averageCost: 40,
    distanceMiles: 1.5,
    description: "Historic brewpub powered by actual steam. Stunning harbor views, localized craft beers, and modern pub fare.",
    tags: ["craft beer", "waterfront", "scenic views", "gastropub", "family friendly"],
    embedding: [0.88, 0.80, 0.45, 0.88, 0.55]
  },
  {
    id: "rest_van_2",
    name: "MeeT in Yaletown",
    venueId: "stadium_vancouver",
    cuisine: "Vegan Comfort Food",
    rating: 4.7,
    averageCost: 25,
    distanceMiles: 0.6,
    description: "Warm, cozy atmosphere in Yaletown featuring delicious plant-based burgers, poutines, and healthy plates.",
    tags: ["vegan", "vegetarian", "healthy", "cozy", "family friendly"],
    embedding: [0.92, 0.60, 0.75, 0.85, 0.98]
  },

  // Miami Hard Rock Stadium
  {
    id: "rest_mia_1",
    name: "El Palacio de los Jugos",
    venueId: "stadium_miami",
    cuisine: "Cuban Street Food",
    rating: 4.6,
    averageCost: 15,
    distanceMiles: 4.0,
    description: "Famous open-air Latin market. Exceptional roast pork (lechón), fresh tropical juices, and authentic Cuban sandwiches.",
    tags: ["cuban", "street food", "cheap eats", "fresh juice", "casual", "outdoor seating"],
    embedding: [0.95, 0.55, 0.90, 0.60, 0.20]
  },
  {
    id: "rest_mia_2",
    name: "Duffy's Sports Grill",
    venueId: "stadium_miami",
    cuisine: "Sports Grill",
    rating: 4.2,
    averageCost: 26,
    distanceMiles: 2.8,
    description: "Dozens of HD screens, waterfront views with a pool, and classic American grill favorites. Known for double-play happy hours.",
    tags: ["sports bar", "poolside", "waterfront", "big screens", "happy hour", "family friendly"],
    embedding: [0.70, 0.95, 0.70, 0.90, 0.40]
  }
];

export const initialUserProfile = {
  id: "user_current",
  name: "Alex Morgan",
  favoriteTeams: ["USA", "Mexico"],
  budgetLimit: 2000,
  dietaryPreferences: ["vegetarian friendly", "vegan"],
  accessibilityNeeds: false
};

// Initial itinerary activities booked by default for a realistic view
export const initialItinerary = [
  {
    id: "act_1",
    type: "flight",
    title: "Flight: NYC to Dallas (DFW)",
    dateTime: "2026-06-17 09:30",
    cost: 320,
    details: "American Airlines AA-1045, Main Cabin"
  },
  {
    id: "act_2",
    type: "hotel",
    title: "Sheraton Arlington Hotel",
    dateTime: "2026-06-17 15:00",
    cost: 450,
    details: "3 nights (check-in Jun 17, check-out Jun 20). Close to AT&T Stadium."
  },
  {
    id: "act_3",
    type: "match",
    title: "Match tickets: Argentina vs Belgium",
    dateTime: "2026-06-18 18:00",
    cost: 400,
    details: "Section 124, Row K, Seat 12. AT&T Stadium."
  },
  {
    id: "act_4",
    type: "transit",
    title: "Stadium Shuttle Service",
    dateTime: "2026-06-18 16:30",
    cost: 25,
    details: "Roundtrip shuttle from Sheraton Hotel to AT&T Stadium Entrance C."
  }
];
