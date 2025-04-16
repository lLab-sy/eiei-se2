import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import paymentService from "../services/paymentService";
import { AuthRequest } from '../dtos/middlewareDTO';
import { addCardRequestModel, chargeCustomerRequestModel } from "../models/transactionModel";

class paymentController{
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
            if (!cardId || !amount ) {
                sendResponse(res, "error", "", "Card Id and amount is required", 400);
                return;
            }
            const chargeRequest: chargeCustomerRequestModel = {userId, amount, cardId};
                
            const chargeResponse = await paymentService.chargeCustomer(chargeRequest)
            sendResponse(res, 'success', chargeResponse, "Successfully charge")
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