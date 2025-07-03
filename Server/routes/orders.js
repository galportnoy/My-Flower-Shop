const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/ordersController');
const { getOrder } = require('../controllers/ordersController');


router.post('/', createOrder);
router.post('/lookup', getOrder);



module.exports = router;
