import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel'
// import jwt from 'jsonwebtoken'

// @desc Create User account
// @route POST /register
// @access Public
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        const {username, password, role}: {username: string, password: string, role: string} = req.body;

        // Check if all fields are provided
        if (!username || !password || !role) {
            res.status(400).json({ success: false, msg: "Please provide all required fields." });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const user = await User.create({
            username,
            password: hashedPassword,
            role
        });

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ success: false, msg: "Username already exists." });
        } else {
            res.status(400).json({ success: false, msg: "Error, Cannot create user." });
        }
    }
};

// @desc User Login
// @route POST /login
// @access Public
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password }: { username: string, password: string } = req.body;

        // Check if all fields are provided
        if (!username || !password) {
            res.status(400).json({ success: false, msg: "Please provide both username and password." });
            return;
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ success: false, msg: "Invalid username or password." });
            return;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, msg: "Invalid username or password." });
            return;
        }
        
        // Generate jwt token
        // const token = jwt.sign(
        //     { userId: user._id, username: user.username, role: user.role},
        //     process.env.JWT_SECRET || 'secret_key',
        //     { expiresIn: '1h'} //expires time
        // )
        
        res.status(200).json({ success: true, msg: "Login successful.", data: {user} });
        // res.status(200).json({ success: true, msg: "Login successful.", data: {user, token} });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error." });
    }
};