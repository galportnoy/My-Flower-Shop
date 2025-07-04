import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [shippingOption, setShippingOption] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const shippingOptions = {
    express: { label: 'משלוח מהיר (24 שעות)', cost: 25 },
    standard: { label: 'משלוח רגיל (2-3 ימים)', cost: 15 },
    free: { label: 'משלוח חינם (5-7 ימים)', cost: 0 },
    pickup: { label: 'איסוף עצמי', cost: 0 }
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleShippingChange = (e) => {
    setShippingOption(e.target.value);
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) return 'שם חובה';
    if (!customerInfo.email.trim()) return 'אימייל חובה';
    if (!customerInfo.email.includes('@')) return 'פורמט אימייל לא תקין';
    if (!customerInfo.phone.trim()) return 'טלפון חובה';
    if (!customerInfo.address.trim()) return 'כתובת חובה';
    if (cartItems.length === 0) return 'העגלה ריקה';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        customerInfo,
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        shippingOption
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      setSuccess(`ההזמנה התקבלה בהצלחה! מספר הזמנה: ${response.data.orderNumber}`);
      clearCart();
      
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err.response?.data?.message || 'שגיאה בעיבוד ההזמנה');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = shippingOptions[shippingOption].cost;
  const total = subtotal + shippingCost;

  if (cartItems.length === 0 && !success) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1>העגלה ריקה</h1>
          <p>אין מוצרים בעגלה. חזור לעמוד הבית כדי להוסיף מוצרים.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            חזור לעמוד הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>ביצוע הזמנה</h1>
        
        {success ? (
          <div className="success-message">
            <h2>✅ {success}</h2>
            <button onClick={() => navigate('/')} className="btn-primary">
            חזור לעמוד הבית
      </button>
          </div>
        ) : (
          <>
            <div className="checkout-content">
              <div className="order-summary">
                <h2>סיכום הזמנה</h2>
                <div className="cart-items-summary">
                  {cartItems.map(item => (
                    <div key={item._id} className="summary-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>כמות: {item.quantity}</p>
                        <p>מחיר: ₪{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>סה"כ מוצרים:</span>
                    <span>₪{subtotal}</span>
                  </div>
                  <div className="price-row">
                    <span>משלוח:</span>
                    <span>₪{shippingCost}</span>
                  </div>
                  <div className="price-row total">
                    <span>סה"כ לתשלום:</span>
                    <span>₪{total}</span>
                  </div>
                </div>
              </div>

              <form className="checkout-form" onSubmit={handleSubmit}>
                <h2>פרטי הזמנה</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label>שם מלא *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>אימייל *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>טלפון *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>כתובת משלוח *</label>
                  <input
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>אפשרות משלוח</label>
                  {Object.entries(shippingOptions).map(([key, option]) => (
                    <div key={key} className="radio-option">
                      <input
                        type="radio"
                        id={key}
                        name="shipping"
                        value={key}
                        checked={shippingOption === key}
                        onChange={handleShippingChange}
                      />
                      <label htmlFor={key}>
                        {option.label} {option.cost > 0 && `(₪${option.cost})`}
                      </label>
                    </div>
                  ))}
                </div>

                <button 
                  type="submit" 
                  className="submit-order-btn"
                  disabled={loading}
                >
                  {loading ? 'מעבד הזמנה...' : 'בצע הזמנה'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
