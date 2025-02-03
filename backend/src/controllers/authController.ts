import { Request, Response } from 'express';
import authService from '../services/authService';
import { RegisterDTO, LoginDTO } from '../dtos/authDTO';
import { sendResponse } from '../utils/responseHelper';
// import jwt from 'jsonwebtoken'

function validatePassword(password: string): boolean {
    // Regex for checking if the password contains at least one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>+-]/;
  
    if (!specialCharRegex.test(password)) {
      throw new Error("Password must contain at least one special character.");
    }
  
    // You can add additional checks here (like length, etc.)
    return true;
}

class AuthController{
    async createUser(req: Request, res: Response ): Promise<void>{
        try {
            const data: RegisterDTO = req.body;

            validatePassword(data.password);
    
            if (!data.username || !data.password || !data.role) {
                sendResponse(res, 'error', null, "Please provide all required fields.");
                return;
            }

            if(data.password.length < 8){
                sendResponse(res, 'error', null, "Password should be a minimum of 8 characters.");
                return;
            }
    
            const user = await authService.registerUser(data);
            if(!user){
                sendResponse(res, 'error', null, "Username already exists.");
                return;
            }
            sendResponse(res, 'success', user, 'Register successful.');
        } catch (err) {
            // console.error("Error in registerUser:", err);       
            const errorMessage = (err as Error).message || "Internal server error.";
    
            sendResponse(res, 'error', err, errorMessage);
        }
    };

    async loginUser(req: Request, res: Response): Promise<void>{
        try {
            const data: LoginDTO = req.body;
    
            if(!data.username || !data.password){
                sendResponse(res, 'error', null, "Please provide all required fields.");
                return;
            }
    
            const result = await authService.loginUser(data);
            res.cookie('token', result.token, {
                httpOnly: true, // protect accessing token from JavaScript in browser
                maxAge: 3600000, // 1 hour
                secure: process.env.NODE_ENV === 'production', // use HTTPS in production
                sameSite: 'strict', // protect CSRF attacks
            });
            sendResponse(res, 'success', result, 'Login successful');
        } catch (err) {
            const errorMessage = (err as Error).message || "Internal server error.";
            
            sendResponse(res, 'error', null, errorMessage);
        }
    };
}

export default new AuthController();
