// models/product.js
const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sizes: [String],
  colors: [String],
  quantity: {
    type: Map,
    of: {
      type: Map,
      of: Number
    }
  }
});

// Create and export the Product model based on the schema
module.exports = mongoose.model('Product', productSchema);
