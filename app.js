const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const routes = require('./routes'); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
connectDB(); // Call the function to connect to MongoDB

// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Inventory Management API',
      description: 'API Documentation for E-Commerce Inventory Management System',
      version: '1.0.0',
      contact: {
        name: 'Abenezer Getachew',
        email: 'abenezergetachew1990@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        StockMovement: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              description: 'The ID of the inventory item',
            },
            type: {
              type: 'string',
              description: 'The type of stock movement (e.g., purchase, sale, return, adjustment)',
            },
            quantity: {
              type: 'integer',
              description: 'The quantity of stock movement',
            },
            userId: {
              type: 'string',
              description: 'The ID of the user who made the movement',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the stock movement was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the stock movement was last updated',
            },
          },
          required: ['itemId', 'type', 'quantity', 'userId'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

// Swagger docs setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use all routes
app.use('/api', routes); // Prefix all routes with /api

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
