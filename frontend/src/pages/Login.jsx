import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch(`https://blogo-x9yh.onrender.com/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) return setMsg(data.message);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input required type="email" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button>Login</button>
      </form>
      {msg && <p className="error">{msg}</p>}
    </div>
  );
}
