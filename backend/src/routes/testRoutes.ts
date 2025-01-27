import { Router } from 'express';
import * as testController from '../controllers/testController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Test Api
 */
/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Test]
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
 *     tags: [Test]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
