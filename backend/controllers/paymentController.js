import Stripe from "stripe";

// Note: Initialize Stripe inside the handler to ensure env vars are loaded
// via dotenv.config() in server bootstrap before accessing process.env

// Create a payment session from simple contact + amount payload
// Expected body: { name, email, phone, amount }
export const createPayment = async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body || {};

    if (!name || !email || !phone || typeof amount === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, phone, amount",
      });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    // Enforce Stripe minimum charge threshold (50¢ USD equivalent). For simplicity,
    // enforce a configurable INR minimum. Default to ₹50 which safely exceeds 50¢.
    const MIN_PAYMENT_INR = Number(process.env.MIN_PAYMENT_INR || 50);
    if (numericAmount < MIN_PAYMENT_INR) {
      return res.status(400).json({
        success: false,
        message: `Amount must be at least ₹${MIN_PAYMENT_INR} to process payment`,
      });
    }

    // Initialize Stripe here to ensure env is available
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return res.status(501).json({
        success: false,
        message: "Stripe is not configured. Missing STRIPE_SECRET_KEY.",
      });
    }
    const stripe = new Stripe(stripeKey);

    const FRONTEND_URL="http://localhost:5173";

    const frontendBase = FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      metadata: { name, phone },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `Booking payment by ${name}` },
            // Stripe requires the smallest currency unit (paise for INR)
            unit_amount: Math.round(numericAmount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendBase}/payment-success`,
      cancel_url: `${frontendBase}/payment-cancel`,
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe create session error:", error);
    const message =
      (error && (error.message || error.error && error.error.message)) ||
      "Payment initialization failed";
    return res.status(500).json({
      success: false,
      message,
      // expose limited debug info to help during development
      errorType: error && error.type ? error.type : undefined,
    });
  }
};