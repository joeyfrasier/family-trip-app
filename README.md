# Family Trip Coordination App

A beautiful, Airbnb-style web application for coordinating your family's European trip. Built with React, TypeScript, and Mantine UI.

## Features

✨ **Visual Timeline** - Beautiful card-based timeline showing each destination
🏠 **Accommodation Tracking** - Status indicators for booking confirmations
🚗 **Transportation Hub** - Multi-modal travel tracking (flights, trains, cars, ferries)  
📋 **Booking Status** - Clear visual indicators for confirmed vs. pending bookings
📱 **Responsive Design** - Works perfectly on desktop and mobile
🎨 **Modern UI** - Clean, Airbnb-inspired design with hover effects

## Your Trip Overview

The app displays your complete 35-day European journey across 10 destinations in Italy, France, Spain, and Portugal:

- **Rome** (4 nights) - Airbnb confirmed ✅
- **Siena** (4 nights) - Villa confirmed ✅  
- **Sorrento** (8 nights) - VRBO villa confirmed ✅
- **Venice** (3 nights) - Airbnb confirmed ✅
- **Nice** (2 nights) - Airbnb confirmed ✅
- **Arles** (1 night) - Historic apartment confirmed ✅
- **Barcelona** (2 nights) - To be booked 🔲
- **Valencia** (2 nights) - To be booked 🔲
- **Lisbon** (3 nights) - Airbnb confirmed ✅
- **Estoril** (4 nights) - Birthday villa confirmed ✅

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Mantine** - Beautiful UI component library
- **Tabler Icons** - Clean, consistent icons
- **date-fns** - Date formatting and manipulation

## Project Structure

```
src/
├── components/          # React components
│   ├── DestinationCard.tsx   # Individual destination card
│   └── TripTimeline.tsx      # Main timeline component
├── data/               # Static data
│   └── tripData.ts     # Your complete trip information
├── types/              # TypeScript type definitions
│   └── trip.ts         # Trip-related interfaces
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## Customization

### Adding New Destinations

Edit `src/data/tripData.ts` to add new destinations or update existing ones.

### Updating Family Members

Modify the `familyMembers` array in `tripData.ts` to add or remove family members.

## Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder will contain your production-ready app that you can deploy to any static hosting service like Vercel, Netlify, or GitHub Pages.

---

**Enjoy your amazing 35-day European adventure! 🇪🇺✈️**
