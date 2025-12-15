import React, { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin/users`, { headers })
      .then(res => res.json())
      .then(setUsers);

    fetch(`${API_BASE}/admin/posts`, { headers })
      .then(res => res.json())
      .then(setPosts);
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user and all posts?")) return;

    await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers
    });

    setUsers(users.filter(u => u._id !== id));
  };

  const deletePost = async (id) => {
    await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: "DELETE",
      headers
    });

    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* USERS */}
      <h3>Users</h3>
      {users.map(u => (
        <div key={u._id} className="admin-user">
          {u.name} ({u.email})
          <button className="delete-btn" onClick={() => deleteUser(u._id)}>
            Delete
          </button>
        </div>
      ))}

      {/* POSTS */}
      <h3>All Posts</h3>
      {posts.map(p => (
        <div key={p._id} className="admin-user">
          <b>{p.title}</b> by {p.author?.name}
          <button className="delete-btn" onClick={() => deletePost(p._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
