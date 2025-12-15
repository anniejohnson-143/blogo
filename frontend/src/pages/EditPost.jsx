import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../App";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || "");
        setContent(data.content || "");
        setCategory(data.category || "");
      });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("category", category);
    if (image) fd.append("image", image);

    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: "PUT",
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
      <h2>Edit Post</h2>
      {msg && <p className="error">{msg}</p>}

      <form onSubmit={submit}>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
        <input value={category} onChange={e => setCategory(e.target.value)} />
        <textarea value={content} onChange={e => setContent(e.target.value)} required />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button>Update</button>
      </form>
    </div>
  );
}
