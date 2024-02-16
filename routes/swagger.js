/**
 * @swagger
 * tags:
 *   name: Admin Routes
 *   description: Routes specified for admin use after logging in as admin.
 * /admin/users:
 *   get:
 *     summary: The list of users
 *     tags:
 *       - Admin Routes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retrieved all registered users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: ['true', 'false']
 *                   description: Whether the request was successful or not
 *                 message:
 *                   type: string
 *                   description: Description of the response
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:

 */
