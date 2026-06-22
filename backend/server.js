// 1. Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config(); 

// 2. Now import everything else
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

// 3. Connect to Database
connectDB(); 

const app = express();

app.use(cors({
   origin: ['http://localhost:5173', 'https://trao-travel-front.onrender.com'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});