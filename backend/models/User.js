import mongoose from 'mongoose';
import Counter from './Counter.js';

const userSchema = new mongoose.Schema({
  _id: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { _id: false });

// Modern Async Auto-increment logic (NO 'next' used)
userSchema.pre('save', async function() {
  // If it's not a new user, don't do anything
  if (!this.isNew) return; 

  try {
    const counter = await Counter.findOneAndUpdate(
      { id: 'userId' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    this._id = counter.seq;
    // With async, we don't call next(). It finishes when the function ends.
  } catch (error) {
    // If there is an error, throw it so Mongoose catches it
    throw error;
  }
});

export default mongoose.model('User', userSchema);