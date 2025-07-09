import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderLookUp from './components/OrderLookUp';
import './App.css';

/**
 * The main App component that sets up the application with routing and context provider.
 */
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-lookup" element={<OrderLookUp />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
