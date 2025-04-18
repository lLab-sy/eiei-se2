import { Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import paymentService from "../services/paymentService";
import { AuthRequest } from '../dtos/middlewareDTO';
import { addCardRequestModel, chargeCustomerRequestModel } from "../models/transactionModel";

class paymentController{
    async createCustomer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user.userId;
    
            const result = await paymentService.createCustomer(userId);
            if(result.created){
                sendResponse(res, 'success', result, "Successfully create omise account")
            }else{
                sendResponse(res, 'success', result, "Already have omise account")
            }
            
        } catch (err) {
            console.log(err)
            sendResponse(res, 'error', 'Failed to create omise account')
        }
    }
    async addCard(req: AuthRequest, res: Response): Promise<void> {
        try{
            const userId = req.user.userId;
            const cardToken = req.body.cardToken;
            if (!cardToken) {
                sendResponse(res, "error", "", "Card Token is required", 400);
                return;
            }
            const addCardRequest: addCardRequestModel = {userId, cardToken}
                
            const addCardResponse = await paymentService.addCardToCustomer(addCardRequest)
            sendResponse(res, 'success', addCardResponse, "Successfully add card")
            }catch(err){
                console.log(err)
                sendResponse(res, 'error', 'Failed to add card')
            }
    }

    async chargeCustomer(req: AuthRequest, res: Response): Promise<void> {
        try{
            const userId = req.user.userId;
            const cardId = req.body.cardId;
            const amount = req.body.amount;
            const postId = req.body.postId;
            if (!cardId || !amount || !postId) {
                sendResponse(res, "error", "", "CardId, postId and amount is required", 400);
                return;
            }
            const chargeRequest: chargeCustomerRequestModel = {userId, postId, amount, cardId};
                
            const chargeResponse = await paymentService.chargeCustomer(chargeRequest)
            sendResponse(res, 'success', chargeResponse, "Successfully charge customer")
            }catch(err){
                console.log(err)
                sendResponse(res, 'error', 'Failed to charge user')
            }
    }

    async getAllCards(req: AuthRequest, res: Response): Promise<void> {
        try{
            const userId = req.user.userId;
                
            const allCards = await paymentService.getAllCards(userId);
            sendResponse(res, 'success', allCards, "Successfully get all cards")
            }catch(err){
                console.log(err)
                sendResponse(res, 'error', 'Failed to get all cards')
        }
    }

    async getTransactions(req: AuthRequest, res: Response): Promise<void> {
        try{
            const userId = req.user.userId;
                
            const transactions = await paymentService.getTransactions(userId);
            sendResponse(res, 'success', transactions, "Successfully get transactions")
            }catch(err){
                console.log(err)
                sendResponse(res, 'error', 'Failed to get transactions')
        }
    }
}

export default new paymentController();