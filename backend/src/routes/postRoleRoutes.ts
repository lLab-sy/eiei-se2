import { Router } from 'express';
import postRoleController from '../controllers/postRoleController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: PostRole
 *     description: Post Role API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostRoleDTO:
 *       type: object
 *       required:
 *         - roleName
 *       properties:
  
 *         roleName:
 *           type: string
 *           description: The name of the post role
 */

/**
 * @swagger
 * /api/v1/postRoles:
 *   get:
 *     summary: Get all post roles
 *     tags: [PostRole]
 *     responses:
 *       200:
 *         description: A list of post roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostRoleDTO'
 *       500:
 *         description: Server error
 */
router.get('/postRoles', postRoleController.getAllPostRoles);

/**
 * @swagger
 * /api/v1/postRoles:
 *   post:
 *     summary: Create a new post role
 *     tags: [PostRole]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostRoleDTO'
 *     responses:
 *       201:
 *         description: The created post role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostRoleDTO'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/postRoles', postRoleController.createPostRole);

/**
 * @swagger
 * /api/v1/postRoles/{id}:
 *   get:
 *     summary: Get a post role by ID
 *     tags: [PostRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single post role object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostRoleDTO'
 *       404:
 *         description: Post role not found
 *       500:
 *         description: Server error
 */
router.get('/postRoles/:id', postRoleController.getPostRole);

/**
 * @swagger
 * /api/v1/postRoles/{id}:
 *   put:
 *     summary: Update an existing post role by ID
 *     tags: [PostRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post role
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostRoleDTO'
 *     responses:
 *       200:
 *         description: The updated post role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostRoleDTO'
 *       404:
 *         description: Post role not found
 *       500:
 *         description: Server error
 */
router.put('/postRoles/:id', postRoleController.updatePostRole);

/**
 * @swagger
 * /api/v1/postRoles/{id}:
 *   delete:
 *     summary: Delete an existing post role by ID
 *     tags: [PostRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post role deleted successfully
 *       404:
 *         description: Post role not found
 *       500:
 *         description: Server error
 */
router.delete('/postRoles/:id', postRoleController.deletePostRole);

export default router;
