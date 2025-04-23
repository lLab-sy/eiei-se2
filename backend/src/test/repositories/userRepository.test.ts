const mockingoose = require('mockingoose');
import mongoose from 'mongoose';
import { User, IUser } from '../../models/userModel';
import Post from '../../models/postModel';
import userRepository from '../../repositories/userRepository';

describe('User Repository', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    password: 'pass1234!',
    role: 'producer',
  } as any as IUser;

  const mockUser2 = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    password: 'pass12',

  } as any as IUser;

  describe('createUser', () => {
    it('should create a user', async () => {
      mockingoose(User).toReturn(mockUser, 'save');
      const result = await userRepository.createUser(mockUser);
      expect(result.username).toBe(mockUser.username);
    });

    it('should throw error on createUser failure', async () => {
      await mockingoose(User).toReturn(new Error('Save failed'), 'save');
      await expect(userRepository.createUser(mockUser2)).rejects.toThrow('Error create user in repository');
    });
  });

  describe('findUserByUsername', () => {
    it('should return a user by username', async () => {
      mockingoose(User).toReturn(mockUser, 'findOne');
      const result = await userRepository.findUserByUsername('testuser');
      expect(result?.username).toBe('testuser');
    });

    it('should throw error on findUserByUsername failure', async () => {
      mockingoose(User).toReturn(new Error('Find failed'), 'findOne');
      await expect(userRepository.findUserByUsername('testuser')).rejects.toThrow('Error finding user by username');
    });
  });

  describe('loginUser', () => {
    it('should return user data if login successful', async () => {
      mockingoose(User).toReturn(mockUser, 'findOne');
      const result = await userRepository.loginUser('testuser');
      expect(result.username).toBe('testuser');
    });

    it('should throw error if user not found', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      await expect(userRepository.loginUser('testuser')).rejects.toThrow('Invalid username or password');
    });
  });

  describe('getUserByID', () => {
    it('should return user by ID', async () => {
      mockingoose(User).toReturn(mockUser, 'findOne');
      const result = await userRepository.getUserByID(mockUser._id.toString());
      expect(result?.username).toBe('testuser');
    });

    it('should throw error if user not found', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      await expect(userRepository.getUserByID(mockUser._id.toString())).rejects.toThrow('User not found.');
    });
  });

  describe('updateImageKey', () => {
    it('should update profile image', async () => {
      const updatedUser = { ...mockUser, profileImage: 'key.jpg' };
      mockingoose(User).toReturn(updatedUser, 'findOneAndUpdate');
      const result = await userRepository.updateImageKey('key.jpg', mockUser._id.toString());
      expect(result.profileImage).toBe('key.jpg');
    });

    it('should throw error if user not found', async () => {
      mockingoose(User).toReturn(null, 'findOneAndUpdate');
      await expect(userRepository.updateImageKey('key.jpg', mockUser._id.toString())).rejects.toThrow('User not found.');
    });
  });

  // You can similarly mock User.aggregate or Post.aggregate for
  // getUserReviewsByID and getUserReceivedReviewsByID.
  // Due to complexity, we usually test these via integration tests,
  // or mock aggregate with expected outputs.
});