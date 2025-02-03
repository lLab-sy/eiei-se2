import express from 'express'; // Importing express and Router types
import AuthController from '../controllers/authController'; // Importing the controller functions

const router = express.Router(); // Explicitly typing the router as a Router instance

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: The name of the user
 *           example: johnXina
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: j0hnX1na@
 *         role:
 *           type: string
 *           enum: [producer, production professional, admin]
 *           description: The role of the user
 *           example: producer
 *     ReturnRegisterDTO:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *           description: The status of the response
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *              username:
 *                  type: string
 *                  description: The name of the user
 *                  example: johnXina
 *              role:
 *                  type: string
 *                  enum: [producer, production professional, admin]
 *                  description: The role of the user
 *                  example: producer
 *         message:
 *           type: string
 *           description: The message description of the response status
 *           example: Register successful.
 *     LoginDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The name of the user
 *           example: johnXina
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: j0hnX1na@
 *     ReturnLoginDTO:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *           description: The status of the response
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *              token:
 *                  type: string
 *              user:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                      username:
 *                          type: string
 *                          example: johnXina
 *                      role:
 *                          type: string
 *                          enum: [producer, production professional, producer]
 *                          example: produceer
 *         message:
 *           type: string
 *           description: The message description of the response status
 *           example: Login successful
 */

// Register route - POST /register
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDTO'
 *     responses:
 *       200:
 *         description: A user data and success status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReturnRegisterDTO'
 *       500:
 *         description: Server error
 */
router.post('/register', AuthController.createUser);
// Login route - POST /login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     responses:
 *       200:
 *         description: A user data and success status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReturnLoginDTO'
 *       500:
 *         description: Server error
 */
router.post('/login', AuthController.loginUser);

// Export the router
export default router;
