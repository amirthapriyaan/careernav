import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  const readAuth = useCallback(() => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      loggedIn: Boolean(token || user),
      user: user ? JSON.parse(user) : null
    };
  }, []);

  const [auth, setAuth] = useState(readAuth);

  useEffect(() => {
    const saved = localStorage.getItem("cc_theme");
    const initial =
      saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    const syncAuth = () => setAuth(readAuth());
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, [readAuth]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("cc_theme", next);
  }

  function handleLogout() {
    ["auth_token", "token", "user"].forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  }

  const links = [
    { to: "/job-match", label: "Job Match" },
    { to: "/job-match/result", label: "Result" },
    { to: "/chat", label: "Career Q&A" },
    { to: "/roadmap", label: "Roadmap" },
    { to: "/interview-prep", label: "Interview Q&A" }
  ];

  const { loggedIn, user } = auth;

  return (
    <header className="app-nav">
      <div className="nav-inner">
        {/* LOGO */}
        <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
          <img src="/Logo1.png" alt="CareerNav" className="brand-logo" />
        </Link>

        {/* MOBILE TOGGLE */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(v => !v)}>
          <span /><span /><span />
        </button>

        {/* CENTER LINKS */}
        <nav className={`nav-center ${mobileOpen ? "open" : ""}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          {/* MOBILE AUTH */}
          <div className={`mobile-auth ${mobileOpen ? "visible" : ""}`}>
            {!loggedIn ? (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </>
            ) : (
              <>
                <button className="btn user-pill" onClick={() => navigate("/profile")}>
                  <Avatar name={user?.name || user?.email} size={34} />
                  <span>{user?.name?.split(" ")[0]}</span>
                </button>
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              </>
            )}
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-right">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {!loggedIn ? (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </>
          ) : (
            <>
              <button className="btn user-pill" onClick={() => navigate("/profile")}>
                <Avatar name={user?.name || user?.email} size={36} />
                <span>{user?.name?.split(" ")[0]}</span>
              </button>
              <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
