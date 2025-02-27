import { Router } from 'express';
import postController from '../controllers/postController';
import AuthMiddleware from '../middlewares/authMiddleware'
import { RequestHandler } from '@nestjs/common/interfaces';

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
 *         - postImages
 *         - postMediaType
 *         - postProjectRoles
 *         - userID
 *         - postStatus
 *         - startDate
 *         - endDate
 *       properties:
 *         postName:
 *           type: string
 *           description: The name of the post
 *           maxLength: 50
 *         postDescription:
 *           type: string
 *           description: The description of the post
 *           maxLength: 500
 *         postImages:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of image URLs for the post
 *         postMediaType:
 *           type: string
 *           description: The media type of the post
 *         postProjectRoles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [actor, cameraman, editor, vtuber]
 *           description: The roles associated with the post
 *         userID:
 *           type: string
 *           description: The user belong this post
 *         postStatus:
 *           type: string
 *           enum: [created, in-progress, success, cancel]
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
 * /api/v1/posts/search:
 *   get:
 *     summary: Search posts US4-2
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: The name of the post or project detail
 *       - in: query
 *         name: postMediaTypes
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: The media type of the post
 *       - in: query
 *         name: roleRequirements
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: The roles in the project associated with the post
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of posts per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The current page number
 *     responses:
 *       200:
 *         description: The retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostDTO"
 *       404:
 *         description: Posts not found
 *       500:
 *         description: Server error
 */
router.get('/posts/search', postController.searchPost);

/**
 * @swagger
 * /api/v1/posts:
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
 *       500:
 *         description: Server error
 */
router.get('/posts', postController.getAllPosts);

/**
 * @swagger
 * /api/v1/posts:
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
 *       500:
 *         description: Server error
 */
router.post('/posts', postController.createPost);

/**
 * @swagger
 * /api/v1/posts/user:
 *   get:
 *     summary: Get posts by a specific user
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDTO'
 *       404:
 *         description: No posts found for the user
 *       500:
 *         description: Server error
 */
router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/posts/:id', postController.getPost);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update an existing post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostDTO'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/posts/:id', postController.updatePost);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete an existing post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete('/posts/:id', postController.deletePost);




export default router;
