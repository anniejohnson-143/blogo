import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../App";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://blogo-x9yh.onrender.com/posts/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setPosts);
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    await fetch(`https://blogo-x9yh.onrender.com/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Your Posts</h2>
        <Link to="/create" className="create-btn">+ Create</Link>
      </div>

      {posts.map(p => (
        <div className="post-card" key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.category}</p>
          <div className="btn-row">
            <Link to={`/edit/${p._id}`} className="edit-btn">Edit</Link>
            <button onClick={() => deletePost(p._id)} className="delete-btn">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
