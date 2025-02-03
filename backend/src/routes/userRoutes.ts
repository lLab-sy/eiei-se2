import { Router } from "express";
import userController from "../controllers/userController";

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     ProducerDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the producer
 *           maxLength: 50
 *           minLength: 15
 *         role:
 *           type: string
 *           description: Role of the user (must be 'producer')
 *           enum: ["producer"]
 *         password:
 *           type: string
 *           description: Password (must be between 8-20 characters)
 *           minLength: 8
 *           maxLength: 20
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the producer
 *         phoneNumber:
 *           type: string
 *           description: Contact number of the producer
 *         company:
 *           type: string
 *           description: Company name of the producer
 *         paymentType:
 *           type: string
 *           enum: ["qrCode", "creditDebit"]
 *           description: Payment type for the producer
 *         nameOnCard:
 *           type: string
 *           description: Name on the credit/debit card
 *         cardNumber:
 *           type: string
 *           description: Credit/Debit card number
 * 
 *     ProductionProfessionalDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the production professional
 *           maxLength: 50
 *           minLength: 15
 *         role:
 *           type: string
 *           description: Role of the user (must be 'production professional')
 *           enum: ["production professional"]
 *         password:
 *           type: string
 *           description: Password (must be between 8-20 characters)
 *           minLength: 8
 *           maxLength: 20
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the production professional
 *         phoneNumber:
 *           type: string
 *           description: Contact number of the production professional
 *         occupation:
 *           type: string
 *           description: Occupation of the production professional
 *         skill:
 *           type: array
 *           items:
 *             type: string
 *           description: List of skills (e.g., ['Cameraman', 'Editing'])
 *         experience:
 *           type: number
 *           description: Years of experience
 *         rating:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ratingScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating score (0-5)
 *               comment:
 *                 type: string
 *                 description: Rating comment
 */

/**
 * @swagger
 * /api/users/update-user/{id}:
 *   put:
 *     summary: Update user details (Producer or Production Professional)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/ProducerDTO'
 *               - $ref: '#/components/schemas/ProductionProfessionalDTO'
 *           examples:
 *             producerExample:
 *               summary: Update Producer
 *               value:
 *                 username: "TestProducer"
 *                 password: "12345678!"
 *                 role: "producer"
 *                 email: "TestProducer@gmail.com"
 *                 phoneNumber: "09823111112"
 *                 company: "Test Company"
 *                 paymentType: "qrCode"
 *                 nameOnCard: "John Doe"
 *                 cardNumber: "1234-5678-9012-3456"
 *             productionProfessionalExample:
 *               summary: Update Production Professional
 *               value:
 *                 username: "TestProductionProfessional"
 *                 password: "12345678!"
 *                 role: "production professional"
 *                 email: "TestProductionProfessional@gmail.com"
 *                 phoneNumber: "1234567891"
 *                 occupation: "Cameraman"
 *                 skill: ["Cameraman", "Editing"]
 *                 experience: 5
 *                 rating:
 *                   - ratingScore: 4.5
 *                     comment: "Great professional!"
 *     responses:
 *       200:
 *         description: The updated user (Producer or Production Professional)
 *         content:
 *           application/json:
 *             oneOf:
 *               - $ref: '#/components/schemas/ProducerDTO'
 *               - $ref: '#/components/schemas/ProductionProfessionalDTO'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Server error
 */
router.put('/update-user/:id', userController.updateUser)

export default router