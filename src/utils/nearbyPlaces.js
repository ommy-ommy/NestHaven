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

// Category configuration with Lucide icon names and badge colors
export const NEARBY_CATEGORIES = [
  { id: 'schools', label: 'Schools', icon: 'GraduationCap', color: '#3B82F6', group: 'education' },
  { id: 'colleges', label: 'Colleges', icon: 'School', color: '#6366F1', group: 'education' },
  { id: 'hospitals', label: 'Hospitals', icon: 'Hospital', color: '#EF4444', group: 'healthcare' },
  { id: 'pharmacies', label: 'Pharmacies', icon: 'Pill', color: '#10B981', group: 'healthcare' },
  { id: 'restaurants', label: 'Restaurants', icon: 'Utensils', color: '#F59E0B', group: 'dining' },
  { id: 'cafes', label: 'Cafes', icon: 'Coffee', color: '#8B5CF6', group: 'dining' },
  { id: 'gyms', label: 'Gyms', icon: 'Dumbbell', color: '#EC4899', group: 'fitness' },
  { id: 'parks', label: 'Parks', icon: 'Trees', color: '#10B981', group: 'fitness' },
  { id: 'malls', label: 'Shopping Malls', icon: 'ShoppingBag', color: '#F97316', group: 'shopping' },
  { id: 'petrol', label: 'Petrol Pumps', icon: 'Fuel', color: '#06B6D4', group: 'services' },
  { id: 'metro', label: 'Metro Stations', icon: 'TrainTrack', color: '#3B82F6', group: 'transit' },
  { id: 'bus', label: 'Bus Stops', icon: 'Bus', color: '#8B5CF6', group: 'transit' },
  { id: 'railway', label: 'Railway Stations', icon: 'Train', color: '#6366F1', group: 'transit' },
  { id: 'airports', label: 'Airports', icon: 'Plane', color: '#0EA5E9', group: 'transit' },
  { id: 'atms', label: 'ATMs', icon: 'CreditCard', color: '#10B981', group: 'services' },
]

export const CATEGORY_GROUPS = [
  { id: 'all', label: 'All Places' },
  { id: 'education', label: 'Education' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'dining', label: 'Food & Dining' },
  { id: 'transit', label: 'Transport & Transit' },
  { id: 'fitness', label: 'Parks & Fitness' },
  { id: 'shopping', label: 'Shopping & Malls' },
  { id: 'services', label: 'Essential Services' },
]

