const express = require('express');
const userRoutes = require('./userRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const stockMovementRoutes = require('./stockMovements');
const reportingRoutes = require('./reportingRoutes');
const notifications = require('./notifications');

const router = express.Router();

// Use routes
router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/stock-movements', stockMovementRoutes);
router.use('/report', reportingRoutes);
router.use('/notifications', notifications);

module.exports = router;
