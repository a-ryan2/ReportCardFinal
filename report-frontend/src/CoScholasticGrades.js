import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import {
  fetchClasses,
  fetchSections,
  fetchStudents,
  fetchTerms,
  fetchCoScholasticMarksByStudentTerm,
  saveCoScholasticMarks,
  fetchClassAdmins
} from './Api';
import './style.css';

export default function CoScholasticGrades() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [terms, setTerms] = useState([]);

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [termId, setTermId] = useState('');

  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [assignedClasses, setAssignedClasses] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const role = currentUser.role?.name ? currentUser.role.name.toUpperCase() : '';

  // Load classes, sections, terms, and admin mappings
  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchSections().then(setSections);
    fetchTerms().then(setTerms);

    if (role === 'ADMIN') {
      fetchClassAdmins(currentUser.id).then(data => {
        setAssignedClasses(
          data.map(a => ({
            classId: a.classEntity.id,
            sectionId: a.section.id
          }))
        );
      });
    }
  }, [role, currentUser.id]);

  // Load students
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

  // Load existing Co-Scholastic marks
  useEffect(() => {
    async function loadGrades() {
      const gradesData = {};
      for (const student of students) {
        const marks = await fetchCoScholasticMarksByStudentTerm(student.id, termId);
        if (marks.length > 0) {
          gradesData[student.id] = marks[0];
        }
      }
      setGrades(gradesData);
    }

    if (students.length > 0 && termId) {
      loadGrades();
    } else {
      setGrades({});
    }
  }, [students, termId]);

  // Permission logic (editable only if master admin or assigned admin)
  const editable = (() => {
    if (role === 'MASTER ADMIN') return true;
    if (role === 'ADMIN') {
      return assignedClasses.some(
        a => a.classId === parseInt(classId) && a.sectionId === parseInt(sectionId)
      );
    }
    return false;
  })();

  function handleGradeChange(studentId, field, value) {
    if (!editable) return; // prevent unauthorized edit

    setGrades(prev => {
      const existing = prev[studentId] || {
        student: { id: studentId },
        term: { id: parseInt(termId) },
        regularityPunctuality: '',
        sincerity: '',
        behaviourValues: '',
        respectfulnessRules: '',
        attitudeTeachers: '',
        attitudeClassmates: '',
        classTeacherRemarks: '',
        artEducation: '',
        workEducation: '',
        healthPhysicalEducation: '',
      };
      return { ...prev, [studentId]: { ...existing, [field]: value } };
    });

    setErrors(prev => ({ ...prev, [studentId]: null }));
  }

  async function saveAll() {
    if (!editable) {
      alert('You do not have permission to update grades for this class/section.');
      return;
    }

    if (!classId || !sectionId || !termId) {
      alert('Please select Class, Section, and Term before saving.');
      return;
    }

    const newErrors = {};
    for (const studentId in grades) {
      const g = grades[studentId];
      if (!g.regularityPunctuality || !g.sincerity) {
        newErrors[studentId] = 'Please fill at least Regularity & Sincerity';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await Promise.all(Object.values(grades).map(g => saveCoScholasticMarks(g)));
    alert('Co-Scholastic grades saved successfully!');
  }

  return (
    <>
      <nav className="navbar">My School App</nav>
      <div className="container">
        <h2>Co-Scholastic Grades Entry</h2>

        <Dropdown label="Class" options={classes} value={classId} onChange={setClassId} />
        <Dropdown label="Section" options={sections} value={sectionId} onChange={setSectionId} />
        <Dropdown label="Term" options={terms} value={termId} onChange={setTermId} />

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto', marginTop: 20 }}>
            <table className="table" style={{ minWidth: '900px' }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Regularity & Punctuality</th>
                  <th>Sincerity</th>
                  <th>Behaviour & Values</th>
                  <th>Respect Rules</th>
                  <th>Attitude Teachers</th>
                  <th>Attitude Classmates</th>
                  <th>Class Teacher Remarks</th>
                  <th>Art Education</th>
                  <th>Work Education</th>
                  <th>Health & Physical Education</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => {
                    const g = grades[student.id] || {};
                    const error = errors[student.id];
                    return (
                      <React.Fragment key={student.id}>
                        <tr className={error ? 'error-row' : ''}>
                          <td>{student.firstName + ' ' + student.lastName}</td>
                          {[
                            'regularityPunctuality',
                            'sincerity',
                            'behaviourValues',
                            'respectfulnessRules',
                            'attitudeTeachers',
                            'attitudeClassmates',
                            'classTeacherRemarks',
                            'artEducation',
                            'workEducation',
                            'healthPhysicalEducation'
                          ].map(field => (
                            <td key={field}>
                              <input
                                type="text"
                                value={g[field] || ''}
                                disabled={!editable}
                                onChange={e =>
                                  handleGradeChange(student.id, field, e.target.value)
                                }
                                className="input-field small-input"
                              />
                            </td>
                          ))}
                        </tr>
                        {error && (
                          <tr>
                            <td colSpan="11" style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>
                              {error}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center' }}>
                      No students to display
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={saveAll}
          disabled={!editable}
          className="save-button"
          style={{ marginTop: 15 }}
        >
          Save Grades
        </button>
      </div>
      <footer className="footer">© 2025 My School App</footer>
    </>
  );
}
