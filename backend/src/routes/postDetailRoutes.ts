import { Router } from 'express';
import postDetailController from '../controllers/postDetailController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: PostDetail
 *     description: Post Detail API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PostDetailDTO:
 *       type: object
 *       required:
 *         - postId
 *         - CandidateDetail
 *       properties:
 *         postId:
 *           type: string
 *           description: The ID of the post
 *         CandidateDetail:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               RoleID:
 *                 type: string
 *                 description: The role ID associated with the candidate
 *               CandidateID:
 *                 type: string
 *                 description: The candidate's unique ID
 */

/**
 * @swagger
 * /api/v1/postDetails:
 *   get:
 *     summary: Get all post details
 *     tags: [PostDetail]
 *     responses:
 *       200:
 *         description: A list of post details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDetailDTO'
 *       500:
 *         description: Server error
 */
router.get('/postDetails', postDetailController.getAllPostDetails);

/**
 * @swagger
 * /api/v1/postDetails:
 *   post:
 *     summary: Create a new post detail
 *     tags: [PostDetail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostDetailDTO'
 *     responses:
 *       201:
 *         description: The created post detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDetailDTO'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/postDetails', postDetailController.createPostDetail);

/**
 * @swagger
 * /api/v1/postDetails/{id}:
 *   get:
 *     summary: Get a post detail by ID
 *     tags: [PostDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post detail
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single post detail object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDetailDTO'
 *       404:
 *         description: Post detail not found
 *       500:
 *         description: Server error
 */
router.get('/postDetails/:id', postDetailController.getPostDetail);

/**
 * @swagger
 * /api/v1/postDetails/{id}:
 *   put:
 *     summary: Update an existing post detail by ID
 *     tags: [PostDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post detail
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostDetailDTO'
 *     responses:
 *       200:
 *         description: The updated post detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDetailDTO'
 *       404:
 *         description: Post detail not found
 *       500:
 *         description: Server error
 */
router.put('/postDetails/:id', postDetailController.updatePostDetail);

/**
 * @swagger
 * /api/v1/postDetails/{id}:
 *   delete:
 *     summary: Delete an existing post detail by ID
 *     tags: [PostDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post detail
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post detail deleted successfully
 *       404:
 *         description: Post detail not found
 *       500:
 *         description: Server error
 */
router.delete('/postDetails/:id', postDetailController.deletePostDetail);

/**
 * @swagger
 * /api/v1/postDetails/add/{id}:
 *   put:
 *     summary: Add a candidate to the post detail
 *     tags: [PostDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post detail
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - RoleID
 *               - CandidateID
 *             properties:
 *               RoleID:
 *                 type: string
 *                 description: The role ID associated with the candidate
 *               CandidateID:
 *                 type: string
 *                 description: The candidate's unique ID
 *     responses:
 *       200:
 *         description: Candidate added successfully
 *       404:
 *         description: Post detail not found
 *       500:
 *         description: Server error
 */
router.put('/postDetails/add/:id', postDetailController.updatePostDetailAddCandidate);

/**
 * @swagger
 * /api/v1/postDetails/delete/{id}:
 *   put:
 *     summary: Remove a candidate from the post detail by RoleID and CandidateID
 *     tags: [PostDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post detail
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - RoleID
 *               - CandidateID
 *             properties:
 *               RoleID:
 *                 type: string
 *                 description: The role's unique ID
 *               CandidateID:
 *                 type: string
 *                 description: The candidate's unique ID to remove
 *     responses:
 *       200:
 *         description: Candidate removed successfully
 *       404:
 *         description: Post detail not found
 *       500:
 *         description: Server error
 */

router.put('/postDetails/delete/:id', postDetailController.updatePostDetailDeleteCandidate);


/**
 * @swagger
 * /api/v1/postDetails/user/{id}:
 *   get:
 *     summary: Get posts associated with a production professional
 *     tags: [PostDetail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the production professional (user ID)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts associated with the production professional
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The post ID
 *                   postDetailID:
 *                     type: string
 *                     description: The post detail ID
 *                   userID:
 *                     type: string
 *                     description: The production professional's user ID
 *                   rolename:
 *                     type: string
 *                     description: The role name assigned to the professional
 *                   postStatus:
 *                     type: string
 *                     description: The current status of the post
 *                   postDescription:
 *                     type: string
 *                     description: The description of the post
 *                   postImages:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The list of images associated with the post
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the post
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     description: The end date of the post
 *       404:
 *         description: No posts found for the given production professional
 *       500:
 *         description: Server error
 */
router.get('/postDetails/user/:id', postDetailController.getPostsByProductionProfessional);

export default router;
