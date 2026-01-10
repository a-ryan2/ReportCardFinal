import React, { useEffect, useState } from "react";
import { fetchUsers, saveUser, deleteUser, fetchRoles } from "./Api";

export default function Users() {
  // State
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({ id: null, username: "", password: "", role: "" });
  const [roles, setRoles] = useState([]);

  // Current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const role = currentUser.role?.name ? currentUser.role.name.toUpperCase() : "";

  // Load users and roles (only for admin)
  useEffect(() => {
    async function init() {
      if (role === "MASTER ADMIN") {
        await loadUsers();
        await loadRoles();
      }
    }
    init();
  }, [role]);

  // MASTER Admin-only rendering
  if (role !== "MASTER ADMIN") {
    return <p style={{ color: "red", fontWeight: "bold" }}>Access denied. Only master admin can view this page.</p>;
  }

  // Load users (refresh)
  async function loadUsers() {
    const data = await fetchUsers();
    setUsers(
      data.map((u) => ({
        ...u,
        role: u.role?.name || "",
        password: u.password || "", // use plainPassword from backend
      }))
    );
  }

  // Load roles (refresh)
  async function loadRoles() {
    const data = await fetchRoles();
    setRoles(data);
  }

  // Toggle add/edit form
  function handleAddClick() {
    if (editing) {
      setEditing(false);
      setUser({ id: null, username: "", password: "", role: "" });
    } else {
      setUser({ id: null, username: "", password: "", role: "" });
      setEditing(true);
    }
  }

  // Save or update user
  async function handleSave() {
    if (!user.username.trim() || !user.role.trim() || !user.password.trim()) {
      alert("All fields are mandatory.");
      return;
    }

    await saveUser(user);
    setUser({ id: null, username: "", password: "", role: "" });
    setEditing(false);
    await loadUsers();
  }

  // Delete user
  async function handleDelete(id) {
    if (window.confirm("Delete this user?")) {
      await deleteUser(id);
      await loadUsers();
    }
  }

  return (
    <div className="container">
      <h2>Users</h2>

      <button onClick={handleAddClick}>
        {editing ? "Close Add/Edit User" : "Add User"}
      </button>

      {editing && (
        <div className="form-container">
          <h3>{user.id ? "Edit User" : "Add User"}</h3>

          <input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />

          <input
            type="text" // show plain password
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />

          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <button onClick={handleSave}>{user.id ? "Update" : "Save"}</button>
          <button
            onClick={() => {
              setEditing(false);
              setUser({ id: null, username: "", password: "", role: "" });
            }}
            style={{ marginLeft: "5px" }}
          >
            Cancel
          </button>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.password}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => {
                    setUser({ ...u, password: u.password }); // pre-fill plain password
                    setEditing(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{ marginLeft: "5px", background: "red", color: "white" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
