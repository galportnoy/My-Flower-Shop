const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/flower-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  initializeProducts();
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  shippingOption: { type: String, required: true },
  shippingCost: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Initialize sample products
async function initializeProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const sampleProducts = [
      {
        name: "זר כלה רומנטי",
        description: "זר כלה מרהיב עם ורדים לבנים וורודים",
        price: 299,
        image: "/images/bridal-bouquet.jpg",
        category: "זרי כלה"
      },
      {
        name: "זר ראש השנה",
        description: "זר חגיגי עם חמניות וכלניות צבעוניות",
        price: 159,
        image: "/images/new-year-bouquet.jpg",
        category: "זרי חגים"
      },
      {
        name: "סידור שולחן אלגנטי",
        description: "סידור פרחים מעוצב לשולחן החג",
        price: 189,
        image: "/images/table-arrangement.jpg",
        category: "סידורי שולחן"
      },
      {
        name: "זר אבל מכובד",
        description: "זר חרציות לבנות לזכר הנפטר",
        price: 129,
        image: "/images/mourning-bouquet.jpg",
        category: "זרי אבל"
      },
      {
        name: "ורדים אדומים",
        description: "תריסר ורדים אדומים טריים",
        price: 89,
        image: "/images/red-roses.jpg",
        category: "ורדים"
      },
      {
        name: "צמח בית - סחלב",
        description: "סחלב לבן בעציץ קרמיקה יפה",
        price: 119,
        image: "/images/orchid-plant.jpg",
        category: "צמחי בית"
      },
      {
        name: "זר יום הולדת צבעוני",
        description: "זר פרחים צבעוני ועליז ליום הולדת",
        price: 149,
        image: "/images/birthday-bouquet.jpg",
        category: "זרי יום הולדת"
      },
      {
        name: "זר אהבה מיוחד",
        description: "זר ורדים אדומים עם גרין טרי",
        price: 199,
        image: "/images/love-bouquet.jpg",
        category: "זרי אהבה"
      },
      {
        name: "חמניות שמחות",
        description: "זר חמניות צהובות מאירות פנים",
        price: 99,
        image: "/images/sunflowers.jpg",
        category: "פרחי שדה"
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products initialized');
  }
}

// Routes
// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת המוצרים', error: error.message });
  }
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
