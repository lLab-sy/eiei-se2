import User from '../models/userModel';

class UserRepository {
    async createUser(data:{ username: string, password: string, role: string}) {
        return await User.create(data);
    }

    async findUserByUsername(username: string){
        return await User.findOne({username});
    }
    
    async loginUser(username: string){
        return await User.findOne({username}).select("password");
    }
}

export default new UserRepository();