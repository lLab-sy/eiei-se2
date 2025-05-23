import { Router,Request } from 'express';
import postController from '../controllers/postController';
import AuthMiddleware from '../middlewares/authMiddleware'
import { RequestHandler } from '@nestjs/common/interfaces';
import multer from 'multer';
import path from 'path';

const router = Router();
const storage = multer.memoryStorage()
const fileFilter = (req: Request, file: any, cb: Function) => {
    const filetypes = /png|jpeg|gif|webp|jpg/;
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
 *     PostWithIDDTO:
 *       type: object
 *       required:
 *         - id
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
 *         id:
 *           type: string
 *           description: The id of the post
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
 * 
 * 
 *     PaticipantRatingDTO:
 *       type: object
 *       required:
 *         - ratingScore
 *         - comment
 *       properties:
 *         ratingScore:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: rating score in range 0-5
 *         comment:
 *           type: string
 *           description: comment about user work
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
 * /api/v1/posts/{id}/startProject:
 *   put:
 *     summary: Change post status to in-progress (need authen)
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complete start project
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
// router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);
router.put('/posts/:id/startProject', AuthMiddleware.authenticate as RequestHandler, postController.startProject as RequestHandler);

/**
 * @swagger
 * /api/v1/posts/getPostParticipant/{id}:
 *   get:
 *     summary: get ont participant in post (need authen)
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully get post
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
// router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);
router.get('/posts/getPostParticipant/:id', AuthMiddleware.authenticate as RequestHandler, postController.getPostParticipant as RequestHandler);

/**
 * @swagger
 * /api/v1/posts/{id}/sumCandidateOffer:
 *   get:
 *     summary: Get the sum of latest offers made to candidates for a post
 *     description: Calculates and returns the total of the latest offers made to participants with candidate status for the specified post.
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved the sum of candidate offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Successfully get sum candidate offer
 *                 data:
 *                   type: number
 *                   example: 1500
 *       400:
 *         description: Failed to get sum candidate offer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to get sum candidate offer
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
router.get('/posts/:id/sumCandidateOffer', AuthMiddleware.authenticate as RequestHandler, postController.getSumCandidateOffer as RequestHandler);
// 

/**
 * @swagger
 * /api/v1/posts/{id}/addReview:
 *   post:
 *     summary: Add review to post by user (need authen)
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
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
 *             $ref: '#/components/schemas/PaticipantRatingDTO'
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
// router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);
router.post('/posts/:id/addReview', AuthMiddleware.authenticate as RequestHandler, postController.addPostReview as RequestHandler);


/**
 * @swagger
 * /api/v1/posts/{id}/sendSubmission:
 *   post:
 *     summary: Send submission to post by user (need authen)
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
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
// router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);
router.post('/posts/:id/sendSubmission', AuthMiddleware.authenticate as RequestHandler, postController.sendSubmission as RequestHandler);

/**
 * @swagger
 * /api/v1/posts/{id}/sendApprove:
 *   put:
 *     summary: Send approve to post by producer (need authen)
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: false
 *         description: The unique identifier of the candidate (if not assume all)
 *         schema:
 *           type: string
 *       - in: query
 *         name: isApprove
 *         required: false
 *         description: approve = 1, reject = 0
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Successfully approve post
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
// router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);
router.put('/posts/:id/sendApprove', AuthMiddleware.authenticate as RequestHandler, postController.sendApprove as RequestHandler);


/**
 * @swagger
 * /api/v1/posts/user/prof:
 *   get:
 *     summary: Get posts by a specific user
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postStatus
 *         schema:
 *           type: string
 *         description: The status of post
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
 *         description: Successfully retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/PostDTO"
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 5
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                 message:
 *                   type: string
 *                   example: Successfully get posts
 *       404:
 *         description: Posts not found
 *       500:
 *         description: Server error
 */
router.get('/posts/user/prof', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByProf as RequestHandler);
/**
 * @swagger
 * /api/v1/posts/user/producer:
 *   get:
 *     summary: Get posts by a specific user
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postStatus
 *         schema:
 *           type: string
 *         description: The status of post
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
 *         description: Successfully retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/PostDTO"
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 5
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                 message:
 *                   type: string
 *                   example: Successfully get posts
 *       404:
 *         description: Posts not found
 *       500:
 *         description: Server error
 */
router.get('/posts/user/producer', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByProducer as RequestHandler);
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
 *     security:
 *      - BearerAuth: []
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
// router.get('/posts/user', AuthMiddleware.authenticate as RequestHandler, postController.getPostsByUser as RequestHandler);
router.post('/posts', AuthMiddleware.authenticate as RequestHandler, upload.array('postImagesSend'), postController.createPost as RequestHandler);
// router.post('/upload-profile/:id',upload.single('profileImage'), userController.uploadProfileImage)
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
 * /api/v1/posts/getOffers:
 *   get:
 *     summary: Get offer details
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: The id of the production professional (if you are producer, it is optional)
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: The id of the post
 *       - in: query
 *         name: postStatus
 *         schema:
 *           type: string
 *         description: The status of post
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of offers per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The current page number
 *     responses:
 *       200:
 *         description: Successfully retrieved offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67b463aae151ca405ff1951f"
 *                           postName:
 *                             type: string
 *                             example: "Graphic Design for Branding2"
 *                           roleName:
 *                             type: string
 *                             example: "Actor"
 *                           currentWage:
 *                             type: integer
 *                             example: 1400
 *                           reason:
 *                             type: string
 *                             example: "Skilled lighting technician."
 *                           offeredBy:
 *                             type: integer
 *                             example: 1
 *                           status:
 *                             type: string
 *                             example: "candidate"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-01-20T16:00:00.000Z"
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalItems:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                 message:
 *                   type: string
 *                   example: Successfully get offers
 *       404:
 *         description: Offers not found
 *       500:
 *         description: Server error
 */
router.get('/posts/getOffers', AuthMiddleware.authenticate as RequestHandler, postController.getOffers as RequestHandler);

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
 *     security:
 *      - BearerAuth: []
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
router.put('/posts/:id', AuthMiddleware.authenticate as RequestHandler, upload.array('postImagesSend'), postController.updatePost as RequestHandler);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete an existing post by ID
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
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
router.delete('/posts/:id', AuthMiddleware.authenticate as RequestHandler, postController.deletePost as RequestHandler);

/**
 * @swagger
 * /api/v1/create-offer:
 *   post:
 *     summary: Create a new offer for a participant in a post
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleID
 *               - productionProfessionalID
 *               - price
 *               - offeredBy
 *               - createdAt
 *               - reason
 *               - postID
 *             properties:
 *               roleID:
 *                 type: string
 *                 description: The ID of the role being offered
 *               productionProfessionalID:
 *                 type: string
 *                 description: The ID of the professional receiving the offer
 *               price:
 *                 type: number
 *                 description: The amount offered
 *               offeredBy:
 *                 type: number
 *                 description: The user making the offer (0 = system, 1 = user)
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the offer was made
 *               reason:
 *                 type: string
 *                 description: The reason for the offer
 *               postID:
 *                 type: string
 *                 description: The ID of the post associated with the offer
 *     responses:
 *       201:
 *         description: Offer created successfully
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Post or participant not found
 *       500:
 *         description: Internal server error
 */
router.post('/create-offer', AuthMiddleware.authenticate as RequestHandler, postController.createOffer as RequestHandler);

/**
 * @swagger
 * /api/v1/posts/{id}/participants:
 *   get:
 *     summary: Get all participants for a post
 *     tags: [Post]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of participants in the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "67b1a81ded193cb7b3dd94bb"
 *                   label:
 *                     type: string
 *                     example: "Johny Stafrod - Prop Master"
 *       403:
 *         description: Unauthorized, only the post owner can view participants
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get(
    "/posts/:id/participants",
    AuthMiddleware.authenticate as RequestHandler,
    postController.getPostParticipants as RequestHandler
  );

  
/**
 * @swagger
 * /api/v1/posts/participant-status:
 *   patch:
 *     summary: change participant status from in-progress to candidate or reject in specific post
 *     tags: [Post]
 *     security:
 *       - BearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postID
 *               - participantID
 *               - statusToChange
 *             properties:
 *               postID:
 *                 type: string
 *                 description: The ID of the post associated with the offer
 *               participantID:
 *                 type: string
 *                 description: The ID of the participant which the producer want to change status  
 *               statusToChange:
 *                 type: string
 *                 description: The status to change to (candidate or reject) 
 *     responses:
 *       200:
 *         description: Confirm offer successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */
router.patch('/posts/participant-status', AuthMiddleware.authenticate as RequestHandler, postController.changeParticipantStatus as RequestHandler);

export default router;
