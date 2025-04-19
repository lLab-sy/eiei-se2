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

<<<<<<< HEAD
        const transaction = await Transaction.find({userId}).sort({createdAt:-1}).populate('userId').populate('postId')
=======
        const transaction = await Transaction.find({userId}).sort({createdAt:-1})
>>>>>>> 5752948c2ea82b41f106e5b3b144d2b5c46f3f45
        return transaction
    }
}

export default new TransactionRepository();