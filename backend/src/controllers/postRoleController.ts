import { Request, Response } from 'express';
import postRoleService from '../services/postRoleService';
import { sendResponse } from '../utils/responseHelper';

class PostRoleController {
  async getAllPostRoles(req: Request, res: Response): Promise<void> {
    try {
      const postRoles = await postRoleService.getAllPostRoles();
      sendResponse(res, 'success', postRoles, 'Successfully retrieved post roles');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
  async getPostRole(req: Request, res: Response): Promise<void> {
    try {
      const postRoleId = req.params.id
      const postRoles = await postRoleService.getPostRole(postRoleId);
      sendResponse(res, 'success', postRoles, 'Successfully retrieved post');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieved post role');
    }
  };
  
  async createPostRole(req: Request, res: Response): Promise<void> {
    try {
      const posts = await postRoleService.createPostRole(req.body);
      console.log(posts)
      sendResponse(res, 'success', posts, 'Successfully created post');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to created post role');
    }
  };

  async updatePostRole(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id
      const posts = await postRoleService.updatePostRole(req.body,postId);
      sendResponse(res, 'success', posts, 'Successfully updated post role');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated posts at controller');
    }
  };

  async deletePostRole(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id
      const posts = await postRoleService.deletePostRole(req.body,postId);
      sendResponse(res, 'success', posts, 'Successfully deleted post role');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to deleted post role at controller');
    }
  };
}

export default new PostRoleController();
