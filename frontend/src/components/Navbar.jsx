import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = token
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/" className="brand">Blogo</Link>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-name">
              Hi, {user.name || (user.role === "admin" ? "Admin" : "Author")}
            </span>

            {user.role === "admin" ? (
              <Link to="/admin" className="nav-link">Admin</Link>
            ) : (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}

            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
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
