import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Simple Navbar: shows Login/Register when not logged in,
// shows Dashboard + Logout when logged in.
// Reads user info from localStorage for display.

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user")); } catch {}

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Blogo</Link>
      </div>

      <div className="nav-right">
        {token ? (
          <>
            <span className="user-name">Hi, {user?.name || "Author"}</span>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
