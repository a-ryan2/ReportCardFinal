import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Dropdown from './Dropdown';

import {
  fetchClasses,
  fetchSections,
  fetchStudents,
  fetchMarksByStudentForReportCard,
  fetchMarksByStudentForSeniorReportCard,
  fetchCoScholasticMarksByStudentTermForReportCard,
  fetchTerms,
  fetchHistoricalStudentsFromMarks,
  fetchReportCardByStudent

} from './Api';
import ReportCardTemplate1 from './ReportCardTemplate1';
import ReportCardTemplate2 from './ReportCardTemplate2';
import ReportCardTemplate3 from './ReportCardTemplate3';
import ReportCardTemplate4 from './ReportCardTemplate4';
import './style.css';
import './Template1.css';

// Utility to extract class number from class name like 'Class 10' or '10'
const extractClassNumber = (className) => {

  if (!className) return 0;

  const match =
    String(className).match(/\d+/);

  return match
    ? parseInt(match[0], 10)
    : 0;
};

export default function ReportCard() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [coScholastic, setCoScholastic] = useState([]);
  const [teacherRemarks, setTeacherRemarks] = useState("");

  const [totalPercentage, setTotalPercentage] = useState("");
  const [result, setResult] = useState("");

  const [rank, setRank] = useState(null);

  const [academicYear, setAcademicYear] = useState('');

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showReport, setShowReport] = useState(false);

  const reportRef = useRef();

  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchSections().then(setSections);
  }, []);

useEffect(() => {

  async function loadStudents() {

    if (!classId || !sectionId || !academicYear) {
      setStudents([]);
      return;
    }

    try {

      // FIRST try current student table
      const currentStudents = await fetchStudents(
        classId,
        sectionId,
        academicYear
      );

      let finalStudents = [];

      if (currentStudents && currentStudents.length > 0) {

        finalStudents = currentStudents;

      } else {

        // FALLBACK to historical students from marks table
        const historicalData =
          await fetchHistoricalStudentsFromMarks(
            classId,
            sectionId,
            academicYear
          );

        // Extract unique students safely
        const uniqueStudentsMap = {};

        historicalData.forEach(item => {

          // Handles both cases:
          // 1. direct student object
          // 2. mark object containing student

          const student = item.student || item;

          if (student?.id) {
            uniqueStudentsMap[student.id] = student;
          }
        });

        finalStudents =
          Object.values(uniqueStudentsMap);
      }

      // Sort by roll number
      finalStudents.sort(
        (a, b) =>
          (a.rollNumber || 0) -
          (b.rollNumber || 0)
      );

      setStudents(finalStudents);

    } catch (err) {

      console.error(err);

      setStudents([]);
    }
  }

  loadStudents();

}, [classId, sectionId, academicYear]);

  const selectedClass =
    classes.find(
      c => c.id === classId || c.id === parseInt(classId)
    );

  const selectedSection =
    sections.find(
      s => s.id === sectionId || s.id === parseInt(sectionId)
    );

  const selectedStudent =
    students.find(
      s => s.id === studentId || s.id === parseInt(studentId)
    );

const studentClassName =
  selectedClass?.name || '';

