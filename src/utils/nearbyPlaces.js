/**
 * Utility for distance calculation and nearby places generation
 */

// Haversine formula to compute distance between two lat/lng coordinates in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0.5
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return Math.round(d * 100) / 100 // Round to 2 decimal places
}

// Format distance into human-readable string (meters or km)
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000)
    return `${meters} m`
  }
  return `${distanceKm.toFixed(1)} km`
}

// Calculate estimated walking or driving time based on distance
export function calculateEstimatedTime(distanceKm) {
  if (distanceKm <= 1.5) {
    const walkingMinutes = Math.max(1, Math.round((distanceKm * 1000) / 80)) // ~80m per min
    return `${walkingMinutes} min walk`
  }
  const drivingMinutes = Math.max(2, Math.round((distanceKm / 30) * 60)) // ~30km/h city driving
  return `${drivingMinutes} min drive`
}

// 14 Primary Categories required by NestHaven Nearby Dashboard
export const NEARBY_CATEGORIES = [
  { id: 'schools', label: 'Schools', icon: 'GraduationCap', color: '#3B82F6', group: 'education' },
  { id: 'hospitals', label: 'Hospitals', icon: 'Hospital', color: '#EF4444', group: 'healthcare' },
  { id: 'restaurants', label: 'Restaurants', icon: 'Utensils', color: '#F59E0B', group: 'dining' },
  { id: 'hotels', label: 'Hotels', icon: 'Hotel', color: '#8B5CF6', group: 'hospitality' },
  { id: 'cafes', label: 'Cafes', icon: 'Coffee', color: '#D97706', group: 'dining' },
  { id: 'gyms', label: 'Gyms', icon: 'Dumbbell', color: '#EC4899', group: 'fitness' },
  { id: 'metro', label: 'Metro Stations', icon: 'TrainFront', color: '#2563EB', group: 'transit' },
  { id: 'bus', label: 'Bus Stops', icon: 'Bus', color: '#7C3AED', group: 'transit' },
  { id: 'malls', label: 'Shopping Malls', icon: 'ShoppingBag', color: '#F97316', group: 'shopping' },
  { id: 'banks', label: 'Banks', icon: 'Landmark', color: '#059669', group: 'services' },
  { id: 'atms', label: 'ATMs', icon: 'CreditCard', color: '#10B981', group: 'services' },
  { id: 'police', label: 'Police Stations', icon: 'ShieldAlert', color: '#DC2626', group: 'emergency' },
  { id: 'petrol', label: 'Petrol Pumps', icon: 'Fuel', color: '#06B6D4', group: 'services' },
  { id: 'parks', label: 'Parks', icon: 'Trees', color: '#16A34A', group: 'fitness' },
]

export const CATEGORY_GROUPS = [
  { id: 'all', label: 'All Places' },
  { id: 'education', label: 'Education' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'dining', label: 'Food & Dining' },
  { id: 'transit', label: 'Transit & Bus' },
  { id: 'fitness', label: 'Parks & Gyms' },
  { id: 'shopping', label: 'Shopping Malls' },
  { id: 'services', label: 'Banks, ATMs & Petrol' },
  { id: 'emergency', label: 'Emergency & Safety' },
]

