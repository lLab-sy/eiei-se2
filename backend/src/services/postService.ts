import postRepository from "../repositories/postRepository";
import {
  ImageDisplayDTO,
  ParticipantDetailDTO,
  PostDTO,
  PostSearchRequestDTO,
  PostWithRoleCountDTO,
  OfferDTO,
  OfferResponseDTO,
  OfferRequestDTO,
  PaticipantRatingDTO,
  ProducerDisplayDTO,
} from "../dtos/postDTO";
import Post, {
  IPost,
  GetOfferRequestModel,
  GetPostByProfRequestModel,
  ParticipantDetail,
  participantDetailSchema,
  PostSearchRequestModel,
} from "../models/postModel";
import { PaginatedResponseDTO, PaginationMetaDTO } from "../dtos/utilsDTO";
import cloudService from "./cloudService";
import { OfferHistory } from "../models/postModel";
import { ProducerDto } from "../dtos/producerDTO";
import { ProctionProfessionalReturnGetMeDTO } from "../dtos/authDTO";

class PostService {
  async getAllPosts(queryStr: string): Promise<PostDTO[]> {
    try {
      const posts = await postRepository.getAllPosts(queryStr);

      const result = await Promise.all(
        posts.map(async (post) => {
          const postImages: string[] = await Promise.all(
            post.postImages.map(async (eachImg) => {
              return await cloudService.getSignedUrlImageCloud(eachImg);
            })
          );

          var postImageDisplay: ImageDisplayDTO[] = [];
          for (let i = 0; i < postImages.length; i++) {
            postImageDisplay.push({
              imageURL: postImages[i],
              imageKey: post.postImages[i],
            });
          }
          // console.log("eachP",post.participants)
          return new PostDTO({
            id: post.id.toString(),
            postName: post.postName as string,
            postDescription: post.postDescription as string,
            postImages: postImages as string[],
            postMediaType: post.postMediaType.toString() as string,
            postImagesKey: post.postImages,
            postProjectRolesOut: post.postProjectRoles.map((eachRole) => ({
              id: (eachRole as any)._id.toString(),
              roleName: (eachRole as any).roleName,
            })),
            postImageDisplay: postImageDisplay as ImageDisplayDTO[],
            postStatus: post.postStatus as
              | "created"
              | "in-progress"
              | "success"
              | "cancel",
            participant: post.participants.map(
              (participant) =>
                new ParticipantDetailDTO({
                  participantID: (
                    participant.participantID as any
                  )._id.toString(),
                  participantName: (participant.participantID as any).username,
                  status: participant.status,
                  // offer: participant.offer.map(offer => ({
                  //   role: offer.role.toString(),
                  //   price: offer.price,
                  //   offeredBy: offer.offeredBy,
                  //   createdAt: offer.createdAt,
                  //   reason: offer.reason
                  // })),
                  ratingScore: participant.ratingScore,
                  comment: participant.comment,
                  reviewedAt: participant.reviewedAt || null,
                  createdAt: participant.createdAt,
                  updatedAt: participant.updatedAt,
                })
            ),
            userID: post.userID.toString() as string,
            startDate: post.startDate ? post.startDate.toString() : "",
            endDate: post.endDate ? post.endDate.toString() : "",
          });
        })
      );

      return result;
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Error in service layer: " + error);
    }
  }

