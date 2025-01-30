import { Request, Response } from 'express';
// import * as testService from '../services/testService';
import postService from '../services/postService';
import { sendResponse } from '../utils/responseHelper';

class PostController {
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postService.getAllPosts();
      sendResponse(res, 'success', posts, 'Successfully retrieved posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
  
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postService.createPost(req.body);
      sendResponse(res, 'success', posts, 'Successfully retrieved posts');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
}

export default new PostController();
