import { Request, Response } from 'express';
import * as testService from '../services/testService';
import { TestDTO } from '../dtos/testDTO';
import { sendResponse } from '../utils/responseHelper';

const getAllTests = async (req: Request, res: Response): Promise<void> => {
  // try {
  //   const tests = await testService.getAllTests();
  //   res.status(200).json(tests); // Return all tests as a list of TestDTO
  // } catch (error) {
  //   res.status(500).json({ message: error });
  // }
  try {
    const tests = await testService.getAllTests();
    sendResponse(res, 'success', tests, 'Successfully retrieved tests');
  } catch (err) {
    sendResponse(res, 'error', null, 'Failed to retrieve tests');
  }
};

const createTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const tests = await testService.createTest(req.body);
    sendResponse(res, 'success', tests, 'Successfully retrieved tests');
  } catch (err) {
    sendResponse(res, 'error', null, 'Failed to retrieve tests');
  }
};

export { getAllTests, createTest };
