const Inventory = require('../models/Inventory');
const StockHistory = require('../models/StockHistory'); 
const { Parser } = require('json2csv'); // For CSV generation
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Utility function to ensure the 'files' directory exists
const ensureFilesDirExists = () => {
  const filesDir = path.join(__dirname, '../files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
    console.log(`Created directory: ${filesDir}`);
  }
};


// Generate Inventory Report (CSV)
exports.generateInventoryReport = async (req, res) => {
  console.log("Generating inventory report...");  
  try {
    const inventoryItems = await Inventory.find().lean();

    // Generate CSV
    const csvParser = new Parser();
    const csv = csvParser.parse(inventoryItems);

    // Ensure the 'files' directory exists
    ensureFilesDirExists();

    // Save the CSV to the ./files directory
    const csvFilePath = path.join(__dirname, '../files/inventory-report.csv');
    fs.writeFileSync(csvFilePath, csv);
    console.log(`Inventory report saved at: ${csvFilePath}`);

    res.header('Content-Type', 'text/csv');
    res.attachment('inventory-report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ msg: 'Error generating inventory report', error });
  }
};

// Generate Sales Transactions Report
exports.generateSalesReport = async (req, res) => {
  try {
    // Fetch sales transactions, populating the item and user names
    const salesTransactions = await StockHistory.find({ type: 'sale' })
      .populate('itemId', 'name') // Populate item name from the Inventory model
      .populate('userId', 'name') // Populate user name from the User model
      .lean(); // Return plain objects, not Mongoose documents

    // Modify the data to include the item name and user name
    const transactionsWithNames = salesTransactions.map(transaction => ({
      _id: transaction._id,
      itemName: transaction.itemId ? transaction.itemId.name : 'Unknown Item', // Check for itemId
      type: transaction.type,
      quantity: transaction.quantity,
      userName: transaction.userId ? transaction.userId.name : 'Unknown User', // Check for userId
      date: transaction.date,
    }));

    // Define the fields for the CSV file
    const fields = ['_id', 'itemName', 'type', 'quantity', 'userName', 'date'];
    const csvParser = new Parser({ fields });
    const csv = csvParser.parse(transactionsWithNames);

    // Ensure the 'files' directory exists
    ensureFilesDirExists();

    // Save the CSV to the ./files directory
    const csvFilePath = path.join(__dirname, '../files/sales-report.csv');
    fs.writeFileSync(csvFilePath, csv);
    console.log(`Sales report saved at: ${csvFilePath}`);

    // Send the CSV file as a response
    res.header('Content-Type', 'text/csv');
    res.attachment('sales-report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating sales report:', error); // Log the error for debugging
    res.status(500).json({ msg: 'Error generating sales report', error });
  }
};


// Generate Purchase Orders Report
exports.generatePurchaseOrdersReport = async (req, res) => {
  console.log("Generating purchase orders report...");  
  try {
    const purchaseOrders = await StockHistory.find({ type: 'purchase' })
      .populate('itemId', 'name') // Populate item name from the Inventory model
      .populate('userId', 'name') // Populate user name from the User model
      .lean();

    // Prepare data for the CSV
    const purchaseOrdersWithNames = purchaseOrders.map(order => ({
      _id: order._id,
      itemName: order.itemId ? order.itemId.name : 'Unknown Item', // Check for itemId
      type: order.type,
      quantity: order.quantity,
      userName: order.userId ? order.userId.name : 'Unknown User', // Check for userId
      date: order.date,
    }));

    // Define the fields for the CSV file
    const fields = ['_id', 'itemName', 'type', 'quantity', 'userName', 'date'];
    const csvParser = new Parser({ fields });
    const csv = csvParser.parse(purchaseOrdersWithNames);

    // Ensure the 'files' directory exists
    ensureFilesDirExists();

    // Save the CSV to the ./files directory
    const csvFilePath = path.join(__dirname, '../files/purchase-orders-report.csv');
    fs.writeFileSync(csvFilePath, csv);
    console.log(`Purchase orders report saved at: ${csvFilePath}`);

    // Send the CSV file as a response
    res.header('Content-Type', 'text/csv');
    res.attachment('purchase-orders-report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating purchase orders report:', error);
    res.status(500).json({ msg: 'Error generating purchase orders report', error });
  }
};



// Send Email with Report
exports.sendEmailWithReport = async (req, res) => {
  try {
    const { email, reportType } = req.body; // Retrieve email, reportType  from the POST request body

    // Validate email, reportType
    if (!email || !reportType ) {
      return res.status(400).json({ msg: 'Email, report type  are required' });
    }

    // Define the correct file name based on report type 
    const fileName = reportType.toLowerCase() === 'purchase'
      ? 'purchase-orders-report.csv' // Purchase report file name
      : reportType.toLowerCase() === 'sales'
        ? 'sales-report.csv' // Sales report file name
        : `${reportType.toLowerCase()}-report.csv`; // Adjust for other report types if necessary

    // Define the path to the report file
    const filePath = path.join(__dirname, `../files/${fileName}`);

    // Check if the file exists before sending the email
    if (!fs.existsSync(filePath)) {
      console.error(`Report file not found: ${filePath}`); // Log the file path being checked
      return res.status(404).json({ msg: `Report file not found: ${fileName}` });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your ${reportType} Report CSV`,
      text: `Please find your ${reportType} report attached.`,
      attachments: [
        {
          filename: fileName, // Use the dynamically set file name
          path: filePath,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: 'Email sent successfully!' });

  } catch (error) {
    console.error('Failed to send email:', error); // Log any email sending errors
    res.status(500).json({ msg: 'Failed to send email', error: error.message });
  }
};


