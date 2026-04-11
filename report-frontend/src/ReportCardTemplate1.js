import React from "react";
import AryaVidyaMandirLogo from "./AryaVidyaMandirLogo.png";
import "./Template1.css";

function ReportCardTemplate1({
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

     const getSubjectMarks = (subjectName) => {
       let lookupName = subjectName?.toUpperCase();

        if (lookupName === "SOCIAL SCIENCE") {
          lookupName = "SST";
        }
        if (lookupName === "SCIENCE / EVS") {
          lookupName = "SCIENCE";
        }

       return (
         scholasticMarks.find(
           (m) => m.subjectName?.toUpperCase() === lookupName
         ) || {}
       );
     };

  const getCoScholasticGrade = (areaName, term) => {
    const mark = coMarks.find(
      (c) => c.areaName === areaName && c.term === term
    );
    return mark ? mark.grade || "" : "";
  };

  const totalMarksT1 = scholasticMarks.reduce(
      (sum, m) => sum + (m.marksObtainedT1 || 0),
      0
    );
    const totalMarksT2 = scholasticMarks.reduce(
      (sum, m) => sum + (m.marksObtainedT2 || 0),
      0
    );
    const overallMarksTotal = totalMarksT1 + totalMarksT2;

    // Format them all with 2 decimal places for display
    const formattedTotalT1 = formatMarks(totalMarksT1);
    const formattedTotalT2 = formatMarks(totalMarksT2);
    const formattedOverall = formatMarks(overallMarksTotal);

  return (
    <div className="template1-report-card">
      {/* === SCHOOL HEADER === */}
        <div className="school-title">
            <img src={AryaVidyaMandirLogo} alt="School Logo" className="school-logo" />
            <span>ARYA VIDYA MANDIR SR. SEC SCHOOL</span>
        </div>

        <div className="school-subtitle">
            Milk Plant Road, Ballabgarh, Faridabad &nbsp;|&nbsp; Ph. No: <span className="num">2247066</span><br />
            Affiliation No: <span className="num">530888</span> &nbsp;|&nbsp; Affiliated to CBSE
        </div>


      {/* === STUDENT INFO === */}
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
        <table className="scholastic-table">
          <thead>
            <tr>
              <th rowSpan="2" className="main-title scholastic-header">
                <div className="scholastic-header-wrapper">
                  <div className="main-head">Scholastic Areas</div>
                  <div className="sub-head">Subject Name </div>
                </div>
              </th>
              <th colSpan="6" className="term-header term1">Term-1 (50 Marks)</th>
              <th colSpan="6" className="term-header term2">Term-2 (50 Marks)</th>
              <th rowSpan="2" className="main-title">GRAND TOTAL (T1+T2)</th>
              <th rowSpan="2" className="main-title">Overall Grade</th>
            </tr>
            <tr>
              <th>PT1<br />(10)</th>
              <th>Note Book<br />(05)</th>
              <th>Sub. Enrichment<br />(05)</th>
              <th>Term-1<br />(30)</th>
              <th>Marks Obt.<br />(50)</th>
              <th>Grade</th>
              <th>PT2<br />(10)</th>
              <th>Note Book<br />(05)</th>
              <th>Sub. Enrichment<br />(05)</th>
              <th>Term-2<br />(30)</th>
              <th>Marks Obt.<br />(50)</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {[
              "ENGLISH",
              "HINDI",
              "MATHEMATICS",
              "SCIENCE / EVS",
              "SOCIAL SCIENCE",
              "G.K.",
              "COMPUTER",
              "MORAL SCIENCE"
            ].map((subject, i) => {
              const subMarks = getSubjectMarks(subject);

              const coAreaMap = {
                "G.K.": "GK",
                "COMPUTER": "Computer",
                "MORAL SCIENCE": "Moral_Science"
              };

              const mappedArea = coAreaMap[subject];
              const gradeT1 = mappedArea
                ? getCoScholasticGrade(mappedArea, 1)
                : subMarks.gradeT1 || "";

              const gradeT2 = mappedArea
                ? getCoScholasticGrade(mappedArea, 2)
                : subMarks.gradeT2 || "";

              // Round marks for display only
              const totalMarks = subMarks.total !== undefined ? Math.round(subMarks.total) : "";

              return (
                <tr key={i}>
                  <td className="subject-name">{subject}</td>
                  <td>{formatMarks(subMarks.pt1)}</td>
                  <td>{formatMarks(subMarks.noteBookT1)}</td>
                  <td>{formatMarks(subMarks.subEnrichmentT1)}</td>
                  <td>{formatMarks(subMarks.term1Marks)}</td>
                  <td>{formatMarks(subMarks.marksObtainedT1)}</td>
                  <td>{gradeT1}</td>
                  <td>{formatMarks(subMarks.pt2)}</td>
                  <td>{formatMarks(subMarks.noteBookT2)}</td>
                  <td>{formatMarks(subMarks.subEnrichmentT2)}</td>
                  <td>{formatMarks(subMarks.term2Marks)}</td>
                  <td>{formatMarks(subMarks.marksObtainedT2)}</td>
                  <td>{gradeT2}</td>
                  <td>{formatMarks(totalMarks)}</td>
                  <td>{subMarks.overallGrade || ""}</td>
                </tr>
              );
            })}
                        <tr className="total-row">
                          <td className="subject-name">Total</td>
                          <td colSpan="4"></td>
                          <td>{formattedTotalT1}</td>
                          <td></td>
                          <td colSpan="4"></td>
                          <td>{formattedTotalT2}</td>
                          <td></td>
                          <td>{formattedOverall}</td>
                          <td></td>
                        </tr>
          </tbody>
        </table>
      </div>

      {/* === CO-SCHOLASTIC TABLE === */}
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

      {/* === DISCIPLINE SECTION === */}
      <div className="bottom-section">
        <table className="discipline-table">
          <thead>
            <tr>
              <th colSpan="3" className="main-title">DISCIPLINE (3 POINT GRADING SCALE A, B, C)</th>
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
              "Attitude Towards Teachers",
              "Attitude Towards School-Mates"
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

      <br/>
      {/* === SIGNATURES === */}
      <div className="signature-fields">

        <div>Signature of Class Teacher</div>
        <div>Signature of Parents</div>
        <div>Signature of Primary In-charge</div>
        <div>Signature of Principal</div>
      </div>
    </div>
  );
}

export default ReportCardTemplate1;
