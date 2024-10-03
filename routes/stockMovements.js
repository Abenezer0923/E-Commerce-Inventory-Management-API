const express = require('express');
const { createStockMovement, getAllStockMovements } = require('../controllers/StockMovementController');
const verifyToken = require('../middleware/authMiddleware'); 
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock Movements
 *   description: API for managing stock movements in the inventory system
 */

/**
 * @swagger
 * /stock-movements:
 *   post:
 *     summary: Create a new stock movement
 *     tags: [Stock Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the item
 *               type:
 *                 type: string
 *                 description: The type of stock movement (e.g., 'purchase', 'sale', 'return', 'adjustment')
 *               quantity:
 *                 type: integer
 *                 description: The quantity of items in the movement
 *     responses:
 *       201:
 *         description: Stock movement recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Stock movement recorded successfully
 *                 stockMovement:
 *                   $ref: '#/components/schemas/StockMovement'
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, createStockMovement);

/**
 * @swagger
 * /stock-movements:
 *   get:
 *     summary: Get all stock movements
 *     tags: [Stock Movements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all stock movements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockMovement'
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getAllStockMovements);

module.exports = router;
