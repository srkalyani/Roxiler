// backend/controllers/transactionController.js
const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize the database with third-party API data
exports.initializeDatabase = async (req, res) => {
  try {
    console.log('Fetching data from third-party API...');
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

    console.log('Data fetched successfully:', response.data); // Log the data for debugging
    const transactions = response.data;

    await Transaction.deleteMany({}); // Clear existing data
    await Transaction.insertMany(transactions); // Insert new data

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database Initialization Error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to initialize database', error: error.message });
  }
};

// List transactions with search and pagination
exports.listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  // Validate month input
  if (!/^(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ message: 'Invalid month format. Please provide a month as MM (e.g., 01 for January).' });
  }

  const startDate = new Date(`2023-${month}-01`); // Replace 2023 with the year you want to query
  const endDate = new Date(`2023-${month}-01T23:59:59Z`);
  endDate.setMonth(endDate.getMonth() + 1); // Go to the next month to get the end of the current month

  const query = {
    dateOfSale: {
      $gte: startDate,
      $lt: endDate
    }
  };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error('Fetch Transactions Error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};
