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

    async getUserReceivedReviewsByID(userID:string){
        try{
            const userId = new ObjectId(userID);
            const user = await User.findById(userId);
            if(!user){
                throw new Error ("User not found")
            }
            if(user.role === "production professional"){
                const userReceivedReviews = await User.aggregate(
                    [
                        {
                            $match: {
                                _id: userId
                            }
                        },
                        { $unwind: {path: '$rating'} },
                        {
                            $lookup:{
                                from:'postTypes',
                                localField: 'rating.postID',
                                foreignField: '_id',
                                as:'rating.post',
                                pipeline:[
                                    {
                                        $project:{
                                            _id:1,
                                            userID:1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup:{
                                from: 'users',
                                localField: 'rating.post.userID',
                                foreignField: '_id',
                                as: 'rating.producer',
                                pipeline: [
                                    {
                                        $project:{
                                            username:1,
                                            profileImage:1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $group:{
                                _id: "$_id",
                                reviews:{
                                    $addToSet:{
                                        reviewerName: '$rating.producer.username',
                                        reviewerProfileImage: '$rating.producer.profileImage',
                                        ratingScore: '$rating.ratingScore',
                                        comment:'$rating.comment'
                                    }
                                }
                            }
                        },
                        { $sort:{_id:-1}}
                    ],
                    {maxTimeMS: 60000, allowDiskUse: true}
                );
                if(!userReceivedReviews){
                    throw new Error("this user (production professional) received review not found.")
                }

                return userReceivedReviews;

            }else{//user.role is producer
                const userReceivedReviews = await User.aggregate(
                    [
                        {
                            $match:{
                                _id:userId
                            }
                        },
                        { $unwind: {path: '$rating'}},
                        {
                            $lookup:{
                                from: 'postTypes',
                                localField: 'rating.postID',
                                foreignField: '_id',
                                as: 'rating.post',
                                pipeline:[
                                    {
                                        $project:{
                                            _id:1,
                                            participants:1
                                        }
                                    }
                                ]
                            }
                        },
                        { $unwind: {path:'$rating.post.participants'}},
                        {
                            $lookup:{
                                from: 'users',
                                localField: 'rating.post.participants.participantID',
                                foreignField: '_id',
                                as: 'rating.producprofes',
                                pipeline:[
                                    {
                                        $project:{
                                            username: 1,
                                            profileImage: 1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $set:{
                                "rating.producprofes": { $arrayElemAt: ["$rating.producprofes", 0] }
                            }
                        },
                        {
                            $group:{
                                _id:'$_id',
                                reviews:{
                                    $addToSet:{
                                        reviewerName:"$rating.producprofes.username",
                                        reviewProfileImage: "$rating.producprofes.profileImage",
                                        ratingScore: "$rating.ratingScore",
                                        comment: "$rating.comment"
                                    }
                                }
                            }
                        },
                        { $sort:{_id:-1}}
                    ],
                    { maxTimeMS: 60000, allowDiskUse: true}
                );

                if(!userReceivedReviews){
                    throw new Error("this user (producer) received review not found.")
                }

                return userReceivedReviews;

            }

        }catch(err){
            throw new Error('Error repository fetching user received reviews: '+err);
        }
    }
}

export default new UserRepository();
