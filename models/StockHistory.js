// models/StockHistory.js
const mongoose = require('mongoose');

const StockHistorySchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory', // Reference to the Inventory model
    required: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'sale', 'return', 'adjustment'], // Define the types of stock movements
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Default to current date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (optional)
    required: true,
  },
});

module.exports = mongoose.model('StockHistory', StockHistorySchema);
