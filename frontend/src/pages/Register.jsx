import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) return setMsg(data.message);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input required placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button>Register</button>
      </form>
      {msg && <p className="error">{msg}</p>}
    </div>
  );
}
