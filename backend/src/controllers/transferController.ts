import { Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import transferService from "../services/transferService";
import { AuthRequest } from '../dtos/middlewareDTO';
import { addBankAccountRequestModel, transferRequestModel } from "../models/transactionModel";

class transferController {
    async createCustomer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;

            const { fullName, bankAccount } = req.body;
            console.log("Bank Account:", req.body);
            if (!fullName || !bankAccount?.name || !bankAccount?.number || !bankAccount?.brand) {
                sendResponse(res, 'error', null, 'Missing required bank account information');
                return;
            }

            const result = await transferService.createRecipient({
                userId,
                fullName,
                bankAccount
            });

            if (result.created) {
                sendResponse(res, 'success', result, "Successfully created Omise recipient for transfer");
            } else {
                sendResponse(res, 'success', result, "Omise recipient already exists");
            }
        } catch (err) {
            console.error(err);
            sendResponse(res, 'error', null, 'Failed to create Omise recipient for transfer');
        }
    }

    async addBankAccount(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;
            const { fullName, bankAccount } = req.body;

            if (!fullName || !bankAccount?.name || !bankAccount?.number || !bankAccount?.brand) {
                sendResponse(res, 'error', null, 'Missing required bank account information');
                return;
            }

            await transferService.addBankAccount({
                userId,
                fullName,
                bankAccount,
            });

            sendResponse(res, 'success', null, 'Bank account updated successfully');
        } catch (err) {
            console.error(err);
            sendResponse(res, 'error', null, 'Failed to update bank account');
        }
    }


    // async addBankAccount(req: AuthRequest, res: Response): Promise<void> {
    //     try {
    //       const userId = req.user.userId;
    //       const bankAccountToken = req.body.bankAccountToken;

    //       if (!bankAccountToken) {
    //         sendResponse(res, "error", "", "Bank Account Token is required", 400);
    //         return;
    //       }

    //       const addBankAccountRequest: addBankAccountRequestModel = { userId, bankAccountToken };
    //       const result = await transferService.addBankAccountToCustomer(addBankAccountRequest);

    //       sendResponse(res, 'success', result, "Successfully added bank account");
    //     } catch (err) {
    //       console.error(err);
    //       sendResponse(res, 'error', 'Failed to add bank account');
    //     }
    //   }

    async transfer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { postId } = req.body;
            const userId = req.user.userId;

            if (!postId || !userId) {
                sendResponse(res, "error", "", "PostId is required", 400);
                return;
            }

            const result = await transferService.transferToBank({ userId, postId });

            sendResponse(res, 'success', result, 'Transfer successful');
        } catch (err) {
            console.error(err);
            sendResponse(res, 'error', null, (err as Error).message);
        }
    }

    // // โอนเงินไปยังบัญชีธนาคารของผู้ใช้
    // async transfer(req: AuthRequest, res: Response): Promise<void> {
    //     try {
    //         const userId = req.user.userId;
    //         const postId = req.body.postId;

    //         if (!postId || !userId) {
    //             sendResponse(res, "error", "", "PostId is required", 400);
    //             return;
    //         }

    //         // คำนวณจำนวนเงินจาก postId
    //         const transferRequest: transferRequestModel = { userId, postId, amount: 1000, transferType: 'bank' };

    //         const transferResponse = await transferService.transferToBank(transferRequest);
    //         sendResponse(res, 'success', transferResponse, "Successfully transferred money to bank account");
    //     } catch (err) {
    //         console.log(err);
    //         sendResponse(res, 'error', 'Failed to transfer money');
    //     }
    // }

    async getBankAccount(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;

            const bankAccounts = await transferService.getBankAccount(userId);

            if (!bankAccounts) {
                sendResponse(res, 'error', null, 'Bank account not found');
                return;
            }

            sendResponse(res, 'success', bankAccounts, "Successfully retrieved bank accounts");
        } catch (err) {
            console.log(err);
            sendResponse(res, 'error', 'Failed to get bank accounts');
        }
    }

    async getTransactions(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;

            const transactions = await transferService.getTransactions(userId);
            sendResponse(res, 'success', transactions, "Successfully retrieved transfer transactions");
        } catch (err) {
            console.error(err);
            sendResponse(res, 'error', 'Failed to retrieve transfer transactions');
        }
    }
}

export default new transferController();
