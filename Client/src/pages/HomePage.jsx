import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products when the component mounts
  // This effect runs once when the component is first rendered
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('שגיאה בטעינת המוצרים');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">טוען מוצרים...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>ברוכים הבאים לפרחי הגן</h1>
          <p>הפרחים הכי יפים והטריים בעיר - ישירות אליכם הביתה</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>אודותינו</h2>
          <p>
            פרחי הגן הוא בית עסק משפחתי הפועל כבר למעלה מ-20 שנה. 
            אנו מתמחים במכירת פרחים טריים, זרי כלה, סידורי פרחים לאירועים 
            וצמחי בית איכותיים. כל הפרחים שלנו מגיעים טריים מהחממות 
            ומובטחת איכות גבוהה ושירות מעולה.
          </p>
        </div>
      </section>

      { /* Products Section: displays a grid of product cards using the ProductCard components witch the data fetched from the serve*/ }
      <section className="products-section">
        <div className="container">
          <h2>המוצרים שלנו</h2>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
      <div className="about-footer"> 
        <p>© 2025 פרחי הגן. כל הזכויות שמורות.</p>
        <p>טלפון: 123-456-7890 | דוא"ל:
          <a href="mailto: garden-flowers@gmail.com"> garden-flowers@gmail.com </a>
        </p>
        <p>כתובת: רחוב הפרחים 123, תל אביב</p>  
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
