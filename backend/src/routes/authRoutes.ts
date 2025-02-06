import express from 'express'; // Importing express and Router types
import AuthController from '../controllers/authController'; // Importing the controller functions
import AuthMiddleware from '../middlewares/authMiddleware'
import { RequestHandler } from '@nestjs/common/interfaces';
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
 *           example: yilongMa
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: y1l0ngm@
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
 *                  example: yilongMa
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
 *           example: yilongMa
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: y1l0ngm@
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
 *     ProducerReturnGetMeDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the producer
 *           example: producer123
 *         password:
 *           type: string
 *           description: The password of the producer
 *           example: p@ssword123
 *         role:
 *           type: string
 *           enum: [producer, production professional, admin]
 *           description: The role of the user
 *           example: producer
 *         email:
 *           type: string
 *           example: producer@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         middleName:
 *           type: string
 *           example: Doe
 *         lastName:
 *           type: string
 *           example: Smith
 *         phoneNumber:
 *           type: string
 *           example: +1234567890
 *         gender:
 *           type: string
 *           enum: [Male, Female, Non-Binary, Other]
 *           example: Male
 *         bankAccount:
 *           type: object
 *           properties:
 *             bankName:
 *               type: string
 *               example: Bank of America
 *             accountHolderName:
 *               type: string
 *               example: John Smith
 *             accountNumber:
 *               type: string
 *               example: 1234567890
 *         profileImage:
 *           type: string
 *           example: "https://example.com/profile.jpg"
 *         resetPasswordToken:
 *           type: string
 *         resetPasswordExpire:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         company:
 *           type: string
 *           example: ABC Productions
 *         paymentType:
 *           type: string
 *           enum: [qrCode, creditDebit]
 *           example: creditDebit
 *         nameOnCard:
 *           type: string
 *           example: John Smith
 *         cardNumber:
 *           type: string
 *           example: 4111111111111111
 * 
 *     ProductionProfessionalReturnGetMeDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           example: prof123
 *         password:
 *           type: string
 *           example: p@ssword123
 *         role:
 *           type: string
 *           enum: [producer, production professional, admin]
 *           example: production professional
 *         email:
 *           type: string
 *           example: prof@example.com
 *         firstName:
 *           type: string
 *           example: Alice
 *         middleName:
 *           type: string
 *           example: Marie
 *         lastName:
 *           type: string
 *           example: Johnson
 *         phoneNumber:
 *           type: string
 *           example: +9876543210
 *         gender:
 *           type: string
 *           enum: [Male, Female, Non-Binary, Other]
 *           example: Female
 *         occupation:
 *           type: string
 *           example: Cinematographer
 *         skill:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Editing", "Lighting"]
 *         experience:
 *           type: integer
 *           example: 5
 *         rating:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ratingScore:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great professional work!"
 * 
 *     AdminReturnGetMeDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           example: admin123
 *         password:
 *           type: string
 *           example: p@ssword123
 *         role:
 *           type: string
 *           enum: [producer, production professional, admin]
 *           example: admin
 *         email:
 *           type: string
 *           example: admin@example.com
 *         firstName:
 *           type: string
 *           example: Steve
 *         middleName:
 *           type: string
 *           example: R
 *         lastName:
 *           type: string
 *           example: Williams
 *         phoneNumber:
 *           type: string
 *           example: +1122334455
 *         gender:
 *           type: string
 *           enum: [Male, Female, Non-Binary, Other]
 *           example: Male
 *         bankAccount:
 *           type: object
 *           properties:
 *             bankName:
 *               type: string
 *               example: Chase Bank
 *             accountHolderName:
 *               type: string
 *               example: Steve Williams
 *             accountNumber:
 *               type: string
 *               example: 9876543210
 *         profileImage:
 *           type: string
 *           example: "https://example.com/profile.jpg"
 *         resetPasswordToken:
 *           type: string
 *         resetPasswordExpire:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
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

// Get me route - GET /me
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get own user data
 *     tags: [Authentication] 
 *     responses:
 *       200:
 *         description: A user data and success status
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ProducerReturnGetMeDTO'
 *                 - $ref: '#/components/schemas/ProductionProfessionalReturnGetMeDTO'
 *                 - $ref: '#/components/schemas/AdminReturnGetMeDTO'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

router.get('/me', AuthMiddleware.authenticate as express.RequestHandler, AuthController.getMe as express.RequestHandler);
//router.get('/me', AuthMiddleware.authenticate as express.RequestHandler,AuthMiddleware.authorize(['producer']) as RequestHandler , AuthController.getMe as express.RequestHandler);

// Logout route - POST /logout
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout Successful
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       500:
 *         description: Server error
 */
router.post('/logout', AuthMiddleware.authenticate as express.RequestHandler, AuthController.logoutUser);

// Export the router
export default router;
