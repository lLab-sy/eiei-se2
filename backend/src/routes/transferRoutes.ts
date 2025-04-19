import express from 'express';
import AuthMiddleware from '../middlewares/authMiddleware'
import { RequestHandler } from '@nestjs/common/interfaces';
import transferController from '../controllers/transferController'
const router = express.Router();

/**
 * @openapi
 * /api/transfer/create-customer:
 *   post:
 *     summary: Create Omise customer for a user
 *     tags:
 *       - Transfer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer created
 */
router.post('/create-customer', AuthMiddleware.authenticate as RequestHandler, transferController.createCustomer as RequestHandler);

/**
 * @openapi
 * /api/transfer/add-bank-account:
 *   post:
 *     summary: Add a bank account to the user
 *     tags:
 *       - Transfer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               bookbankId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank account added
 */
router.post('/add-bank-account', AuthMiddleware.authenticate as RequestHandler, transferController.addBankAccount as RequestHandler);

/**
 * @openapi
 * /api/transfer/transfer:
 *   post:
 *     summary: Transfer money to user's bank account
 *     tags:
 *       - Transfer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post('/transfer', AuthMiddleware.authenticate as RequestHandler, transferController.transfer as RequestHandler);
// we can get userId from token (auth middleware), but in this still okay
// we can get amount from postId 

/**
 * @openapi
 * /api/transfer/bank-accounts/{userId}:
 *   get:
 *     summary: Get user's saved bank accounts
 *     tags:
 *       - Transfer
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bank accounts
 */
router.get('/bank-accounts/:userId', AuthMiddleware.authenticate as RequestHandler, transferController.getBankAccount as RequestHandler);

/**
 * @openapi
 * /api/transfer/transactions:
 *   get:
 *     summary: Get all transactions of the user
 *     tags:
 *       - Transfer
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', AuthMiddleware.authenticate as RequestHandler, transferController.getTransactions as RequestHandler);
// userId from token

export default router;
