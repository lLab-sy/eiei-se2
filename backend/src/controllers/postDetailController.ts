import { Request, Response } from 'express';
// import * as testService from '../services/testService';
import postDetailService from '../services/postDetailService';
import { sendResponse } from '../utils/responseHelper';

class PostDetailController {
  async getAllPostDetails(req: Request, res: Response): Promise<void> {
    try {
      const postDetails = await postDetailService.getAllPostDetails();
      // console.log('Fetched postDetails:', postDetails);  // Log fetched postDetails
      sendResponse(res, 'success', postDetails, 'Successfully retrieved postDetails');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve postDetails');
    }
  };
  async getPostDetail(req: Request, res: Response): Promise<void> {
    try {
      const postDetailId = req.params.id
      const postDetails = await postDetailService.getPostDetail(postDetailId);
      // console.log('Fetched postDetails:', postDetails);  // Log fetched postDetails
      sendResponse(res, 'success', postDetails, 'Successfully retrieved post');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieved postDetails');
    }
  };
  
  async createPostDetail(req: Request, res: Response): Promise<void> {
    try {
      const postDetails = await postDetailService.createPostDetail(req.body);
      sendResponse(res, 'success', postDetails, 'Successfully created postDetails');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to created postDetails');
    }
  };

  async updatePostDetail(req: Request, res: Response): Promise<void> {
    try {
      const postDetailId = req.params.id
      const postDetails = await postDetailService.updatePostDetail(req.body,postDetailId);
      sendResponse(res, 'success', postDetails, 'Successfully updated postDetails');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated postDetails at controller');
    }
  };
  async updatePostDetailAddCandidate(req: Request, res: Response): Promise<void> {
    try {
      const postDetailId = req.params.id
      const postDetails = await postDetailService.updatePostDetailAddCandidate(req.body,postDetailId);
      sendResponse(res, 'success', postDetails, 'Successfully updated add candidate');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated postDetails at controller');
    }
  };
  async updatePostDetailDeleteCandidate(req: Request, res: Response): Promise<void> {
    try {
      const postDetailId = req.params.id
      const postDetails = await postDetailService.updatePostDetailDeleteCandidate(req.body,postDetailId);
      sendResponse(res, 'success', postDetails, 'Successfully updated delete candidate');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated postDetails at controller');
    }
  };

  async deletePostDetail(req: Request, res: Response): Promise<void> {
    try {
      const postDetailId = req.params.id
      const postDetails = await postDetailService.deletePostDetail(req.body,postDetailId);
      sendResponse(res, 'success', postDetails, 'Successfully deleted postDetails');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to deleted postDetails at controller');
    }
  };

  async getPostsByProductionProfessional(req: Request, res: Response): Promise<void> {
      try {
        // const posts = await postDetailService.getProductionProfessionalPosts(req.params.id,req.user.); //userID of production professional
        sendResponse(res, 'success', 'Successfully retrieved posts');
      } catch (err) {
        sendResponse(res, 'error', err, 'Failed to retrieve posts');
      }
    };
}

export default new PostDetailController();
