import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getOptimizedImageUrl } from "../utils/image";
import { Package, ChevronRight, Truck, CheckCircle } from "lucide-react";

export default function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/orders/${id}`)
            .then((res) => setDetails(res.data))
            .catch((err) => {
                console.error(err);
                setError("Could not load order details.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="page"><p className="muted">Loading order details...</p></div>;
    if (error) return <div className="page"><p className="muted">{error}</p></div>;
    if (!details) return null;

    const { order, items } = details;

    return (
        <div className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                <Link to="/orders" style={{ color: 'inherit' }}>Orders</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>Order #{order.id}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Package size={28} color="var(--brand-dark)" />
                <h2 className="section-title" style={{ margin: 0, fontSize: '1.8rem' }}>Order Details</h2>
            </div>

            <div className="panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <p className="muted" style={{ margin: '0 0 0.4rem', fontSize: '0.9rem' }}>Order Number</p>
                        <h3 style={{ margin: 0 }}>#{order.id}</h3>
                    </div>
                    <div>
                        <p className="muted" style={{ margin: '0 0 0.4rem', fontSize: '0.9rem' }}>Date Placed</p>
                        <h3 style={{ margin: 0 }}>{new Date(order.placedAt).toLocaleDateString()}</h3>
                    </div>
                    <div>
                        <p className="muted" style={{ margin: '0 0 0.4rem', fontSize: '0.9rem' }}>Total Amount</p>
                        <h3 className="price" style={{ margin: 0 }}>₹{order.totalAmount}</h3>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem' }}>
                            <CheckCircle size={18} color="#16a34a" /> Status: {order.status || "PROCESSING"}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            <Truck size={20} color="var(--text-soft)" style={{ marginTop: '0.2rem' }} />
                            <div>
                                <p className="muted" style={{ margin: '0 0 0.4rem', fontSize: '0.9rem' }}>Shipping Address</p>
                                <p style={{ margin: 0, lineHeight: 1.5 }}>{order.shippingAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Items in this Order</h3>
            <div className="list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item, idx) => (
                    <article key={idx} className="panel" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center' }}>
                        <img 
                            src={getOptimizedImageUrl(item.image_url, 120)} 
                            alt={item.product_name} 
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '12px', backgroundColor: 'var(--bg-soft)' }} 
                        />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 0.5rem", fontSize: '1.1rem' }}>{item.product_name}</h4>
                            <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>Qty: {item.quantity}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.3rem' }}>₹{item.unit_price * item.quantity}</strong>
                            <span className="muted" style={{ fontSize: '0.9rem' }}>₹{item.unit_price} each</span>
                        </div>
                    </article>
                ))}
            </div>
            
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button className="btn btn-secondary" onClick={() => navigate("/orders")}>
                    Back to Orders
                </button>
            </div>
        </div>
    );
}
