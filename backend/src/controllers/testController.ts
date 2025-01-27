import { Request, Response } from 'express';
import * as testService from '../services/testService';

const getAllTests = async (req: Request, res: Response): Promise<void> => {
  try {
    const tests = await testService.getAllTests();
    res.status(200).json(tests); // Return all tests as a list of TestDTO
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const createTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const test = await testService.createTest(req.body);
    res.status(201).json(test); // Return the created test in TestDTO format
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { getAllTests, createTest };
