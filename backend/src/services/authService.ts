import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import { RegisterDTO, ReturnRegisterDTO, LoginDTO, ReturnLoginDTO } from "../dtos/authDTO";
import { User } from "../models/userModel";
import { Types } from "mongoose";

class AuthService {
  async registerUser(data: RegisterDTO) {
    try {
      const existingUser = await userRepository.findUserByUsername(data.username);
      if (existingUser) throw new Error("Username already exists.");

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const userModel = new User({
        username: data.username,
        password: hashedPassword,
        role: data.role,
      });
      const user = await userRepository.createUser(userModel);
      
      const returnRegisterUser: ReturnRegisterDTO = {
        username: user.username,
        role: user.role
      }
      return returnRegisterUser
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }

  async loginUser(data: LoginDTO) {
    try {
      const user = await userRepository.loginUser(data.username);
      //console.log(`user: ${user}`);
      if (!user) throw new Error("Invalid username of password.");

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) throw new Error("Password is not correct.");

      // Convert _id to string safely
      const userId = (user._id as Types.ObjectId).toString();
      
      const token = jwt.sign(
        { userId: userId, username: user.username, role: user.role },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "1h" }
      );
      //console.log(user.username);
      const returnLoginUser: ReturnLoginDTO = {
        token,
        user: {
          id:userId,
          username: user.username,
          role: user.role,
        },
      };

      return returnLoginUser;
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }
}

export default new AuthService();
