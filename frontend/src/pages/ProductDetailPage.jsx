import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { getOptimizedImageUrl } from "../utils/image";
import { Star, Truck, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";

export default function ProductDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [adding, setAdding] = useState(false);
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCart();
    const { isLoggedIn } = useAuth();
    const cartItem = cartItems.find((item) => Number(item.productId) === Number(id));

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch((err) => {
                console.error(err);
                setError("Product could not be loaded.");
            });
    }, [id]);

    const handleAdd = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            setAdding(true);
            await addToCart(product.id);
            setMessage("Added to cart successfully!");
            setTimeout(() => setMessage(""), 2500);
        } catch (err) {
            console.error(err);
            setMessage("Could not add item");
        } finally {
            setAdding(false);
        }
    };

    const handleIncrease = async () => {
        try {
            setAdding(true);
            await increaseQuantity(product.id);
        } catch (err) {
            console.error(err);
            setMessage("Could not update quantity");
        } finally {
            setAdding(false);
        }
    };

    const handleDecrease = async () => {
        try {
            setAdding(true);
            await decreaseQuantity(product.id);
        } catch (err) {
            console.error(err);
            setMessage("Could not update quantity");
        } finally {
            setAdding(false);
        }
    };

    if (error) return <div className="page"><p className="muted">{error}</p></div>;
    if (!product) return <div className="page"><p className="muted">Loading product...</p></div>;

    const imageSrc = getOptimizedImageUrl(product.imageUrl, 1200, 80);

    return (
        <div className="page" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                <Link to="/" style={{ color: 'inherit' }}>Home</Link>
                <ChevronRight size={14} />
                <Link to="/products" style={{ color: 'inherit' }}>Products</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name}</span>
            </div>

            <div className="split" style={{ gap: '4rem', alignItems: 'flex-start' }}>
                {/* Left side: Large Image */}
                <div style={{ flex: 1.2 }}>
                    <img
                        src={imageSrc}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: '100%', height: '600px', objectFit: 'cover', borderRadius: '24px', backgroundColor: 'var(--bg-soft)', boxShadow: 'var(--shadow)' }}
                    />
                </div>

                {/* Right side: Details & Actions */}
                <div style={{ flex: 1, padding: '1rem 0' }}>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 1rem' }}>
                        {product.name}
                    </h1>

                    {/* Fake Reviews for Premium feel */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                            <Star size={18} fill="#fbbf24" />
                            <Star size={18} fill="#fbbf24" />
                            <Star size={18} fill="#fbbf24" />
                            <Star size={18} fill="#fbbf24" />
                            <Star size={18} fill="#fbbf24" />
                        </div>
                        <span style={{ fontWeight: 600 }}>4.9</span>
                        <span className="muted" style={{ textDecoration: 'underline', cursor: 'pointer' }}>(128 Reviews)</span>
                    </div>

                    <p style={{ fontSize: "2rem", fontWeight: 700, margin: '0 0 1.5rem', color: 'var(--brand-dark)' }}>
                        ₹{product.price}
                    </p>

                    <p className="muted" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        {product.description || "Experience the perfect blend of style and comfort. This premium item is designed to stand out and deliver exceptional quality for your everyday needs."}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444' }} />
                        <span style={{ fontWeight: 600 }}>{product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                        {cartItem ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-soft)', borderRadius: '14px', padding: '0.4rem', flex: 0.5 }}>
                                    <button className="btn" onClick={handleDecrease} disabled={adding} style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', color: 'var(--text)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        -
                                    </button>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 1rem' }}>
                                        {cartItem.quantity}
                                    </span>
                                    <button className="btn btn-primary" onClick={handleIncrease} disabled={adding} style={{ width: '40px', height: '40px', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', padding: 0 }}>
                                        +
                                    </button>
                                </div>
                                <button className="btn btn-primary" onClick={() => navigate('/cart')} style={{ flex: 1, padding: '1.2rem', fontSize: '1.1rem', borderRadius: '14px' }}>
                                    Go to Cart
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-primary" onClick={handleAdd} disabled={adding} style={{ flex: 1, padding: '1.2rem', fontSize: '1.1rem', borderRadius: '14px' }}>
                                {adding ? "Adding to Cart..." : "Add to Cart"}
                            </button>
                        )}
                    </div>

                    {message && <p style={{ color: 'var(--brand-dark)', fontWeight: 600, marginTop: '-1.5rem', marginBottom: '2rem' }}>✓ {message}</p>}

                    {/* Trust Signals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.8rem', background: 'var(--bg-soft)', borderRadius: '12px', color: 'var(--brand-dark)' }}>
                                <Truck size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem' }}>Free Shipping</h4>
                                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>On all orders over ₹1000</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.8rem', background: 'var(--bg-soft)', borderRadius: '12px', color: 'var(--brand-dark)' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem' }}>30-Day Guarantee</h4>
                                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>Free returns within 30 days</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.8rem', background: 'var(--bg-soft)', borderRadius: '12px', color: 'var(--brand-dark)' }}>
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem' }}>Secure Checkout</h4>
                                <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>100% protected payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}