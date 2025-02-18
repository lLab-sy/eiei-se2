import { ObjectId } from 'mongodb';
import {User, IUser } from '../models/userModel';

//change to similar to test using input as I user

class UserRepository {
    async createUser(userData:IUser) {
        try{
            const user = new User(userData);
            return await user.save();
        } catch (err){
            throw new Error('Error create user in repository: ' + err);
        }
        
    }

    async findUserByUsername(username: string){
        try{
            const user = await User.findOne({username});
            return user;
        } catch(err){
            throw new Error('Error finding user by username from repository: ' + err);
        }      
    }
    
    async loginUser(username: string){
        try{
            const user = await User.findOne({username}).select("_id username role password");
            if(!user){
                throw new Error("Invalid username or password")
            }
            return user;
        } catch(err){
            throw new Error('Error logging in user in repository: ' + err);
        }
    }

    async getUserByID(userID: string){
        try{
            const user = await User.findById(userID);
            if(!user){
                throw new Error("User not found.")
            }
            return user;
        } catch(err){
            throw new Error('Error logging in user in repository: ' + err);
        }
    }
    async updateImageKey(key : string, id : string){
        try{
            const objectId = new ObjectId(id);
            const user = await User.findByIdAndUpdate({
                _id : objectId
            },{
                $set : {profileImage : key}
            }, {new : true})
            if(!user){
                throw new Error('User not found.')
            }
            return user;
        }catch(err){
            throw new Error('Error Update Profile Image URL in respository' + err)
        }
    }
}

export default new UserRepository();
