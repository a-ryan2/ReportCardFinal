import React, { useEffect, useState } from "react";
import {
  fetchClasses,
  saveClass,
  deleteClass,
  fetchSections,
  saveSection,
  deleteSection,
} from "./Api";

export default function ClassesSections() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [classForm, setClassForm] = useState({ name: "" });
  const [sectionForm, setSectionForm] = useState({ name: "" });
  const [showClassForm, setShowClassForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

async function loadData() {
  let cls = await fetchClasses();
  let sec = await fetchSections();

  // Numeric sort for class names
  cls.sort((a, b) => Number(a.name) - Number(b.name));

  // Alphanumeric sort for section names
  sec.sort((a, b) => a.name.localeCompare(b.name));

  setClasses(cls);
  setSections(sec);
}


  useEffect(() => {
    loadData();
  }, []);

  // ---- CLASS HANDLERS ----
  function toggleClassForm() {
    if (showClassForm) {
      setShowClassForm(false);
      setClassForm({ name: "" });
      setEditingClass(null);
    } else {
      setClassForm({ name: "" });
      setEditingClass(null);
      setShowClassForm(true);
    }
  }

  async function handleSaveClass() {
    const trimmedName = classForm.name.trim();
    if (!trimmedName) {
      alert("Class name is required.");
      return;
    }

    const duplicate = classes.find(
      (c) =>
        c.name.toLowerCase() === trimmedName.toLowerCase() &&
        c.id !== editingClass?.id
    );
    if (duplicate) {
      alert("Class name must be unique.");
      return;
    }

    await saveClass({ ...classForm, id: editingClass?.id });
    setClassForm({ name: "" });
    setEditingClass(null);
    setShowClassForm(false);
    await loadData();
  }

  async function handleDeleteClass(id) {
    if (window.confirm("Delete this class?")) {
      await deleteClass(id);
      await loadData();
    }
  }

  // ---- SECTION HANDLERS ----
  function toggleSectionForm() {
    if (showSectionForm) {
      setShowSectionForm(false);
      setSectionForm({ name: "" });
      setEditingSection(null);
    } else {
      setSectionForm({ name: "" });
      setEditingSection(null);
      setShowSectionForm(true);
    }
  }

  async function handleSaveSection() {
    const trimmedName = sectionForm.name.trim();
    if (!trimmedName) {
      alert("Section name is required.");
      return;
    }

    const duplicate = sections.find(
      (s) =>
        s.name.toLowerCase() === trimmedName.toLowerCase() &&
        s.id !== editingSection?.id
    );
    if (duplicate) {
      alert("Section name must be unique.");
      return;
    }

    await saveSection({ ...sectionForm, id: editingSection?.id });
    setSectionForm({ name: "" });
    setEditingSection(null);
    setShowSectionForm(false);
    await loadData();
  }

  async function handleDeleteSection(id) {
    if (window.confirm("Delete this section?")) {
      await deleteSection(id);
      await loadData();
    }
  }

  return (
    <div className="container">
      <h2>Classes & Sections</h2>

      {/* ===== CLASSES ===== */}
      <div className="table-block">
        <h3>Classes</h3>
        <button onClick={toggleClassForm}>
          {showClassForm ? "Close Add/Edit Class" : "Add Class"}
        </button>

        {showClassForm && (
          <div className="form-container">
            <input
              type="text"
              placeholder="Class Name"
              value={classForm.name}
              onChange={(e) =>
                setClassForm({ ...classForm, name: e.target.value })
              }
              required
            />
            <button onClick={handleSaveClass}>
              {editingClass ? "Update" : "Save"}
            </button>
            <button onClick={toggleClassForm}>Cancel</button>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingClass(c);
                      setClassForm({ name: c.name, id: c.id });
                      setShowClassForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClass(c.id)}
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

      {/* ===== SECTIONS ===== */}
      <div className="table-block" style={{ marginTop: 40 }}>
        <h3>Sections</h3>
        <button onClick={toggleSectionForm}>
          {showSectionForm ? "Close Add/Edit Section" : "Add Section"}
        </button>

        {showSectionForm && (
          <div className="form-container">
            <input
              type="text"
              placeholder="Section Name"
              value={sectionForm.name}
              onChange={(e) =>
                setSectionForm({ ...sectionForm, name: e.target.value })
              }
              required
            />
            <button onClick={handleSaveSection}>
              {editingSection ? "Update" : "Save"}
            </button>
            <button onClick={toggleSectionForm}>Cancel</button>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Section Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingSection(s);
                      setSectionForm({ name: s.name, id: s.id });
                      setShowSectionForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSection(s.id)}
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
    </div>
  );
}
