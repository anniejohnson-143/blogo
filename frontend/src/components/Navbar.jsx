import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" | "user"

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      {/* LEFT */}
      <Link to="/" className="brand">Blogo</Link>

      {/* RIGHT */}
      <div className="nav-right">
        {token ? (
          <>
            <span className="user-name">
              Hi, {role === "admin" ? "Admin" : "Author"}
            </span>

            {role === "admin" ? (
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
