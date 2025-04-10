import express from 'express';

const router = express.Router();

/**
 * @openapi
 * /transfer/create-customer:
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
router.post('/transfer/create-customer');

/**
 * @openapi
 * /transfer/add-bank-account:
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
 *               name:
 *                 type: string
 *               bank:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank account added
 */
router.post('/transfer/add-bank-account');

/**
 * @openapi
 * /transfer/transfer:
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
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post('/transfer/transfer');

/**
 * @openapi
 * /transfer/bank-accounts/{userId}:
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
router.get('/transfer/bank-accounts/:userId');

/**
 * @openapi
 * /transfer/transactions/{userId}:
 *   get:
 *     summary: Get all transactions of the user
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
 *         description: List of transactions
 */
router.get('/transfer/transactions/:userId');

export default router;
