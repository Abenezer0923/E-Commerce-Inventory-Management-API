const express = require('express');
const { addItem, updateItem, deleteItem, getItems } = require('../controllers/inventoryController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the inventory item
 *         quantity:
 *           type: integer
 *           description: The quantity of the item in stock
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the item
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Retrieve a list of all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 */
router.get('/', verifyToken, getItems);

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: The inventory item was successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', verifyToken, permit('Admin', 'Manager'), addItem);

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update an existing inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the inventory item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: The inventory item was successfully updated
 *       404:
 *         description: Inventory item not found
 */
router.put('/:id', verifyToken, permit('Admin', 'Manager'), updateItem);

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the inventory item to delete
 *     responses:
 *       200:
 *         description: The inventory item was successfully deleted
 *       404:
 *         description: Inventory item not found
 */
router.delete('/:id', verifyToken, permit('Admin', 'Manager'), deleteItem);

module.exports = router;
