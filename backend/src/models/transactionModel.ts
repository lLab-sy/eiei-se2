import mongoose, {Document, Schema} from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    amount: number,
    currency: string,
    status: string,
    transactionId: string,
    transactionType: 'charge' | 'transfer',
    createdAt: Date,
}
const transactionSchema = new Schema<ITransaction>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    transactionType:{
        type: String,
        enum: ['charge', 'transfer'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model<ITransaction>('transaction', transactionSchema);
export default Transaction;
