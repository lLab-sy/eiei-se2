import { NextFunction, Request, Response } from "express";
// import * as testService from '../services/testService';
import postService from "../services/postService";
import { sendResponse } from "../utils/responseHelper";
import {
  PostSearchRequestDTO,
  PaticipantRatingDTO,
  OfferRequestDTO,
  GetPostByProfDTO,
} from "../dtos/postDTO";
import { AuthRequest } from "../dtos/middlewareDTO";
import postDetailService from "../services/postDetailService";
import cloudService from "../services/cloudService";

class PostController {
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      //Handler Query
      const reqQuery = { ...req.query };
      const removeFields = ["select", "sort"];
      removeFields.forEach((param) => delete reqQuery[param]);
      let queryStr = JSON.stringify(req.query);
      //Handler Compare
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|e)\b/g,
        (match) => `$${match}`
      );
      const posts = await postService.getAllPosts(queryStr);
      console.log("Fetched posts:", posts); // Log fetched posts
      sendResponse(res, "success", posts, "Successfully retrieved posts");
    } catch (err) {
      sendResponse(res, "error", err, "Failed to retrieve posts");
    }
  }

  async getPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      console.log("Hello getPost");
      const posts = await postService.getPost(postId);
      // console.log('Fetched posts:', posts);  // Log fetched posts
      sendResponse(res, "success", posts, "Successfully retrieved post");
    } catch (err) {
      sendResponse(res, "error", err, "Failed to retrieved posts");
    }
  }

  async getPostsByUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const role = req.user.role;
      const posts = await postService.getPostsbyUser(
        req.user.userId,
        req.user.role
      );

      console.log("Fetched posts:", posts); // Log fetched posts
      sendResponse(
        res,
        "success",
        posts,
        `Successfully retrieved ${posts ? posts.length : 0} posts`
      );
      return;
    } catch (err) {
      sendResponse(res, "error", err, "Failed to retrieve posts");
    }
  }
  //
  //@Private Request from Producer Role only and userID from frontEnd isMatch
  async createPost(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //Front End
      req.body = JSON.parse(req.body.postData);

      //unauthorize
      if (
        req.user.userId != req.body.userID ||
        req.user.role == "production professional"
      ) {
        console.log(req.user.role, req.body.userID, req.user.userId);
        sendResponse(res.status(401), "error", "Unauthorize to create post");
        return;
      }

      const postImageFiles = req?.files as Express.Multer.File[];
      var postImages: string[] = [];
      postImageFiles?.map(async (eachImageBuffer) => {
        const buffer = eachImageBuffer?.buffer;
        const mimetype = eachImageBuffer?.mimetype;
        // FOR EDIT
        // const post = await postService.getPost(id)
        // const imageKey = (user?.profileImage && user?.profileImage !== '') ? user?.profileImage : cloudService.getKeyName() //
        const imageKey = cloudService.getKeyName();
        postImages.push(imageKey);
        const { url } = await cloudService.getUrlWithImageNameAndUploadToCloud(
          buffer!,
          mimetype!,
          imageKey
        );
      });
      // console.log("BODY",req.body.userID)
      req.body.postImages = postImages;
      // console.log(postImages)

      //POST MAN TEST
      // req.body.postProjectRoles= JSON.parse(req.body.postProjectRoles)

      const post = await postService.createPost(req.body);
      sendResponse(
        res.status(201),
        "success",
        post,
        "Successfully created posts"
      );
    } catch (err) {
      sendResponse(res, "error", err, "Failed to created posts");
    }
  }

  //@Private Request from Producer Role only and userID from frontEnd isMatch
  async updatePost(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      //TODO: add params to send keyImagesDelete, make sure that you have postImages that have only image on clound
      const postId = req.params.id;

      //POST MAN TEST
      // req.body.postImagesKey=JSON.parse(req.body.postImagesKey)
      // req.body.keyImagesDelete=JSON.parse(req.body.keyImagesDelete)
      // req.body.postProjectRoles= JSON.parse(req.body.postProjectRoles)

      //FrontEND
      console.log("BEFORE CHECK pass parse");
      console.log(req.body.postData);
      req.body = JSON.parse(req.body.postData);
      console.log("CHECK pass parse");

      //authorization
      if (
        req.user.userId != req.body.userID ||
        req.user.role == "production professional"
      ) {
        sendResponse(res.status(401), "error", "Unauthorize to update post");
        return;
      }
      if (
        req.body.postStatus != "created" &&
        req.body.postStatus != "in-progress" &&
        req.body.postStatus != "cancel" &&
        req.body.postStatus != "success"
      ) {
        sendResponse(res, "error", "Failed PostStatus");
        return;
      }
      console.log("CHECK JJ");
      //Check Picuture Key that were deleted
      const keyImagesDelete: string[] = req.body.keyImagesDelete; //มันจะเป็น list ของ key ที่โดนลบไปแล้ว
      const postImageFiles = req?.files as Express.Multer.File[];
      var postImages: string[] = req.body.postImagesKey; //เป็น list ของ key รูปภาพที่จะถูกเพิ่ม
      // console.log("keyImagesDelete",keyImagesDelete)
      if (keyImagesDelete.length + postImages.length > 3) {
        console.log(
          "มึงแอดมาได้ยังไงว่ะ",
          keyImagesDelete.length + postImages.length
        );
        sendResponse(res, "error", "No more 3 pictures update");
        return;
      }

      postImageFiles?.map(async (eachImageBuffer) => {
        const buffer = eachImageBuffer?.buffer;
        const mimetype = eachImageBuffer?.mimetype;
        let keyImage =
          keyImagesDelete.length > 0
            ? keyImagesDelete.pop()!
            : cloudService.getKeyName();
        postImages.push(keyImage);
        const { url } = await cloudService.getUrlWithImageNameAndUploadToCloud(
          buffer!,
          mimetype!,
          keyImage
        );
      });
      req.body.postImages = postImages;
      console.log("CheckBody", req.body);

      const posts = await postService.updatePost(req.body, postId);

      sendResponse(res, "success", posts, "Successfully updated posts");
    } catch (err) {
      sendResponse(res, "error", err, "Failed to updated posts at controller");
    }
  }

  async deletePost(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const postId = req.params.id;
      if (
        req.user.userId != req.body.userID ||
        req.user.role == "production professional"
      ) {
        sendResponse(res.status(401), "error", "Unauthorize to delete post");
        return;
      }
      const posts = await postService.deletePost(req.body, postId);
      sendResponse(res, "success", posts, "Successfully deleted post");
    } catch (err) {
      sendResponse(res, "error", err, "Failed to deleted posts at controller");
    }
  }

  //@Private Request from Producer Role or Production Professional can create offer
  async createOffer(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const myRole = req.user.role;
      // console.log(req.body)
      // if(!req.body.roleID || !req.body.productionProfessionalID || !req.body.price){
      //     sendResponse(res, 'error', 'Failed to deleted offer');
      // }
      const offer = await postService.createOffer(
        req.body,
        req.body.postID,
        req.body.productionProfessionalID
      );
      sendResponse(res, "success", offer, "Successfully create offer");
    } catch (error) {
      sendResponse(res, "error", error, "Failed to created offer");
    }
  }

