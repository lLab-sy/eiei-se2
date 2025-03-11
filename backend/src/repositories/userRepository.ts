import { ObjectId } from 'mongodb';
import {User, IUser } from '../models/userModel';
import Post from '../models/postModel';
import { error } from 'console';

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

    async getUserReviewsByID(userID: string){
        try{
            const userId = new ObjectId(userID);

            const user = await User.findById(userId);
            if(!user){
                throw new Error("User not found.")
            }
            if(user.role === "production professional"){
                const userReviews = await User.aggregate(
                    [
                      {
                        $match: {
                          _id: userId
                        }
                      },
                      { $unwind: { path: '$rating' } },
                      {
                        $lookup: {
                          from: 'postTypes',
                          localField: 'rating.postID',
                          foreignField: '_id',
                          as: 'rating.post',
                          pipeline: [
                            {
                              $project: {
                                _id: 1,
                                postName: 1,
                                userID: 1,
                                participants: 1
                              }
                            }
                          ]
                        }
                      },
                      {
                        $set: {
                          'rating.post': {
                            $arrayElemAt: ['$rating.post', 0]
                          }
                        }
                      },
                      {
                        $match: {
                          'rating.post.participants': {
                            $elemMatch: {
                              participantID: userId,
                              status: 'candidate'
                            }
                          }
                        }
                      },
                      {
                        $lookup: {
                          from: 'postRoleTypes',
                          localField:
                            'rating.post.participants.offer.role',
                          foreignField: '_id',
                          as: 'rating.role'
                        }
                      },
                      { $unwind: { path: '$rating.role' } },
                      {
                        $lookup: {
                          from: 'users',
                          localField: 'rating.post.userID',
                          foreignField: '_id',
                          as: 'rating.producer',
                          pipeline: [{ $project: { username: 1, profileImage: 1 } }]
                        }
                      },
                      {
                        $set: {
                          'rating.producer': {
                            $arrayElemAt: ['$rating.producer', 0]
                          }
                        }
                      },
                      {
                        $group: {
                          _id: '$rating.ratingScore',
                          amount: { $sum: 1 },
                          reviews: {
                            $addToSet: {
                              postName: '$rating.post.postName',
                              producer: '$rating.producer.username',
                              producerProfileImage: "$rating.producer.profileImage",
                              role: '$rating.role.roleName',
                              comment: '$rating.comment',
                              reviewAt: '$rating.createdAt'
                            }
                          }
                        }
                      },
                      { $sort: { _id: -1 } }
                    ],
                    { maxTimeMS: 60000, allowDiskUse: true }
                  );
                if(!userReviews){
                    throw new Error("User Reviews not found.")
                }
                
                return userReviews;
            }else{
                throw new Error('Error fetching user reviews in repository')
            }          
        } catch(err){
            throw new Error('Error fetching user reviews in repository: ' + err);
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
                    {
                      $unwind: {
                        path: "$rating"
                      }
                    },
                    {
                      $lookup: {
                        from: "postTypes",
                        localField: "rating.postID",
                        foreignField: "_id",
                        as: "rating.post",
                        pipeline: [
                          {
                            $project: {
                              _id: 1,
                              userID: 1
                            }
                          }
                        ]
                      }
                    },
                    {
                      $lookup: {
                        from: "users",
                        localField: "rating.post.userID",
                        foreignField: "_id",
                        as: "rating.producer",
                        pipeline: [
                          {
                            $project: {
                              username: 1,
                              profileImage: 1
                            }
                          }
                        ]
                      }
                    },
                    {
                      $group: {
                        _id: "$_id",
                        reviews: {
                          $addToSet: {
                            reviewerName:
                              "$rating.producer.username",
                            reviewerProfileImage:
                              "$rating.producer.profileImage",
                            ratingScore: "$rating.ratingScore",
                            comment: "$rating.comment"
                          }
                        }
                      }
                    },
                    {
                      $sort: {
                        _id: -1
                      }
                    }
                  ],
                    {maxTimeMS: 60000, allowDiskUse: true}
                );
                if(!userReceivedReviews){
                    throw new Error("this user (production professional) received review not found.")
                }

                return userReceivedReviews;

            }else{//user.role is producer
                const userReceivedReviews = await Post.aggregate(
                  [
                    {
                      $match: {
                        userID: userId
                      }
                    },
                    {
                      $project: {
                        participants: 1,
                        _id: 0
                      }
                    },
                    {
                      $project: {
                        "participants.participantID": 1,
                        "participants.ratingScore": 1,
                        "participants.comment": 1,
                        "participants.status": 1,
                        _id: 0
                      }
                    },
                    {
                      $unwind: {
                        path: "$participants"
                      }
                    },
                    {
                      $match:
                        {
                          "participants.status": "candidate"
                        }
                    },
                    {
                      $lookup: {
                        from: "users",
                        localField: "participants.participantID",
                        foreignField: "_id",
                        as: "rating",
                        pipeline: [
                          {
                            $project: {
                              username: 1,
                              profileImage: 1
                            }
                          }
                        ]
                      }
                    },
                    {
                      $unwind: {
                        path: "$rating"
                      }
                    },
                    {
                      $project: {
                        participantID:
                          "$participants.participantID",
                        ratingScore: "$participants.ratingScore",
                        comment: "$participants.comment",
                        username: "$rating.username",
                        profileImage: "$rating.profileImage"
                      }
                    },
                    {
                      $group: {
                        _id: null,
                        reviews: {
                          $push: {
                            ratingScore: "$ratingScore",
                            comment: "$comment",
                            reviewerName: "$username",
                            reviewerProfileImage: "$profileImage"
                          }
                        }
                      }
                    },
                    {
                      $project: {
                        _id: 0
                      }
                    }
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
