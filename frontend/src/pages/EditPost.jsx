import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../App";

// EditPost: loads current post and submits update (FormData for image)
export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category || "");
        } else {
          setMsg(data.message || "Post not found");
        }
      })
      .catch(err => console.error("EditPost fetch error:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return setMsg("Title and content required");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("category", category);
    if (image) fd.append("image", image);

    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, { method: "PUT", headers: { authorization: token }, body: fd });
      if (!res.ok) {
        const err = await res.json();
        setMsg(err.message || "Update failed");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("EditPost error:", err);
      setMsg("Server error");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Post</h2>
      {msg && <p className="error">{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input required value={title} onChange={e => setTitle(e.target.value)} />
        <input value={category} onChange={e => setCategory(e.target.value)} />
        <textarea required value={content} onChange={e => setContent(e.target.value)}></textarea>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
