import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("category", category);
    if (image) fd.append("image", image);

    const res = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (!res.ok) {
      const err = await res.json();
      return setMsg(err.message);
    }

    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <h2>Create Post</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input placeholder="Category" onChange={e => setCategory(e.target.value)} />
        <textarea required placeholder="Content" onChange={e => setContent(e.target.value)} />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button>Publish</button>
      </form>
    </div>
  );
}
