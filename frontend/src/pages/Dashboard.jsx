import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../App";

// Dashboard: fetches /api/posts/mine and lists posts created by logged-in author
export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await fetch(`${API_BASE}/posts/mine`, { headers: { authorization: token } });
        if (!res.ok) {
          const err = await res.json();
          console.error("Dashboard fetch error:", err);
          return;
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    fetchMine();
  }, [token]);

  const deletePost = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, { method: "DELETE", headers: { authorization: token } });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Delete failed");
        return;
      }
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Your Posts</h2>
        <Link to="/create" className="create-btn">+ Create Post</Link>
      </div>

      {posts.length === 0 ? (
        <p>No posts found. Create your first post!</p>
      ) : (
        <div className="posts-grid">
          {posts.map(p => (
            <div className="post-card" key={p._id}>
              {p.image && <img src={`http://localhost:5000/uploads/${p.image}`} alt={p.title} />}
              <h3>{p.title}</h3>
              <p className="muted">{p.category}</p>
              <p className="excerpt">{(p.content || "").slice(0, 120)}...</p>

              <div className="btn-row">
                <Link to={`/edit/${p._id}`} className="edit-btn">Edit</Link>
                <button onClick={() => deletePost(p._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
