import authController from '../../controllers/authController';
import authService from '../../services/authService';
import { sendResponse } from '../../utils/responseHelper';
import { Request, Response } from 'express';
import { AuthRequest } from '../../dtos/middlewareDTO';  

// Mock dependency ทั้ง authService และ sendResponse
jest.mock('../../services/authService');
jest.mock('../../utils/responseHelper');

describe('AuthController - createUser', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    (sendResponse as jest.Mock).mockImplementation(() => {}); 
  });

  it('should throw error if password invalid (no special character)', async () => {
    req.body = {
      username: 'testuser',
      password: 'password123', // no special character
      role: 'producer',
    };

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('special character'));
  });

  it('should return error if missing required fields', async () => {
    req.body = {
      username: '',
      password: 'Password@123',
      role: '', // missing
    };

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('required fields'));
  });

  it('should return error if password less than 8 characters', async () => {
    req.body = {
      username: 'testuser',
      password: 'P@1', // too short
      role: 'producer',
    };

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('minimum of 8 characters'));
  });

  it('should return error if username already exists', async () => {
    req.body = {
      username: 'testuser',
      password: 'Password@123',
      role: 'producer',
    };
    (authService.registerUser as jest.Mock).mockResolvedValue(null);

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('Username already exists'));
  });

  it('should register user successfully', async () => {
    req.body = {
      username: 'testuser',
      password: 'Password@123',
      role: 'producer',
    };
    const mockUser = { id: 1, username: 'testuser' };
    (authService.registerUser as jest.Mock).mockResolvedValue(mockUser);

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'success', mockUser, expect.stringContaining('Register successful'));
  });

  it('should catch error from service and send error response', async () => {
    req.body = {
      username: 'testuser',
      password: 'Password@123',
      role: 'production professional',
    };
    (authService.registerUser as jest.Mock).mockRejectedValue(new Error('Service Error'));

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('Service Error'));
  });

  it('should catch error from service and send internal error', async () => {
    req.body = {
        username: 'testuser',
        password: 'Password@123',
        role: 'production professional',
      };
    (authService.registerUser as jest.Mock).mockRejectedValue(new Error("Internal server error"));

    await authController.createUser(req as Request, res as Response);

    expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining("Internal server error"), 500);

});

});


describe('AuthController - Login User', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
  
    beforeEach(() => {
      req = {
        body: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),        
        clearCookie: jest.fn(),     
      };
      jest.clearAllMocks();
    });


    it('should login User Successfully', async () => {
        req.body = {
          username: 'testuser',
          password: 'Password@123',
          role: 'production professional',
        };
        const mockUser = { id: 1, username: 'testuser' };
        (authService.loginUser as jest.Mock).mockResolvedValue(mockUser);
    
        await authController.loginUser(req as Request, res as Response);
        
        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'success', mockUser, expect.stringContaining('Login successful'));
      });

    it('should return error if missing required fields', async () => {
        req.body = {
          username: '', // missing
          password: 'Password@123',
          role: 'production professional', 
        };
    
        await authController.loginUser(req as Request, res as Response);
    
        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('required fields'));
      });


    it('should catch error from service and send error response', async () => {
        req.body = {
        username: 'testuser',
        password: 'Password@123',
        role: 'producer',
        };
        (authService.loginUser as jest.Mock).mockRejectedValue(new Error('Service Error')); //Mock as error

        await authController.loginUser(req as Request, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(
            expect.anything(),
            'error',
            null, 
            expect.stringContaining('Service Error')
          );
    });

    it('should catch error from service and send internal error', async () => {
        req.body = {
            username: 'testuser',
            password: 'Password@123',
            role: 'production professional',
          };
        (authService.loginUser as jest.Mock).mockRejectedValue(new Error("Internal server error"));

        await authController.loginUser(req as Request, res as Response);

        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining("Internal server error"), 500);
    });
});



describe('AuthController - Auth Me', () => {
    let req: Partial<AuthRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {},
            user: { userId: "1",username:"test", role: 'production professional' },  
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('should get user successfully', async () => {
        const mockUser = { id: 1, username: 'testuser', role: 'producer' };

        (authService.getMe as jest.Mock).mockResolvedValue(mockUser);

        await authController.getMe(req as AuthRequest, res as Response, jest.fn());

        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'success', mockUser, expect.stringContaining('Get User successful'));
    });

    it('should catch error from service and send error response', async () => {
        (authService.getMe as jest.Mock).mockRejectedValue(new Error('Service Error'));

        await authController.getMe(req as AuthRequest, res as Response, jest.fn());

        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining('Service Error'));
    });

    it('should catch error from service and send internal error', async () => {
        (authService.getMe as jest.Mock).mockRejectedValue(new Error("Internal server error"));

        await authController.getMe(req as AuthRequest, res as Response, jest.fn());

        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'error', null, expect.stringContaining("Internal server error"), 500);
    });
});



describe('AuthController - Logout', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
  
    beforeEach(() => {
      req = {
        body: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it('should logout user successfully', async () => {
        res.clearCookie = jest.fn(); // mock clearCookie ด้วย
      
        await authController.logoutUser(req as Request, res as Response);
      
        expect(res.clearCookie).toHaveBeenCalledWith('token');
        expect(sendResponse).toHaveBeenCalledWith(expect.anything(), 'success', null, expect.stringContaining('Logged out successfully'));
      });
      

});