  async getPost(id: string): Promise<PostDTO | null> {
    try {
      const post = await postRepository.getPost(id);

      //console.log("Fetched posts:", posts); // Check the structure of the fetched posts
      if (post != null) {
        const postImages = await Promise.all(
          post.postImages.map(async (eachImg) => {
            return await cloudService.getSignedUrlImageCloud(eachImg);
          })
        );

        var postImageDisplay: ImageDisplayDTO[] = [];
        for (let i = 0; i < postImages.length; i++) {
          postImageDisplay.push({
            imageURL: postImages[i],
            imageKey: post.postImages[i],
          });
        }

        const result = new PostDTO({
          id: post.id.toString(),
          postName: post.postName as string,
          postDescription: post.postDescription as string,
          postImages: post.postImages as [string],
          postMediaType: post.postMediaType.toString(),
          postProjectRolesOut: post.postProjectRoles.map((eachRole) => ({
            id: (eachRole as any)._id.toString(),
            roleName: (eachRole as any).roleName,
          })),
          postImageDisplay: postImageDisplay as ImageDisplayDTO[],
          postImagesKey: post.postImages,
          postStatus: post.postStatus as
            | "created"
            | "in-progress"
            | "success"
            | "cancel",
          // postDetailID: post.postDetailID.toString() as string,
          userID: post.userID.toString() as string,
          startDate: post.startDate ? post.startDate.toString() : "",
          endDate: post.endDate ? post.endDate.toString() : "",
        });
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Error in service layer: " + error);
    }
  }

  async getPostsbyUser(
    id: string,
    role: string
  ): Promise<PostWithRoleCountDTO[] | null> {
    try {
      var result;
      if (role == "producer") {
        const posts = await postRepository.getPostsByUser(id);
        if (posts) {
          result = await Promise.all(
            posts.map(async (post) => {
              const postId = post._id ? post._id.toString() : "";
              const postImages = await Promise.all(
                post.postImages.map(async (eachImg: string) => {
                  return await cloudService.getSignedUrlImageCloud(eachImg);
                })
              );
              console.log("......");
              return new PostWithRoleCountDTO({
                id: postId,
                postName: post.postName as string,
                postDescription: post.postDescription as string,
                postImages: postImages as string[],
                postMediaType: post.postMediaType as string,
                roleCount: post.roleCount as number,
                postProjectRoles: post.postProjectRoles as string[],
                postStatus: post.postStatus as
                  | "created"
                  | "in-progress"
                  | "success"
                  | "cancel",
                startDate: post.startDate ? post.startDate.toString() : "",
                endDate: post.endDate ? post.endDate.toString() : "",
              });
            })
          );
          return result;
        }
        return null;
        // console.log(result)
      } else {
        const posts =
          await postRepository.getHistoryPostsByProductionProfessional(id);
        if (posts) {
          result = await Promise.all(
            posts.map(async (post) => {
              const postId = post._id ? post._id.toString() : "";
              const postImages = await Promise.all(
                post.postImages.map(async (eachImg: string) => {
                  return await cloudService.getSignedUrlImageCloud(eachImg);
                })
              );
              // console.log(post.postMediaType)
              return new PostWithRoleCountDTO({
                id: postId,
                producerName: {
                  userID: post.producerName?._id,
                  producerName: post.producerName?.username,
                } as ProducerDisplayDTO,
                postProjectRolesOutProfessional: post.postProjectRolesOut,
                postName: post.postName as string,
                postDescription: post.postDescription as string,
                postImages: postImages as string[],
                postMediaType: post.postMediaType as string,
                roleCount: post.roleCount as number,
                postStatus: post.postStatus as
                  | "created"
                  | "in-progress"
                  | "success"
                  | "cancel",
                startDate: post.startDate ? post.startDate.toString() : "",
                endDate: post.endDate ? post.endDate.toString() : "",
              });
            })
          );
          console.log("POST", posts);
          return result;
        }
        return null;
      }
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Error in service layer: " + error);
    }
  }

  async createPost(postData: PostDTO) {
    try {
      // map to model before pass it to repository
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImages: postData.postImages,
        postMediaType: postData.postMediaType,
        postProjectRoles: postData.postProjectRoles,
        postStatus: postData.postStatus,
        userID: postData.userID,
        startDate: postData.startDate ? postData.startDate : "",
        endDate: postData.endDate ? postData.endDate : "",
      });
      // console.log("postData",postData)
      return await postRepository.createPost(postModel);
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }

