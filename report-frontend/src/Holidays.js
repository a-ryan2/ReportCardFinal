import React, { useEffect, useState } from "react";
import { fetchHolidays, saveHoliday, deleteHoliday, fetchClasses } from "./Api";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [holiday, setHoliday] = useState({
    id: null,
    fromDate: "",
    toDate: "",
    description: "",
    classIds: [],
  });

  async function loadData() {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);
    const end = new Date(today.getFullYear(), 11, 31).toISOString().slice(0, 10);
    const data = await fetchHolidays(start, end);
    const cls = await fetchClasses();
    setClasses(cls);
    setHolidays(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave() {
    if (!holiday.fromDate.trim() || !holiday.toDate.trim()) {
      alert("From and To dates are required.");
      return;
    }
    if (!holiday.description.trim()) {
      alert("Description is required.");
      return;
    }
    if (holiday.classIds.length === 0) {
      alert("Select at least one class.");
      return;
    }

    await saveHoliday(holiday);
    setHoliday({ id: null, fromDate: "", toDate: "", description: "", classIds: [] });
    setEditing(false);
    await loadData();
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this holiday?")) {
      await deleteHoliday(id);
      await loadData();
    }
  }

  function toggleClassSelection(classId) {
    setHoliday((prev) => {
      const selected = new Set(prev.classIds);
      selected.has(classId) ? selected.delete(classId) : selected.add(classId);
      return { ...prev, classIds: Array.from(selected) };
    });
  }

  return (
    <div className="container">
      <h2>Holidays</h2>
      <button onClick={() => setEditing(!editing)}>
        {editing ? "Close Add/Edit" : "Add Holiday"}
      </button>

      {editing && (
        <div className="form-container">
          <h3>{holiday.id ? "Edit Holiday" : "Add Holiday"}</h3>

          <label>From Date</label>
          <input
            type="date"
            value={holiday.fromDate}
            onChange={(e) => setHoliday({ ...holiday, fromDate: e.target.value })}
          />

          <label>To Date</label>
          <input
            type="date"
            value={holiday.toDate}
            onChange={(e) => setHoliday({ ...holiday, toDate: e.target.value })}
          />

          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            value={holiday.description}
            onChange={(e) => setHoliday({ ...holiday, description: e.target.value })}
          />

          <label>Applicable Classes</label>
          <div
            className="class-checkboxes"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "5px",
              maxHeight: "150px",
              overflowY: "auto",
              background: "#fafafa",
            }}
          >
            {classes.length === 0 ? (
              <p style={{ color: "gray" }}>No classes available</p>
            ) : (
              classes.map((cls) => (
                <label
                  key={cls.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "14px",
                    minWidth: "120px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={holiday.classIds.includes(cls.id)}
                    onChange={() => toggleClassSelection(cls.id)}
                  />
                  {cls.name}
                </label>
              ))
            )}
          </div>

          <div style={{ marginTop: "10px" }}>
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setEditing(false);
                setHoliday({ id: null, fromDate: "", toDate: "", description: "", classIds: [] });
              }}
              style={{ marginLeft: "5px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="table" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Description</th>
            <th>Classes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h) => (
            <tr key={h.id}>
              <td>{h.fromDate}</td>
              <td>{h.toDate}</td>
              <td>{h.description}</td>
              <td>{h.classes?.map((c) => c.name).join(", ")}</td>
              <td>
                <button
                  onClick={() => {
                    setHoliday({
                      id: h.id,
                      fromDate: h.fromDate,
                      toDate: h.toDate,
                      description: h.description,
                      classIds: h.classes?.map((c) => c.id) || [],
                    });
                    setEditing(true);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(h.id)}
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
