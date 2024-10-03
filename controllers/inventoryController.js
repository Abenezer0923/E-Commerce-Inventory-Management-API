const Inventory = require('../models/Inventory');
const { sendNotification } = require('../util/kafkaProducer');

// Get all items with optional search and filter
exports.getItems = async (req, res) => {
  try {
    const { name, category, minQuantity, maxQuantity } = req.query;

    // Build the query object
    const query = {};

    // Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Matches any name containing the search term
    }

    // Filter by category
    if (category) {
      query.category = category; // Exact match for category
    }

    // Filter by minimum quantity
    if (minQuantity) {
      query.quantity = { ...query.quantity, $gte: Number(minQuantity) }; // Greater than or equal to minQuantity
    }

    // Filter by maximum quantity
    if (maxQuantity) {
      query.quantity = { ...query.quantity, $lte: Number(maxQuantity) }; // Less than or equal to maxQuantity
    }

    // Fetch items based on the constructed query
    const items = await Inventory.find(query);

    // Respond with the filtered items
    res.json(items);
  } catch (err) {
    console.error('Error fetching inventory items:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Add new item
exports.addItem = async (req, res) => {
  try {
    const { name, description, category, price, quantity } = req.body;

    const newItem = new Inventory({
      name,
      description,
      category,
      price,
      quantity,
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};



// Threshold for low stock
const LOW_STOCK_THRESHOLD = 10;

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, quantity } = req.body;

    const item = await Inventory.findByIdAndUpdate(id, 
      { name, description, category, price, quantity }, 
      { new: true }
    );

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Check if the updated quantity is below the low stock threshold
    if (quantity < LOW_STOCK_THRESHOLD) {
      const lowStockMessage = {
        type: 'LOW_STOCK',
        item: item.name,
        quantity,
        message: `${item.name} is running low on stock! Only ${quantity} left.`
      };

      // Send Kafka low stock notification
      sendNotification('low-stock-alerts', lowStockMessage);
      console.log(`Low stock alert triggered for ${item.name}`);
    }

    // Check if the item is out of stock
    if (quantity === 0) {
      const outOfStockMessage = {
        type: 'OUT_OF_STOCK',
        item: item.name,
        message: `${item.name} is now out of stock.`
      };

      // Send Kafka out of stock notification
      sendNotification('out-of-stock-alerts', outOfStockMessage);
      console.log(`Out of stock notification triggered for ${item.name}`);
    }

    // Respond with the updated item
    res.json(item);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByIdAndDelete(id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    res.json({ msg: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
