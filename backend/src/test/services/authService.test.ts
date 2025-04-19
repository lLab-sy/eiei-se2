// import authService from '../../services/authService';
// import userRepository from '../../repositories/userRepository';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { RegisterDTO } from '../../dtos/authDTO';

// // Mock userRepository methods
// jest.mock('../../repositories/userRepository', () => ({
//   findUserByUsername: jest.fn(),
//   createUser: jest.fn(),
//   loginUser: jest.fn(),
//   getUserByID: jest.fn(),
// }));

// describe('AuthService', () => {
  
//   // Test for registerUser
//   it('should register a user successfully', async () => {
//     const mockData:RegisterDTO = {
//       username: 'testuser',
//       password: 'testpassword',
//       role: 'producer',  // ระบุ role ให้ตรงกับที่ใช้ในแอป
//     };

//     const mockUser = {
//       username: 'testuser',
//       password: 'hashedpassword',
//       role: 'producer',
//     };

//     // Mock findUserByUsername to return null (no existing user)
//     (userRepository.findUserByUsername as jest.Mock).mockResolvedValue(null);  // No existing user
//     (userRepository.createUser as jest.Mock).mockResolvedValue(mockUser);  // Mock the created user

//     const result = await authService.registerUser(mockData);

//     expect(result).toEqual({
//       username: 'testuser',
//       role: 'user',
//     });
//   });

//   // Test for loginUser
//   it('should login a user successfully', async () => {
//     const mockData = {
//       username: 'testuser',
//       password: 'testpassword',
//     };

//     const mockUser = {
//       _id: '12345',
//       username: 'testuser',
//       password: 'hashedpassword',
//       role: 'user',
//     };

//     // Mocking the repository and bcrypt.compare
//     (userRepository.loginUser as jest.Mock).mockResolvedValue(mockUser);
//     (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Simulate password match

//     const result = await authService.loginUser(mockData);

//     expect(result).toHaveProperty('token');
//     expect(result.user.username).toBe('testuser');
//   });

//   // Test for getMe
//   it('should return user data for valid user', async () => {
//     const mockUser = {
//       _id: '12345',
//       username: 'testuser',
//       role: 'user',
//     };

//     (userRepository.getUserByID as jest.Mock).mockResolvedValue(mockUser);

//     const result = await authService.getMe('12345', 'user');

//     expect(result).toEqual(mockUser);
//   });

//   // Test for getMe with invalid user ID
//   it('should throw an error when user not found', async () => {
//     (userRepository.getUserByID as jest.Mock).mockResolvedValue(null);

//     await expect(authService.getMe('invalidID', 'user')).rejects.toThrow('Invalid userID.');
//   });

// });
