import express from 'express';
import auth from '../middleware/auth.js';
import {
  generateNewTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  regenerateDay,
  deleteTrip
} from '../controllers/tripController.js';

const router = express.Router();

router.post('/',              auth, generateNewTrip);   // Generate new trip
router.get('/',               auth, getUserTrips);       // Get all user trips
router.get('/:id',            auth, getTripById);        // Get single trip
router.put('/:id',            auth, updateTrip);         // Update itinerary/packing
router.put('/:id/regen-day',  auth, regenerateDay);      // Regenerate a specific day
router.delete('/:id',         auth, deleteTrip);         // Delete trip

export default router;