import { Router } from 'express';
import mediaTypeController from '../controllers/mediaTypeController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: MediaType
 *     description: Media Type API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MediaTypeDTO:
 *       type: object
 *       required:
 *         - mediaName
 *       properties:
 *         mediaName:
 *           type: string
 *           description: The name of the media type
 */

/**
 * @swagger
 * /api/v1/mediaTypes:
 *   get:
 *     summary: Get all media types
 *     tags: [MediaType]
 *     responses:
 *       200:
 *         description: A list of media types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MediaTypeDTO'
 *       500:
 *         description: Server error
 */
router.get('/mediaTypes', mediaTypeController.getAllMediaType);

/**
 * @swagger
 * /api/v1/mediaTypes/{id}:
 *   get:
 *     summary: Get a media type by ID
 *     tags: [MediaType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the media type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single media type object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaTypeDTO'
 *       404:
 *         description: Media type not found
 *       500:
 *         description: Server error
 */
router.get('/mediaTypes/:id', mediaTypeController.getMediaType);

/**
 * @swagger
 * /api/v1/mediaTypes:
 *   post:
 *     summary: Create a new media type
 *     tags: [MediaType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MediaTypeDTO'
 *     responses:
 *       201:
 *         description: The created media type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaTypeDTO'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/mediaTypes', mediaTypeController.createMediaType);

/**
 * @swagger
 * /api/v1/mediaTypes/{id}:
 *   put:
 *     summary: Update an existing media type by ID
 *     tags: [MediaType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the media type
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MediaTypeDTO'
 *     responses:
 *       200:
 *         description: The updated media type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaTypeDTO'
 *       404:
 *         description: Media type not found
 *       500:
 *         description: Server error
 */
router.put('/mediaTypes/:id', mediaTypeController.updateMediaType);

/**
 * @swagger
 * /api/v1/mediaTypes/{id}:
 *   delete:
 *     summary: Delete an existing media type by ID
 *     tags: [MediaType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the media type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media type deleted successfully
 *       404:
 *         description: Media type not found
 *       500:
 *         description: Server error
 */
router.delete('/mediaTypes/:id', mediaTypeController.deleteMediaType);

export default router;
