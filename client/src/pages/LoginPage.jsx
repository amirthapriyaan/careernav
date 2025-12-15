import React, { useState } from "react";
import api from "../services/api";
import { saveToken } from "../utils/auth";
import "../utils/auth.css";
import Spinner from "../components/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      const token = data.token || data.accessToken;
      const user = data.user || { email };

      if (token) {
        saveToken(token);
        localStorage.setItem("auth_token", token);
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("__auth_last_change__", Date.now().toString());
      window.dispatchEvent(new Event("authChange"));

      window.location.href = "/profile";
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Welcome Back</h2>
        <p className="auth-sub">Sign in to continue your career journey</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? <Spinner size={22} /> : "Login"}
          </button>

          {error && <p className="auth-error">{error}</p>}
        </form>

        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </div>
  );
}
