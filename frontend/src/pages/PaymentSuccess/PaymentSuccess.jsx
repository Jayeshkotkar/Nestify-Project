import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 24, textAlign: 'center' }}>
      <h1>Payment Successful ✅</h1>
      <p>Your payment was processed successfully. Thank you!</p>
      <div style={{ marginTop: 24 }}>
        <Link to="/">Go back to Home</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
