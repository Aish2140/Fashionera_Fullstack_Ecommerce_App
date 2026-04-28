import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [visibleCount, setVisibleCount] = useState(12);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        api.get("/products")
            .then((res) => setProducts(res.data))
            .catch((err) => {
                console.error(err);
                setError("Could not load products. Please check backend connection.");
            })
            .finally(() => setLoading(false));
    }, []);

    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        (p.description && p.description.toLowerCase().includes(searchQuery))
    );

    return (
        <div className="page">
            <h2 className="section-title">
                {searchQuery ? `Search Results for "${searchParams.get("search")}"` : "Product Catalog"}
            </h2>
            <p className="section-subtitle">
                {searchQuery ? `Found ${filteredProducts.length} matching items` : "Everything in one clean grid with quick add-to-cart actions."}
            </p>

            {loading ? (
                <p className="muted">Loading products...</p>
            ) : error ? (
                <p className="muted">{error}</p>
            ) : products.length === 0 ? (
                <p className="muted">No products available in the database yet.</p>
            ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h3 style={{ margin: '0 0 1rem' }}>No matches found</h3>
                    <p className="muted">We couldn't find anything matching "{searchParams.get("search")}". Try a different term.</p>
                </div>
            ) : (
                <>
                    <div className="product-grid">
                        {filteredProducts.slice(0, visibleCount).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {visibleCount < filteredProducts.length ? (
                        <div className="load-more-wrap">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setVisibleCount((prev) => prev + 12)}
                            >
                                Load More
                            </button>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
}