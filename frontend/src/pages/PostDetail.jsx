import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../App";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`https://blogo-x9yh.onrender.com/api/posts/${id}`)
      .then(res => res.json())
      .then(setPost);
  }, [id]);

  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    const res = await fetch(`https://blogo-x9yh.onrender.com/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) navigate("/dashboard");
  };

  if (!post) return <div className="container">Loading...</div>;

  const isAuthor =
    token && user && (post.author?._id === user.id);

  return (
    <div className="container">
      <h2>{post.title}</h2>
      <p className="muted">
        by {post.author?.name || "Unknown"} •{" "}
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {post.image && (
        <img
          src={`https://blogo-x9yh.onrender.com/uploads/${post.image}`}
          className="post-img"
          alt={post.title}
        />
      )}

      <div className="post-content">{post.content}</div>

      <div style={{ marginTop: 12 }}>
        <Link to="/" className="back-link">← Back</Link>

        {isAuthor && (
          <>
            <Link to={`/edit/${post._id}`} className="edit-btn" style={{ marginLeft: 10 }}>
              Edit
            </Link>
            <button onClick={deletePost} className="delete-btn" style={{ marginLeft: 8 }}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
