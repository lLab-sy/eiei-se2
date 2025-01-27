import { Router } from 'express';
import * as testController from '../controllers/testController';

const router = Router();

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     responses:
 *       200:
 *         description: A list of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestDTO'
 */
router.get('/tests', testController.getAllTests);

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create a new test
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestDTO'
 */
router.post('/tests', testController.createTest);

export default router;
