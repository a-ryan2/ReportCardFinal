import React, { useEffect, useState } from 'react';
import {
  fetchClasses,
  fetchSections,
  fetchStudents,
  saveStudent,
  deleteStudent,
  fetchStreams
} from './Api';
import Dropdown from './Dropdown';
import './style.css';

export default function Student() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [streams, setStreams] = useState([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [streamId, setStreamId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    srn: '',
    admissionNo: '',
    firstName: '',
    lastName: '',
    rollNumber: '',
    motherName: '',
    fatherName: '',
    dateOfBirth: '',
    streamId: ''
  });

  // Fetch initial data
  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchSections().then(setSections);
    fetchStreams().then(setStreams);
  }, []);

  // Fetch students when class & section change
  useEffect(() => {
    if (classId && sectionId) {
      setLoading(true);
      fetchStudents(classId, sectionId)
        .then(setStudents)
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
    }
  }, [classId, sectionId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Reset form
  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      srn: '',
      admissionNo: '',
      firstName: '',
      lastName: '',
      rollNumber: '',
      motherName: '',
      fatherName: '',
      dateOfBirth: '',
      streamId: ''
    });
    setStreamId('');
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      srn: student.srn || '',
      admissionNo: student.admissionNo || '',
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      rollNumber: student.rollNumber || '',
      motherName: student.motherName || '',
      fatherName: student.fatherName || '',
      dateOfBirth: student.dateOfBirth || '',
      streamId: student.stream ? student.stream.id : ''
    });
    setStreamId(student.stream ? student.stream.id : '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const validateForm = () => {
    const {
      admissionNo,
      firstName,
      rollNumber,
      motherName,
      fatherName,
      dateOfBirth
    } = formData;

    if (
      !admissionNo.trim() ||
      !firstName.trim() ||
      !rollNumber.trim() ||
      !motherName.trim() ||
      !fatherName.trim() ||
      !dateOfBirth
    ) {
      alert('All required fields must be filled.');
      return false;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (dateOfBirth > today) {
      alert('Date of Birth cannot be a future date.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!classId || !sectionId) return alert('Select class and section first.');
    if (!validateForm()) return;

    const duplicateRoll = students.some(
      (s) =>
        s.rollNumber.trim().toLowerCase() === formData.rollNumber.trim().toLowerCase() &&
        s.id !== editingStudent?.id
    );

    if (duplicateRoll) {
      alert('Roll number already exists in this class and section.');
      return;
    }

    const studentToSave = {
      ...formData,
      id: editingStudent?.id,
      classEntity: { id: Number(classId) },
      section: { id: Number(sectionId) },
      stream: streamId ? { id: Number(streamId) } : null
    };

    try {
      const saved = await saveStudent(studentToSave);
      setStudents((prev) =>
        editingStudent
          ? prev.map((s) => (s.id === saved.id ? saved : s))
          : [...prev, saved]
      );
      handleCancel();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save student.');
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    await deleteStudent(studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // ✅ Find selected class name (for stream display logic)
  const selectedClass = classes.find((c) => String(c.id) === String(classId));
  const shouldShowStream =
    selectedClass && (selectedClass.name === '11' || selectedClass.name === '12');

  return (
    <div className="container">
      <h2>Students</h2>

      {/* Class & Section Dropdowns */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <Dropdown label="Class" options={classes} value={classId} onChange={setClassId} />
        <Dropdown label="Section" options={sections} value={sectionId} onChange={setSectionId} />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-container">
          <input name="srn" placeholder="SRN" value={formData.srn} onChange={handleChange} />
          <input name="admissionNo" placeholder="Admission No *" value={formData.admissionNo} onChange={handleChange} />
          <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          <input name="rollNumber" placeholder="Roll Number *" value={formData.rollNumber} onChange={handleChange} />
          <input name="motherName" placeholder="Mother Name *" value={formData.motherName} onChange={handleChange} />
          <input name="fatherName" placeholder="Father Name *" value={formData.fatherName} onChange={handleChange} />

          {shouldShowStream && (
            <Dropdown label="Stream" options={streams} value={streamId} onChange={setStreamId} />
          )}

          <label style={{ marginTop: '5px' }}>
            Date of Birth *
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={{ marginLeft: '10px' }} />
          </label>

          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>{editingStudent ? 'Update' : 'Add'}</button>
            <button onClick={handleCancel} style={{ marginLeft: '5px', background: 'gray' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!showForm && classId && sectionId && (
        <button onClick={handleAdd} style={{ marginBottom: '10px' }}>
          Add Student
        </button>
      )}

      {/* Students Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        students.length > 0 &&
        classId &&
        sectionId && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>SRN</th>
                  <th>Admission No</th>
                  <th>Roll No</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Mother Name</th>
                  <th>Father Name</th>
                  <th>Date of Birth</th>
                  <th>Stream</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.srn || '-'}</td>
                    <td>{s.admissionNo}</td>
                    <td>{s.rollNumber}</td>
                    <td>{s.firstName}</td>
                    <td>{s.lastName || '-'}</td>
                    <td>{s.motherName}</td>
                    <td>{s.fatherName}</td>
                    <td>{s.dateOfBirth || '-'}</td>
                    <td>{s.stream ? s.stream.name : '-'}</td>
                    <td>
                      <button onClick={() => handleEdit(s)}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{ marginLeft: '5px', background: 'red' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {classId && sectionId && !loading && students.length === 0 && (
        <p>No students available for selected class & section.</p>
      )}
    </div>
  );
}
