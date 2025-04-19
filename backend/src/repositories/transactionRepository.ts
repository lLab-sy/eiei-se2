import { ObjectId } from 'mongodb';
import { User } from '../models/userModel';
import Transaction from '../models/transactionModel';

class TransactionRepository {
    async getTransactions(userID: string){
        const userId = new ObjectId(userID);

        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found.")
        }

        const transaction = await Transaction.find({userId}).sort({createdAt:-1}).populate('userId').populate('postId')
        return transaction
    }
}

export default new TransactionRepository();