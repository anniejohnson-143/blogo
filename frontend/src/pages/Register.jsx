import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

// Register: creates user and auto-logs in (backend returns token + user)

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message || "Register failed");

      // Save token and user (backend returns them)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setMsg("Server error");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Register</button>
      </form>
      {msg && <p className="error">{msg}</p>}
    </div>
  );
}
