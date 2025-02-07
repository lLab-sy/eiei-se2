import { ObjectId } from 'mongodb';
import Post, { IPost, PostSearchRequestModel, PostSearchResponse } from '../models/postModel';
import { PostDTO } from '../dtos/postDTO';
import PostDetail from '../models/postDetail';
import mongoose, { PipelineStage } from 'mongoose';

class PostRepository {
    public async getAllPosts() {
        try {
             const posts= await Post.find();
             console.log('Posts from database:', posts);
             return posts
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }
    public async getPostsByUser(id:string) {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const posts= await Post.aggregate([
                {
                    $match:{
                        userID: objectId,
                        postStatus: 'success'
                    }
                },
                {
                    $addFields:{
                        roleCount:{ $size: "$postProjectRoles" },
                        postProjectRoles:{ $slice: ["$postProjectRoles", 3]}
                    }
                },
                {
                    $lookup:{
                        from: "postRoleTypes",
                        localField: "postProjectRoles",
                        foreignField: "_id",
                        as: "roleDetails"
                    }
                },
                { 
                    $addFields: {
                        postProjectRoles: "$roleDetails.roleName" // Extract role names only
                    }
                },{
                    $sort:{
                        roleCount:-1
                    }
                },
                {
                    $project: {
                        _id: 1, // Include post's _id
                        postName: 1,
                        postDescription: 1,
                        postImages: 1,
                        postMediaType: 1,
                        postStatus: 1,
                        startDate: 1,
                        endDate: 1,
                        postProjectRoles: 1, // Keep the original role references if needed
                        roleCount: 1,
                        roleDetails: 1
                    }
                }
             ]);
            console.log('Posts from database:', posts);
            return posts
        } catch (error) {
            throw new Error('Error fetching user posts from repository: ' + error);
        }
    }

    public async getPost(id:string) {
        try {
             const objectId = new ObjectId(id);
             const posts= await Post.findById(objectId);
        
             return posts
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }

    public async createPost(postData: IPost) {
        try {
            console.log("Before Create Post")
            const post = new Post(postData);
            const result= await post.save();

            console.log("Create Post Success")
            const postDetailData = new PostDetail({
                postID: result._id, 
                CandidateDetail: [],
              });

            await postDetailData.save();
  
            return result
        } catch (error) {
            throw new Error('Error creating post in repository: ' + error);
        }
    }

    public async updatePost(postData: IPost,id:string) {
        try {
            console.log(postData)
            // console.log(postData.id,"id")
            // const postId = new Object(postData.id);
            const objectId = new ObjectId(id);
            console.log(objectId)
            const updatedPost = await Post.findOneAndUpdate(
                { _id: objectId},  // Query by the provided id
                { $set: postData }, // Set the new post data
              );
            console.log("response",updatedPost)
            // const posts= await Post.findById(objectId);
            return updatedPost;
        } catch (error) {
            throw new Error('Error updating post in repository: ' + error);
        }
    }

    public async deletePost(postData: PostDTO,id:string) {
        try {
            console.log(postData)
            const objectId = new ObjectId(id);
            console.log(objectId)
            const post = await Post.findOneAndDelete(
                { _id: objectId}
              );
            console.log("response",post)
            return post;
        } catch (error) {
            throw new Error('Error deleting post in repository: ' + error);
        }
    }

    public async searchPost(postSearchReq: PostSearchRequestModel): Promise<PostSearchResponse>{
        try {
            const { searchText, postMediaTypes, roleRequirements, limit, page } = postSearchReq;
            // PostSearchQuery from postModel

            const matchStage: PipelineStage[] = [];
            
            if (searchText) {
                matchStage.push({
                    $match: {
                        $or: [
                            { postName: { $regex: searchText, $options: "i" } },
                            { postDescription: { $regex: searchText, $options: "i" } }
                        ]
                    }
                });
            }

            if (postMediaTypes?.length) {
                matchStage.push({
                    $match: {
                        postMediaType: { $in: postMediaTypes}
                    }
                })
            }

            if (roleRequirements?.length) {
                matchStage.push({
                    $match: {
                        postProjectRoles: { $all: postMediaTypes}
                    }
                })
            }
            
            const totalItemstStage: PipelineStage[] = [...matchStage, { $count: "totalCount" }];
            const totalItemsResult = await Post.aggregate(totalItemstStage);
            const totalItems = totalItemsResult.length > 0 ? totalItemsResult[0].totalCount : 0;

            // Pagination
            const pageNumber = Math.max(1, Number(page));
            const pageSize = Math.max(1, Number(limit));
            const skip = (pageNumber - 1) * pageSize;
            
            matchStage.push({ $sort: { score: -1 } }, { $skip: skip }, { $limit: pageSize });

            const results = await Post.aggregate(matchStage)
            const response: PostSearchResponse = {
                data: results,
                totalItems: totalItems
            }
            return response
        } catch (error) {
            throw new Error('Error search post in repository: ' + error);
        }
    }
}

export default new PostRepository();
