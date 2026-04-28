import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { getOptimizedImageUrl } from "../utils/image";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCart();
    const { isLoggedIn } = useAuth();
    const [message, setMessage] = useState("");
    const [adding, setAdding] = useState(false);

    const imageSrc = getOptimizedImageUrl(product.imageUrl, 560, 68);
    const cartItem = cartItems.find((item) => Number(item.productId) === Number(product.id));

    const handleAdd = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        try {
            setAdding(true);
            await addToCart(product.id);
            setMessage("Added to cart");
            setTimeout(() => setMessage(""), 1600);
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

    return (
        <div className="product-card">
            <img
                src={imageSrc}
                alt={product.name}
                className="product-thumb"
                loading="lazy"
                decoding="async"
            />

            <div className="product-body">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description || "Crafted for everyday comfort and style."}</p>

                <div className="product-meta">
                    <span className="price">₹{product.price}</span>
                    <span className="pill">Stock: {product.stock ?? "-"}</span>
                </div>

                <div className="inline-actions">
                    <button className="btn btn-secondary" onClick={() => navigate(`/products/${product.id}`)}>
                        Details
                    </button>

                    {cartItem ? (
                        <div className="qty-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-soft)', padding: '0.2rem', borderRadius: '12px' }}>
                            <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'white', borderRadius: '8px', color: 'var(--text)' }} onClick={handleDecrease} disabled={adding}>
                                -
                            </button>
                            <span className="qty-value" style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>{cartItem.quantity}</span>
                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }} onClick={handleIncrease} disabled={adding}>
                                +
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={handleAdd} disabled={adding}>
                            {adding ? "Adding..." : "Add"}
                        </button>
                    )}
                </div>

                {message ? <p className="muted" style={{ margin: "0.55rem 0 0" }}>{message}</p> : null}
            </div>
        </div>
    );
}