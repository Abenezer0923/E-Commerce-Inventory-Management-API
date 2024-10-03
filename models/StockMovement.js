// models/StockMovement.js

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem', // Reference to the Inventory Item model
    required: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'sale', 'return', 'adjustment'], // Types of stock movement
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('StockMovement', stockMovementSchema);