// Database of realistic nearby place templates per city
const PLACES_DATA = {
  Mumbai: {
    schools: [
      { name: 'Bombay Scottish School', offsetLat: 0.003, offsetLng: 0.004, rating: 4.8 },
      { name: 'Podar International School', offsetLat: -0.004, offsetLng: 0.002, rating: 4.7 },
      { name: 'Don Bosco High School', offsetLat: 0.006, offsetLng: -0.003, rating: 4.6 },
    ],
    hospitals: [
      { name: 'Hinduja National Hospital', offsetLat: 0.004, offsetLng: 0.003, rating: 4.8 },
      { name: 'Lilavati Hospital & Research Centre', offsetLat: -0.005, offsetLng: 0.006, rating: 4.9 },
      { name: 'Jaslok Hospital', offsetLat: 0.007, offsetLng: -0.004, rating: 4.7 },
    ],
    restaurants: [
      { name: 'Bastian Seafood & Grill', offsetLat: 0.002, offsetLng: 0.003, rating: 4.7 },
      { name: 'The Bombay Canteen', offsetLat: -0.003, offsetLng: 0.004, rating: 4.9 },
      { name: 'Trishna Fine Seafood', offsetLat: 0.005, offsetLng: -0.002, rating: 4.6 },
    ],
    hotels: [
      { name: 'Taj Mahal Palace Hotel', offsetLat: 0.008, offsetLng: 0.006, rating: 4.9 },
      { name: 'The St. Regis Mumbai', offsetLat: 0.004, offsetLng: 0.002, rating: 4.8 },
      { name: 'Four Seasons Hotel Mumbai', offsetLat: -0.005, offsetLng: 0.004, rating: 4.7 },
    ],
    cafes: [
      { name: 'Blue Tokai Coffee Roasters', offsetLat: 0.001, offsetLng: 0.003, rating: 4.8 },
      { name: 'Subko Specialty Coffee & Bakehouse', offsetLat: -0.002, offsetLng: 0.002, rating: 4.9 },
      { name: 'Starbucks Reserve Lower Parel', offsetLat: 0.003, offsetLng: -0.001, rating: 4.7 },
    ],
    gyms: [
      { name: 'Gold\'s Gym Premier', offsetLat: 0.002, offsetLng: -0.003, rating: 4.6 },
      { name: 'Cult.fit Fitness Hub', offsetLat: -0.003, offsetLng: 0.002, rating: 4.8 },
    ],
    metro: [
      { name: 'Worli Metro Station (Line 3)', offsetLat: 0.003, offsetLng: 0.002, rating: 4.7 },
      { name: 'Science Museum Metro Station', offsetLat: -0.005, offsetLng: 0.003, rating: 4.6 },
    ],
    bus: [
      { name: 'Worli Naka Bus Depot', offsetLat: 0.001, offsetLng: -0.002, rating: 4.2 },
      { name: 'Acharya Atre Chowk Bus Stop', offsetLat: -0.002, offsetLng: 0.003, rating: 4.3 },
    ],
    malls: [
      { name: 'Phoenix Palladium Mall', offsetLat: 0.006, offsetLng: 0.003, rating: 4.9 },
      { name: 'Atria The Millennium Mall', offsetLat: -0.005, offsetLng: 0.004, rating: 4.5 },
    ],
    banks: [
      { name: 'HDFC Bank Main Branch', offsetLat: 0.002, offsetLng: 0.002, rating: 4.7 },
      { name: 'State Bank of India (SBI)', offsetLat: -0.003, offsetLng: 0.001, rating: 4.5 },
    ],
    atms: [
      { name: 'HDFC Bank 24/7 ATM', offsetLat: 0.001, offsetLng: 0.001, rating: 4.6 },
      { name: 'ICICI Bank Express ATM', offsetLat: -0.001, offsetLng: 0.002, rating: 4.5 },
    ],
    police: [
      { name: 'Worli Police Station', offsetLat: 0.004, offsetLng: -0.002, rating: 4.6 },
      { name: 'Dadar Police Division HQ', offsetLat: -0.006, offsetLng: 0.005, rating: 4.7 },
    ],
    petrol: [
      { name: 'Indian Oil Fuel Station', offsetLat: 0.002, offsetLng: 0.001, rating: 4.4 },
      { name: 'Bharat Petroleum Fuel Hub', offsetLat: -0.003, offsetLng: -0.002, rating: 4.5 },
    ],
    parks: [
      { name: 'Shivaji Park Botanical Garden', offsetLat: 0.005, offsetLng: 0.004, rating: 4.8 },
      { name: 'Worli Sea Face Promenade', offsetLat: -0.004, offsetLng: -0.005, rating: 4.9 },
    ],
  },
}

