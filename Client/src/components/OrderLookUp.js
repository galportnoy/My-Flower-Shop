import React, { useState } from 'react';
import './OrderLookUp.css';

function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch('http://localhost:5000/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'אירעה שגיאה');
      }
      
      setOrderData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-lookup-container">
      <h2>צפייה בפרטי הזמנה</h2>
      <form onSubmit={handleSubmit} className="order-lookup-form">
        <div>
          <label>מספר הזמנה:</label>
          <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
        </div>
        <div>
          <label>מספר טלפון:</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'מחפש...' : 'חפש הזמנה'}
        </button>
      </form>

      {error && <p className="order-lookup-error">{error}</p>}

      {orderData && (
        <div className="order-lookup-results">
          <h3>פרטי הזמנה #{orderData.orderNumber}</h3>
          <p><strong>תאריך הזמנה:</strong> {new Date(orderData.orderDate).toLocaleDateString('he-IL')}</p>
          <p><strong>שם הלקוח:</strong> {orderData.customerInfo.name}</p>
          <p><strong>כתובת למשלוח:</strong> {orderData.customerInfo.address}</p>

          <h4>פריטים שהוזמנו:</h4>
          <table>
            <thead>
              <tr>
                <th>מוצר</th>
                <th>מחיר ליחידה</th>
                <th>כמות</th>
                <th>סה"כ לפריט</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>₪{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₪{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="order-lookup-totals">
            <p><strong>אפשרות משלוח:</strong> {orderData.shippingOption}</p>
            <p><strong>עלות משלוח:</strong> ₪{orderData.shippingCost.toFixed(2)}</p>
            <hr />
            <p><strong>סכום כולל לתשלום: ₪{orderData.totalAmount.toFixed(2)}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderLookup;