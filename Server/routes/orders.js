const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerInfo, items, shippingOption } = req.body;

    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'כל השדות חובה' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return res.status(400).json({ message: 'פורמט אימייל לא תקין' });
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'העגלה ריקה' });
    }

    // Calculate shipping cost
    let shippingCost = 0;
    switch (shippingOption) {
      case 'express':
        shippingCost = 25;
        break;
      case 'standard':
        shippingCost = 15;
        break;
      case 'free':
        shippingCost = 0;
        break;
      case 'pickup':
        shippingCost = 0;
        break;
      default:
        shippingCost = 15;
    }

    // Calculate total
    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = itemsTotal + shippingCost;

    // Generate order number
    const orderNumber = 'FL' + Date.now();

    const order = new Order({
      orderNumber,
      customerInfo,
      items,
      shippingOption,
      shippingCost,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: 'ההזמנה התקבלה בהצלחה!',
      orderNumber,
      totalAmount
    });

  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעיבוד ההזמנה', error: error.message });
  }
});



module.exports = router;
