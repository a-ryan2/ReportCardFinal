import React from "react";
import AryaVidyaMandirLogo from "./AryaVidyaMandirLogo.png";
import "./Template2.css";

function ReportCardTemplate2({
  student,
  marks,
  coScholastic,
  teacherRemarks,
  totalPercentage,
  rank,
  academicYear
}) {
  const scholasticMarks = marks || [];
  const coMarks = coScholastic || [];

  const formatMarks = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = Number(value);
    if (isNaN(num)) return value;
    return parseFloat(num.toFixed(2));
  };

  const classNo = parseInt(student?.classEntity?.name);

 const subjects =
   classNo === 5
     ? [
         "ENGLISH",
         "HINDI",
         "MATHEMATICS",
         "SCIENCE",
         "SOCIAL SCIENCE",
         "G.K",
         "COMPUTER",
         "MORAL SCIENCE"
       ]
     : classNo === 9
     ? [
         "ENGLISH",
         "HINDI",
         "MATHEMATICS",
         "SST",
         "SCIENCE",
         "Optional sub",
         "COMPUTER"
       ]
     : [
         "ENGLISH",
         "HINDI",
         "MATHEMATICS",
         "SST",
         "SCIENCE",
         "SANSKRIT",
         "Optional sub",
         "COMPUTER"
       ];

    const getSubjectMarks = (subjectName) => {
      let lookupName = subjectName?.toUpperCase();

      // Standard mapping
      if (lookupName === "SOCIAL SCIENCE") {
        lookupName = "SST";
      }

      // ✅ IMPORTANT FIX (your logic)
      let match =
        scholasticMarks.find(
          (m) => m.subjectName?.toUpperCase() === lookupName
        );
      // 👉 If UI subject is COMPUTER but not found → try IT
      if (!match && lookupName === "COMPUTER") {
        match = scholasticMarks.find(
          (m) => m.subjectName?.toUpperCase() === "IT"
        );
      }

      return match || {};
    };

  const getCoScholasticGrade = (areaName, term) => {
    const mark = coMarks.find(
      (c) => c.areaName === areaName && c.term === term
    );
    return mark ? mark.grade || "" : "";
  };

  // ✅ FIX: Exclude optional subjects from totals
  const excludedSubjects = ["G.K", "COMPUTER", "MORAL SCIENCE", "IT"];

  const totalMarksT1 = scholasticMarks
    .filter(m => !excludedSubjects.includes(m.subjectName?.toUpperCase()))
    .reduce(
      (sum, m) => sum + (m.marksObtainedT1 || 0),
      0
    );

  const totalMarksT2 = scholasticMarks
    .filter(m => !excludedSubjects.includes(m.subjectName?.toUpperCase()))
    .reduce(
      (sum, m) => sum + (m.marksObtainedT2 || 0),
      0
    );

  const overallMarksTotal = scholasticMarks
    .filter(m => !excludedSubjects.includes(m.subjectName?.toUpperCase()))
    .reduce(
      (sum, m) => sum + (m.total || 0),
      0
    );

  return (
    <div className="template2-report-card">
         {/* ===== SCHOOL HEADER (SAME AS TEMPLATE 1) ===== */}
                  <div className="school-title">
                    <img src={AryaVidyaMandirLogo} alt="School Logo" className="school-logo" />
                    <span>ARYA VIDYA MANDIR SR. SEC SCHOOL</span>
                  </div>

                  <div className="school-subtitle">
                     Milk Plant Road, Ballabgarh, Faridabad &nbsp;|&nbsp; Ph. No: <span className="num">2247066</span><br />
                     Affiliation No: <span className="num">530888</span> &nbsp;|&nbsp; Affiliated to CBSE
                  </div>

      {/* === COMPACT STUDENT INFO GRID (Copied from Template1) === */}
      <div className="student-info-grid">
        <div><span>Name:</span> <b>{student.firstName} {student.lastName}</b></div>
        <div><span>Roll No:</span> <b>{student.rollNumber}</b></div>
        <div><span>Class & Section:</span> <b>{student.classEntity?.name} - {student.section?.name}</b></div>
        <div><span>SRN:</span> <b>{student.srn}</b></div>
        <div><span>Admission No:</span> <b>{student.admissionNo}</b></div>
        <div><span>Father&apos;s Name:</span> <b>{student.fatherName}</b></div>
        <div><span>Mother&apos;s Name:</span> <b>{student.motherName}</b></div>
        <div><span>Academic Year:</span> <b>{academicYear}</b></div>
      </div>

      {/* === SCHOLASTIC TABLE === */}
      <div className="table-wrapper">
        <table className="scholastic-table2">
          <thead>
            <tr>
              <th rowSpan="2" className="subject-head">SUBJECTS</th>
              <th colSpan="6" className="term-header term1">Term-I (100 Marks)</th>
              <th colSpan="6" className="term-header term2">Term-II (100 Marks)</th>
              <th colSpan="2" className="overall-head">Overall (Term-I + Term-II) / 2</th>
            </tr>
            <tr>
              <th>PT-I<br/>(10)</th>
              <th>Note Book<br/>(5)</th>
              <th>Sub Enrich.<br/>(5)</th>
              <th>Half Yearly Exam<br/>(80)</th>
              <th>Marks Obtained<br/>(100)</th>
              <th>Grade</th>

              <th>PT-II<br/>(10)</th>
              <th>Note Book<br/>(5)</th>
              <th>Sub Enrich.<br/>(5)</th>
              <th>Annual Exam<br/>(80)</th>
              <th>Marks Obtained<br/>(100)</th>
              <th>Grade</th>

              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => {
              const subMarks = getSubjectMarks(subject);
              const isOptional = subject.toLowerCase().includes("optional");
              if (isOptional) {
                return (
                  <tr key={i}>
                    <td className="subject-name" colSpan="15">{subject}</td>
                  </tr>
                );
              }
              return (
                <tr key={i}>
                  <td className="subject-name">{subject}</td>
                  <td>{formatMarks(subMarks.pt1)}</td>
                  <td>{formatMarks(subMarks.noteBookT1)}</td>
                  <td>{formatMarks(subMarks.subEnrichmentT1)}</td>
                  <td>{formatMarks(subMarks.term1Marks)}</td>
                  <td>{formatMarks(subMarks.marksObtainedT1)}</td>
                  <td>{subMarks.gradeT1 || ""}</td>
                  <td>{formatMarks(subMarks.pt2)}</td>
                  <td>{formatMarks(subMarks.noteBookT2)}</td>
                  <td>{formatMarks(subMarks.subEnrichmentT2)}</td>
                  <td>{formatMarks(subMarks.term2Marks)}</td>
                  <td>{formatMarks(subMarks.marksObtainedT2)}</td>
                  <td>{subMarks.gradeT2 || ""}</td>
                  <td>{formatMarks(subMarks.total)/2}</td>
                  <td>{subMarks.overallGrade || ""}</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td className="subject-name">Grand Total</td>
              <td colSpan="4"></td>
              <td>{formatMarks(totalMarksT1)}</td>
              <td></td>
              <td colSpan="4"></td>
              <td>{formatMarks(totalMarksT2)}</td>
              <td></td>
              <td>{formatMarks(overallMarksTotal)/2}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* === CO-SCHOLASTIC, DISCIPLINE, REMARKS & SIGNATURES === */}
      <table className="coscholastic-table">
        <thead>
          <tr>
            <th colSpan="2" className="main-title">Co-Scholastic Areas: Term-1 [A-C]</th>
            <th colSpan="2" className="main-title">Co-Scholastic Areas: Term-2 [A-C]</th>
          </tr>
        </thead>
        <tbody>
          {["Art Education", "Work Education", "Health & Physical Education"].map((area, i) => (
            <tr key={i}>
              <td>{area}</td>
              <td className="grade-cell">{getCoScholasticGrade(area, 1)}</td>
              <td>{area}</td>
              <td className="grade-cell">{getCoScholasticGrade(area, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom-section">
        <table className="discipline-table">
          <thead>
            <tr>
              <th colSpan="3" className="main-title">DISCIPLINE (3-POINT GRADING SCALE A, B, C)</th>
            </tr>
            <tr>
              <th>Element</th>
              <th>T1</th>
              <th>T2</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Regularity & Punctuality",
              "Sincerity",
              "Behaviour & Values",
              "Respectfulness for Rules & Regulation",
              "Attitude towards Teachers",
              "Attitude towards School-Mates"
            ].map((elem, i) => (
              <tr key={i}>
                <td>{elem}</td>
                <td>{getCoScholasticGrade(elem, 1)}</td>
                <td>{getCoScholasticGrade(elem, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="remarks-box-group">
          <div><span>Class Teacher’s Remarks:</span><span className="line">{teacherRemarks || ""}</span></div>
          <div><span>Total Attendance:</span><span className="line short">{student.totalAttendance || ""}</span></div>
          <div><span>Result:</span><span className="line short">{student.result || ""}</span></div>
          <div><span>Percentage:</span><span className="line short">{totalPercentage || ""}</span></div>
          <div><span>Rank:</span><span className="line short">{rank || ""}</span></div>
        </div>
      </div>

      <div className="signature-fields">
        <div> Class Incharge </div>
        <div> Checker </div>
        <div> Exam Incharge</div>
        <div> Principal</div>
      </div>
    </div>
  );
}

export default ReportCardTemplate2;
