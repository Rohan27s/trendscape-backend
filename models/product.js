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
    type: Number,
    required: true
  },
  images: [String] 
});

module.exports = mongoose.model('Product', productSchema);
