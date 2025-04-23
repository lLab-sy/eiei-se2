import authService from '../../services/authService';
import userRepository from '../../repositories/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock external dependencies
jest.mock('../../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockResolvedValue({ username: 'testuser', role: 'producer' });

      const result = await authService.registerUser({
        username: 'testuser',
        password: 'password123',
        role: 'producer',
      });

      expect(result).toEqual({ username: 'testuser', role: 'producer' });
      expect(userRepository.findUserByUsername).toHaveBeenCalledWith('testuser');
      expect(userRepository.createUser).toHaveBeenCalled();
    });

    it('should throw error if username exists', async () => {
      (userRepository.findUserByUsername as jest.Mock).mockResolvedValue({ username: 'testuser' });

      await expect(authService.registerUser({
        username: 'testuser',
        password: 'password123',
        role: 'producer',
      })).rejects.toThrow('Error in service layer');
    });
  });

  describe('loginUser', () => {
    it('should login user and return token', async () => {
      (userRepository.loginUser as jest.Mock).mockResolvedValue({
        _id: { toString: () => 'userId123' },
        username: 'testuser',
        password: 'hashedPassword',
        role: 'producer',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt_token');

      const result = await authService.loginUser({
        username: 'testuser',
        password: 'password123',
      });

      expect(result.token).toBe('jwt_token');
      expect(result.user.username).toBe('testuser');
      expect(result.user.role).toBe('producer');
    });

    it('should throw error if user not found', async () => {
      (userRepository.loginUser as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser({
        username: 'wronguser',
        password: 'password123',
      })).rejects.toThrow('Error in service layer');
    });

    it('should throw error if password incorrect', async () => {
      (userRepository.loginUser as jest.Mock).mockResolvedValue({
        _id: { toString: () => 'userId123' },
        username: 'testuser',
        password: 'hashedPassword',
        role: 'producer',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUser({
        username: 'testuser',
        password: 'wrongpassword',
      })).rejects.toThrow('Error in service layer');
    });
  });

  describe('getMe', () => {
    it('should return producer user', async () => {
      (userRepository.getUserByID as jest.Mock).mockResolvedValue({ username: 'testuser', role: 'producer', password: 'pass' });

      const result = await authService.getMe('userId123', 'producer');
      expect(result).toEqual({ username: 'testuser', role: 'producer', password: 'pass' });
    });

    it('should return production professional user', async () => {
      (userRepository.getUserByID as jest.Mock).mockResolvedValue({ username: 'testuser', role: 'production professional', password: 'pass' });

      const result = await authService.getMe('userId123', 'production professional');
      expect(result).toEqual({ username: 'testuser', role: 'production professional', password: 'pass' });
    });

    it('should return admin user', async () => {
      (userRepository.getUserByID as jest.Mock).mockResolvedValue({ username: 'admin', role: 'admin', password: 'pass' });

      const result = await authService.getMe('userId123', 'admin');
      expect(result).toEqual({ username: 'admin', role: 'admin', password: 'pass' });
    });

    it('should throw error if userID invalid', async () => {
      (userRepository.getUserByID as jest.Mock).mockResolvedValue(null);

      await expect(authService.getMe('wrongUserId', 'producer')).rejects.toThrow('Error in service layer');
    });
  });
});
