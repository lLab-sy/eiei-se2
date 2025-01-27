import Test, { ITest } from '../models/testModel';

class TestRepository {
    public async getAllTests() {
        try {
            return await Test.find();
        } catch (error) {
            throw new Error('Error fetching tests from repository: ' + error);
        }
    }

    public async createTest(testData: ITest) {
        try {
            const test = new Test(testData);
            return await test.save();
        } catch (error) {
            throw new Error('Error creating test in repository: ' + error);
        }
    }
}

export default new TestRepository();
