import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ShoppingCart.css';

// ShoppingCart component to display the shopping cart overlay
// It shows the items in the cart, allows quantity updates, and provides a checkout link to the checkout page
// Includes functionality to remove items from the cart and calculate the total price

const ShoppingCart = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="shopping-cart" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>עגלת קניות</h2>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p className="empty-cart">העגלה ריקה</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item._id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <div className="cart-item-controls">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                          className="quantity-input"
                        />
                        <span className="item-price">₪{item.price}</span>
                        <span className="item-total">₪{item.price * item.quantity}</span>
                        <button
                          className="remove-item"
                          onClick={() => removeFromCart(item._id)}
                        >
                          הסר
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-summary">
                  <strong>סה"כ: ₪{getTotalPrice()}</strong>
                </div>
                <Link to="/checkout" className="checkout-btn" onClick={onClose}>
                  בצע הזמנה
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
