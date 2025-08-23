import React, { useEffect, useState } from 'react';
import './Payment.css';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Payment = () => {

    const {backend_url, token} = useContext(StoreContext);
    const location = useLocation();
    const listing = location?.state?.listing || null;

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        amount: ""
    });
    const onChangeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setData({...data, [name]: value});
    };

    // Prefill amount from navigation state or query param
    useEffect(() => {
        // State passed via navigate('/payment', { state: { amount } })
        const stateAmount = location?.state?.amount;
        // Also support query param e.g., /payment?amount=123
        const qs = new URLSearchParams(location.search);
        const qpAmount = qs.get('amount');
        const incoming = stateAmount ?? qpAmount;
        if (incoming && !Number.isNaN(Number(incoming))) {
            setData((prev) => ({ ...prev, amount: String(incoming) }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state, location.search]);

    const onSubmitHandler = async(e) => {
        e.preventDefault();
        try {
            console.log(data);
            const response = await axios.post(`${backend_url}/api/payment/`, data, { headers: { token } });
            console.log(response.data);
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                toast.error(response.data.message || "Payment initialization failed");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Payment request failed";
            toast.error(msg);
            console.error("Payment error:", err);
        }
    };

    return (
        <div className="payment-page">
            <div className="payment-card">
                <div className="payment-header">
                    <h1>Complete your booking</h1>
                    <p className="payment-sub">Enter your contact details and amount to proceed.</p>
                </div>

                {listing && (
                    <div className="listing-summary">
                        <div className="ls-thumb">
                            {listing.imageUrl ? (
                                <img
                                  src={listing.imageUrl.startsWith('/') ? `${backend_url}${listing.imageUrl}` : listing.imageUrl}
                                  alt={listing.title}
                                  loading="lazy"
                                />
                            ) : (
                                <div className="ls-thumb placeholder" aria-label="No image" />
                            )}
                        </div>
                        <div className="ls-info">
                            <div className="ls-title">{listing.title}</div>
                            <div className="ls-location">{listing.location}{listing.country ? `, ${listing.country}` : ''}</div>
                            <div className="ls-price">₹{new Intl.NumberFormat('en-IN').format(Number(listing.price))} <span className="ls-unit">/ Day</span></div>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmitHandler} className="payment-form">
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="name">Full Name</label>
                            <input id="name" type="text" name="name" onChange={onChangeHandler} placeholder="Enter Full Name" required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" name="email" onChange={onChangeHandler} placeholder="Enter Email" required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="phone">Phone Number</label>
                            <input id="phone" type="number" name="phone" onChange={onChangeHandler} placeholder="Enter Phone Number" required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="amount">Amount (₹)</label>
                            <input
                                id="amount"
                                type="number"
                                min="50"
                                name="amount"
                                value={data.amount}
                                onChange={onChangeHandler}
                                placeholder="Enter Amount"
                                required
                                disabled
                                readOnly
                                title="Amount is fixed for this booking"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn primary">Proceed to Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
