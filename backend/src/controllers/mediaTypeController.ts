import { Request, Response } from 'express';
import { sendResponse } from '../utils/responseHelper';
import mediaTypeService from '../services/mediaTypeService';

class MediaTypeController {

  //@Public
  async getAllMediaType(req: Request, res: Response): Promise<void> {
    try {
      const mediaTypes = await mediaTypeService.getAllMediaType();
      sendResponse(res, 'success', mediaTypes, 'Successfully retrieved mediaTypes');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve posts');
    }
  };
    //@Public
  async getMediaType(req: Request, res: Response): Promise<void> {
    try {
      const mediaTypeId = req.params.id
      const mediaType = await mediaTypeService.getMediaType(mediaTypeId)
      sendResponse(res, 'success', mediaType, 'Successfully retrieved mediaType');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieved mediaType');
    }
  };
    //@Private Admin
  async createMediaType(req: Request, res: Response): Promise<void> {
    try {
      const mediaType = await mediaTypeService.createMediaType(req.body);
      sendResponse(res, 'success', mediaType, 'Successfully created mediaType');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to created mediaType');
    }
  };
    //@Private Admin
  async updateMediaType(req: Request, res: Response): Promise<void> {
    try {
      const mediaTypeId = req.params.id
      const mediaType = await mediaTypeService.updateMediaType(req.body,mediaTypeId);
      sendResponse(res, 'success', mediaType, 'Successfully updated mediaType');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to updated mediaType at controller');
    }
  };
    //@Private Admin
  async deleteMediaType(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id
      const posts = await mediaTypeService.deleteMediaType(req.body,postId);
      sendResponse(res, 'success', posts, 'Successfully deleted mediaType');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to deleted mediaType at controller');
    }
  };
}

export default new MediaTypeController();
