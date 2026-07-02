import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Dropdown from './Dropdown';
import {
  fetchClasses,
  fetchSections,
  fetchStudents,
  fetchMarksByClassSection
} from './Api';

import MarkSheetTemplate1 from './MarkSheetTemplate1';
import './style.css';

// Extract class number (e.g., "Class 3" → 3)
const extractClassNumber = (className) => {
  if (!className) return null;
  const match = className.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export default function Marksheet() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [showReport, setShowReport] = useState(false);

  const reportRef = useRef();

  // Load classes & sections
  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchSections().then(setSections);
  }, []);

  // Load students when class & section selected
  useEffect(() => {
    if (classId && sectionId) {
      fetchStudents(classId, sectionId).then(setStudents);
    } else {
      setStudents([]);
    }
  }, [classId, sectionId]);

  // Generate marksheet
  const generateMarksheet = async () => {
    if (!classId || !sectionId) {
      alert('Please select Class and Section.');
      return;
    }

    try {
      const marksData = await fetchMarksByClassSection(classId, sectionId);

      console.log("Students:", students);
      console.log("Marks:", marksData);

      setMarks(marksData || []);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating marksheet:", error);
      alert("Failed to load marksheet data.");
    }
  };

  // Print
  const printReport = () => {
    if (!reportRef.current) return;

    html2canvas(reportRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Marksheet</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                text-align: center;
              }
              img {
                width: 100%;
                height: auto;
              }
              @page {
                size: A4 landscape;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
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

  const selectedClass = classes.find(c => c.id == classId);
  const classNumber = extractClassNumber(selectedClass?.name);

  const getTemplate = () => {
    if (classNumber >= 1 && classNumber <= 4) return 'template1';
    return 'template1'; // fallback
  };

  return (
    <div className="container">
      <h2>Class Marksheet</h2>

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

          <button className="save-button" onClick={generateMarksheet}>
            Generate Marksheet
          </button>
        </>
      ) : (
        <>
          <div ref={reportRef}>
            {getTemplate() === 'template1' && (
              <MarkSheetTemplate1
                students={students}
                marks={marks}
              />
            )}
          </div>

          <div className="report-footer">
            <button
              className="save-button"
              style={{ marginRight: '10px' }}
              onClick={printReport}
            >
              Print Marksheet
            </button>

            <button className="save-button" onClick={goBack}>
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}