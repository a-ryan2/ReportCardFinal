import React, { useEffect, useState } from "react";
import {
  fetchClassAdmins,
  saveClassAdmin,
  deleteClassAdmin,
  fetchUsers,
  fetchClasses,
  fetchSections
} from "./Api";

export default function ClassAdmin() {
  const [classAdmins, setClassAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [editing, setEditing] = useState(false);
  const [record, setRecord] = useState({
    id: null,
    userId: "",
    classId: "",
    sectionId: ""
  });

  const [role, setRole] = useState("");

  // ✅ Load role from localStorage on mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const r = currentUser.role?.name ? currentUser.role.name.toUpperCase() : "";
    setRole(r);
  }, []);

  // ✅ Load initial data only if MASTER ADMIN
  useEffect(() => {
    if (role !== "MASTER ADMIN") return;

    async function init() {
      const caData = await fetchClassAdmins();
      setClassAdmins(caData);

      const allUsers = await fetchUsers();
      setUsers(allUsers.filter(u => u.role?.name?.toUpperCase() === "TEACHER"));

      const classData = await fetchClasses();
      setClasses(classData);

      const sectionData = await fetchSections();
      setSections(sectionData);
    }
    init();
  }, [role]);

  // Save or update class-admin assignment
  async function handleSave() {
    if (!record.userId || !record.classId || !record.sectionId) {
      alert("All fields are required.");
      return;
    }

    const existing = classAdmins.find(
      ca => ca.user?.id === parseInt(record.userId) && ca.id !== record.id
    );
    if (existing) {
      alert("This user is already assigned to a class and section.");
      return;
    }

    await saveClassAdmin(record);
    setEditing(false);
    setRecord({ id: null, userId: "", classId: "", sectionId: "" });

    const updated = await fetchClassAdmins();
    setClassAdmins(updated);
  }

  // Delete assignment
  async function handleDelete(id) {
    if (window.confirm("Delete this assignment?")) {
      await deleteClassAdmin(id);
      const updated = await fetchClassAdmins();
      setClassAdmins(updated);
    }
  }

  // ✅ After hooks are defined, safely check role and conditionally render
  if (role !== "MASTER ADMIN") {
    return (
      <p style={{ color: "red", fontWeight: "bold" }}>
        Access denied. Only master admin can view this page.
      </p>
    );
  }

  return (
    <div className="container">
      <h2>Class Admin Assignments</h2>
      <button onClick={() => setEditing(!editing)}>
        {editing ? "Close" : "Assign Teacher"}
      </button>

      {editing && (
        <div className="form-container">
          <h3>{record.id ? "Edit Assignment" : "Add Assignment"}</h3>

          {/* Select Teacher */}
          <select
            value={record.userId}
            onChange={e => setRecord({ ...record, userId: e.target.value })}
          >
            <option value="">Select Teacher</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>

          {/* Select Class */}
          <select
            value={record.classId}
            onChange={e => setRecord({ ...record, classId: e.target.value })}
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Select Section */}
          <select
            value={record.sectionId}
            onChange={e => setRecord({ ...record, sectionId: e.target.value })}
          >
            <option value="">Select Section</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button onClick={handleSave}>{record.id ? "Update" : "Save"}</button>
          <button
            onClick={() => {
              setEditing(false);
              setRecord({ id: null, userId: "", classId: "", sectionId: "" });
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
            <th>Teacher</th>
            <th>Class</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classAdmins.map(ca => (
            <tr key={ca.id}>
              <td>{ca.user?.username}</td>
              <td>{ca.classEntity?.name}</td>
              <td>{ca.section?.name}</td>
              <td>
                <button
                  onClick={() => {
                    setRecord({
                      id: ca.id,
                      userId: ca.user?.id,
                      classId: ca.classEntity?.id,
                      sectionId: ca.section?.id
                    });
                    setEditing(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ca.id)}
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
