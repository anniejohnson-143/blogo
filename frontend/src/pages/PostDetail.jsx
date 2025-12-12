import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

// PostDetail: shows full post. If logged-in user is author, show Edit/Delete.

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user")); } catch {}

  useEffect(() => {
    fetch(`${API_BASE}/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.error("PostDetail fetch error:", err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: "DELETE",
      headers: { authorization: token }
    });
    if (res.ok) navigate("/dashboard");
    else {
      const err = await res.json();
      alert(err.message || "Delete failed");
    }
  };

  if (!post) return <div className="container">Loading...</div>;

  const isAuthor = token && post.author && (post.author._id === user?.id || post.author === user?.id);

  return (
    <div className="container">
      <h2>{post.title}</h2>
      <p className="muted">by {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleString()}</p>
      {post.image && <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} className="post-img" />}
      <div className="post-content">{post.content}</div>

      <div style={{ marginTop: 12 }}>
        <Link to="/" className="back-link">← Back</Link>
        {isAuthor && (
          <>
            <Link to={`/edit/${post._id}`} className="edit-btn" style={{ marginLeft: 12 }}>Edit</Link>
            <button onClick={handleDelete} className="delete-btn" style={{ marginLeft: 8 }}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
