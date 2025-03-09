import { ObjectId } from 'mongodb';
import Post, { IPost, ParticipantDetail, PostSearchRequestModel, PostSearchResponse, PaticipantRating, GetOfferRequestModel, GetOfferResponse, GetPostByProfResponse, GetPostByProfRequestModel } from '../models/postModel';
import { OfferDTO, ParticipantDetailDTO, PostDTO } from '../dtos/postDTO';
import PostDetail from '../models/postDetail';
import mongoose, { PipelineStage } from 'mongoose';
import { Pipe } from 'stream';

class PostRepository {
    public async getAllPosts(queryStr:string) {
        try {
            console.log(queryStr)
             const posts= await Post.find(JSON.parse(queryStr)).populate('postProjectRoles')
             .populate({
                path:'participants.participantID',
                select: 'username'
            });
            //  console.log('Posts from database:', posts);
             return posts
        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }
    public async getPostsByUser(id:string) {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const posts = await Post.aggregate([
                {
                    $match: {
                        userID: objectId,
                        postStatus: 'success'
                    }
                },
                {
                    $addFields: {
                        roleCount: { $size: "$postProjectRoles" },
                        postProjectRoles: { $slice: ["$postProjectRoles", 3] }
                    }
                },
                {
                    $lookup: {
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
                },
                {
                    $lookup: {
                        from: "mediaTypes",
                        localField: "postMediaType",
                        foreignField: "_id",
                        as: "mediaDetails"
                    }
                },
                {
                    $addFields: {
                        postMediaType: { $arrayElemAt: ["$mediaDetails.mediaName", 0] } // Extract first mediaName
                    }
                },
                {
                    $sort: {
                        roleCount: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        postName: 1,
                        postDescription: 1,
                        postImages: 1,
                        postMediaType: 1, // Show mediaName instead of postMediaType
                        postStatus: 1,
                        startDate: 1,
                        endDate: 1,
                        postProjectRoles: 1,
                        roleCount: 1
                    }
                }
            ]);
            console.log('Posts from database:', posts);
            return posts
        } catch (error) {
            throw new Error('Error fetching user posts from repository: ' + error);
        }
    }

    public async getPost(id:string): Promise<IPost> {
        try {
            const objectId = new ObjectId(id);
            const post: IPost | null = await Post.findById(objectId).populate(['postProjectRoles']);
            
            if (!post) {
                throw new Error('Error fetching posts from repository: post is null');
            }

            return post

        } catch (error) {
            throw new Error('Error fetching posts from repository: ' + error);
        }
    }

    public async createPost(postData: IPost) {
        try {
            console.log("Before Create Post")
            console.log(postData)
            const post = new Post(postData);
            const result= await post.save();

            console.log("Create Post Success")
            const postDetailData = new PostDetail({
                postID: result._id, 
                CandidateDetail: [],
              });

            await postDetailData.save();
            console.log("Create Post Detail Success")
            return result
        } catch (error) {
            throw new Error('Error creating post in repository: ' + error);
        }
    }

    public async updatePost(postData: PostDTO,id:string) {
        try {
            // console.log("HELlo",postData)
  
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

    public async createOffer(offerData:ParticipantDetailDTO,postID:string,productionProfessionalID:string){
        console.log("OKAY CREATE  participant")
        try{
            const productionProfessionalObjectID= new ObjectId(productionProfessionalID)
            const postObjectID= new ObjectId(postID)
            const updatePost= await Post.findByIdAndUpdate(
                { _id: postObjectID},  
                { $addToSet: {participants:offerData} }, 
            )
            return updatePost;
        }catch(error){
            throw new Error('Error create offer in repository: ' + error);
        }
    }

    public async addNewOffer(offerData:OfferDTO,postID:string,productionProfessionalID:string){
        console.log("OKAY Add  participant")
        try{
            const productionProfessionalObjectID= new ObjectId(productionProfessionalID)
            const postObjectID= new ObjectId(postID)
            const result = await Post.updateOne(
                {
                    _id: postObjectID,
                    "participants.participantID": productionProfessionalObjectID
                },
                {
                    $push: {
                        "participants.$.offer": {
                            role: new ObjectId(offerData.role), // Role ID reference
                            offeredBy: offerData.offeredBy, 
                            price: offerData.price,
                            reason: offerData.reason,
                            createdAt: new Date()
                        }
                    },
                    $set: {
                        "participants.$.updatedAt": new Date() // Update the timestamp
                    }
                }
            );
            return offerData
        }catch(error){
            throw new Error('Error create offer in repository: ' + error);
        }
    }

    public async checkProductionProInPost(postID:string,productionProfessionalID:string){
        try{
            console.log(postID)
            const productionProfessionalObjectID= new ObjectId(productionProfessionalID)
            const postObjectID= new ObjectId(postID)
            const matchStage: PipelineStage[] = [];

            matchStage.push({
                    $match: {
                      _id: postObjectID
                    }
                })
            matchStage.push({
                $unwind: {
                    path: '$participants',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true
                  }
            })
            matchStage.push({
                $match: {
                    'participants.participantID': productionProfessionalObjectID
                  }
            })
            const totalItemsResult = await Post.aggregate(matchStage);
            return totalItemsResult
        }catch(error){
            throw new Error('Error find production professional in repository: ' + error);
        }
    }

    public async searchPost(postSearchReq: PostSearchRequestModel): Promise<PostSearchResponse>{
        try {
            const { searchText, postMediaTypes, roleRequirements, limit, page } = postSearchReq;
            

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
                const postProjectRoles = roleRequirements.map((eachRole) => {
                    return new ObjectId(eachRole);
                  
                });
                console.log("PostProject",postProjectRoles)
                matchStage.push({
                    $match: {
                        postProjectRoles: { $all: postProjectRoles}
                    }
                })
            }
            console.log("Check2",matchStage)
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
            console.log("ANSWER",response)
            return response
        } catch (error) {
            throw new Error('Error search post in repository: ' + error);
        }
    }

    public async addPostReview(postID: string, participantID: string, newRating: PaticipantRating) {
        try {
            if (!postID) {
                throw new Error("Id is required");
            }
            const result = await Post.findOneAndUpdate(
                {
                  _id: postID,
                  "postStatus": "success", // post success
                  "participants.participantID": participantID, // Ensure has paticipant in post
                  "participants.status": "candidate", // cadidate only
                  "participants.reviewedAt": { $exists: false }, // make sure that no review when add to this post
                },
                { $set: { 
                    "participants.$.ratingScore": newRating.ratingScore,
                    "participants.$.comment": newRating.comment,
                    "participants.$.reviewedAt": newRating.reviewedAt,
                 }}, // Update the matching element
                { new: true, runValidators: true }
            );
            
            if (!result) {
                console.log('not found')
                throw new Error('Production professional (participantID) not found in this Post');
            }

            return result
        }
        catch(err){
            console.log(err)
            throw new Error('Cannot Update this Post: ' + err)
		}
	}

    public async getOffer(getOfferReq: GetOfferRequestModel): Promise<GetOfferResponse>{
        try {
            const { userId, postId, postStatus, limit, page } = getOfferReq;

            const matchStage: PipelineStage.Match = {
                $match: {
                  ...(userId && { 'participants.participantID': new ObjectId(userId) }),
                  ...(postId && { _id: new ObjectId(postId) }),
                  ...(postStatus && { postStatus }),
                },
              };

            const pipeline: PipelineStage[] = [matchStage];

            //unwind participants
            const unwind1: PipelineStage.Unwind = {
                 $unwind: { path: '$participants' } 
            }
            pipeline.push(unwind1);

            //unwind participants.offer
            const unwind2: PipelineStage.Unwind = {
                $unwind: { path: '$participants.offer' } 
            }
            pipeline.push(unwind2);

            //lookup to postRoleTypes
            const lookup: PipelineStage.Lookup ={
                $lookup: {
                    from: 'postRoleTypes',
                    localField: 'participants.offer.role',
                    foreignField: '_id',
                    as: 'roleName'
                  }
            }
            pipeline.push(lookup);

            //set field
            const setStage: PipelineStage.Set = {
                $set: {
                    roleName: {
                      $arrayElemAt: ['$roleName.roleName', 0]
                    },
                    currentWage: '$participants.offer.price',
                    reason: '$participants.offer.reason',
                    offeredBy: '$participants.offer.offerBy',
                    status: "$participants.status",
                    createdAt: '$participants.offer.createdAt'
                  }
            }
            pipeline.push(setStage);

            //project
            const projectStage: PipelineStage.Project = {
                $project: {
                    postName: 1,
                    roleName: 1,
                    currentWage: 1,
                    reason: 1,
                    offeredBy: 1,
                    status:1,
                    createdAt: 1
                  }
            }
            pipeline.push(projectStage);

            console.log("Check2",matchStage)
            const totalItemstStage: PipelineStage[] = [...pipeline, { $count: "totalCount" }];
            const totalItemsResult = await Post.aggregate(totalItemstStage);
            const totalItems = totalItemsResult.length > 0 ? totalItemsResult[0].totalCount : 0;

            // Pagination
            const pageNumber = Math.max(1, Number(page));
            const pageSize = Math.max(1, Number(limit));
            const skip = (pageNumber - 1) * pageSize;

            //sort by date from new to old, push skip and limit
            const sortStage: PipelineStage.Sort = {
                $sort: { createdAt: -1 }
            }
            pipeline.push(sortStage, { $skip: skip }, { $limit: pageSize });

            const results = await Post.aggregate(pipeline)
            const response: GetOfferResponse = {
                data: results,
                totalItems: totalItems
            }
            console.log("ANSWER",response)
            return response
        } catch (error) {
            throw new Error('Error search post in repository: ' + error);
        }
    }

    public async getPostsByProf(getPostByProfReq: GetPostByProfRequestModel): Promise<GetPostByProfResponse>{
        try {
            const { userId, postStatus, limit, page } = getPostByProfReq;
            const objectId = new mongoose.Types.ObjectId(userId);

            const postStatusMatchStage: PipelineStage.Match = {
                $match: {
                  ...(postStatus && { postStatus }),
                },
            };
            
            const pipeline: PipelineStage[] = [postStatusMatchStage];

            const matchStage1: PipelineStage.Match ={
                $match: {
                      'participants.participantID': objectId
                    }
            }
            pipeline.push(matchStage1);

            const unwindStage: PipelineStage.Unwind = {
                $unwind: { path: '$participants' }
            }
            pipeline.push(unwindStage)
            
            const matchStage2: PipelineStage.Match ={
                $match: {
                    'participants.participantID': objectId
                  }
            }
            pipeline.push(matchStage2);

            const totalItemstStage: PipelineStage[] = [...pipeline, { $count: "totalCount" }];
            const totalItemsResult = await Post.aggregate(totalItemstStage);
            const totalItems = totalItemsResult.length > 0 ? totalItemsResult[0].totalCount : 0;

            // Pagination
            const pageNumber = Math.max(1, Number(page));
            const pageSize = Math.max(1, Number(limit));
            const skip = (pageNumber - 1) * pageSize;

            //sort by date from new to old, push skip and limit
            const sortStage: PipelineStage.Sort = {
                $sort: { createdAt: -1 }
            }
            pipeline.push(sortStage, { $skip: skip }, { $limit: pageSize });

            const results = await Post.aggregate(pipeline)
            const response: GetPostByProfResponse = {
                data: results,
                totalItems: totalItems
            }
            console.log("ANSWER",response)
            return response
        } catch (error) {
            throw new Error('Error fetching user posts from repository: ' + error);
        }
    }
}

export default new PostRepository();



 