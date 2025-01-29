import { Request, Response } from 'express';
import authService from '../services/authService';
import { RegisterDTO, LoginDTO } from '../dtos/authDTO';
// import jwt from 'jsonwebtoken'

// @desc Create User account
// @route POST /register
// @access Public
export const createUser = async (req: Request, res: Response ) => {
    try {
        const { username, password, role }: RegisterDTO = req.body;

        if (!username || !password || !role) {
            res.status(400).json({ success: false, msg: "Please provide all required fields." });
            return;
        }

        const user = await authService.registerUser(username, password, role);

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        console.error("Error in registerUser:", err);
        
        const errorMessage = (err as Error).message || "Internal server error.";

        res.status(500).json({ success: false, msg: errorMessage });
    }
};

// @desc User Login
// @route POST /login
// @access Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password }: LoginDTO = req.body;

        if(!username || !password){
            res.status(400).json({ success: false, msg: "Please provide all required fields." });
            return;
        }

        const result = await authService.loginUser(username, password);
        res.status(200).json({ success: true, msg: "Login successful.", data: result });
        // res.status(200).json({ success: true, msg: "Login successful.", data: {user, token} });
    } catch (err) {
        const errorMessage = (err as Error).message || "Internal server error.";
        
        res.status(400).json({ success: false, msg: errorMessage});
    }
};