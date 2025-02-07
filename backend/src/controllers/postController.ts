import { NextFunction, Request, Response } from 'express';
// import * as testService from '../services/testService';
import postService from '../services/postService';
import { sendResponse } from '../utils/responseHelper';
import { PostSearchRequestDTO } from '../dtos/postDTO';
import { AuthRequest } from '../dtos/middlewareDTO';

class PostController {
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postService.getAllPosts();
      // console.log('Fetched posts:', posts);  // Log fetched posts
      sendResponse(res, 'success', posts, 'Successfully retrieved posts');
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
      const posts = await postService.getPostsbyUser(req.user.userId);
      sendResponse(res, 'success', posts, `Successfully retrieved ${posts?posts.length:0} posts`);
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
  
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postService.createPost(req.body);
      sendResponse(res, 'success', posts, 'Successfully created posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to created posts');
    }
  };

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id
      const posts = await postService.updatePost(req.body,postId);
      console.log(posts)
      sendResponse(res, 'success', posts, 'Successfully updated posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated posts at controller');
    }
  };

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id
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

      const postSearchReqDTO: PostSearchRequestDTO = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        searchText: req.query.searchText? req.query.searchText as string: '',
        postMediaTypes: Array.isArray(postMediaTypes)?postMediaTypes: postMediaTypes? [postMediaTypes]: postMediaTypes,
        roleRequirements: Array.isArray(roleRequirements)?roleRequirements: roleRequirements? [roleRequirements]: roleRequirements
      }

      const posts = await postService.searchPost(postSearchReqDTO);
      sendResponse(res, 'success', posts, 'Successfully search posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to search posts at controller', 500);
    }
  };
}

export default new PostController();
