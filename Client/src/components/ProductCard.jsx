import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

// ProductCard component to display individual product details
// and handle adding the product to the cart

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">₪{product.price}</div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          הוספה לעגלה
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
