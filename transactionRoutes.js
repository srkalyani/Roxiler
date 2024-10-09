// backend/routes/transactionRoutes.js
const express = require('express');
const {
  initializeDatabase,
  listTransactions
} = require('../controllers/transactionController'); // Ensure the correct import path
const router = express.Router();

router.get('/init', initializeDatabase);
router.get('/transactions', listTransactions);

module.exports = router;
