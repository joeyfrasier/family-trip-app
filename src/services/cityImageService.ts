// Professional city images from Unsplash - high quality, optimized for cards
export const cityImages: Record<string, { url: string; alt: string }> = {
  'rome': {
    url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Colosseum in Rome, Italy'
  },
  'siena': {
    url: 'https://images.unsplash.com/photo-1571155153653-15513d1fb3e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Piazza del Campo in Siena, Italy'
  },
  'sorrento': {
    url: 'https://images.unsplash.com/photo-1566995349318-1effd9193ddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Coastal view of Sorrento, Italy'
  },
  'venice': {
    url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Grand Canal in Venice, Italy'
  },
  'nice': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Promenade des Anglais in Nice, France'
  },
  'arles': {
    url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Roman amphitheater in Arles, France'
  },
  'barcelona': {
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Sagrada Familia in Barcelona, Spain'
  },
  'valencia': {
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'City of Arts and Sciences in Valencia, Spain'
  },
  'lisbon': {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Colorful Lisbon cityscape, Portugal'
  },
  'estoril': {
    url: 'https://images.unsplash.com/photo-1567437999481-32ee75b117a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    alt: 'Estoril coastline, Portugal'
  }
};

// Get image for a specific city
export const getCityImage = (cityName: string) => {
  const cityKey = cityName.toLowerCase();
  return cityImages[cityKey] || null;
};