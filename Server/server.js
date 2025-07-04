const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Product = require('./models/Product');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/flower-shopDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  initializeProducts();
});

// Initialize sample products
async function initializeProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    const sampleProducts = [
      { name: "זר כלה רומנטי", description: "זר כלה מרהיב עם ורדים לבנים וורודים", price: 299, image: "images/bride.jpeg", category: "זרי כלה"},
      { name: "זר ראש השנה", description: "זר חגיגי עם חמניות וכלניות צבעוניות", price: 159, image: "images/זר חגיגי עם חמניות וכלניות צבעוניות.jpg", category: "זרי חגים"},
      { name: "סידור שולחן אלגנטי", description: "סידור פרחים מעוצב לשולחן החג", price: 189, image: "images/סידור פרחים מעוצב לשולחן החג.jpeg", category: "סידורי שולחן"},
      { name: "זר אבל מכובד", description: "זר חרציות לבנות לזכר הנפטר", price: 129, image: "images/זר חרציות לבנות לזכר הנפטר.jpg", category: "זרי אבל"},
      { name: "ורדים אדומים", description: "תריסר ורדים אדומים טריים", price: 89, image: "images/תריסר ורדים אדומים טריים.jpg", category: "ורדים"},
      { name: "צמח בית - סחלב", description: "סחלב לבן בעציץ קרמיקה יפה", price: 119, image: "images/סחלב לבן בעציץ קרמיקה יפה.jpg", category: "צמחי בית"},
      { name: "זר יום הולדת צבעוני", description: "זר פרחים צבעוני ועליז ליום הולדת", price: 149, image: "images/זר פרחים צבעוני ועליז ליום הולדת.jpg", category: "זרי יום הולדת"},
      { name: "זר אהבה מיוחד", description: "זר ורדים אדומים עם גרין טרי", price: 199, image: "images/זר ורדים אדומים עם גרין טרי.jpg", category: "זרי אהבה"},
      { name: "חמניות שמחות", description: "זר חמניות צהובות מאירות פנים", price: 99, image: "images/זר חמניות צהובות מאירות פנים.jpg", category: "פרחי שדה"}
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products initialized');
  }
}

// Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
