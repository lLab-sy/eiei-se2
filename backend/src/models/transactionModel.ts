import mongoose, {Document, Schema} from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
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
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postType',
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

export interface OmiseCard {
    id: string;
    brand: string;
    name: string;
    last_digits: string;
    expiration_month: number;
    expiration_year: number;
    created: string;
  }

export interface addCardRequestModel {
    userId: string;
    cardToken: string;
}

export interface addCardResponseModel {
    // status: string;
    id: string;
    brand: string;
    name: string;
    last_digits: string;
    expiration_month: number;
    expiration_year: number;
    created: string;
}

export interface chargeCustomerRequestModel {
    userId:string;
    postId:string;
    amount: number;
    cardId:string;
}

export interface chargeCustomerResponseModel {
    userId: string,
    postId: string,
    amount: number,
    currency: string,
    status: string,
    transactionId: string,
    transactionType: 'charge',
}
