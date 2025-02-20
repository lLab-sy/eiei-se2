import { Request, Router } from "express";
import userController from "../controllers/userController";
import multer from "multer";
import path from 'path'

const router = Router()
const storage = multer.memoryStorage()
const fileFilter = (req: Request, file: any, cb: Function) => {
    const filetypes = /png|jpeg|gif|webp/;
    // Check file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // const sizeCheck = file.size < maxSize
    // console.log(file.size)
    // Check MIME type
    const mimeType = file.mimetype.startsWith('image/');
    if (extname && mimeType) {
        return cb(null, true);
    }
    else {
        return cb(new Error("Error: Only PNG, JPEG, and GIF files are allowed!"));
    }
};
const maxSize = 5 * 1024 * 1024 // bytes / 5mb
const upload = multer({
    storage: storage,
    fileFilter,
    limits : {fileSize : maxSize}
})
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
router.put('/update-user/:id',upload.single('profileImage') , userController.updateUser)
// upload Image
router.post('/upload-profile/:id',upload.single('profileImage'), userController.uploadProfileImage)
// get Signed Profile URL
router.get('/signed-profile/:id', userController.getSignedURL)
/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search for production professionals
 *     tags: [User]
 *     description: Retrieve a list of production professionals based on search criteria.
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Text to search for in professional names and skills.
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: number
 *         description: Minimum years of experience.
 *       - in: query
 *         name: maxExperience
 *         schema:
 *           type: number
 *         description: Maximum years of experience.
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum average rating.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of results per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination.
 *     responses:
 *       200:
 *         description: A list of production professionals and pagination metadata.
 *       500:
 *         description: Internal server error.
 */
router.get("/search", userController.search);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single user object
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/:id", userController.getUserByID);

export default router