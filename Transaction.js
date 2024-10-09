// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: { type: Boolean, default: false },
  dateOfSale: { type: Date, default: Date.now },
  imageUrl: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
