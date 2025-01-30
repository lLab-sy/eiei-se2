import { Request, Response } from 'express';
import authService from '../services/authService';
import { RegisterDTO, LoginDTO } from '../dtos/authDTO';
import { sendResponse } from '../utils/responseHelper';
// import jwt from 'jsonwebtoken'

// @desc Create User account
// @route POST /register
// @access Public
export const createUser = async (req: Request, res: Response ) => {
    try {
        const data: RegisterDTO = req.body;

        if (!data.username || !data.password || !data.role) {
            sendResponse(res, 'error', null, "Please provide all required fields.");
            return;
        }

        const user = await authService.registerUser(data);
        sendResponse(res, 'success', user, 'Register successful.');
    } catch (err) {
        // console.error("Error in registerUser:", err);       
        const errorMessage = (err as Error).message || "Internal server error.";

        sendResponse(res, 'error', err, errorMessage);
    }
};

// @desc User Login
// @route POST /login
// @access Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const data: LoginDTO = req.body;

        if(!data.username || !data.password){
            sendResponse(res, 'error', null, "Please provide all required fields.");
            return;
        }

        const result = await authService.loginUser(data);
        sendResponse(res, 'success', result, 'Login successful');
    } catch (err) {
        const errorMessage = (err as Error).message || "Internal server error.";
        
        sendResponse(res, 'error', null, errorMessage);
    }
};