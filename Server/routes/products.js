const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/productsController");

// Get all products
router.get("/", getProducts);

module.exports = router;
