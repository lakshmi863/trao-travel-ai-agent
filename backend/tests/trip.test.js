import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { generateNewTrip } from '../controllers/tripController.js';
import Trip from '../models/Trip.js';

// 1. Mock the Trip model
jest.mock('../models/Trip.js');

// 2. Mock global fetch
global.fetch = jest.fn();

describe('Trip Controller - generateNewTrip', () => {
  let req, res;

  beforeAll(() => {
    // Set dummy environment variable for the test
    process.env.GEMINI_API_KEY = 'test-key';
  });

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      body: {
        destination: 'Tokyo',
        durationDays: 3,
        budgetTier: 'Medium',
        interests: ['Anime']
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return 400 if destination is missing', async () => {
    req.body.destination = ''; 

    await generateNewTrip(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should successfully parse AI JSON and save a trip', async () => {
    const mockAIResponse = {
      itinerary: [],
      hotels: [],
      estimatedBudget: { total: 500 },
      packingList: []
    };

    // Mock fetch for Gemini API success
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        candidates: [{
          content: { parts: [{ text: JSON.stringify(mockAIResponse) }] }
        }]
      })
    });

    // Mock the Mongoose save function
    Trip.prototype.save = jest.fn().mockResolvedValue({
      _id: 'trip789',
      destination: 'Tokyo',
      ...mockAIResponse
    });

    await generateNewTrip(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'trip789'
    }));
  });

  it('should handle Gemini API rate limits (429) without waiting long', async () => {
    // Mock setTimeout to run its callback immediately (bypass backoff delay)
    const timeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((cb) => cb());

    // Mock fetch to return 429
    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve('Rate limit exceeded')
    });

    await generateNewTrip(req, res);

    // Final result should be the custom error status
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('API encountered an error')
    }));

    timeoutSpy.mockRestore();
  });
});