import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            setMessageType("error");
            setMessage("Please enter a shipping address.");
            return;
        }

        if (!paymentMethod) {
            setMessageType("error");
            setMessage("Please select a payment method.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/orders", {
                shippingAddress: shippingAddress.trim(),
                paymentMethod,
            });
            setMessageType("success");
            setMessage("Order placed successfully.");
            setOrderPlaced(true);
        } catch (err) {
            console.error(err);
            setMessageType("error");
            setMessage("Could not place order. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="page">
                <div className="form-card success-view" style={{ marginTop: 0 }}>
                    <div className="success-mark" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img" focusable="false">
                            <path d="M20 6L9 17L4 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h2 className="section-title" style={{ marginTop: 0 }}>Order Placed Successfully</h2>
                    <p className="section-subtitle">Your payment via {paymentMethod} is confirmed and your order is now being processed.</p>

                    <div className="inline-actions">
                        <button className="btn btn-primary" onClick={() => navigate("/orders")}>View Orders</button>
                        <button className="btn btn-secondary" onClick={() => navigate("/products")}>Continue Shopping</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="form-card" style={{ marginTop: 0 }}>
                <h2 className="section-title" style={{ marginTop: 0 }}>Checkout</h2>
                <p className="section-subtitle">Confirm shipping details to place your order.</p>

                <label className="field">
                    Shipping Address
                    <textarea
                        rows={4}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="House no, street, city, pincode"
                    />
                </label>

                <div className="field">
                    Payment Method
                    <div className="payment-options-grid">
                        <label className={`payment-card ${paymentMethod === "UPI" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={paymentMethod === "UPI"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <Smartphone size={32} />
                            <span>UPI</span>
                        </label>

                        <label className={`payment-card ${paymentMethod === "CARD" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="CARD"
                                checked={paymentMethod === "CARD"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <CreditCard size={32} />
                            <span>Card</span>
                        </label>

                        <label className={`payment-card ${paymentMethod === "COD" ? "selected" : ""}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <Banknote size={32} />
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                </div>

                <div className="inline-actions" style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary" onClick={handleCheckout} disabled={submitting}>
                        {submitting ? "Processing..." : "Pay Now"}
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/cart")}>Back to Cart</button>
                </div>

                {message ? (
                    <p
                        className="muted"
                        style={{
                            marginBottom: 0,
                            color: messageType === "error" ? "#dc2626" : "#0369a1",
                        }}
                    >
                        {message}
                    </p>
                ) : null}
            </div>
        </div>
    );
}