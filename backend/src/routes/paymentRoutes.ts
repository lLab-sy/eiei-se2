import express from 'express';
const router = express.Router();

/**
 * @openapi
 * /api/payment/transactions:
 *   get:
 *     summary: Get all transactions of the user
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions');
// userId from token

/**
 * @openapi
 * /api/payment/create-customer:
 *   post:
 *     summary: Create Omise customer for a user
 *     tags:
 *       - Payment
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
router.post('/create-customer');

/**
 * @openapi
 * /api/payment/add-card:
 *   post:
 *     summary: Add a card to an Omise customer
 *     tags:
 *       - Payment
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
router.post('/add-card');

/**
 * @openapi
 * /api/payment/cards:
 *   get:
 *     summary: Get all cards for a user
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get('/cards');
// userId from token

/**
 * @openapi
 * /api/payment/charge-customer:
 *   post:
 *     summary: Charge a saved card of the customer
 *     tags:
 *       - Payment
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
 *               postId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Charge successful
 */
router.post('/charge-customer');
// we can get amount from postId

export default router;
