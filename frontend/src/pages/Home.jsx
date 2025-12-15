import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../App";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error("Home error:", err));
  }, []);

  return (
    <div className="container">
      <h2>Latest Posts</h2>

      <div className="posts-grid">
        {posts.map(p => (
          <Link to={`/post/${p._id}`} key={p._id} className="post-card">
            {p.image && (
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt={p.title}
              />
            )}
            <h3>{p.title}</h3>
            <p className="muted">
              by {p.author?.name || "Unknown"} •{" "}
              {new Date(p.createdAt).toLocaleDateString()}
            </p>
            <p className="excerpt">
              {(p.content || "").slice(0, 120)}
              {(p.content || "").length > 120 && "..."}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
