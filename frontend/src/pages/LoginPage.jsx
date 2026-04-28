import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.token, {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
            });
            navigate("/");
        } catch {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="page">
            <form className="form-card" onSubmit={handleLogin}>
                <h2 className="section-title" style={{ marginTop: 0 }}>Welcome Back</h2>
                <p className="section-subtitle">Login to continue shopping and manage your cart.</p>

                {error && <p className="muted" style={{ color: "var(--danger)" }}>{error}</p>}

                <label className="field">
                    Email
                    <input
                        type="email"
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="field">
                    Password
                    <input
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
    );
}