import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!loading) return null;

    return (
        <div className="page-loader-overlay">
            <img src="/logo.png" alt="Loading..." className="page-loader-logo" />
        </div>
    );
}
