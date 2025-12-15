import React, { useState } from "react";
import api from "../services/api";
import { saveToken } from "../utils/auth";
import "../utils/auth.css";
import Spinner from "../components/Spinner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", { name, email, password });

      const token = data.token || data.accessToken;
      const user = data.user || { name, email };

      if (token) {
        saveToken(token);
        localStorage.setItem("auth_token", token);
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("__auth_last_change__", Date.now().toString());
      window.dispatchEvent(new Event("authChange"));

      window.location.href = "/profile";
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Create Account</h2>
        <p className="auth-sub">Start building your career roadmap</p>

        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            {loading ? <Spinner size={22} /> : "Sign Up"}
          </button>

          {error && <p className="auth-error">{error}</p>}
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
