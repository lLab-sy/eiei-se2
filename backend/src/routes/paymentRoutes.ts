import express from 'express';
const router = express.Router();

/**
 * @openapi
 * /payment/transactions/{userId}:
 *   get:
 *     summary: Get all transactions of the user
 *     tags:
 *       - Payment
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/payment/transactions/:userId');

/**
 * @openapi
 * /payment/create-customer:
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
router.post('/payment/create-customer');

/**
 * @openapi
 * /payment/add-card:
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
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card added
 */
router.post('/payment/add-card');

/**
 * @openapi
 * /payment/cards/{userId}:
 *   get:
 *     summary: Get all cards for a user
 *     tags:
 *       - Payment
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get('/cards/:userId');

/**
 * @openapi
 * /payment/charge-customer:
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
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 example: thb
 *     responses:
 *       200:
 *         description: Charge successful
 */
router.post('/payment/charge-customer');

export default router;
