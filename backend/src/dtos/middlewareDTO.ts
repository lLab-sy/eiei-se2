import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user: { userId: string, username: string, role: string };
}

export interface AuthJwtPayload extends JwtPayload {
  userId: string,
  username: string,
  role: string
}