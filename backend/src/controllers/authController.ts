import { Request, Response } from 'express';
import AuthService from '../services/authService';
import { RegisterDTO, LoginDTO } from '../dtos/authDTO';
// import jwt from 'jsonwebtoken'

// @desc Create User account
// @route POST /register
// @access Public
export const createUser = async (req: Request, res: Response ) => {
    try {
        const {username, password, role}: RegisterDTO = req.body;

        const user = await AuthService.registerUser(username, password, role);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.msg });
    }
};

// @desc User Login
// @route POST /login
// @access Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password }: LoginDTO = req.body;

        const result = await AuthService.loginUser(username, password);
        res.status(200).json({ success: true, msg: "Login successful.", data: result });
        // res.status(200).json({ success: true, msg: "Login successful.", data: {user, token} });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.msg });
    }
};