// Database of realistic nearby place templates per city/locality
const PLACES_DATA = {
  Mumbai: {
    schools: [
      { name: 'Bombay Scottish School', offsetLat: 0.003, offsetLng: 0.004, rating: 4.8 },
      { name: 'Podar International School', offsetLat: -0.004, offsetLng: 0.002, rating: 4.7 },
      { name: 'Don Bosco High School', offsetLat: 0.006, offsetLng: -0.003, rating: 4.6 },
    ],
    colleges: [
      { name: 'St. Xavier\'s College', offsetLat: -0.008, offsetLng: 0.005, rating: 4.9 },
      { name: 'Sophia College for Women', offsetLat: 0.005, offsetLng: -0.006, rating: 4.7 },
    ],
    hospitals: [
      { name: 'Hinduja Hospital', offsetLat: 0.004, offsetLng: 0.003, rating: 4.8 },
      { name: 'Lilavati Hospital', offsetLat: -0.005, offsetLng: 0.006, rating: 4.9 },
      { name: 'Jaslok Hospital', offsetLat: 0.007, offsetLng: -0.004, rating: 4.7 },
    ],
    pharmacies: [
      { name: 'Apollo Pharmacy 24/7', offsetLat: 0.001, offsetLng: 0.002, rating: 4.6 },
      { name: 'Wellness Forever Chemist', offsetLat: -0.002, offsetLng: 0.001, rating: 4.8 },
    ],
    restaurants: [
      { name: 'Bastian Seafood & Grill', offsetLat: 0.002, offsetLng: 0.003, rating: 4.7 },
      { name: 'The Bombay Canteen', offsetLat: -0.003, offsetLng: 0.004, rating: 4.9 },
      { name: 'Trishna Fine Dining', offsetLat: 0.005, offsetLng: -0.002, rating: 4.6 },
    ],
    cafes: [
      { name: 'Blue Tokai Coffee Roasters', offsetLat: 0.001, offsetLng: 0.003, rating: 4.8 },
      { name: 'Subko Specialty Coffee', offsetLat: -0.002, offsetLng: 0.002, rating: 4.9 },
      { name: 'Starbucks Reserve', offsetLat: 0.003, offsetLng: -0.001, rating: 4.7 },
    ],
    gyms: [
      { name: 'Gold\'s Gym Premier', offsetLat: 0.002, offsetLng: -0.003, rating: 4.6 },
      { name: 'Cult.fit Fitness Center', offsetLat: -0.003, offsetLng: 0.002, rating: 4.8 },
    ],
    parks: [
      { name: 'Shivaji Park', offsetLat: 0.005, offsetLng: 0.004, rating: 4.8 },
      { name: 'Worli Sea Face Promenade', offsetLat: -0.004, offsetLng: -0.005, rating: 4.9 },
    ],
    malls: [
      { name: 'Phoenix Palladium Mall', offsetLat: 0.006, offsetLng: 0.003, rating: 4.9 },
      { name: 'Atria The Millennium Mall', offsetLat: -0.005, offsetLng: 0.004, rating: 4.5 },
    ],
    petrol: [
      { name: 'Indian Oil Petrol Station', offsetLat: 0.002, offsetLng: 0.001, rating: 4.3 },
      { name: 'Bharat Petroleum Fuel Hub', offsetLat: -0.003, offsetLng: -0.002, rating: 4.4 },
    ],
    metro: [
      { name: 'Worli Metro Station', offsetLat: 0.003, offsetLng: 0.002, rating: 4.7 },
      { name: 'Science Museum Metro', offsetLat: -0.005, offsetLng: 0.003, rating: 4.6 },
    ],
    bus: [
      { name: 'Worli Naka Bus Depot', offsetLat: 0.001, offsetLng: -0.002, rating: 4.2 },
      { name: 'Acharya Atre Chowk Bus Stop', offsetLat: -0.002, offsetLng: 0.003, rating: 4.3 },
    ],
    railway: [
      { name: 'Dadar Railway Station', offsetLat: 0.012, offsetLng: 0.008, rating: 4.5 },
      { name: 'Lower Parel Railway Station', offsetLat: -0.008, offsetLng: 0.005, rating: 4.4 },
    ],
    airports: [
      { name: 'Chhatrapati Shivaji Maharaj Airport (T2)', offsetLat: 0.085, offsetLng: 0.045, rating: 4.8 },
    ],
    atms: [
      { name: 'HDFC Bank 24/7 ATM', offsetLat: 0.001, offsetLng: 0.001, rating: 4.5 },
      { name: 'ICICI Bank Express ATM', offsetLat: -0.001, offsetLng: 0.002, rating: 4.6 },
    ],
  },
  Bangalore: {
    schools: [
      { name: 'The National Public School', offsetLat: 0.004, offsetLng: 0.003, rating: 4.9 },
      { name: 'Bethany High School', offsetLat: -0.003, offsetLng: 0.004, rating: 4.7 },
    ],
    colleges: [
      { name: 'Christ University', offsetLat: 0.006, offsetLng: -0.005, rating: 4.8 },
      { name: 'St. Joseph\'s College of Commerce', offsetLat: -0.007, offsetLng: 0.004, rating: 4.8 },
    ],
    hospitals: [
      { name: 'Manipal Hospital Hal', offsetLat: 0.005, offsetLng: 0.004, rating: 4.8 },
      { name: 'St. John\'s Medical College Hospital', offsetLat: -0.004, offsetLng: 0.003, rating: 4.7 },
    ],
    pharmacies: [
      { name: 'MedPlus Pharmacy', offsetLat: 0.002, offsetLng: 0.001, rating: 4.5 },
      { name: 'Apollo Pharmacy Indiranagar', offsetLat: -0.001, offsetLng: 0.003, rating: 4.7 },
    ],
    restaurants: [
      { name: 'Toit Brewpub', offsetLat: 0.003, offsetLng: 0.002, rating: 4.9 },
      { name: 'Truffles Bistro', offsetLat: -0.002, offsetLng: 0.004, rating: 4.8 },
    ],
    cafes: [
      { name: 'Third Wave Coffee', offsetLat: 0.001, offsetLng: 0.002, rating: 4.8 },
      { name: 'Glens Bakehouse', offsetLat: -0.003, offsetLng: 0.001, rating: 4.7 },
    ],
    gyms: [
      { name: 'Snap Fitness 24/7', offsetLat: 0.002, offsetLng: -0.002, rating: 4.6 },
      { name: 'Cult.fit Indiranagar Hub', offsetLat: -0.004, offsetLng: 0.003, rating: 4.9 },
    ],
    parks: [
      { name: 'Cubbon Park', offsetLat: 0.012, offsetLng: -0.008, rating: 4.9 },
      { name: 'Koramangala 3rd Block Park', offsetLat: -0.003, offsetLng: 0.002, rating: 4.6 },
    ],
    malls: [
      { name: 'Forum Rex Walk / Nexus Mall', offsetLat: 0.005, offsetLng: 0.003, rating: 4.8 },
      { name: 'Phoenix Marketcity', offsetLat: 0.015, offsetLng: 0.020, rating: 4.9 },
    ],
    petrol: [
      { name: 'Shell Petrol Station', offsetLat: 0.003, offsetLng: 0.002, rating: 4.7 },
    ],
    metro: [
      { name: 'Indiranagar Metro Station', offsetLat: 0.002, offsetLng: 0.003, rating: 4.8 },
      { name: 'Trinity Metro Station', offsetLat: -0.006, offsetLng: -0.004, rating: 4.7 },
    ],
    bus: [
      { name: 'Koramangala TTMC Bus Station', offsetLat: 0.004, offsetLng: 0.002, rating: 4.4 },
    ],
    railway: [
      { name: 'KSR Bengaluru City Railway Station', offsetLat: 0.045, offsetLng: -0.030, rating: 4.6 },
      { name: 'Kanthirava Rail Halt', offsetLat: -0.015, offsetLng: 0.010, rating: 4.2 },
    ],
    airports: [
      { name: 'Kempegowda International Airport (BLR)', offsetLat: 0.220, offsetLng: 0.110, rating: 4.9 },
    ],
    atms: [
      { name: 'Axis Bank ATM', offsetLat: 0.001, offsetLng: 0.001, rating: 4.5 },
      { name: 'SBI Touch Banking ATM', offsetLat: -0.002, offsetLng: 0.002, rating: 4.4 },
    ],
  },
}

