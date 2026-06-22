import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import User from '../models/User.js';

// IMPORTANT: Mock the User model so it doesn't hit the real database
jest.mock('../models/User.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes API', () => {
  it('POST /api/auth/login - should fail with wrong credentials', async () => {
    // Tell the mock exactly what to return so the code doesn't hang
    User.findOne = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@user.com', password: '123' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid email or password');
  }, 10000); // Increased timeout to 10s just in case
});