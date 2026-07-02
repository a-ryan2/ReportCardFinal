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

  const [academicYear, setAcademicYear] = useState('');

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);

  const [showForm, setShowForm] = useState(false);

  // ✅ Bulk Promotion States
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [showPromotionModal, setShowPromotionModal] = useState(false);

  const [promotionData, setPromotionData] = useState({
    targetClassId: '',
    targetSectionId: '',
    targetAcademicYear: '',
    targetStreamId: ''
  });

  const [formData, setFormData] = useState({
    srn: '',
    admissionNo: '',
    firstName: '',
    lastName: '',
    rollNumber: '',
    motherName: '',
    fatherName: '',
    dateOfBirth: '',
    academicYear: '',
    streamId: ''
  });

  // Fetch initial data
  useEffect(() => {

    fetchClasses().then(setClasses);

    fetchSections().then(setSections);

    fetchStreams().then(setStreams);

  }, []);

  // Fetch students
  useEffect(() => {

    if (classId && sectionId && academicYear) {

      setLoading(true);

      fetchStudents(classId, sectionId, academicYear)

        .then(setStudents)

        .finally(() => setLoading(false));

    } else {

      setStudents([]);
    }

  }, [classId, sectionId, academicYear]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      academicYear: academicYear || '',
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
      academicYear: student.academicYear || '',
      streamId: student.stream ? student.stream.id : ''
    });

    setStreamId(student.stream ? student.stream.id : '');

    setShowForm(true);
  };

  const handleCancel = () => {

    setShowForm(false);

    resetForm();
  };

  const selectedClass = classes.find(
    (c) => String(c.id) === String(classId)
  );

  const shouldShowStream =
    selectedClass &&
    (selectedClass.name === '11' || selectedClass.name === '12');

  const promotionSelectedClass = classes.find(
    (c) => String(c.id) === String(promotionData.targetClassId)
  );

  const shouldShowPromotionStream =
    promotionSelectedClass &&
    (
      promotionSelectedClass.name === '11' ||
      promotionSelectedClass.name === '12'
    );

  const validateForm = () => {

    const {
      admissionNo,
      firstName,
      rollNumber,
      motherName,
      fatherName,
      dateOfBirth,
      academicYear
    } = formData;

    if (
      !admissionNo.trim() ||
      !firstName.trim() ||
      !rollNumber.trim() ||
      !motherName.trim() ||
      !fatherName.trim() ||
      !dateOfBirth ||
      !academicYear
    ) {

      alert('All required fields must be filled.');

      return false;
    }

    if (shouldShowStream && !streamId) {

      alert('Please select stream for class 11 and 12.');

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

    if (!classId || !sectionId) {
      return alert('Select class and section first.');
    }

    if (!validateForm()) return;

    const duplicateRoll = students.some(
      (s) =>
        s.rollNumber.trim().toLowerCase() ===
          formData.rollNumber.trim().toLowerCase() &&
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

      stream: shouldShowStream
        ? { id: Number(streamId) }
        : null
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

    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    await deleteStudent(studentId);

    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // ✅ Bulk Select
  const toggleStudentSelection = (studentId) => {

    setSelectedStudents((prev) => {

      if (prev.includes(studentId)) {

        return prev.filter((id) => id !== studentId);
      }

      return [...prev, studentId];
    });
  };

  const toggleSelectAll = () => {

    if (selectedStudents.length === students.length) {

      setSelectedStudents([]);

    } else {

      setSelectedStudents(students.map((s) => s.id));
    }
  };

  // ✅ Promote Students
  const handlePromoteStudents = async () => {

    if (selectedStudents.length === 0) {

      return alert('Please select students.');
    }

    if (
      !promotionData.targetClassId ||
      !promotionData.targetSectionId ||
      !promotionData.targetAcademicYear
    ) {

      return alert('Please fill all promotion details.');
    }

    if (
      shouldShowPromotionStream &&
      !promotionData.targetStreamId
    ) {

      return alert('Please select stream for class 11 and 12.');
    }

    try {

      await fetch('http://localhost:8080/api/students/promote', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          studentIds: selectedStudents,

          targetClassId: Number(promotionData.targetClassId),

          targetSectionId: Number(promotionData.targetSectionId),

          targetAcademicYear: promotionData.targetAcademicYear,

          targetStreamId:
            shouldShowPromotionStream &&
            promotionData.targetStreamId
              ? Number(promotionData.targetStreamId)
              : null
        })
      });

      alert('Students promoted successfully.');

      const updatedStudents = await fetchStudents(
        classId,
        sectionId,
        academicYear
      );

      setStudents(updatedStudents);

      setShowPromotionModal(false);

      setSelectedStudents([]);

    } catch (err) {

      alert('Failed to promote students.');
    }
  };

  return (
    <div className="container">

      <h2>Students</h2>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '15px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >

        <Dropdown
          label="Class"
          options={classes}
          value={classId}
          onChange={setClassId}
        />

        <Dropdown
          label="Section"
          options={sections}
          value={sectionId}
          onChange={setSectionId}
        />

        <input
          type="text"
          placeholder="Academic Year (2025-2026)"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        />

        {classId && sectionId && academicYear && !loading && (
          <div style={{ fontWeight: 'bold' }}>
            Total Students: {students.length}
          </div>
        )}
      </div>

      {/* Add Student */}
      {!showForm && classId && sectionId && academicYear && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>

          <button onClick={handleAdd}>
            Add Student
          </button>

          <button
            onClick={() => setShowPromotionModal(true)}
            disabled={selectedStudents.length === 0}
          >
            Promote Students ({selectedStudents.length})
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="form-container">

          <input
            name="srn"
            placeholder="SRN"
            value={formData.srn}
            onChange={handleChange}
          />

          <input
            name="admissionNo"
            placeholder="Admission No *"
            value={formData.admissionNo}
            onChange={handleChange}
          />

          <input
            name="firstName"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={handleChange}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />

          <input
            name="rollNumber"
            placeholder="Roll Number *"
            value={formData.rollNumber}
            onChange={handleChange}
          />

          <input
            name="motherName"
            placeholder="Mother Name *"
            value={formData.motherName}
            onChange={handleChange}
          />

          <input
            name="fatherName"
            placeholder="Father Name *"
            value={formData.fatherName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="academicYear"
            placeholder="Academic Year *"
            value={formData.academicYear}
            onChange={handleChange}
          />

          {shouldShowStream && (
            <Dropdown
              label="Stream"
              options={streams}
              value={streamId}
              onChange={setStreamId}
            />
          )}

          <label style={{ marginTop: '5px' }}>

            Date of Birth *

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              style={{ marginLeft: '10px' }}
            />
          </label>

          <div style={{ marginTop: '10px' }}>

            <button onClick={handleSave}>
              {editingStudent ? 'Update' : 'Add'}
            </button>

            <button
              onClick={handleCancel}
              style={{ marginLeft: '5px', background: 'gray' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="form-container">

          <h3>Promote Students</h3>

          <Dropdown
            label="Target Class"
            options={classes}
            value={promotionData.targetClassId}
            onChange={(value) =>
              setPromotionData({
                ...promotionData,
                targetClassId: value,
                targetStreamId: ''
              })
            }
          />

          <Dropdown
            label="Target Section"
            options={sections}
            value={promotionData.targetSectionId}
            onChange={(value) =>
              setPromotionData({
                ...promotionData,
                targetSectionId: value
              })
            }
          />

          <input
            type="text"
            placeholder="Target Academic Year"
            value={promotionData.targetAcademicYear}
            onChange={(e) =>
              setPromotionData({
                ...promotionData,
                targetAcademicYear: e.target.value
              })
            }
          />

          {shouldShowPromotionStream && (
            <Dropdown
              label="Target Stream"
              options={streams}
              value={promotionData.targetStreamId}
              onChange={(value) =>
                setPromotionData({
                  ...promotionData,
                  targetStreamId: value
                })
              }
            />
          )}

          <div style={{ marginTop: '15px' }}>

            <button onClick={handlePromoteStudents}>
              Confirm Promotion
            </button>

            <button
              onClick={() => setShowPromotionModal(false)}
              style={{
                marginLeft: '10px',
                background: 'gray'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        students.length > 0 &&
        classId &&
        sectionId &&
        academicYear && (
          <div className="table-container">

            <table className="table">

              <thead>
                <tr>

                  <th>
                    <input
                      type="checkbox"
                      checked={
                        students.length > 0 &&
                        selectedStudents.length === students.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th>SRN</th>
                  <th>Admission No</th>
                  <th>Roll No</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Mother Name</th>
                  <th>Father Name</th>
                  <th>Date of Birth</th>
                  <th>Academic Year</th>
                  <th>Stream</th>
                  <th>Actions</th>

                </tr>
              </thead>

              <tbody>

                {students.map((s) => (

                  <tr key={s.id}>

                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(s.id)}
                        onChange={() =>
                          toggleStudentSelection(s.id)
                        }
                      />
                    </td>

                    <td>{s.srn || '-'}</td>

                    <td>{s.admissionNo}</td>

                    <td>{s.rollNumber}</td>

                    <td>{s.firstName}</td>

                    <td>{s.lastName || '-'}</td>

                    <td>{s.motherName}</td>

                    <td>{s.fatherName}</td>

                    <td>{s.dateOfBirth || '-'}</td>

                    <td>{s.academicYear}</td>

                    <td>{s.stream ? s.stream.name : '-'}</td>

                    <td>

                      <button onClick={() => handleEdit(s)}>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        style={{
                          marginLeft: '5px',
                          background: 'red'
                        }}
                      >
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

      {classId &&
        sectionId &&
        academicYear &&
        !loading &&
        students.length === 0 && (
          <p>
            No students available for selected class & section.
          </p>
        )}
    </div>
  );
}