import omise from '../config/omise';
import userRepository from '../repositories/userRepository';
import transactionRepository from '../repositories/transactionRepository';
import { addBankAccountRequestModel, transferRequestModel, ITransaction, addBankAccountResponseModel, transferResponseModel } from '../models/transactionModel';
import { IProductionProfessional, IUser } from '../models/userModel';
import Transaction from '../models/transactionModel';
import productionProfessionalRepository from '../repositories/productionProfessionalRespository';
import postRepository from '../repositories/postRepository';

// interface CreateRecipientInput {
//     userId: string;
//     bankAccount: {
//         name: string;
//         number: string;
//         brand: string;
//     };
//     fullName: string; // ใช้สำหรับใส่ชื่อผู้รับเงิน
// }

interface TransferRequestModel {
    userId: string;
    postId: string;
}


interface TransferResponseModel {
    userId: string;
    postId: string;
    amount: number;
    currency: string;
    status: string;
    transactionId: string;
    transactionType: 'transfer';
}

export interface IOmiseBankAccount {
    recipientId: string;
    bankLastDigits: string;
    brand: string;
    name?: string;
}

interface CreateRecipientInput {
    userId: string;
    fullName: string;
    bankAccount: IOmiseBankAccountInput;
}

interface IOmiseBankAccountInput {
    name: string;
    number: string;
    brand: string;
    last_digits: string;
}

class transferService {
    async createRecipient(data: CreateRecipientInput): Promise<{ created: boolean; recipientId: string }> {
        const user: IUser | null = await userRepository.getUserByID(data.userId);
        if (!user) throw new Error('User not found');
        if (!user.email) throw new Error('Email is required');

        if (user.omiseCustomerId) {
            return {
                created: false,
                recipientId: user.omiseCustomerId
            };
        }

        try {
            const recipient = await omise.recipients.create({
                name: data.fullName,
                email: user.email,
                type: 'individual',
                bank_account: {
                    brand: data.bankAccount.brand,
                    number: data.bankAccount.number,
                    name: data.bankAccount.name,
                    last_digits: data.bankAccount.number.slice(-4), // last 4 digits of the bank account number
                },
            });

            user.omiseCustomerId = recipient.id;
            await user.save();

            return {
                created: true,
                recipientId: recipient.id,
            };
        } catch (err) {
            console.error("Error creating Omise recipient:", err);
            throw new Error("Failed to create Omise recipient: " + (err as Error).message);
        }
    }

    async addBankAccount(data: CreateRecipientInput): Promise<void> {
        const user = await userRepository.getUserByID(data.userId);
        if (!user?.omiseCustomerId) {
            throw new Error('Recipient not found');
        }

        try {
            const updatedRecipient = await omise.recipients.update(user.omiseCustomerId, {
                name: data.fullName,
                type: 'individual',
                bank_account: {
                    brand: data.bankAccount.brand,
                    number: data.bankAccount.number,
                    name: data.bankAccount.name,
                    last_digits: data.bankAccount.number.slice(-4),
                },
            });

        } catch (err) {
            console.error("Error updating Omise recipient:", err);
            throw new Error("Failed to update Omise recipient: " + (err as Error).message);
        }
    }


    async transferToBank(data: TransferRequestModel): Promise<TransferResponseModel> {
        const user = await userRepository.getUserByID(data.userId);
        if (!user) throw new Error('User not found');
        if (!user.omiseCustomerId) throw new Error('Omise recipient ID not found');
        if (user.role !== 'production professional') throw new Error('Only production professionals can receive transfers');

        // 🧪 mock: ดึง amount จาก post
        const post = await postRepository.getPost(data.postId);
        if (!post) throw new Error('Post not found');
        //const amount = 1500; // สมมติชั่วคราว
        const amount = await postRepository.getOneCandidatePrice(data.postId, data.userId);
        if (!amount) throw new Error('Amount not found');
        const currency = 'thb';

        // 👉 เรียก Omise transfer
        const transfer = await omise.transfers.create({
            amount: amount * 100, // หน่วยเป็นสตางค์
            recipient: user.omiseCustomerId,
        });

        if (!transfer.paid) {
            throw new Error(`Transfer failed: ${transfer.paid}`);
        }

        // ✅ บันทึก transaction
        const transaction = new Transaction({
            userId: data.userId,
            postId: data.postId,
            amount: transfer.amount / 100,
            currency,
            status: transfer.paid ? 'successful' : 'failed',
            transactionId: transfer.id,
            transactionType: 'transfer',
        });

        await transaction.save();

        return {
            userId: data.userId,
            postId: data.postId,
            amount: transfer.amount / 100,
            currency,
            status: transfer.paid ? 'successful' : 'failed',
            transactionId: transfer.id,
            transactionType: 'transfer',
        };
    }

    async getBankAccount(userId: string): Promise<IOmiseBankAccount | null> {
        const user = await userRepository.getUserByID(userId);
        if (!user || !user.omiseCustomerId) return null;

        const recipient = await omise.recipients.retrieve(user.omiseCustomerId);
        if (!recipient || !recipient.bank_account) return null;

        return {
            brand: recipient.bank_account.brand,
            name: recipient.bank_account.name,
            bankLastDigits: recipient.bank_account.last_digits,
            recipientId: recipient.id,
        };
    }

    async getTransactions(userId: string): Promise<ITransaction[]> {
        try {
            const user = await userRepository.getUserByID(userId);
            if (!user || !user.omiseCustomerId) throw new Error('Invalid user');

            return await transactionRepository.getTransactions(userId);
        } catch (err) {
            console.error("Error in transferService.getTransactions:", err);
            throw new Error("Failed to retrieve transactions: " + (err as Error).message);
        }
    }
}

export default new transferService();