// Default fallback generator for any city or lat/lng
function generateGenericPlaces(lat, lng, locality = 'Neighborhood') {
  return {
    schools: [
      { name: `${locality} International Academy`, offsetLat: 0.004, offsetLng: 0.003, rating: 4.8 },
      { name: `St. Mary's Convent School`, offsetLat: -0.003, offsetLng: 0.005, rating: 4.6 },
    ],
    colleges: [
      { name: `${locality} College of Science & Arts`, offsetLat: 0.007, offsetLng: -0.004, rating: 4.7 },
    ],
    hospitals: [
      { name: `Max Healthcare Super Speciality Hospital`, offsetLat: 0.005, offsetLng: 0.004, rating: 4.9 },
      { name: `Fortis Medical Care Center`, offsetLat: -0.006, offsetLng: 0.003, rating: 4.7 },
    ],
    pharmacies: [
      { name: `Apollo Pharmacy 24 Hours`, offsetLat: 0.001, offsetLng: 0.002, rating: 4.7 },
      { name: `MedPlus Superstore`, offsetLat: -0.002, offsetLng: 0.001, rating: 4.6 },
    ],
    restaurants: [
      { name: `The Glasshouse Gourmet Bistro`, offsetLat: 0.003, offsetLng: 0.002, rating: 4.8 },
      { name: `Spice & Grill Fine Dining`, offsetLat: -0.004, offsetLng: 0.003, rating: 4.6 },
    ],
    cafes: [
      { name: `Artisan Roasted Coffee Co.`, offsetLat: 0.002, offsetLng: 0.003, rating: 4.9 },
      { name: `The Daily Bean Cafe`, offsetLat: -0.001, offsetLng: -0.002, rating: 4.7 },
    ],
    gyms: [
      { name: `Gold's Fitness & Wellness Club`, offsetLat: 0.003, offsetLng: -0.002, rating: 4.7 },
      { name: `Anytime Fitness 24/7`, offsetLat: -0.002, offsetLng: 0.004, rating: 4.6 },
    ],
    parks: [
      { name: `${locality} Central Botanical Gardens`, offsetLat: 0.004, offsetLng: 0.006, rating: 4.9 },
      { name: `Green Meadows Leisure Park`, offsetLat: -0.005, offsetLng: -0.003, rating: 4.7 },
    ],
    malls: [
      { name: `Grand Galleria Shopping Mall`, offsetLat: 0.008, offsetLng: 0.005, rating: 4.8 },
      { name: `City Center Shopping Plaza`, offsetLat: -0.007, offsetLng: 0.006, rating: 4.6 },
    ],
    petrol: [
      { name: `Indian Oil Fuel Station`, offsetLat: 0.002, offsetLng: 0.001, rating: 4.4 },
      { name: `HP Energy Petrol Pump`, offsetLat: -0.003, offsetLng: -0.002, rating: 4.5 },
    ],
    metro: [
      { name: `${locality} Metro Station Line 1`, offsetLat: 0.003, offsetLng: 0.002, rating: 4.8 },
      { name: `City Central Metro Interchange`, offsetLat: -0.006, offsetLng: 0.004, rating: 4.7 },
    ],
    bus: [
      { name: `${locality} Central Bus Station`, offsetLat: 0.001, offsetLng: -0.002, rating: 4.3 },
      { name: `Express Bus Transit Halt`, offsetLat: -0.002, offsetLng: 0.003, rating: 4.4 },
    ],
    railway: [
      { name: `Central Junction Railway Station`, offsetLat: 0.025, offsetLng: 0.015, rating: 4.5 },
    ],
    airports: [
      { name: `International Airport Terminal`, offsetLat: 0.120, offsetLng: 0.080, rating: 4.8 },
    ],
    atms: [
      { name: `HDFC Bank 24/7 ATM`, offsetLat: 0.001, offsetLng: 0.001, rating: 4.6 },
      { name: `ICICI Bank ATM Counter`, offsetLat: -0.001, offsetLng: 0.002, rating: 4.5 },
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

  const allPlaces = []

  NEARBY_CATEGORIES.forEach(cat => {
    const placesInCat = cityData[cat.id] || generateGenericPlaces(propertyLat, propertyLng, locality)[cat.id] || []

    placesInCat.forEach((item, index) => {
      const placeLat = propertyLat + item.offsetLat
      const placeLng = propertyLng + item.offsetLng
      const distance = calculateDistance(propertyLat, propertyLng, placeLat, placeLng)
      const estimatedTime = calculateEstimatedTime(distance)

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
      })
    })
  })

  // Sort places by distance (closest first)
  return allPlaces.sort((a, b) => a.distanceKm - b.distanceKm)
}
