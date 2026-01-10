import React from "react";
import AryaVidyaMandirLogo from "./AryaVidyaMandirLogo.png";
import "./Template3.css";

function ReportCardTemplate3({
  student,
  marks,
  totalPercentage,
  rank,
  academicYear,
  stream: streamProp
}) {

    debugger;
  const scholasticMarks = marks || [];

  const getSubjectMarks = (subjectName) =>
    scholasticMarks.find(
      (m) => m.subjectName?.toUpperCase() === subjectName.toUpperCase()
    ) || {};

  // stream resolution
const getStudentStream = (student) => {
  const raw =
    student?.stream?.name?.toString().toLowerCase() || "";

  if (raw.includes("non") && raw.includes("medical")) return "NON-MEDICAL";
  if (raw.includes("medical")) return "MEDICAL";
  if (raw.includes("commerce")) return "COMMERCE";
  // fallback (safe default)
};

  const stream = getStudentStream(student);


  // subject sets
  const getCoreSubjectsForStream = () => {
    if (stream === "NON-MEDICAL") {
      return ["ENGLISH", "MATHEMATICS", "PHYSICS", "CHEMISTRY"];
    }
    if (stream === "COMMERCE") {
      return ["ENGLISH", "BUSINESS STUDIES", "ACCOUNTANCY", "ECONOMICS"];
    }
    // MEDICAL
    return ["ENGLISH", "PHYSICS", "CHEMISTRY", "BIOLOGY"];
  };

  const getOptionalSubjectsForStream = () => {
  if (stream === "NON-MEDICAL") {
    return ["PHY. EDU.", "COMP. SCIENCE"];
  }

    // MEDICAL & COMMERCE
    return ["MATHEMATICS", "PHY. EDU.", "COMP. SCIENCE"];
  };

  const optionalSubjects = getOptionalSubjectsForStream();


  const coreSubjects = getCoreSubjectsForStream();
  const allSubjects = [...coreSubjects, ...optionalSubjects];

  // totals based on final Total Marks (100)
  const grandTotal = allSubjects.reduce((sum, sub) => {
    const m = getSubjectMarks(sub);
    const total =
      m.totalMarks100 ??
      ((m.convTheory || 0) + (m.convPractical || 0) + (m.convOther || 0));
    return sum + (total || 0);
  }, 0);

  const maxTotal = allSubjects.length * 100;
  const computedPercentage = maxTotal
    ? ((grandTotal / maxTotal) * 100).toFixed(2)
    : "";

  const finalPercentage = totalPercentage || computedPercentage;

  const renderSubjectRow = (sub, keyPrefix) => {
    const m = getSubjectMarks(sub);

    const totalMarks100 =
      m.totalMarks100 ??
      ((m.convTheory || 0) + (m.convPractical || 0) + (m.convOther || 0));

    return (
      <tr key={keyPrefix + sub}>
        <td className="subject-name">{sub}</td>

        {/* Actual marks */}
        <td>{m.pt1Actual || ""}</td>
        <td>{m.pt2Actual || ""}</td>
        <td>{m.halfYearlyActual || ""}</td>
        <td>{m.preBoard1Actual || ""}</td>
        <td>{m.preBoard2Actual || ""}</td>
        <td>{m.practicalProjectAslActual || ""}</td>

        {/* Converted marks (only 4) */}
        <td>{m.convPt1 || ""}</td>
        <td>{m.convPt2 || ""}</td>
        <td>{m.convHalfYearly || ""}</td>
        <td>{m.convPreboardBest || ""}</td>

        {/* Final breakup on far right */}
        <td>{m.convTheory || ""}</td>
        <td>{m.convPractical || ""}</td>
        <td>{totalMarks100 || ""}</td>
      </tr>
    );
  };

  return (
    <div className="template3-report-card">
      {/* ===== SCHOOL HEADER (SAME AS TEMPLATE 1) ===== */}
            <div className="school-title">
              <img src={AryaVidyaMandirLogo} alt="School Logo" className="school-logo" />
              <span>ARYA VIDYA MANDIR SR. SEC SCHOOL</span>
            </div>

            <div className="school-subtitle">
              Milk Plant Road, Ballabgarh, Faridabad &nbsp;|&nbsp; Ph. No: 2247066
              <br />
              Affiliation No: 53088 &nbsp;|&nbsp; Affiliated to CBSE
            </div>

      <div className="school-subtitle">
        Academic Performance Report – Class XII (
        {stream.split("_").join(" ")} Stream)
      </div>

      {/* STUDENT INFO */}
      <div className="student-info-grid">
        <div>
          <span>Name:</span>{" "}
          <b>
            {student?.firstName} {student?.lastName}
          </b>
        </div>
        <div>
          <span>Roll No:</span> <b>{student?.rollNumber}</b>
        </div>
        <div>
          <span>Class:</span>{" "}
          <b>
            {student?.classEntity?.name} - {student?.section?.name}
          </b>
        </div>
        <div>
          <span>SRN:</span> <b>{student?.srn}</b>
        </div>
        <div>
          <span>Admission No:</span> <b>{student?.admissionNo}</b>
        </div>
        <div>
          <span>Father Name:</span> <b>{student?.fatherName}</b>
        </div>
        <div>
          <span>Mother Name:</span> <b>{student?.motherName}</b>
        </div>
        <div>
          <span>Academic Year:</span> <b>{academicYear}</b>
        </div>
      </div>

      {/* MARKS TABLE */}
      <div className="table-wrapper">
        <table className="template3-table">
          <thead>
            <tr>
              <th rowSpan="3" className="main-title subject-col">
                Subject Name
              </th>

              {/* Actual Marks block */}
              <th colSpan="6" className="main-title">
                Actual Marks
              </th>

              {/* Converted Marks block */}
              <th colSpan="4" className="main-title">
                Converted Marks
              </th>

              {/* Final columns have their own titles, not grouped */}
              <th rowSpan="2" className="main-title">
                Theory
              </th>
              <th rowSpan="2" className="main-title">
                Project / Practical / ASL
              </th>
              <th rowSpan="2" className="main-title">
                Total Marks
              </th>
            </tr>
            <tr>
              {/* Actual columns */}
              <th>PT‑I</th>
              <th>PT‑II</th>
              <th>Half Yearly Exam</th>
              <th>Pre Board‑1</th>
              <th>Pre Board‑2</th>
              <th>Project / Practical / ASL</th>

              {/* Converted columns */}
              <th>PT‑I</th>
              <th>PT‑II</th>
              <th>Half Yearly Exam</th>
              <th>Best of PB‑1 &amp; PB‑2</th>
            </tr>
            <tr>
              {/* Maximum marks row */}
              <th>30</th>
              <th>30</th>
              <th>70 / 80</th>
              <th>70 / 80</th>
              <th>70 / 80</th>
              <th>30 / 20</th>

              <th>5</th>
              <th>5</th>
              <th>20</th>
              <th>50 / 40</th>

              {/* Max for theory / practical / total */}
              <th>80 / 70</th>
              <th>20 / 30</th>
              <th>100</th>
            </tr>
          </thead>
          <tbody>
            {/* CORE SUBJECTS */}
            {coreSubjects.map((sub) => renderSubjectRow(sub, "core-"))}

            {/* OPTIONAL LABEL ROW */}
            <tr className="optional-row">
              <td className="subject-name optional-title">OPTIONAL</td>
              <td colSpan="12"></td>
            </tr>

            {/* OPTIONAL SUBJECTS */}
            {optionalSubjects.map((sub) => renderSubjectRow(sub, "opt-"))}

            {/* GRAND TOTAL */}
            <tr className="total-row">
              <td className="subject-name">Grand Total</td>
              <td colSpan="12"></td>
              <td>{grandTotal || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ATTENDANCE / RESULT / REMARKS */}
      <div className="footer-grid">
        <div className="attendance-block">
          <div className="block-title">Attendance</div>
          <div>
            <span>Total Working Days:</span>
            <span className="value-line">
              {student?.totalWorkingDays || ""}
            </span>
          </div>
          <div>
            <span>Total Attendance:</span>
            <span className="value-line">
              {student?.totalAttendance || ""}
            </span>
          </div>
          <div>
            <span>Percentage:</span>
            <span className="value-line">
              {student?.attendancePercentage || ""}
            </span>
          </div>
        </div>

        <div className="result-block">
          <div className="block-title">Result Summary</div>
          <div>
            <span>Rank in Class:</span>
            <span className="value-line">{rank || ""}</span>
          </div>
          <div>
            <span>Percentage:</span>
            <span className="value-line">{finalPercentage || ""}</span>
          </div>
          <div>
            <span>Result:</span>
            <span className="value-line">{student?.result || ""}</span>
          </div>
        </div>

        <div className="remarks-block">
          <div className="block-title">Remarks</div>
          <div className="remarks-area">
            {student?.remarks || ""}
          </div>
        </div>
      </div>
      <br/>
      <br/>
      {/* SIGNATURES */}
      <div className="signature-fields">
        <div>Class Incharge</div>
        <div>Checker</div>
        <div>Exam Incharge</div>
        <div>Principal</div>
      </div>
    </div>
  );
}

export default ReportCardTemplate3;
