import testRepository from '../repositories/testRepository';
import { TestDTO } from '../dtos/testDTO';

const getAllTests = async (): Promise<TestDTO[]> => {
  try {
    const tests = await testRepository.getAllTests();
    
    // Map the raw test data to the TestDTO
    return tests.map((test) => ({
      id: test.id.toString(),
      name: test.name,
    }));
  } catch (error) {
    throw new Error('Error in service layer: ' + error);
  }
};

const createTest = async (testData: { name: string }) => {
  try {
    return await testRepository.createTest(testData);
  } catch (error) {
    throw new Error('Error in service layer: ' + error);
  }
};

export { getAllTests, createTest };
