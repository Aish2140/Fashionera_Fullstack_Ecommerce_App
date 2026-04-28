import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import heroVideo from "../assets/BackGround.mp4";

export default function HomePage() {
    const navigate = useNavigate();
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        api.get("/products")
            .then((res) => setFeatured(res.data.slice(0, 4)))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="page">
            <section className="hero">
                <video
                    className="hero-video"
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                ></video>
                <div className="hero-overlay"></div>

                <div className="hero-copy">
                    <h1>Upgrade Your Everyday Essentials</h1>
                    <p>
                        Shop clean design, smart pricing, and fast checkout in one place.
                        Discover products that actually look as good as they perform.
                    </p>

                    <div className="inline-actions">
                        <button className="btn btn-primary" onClick={() => navigate("/products")}>
                            Browse Products
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate("/orders")}>
                            View Orders
                        </button>
                    </div>
                </div>
            </section>

            <h2 className="section-title">Featured Right Now</h2>
            <p className="section-subtitle">A quick look at what customers are buying the most.</p>

            <section className="product-grid">
                {featured.length === 0 ? (
                    <p className="muted">No products available yet. Add a few in your database to populate the storefront.</p>
                ) : (
                    featured.map((product) => <ProductCard key={product.id} product={product} />)
                )}
            </section>
        </div>
    );
}