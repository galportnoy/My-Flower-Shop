const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;