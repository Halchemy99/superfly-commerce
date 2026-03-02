import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
import express from 'express';
import cors from 'cors';

// Import all your route handlers
import checkoutRouter from './src/api/create-custom-checkout/route.js';
import contactRouter from './src/api/contact/route.js';
import webhookRouter from './src/api/stripe-webhook/route.js'; // Note: .js for node
import fileUploadRouter from './src/api/file-upload/route.js'; // Note: .js for node
import docusignRouter from './src/api/docusign/route.js'; // Note: .js for node


const app = express();
const port = 5174; // We'll run the backend on a different port than Vite

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Special raw body parser for Stripe webhook
app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }), webhookRouter);

// Standard JSON parser for all other routes
app.use(express.json()); // Middleware to parse JSON bodies

// API Routes
app.use('/api', checkoutRouter);
app.use('/api', contactRouter);
app.use('/api', fileUploadRouter); // <-- ADDED
app.use('/api', docusignRouter); // <-- ADDED


// Start the server
app.listen(port, () => {
  console.log(`🚀 Express server listening at http://localhost:${port}`);
});
