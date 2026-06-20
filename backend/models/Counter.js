import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // The name of the collection (e.g., "users" or "trips")
  seq: { type: Number, default: 1 }     // The last number used
});

export default mongoose.model('Counter', counterSchema);