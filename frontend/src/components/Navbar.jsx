import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Home, Package, ShoppingCart, ClipboardList, LogOut, User, UserPlus, Search } from "lucide-react";

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(""); // clear after search
        }
    };

    return (
        <nav className="top-nav">
            <Link to="/" className="brand">
                <img src="/logo.png" alt="ShopEase Logo" style={{ height: "60px", objectFit: "contain" }} />
            </Link>

            <div className="nav-links">
                <Link to="/" className="nav-icon-wrapper">
                    <Home className="nav-icon" size={24} />
                    <div className="nav-icon-tooltip">Home</div>
                </Link>
                <Link to="/products" className="nav-icon-wrapper">
                    <Package className="nav-icon" size={24} />
                    <div className="nav-icon-tooltip">Products</div>
                </Link>
                <Link to="/cart" className="nav-icon-wrapper">
                    <ShoppingCart className="nav-icon" size={24} />
                    <div className="nav-icon-tooltip">Cart</div>
                </Link>
                <Link to="/orders" className="nav-icon-wrapper">
                    <ClipboardList className="nav-icon" size={24} />
                    <div className="nav-icon-tooltip">Orders</div>
                </Link>
            </div>

            <div className="nav-auth">
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: '999px', padding: '0.4rem 0.8rem', border: '1px solid var(--border)', marginRight: '1rem' }}>
                    <Search size={16} color="var(--text-soft)" style={{ marginRight: '0.4rem' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '130px', fontSize: '0.9rem', color: 'var(--text)' }}
                    />
                </form>

                {isLoggedIn ? (
                    <>
                        <div className="greeting-container">
                            <span className="nav-link" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={18} /> Hi, {user?.name || "Shopper"}
                            </span>
                            <div className="greeting-tooltip">✨ Wishing you a wonderful day full of joy! ✨</div>
                        </div>
                        <button className="nav-icon-wrapper" onClick={logout} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                            <LogOut className="nav-icon" size={24} />
                            <div className="nav-icon-tooltip">Logout</div>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-icon-wrapper">
                            <User className="nav-icon" size={24} />
                            <div className="nav-icon-tooltip">Login</div>
                        </Link>
                        <Link to="/register" className="nav-icon-wrapper">
                            <UserPlus className="nav-icon" size={24} />
                            <div className="nav-icon-tooltip">Register</div>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}