import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
// import {User} from '../models/userModel';

class AuthService {
    async registerUser(username: string, password: string, role: string) {
        const existingUser = await userRepository.findUserByUsername(username);
        if(existingUser) throw new Error("Username already exists.");

        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepository.createUser({username, password: hashedPassword, role});
    }

    async loginUser(username: string, password:string){
        const user = await userRepository.findUserByUsername(username);
        if(!user) throw new Error("Invalid username of password.");

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw new Error("Invalid username or password.");

        // const token = jwt.sign(
        //     { userId: user._id, username: user.username, role: user.role},
        //     process.env.JWT_SECRET || 'secret_key',
        //     { expiresIn: '1h'}
        // );
        // return {user, token};
        return user;
    }
}

export default new AuthService();