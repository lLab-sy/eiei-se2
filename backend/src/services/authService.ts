import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import { RegisterDTO, LoginDTO } from '../dtos/authDTO';
import User from '../models/userModel'

class AuthService {
    async registerUser(data:RegisterDTO) {
        try{
            const existingUser = await userRepository.findUserByUsername(data.username);
            if(existingUser) throw new Error("Username already exists.");

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userModel = new User({
                username: data.username,
                password: hashedPassword,
                role: data.role
            });
            return await userRepository.createUser(userModel);
        } catch (error) {
            throw new Error('Error in service layer: ' + error);
        }
        
    }

    async loginUser(data:LoginDTO){
        try{
            const user = await userRepository.loginUser(data.username);
            if(!user) throw new Error("Invalid username of password.");
            
            const isMatch = await bcrypt.compare(data.password, user.password);
            if(!isMatch) throw new Error("Invalid username or password.");

            //remove password
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password, ...userWithoutPassword} = user.toObject();
            const token = jwt.sign(
                 { userId: user._id, username: user.username, role: user.role},
                 process.env.JWT_SECRET || 'secret_key',
                 { expiresIn: '1h'}
             );
             return {userWithoutPassword, token};
            //return userWithoutPassword;
        } catch (error) {
            throw new Error('Error in service layer: ' + error);
        }
    }
}

export default new AuthService();
