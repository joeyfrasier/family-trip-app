export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  notifications: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'airbnb' | 'vrbo' | 'hotel';
  address: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  confirmed: boolean;
  bookingUrl?: string;
  images?: string[];
  description?: string;
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'car' | 'ferry';
  from: string;
  to: string;
  departureDate: string;
  arrivalDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  provider?: string;
  confirmationNumber?: string;
  details?: string;
  status: 'confirmed' | 'pending' | 'to-book';
  bookingUrl?: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  startDate: string;
  endDate: string;
  accommodation?: Accommodation;
  inboundTransport?: Transportation;
  outboundTransport?: Transportation;
  keyEvents: string[];
  images?: string[];
}

export interface TodoItem {
  id: string;
  category: 'transportation' | 'lodging' | 'flights' | 'other';
  task: string;
  completed: boolean;
  assignedTo?: string[];
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  countries: string[];
  destinations: Destination[];
  familyMembers: FamilyMember[];
  todos: TodoItem[];
  lastUpdated: string;
}