export interface Activity {
  _id?: string;
  title: string;
  description: string;
  estimatedCostUSD: number;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
}

export interface ItineraryDay {
  dayNumber: number;
  activities: Activity[];
}

export interface PackingItem {
  _id?: string;
  item: string;
  category: 'Documents' | 'Clothing' | 'Gear' | 'Other';
  isPacked: boolean;
}

export interface Trip {
  _id: string;
  userId: string | number;
  destination: string;
  durationDays: number;
  budgetTier: 'Low' | 'Medium' | 'High';
  interests: string[];
  itinerary: ItineraryDay[];
  hotels: {
    name: string;
    tier: string;
    estimatedCostNightUSD: number;
    rating: string;
  }[];
  estimatedBudget: {
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    total: number;
  };
  packingList: PackingItem[];
  createdAt: string;
}

export interface AuthResponse {
  _id: string | number;
  email: string;
  token: string;
}