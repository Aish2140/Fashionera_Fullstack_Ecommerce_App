import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getOptimizedImageUrl } from "../utils/image";
import { ShoppingBag, Truck, ChevronRight, Plus, Minus } from "lucide-react";
import { useCart } from "../context/useCart";

export default function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { increaseQuantity, decreaseQuantity } = useCart();

    useEffect(() => {
        api.get("/cart")
            .then((res) => setCart(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
    );

    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;

    return (
        <div className="page split" style={{ gap: '2rem' }}>
            <section className="panel" style={{ flex: 2, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <ShoppingBag size={28} color="var(--brand-dark)" />
                    <h2 className="section-title" style={{ margin: 0, fontSize: '1.8rem' }}>My Bag</h2>
                </div>
                
                <div style={{ background: 'var(--bg-soft)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                    <Truck size={24} color="var(--brand)" />
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text)' }}>
                        Great news! You get <span style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>Free Delivery</span> on your order.
                    </p>
                </div>

                {loading ? (
                    <p className="muted">Loading your bag...</p>
                ) : cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <ShoppingBag size={64} color="var(--border)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 1rem' }}>Your bag is currently empty</h3>
                        <p className="muted" style={{ marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                        <button className="btn btn-primary" onClick={() => navigate("/products")}>Start Shopping</button>
                    </div>
                ) : (
                    <div className="list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cart.map((item) => (
                            <article key={item.id} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                <img 
                                    src={getOptimizedImageUrl(item.imageUrl, 200)} 
                                    alt={item.productName} 
                                    style={{ width: 120, height: 140, objectFit: 'cover', borderRadius: '12px', backgroundColor: 'var(--bg-soft)' }} 
                                />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ margin: "0 0 0.5rem", fontSize: '1.2rem' }}>{item.productName}</h4>
                                            <strong className="price" style={{ fontSize: '1.3rem' }}>₹{Number(item.price || 0) * Number(item.quantity || 0)}</strong>
                                        </div>
                                        <p className="muted" style={{ margin: "0 0 0.5rem" }}>Unit Price: ₹{item.price}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-soft)', borderRadius: '8px', padding: '0.2rem' }}>
                                            <button 
                                                className="btn" 
                                                style={{ padding: '0.4rem', background: 'white', borderRadius: '6px', color: 'var(--text)' }} 
                                                onClick={async () => {
                                                    await decreaseQuantity(item.productId);
                                                    api.get("/cart").then(res => setCart(res.data));
                                                }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <button 
                                                className="btn" 
                                                style={{ padding: '0.4rem', background: 'white', borderRadius: '6px', color: 'var(--text)' }} 
                                                onClick={async () => {
                                                    await increaseQuantity(item.productId);
                                                    api.get("/cart").then(res => setCart(res.data));
                                                }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <aside className="panel" style={{ flex: 1, padding: '2rem', height: 'fit-content' }}>
                <h3 className="section-title" style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="muted">Subtotal ({cart.length} items)</span>
                    <strong style={{ fontSize: '1.1rem' }}>₹{subtotal.toFixed(2)}</strong>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span className="muted">Shipping</span>
                    <strong style={{ color: '#16a34a' }}>FREE</strong>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total</span>
                    <strong className="price" style={{ fontSize: '1.8rem' }}>₹{total.toFixed(2)}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        disabled={cart.length === 0}
                        onClick={() => navigate("/checkout")}
                    >
                        Secure Checkout <ChevronRight size={20} />
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/products")} style={{ padding: '0.8rem' }}>
                        Continue Shopping
                    </button>
                </div>
            </aside>
        </div>
    );
}