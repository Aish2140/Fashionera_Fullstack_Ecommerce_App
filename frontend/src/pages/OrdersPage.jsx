import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/orders")
            .then((res) => setOrders(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page">
            <h2 className="section-title">Your Orders</h2>
            <p className="section-subtitle">Track what you bought and order totals.</p>

            {loading ? (
                <p className="muted">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="muted">No orders found yet.</p>
            ) : (
                <div className="list">
                    {orders.map((o) => (
                        <article key={o.id} className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1.5rem' }}>
                            <div>
                                <h4 style={{ margin: "0 0 0.4rem" }}>Order #{o.id}</h4>
                                <p className="muted" style={{ margin: "0 0 0.6rem" }}>
                                    {o.itemCount ? `${o.itemCount} items` : "View order for item details"}
                                </p>
                                <span className="pill" style={{ 
                                    background: o.status === 'DELIVERED' ? '#dcfce7' : 'var(--bg-soft)', 
                                    color: o.status === 'DELIVERED' ? '#16a34a' : 'var(--brand-dark)',
                                    fontWeight: '600'
                                }}>
                                    {o.status || "PROCESSING"}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <strong className="price" style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.6rem' }}>₹{o.totalAmount}</strong>
                                <button className="btn btn-secondary" onClick={() => navigate(`/orders/${o.id}`)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View Details</button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}