import React from "react";
import "./MarkSheetTemplate1.css";

function MarkSheetTemplate1({ students, marks }) {

  // Subjects (same as Template1)
  const subjects = [
    "ENGLISH",
    "HINDI",
    "MATHEMATICS",
    "SCIENCE",
    "SST"
  ];

  // Exam structure (simplified for marksheet)
  const exams = ["PT1", "T1", "PT2", "T2"];

  // 🔁 Transform marks into usable structure
  const getStudentMarks = (studentId, subject, exam) => {
    const data = marks.find(
      (m) =>
        m.studentId === studentId &&
        m.subjectName?.toUpperCase() === subject &&
        m.examType === exam
    );
    return data ? data.marksObtained : "";
  };

  return (
    <div className="marksheet-container">
      <h2 className="title">Class Marksheet</h2>

      <table className="marksheet-table">
        <thead>
          <tr>
            <th rowSpan="2">Student Name</th>

            {subjects.map((sub, i) => (
              <th key={i} colSpan={exams.length}>
                {sub}
              </th>
            ))}
          </tr>

          <tr>
            {subjects.map((sub) =>
              exams.map((exam, i) => (
                <th key={`${sub}-${i}`}>{exam}</th>
              ))
            )}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="student-name">
                {student.firstName} {student.lastName}
              </td>

              {subjects.map((sub) =>
                exams.map((exam) => (
                  <td key={`${student.id}-${sub}-${exam}`}>
                    {getStudentMarks(student.id, sub, exam)}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarkSheetTemplate1;