//@Private Request from Producer/ProdcutionProfessional Role and userID from frontEnd isMatch
async getOffers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // console.log("hellooo")
    const role=req.user.role
    // console.log(req.user.userId)
    // const productionProfessionalID= req.query.productionProfessionalID ? req.query.productionProfessionalID as string: false;
    const userId = req.query.userId? req.query.userId as string: "";
    const producerId= req.user.userId as string
    const limit = req.query.limit ? Number(req.query.limit): 10;
    const page = req.query.page ? Number(req.query.page): 1;
    const status = ['created', 'in-progress', 'success', 'cancel'];
    console.log(limit,page,producerId)
    if ((limit < 1 || page < 1 || userId=="") && role ==="production professional" ) {
      sendResponse(res, 'error', '', 'bad request', 400);
      return
    }

    if ((limit < 1 || page < 1 || producerId=="") && role ==="producer" ) {
      sendResponse(res, 'error', '', 'bad request', 400);
      return
    }
    
    let postStatus;
    if (!req.query.postStatus){
      postStatus = '';
    }else{
      if(!status.includes(req.query.postStatus as string)){
        sendResponse(res, 'error', '', 'bad request', 400)
      }else{
        postStatus = req.query.postStatus as string
      }

    const offerReqDTO: OfferRequestDTO = {
      page: page,
      limit: limit,
      userId: userId,
      // productionProfessionalId: productionProfessionalID,
      postId: req.query.postId? req.query.postId as string: "",
      postStatus: postStatus as string
    }
    var offers;
    if(role=="producer"){
      offers= await postService.getProducerOffer(offerReqDTO,producerId);
    }else{
      offers= await postService.getOffer(offerReqDTO,role);
    }
    // console.log(offers.meta.totalPages)
    if (!offers.meta.totalPages){
      sendResponse(res, 'error', '', 'You have no offer.', 400);
      return
    }
    if (offers.meta.totalPages < page) {
      sendResponse(res, 'error', '', 'bad request', 400);
      return
    }

      const offerReqDTO: OfferRequestDTO = {
        page: page,
        limit: limit,
        userId: userId,
        // productionProfessionalId: productionProfessionalID,
        postId: req.query.postId ? (req.query.postId as string) : "",
        postStatus: postStatus as string,
      };

      const offers = await postService.getOffer(offerReqDTO, role);
      // console.log(offers.meta.totalPages)
      if (!offers.meta.totalPages) {
        sendResponse(res, "error", "", "You have no offer.", 400);
        return;
      }
      if (offers.meta.totalPages < page) {
        sendResponse(res, "error", "", "bad request", 400);
        return;
      }

      sendResponse(res, "success", offers, "Successfully get offers");
    } catch (err) {
      sendResponse(
        res,
        "error",
        err,
        "Failed to get offers at controller",
        500
      );
    }
  }
  async searchPost(req: Request, res: Response): Promise<void> {
    try {
      // make sure postMediaTypes and roleRequirements are string[] or undefined
      const postMediaTypes = req.query.postMediaTypes as string[];
      const roleRequirements = req.query.roleRequirements as string[];
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;

      if (limit < 1 || page < 1) {
        sendResponse(res, "error", "", "bad request", 400);
        return;
      }

      const postSearchReqDTO: PostSearchRequestDTO = {
        page: page,
        limit: limit,
        searchText: req.query.searchText
          ? (req.query.searchText as string)
          : "",
        postMediaTypes: Array.isArray(postMediaTypes)
          ? postMediaTypes
          : postMediaTypes
          ? [postMediaTypes]
          : postMediaTypes,
        roleRequirements: Array.isArray(roleRequirements)
          ? roleRequirements
          : roleRequirements
          ? [roleRequirements]
          : roleRequirements,
      };

      const posts = await postService.searchPost(postSearchReqDTO);

      if (posts.meta.totalPages < page) {
        sendResponse(res, "error", "", "bad request", 400);
        return;
      }

      sendResponse(res, "success", posts, "Successfully search posts");
    } catch (err) {
      sendResponse(
        res,
        "error",
        err,
        "Failed to search posts at controller",
        500
      );
    }
  }

  async addPostReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const postID = req.params.id;
      const userID = req.user.userId;
      const newRating: PaticipantRatingDTO = req.body;

      const post = await postService.addPostReview(postID, userID, newRating);

      sendResponse(res, "success", post, "Successfully add review to post");
    } catch (err) {
      sendResponse(res, "error", err, "Failed to retrieve posts");
    }
  }

  async getPostsByProf(req: AuthRequest, res: Response): Promise<void> {
    try {
      const role = req.user.role;
      if (role == "production professional") {
        const userId = req.user.userId ? (req.user.userId as string) : false;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const status = ["created", "in-progress", "success", "cancel"];

        if (limit < 1 || page < 1 || !userId) {
          sendResponse(res, "error", "", "bad request", 400);
          return;
        }

        let postStatus;
        if (!req.query.postStatus) {
          postStatus = "";
        } else {
          if (!status.includes(req.query.postStatus as string)) {
            sendResponse(res, "error", "", "bad request", 400);
          } else {
            postStatus = req.query.postStatus as string;
          }
        }

        const getPostByProfDTO: GetPostByProfDTO = {
          page: page,
          limit: limit,
          userId: userId,
          postStatus: postStatus as string,
        };

        const posts = await postService.getPostsByProf(getPostByProfDTO);
        // console.log(offers.meta.totalPages)
        if (!posts.meta.totalPages) {
          sendResponse(res, "error", "", "You have no relate posts.", 400);
          return;
        }
        if (posts.meta.totalPages < page) {
          sendResponse(res, "error", "", "bad request", 400);
          return;
        }
        sendResponse(res, "success", posts, "Successfully get posts", 200);
      } else {
        sendResponse(res, "error", "", `unauthorized`, 400);
        return;
      }
    } catch (err) {
      sendResponse(
        res,
        "error",
        err,
        "Failed to search posts at controller",
        500
      );
    }
  }

  // postController.ts

  async getPostParticipants(req: AuthRequest, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      if (!postId) {
        sendResponse(res, "error", "", "Post ID is required", 400);
        return;
      }

      const participants = await postService.getPostParticipants(postId);
      console.log("Fetched participants:", participants); // Log fetched participants
      sendResponse(
        res,
        "success",
        participants,
        "Successfully retrieved post participants"
      );
    } catch (err) {
      sendResponse(res, "error", err, "Failed to retrieve post participants");
    }
  }
}

export default new PostController();
