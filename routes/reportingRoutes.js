const express = require('express');
const router = express.Router();
const ReportingController = require('../controllers/ReportingController');

/**
 * @swagger
 * tags:
 *   name: Reporting
 *   description: API for generating various reports in CSV format
 */

/**
 * @swagger
 * /report/inventory:
 *   get:
 *     summary: Generate a CSV report for inventory
 *     tags: [Reporting]
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get('/inventory', ReportingController.generateInventoryReport);

/**
 * @swagger
 * /report/sales:
 *   get:
 *     summary: Generate a CSV report for sales transactions
 *     tags: [Reporting]
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get('/sales', ReportingController.generateSalesReport);

/**
 * @swagger
 * /report/purchase:
 *   get:
 *     summary: Generate a CSV report for purchase orders
 *     tags: [Reporting]
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: CSV report generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get('/purchase', ReportingController.generatePurchaseOrdersReport);

/**
 * @swagger
 * /report/send-email:
 *   post:
 *     summary: Send an email with the attached report
 *     tags: [Reporting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The recipient's email address
 *               reportType:
 *                 type: string
 *                 description: The type of report to send (e.g., 'inventory', 'sales', 'purchase')
 *     responses:
 *       200:
 *         description: Email sent successfully with the report
 *       500:
 *         description: Server error
 */
router.post('/send-email', ReportingController.sendEmailWithReport);

module.exports = router;