const classNumber =
  extractClassNumber(studentClassName);

  const generateReport = async () => {

    if (
      !classId ||
      !sectionId ||
      !studentId ||
      !academicYear
    ) {

      alert(
        'Please select Class, Section, Academic Year, and Student.'
      );

      return;
    }

    // ✅ Fetch scholastic marks using academic year

    let marksData;

    if (
      classNumber === 10 ||
      classNumber === 11 ||
      classNumber === 12
    ) {

      marksData =
        await fetchMarksByStudentForSeniorReportCard(
          studentId,
          academicYear
        );

    } else {

      marksData =
        await fetchMarksByStudentForReportCard(
          studentId,
          classNumber,
          academicYear
        );
    }

    setMarks(marksData || []);

    // ✅ Fetch report card
    const reportCard =
      await fetchReportCardByStudent(studentId);

    setRank(reportCard?.rank || null);

    setAcademicYear(academicYear);

    // Calculate total marks obtained for core subjects only

    const calculateTotalPercentage = ({
        student,
        marks = [],
        templateNumber
      }) => {

        const classNo = parseInt(student?.className);

          // =========================================================
          // HELPERS
          // =========================================================

          const normalize = (name = "") =>
            name.toUpperCase().trim();

          const getTotalMarks = (m) => {
            return (
              m.totalMarks100 ??
              m.total ??
              ((m.convTheory || 0) +
                (m.convPractical || 0) +
                (m.convOther || 0))
            );
          };

          const getStudentStream = () => {
            const raw =
              student?.stream?.name?.toString().toLowerCase() || "";

            if (raw.includes("non") && raw.includes("medical")) {
              return "NON-MEDICAL";
            }

            if (raw.includes("medical")) {
              return "MEDICAL";
            }

            if (raw.includes("commerce")) {
              return "COMMERCE";
            }

            return "";
          };

          const stream = getStudentStream();

          // =========================================================
          // TEMPLATE 1
          // ALL SUBJECTS INCLUDED
          // =========================================================

          if (templateNumber === 1) {

            const total = marks.reduce(
              (sum, m) => sum + getTotalMarks(m),
              0
            );

            const maxTotal = marks.length * 100;

            return maxTotal
              ? ((total / maxTotal) * 100).toFixed(2)
              : "0.00";
          }

          // =========================================================
          // TEMPLATE 2
          // EXCLUDE OPTIONAL / CO-SCHOLASTIC SUBJECTS
          // Used for class 9 also
          // =========================================================

          if (templateNumber === 2) {

            const excludedSubjects = [
              "G.K",
              "GK",
              "COMPUTER",
              "IT",
              "MORAL SCIENCE",
              "OPTIONAL SUB"
            ];

            const filteredMarks = marks.filter(
              (m) =>
                !excludedSubjects.includes(
                  normalize(m.subjectName)
                )
            );

            // IMPORTANT:
            // total in template2 is T1 + T2 (out of 200)
            // so divide by 2 to convert into final marks out of 100

            const total = filteredMarks.reduce(
              (sum, m) =>
                sum + ((getTotalMarks(m) || 0) / 2),
              0
            );

            const maxTotal = filteredMarks.length * 100;

            return maxTotal
              ? ((total / maxTotal) * 100).toFixed(2)
              : "0.00";
          }

          // =========================================================
          // TEMPLATE 3 & 4
          // CLASSES 10 / 11 / 12
          // =========================================================

          if (templateNumber === 3 || templateNumber === 4) {

            // -------------------------------------------------------
            // CLASS 10
            // -------------------------------------------------------

            if (classNo === 10) {

              const coreSubjects = [
                "ENGLISH",
                "HINDI",
                "MATHEMATICS",
                "SCIENCE",
                "SST"
              ];

              const coreMarks = marks.filter((m) =>
                coreSubjects.includes(normalize(m.subjectName))
              );

              const total = coreMarks.reduce(
                (sum, m) => sum + getTotalMarks(m),
                0
              );

              const maxTotal = 500;

              return ((total / maxTotal) * 100).toFixed(2);
            }

            // -------------------------------------------------------
            // CLASSES 11 & 12
            // -------------------------------------------------------

            let coreSubjects = [];
            let optionalSubjects = [];

            // NON MEDICAL
            if (stream === "NON-MEDICAL") {

              coreSubjects = [
                "ENGLISH",
                "MATHEMATICS",
                "PHYSICS",
                "CHEMISTRY"
              ];

              optionalSubjects = [
                "PHY. EDU.",
                "PHYSICAL EDUCATION",
                "COMP. SCIENCE",
                "COMPUTER SCIENCE"
              ];
            }

            // COMMERCE
            else if (stream === "COMMERCE") {

              coreSubjects = [
                "ENGLISH",
                "BUSINESS STUDIES",
                "ACCOUNTANCY",
                "ECONOMICS"
              ];

              optionalSubjects = [
                "MATHEMATICS",
                "PHY. EDU.",
                "PHYSICAL EDUCATION",
                "COMP. SCIENCE",
                "COMPUTER SCIENCE"
              ];
            }

            // MEDICAL
            else {

              coreSubjects = [
                "ENGLISH",
                "PHYSICS",
                "CHEMISTRY",
                "BIOLOGY"
              ];

              optionalSubjects = [
                "MATHEMATICS",
                "PHY. EDU.",
                "PHYSICAL EDUCATION",
                "COMP. SCIENCE",
                "COMPUTER SCIENCE"
              ];
            }

            // -------------------------------------------------------
            // GET CORE SUBJECT MARKS
            // -------------------------------------------------------

            const coreMarks = marks.filter((m) =>
              coreSubjects.includes(normalize(m.subjectName))
            );

            // -------------------------------------------------------
            // GET OPTIONAL SUBJECT MARKS
            // -------------------------------------------------------

            const optionalMarks = marks.filter((m) =>
              optionalSubjects.includes(normalize(m.subjectName))
            );

            // -------------------------------------------------------
            // TOTAL OF CORE SUBJECTS
            // -------------------------------------------------------

            let total = coreMarks.reduce(
              (sum, m) => sum + getTotalMarks(m),
              0
            );

            let subjectCount = coreMarks.length;

            // -------------------------------------------------------
            // IF ONLY 4 CORE SUBJECTS
            // ADD HIGHEST OPTIONAL SUBJECT
            // -------------------------------------------------------

            if (subjectCount === 4 && optionalMarks.length > 0) {

              const highestOptional = Math.max(
                ...optionalMarks.map((m) => getTotalMarks(m))
              );

              total += highestOptional;

              subjectCount += 1;
            }

            const maxTotal = subjectCount * 100;

            return maxTotal
              ? ((total / maxTotal) * 100).toFixed(2)
              : "0.00";
          }

          // =========================================================
          // FALLBACK
          // =========================================================

          return "0.00";
        };

    const totalPercentage = calculateTotalPercentage({
      student: {
        ...selectedStudent,
        className: selectedClass?.name || ""
      },
      marks: marksData || [],
      templateNumber:
        getTemplate() === "template1"
          ? 1
          : getTemplate() === "template2"
          ? 2
          : getTemplate() === "template3"
          ? 3
          : 4
    });

    setTotalPercentage(totalPercentage);

    const calculateResult = ({
      student,
      marks = [],
      templateNumber
    }) => {

      const classNo = parseInt(student?.className);

      const normalize = (name = "") =>
        name.toUpperCase().trim();

      const getTotalMarks = (m) => {
        return (
          m.totalMarks100 ??
          m.total ??
          ((m.convTheory || 0) +
            (m.convPractical || 0) +
            (m.convOther || 0))
        );
      };

      const getStudentStream = () => {
        const raw =
          student?.stream?.name?.toString().toLowerCase() || "";

        if (raw.includes("non") && raw.includes("medical")) {
          return "NON-MEDICAL";
        }

        if (raw.includes("medical")) {
          return "MEDICAL";
        }

        if (raw.includes("commerce")) {
          return "COMMERCE";
        }

        return "";
      };

      const stream = getStudentStream();

      let coreSubjects = [];

      // TEMPLATE 1
      if (templateNumber === 1) {

        coreSubjects = [
          "ENGLISH",
          "HINDI",
          "MATHEMATICS",
          "SCIENCE",
          "SST"
        ];
      }

      // TEMPLATE 2
      else if (templateNumber === 2) {

        coreSubjects = [
          "ENGLISH",
          "HINDI",
          "MATHEMATICS",
          "SCIENCE",
          "SST",
          "SANSKRIT"
        ];
      }

      // CLASS 10
      else if (classNo === 10) {

        coreSubjects = [
          "ENGLISH",
          "HINDI",
          "MATHEMATICS",
          "SCIENCE",
          "SST"
        ];
      }

      // CLASS 11/12
      else {

        if (stream === "NON-MEDICAL") {

          coreSubjects = [
            "ENGLISH",
            "MATHEMATICS",
            "PHYSICS",
            "CHEMISTRY"
          ];

        } else if (stream === "COMMERCE") {

          coreSubjects = [
            "ENGLISH",
            "BUSINESS STUDIES",
            "ACCOUNTANCY",
            "ECONOMICS"
          ];

        } else {

          coreSubjects = [
            "ENGLISH",
            "PHYSICS",
            "CHEMISTRY",
            "BIOLOGY"
          ];
        }
      }

      // CHECK EVERY CORE SUBJECT
      const failed = coreSubjects.some((subject) => {

        const mark = marks.find(
          (m) => normalize(m.subjectName) === subject
        );

        if (!mark) return true;

        let obtained = getTotalMarks(mark);

        // Template2 totals are out of 200
        if (templateNumber === 2) {
          obtained = obtained / 2;
        }

        const percentage = (obtained / 100) * 100;

        return percentage < 33;
      });

      return failed ? "" : "PASS";
    };

    const result = calculateResult({
      student: {
        ...selectedStudent,
        className: selectedClass?.name || ""
      },
      marks: marksData || [],
      templateNumber:
        getTemplate() === "template1"
          ? 1
          : getTemplate() === "template2"
          ? 2
          : getTemplate() === "template3"
          ? 3
          : 4
    });

    setResult(result);

    // ✅ Fetch co-scholastic using academic year

    const terms = await fetchTerms();

    const coScholasticData = [];

    let remarksValue = "";

    for (const term of terms) {

      const data =
        await fetchCoScholasticMarksByStudentTermForReportCard(
          studentId,
          term.id,
          academicYear
        );

      if (!data) continue;

      const termGrades = [

        {
          areaName: "Art Education",
          grade: data.artEducation,
          term: term.id
        },

        {
          areaName: "Work Education",
          grade: data.workEducation,
          term: term.id
        },

        {
          areaName: "Health & Physical Education",
          grade: data.healthPhysicalEducation,
          term: term.id
        },

        {
          areaName: "GK",
          grade: data.gk,
          term: term.id
        },

        {
          areaName: "Computer",
          grade: data.computer,
          term: term.id
        },

        {
          areaName: "Moral_Science",
          grade: data.moralScience,
          term: term.id
        },

        {
          areaName: "Regularity & Punctuality",
          grade:
            data.discipline.regularityPunctuality,
          term: term.id
        },

        {
          areaName: "Sincerity",
          grade: data.discipline.sincerity,
          term: term.id
        },

        {
          areaName: "Behaviour & Values",
          grade:
            data.discipline.behaviourValues,
          term: term.id
        },

        {
          areaName:
            "Respectfulness for Rules & Regulation",
          grade:
            data.discipline
              .respectfulnessRules,
          term: term.id
        },

        {
          areaName:
            "Attitude towards Teachers",
          grade:
            data.discipline
              .attitudeTeachers,
          term: term.id
        },

        {
          areaName:
            "Attitude towards School-Mates",
          grade:
            data.discipline
              .attitudeClassmates,
          term: term.id
        }
      ];

      coScholasticData.push(...termGrades);

      if (!remarksValue) {

        remarksValue =
          data?.remarks || "";
      }
    }

    setCoScholastic(coScholasticData);

    setTeacherRemarks(remarksValue);



    setShowReport(true);
  };

  const printReport = () => {

    if (!reportRef.current) return;

    html2canvas(
      reportRef.current,
      { scale: 2 }
    ).then(canvas => {

      const imgData =
        canvas.toDataURL('image/png');

      const printWindow =
        window.open(
          '',
          '_blank',
          'width=900,height=700'
        );

      if (!printWindow) return;

      printWindow.document.write(`

        <html>

          <head>

            <title>Print Report Card</title>

            <style>

              body {
                margin: 0;
                padding: 0;
                text-align: center;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              img {
                max-width: 100%;
                height: auto;
                page-break-after: avoid;
              }

              @page {
                size: A4 landscape;
                margin: 10mm;
              }

            </style>

          </head>

          <body>

            <img
              src="${imgData}"
              alt="Report Card Snapshot"
            />

          </body>

        </html>

      `);

      printWindow.document.close();

      printWindow.onload = () => {

        printWindow.focus();

        setTimeout(() => {

          printWindow.print();

          printWindow.close();

        }, 300);
      };

    }).catch(err => {

      alert(
        'Error generating print preview: ' +
        err.message
      );
    });
  };

  const goBack = () => setShowReport(false);

  const getTemplate = () => {

    if (
      classNumber >= 1 &&
      classNumber <= 4
    ) return 'template1';

    if (
      classNumber >= 5 &&
      classNumber <= 9
    ) return 'template2';

    if (
      classNumber == 10 ||
      classNumber == 12
    ) return 'template3';

    if (classNumber == 11)
      return 'template4';

    return 'templateDefault';
  };

  const templateProps = {

    student: selectedStudent ? {

      ...selectedStudent,

      result: result,

      className:
        selectedClass?.name || '',

      sectionName:
        selectedSection?.name || ''

    } : {},

    marks: marks || [],

    coScholastic:
      coScholastic || [],

    teacherRemarks:
      teacherRemarks,

    totalPercentage:
      totalPercentage,

    rank: rank,

    academicYear:
      academicYear
  };

  return (

    <div className="container">

      <h2>
        Report Card Generation
      </h2>

      {!showReport ? (

        <>

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
            onChange={(e) =>
              setAcademicYear(e.target.value)
            }
          />

          <Dropdown
            label="Student"
            options={students.map(s => ({
              id: s.id,
              name:
                s.firstName +
                ' ' +
                s.lastName
            }))}
            value={studentId}
            onChange={setStudentId}
          />

          <button
            className="save-button"
            onClick={generateReport}
          >
            Generate Report Card
          </button>

        </>

      ) : (

        <>

          <div ref={reportRef}>

            {getTemplate() === 'template1' &&
              <ReportCardTemplate1 {...templateProps} />
            }

            {getTemplate() === 'template2' &&
              <ReportCardTemplate2 {...templateProps} />
            }

            {getTemplate() === 'template3' &&
              <ReportCardTemplate3 {...templateProps} />
            }

            {getTemplate() === 'template4' &&
              <ReportCardTemplate4 {...templateProps} />
            }

          </div>

          <div className="report-footer">

            <button
              className="save-button"
              style={{ marginRight: '10px' }}
              onClick={printReport}
            >
              Print Report Card
            </button>

            <button
              className="save-button"
              onClick={goBack}
            >
              Back
            </button>

          </div>

        </>

      )}

    </div>
  );
}