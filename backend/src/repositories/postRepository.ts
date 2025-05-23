import { ObjectId } from 'mongodb';
import Post, { IPost, ParticipantDetail, PostSearchRequestModel, PostSearchResponse, PaticipantRating, GetOfferRequestModel, GetOfferResponse, GetPostByProfResponse, GetPostByProfRequestModel, GetPostByProducerRequestModel, SendApproveRequestModel } from '../models/postModel';
import { ChangeParticipantStatusDTO, OfferDTO, ParticipantDetailDTO, PostDTO } from '../dtos/postDTO';
import PostDetail from '../models/postDetail';
import mongoose, { FilterQuery, PipelineStage, ProjectionFields, UpdateQuery } from 'mongoose';
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
                        participants: 1,
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

    public async getHistoryPostsByProductionProfessional(id:string){
        try{
            const matchStage: PipelineStage[] = [];
            matchStage.push({
                $unwind: {
                    path: '$participants',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true
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
                    $and: [
                      {
                        'participants.participantID':
                          new ObjectId(id)
                      },
                      { 'participants.status': 'candidate' }
                    ]
                  }
            })

            matchStage.push({
                $project: {
                    endDate: 1,
                    postDescription: 1,
                    postImages: 1,
                    postMediaType: 1,
                    postName: 1,
                    participants: 1,
                    postProjectRolesOut: {
                      $arrayElemAt: [
                        '$participants.offer.role',
                        -1
                      ]
                    },
                    postStatus: 1,
                    startDate: 1,
                    producerName: '$userID'
            }})

            matchStage.push({
                
                    $lookup: {
                        from: 'postRoleTypes',
                        localField: 'postProjectRolesOut',
                        foreignField: '_id',
                        as: 'postProjectRolesOut'
                    }
            })

            matchStage.push({
                $lookup: {
                    from: 'users',
                    localField: 'producerName',
                    foreignField: '_id',
                    as: 'producerName'
                  }
            })

            matchStage.push({
                $project: {
                    endDate: 1,
                    postDescription: 1,
                    postImages: 1,
                    postMediaType: 1,
                    postName: 1,
                    participants: 1,
                    postProjectRolesOut: {
                      $arrayElemAt: [
                        '$postProjectRolesOut',
                        0
                      ]
                    },
                    postStatus: 1,
                    startDate: 1,
                    producerName: {
                      $arrayElemAt: ['$producerName', 0]
                    }
                  }
            })
            const totalItemsResult = await Post.aggregate(matchStage);
            return totalItemsResult
        }catch(error) {
            throw new Error('Error Get Posts history Production professional from repository: ' + error);
        }
    }

    public async getPost(id:string) {
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

            matchStage.push({
              $match: {
                postStatus: { $in: ["created", "waiting"] }
              }
            })
            
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
                const postMediaTypesID = postMediaTypes.map((eachType) => {
                    return new ObjectId(eachType);
                  
                });
                matchStage.push({
                    $match: {
                        postMediaType: { $in: postMediaTypesID}
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

    public async startProject(postId: string, userId: string): Promise<void> {
        try {
            if (!postId) {
                throw new Error("Id is required");
            }

            const result = await Post.findOneAndUpdate(
                {
                    _id: postId,
                    "postStatus": "waiting", // have at least 1 cadidate
                    "userID": userId 
                },
                { $set: { 
                    "postStatus": 'in-progress',
                    "startDate":new Date()
                 }}, // Update the matching element
                { new: true, runValidators: true }
            );
            
            if (!result) {
                throw new Error('Post not found or post status not match');
            }

            return;
        }
        catch(err){
            throw new Error('Error in postRepository startProject : ' + err)
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
                  // "participants.reviewedAt": null, // make sure that no review when add to this post
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

    //User ID ของบูมเป็น production professional ของเราใช้แค่ postID น่าจะพอ (userID optional เผื่อจะแยกแชทต่อคน)
    public async getProducerOffer(getOfferReq: GetOfferRequestModel,producerID:string): Promise<GetOfferResponse>{
        try {
            const { userId, postId, postStatus, limit, page } = getOfferReq;

            const matchStage: PipelineStage[] = [];
            
            matchStage.push({ //SECURITY
                $match: {
                    userID: new ObjectId(producerID)
                  }
            })

            if(postId){ //posId if it has
                matchStage.push({
                    $match: {
                        _id: new ObjectId(postId)
                      }
                    })
            }

            if(postStatus){ // postStatus If it has
                matchStage.push({
                    $match: { postStatus: 'success' }
                })
            }

            matchStage.push({ //unwind paticipant
                $unwind: {
                    path: '$participants',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: false
                  }
            })

            matchStage.push({ //unwind each offer
                $unwind: {
                    path: '$participants.offer',
                    includeArrayIndex: 'string',
                    preserveNullAndEmptyArrays: true
                  }
            })

            if(userId){
                matchStage.push({ //paticipant in post if it has
                    $match: {
                        'participants.participantID': new ObjectId(
                        userId
                        )
                    }
                    
                })
            }

            matchStage.push({ // change roleID -> roleName
                $lookup: {
                    from: 'postRoleTypes',
                    localField: 'participants.offer.role',
                    foreignField: '_id',
                    as: 'roleName'
                }
            })

            matchStage.push({
                $project: {
                    _id: 1,
                    postName: 1,
                    participantsID:
                      '$participants.participantID',
                    roleName: {
                      $arrayElemAt: ['$roleName.roleName', 0]
                    },
                    currentWage: '$participants.offer.price',
                    reason: '$participants.offer.reason',
                    offeredBy:
                      '$participants.offer.offeredBy',
                    status: '$participants.status',
                    createdAt: '$participants.createdAt'
                  }
            })

            matchStage.push({
                $lookup: {
                    from: 'users',
                    localField: 'participantsID',
                    foreignField: '_id',
                    as: 'parti'
                  }
            })

            matchStage.push({
                $project: {
                    user: { $arrayElemAt: ['$parti', 0] },
                    postName: 1,
                    participantsID: 1,
                    roleName: 1,
                    currentWage: 1,
                    reason: 1,
                    offeredBy: 1,
                    status: 1,
                    createdAt: 1
                  }
            })

            matchStage.push({
                $project: {
                    postName: 1,
                    participantsID: 1,
                    roleName: 1,
                    currentWage: 1,
                    reason: 1,
                    offeredBy: 1,
                    status: 1,
                    createdAt: 1,
                    userName: '$user.username'
                  }
            })

            matchStage.push({
                $group: {
                    _id: '$participantsID',
                    offers: { $push: '$$ROOT' }
                  }
            })
            // console.log("Check2",matchStage)
            const totalItemstStage: PipelineStage[] = [...matchStage, { $count: "totalCount" }];
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
            matchStage.push(sortStage, { $skip: skip }, { $limit: pageSize });

            const results = await Post.aggregate(matchStage)
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
                    offeredBy: '$participants.offer.offeredBy',
                    status: "$participants.status",
                    participantID: '$participants.participantID',
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
                    createdAt: 1,
                    participantID: 1,
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
            const { userId, postStatus, limit, page, postMediaTypes, searchText,participantStatus  } = getPostByProfReq;
            const objectId = new mongoose.Types.ObjectId(userId);

            // const postStatusMatchStage: PipelineStage.Match = {
            //     $match: {
            //       ...(postStatus && { postStatus }),
            //     },
            // };
            
            // const pipeline: PipelineStage[] = [postStatusMatchStage];
            const pipeline: PipelineStage[] = [];
            if (postStatus?.length) {
                pipeline.push({
                    $match: {
                        postStatus: { $in: postStatus}
                    }
                })
            }
            const matchStage1: PipelineStage.Match ={
                $match: {
                      'participants.participantID': objectId
                    }
            }
            pipeline.push(matchStage1);

            if (postMediaTypes?.length) {
                const postMediaTypesID = postMediaTypes.map((eachType) => {
                    return new ObjectId(eachType);
                  
                });
                pipeline.push({
                    $match: {
                        postMediaType: { $in: postMediaTypesID}
                    }
                })
            }


            if (searchText) {
                pipeline.push({
                    $match: {
                        $or: [
                            { postName: { $regex: searchText, $options: "i" } },
                            { postDescription: { $regex: searchText, $options: "i" } }
                        ]
                    }
                });
            }

            const unwindStage: PipelineStage.Unwind = {
                $unwind: { path: '$participants' }
            }
            pipeline.push(unwindStage)
            
            const matchStage3: PipelineStage.Match ={
                $match: {
                    'participants.participantID': objectId
                  }
            }
            pipeline.push(matchStage3);

            
            if(participantStatus){
                const matchStage2: PipelineStage.Match={
                    $match: {
                        'participants.status': participantStatus
                    }
                }
                pipeline.push(matchStage2);
            }

            const lookupStage1: PipelineStage.Lookup ={
                $lookup: {
                    from: "mediaTypes",
                    localField: "postMediaType",
                    foreignField: "_id",
                    as: "postMediaTypeOut"
                  }
            }
            pipeline.push(lookupStage1);

            const projectStage1: PipelineStage.Project ={
                $project: {
                    postName:1,
                    postDescription:1,
                  postImages:1,
                  postProjectRoles:1,
                  postStatus:1,
                  startDate:1,
                  endDate:1,
                  createdAt:1,
                  updatedAt:1,
                  postMediaType: {
                    $arrayElemAt: ["$postMediaTypeOut", 0]
                  }
                }
                
            }
            pipeline.push(projectStage1);

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
            console.log("ANSWER Prof",response)
            return response
        } catch (error) {
            throw new Error('Error fetching user posts from repository: ' + error);
        }
    }

    async getPostParticipants(postId: string) {
      try {
        const objectId = new ObjectId(postId);
        const post = await Post.findById(objectId)
          .populate({
            path: "participants.participantID",
            // select: "username rating _id",
          })
          .populate({
            path: "participants.offer.role",
            select: "roleName",
          });
  
        if (!post) {
          throw new Error("Post not found");
        }
  
        // กรองเฉพาะ participants ที่มีสถานะ "candidate"
        const participants = post.participants.filter(
          (p) => p.status === "candidate"
        );
        return participants.map((participant) => {
          // หาบทบาทล่าสุดจาก offers (ถ้ามี)
          const latestOffer =
            participant.offer && participant.offer.length > 0
              ? participant.offer[participant.offer.length - 1]
              : null;
  
          const roleName =
            latestOffer && latestOffer.role
              ? (latestOffer.role as any).roleName
              : "Unknown Role";
  
          const isReview = (participant.participantID as any).rating.some(
            (eachRating: { postID: any }) => eachRating.postID == post.id
          );
  
          return {
            id: (participant.participantID as any)._id.toString(),
            label: `${(participant.participantID as any).username} - ${roleName}`,
            isReview: isReview,
          };
        });
      } catch (error) {
        throw new Error("Error fetching post participants: " + error);
      }
    }
    public async getPostsByProducer(getPostByProducerReq: GetPostByProducerRequestModel): Promise<GetPostByProfResponse>{ //no need to change name
        try {
            const { userId, postStatus, limit, page, postMediaTypes, searchText  } = getPostByProducerReq;
            const objectId = new mongoose.Types.ObjectId(userId);

            const postStatusMatchStage: PipelineStage.Match = {
                $match: {
                  ...(postStatus && { postStatus }),
                },
            };
            
            const pipeline: PipelineStage[] = [postStatusMatchStage];

            const matchStage1: PipelineStage.Match ={
                $match: {
                      'userID': objectId
                    }
            }
            pipeline.push(matchStage1);

            if (postMediaTypes?.length) {
                const postMediaTypesID = postMediaTypes.map((eachType) => {
                    return new ObjectId(eachType);
                  
                });
                pipeline.push({
                    $match: {
                        postMediaType: { $in: postMediaTypesID}
                    }
                })
            }


            if (searchText) {
                pipeline.push({
                    $match: {
                        $or: [
                            { postName: { $regex: searchText, $options: "i" } },
                            { postDescription: { $regex: searchText, $options: "i" } }
                        ]
                    }
                });
            }
            

            const lookupStage1: PipelineStage.Lookup ={
                $lookup: {
                    from: "mediaTypes",
                    localField: "postMediaType",
                    foreignField: "_id",
                    as: "postMediaTypeOut"
                  }
            }
            pipeline.push(lookupStage1);

            const projectStage1: PipelineStage.Project ={
                $project: {
                    postName:1,
                    postDescription:1,
                  postImages:1,
                  postProjectRoles:1,
                  postStatus:1,
                  startDate:1,
                  endDate:1,
                  createdAt:1,
                  updatedAt:1,
                  postMediaType: {
                    $arrayElemAt: ["$postMediaTypeOut", 0]
                  }
                }
                
            }
            pipeline.push(projectStage1);


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
            // console.log("ANSWER",response)
            return response
        } catch (error) {
            throw new Error('Error fetching user posts from repository: ' + error);
        }
    }
    
    public async getPostParticipant(id:string, participantID:string): Promise<ParticipantDetail[]> {
        try {
            // console.log("HELlo",postData)

            const filter: FilterQuery<IPost> = {
                _id: id
            }

            if (participantID != '') {
                filter["participants.participantID"] = participantID
            }

            const project: ProjectionFields<IPost> = {};

            switch (true) {
                case participantID!='': project['participants.$'] = 1;break;
                default: project['participants'] = {
                    $filter: {
                      input: "$participants",
                      as: "p",
                      cond: { $eq: ["$$p.status", "candidate"] },
                    },
                }
            }

            const post:IPost[]|null = await Post.find(
                filter,
                project
            ).populate({path:"participants.offer.role"})
            .populate({
                path:"participants.participantID",
                select:"username _id firstname middlename lastname"
            });

            if (!post) {
                throw new Error('Post or participant not found')
            }

            return post[0].participants;
        } catch (error) {
            throw new Error('Error getPostParticipant in post repository: ' + error);
        }
    }

    public async sendSubmission(id:string, participantID:string): Promise<void>{
        try {
            // console.log("HELlo",postData)
            const post = await Post.findOneAndUpdate(
                {
                    _id: id,
                    "postStatus": "in-progress", // post success
                    "participants.participantID": participantID, // Ensure has paticipant in post
                    "participants.status": "candidate", // cadidate only
                    "participants.workQuota": { $gt: 0 }
                  // "participants.reviewedAt": null, // make sure that no review when add to this post
                },
                { 
                    $set: { 
                        "participants.$.isSend": true,
                    },
                    $inc: { "participants.$.workQuota": -1 },
                    $push: {
                        "participants.$.submissions": new Date()
                    }
                }, // Update the matching element
                { new: true, runValidators: true }
            );

            if (!post) {
                throw new Error('Post not found or no more quota')
            }

            // const posts= await Post.findById(objectId);
            return;
        } catch (error) {
            throw new Error('Error submission in post repository: ' + error);
        }
    }
    
    public async sendApprove(sendApproveReq: SendApproveRequestModel): Promise<void> {
        try {
            const filter: FilterQuery<IPost> = {
                _id: sendApproveReq.postId,
                postStatus: "in-progress",
            };
    
            const update: UpdateQuery<IPost> = {};
    
            // ถ้ามี userId ที่กำหนด -> อัปเดตเฉพาะ participant ที่มี participantID ตรงกัน
            if (sendApproveReq.userId !== '') {
                filter["participants.participantID"] = sendApproveReq.userId;
                update["$set"] = {
                    "participants.$[elem].isApprove": sendApproveReq.isApprove
                };
    
                if (!sendApproveReq.isApprove) {
                    update["$set"]["participants.$[elem].isSend"] = false;
                }
            } else if (sendApproveReq.isApprove) {
                // ถ้า userId เป็น "" และกำลัง approve -> เปลี่ยน postStatus เป็น "success"
                update["$set"] = { 
                    postStatus: "success",
                    endDate: new Date(), 
                };
                update["$set"]["participants.$[].isApprove"] = true;
            }
    
            const post = await Post.findOneAndUpdate(
                filter,
                update,
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: sendApproveReq.userId !== '' ? [{ "elem.participantID": sendApproveReq.userId }] : undefined
                }
            );
    
            if (!post) {
                throw new Error('Post not found');
            }
    
            return;
        } catch (error) {
            throw new Error('Error submission in post repository: ' + error);
        }
    }
    
    public async changeParticipantStatus(dto: ChangeParticipantStatusDTO): Promise<void>{
        try{
            const post: IPost | null = await Post.findOne({ _id: dto.postID });
            if (!post) {
                throw new Error(`Post with ID ${dto.postID} not found`);
            }

            // Check producerId to matach with userID from post
            if(dto.role === 'producer' && post.userID.toString() !== dto.actionBy){
                throw new Error(`You do not have permission to access or modify this post(Post ID: ${dto.postID})`);
            }

            // Find the participant in the post's participants array
            const participant = post.participants.find((p) => p.participantID.toString() === dto.participantID);
            
            switch(true) {
                case !participant: throw new Error('Participant not found');break;
                case participant && participant.status !== 'in-progress': throw new Error('Participant is not in progress');break;
                case dto.statusToChange == 'candidate' && post.postStatus == 'created' : post.postStatus = 'waiting';break;
            }

            const latestOffer = participant.offer.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

            if (!latestOffer) {
                throw new Error('No offers found for this participant');
            }

            if ((latestOffer.offeredBy === (dto.role === "producer"? 1:0)) && dto.statusToChange === "candidate") {
                throw new Error("Cannot confirm offer which is created by yourself");
            }

            participant.status = dto.statusToChange;
            await post.save();
        }catch(error){
            throw new Error('Error change participant status in repository: ' + error);
        }
    }

    public async sumLatestCandidateOffers(userId: string, postId: string): Promise<number> {
        try {
            const post = await Post.findById(postId);
            if(!post || (post.userID.toString() !== userId)){
                throw new Error("You don't have permission to access this post");
            }
            const pipeline: PipelineStage[] = [
                {
                  $match: {
                    _id: new ObjectId(postId)
                  }
                },
                {
                  $unwind: {
                    path: '$participants',
                    preserveNullAndEmptyArrays: true // Keeps post even if no participants
                  }
                },
                {
                  $addFields: {
                    isCandidate: {
                      $cond: [{ $eq: ['$participants.status', 'candidate'] }, true, false]
                    }
                  }
                },
                {
                  $addFields: {
                    sortedOffers: {
                      $cond: [
                        {
                          $and: [
                            '$isCandidate',
                            { $gt: [{ $size: '$participants.offer' }, 0] }
                          ]
                        },
                        {
                          $sortArray: {
                            input: '$participants.offer',
                            sortBy: { createdAt: -1 }
                          }
                        },
                        []
                      ]
                    }
                  }
                },
                {
                  $addFields: {
                    latestOffer: { $arrayElemAt: ['$sortedOffers', 0] }
                  }
                },
                {
                  $addFields: {
                    offerPrice: {
                      $cond: [
                        '$isCandidate',
                        {
                          $cond: [
                            { $gt: [{ $size: '$sortedOffers' }, 0] },
                            '$latestOffer.price',
                            0
                          ]
                        },
                        0
                      ]
                    }
                  }
                },
                {
                  $group: {
                    _id: null,
                    totalOfferSum: { $sum: '$offerPrice' }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    totalOfferSum: 1
                  }
                }
              ];
      
          const result = await Post.aggregate(pipeline);
      
          return result.length > 0 ? result[0].totalOfferSum : 0;
        } catch (error) {
          console.error('Error calculating latest candidate offers:', error);
          throw new Error('Error calculating total latest offers for candidates');
        }
      }

      public async getOneCandidatePrice(postId: string, professionalId: string): Promise<number> {
        try {
          const post = await Post.findById(postId);
          if (!post) {
            throw new Error("This post does not exist");
          }
      
          const pipeline: PipelineStage[] = [
            {
              $match: { _id: new ObjectId(postId) }
            },
            {
              $unwind: '$participants'
            },
            {
              $match: {
                'participants.userID': new ObjectId(professionalId),
                'participants.status': 'candidate'
              }
            },
            {
              $addFields: {
                sortedOffers: {
                  $cond: [
                    { $gt: [{ $size: '$participants.offer' }, 0] },
                    {
                      $sortArray: {
                        input: '$participants.offer',
                        sortBy: { createdAt: -1 }
                      }
                    },
                    []
                  ]
                }
              }
            },
            {
              $addFields: {
                latestOffer: { $arrayElemAt: ['$sortedOffers', 0] }
              }
            },
            {
              $project: {
                _id: 0,
                price: {
                  $cond: [
                    { $gt: [{ $size: '$sortedOffers' }, 0] },
                    '$latestOffer.price',
                    0
                  ]
                }
              }
            }
          ];
      
          const result = await Post.aggregate(pipeline);
          return result.length > 0 ? result[0].price : 0;
        } catch (error) {
          console.error('Error retrieving candidate price:', error);
          throw new Error('Error retrieving candidate price');
        }
      }
      
      
}


export default new PostRepository();



 