// Generic place generator for any location
function generateGenericPlaces(lat, lng, locality = 'Neighborhood') {
  return {
    schools: [
      { name: `${locality} International Academy`, offsetLat: 0.004, offsetLng: 0.003, rating: 4.8 },
      { name: `St. Mary's Convent School`, offsetLat: -0.003, offsetLng: 0.005, rating: 4.6 },
    ],
    hospitals: [
      { name: `Max Healthcare Super Speciality Hospital`, offsetLat: 0.005, offsetLng: 0.004, rating: 4.9 },
      { name: `Fortis Medical Care Center`, offsetLat: -0.006, offsetLng: 0.003, rating: 4.7 },
    ],
    restaurants: [
      { name: `The Glasshouse Gourmet Bistro`, offsetLat: 0.003, offsetLng: 0.002, rating: 4.8 },
      { name: `Spice & Grill Fine Dining`, offsetLat: -0.004, offsetLng: 0.003, rating: 4.6 },
    ],
    hotels: [
      { name: `The Grand Regency Hotel`, offsetLat: 0.007, offsetLng: 0.005, rating: 4.8 },
      { name: `Hyatt Centric Residence`, offsetLat: -0.005, offsetLng: 0.004, rating: 4.7 },
    ],
    cafes: [
      { name: `Artisan Roasted Coffee Co.`, offsetLat: 0.002, offsetLng: 0.003, rating: 4.9 },
      { name: `The Daily Bean Cafe`, offsetLat: -0.001, offsetLng: -0.002, rating: 4.7 },
    ],
    gyms: [
      { name: `Gold's Fitness & Wellness Club`, offsetLat: 0.003, offsetLng: -0.002, rating: 4.7 },
      { name: `Anytime Fitness 24/7`, offsetLat: -0.002, offsetLng: 0.004, rating: 4.6 },
    ],
    metro: [
      { name: `${locality} Metro Station Line 1`, offsetLat: 0.003, offsetLng: 0.002, rating: 4.8 },
      { name: `City Central Metro Interchange`, offsetLat: -0.006, offsetLng: 0.004, rating: 4.7 },
    ],
    bus: [
      { name: `${locality} Central Bus Depot`, offsetLat: 0.001, offsetLng: -0.002, rating: 4.3 },
      { name: `Express Transit Bus Stop`, offsetLat: -0.002, offsetLng: 0.003, rating: 4.4 },
    ],
    malls: [
      { name: `Grand Galleria Shopping Mall`, offsetLat: 0.008, offsetLng: 0.005, rating: 4.8 },
      { name: `City Center Shopping Plaza`, offsetLat: -0.007, offsetLng: 0.006, rating: 4.6 },
    ],
    banks: [
      { name: `HDFC Bank Branch & Vault`, offsetLat: 0.002, offsetLng: 0.002, rating: 4.7 },
      { name: `State Bank of India (SBI)`, offsetLat: -0.003, offsetLng: 0.001, rating: 4.6 },
    ],
    atms: [
      { name: `HDFC Bank 24/7 ATM`, offsetLat: 0.001, offsetLng: 0.001, rating: 4.6 },
      { name: `ICICI Bank ATM Counter`, offsetLat: -0.001, offsetLng: 0.002, rating: 4.5 },
    ],
    police: [
      { name: `${locality} Police Station & Control`, offsetLat: 0.004, offsetLng: -0.002, rating: 4.6 },
    ],
    petrol: [
      { name: `Indian Oil Fuel Station`, offsetLat: 0.002, offsetLng: 0.001, rating: 4.4 },
      { name: `HP Energy Petrol Pump`, offsetLat: -0.003, offsetLng: -0.002, rating: 4.5 },
    ],
    parks: [
      { name: `${locality} Central Botanical Park`, offsetLat: 0.004, offsetLng: 0.006, rating: 4.9 },
      { name: `Green Meadows Leisure Park`, offsetLat: -0.005, offsetLng: -0.003, rating: 4.7 },
    ],
  }
}

/**
 * Main function to get all nearby places for a given property
 */
export function getNearbyPlaces(lat, lng, city = 'Mumbai', locality = 'Central') {
  const propertyLat = Number(lat) || 19.0096
  const propertyLng = Number(lng) || 72.8183

  const cityData = PLACES_DATA[city] || generateGenericPlaces(propertyLat, propertyLng, locality)
  const genericData = generateGenericPlaces(propertyLat, propertyLng, locality)

  const allPlaces = []

  NEARBY_CATEGORIES.forEach(cat => {
    const placesInCat = cityData[cat.id] || genericData[cat.id] || []

    placesInCat.forEach((item, index) => {
      const placeLat = propertyLat + item.offsetLat
      const placeLng = propertyLng + item.offsetLng
      const distance = calculateDistance(propertyLat, propertyLng, placeLat, placeLng)
      const estimatedTime = calculateEstimatedTime(distance)

      // Open/Closed status (ATMs/Hospitals/Pharmacies always 24/7 Open; others deterministic)
      const isAlwaysOpen = ['atms', 'hospitals', 'police', 'petrol'].includes(cat.id)
      const isOpen = isAlwaysOpen || (index % 3 !== 2)

      const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLng}`

      allPlaces.push({
        id: `${cat.id}-${index}-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: item.name,
        categoryId: cat.id,
        categoryLabel: cat.label,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        group: cat.group,
        rating: item.rating,
        lat: placeLat,
        lng: placeLng,
        distanceKm: distance,
        formattedDistance: formatDistance(distance),
        estimatedTime,
        isOpen,
        googleNavUrl,
      })
    })
  })

  // Sort places by distance (closest first) by default
  return allPlaces.sort((a, b) => a.distanceKm - b.distanceKm)
}
