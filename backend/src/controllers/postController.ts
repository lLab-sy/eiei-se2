import { Request, Response } from 'express';
// import * as testService from '../services/testService';
import postService from '../services/postService';
import { sendResponse } from '../utils/responseHelper';

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
  async getPostsByUser(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postService.getPostsbyUser(req.params.id);
      sendResponse(res, 'success', posts, 'Successfully retrieved posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
  
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body)
      console.log("...............")
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
}

export default new PostController();
