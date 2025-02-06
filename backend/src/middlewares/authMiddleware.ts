import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/responseHelper";
import jwt from "jsonwebtoken";
import { AuthRequest, AuthJwtPayload } from "../dtos/middlewareDTO";

class AuthMiddleware {
  authenticate = async (req: AuthRequest, res: Response, next: NextFunction):Promise<void> => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendResponse(res, "unauthorized", null, "Access denied. No token provided.");
      return;
      //return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key") as AuthJwtPayload;
      // (req as any).user = decoded; //store user data in request object (I'm not sure what it is, be careful the 'any')
      if(!decoded){
        sendResponse(res, "unauthorized", null, "Invalid token.");
        return;
      }
      req.user = {
        userId:decoded.userId,
        username: decoded.username,
        role: decoded.role
      };
      // console.log(decoded);
      next(); //move to next [middleware or route]
    } catch (error) {
      sendResponse(res, "unauthorized", error, "Invalid token.");
      return;
      //res.status(401).json({ message: "Invalid token." });
    }
  };

  authorize = (roles: string[])=> {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!roles.includes(user.role)) {
        sendResponse(res, "forbidden", null, "Access denied. You do not have permission.");
        return;
        //return res.status(403).json({ message: "Access denied. You do not have permission." });
      }
      next(); //move to next [middleware or route]
    };
  };
}

export default new AuthMiddleware();

/*
Example usage but I'm not sure that it will work. 
import express from 'express';
import * as AuthController from '../controllers/authController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', AuthController.loginUser);

// middleware for verify token
router.get('/profile', AuthMiddleware.authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'Profile accessed', user });
});

// middleware for verify authority (case admin)
router.get('/admin', AuthMiddleware.authenticate, AuthMiddleware.authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;
*/
