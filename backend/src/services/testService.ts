import testRepository from '../repositories/testRepository';
import { TestDTO } from '../dtos/testDTO';
import Test from '../models/testModel';

class TestService {

  async getAllTests(): Promise<TestDTO[]> {
    try {
      const tests = await testRepository.getAllTests();

      // Map the raw test data to the TestDTO
      return tests.map((test) => ({
        id: test.id.toString(),
        name: test.nameNa,
      }));
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }

  async createTest(testData: TestDTO) {
    try {
      // map to model before pass it to repository
      const testModel = new Test({
        nameNa: testData.name,
      });
      return await testRepository.createTest(testModel);
    } catch (error) {
      throw new Error('Error in service layer: ' + error);
    }
  }
}

// Export an instance of the service
export default new TestService();

// const getAllTests = async (): Promise<TestDTO[]> => {
//   try {
//     const tests = await testRepository.getAllTests();

//     console.log(tests)
//     // Map the raw test data to the TestDTO
//     return tests.map((test) => ({
//       id: test.id.toString(),
//       name: test.nameNa,
//     }));
//   } catch (error) {
//     throw new Error('Error in service layer: ' + error);
//   }
// };

// const createTest = async (testData: TestDTO) => {
//   try {
//     const testModel = new Test({
//       nameNa: testData.name,
//     })
//     return await testRepository.createTest(testModel);
//   } catch (error) {
//     throw new Error('Error in service layer: ' + error);
//   }
// };

// export { getAllTests, createTest };
