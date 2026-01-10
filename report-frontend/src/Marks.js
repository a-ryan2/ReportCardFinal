import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import {
  fetchClasses,
  fetchSections,
  fetchSubjects,
  fetchExamTypes,
  fetchTerms,
  fetchStudents,
  fetchMarksByStudent,
  saveMark,
  fetchClassAdmins,
  generateReportCardForClassSection
} from './Api';
import './style.css';

export default function Marks() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [terms, setTerms] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]); // For admin

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examTypeId, setExamTypeId] = useState('');
  const [termId, setTermId] = useState('');

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const role = currentUser.role?.name ? currentUser.role.name.toUpperCase() : '';

  // Fetch base data
  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchSections().then(setSections);
    fetchSubjects().then(setSubjects);
    fetchExamTypes().then(setExamTypes);
    fetchTerms().then(setTerms);

    // Fetch assigned classes if role is ADMIN
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

  // Fetch students based on class and section
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

  // Reset marks if subject, exam type, or term is cleared
  useEffect(() => {
    if (!subjectId || !examTypeId || !termId) {
      setMarks({});
      setErrors({});
    }
  }, [subjectId, examTypeId, termId]);

  // Load marks for selected students
  useEffect(() => {
    async function loadMarks() {
      const marksData = {};
      for (const student of students) {
        const ms = await fetchMarksByStudent(student.id);
        ms.forEach(m => {
          if (
            m.subject.id === parseInt(subjectId) &&
            m.examType.id === parseInt(examTypeId) &&
            m.term.id === parseInt(termId) &&
            m.classId === parseInt(classId) &&
            m.sectionId === parseInt(sectionId)
          ) {
            marksData[student.id] = m;
          }
        });
      }
      setMarks(marksData);
    }

    if (students.length > 0 && subjectId && examTypeId && termId && classId && sectionId) {
      loadMarks();
    } else {
      setMarks({});
    }
  }, [students, subjectId, examTypeId, termId, classId, sectionId]);

  // Determine if user can edit
  const editable = (() => {
    if (role === 'MASTER ADMIN') return true;
    if (role === 'ADMIN') {
      const canEdit = assignedClasses.some(
        a => a.classId === parseInt(classId) && a.sectionId === parseInt(sectionId)
      );
      return canEdit;
    }
    return false;
  })();

  function handleMarkChange(studentId, field, value) {
    if (!editable) return; // Prevent editing if not allowed

    // Ensure only >= 0 and keep zero
    const sanitized = value === '' ? '' : Math.max(0, Number(value));

    setMarks(prev => {
      const existing = prev[studentId] || {
        student: { id: studentId },
        subject: { id: parseInt(subjectId) },
        examType: { id: parseInt(examTypeId) },
        term: { id: parseInt(termId) },
        classId: parseInt(classId),
        sectionId: parseInt(sectionId),
        totalMarks: '',
        marksObtained: '',
        academicYear: new Date().getFullYear().toString()
      };
      const updated = { ...existing, [field]: sanitized };
      return { ...prev, [studentId]: updated };
    });

    setErrors(prev => ({ ...prev, [studentId]: null }));
  }

  async function saveAll() {
    if (!editable) {
      alert('You do not have permission to edit marks for this class and section.');
      return;
    }

    if (!classId || !sectionId || !subjectId || !examTypeId || !termId) {
      alert('Please select Class, Section, Subject, Exam Type, and Term before saving marks.');
      return;
    }

    const newErrors = {};
    for (const studentId in marks) {
      const m = marks[studentId];
      const total = m.totalMarks;
      const obtained = m.marksObtained;

      if ((total !== '' && obtained === '') || (total === '' && obtained !== '')) {
        newErrors[studentId] = 'Both Total Marks and Marks Obtained are required';
      } else if (total !== '' && obtained !== '' && parseInt(obtained) > parseInt(total)) {
        newErrors[studentId] = 'Marks Obtained cannot exceed Total Marks';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await Promise.all(Object.values(marks).map(m => saveMark(m)));

    // After saving marks, generate/update record in report_card table for rank in class.
    await generateReportCardForClassSection(classId, sectionId, students);

    alert('Marks saved successfully!');
  }

  return (
    <>
      <nav className="navbar">My School App</nav>
      <div className="container">
        <h2>Marks Entry</h2>

        <Dropdown label="Class" options={classes} value={classId} onChange={setClassId} />
        <Dropdown label="Section" options={sections} value={sectionId} onChange={setSectionId} />
        <Dropdown label="Subject" options={subjects} value={subjectId} onChange={setSubjectId} />
        <Dropdown label="Exam Type" options={examTypes} value={examTypeId} onChange={setExamTypeId} />
        <Dropdown label="Term" options={terms} value={termId} onChange={setTermId} />

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table className="table" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Total Marks</th>
                <th>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map(student => {
                  const mark = marks[student.id] || {};
                  const error = errors[student.id];
                  return (
                    <React.Fragment key={student.id}>
                      <tr className={error ? 'error-row' : ''}>
                        <td>{student.firstName + ' ' + student.lastName}</td>
                        <td>
                          <input
                            type="number"
                            value={mark.totalMarks ?? ''}
                            onChange={e =>
                              handleMarkChange(student.id, 'totalMarks', e.target.value)
                            }
                            className="input-field small-input"
                            min="0"
                            style={{ width: '80px', textAlign: 'center' }}
                            disabled={!editable}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={mark.marksObtained ?? ''}
                            onChange={e =>
                              handleMarkChange(student.id, 'marksObtained', e.target.value)
                            }
                            className="input-field small-input"
                            min="0"
                            style={{ width: '80px', textAlign: 'center' }}
                            disabled={!editable}
                          />
                        </td>
                      </tr>
                      {error && (
                        <tr>
                          <td colSpan="3" style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>
                            {error}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No students to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <button onClick={saveAll} className="save-button" disabled={!editable}>
          Save Marks
        </button>
      </div>
      <footer className="footer">© 2025 My School App</footer>
    </>
  );
}
