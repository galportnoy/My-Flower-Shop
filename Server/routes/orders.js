const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerInfo, items, shippingOption } = req.body;

    // Log the received data
    console.log('Received order data:', {
      customerInfo,
      items,
      shippingOption
    });

    // Validate customerInfo exists
    if (!customerInfo) {
      return res.status(400).json({ message: 'פרטי לקוח חסרים' });
    }

    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'כל השדות חובה' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return res.status(400).json({ message: 'פורמט אימייל לא תקין' });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'העגלה ריקה' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ message: 'פרטי מוצר חסרים' });
      }
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
      case 'pickup':
        shippingCost = 0;
        break;
      default:
        return res.status(400).json({ message: 'אפשרות משלוח לא תקינה' });
    }

    // Calculate total
    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = itemsTotal + shippingCost;

    // Create order number - using timestamp and random string
    const orderNumber = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

    // Create and save the order
    const order = new Order({
      customerInfo,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      shippingOption,
      shippingCost,
      totalAmount,
      orderNumber
    });

    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);

    res.status(201).json({ 
      message: 'ההזמנה נשמרה בהצלחה',
      orderNumber: savedOrder.orderNumber
    });

  } catch (error) {
    console.error('Error creating order:', error);
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'שגיאה בנתוני ההזמנה',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'מספר הזמנה כבר קיים במערכת, נסה שוב'
      });
    }

    res.status(500).json({ 
      message: 'שגיאה בשמירת ההזמנה',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
