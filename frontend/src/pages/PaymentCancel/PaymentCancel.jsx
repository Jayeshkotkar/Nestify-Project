import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 24, textAlign: 'center' }}>
      <h1>Payment Cancelled ❌</h1>
      <p>Your payment was cancelled. If this was a mistake, you can try again.</p>
      <div style={{ marginTop: 24 }}>
        <Link to="/payment">Back to Payment</Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
