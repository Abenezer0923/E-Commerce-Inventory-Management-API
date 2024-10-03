// routes/notifications.js
const express = require('express');
const { getAllNotifications } = require('../util/notificationsStore');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing notifications from Kafka
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
  const notifications = getAllNotifications();
  res.json(notifications);
});

module.exports = router;
