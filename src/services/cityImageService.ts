// Professional city images from Unsplash - high quality, royalty-free
export const cityImages: Record<string, { url: string; alt: string; credit: string }> = {
  'rome': {
    url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Colosseum at sunset in Rome, Italy',
    credit: 'Photo by Dario Bronnimann on Unsplash'
  },
  'siena': {
    url: 'https://images.unsplash.com/photo-1546884981-f48bafcc91a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Piazza del Campo in Siena with historic architecture',
    credit: 'Photo by Gabriella Clare Marino on Unsplash'
  },
  'sorrento': {
    url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d88717?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Coastal view of Sorrento with colorful buildings overlooking the Mediterranean',
    credit: 'Photo by Luca Micheli on Unsplash'
  },
  'venice': {
    url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2083&q=80',
    alt: 'Grand Canal in Venice with historic palaces and gondolas',
    credit: 'Photo by Canmandawe on Unsplash'
  },
  'nice': {
    url: 'https://images.unsplash.com/photo-1518477913339-4d0e0e4d7b0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Promenade des Anglais in Nice with azure Mediterranean waters',
    credit: 'Photo by Lina Verovaya on Unsplash'
  },
  'arles': {
    url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Roman amphitheater and historic center of Arles, France',
    credit: 'Photo by Mathieu Turle on Unsplash'
  },
  'barcelona': {
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Sagrada Familia basilica and Barcelona skyline at golden hour',
    credit: 'Photo by Toa Heftiba on Unsplash'
  },
  'valencia': {
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'City of Arts and Sciences in Valencia with futuristic architecture',
    credit: 'Photo by Dario on Unsplash'
  },
  'lisbon': {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Colorful Lisbon cityscape with traditional trams and historic buildings',
    credit: 'Photo by Luca Micheli on Unsplash'
  },
  'estoril': {
    url: 'https://images.unsplash.com/photo-1567437999481-32ee75b117a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Estoril coastline with elegant beachfront and Atlantic Ocean views',
    credit: 'Photo by Claudio Schwarz on Unsplash'
  }
};

// Get the current city based on the active trip date
export const getCurrentCityImage = (destinations: Array<{ city: string; startDate: string; endDate: string }>) => {
  const today = new Date();
  const currentDestination = destinations.find(dest => {
    const startDate = new Date(dest.startDate);
    const endDate = new Date(dest.endDate);
    return today >= startDate && today <= endDate;
  });

  if (currentDestination) {
    const cityKey = currentDestination.city.toLowerCase();
    return cityImages[cityKey] || null;
  }

  // Default to the first destination if no current city
  if (destinations.length > 0) {
    const firstCity = destinations[0].city.toLowerCase();
    return cityImages[firstCity] || null;
  }

  return null;
};

// Get image for a specific city
export const getCityImage = (cityName: string) => {
  const cityKey = cityName.toLowerCase();
  return cityImages[cityKey] || null;
};

// Get a random city image for visual variety
export const getRandomCityImage = (destinations: Array<{ city: string }>) => {
  if (destinations.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * destinations.length);
  const randomCity = destinations[randomIndex].city.toLowerCase();
  return cityImages[randomCity] || null;
};