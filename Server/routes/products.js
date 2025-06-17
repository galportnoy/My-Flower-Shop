const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/productsController");

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת המוצרים', error: error.message });
  }
});

module.exports = router;
