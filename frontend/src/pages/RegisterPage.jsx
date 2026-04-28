import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/register", { name, email, password });
            login(res.data.token, {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
            });
            alert("Registered successfully");
            navigate("/");
        } catch {
            alert("Registration failed");
        }
    };

    return (
        <div className="page">
            <form className="form-card" onSubmit={handleRegister}>
                <h2 className="section-title" style={{ marginTop: 0 }}>Create Account</h2>
                <p className="section-subtitle">Register once and start placing orders instantly.</p>

                <label className="field">
                    Full Name
                    <input
                        placeholder="Aishwarya Sharma"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

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
                        placeholder="At least 6 characters"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button className="btn btn-primary" type="submit">Register</button>
            </form>
        </div>
    );
}