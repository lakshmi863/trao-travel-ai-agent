import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Use unstable_mockModule for internal ES modules, 
// OR mock the functions if you prefer. 
// For now, let's keep your structure but add imports.

import { registerUser } from '../controllers/authController.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/User.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - registerUser', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: 'test@example.com', password: 'password123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return 400 if user already exists', async () => {
    User.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });
});