  async updatePost(postData: PostDTO, id: string) {
    try {
      // map to model before pass it to repository
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImages: postData.postImages,
        postMediaType: postData.postMediaType,
        postProjectRoles: postData.postProjectRoles,
        postStatus: postData.postStatus,
        startDate: postData.startDate ? postData.startDate : "",
        endDate: postData.endDate ? postData.endDate : "",
      });
      await postRepository.updatePost(postData, id);
      return postModel;
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }

  async deletePost(postData: PostDTO, id: string) {
    try {
      // map to model before pass it to repository
      const postModel = new Post({
        postName: postData.postName,
        postDescription: postData.postDescription,
        postImage: postData.postImages,
        postMediaType: postData.postMediaType,
        postProjectRole: postData.postProjectRoles,
        postStatus: postData.postStatus,
        startDate: postData.startDate ? postData.startDate : "",
        endDate: postData.endDate ? postData.endDate : "",
      });
      await postRepository.deletePost(postData, id);
      return postModel;
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }
  async createOffer(
    offerInput: ParticipantDetailDTO,
    postID: string,
    productionProfessionalID: string
  ) {
    try {
      //first find that have this production professional send offer to this first before
      const offerEvidence = await postRepository.checkProductionProInPost(
        postID,
        productionProfessionalID
      );
      var offerModel: OfferDTO = {
        price: offerInput.price,
        role: offerInput.roleID,
        offeredBy: offerInput.offeredBy,
        createdAt: new Date(),
        reason: offerInput.reason,
      };
      var response;
      //1 = Add OfferHistory
      if (offerEvidence.length > 0) {
        response = await postRepository.addNewOffer(
          offerModel,
          postID,
          productionProfessionalID
        );
      } else {
        //Create New Object
        var participantData = new ParticipantDetailDTO({
          participantID: productionProfessionalID,
          status: "in-progress",
          offer: [offerModel],
          ratingScore: 0,
          comment: "",
          reviewedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        response = await postRepository.createOffer(
          participantData,
          postID,
          productionProfessionalID
        );
      }
      return response;
      // const offer
      // const res = await postRepository.createOffer(offerData,postID,productionProfessionalID)
    } catch (error) {
      throw new Error("Error create offer in service layer: " + error);
    }
  }

  convertModelToDTO(post: IPost): PostDTO {
    const postId = post._id ? post._id.toString() : "";
    // console.log(post.postMediaType)
    return new PostDTO({
      id: postId,
      postName: post.postName as string,
      postDescription: post.postDescription as string,
      postImages: post.postImages as [string],
      postMediaType: post.postMediaType.toString() as string,
      postImagesKey: post.postImages,
      postProjectRoles: post.postProjectRoles.map((eachRole) =>
        eachRole.toString()
      ) as [string],
      participants: post.participants,
      postStatus: post.postStatus as
        | "created"
        | "in-progress"
        | "success"
        | "cancel",
      startDate: post.startDate ? post.startDate.toString() : "",
      endDate: post.endDate ? post.endDate.toString() : "",
    });
  }

  async searchPost(
    postSearchReq: PostSearchRequestDTO
  ): Promise<PaginatedResponseDTO<PostDTO>> {
    try {
      const postM: PostSearchRequestModel = postSearchReq;

      const res = await postRepository.searchPost(postM);
      const resDTO = res.data.map((post) => {
        return new PostDTO({
          id: post._id?.toString(),
          postName: post.postName as string,
          postDescription: post.postDescription as string,
          postImages: post.postImages as [string],
          postMediaType: post.postMediaType.toString() as string,
          postProjectRoles: post.postProjectRoles.map((eachRole) =>
            eachRole.toString()
          ) as [string],
          postStatus: post.postStatus as
            | "created"
            | "in-progress"
            | "success"
            | "cancel",
          // postDetailID: post.postDetailID.toString() as string,
          startDate: post.startDate ? post.startDate : "",
          endDate: post.endDate ? post.endDate : "",
        });
      });

      const response: PaginatedResponseDTO<PostDTO> = {
        data: resDTO,
        meta: {
          page: postSearchReq.page,
          limit: postSearchReq.limit,
          totalItems: res.totalItems,
          totalPages: Math.ceil(res.totalItems / postSearchReq.limit),
        } as PaginationMetaDTO,
      };
      return response;
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }

  public async addPostReview(
    postID: string,
    participantID: string,
    newRating: PaticipantRatingDTO
  ): Promise<PostDTO> {
    try {
      console.log("XX", postID, participantID, newRating);
      newRating.reviewedAt = new Date();

      const rawResult: IPost = await postRepository.addPostReview(
        postID,
        participantID,
        newRating
      );
      return this.convertModelToDTO(rawResult);
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }
  async getOffer(
    offerReq: OfferRequestDTO,
    role: string
  ): Promise<PaginatedResponseDTO<OfferResponseDTO>> {
    try {
      const offerRequest: GetOfferRequestModel = offerReq;
      var res;
      if (role === "producer") {
        res = await postRepository.getProducerOffer(offerRequest);
      } else if (role === "production professional") {
        res = await postRepository.getOffer(offerRequest);
      } else {
        res = await postRepository.getProducerOffer(offerRequest);
      }
      const resDTO = res.data.map((offer) => {
        return new OfferResponseDTO({
          _id: offer._id as string,
          postName: offer.postName,
          roleName: offer.roleName, // Role offered to the participant
          currentWage: offer.currentWage, // The amount offered for the role
          reason: offer.reason,
          offeredBy: offer.offeredBy, // User ID should be better than 0/1 ?
          status: offer.status,
          createdAt: offer.createdAt,
        });
      });
      const response: PaginatedResponseDTO<OfferResponseDTO> = {
        data: resDTO,
        meta: {
          page: offerReq.page,
          limit: offerReq.limit,
          totalItems: res.totalItems,
          totalPages: Math.ceil(res.totalItems / offerReq.limit),
        } as PaginationMetaDTO,
      };
      return response;
    } catch (error) {
      throw new Error("Error in service layer: " + error);
    }
  }

  async getPostsByProf(
    getPostReq: GetPostByProfRequestModel
  ): Promise<PaginatedResponseDTO<PostDTO>> {
    try {
      const postsReq: GetPostByProfRequestModel = getPostReq;
      const res = await postRepository.getPostsByProf(postsReq);

      const resDTO = await Promise.all(
        res.data.map(async (post) => {
          let postImage = post.postImages[0]
            ? await cloudService.getSignedUrlImageCloud(
                post.postImages[0] as string
              )
            : "";
          // console.log('postImage',postImage)
          return new PostDTO({
            id: post._id?.toString(),
            postName: post.postName as string,
            postDescription: post.postDescription as string,
            postImages: [postImage] as [string],
            postMediaType: post.postMediaType.toString() as string,
            postProjectRoles: post.postProjectRoles.map((eachRole) =>
              eachRole.toString()
            ) as [string],
            postStatus: post.postStatus as
              | "created"
              | "in-progress"
              | "success"
              | "cancel",
            startDate: post.startDate ? post.startDate : "",
            endDate: post.endDate ? post.endDate : "",
          });
        })
      );

      const response: PaginatedResponseDTO<PostDTO> = {
        data: resDTO,
        meta: {
          page: getPostReq.page,
          limit: getPostReq.limit,
          totalItems: res.totalItems,
          totalPages: Math.ceil(res.totalItems / getPostReq.limit),
        } as PaginationMetaDTO,
      };

      return response;
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Error in service layer: " + error);
    }
  }
}

// Export an instance of the service
export default new PostService();
