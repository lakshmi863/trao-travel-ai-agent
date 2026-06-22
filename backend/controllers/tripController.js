import Trip from '../models/Trip.js';

// ─── Exponential Backoff Helper ───────────────────────────────────────────────
async function fetchWithRetry(url, options, retries = 5, delay = 1000) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 429 && retries > 0) {
        console.warn(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw new Error(`Gemini API Error ${response.status}: ${errorBody}`);
    }

    return await response.json();

  } catch (error) {
    if (retries > 0) {
      console.warn(`Request issue: ${error.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    console.error(`ERROR: ${error.message}`);
    throw error;
  }
}

// ─── Shared Gemini Call Helper ─────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const data = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 1,
        maxOutputTokens: 8192
      }
    })
  });

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Could not extract generation data from Gemini response.');

  const cleanText = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanText);
}

// ─── Generate New Trip ────────────────────────────────────────────────────────
export const generateNewTrip = async (req, res) => {
  const { destination, durationDays, budgetTier, interests } = req.body;
  const userId = req.user.id;

  if (!destination || !durationDays || !budgetTier) {
    return res.status(400).json({ message: 'destination, durationDays, and budgetTier are required.' });
  }

  const prompt = `
    Create a detailed travel plan for a ${durationDays}-day trip to ${destination}.
    Budget preference is ${budgetTier}. Interests are: ${(interests || []).join(', ')}.

    You must output ONLY a valid JSON object matching this structure exactly (no extra text, no markdown):
    {
      "itinerary": [
        {
          "dayNumber": 1,
          "activities": [
            {
              "title": "Activity name",
              "description": "Brief text details",
              "estimatedCostUSD": 20,
              "timeOfDay": "Morning"
            }
          ]
        }
      ],
      "hotels": [
        {
          "name": "Recommended Hotel",
          "tier": "Budget",
          "estimatedCostNightUSD": 85,
          "rating": "4.5",
          "reviewCount": 1240,
          "location": "City Center, near main attractions",
          "amenities": ["Free WiFi", "Breakfast Included", "Pool"],
          "highlights": "Best value in the area with excellent transport links",
          "travelerType": "Budget Travelers",
          "bookingUrl": "https://www.booking.com/search.html?ss=${encodeURIComponent(destination)}"
        }
      ],
      "estimatedBudget": {
        "transport": 120,
        "accommodation": 300,
        "food": 150,
        "activities": 100,
        "total": 670
      },
      "packingList": [
        { "item": "Passport", "category": "Documents", "isPacked": false },
        { "item": "Sunscreen", "category": "Other", "isPacked": false }
      ]
    }

    Rules:
    - timeOfDay must be one of: "Morning", "Afternoon", "Evening"
    - category must be one of: "Documents", "Clothing", "Gear", "Other"
    - Make cost estimates realistic for ${budgetTier} budget in ${destination}
    - Include at least 3 activities per day
    - Include at least 3 hotel options across different price tiers (Budget, Mid-Range, Luxury) that suit the ${budgetTier} preference
    - For each hotel include: realistic rating (a number string like "4.2"), realistic reviewCount, specific location description, 3-5 amenities, a one-sentence highlight, and the most fitting travelerType from: "Solo Travelers", "Couples", "Families", "Business Travelers", "Budget Travelers", "Luxury Seekers"
    - Include at least 10 packing items relevant to the destination climate and activities
    - Output ONLY the JSON. No extra explanation.
  `;

  try {
    console.log(`Generating trip to ${destination} for ${durationDays} days...`);
    const cleanResult = await callGemini(prompt);

    const newTrip = new Trip({
      userId,
      destination,
      durationDays,
      budgetTier,
      interests: interests || [],
      itinerary: cleanResult.itinerary,
      hotels: cleanResult.hotels,
      estimatedBudget: cleanResult.estimatedBudget,
      packingList: cleanResult.packingList
    });

    const savedTrip = await newTrip.save();
    console.log(`Trip saved successfully: ${savedTrip._id}`);
    return res.status(201).json(savedTrip);

  } catch (error) {
    console.error('Critical AI Generation Error:', error.message);
    return res.status(500).json({
      message: 'API encountered an error processing your trip. Please try again.',
      error: error.message
    });
  }
};

// ─── Suggest / Refresh Hotels for an Existing Trip ────────────────────────────
export const suggestHotels = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied.' });
    }

    const prompt = `
      Suggest hotels for a ${trip.durationDays}-day trip to ${trip.destination} with a ${trip.budgetTier} budget.
      Traveler interests: ${trip.interests.join(', ') || 'General sightseeing'}.

      Output ONLY a valid JSON object with this exact structure (no extra text, no markdown):
      {
        "hotels": [
          {
            "name": "Hotel Name",
            "tier": "Budget",
            "estimatedCostNightUSD": 60,
            "rating": "4.2",
            "reviewCount": 980,
            "location": "Specific neighborhood or landmark proximity",
            "amenities": ["Free WiFi", "Air Conditioning", "24hr Reception"],
            "highlights": "One sentence about what makes this hotel stand out",
            "travelerType": "Budget Travelers",
            "bookingUrl": "https://www.booking.com/search.html?ss=${encodeURIComponent(trip.destination)}"
          }
        ]
      }

      Rules:
      - Include exactly 4 hotels: one Budget, one Mid-Range, one Luxury, and one that best matches the ${trip.budgetTier} preference as a "Top Pick"
      - Mark the Top Pick with tier: "Top Pick"
      - rating must be a number string like "4.3" (between 3.5 and 5.0)
      - reviewCount must be a realistic integer (100-5000)
      - amenities: array of 3-5 short strings
      - travelerType must be one of: "Solo Travelers", "Couples", "Families", "Business Travelers", "Budget Travelers", "Luxury Seekers"
      - Use realistic hotel names specific to ${trip.destination}
      - Output ONLY the JSON. No extra text.
    `;

    console.log(`Refreshing hotel suggestions for trip ${trip._id}...`);
    const result = await callGemini(prompt);

    // Save the refreshed hotels back to the trip
    trip.hotels = result.hotels;
    await trip.save();

    return res.status(200).json({ hotels: trip.hotels });

  } catch (error) {
    console.error('Failed to suggest hotels:', error.message);
    return res.status(500).json({
      message: 'Failed to generate hotel suggestions. Please try again.',
      error: error.message
    });
  }
};

// ─── Get All Trips for Logged-In User ─────────────────────────────────────────
export const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Failed to fetch trips:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve trips.' });
  }
};

// ─── Get Single Trip by ID ────────────────────────────────────────────────────
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied.' });
    }
    return res.status(200).json(trip);
  } catch (error) {
    console.error('Failed to fetch trip:', error.message);
    return res.status(500).json({ message: 'Failed to retrieve trip.' });
  }
};

// ─── Update Trip ──────────────────────────────────────────────────────────────
export const updateTrip = async (req, res) => {
  try {
    const allowedUpdates = ['itinerary', 'packingList', 'hotels', 'estimatedBudget'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied.' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Failed to update trip:', error.message);
    return res.status(500).json({ message: 'Failed to update trip.' });
  }
};

// ─── Regenerate a Specific Day ────────────────────────────────────────────────
export const regenerateDay = async (req, res) => {
  const { dayNumber, feedback } = req.body;

  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied.' });
    }

    const prompt = `
      I have a ${trip.durationDays}-day trip to ${trip.destination} with a ${trip.budgetTier} budget.
      Please regenerate ONLY Day ${dayNumber} activities.
      User feedback: "${feedback || 'Make it more interesting and varied'}".

      Output ONLY a valid JSON object like this (no extra text):
      {
        "dayNumber": ${dayNumber},
        "activities": [
          {
            "title": "Activity name",
            "description": "Brief details",
            "estimatedCostUSD": 20,
            "timeOfDay": "Morning"
          }
        ]
      }

      timeOfDay must be one of: "Morning", "Afternoon", "Evening".
      Include at least 3 activities. Output ONLY the JSON.
    `;

    const newDay = await callGemini(prompt);

    trip.itinerary = trip.itinerary.map(day =>
      day.dayNumber === dayNumber ? newDay : day
    );

    await trip.save();
    return res.status(200).json(trip);

  } catch (error) {
    console.error('Failed to regenerate day:', error.message);
    return res.status(500).json({ message: 'Failed to regenerate day.' });
  }
};

// ─── Delete Trip ──────────────────────────────────────────────────────────────
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or access denied.' });
    }
    return res.status(200).json({ message: 'Trip deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete trip:', error.message);
    return res.status(500).json({ message: 'Failed to delete trip.' });
  }
};