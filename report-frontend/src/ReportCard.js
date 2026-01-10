import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Dropdown from './Dropdown';
import {
  fetchClasses,
  fetchSections,
  fetchStudents,
  fetchMarksByStudentForReportCard,
  fetchCoScholasticMarksByStudentTermForReportCard,
  fetchTerms,
  fetchReportCardByStudent

} from './Api';
import ReportCardTemplate1 from './ReportCardTemplate1';
import ReportCardTemplate2 from './ReportCardTemplate2';
import ReportCardTemplate3 from './ReportCardTemplate3';
import './style.css';
import './Template1.css';

// Utility to extract class number from class name like 'Class 10' or '10'
const extractClassNumber = (className) => {
  if (!className) return null;
  const match = className.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export default function ReportCard() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [coScholastic, setCoScholastic] = useState([]);
  const [teacherRemarks, setTeacherRemarks] = useState("");
  const [totalPercentage, setTotalPercentage] = useState("")
  const [rank, setRank] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);


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
    if (classId && sectionId) {
      fetchStudents(classId, sectionId).then(setStudents);
    } else {
      setStudents([]);
    }
  }, [classId, sectionId]);

const generateReport = async () => {
  if (!classId || !sectionId || !studentId) {
    alert('Please select Class, Section, and Student.');
    return;
  }

  // Fetch scholastic marks
  const marksData = await fetchMarksByStudentForReportCard(studentId);
  setMarks(marksData || []);

  // Fetch report card to get rank
  const reportCard = await fetchReportCardByStudent(studentId);
  setRank(reportCard?.rank || null);
  setAcademicYear(reportCard?.academicYear || null);


  // Calculate total marks obtained for core subjects only
  const calculateTotalPercentage = (marks) => {
    if (!marks || marks.length === 0) return "";

    // List of optional subjects to ignore
    const optionalSubjects = ["G.K.", "Computer", "Moral Science"];

    // Filter out optional subjects
    const coreSubjects = marks.filter(sub => !optionalSubjects.includes(sub.name));

    const totalObtained = coreSubjects.reduce((acc, sub) => {
      const subTotal = parseFloat(sub.total) || 0;
      return acc + subTotal;
    }, 0);

    // Max total = 5 core subjects * 100 max per subject
    const maxTotal = 5 * 100;

    const percentage = (totalObtained / maxTotal) * 100;
    return percentage.toFixed(2); // two decimals
  };


  const totalPercentage = calculateTotalPercentage(marksData);
  setTotalPercentage(totalPercentage);



  // Fetch co-scholastic data for all terms
  const terms = await fetchTerms();
  const coScholasticData = [];
  let remarksValue = "";

  for (const term of terms) {
    const data = await fetchCoScholasticMarksByStudentTermForReportCard(studentId, term.id);
    if (!data) continue;

    const termGrades = [
      { areaName: "Art Education", grade: data.artEducation, term: term.id },
      { areaName: "Work Education", grade: data.workEducation, term: term.id },
      { areaName: "Health & Physical Education", grade: data.healthPhysicalEducation, term: term.id },
      { areaName: "Regularity & Punctuality", grade: data.discipline.regularityPunctuality, term: term.id },
      { areaName: "Sincerity", grade: data.discipline.sincerity, term: term.id },
      { areaName: "Behaviour & Values", grade: data.discipline.behaviourValues, term: term.id },
      { areaName: "Respectfulness for Rules & Regulation", grade: data.discipline.respectfulnessRules, term: term.id },
      { areaName: "Attitude towards Teachers", grade: data.discipline.attitudeTeachers, term: term.id },
      { areaName: "Attitude towards School-Mates", grade: data.discipline.attitudeClassmates, term: term.id }
    ];

    coScholasticData.push(...termGrades);

    // Store remarks from the first term only (or latest)
    if (!remarksValue) {
      remarksValue = data?.remarks || "";
    }
  }

  setCoScholastic(coScholasticData);
  setTeacherRemarks(remarksValue);  // Set separately

  setShowReport(true);
};


  const printReport = () => {
    if (!reportRef.current) return;

    html2canvas(reportRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank', 'width=900,height=700');
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
            <img src="${imgData}" alt="Report Card Snapshot" />
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
      alert('Error generating print preview: ' + err.message);
    });
  };

  const goBack = () => setShowReport(false);

  const selectedClass = classes.find(c => c.id === classId || c.id === parseInt(classId));
  const selectedSection = sections.find(s => s.id === sectionId || s.id === parseInt(sectionId));
  const selectedStudent = students.find(s => s.id === studentId || s.id === parseInt(studentId));

  const studentClassName = selectedStudent?.className || selectedClass?.name || '';
  const classNumber = extractClassNumber(studentClassName);

  const getTemplate = () => {
    if (classNumber >= 1 && classNumber <= 4) return 'template1';
    if (classNumber >= 5 && classNumber <= 8) return 'template2';
    if (classNumber >= 9 && classNumber <= 12) return 'template3';
    return 'templateDefault';
  };

  const templateProps = {
    student: selectedStudent ? {
      ...selectedStudent,
      className: selectedClass?.name || '',
      sectionName: selectedSection?.name || ''
    } : {},

    marks: marks || [],
    coScholastic: coScholastic || [],
    teacherRemarks:teacherRemarks,
    totalPercentage:totalPercentage,
    rank: rank,
    academicYear: academicYear
  };

  return (
    <div className="container">
      <h2>Report Card Generation</h2>

      {!showReport ? (
        <>
          <Dropdown label="Class" options={classes} value={classId} onChange={setClassId} />
          <Dropdown label="Section" options={sections} value={sectionId} onChange={setSectionId} />
          <Dropdown
            label="Student"
            options={students.map(s => ({ id: s.id, name: s.firstName + ' ' + s.lastName }))}
            value={studentId}
            onChange={setStudentId}
          />
          <button className="save-button" onClick={generateReport}>Generate Report Card</button>
        </>
      ) : (
        <>
          <div ref={reportRef}>
            {getTemplate() === 'template1' && <ReportCardTemplate1 {...templateProps} />}
            {getTemplate() === 'template2' && <ReportCardTemplate2 {...templateProps} />}
            {getTemplate() === 'template3' && <ReportCardTemplate3 {...templateProps} />}
          </div>

          <div className="report-footer">
            <button className="save-button" style={{ marginRight: '10px' }} onClick={printReport}>
              Print Report Card
            </button>
            <button className="save-button" onClick={goBack}>Back</button>
          </div>
        </>
      )}
    </div>
  );
}
