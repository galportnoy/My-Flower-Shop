import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ShoppingCart from './ShoppingCart';
import './Navbar.css';

/**
 *  Navbar component that displays the navigation bar with links to home and order lookup,
 *  and a shopping cart icon that shows the total items and price.
 */

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems, getTotalPrice } = useCart();

  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img 
            src="flower_shop_icon.png" 
            alt="logo" 
            className="nav-logo-icon"
          />
          <span className="nav-logo-text">פרחי הגן</span>
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            בית
          </Link>
          <Link to="/order-lookup" className="nav-link">
            חיפוש הזמנה
          </Link>
          <div className="cart-icon-container">
            <button className="cart-button" onClick={toggleCart}>
              <span className="cart-icon">🛒</span>
              <span className="cart-info">
                <span className="cart-count">{getTotalItems()}</span>
                <span className="cart-total">₪{getTotalPrice()}</span>
              </span>
            </button>
            
            {isCartOpen && (
              <ShoppingCart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
