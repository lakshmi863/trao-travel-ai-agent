import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  estimatedCostUSD: { type: Number, default: 0 },
  timeOfDay: { type: String, enum: ['Morning', 'Afternoon', 'Evening'] }
});

// ─── Enhanced Hotel Schema ─────────────────────────────────────────────────────
const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, enum: ['Budget', 'Mid-Range', 'Luxury', 'Top Pick'] },
  estimatedCostNightUSD: { type: Number },
  rating: { type: String },           // e.g. "4.5"
  reviewCount: { type: Number },      // e.g. 1240
  location: { type: String },         // e.g. "City Center, near Eiffel Tower"
  amenities: [{ type: String }],      // e.g. ["Free WiFi", "Pool", "Breakfast"]
  highlights: { type: String },       // one-sentence standout
  travelerType: { type: String },     // e.g. "Couples", "Solo Travelers"
  bookingUrl: { type: String }        // deep-link to booking.com search
});

const TripSchema = new mongoose.Schema({
  userId: {
    type: Number,
    ref: 'User',
    required: true
  },
  destination: { type: String, required: true },
  durationDays: { type: Number, required: true },
  budgetTier: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  interests: [{ type: String }],
  itinerary: [{
    dayNumber: { type: Number, required: true },
    activities: [ActivitySchema]
  }],
  hotels: [HotelSchema],
  estimatedBudget: {
    transport: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  packingList: [{
    item: { type: String, required: true },
    category: { type: String, enum: ['Documents', 'Clothing', 'Gear', 'Other'] },
    isPacked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);