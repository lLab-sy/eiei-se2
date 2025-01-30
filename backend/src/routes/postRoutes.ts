import { Router } from 'express';
import postController from '../controllers/postController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Post
 *     description: Post API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostDTO:
 *       type: object
 *       required:
 *         - postName
 *         - postDescription
 *         - postImage
 *         - postMediaType
 *         - postProjectRole
 *         - postStatus
 *         - startDate
 *         - endDate
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the post
 *         postName:
 *           type: string
 *           description: The name of the post
 *           maxLength: 50
 *         postDescription:
 *           type: string
 *           description: The description of the post
 *           maxLength: 500
 *         postImage:
 *           type: string
 *           description: The image URL of the post
 *         postMediaType:
 *           type: string
 *           description: The media type of the post
 *         postProjectRole:
 *           type: string
 *           enum: [actor, cameraman, editor, vtuber]
 *           description: The role in the project associated with the post
 *         postStatus:
 *           type: string
 *           enum: [created, in-progress, success, delete]
 *           description: The status of the post
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date of the post
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date of the post
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDTO'
 */
router.get('/posts', postController.getAllPosts);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostDTO'
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       400:
 *         description: Invalid input
 */
router.post('/posts', postController.createPost);

export default router;
