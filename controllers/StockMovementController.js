const StockHistory = require('../models/StockHistory');
const Inventory = require('../models/Inventory');
const {sendNotification} = require('../util/kafkaProducer');

// Predefined inventory threshold
const LOW_STOCK_THRESHOLD = 10;

// Notify users if inventory falls below threshold
const notifyUsers = async (inventory) => {
  const { itemId, quantity } = inventory;

  // Check if the quantity is below the threshold
  if (quantity <= LOW_STOCK_THRESHOLD) {
    // Notify users about low stock
    console.log("that is going on................")
    sendNotification('low-stock-alerts', {
      itemId: itemId,
      message: `Warning: Item ${itemId} is running low on stock with only ${quantity} units left.`,
    });

    // Example: You could also notify users via email, SMS, or other methods here
    console.log(`Notification sent: Item ${itemId} has low stock (${quantity} units).`);
  }
};

// Create a stock movement
exports.createStockMovement = async (req, res) => {
  const { itemId, type, quantity } = req.body; // Assuming these are the fields sent in the request
  const userId = req.user.userId; // Get userId from the decoded JWT

  try {
    // Check current inventory for the item
    const currentInventory = await Inventory.findById(itemId);

    if (!currentInventory) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Validate if requested quantity exceeds available stock for 'sale' type
    if (type === 'sale' && quantity > currentInventory.quantity) {
      return res.status(400).json({ msg: 'Requested quantity exceeds available stock' });
    }

    // Create a new stock history entry
    const stockMovement = new StockHistory({
      itemId,
      type,
      quantity,
      userId, // Associate the movement with the user
    });

    // Save the stock movement to the database
    await stockMovement.save();

    // Update inventory based on stock movement type
    let updatedInventory;
    if (type === 'purchase') {
      updatedInventory = await Inventory.findByIdAndUpdate(itemId, { $inc: { quantity: quantity } }, { new: true });
    } else if (type === 'sale') {
      updatedInventory = await Inventory.findByIdAndUpdate(itemId, { $inc: { quantity: -quantity } }, { new: true });
      
      // Check if the inventory quantity is now zero after the sale
      if (updatedInventory.quantity === 0) {
        // Send out of stock alert
        sendNotification('out-of-stock-alerts', {
          itemId: itemId,
          message: `Item ${currentInventory.name} is out of stock.`,
        });
        return res.status(200).json({ msg: 'Stock movement recorded, item is now out of stock', stockMovement });
      }
    } else if (type === 'return') {
      updatedInventory = await Inventory.findByIdAndUpdate(itemId, { $inc: { quantity: quantity } }, { new: true });
    } else if (type === 'adjustment') {
      updatedInventory = await Inventory.findByIdAndUpdate(itemId, { quantity: quantity }, { new: true });
    }

    // Check for low stock and notify users
    if (updatedInventory.quantity < 5 && updatedInventory.quantity > 0) {
      sendNotification('low-stock-alerts', {
        itemId: itemId,
        message: `Warning: Item ${currentInventory.name} is low on stock with only ${updatedInventory.quantity} units left.`,
      });
      console.log(`Low stock notification sent for item ${itemId} with quantity ${updatedInventory.quantity}`);
    }

    // Check for large stock and notify users
    if (updatedInventory.quantity > 100) {
      sendNotification('large-stock-alerts', {
        itemId: itemId,
        message: `Item ${currentInventory.name} has a large stock of ${updatedInventory.quantity} units available.`,
      });
      console.log(`Large stock notification sent for item ${itemId} with quantity ${updatedInventory.quantity}`);
    }

    return res.status(201).json({ msg: 'Stock movement recorded successfully', stockMovement });

  } catch (err) {
    console.error('Error creating stock movement:', err.message);
    res.status(500).json({ msg: 'Server error', err });
  }
};





// Get all stock movements
exports.getAllStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockHistory.find().populate('itemId userId'); // Populate fields if needed
    res.json(stockMovements);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};
