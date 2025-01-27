import { Request, Response } from 'express';
// import * as testService from '../services/testService';
import testService from '../services/testService';
import { sendResponse } from '../utils/responseHelper';

class TestController {
  async getAllTests(req: Request, res: Response): Promise<void> {
    try {
      const tests = await testService.getAllTests();
      sendResponse(res, 'success', tests, 'Successfully retrieved tests');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve tests');
    }
  };
  
  async createTest(req: Request, res: Response): Promise<void> {
    try {
      const tests = await testService.createTest(req.body);
      sendResponse(res, 'success', tests, 'Successfully retrieved tests');
    } catch (err) {
      sendResponse(res, 'error', err, 'Failed to retrieve tests');
    }
  };
}

export default new TestController();
