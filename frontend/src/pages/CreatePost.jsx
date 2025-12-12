import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

// CreatePost: submit form with FormData for optional image
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
    if (!title || !content) return setMsg("Title and content are required");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("category", category);
    if (image) fd.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/posts`, { method: "POST", headers: { authorization: token }, body: fd });
      if (!res.ok) {
        const err = await res.json();
        setMsg(err.message || "Create failed");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("CreatePost error:", err);
      setMsg("Server error");
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Post</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <textarea required placeholder="Content" value={content} onChange={e => setContent(e.target.value)}></textarea>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}
