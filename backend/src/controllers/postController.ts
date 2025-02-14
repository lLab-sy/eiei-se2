import { NextFunction, Request, Response } from 'express';
// import * as testService from '../services/testService';
import postService from '../services/postService';
import { sendResponse } from '../utils/responseHelper';
import { PostSearchRequestDTO } from '../dtos/postDTO';
import { AuthRequest } from '../dtos/middlewareDTO';
import postDetailService from '../services/postDetailService';

class PostController {
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      //Handler Query
      const reqQuery= {...req.query}
      const removeFields=['select','sort']
      removeFields.forEach(param=> delete reqQuery[param])
      let queryStr=JSON.stringify(req.query);
      //Handler Compare
      queryStr=queryStr.replace(/\b(gt|gte|lt|lte|e)\b/g,match=>`$${match}`)
      const posts = await postService.getAllPosts(queryStr);
      // console.log('Fetched posts:', posts);  // Log fetched posts
      sendResponse(res, 'success',posts , 'Successfully retrieved posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
  
  async getPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id
      const posts = await postService.getPost(postId);
      // console.log('Fetched posts:', posts);  // Log fetched posts
      sendResponse(res, 'success', posts, 'Successfully retrieved post');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieved posts');
    }
  };
  
  async getPostsByUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const role=req.user.role
      if(role=="producer"){
        const posts = await postService.getPostsbyUser(req.user.userId);
        sendResponse(res, 'success', posts, `Successfully retrieved ${posts?posts.length:0} posts`);
        return;
      }else if(role=="production professional"){
        const posts = await postDetailService.getProductionProfessionalPosts(req.user.userId);
        sendResponse(res, 'success', posts, `Successfully retrieved ${posts?posts.length:0} posts`);
        return;
      }
  
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
  
  //@Private Request from Producer Role only and userID from frontEnd isMatch
  async createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      //unauthorize
      if(req.user.userId!=req.body.userID || req.user.role=="production professional"){
          sendResponse(res.status(401),'error', 'Unauthorize to create post');
          return;
      }
      const post= await postService.createPost(req.body)
      sendResponse(res.status(201), 'success', post , 'Successfully created posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to created posts');
    }
  };
  
//@Private Request from Producer Role only and userID from frontEnd isMatch
  async updatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id
      
      if(req.user.userId!=req.body.userID || req.user.role=="production professional"){
        sendResponse(res.status(401), 'error', 'Unauthorize to update post');
        return;
      } 
      if(req.body.postStatus!="created" && req.body.postStatus!="in-progress" && req.body.postStatus!="cancel" && req.body.postStatus!="success"){
        sendResponse(res, 'error', 'Failed PostStatus');
        return;
      }
 
      
      
      const posts = await postService.updatePost(req.body,postId);
      
      sendResponse(res, 'success', posts, 'Successfully updated posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated posts at controller');
    }
  };

  async deletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.id
      if(req.user.userId!=req.body.userID || req.user.role=="production professional"){
        sendResponse(res.status(401), 'error', 'Unauthorize to delete post');
        return;
      } 
      const posts = await postService.deletePost(req.body,postId);
      sendResponse(res, 'success', posts, 'Successfully deleted posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to deleted posts at controller');
    }
  };

  async searchPost(req: Request, res: Response): Promise<void> {
    try {
      // make sure postMediaTypes and roleRequirements are string[] or undefined
      const postMediaTypes = req.query.postMediaTypes as string[]
      const roleRequirements = req.query.roleRequirements as string[]
      const limit = req.query.limit ? Number(req.query.limit): 10
      const page = req.query.page ? Number(req.query.page): 1
      
      if (limit < 1 || page < 1) {
        sendResponse(res, 'error', '', 'bad request', 400);
        return
      }

      const postSearchReqDTO: PostSearchRequestDTO = {
        page: page,
        limit: limit,
        searchText: req.query.searchText? req.query.searchText as string: '',
        postMediaTypes: Array.isArray(postMediaTypes)?postMediaTypes: postMediaTypes? [postMediaTypes]: postMediaTypes,
        roleRequirements: Array.isArray(roleRequirements)?roleRequirements: roleRequirements? [roleRequirements]: roleRequirements
      }

      const posts = await postService.searchPost(postSearchReqDTO);

      if (posts.meta.totalPages < page) {
        sendResponse(res, 'error', '', 'bad request', 400);
        return
      }

      sendResponse(res, 'success', posts, 'Successfully search posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to search posts at controller', 500);
    }
  };
}

export default new PostController();
