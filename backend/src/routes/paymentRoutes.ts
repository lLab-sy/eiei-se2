import express from 'express';
import AuthMiddleware from '../middlewares/authMiddleware'
import { RequestHandler } from '@nestjs/common/interfaces';
import paymentController from '../controllers/paymentController';
const router = express.Router();

/**
 * @openapi
 * /api/payment/transactions:
 *   get:
 *     summary: Get all transactions of the user
 *     tags:
 *       - Payment
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', AuthMiddleware.authenticate as RequestHandler, paymentController.getTransactions as RequestHandler);
// userId from token

/**
 * @openapi
 * /api/payment/create-customer:
 *   post:
 *     summary: Create Omise customer for a user
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully create omise account or Already have omise account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: boolean
 *                 customerId:
 *                   type: string
 *       500:
 *         description: Error while creating customer
 */

router.post('/create-customer', AuthMiddleware.authenticate as RequestHandler, paymentController.createCustomer as RequestHandler);

/**
 * @openapi
 * /api/payment/add-card:
 *   post:
 *     summary: Add a card to an Omise customer
 *     tags:
 *       - Payment
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               cardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card added
 */
router.post('/add-card', AuthMiddleware.authenticate as RequestHandler, paymentController.addCard as RequestHandler);

/**
 * @openapi
 * /api/payment/cards:
 *   get:
 *     summary: Get all cards for a user
 *     tags:
 *       - Payment
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get('/cards', AuthMiddleware.authenticate as RequestHandler, paymentController.getAllCards as RequestHandler);
// userId from token

/**
 * @openapi
 * /api/payment/charge-customer:
 *   post:
 *     summary: Charge a saved card of the customer
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *               - postId
 *               - amount
 *             properties:
 *               cardId:
 *                 type: string
 *                 example: "card_test_5fzn6x7ibgwc5zklc8b"
 *               postId:
 *                 type: string
 *                 example: "6632b84f5f16c76c4037a61c"
 *               amount:
 *                 type: number
 *                 example: 250
 *     responses:
 *       200:
 *         description: Successfully charge customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 postId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 currency:
 *                   type: string
 *                 status:
 *                   type: string
 *                 transactionId:
 *                   type: string
 *                 transactionType:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post('/charge-customer', AuthMiddleware.authenticate as RequestHandler, paymentController.chargeCustomer as RequestHandler);
// we can get amount from postId

export default router;
