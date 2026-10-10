import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import Dropdown from "./Dropdown";
import {
    fetchClasses,
    fetchSections,
    fetchStudents,
    fetchHistoricalStudentsFromMarks,
    fetchMarksByClassSection,
    fetchCoScholasticMarksByClassSectionTerm
} from "./Api";

import MarkSheetTemplate1 from "./MarkSheetTemplate1";
import MarkSheetTemplate2 from "./MarkSheetTemplate2";
import MarkSheetTemplate3 from "./MarkSheetTemplate3";
import MarkSheetTemplate4 from "./MarkSheetTemplate4";
import "./style.css";

const EXAMS = [
    { id: "PT1", name: "PT-1" },
    { id: "PT2", name: "PT-2" },
    { id: "HALF_YEARLY", name: "Half Yearly" },
    { id: "FINAL", name: "Final Examination" }
];

const extractClassNumber = (className) => {
    if (!className) return null;
    const match = className.match(/\d+/);
    return match ? Number(match[0]) : null;
};

const sameId = (a, b) => a != null && b != null && String(a) === String(b);

const studentMatchesSelection = (student, classId, sectionId, academicYear) => {
    if (!student) return false;

    // Do not allow records from another academic year into this marksheet.
    if (
        String(student.academicYear ?? "").trim() !==
        String(academicYear).trim()
    ) {
        return false;
    }

    // These checks are safeguards for APIs that return mixed class/section data.
    const studentClassId = student.classEntity?.id ?? student.classEntityId;
    const studentSectionId = student.section?.id ?? student.sectionId;

    if (studentClassId != null && !sameId(studentClassId, classId)) return false;
    if (studentSectionId != null && !sameId(studentSectionId, sectionId)) return false;

    return true;
};

const sortStudentsByRollNumber = (list) =>
    [...list].sort((a, b) => {
        const rollA = Number(a.rollNumber);
        const rollB = Number(b.rollNumber);
        if (Number.isFinite(rollA) && Number.isFinite(rollB)) return rollA - rollB;
        return String(a.rollNumber ?? "").localeCompare(
            String(b.rollNumber ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
        );
    });

export default function Marksheet() {
    const reportRef = useRef();

    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [classId, setClassId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [examType, setExamType] = useState("");
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);
    const [showReport, setShowReport] = useState(false);

    useEffect(() => {
        fetchClasses().then(setClasses);
        fetchSections().then(setSections);
    }, []);

    const generateMarksheet = async () => {
        if (!classId || !sectionId || !academicYear.trim() || !examType) {
            alert("Please complete all selections.");
            return;
        }

        try {
            const data = await fetchMarksByClassSection(classId, sectionId, academicYear);

            // Filter marks by selected academic year/class/section as an additional safeguard.
            const yearScopedMarks = (data || []).filter((mark) =>
                studentMatchesSelection(mark.student, classId, sectionId, academicYear)
            );

            const filteredMarks = yearScopedMarks.filter((m) => {
                const name = m.examType?.name?.toUpperCase().trim() || "";
                const term = m.term?.name?.toUpperCase().trim() ||
                    m.term?.toUpperCase().trim() || "";

                if (examType === "PT1") {
                    return name === "PT" && term === "TERM-1";
                }
                if (examType === "PT2") {
                    return name === "PT" && term === "TERM-2";
                }
                if (examType === "HALF_YEARLY") {
                    return name === "HALF YEARLY / ANNUAL" && term === "TERM-1";
                }
                if (examType === "FINAL") {
                    return name === "HALF YEARLY / ANNUAL" && term === "TERM-2";
                }
                return false;
            });

            const termId = examType === "PT1" || examType === "HALF_YEARLY" ? 1 : 2;
            const coScholasticData = await fetchCoScholasticMarksByClassSectionTerm(
                classId, sectionId, termId, academicYear
            );

            const combinedMarks = [...filteredMarks];

            (coScholasticData || [])
                .filter((co) => studentMatchesSelection(
                    co.student, classId, sectionId, academicYear
                ))
                .forEach((co) => {
                    const studentId = co.student?.id;
                    if (!studentId) return;

                    const coSubjects = [
                        { name: "G.K.", value: co.gk },
                        { name: "COMPUTER", value: co.computer },
                        { name: "MORAL SCIENCE", value: co.moralScience }
                    ];

                    coSubjects.forEach(({ name, value }) => {
                        if (value === null || value === undefined || value === "") return;

                        const scholasticExists = filteredMarks.some(
                            (m) => m.student?.id === studentId &&
                                m.subject?.name?.toUpperCase() === name
                        );

                        if (!scholasticExists) {
                            combinedMarks.push({
                                student: co.student,
                                subject: { name },
                                grade: value,
                                isCoScholastic: true
                            });
                        }
                    });
                });

            // Fetch historical students first, following the Report Card implementation.
            const historicalData = await fetchHistoricalStudentsFromMarks(
                classId, sectionId, academicYear
            );

            const historicalStudentsById = {};

            (historicalData || []).forEach((item) => {
                const student = item.student || item;
                if (
                    student?.id &&
                    studentMatchesSelection(student, classId, sectionId, academicYear)
                ) {
                    historicalStudentsById[student.id] = student;
                }
            });

            let finalStudents = Object.values(historicalStudentsById);

            // Fall back to the Students table only when no eligible historical students are found.
            if (finalStudents.length === 0) {
                const currentStudents = await fetchStudents(
                    classId, sectionId, academicYear
                );

                finalStudents = (currentStudents || []).filter((student) =>
                    studentMatchesSelection(student, classId, sectionId, academicYear)
                );
            }

            const studentsById = {};

            finalStudents.forEach((student) => {
                studentsById[student.id] = student;
            });

            combinedMarks.forEach((mark) => {
                const student = mark.student;
                if (
                    student?.id &&
                    studentMatchesSelection(student, classId, sectionId, academicYear)
                ) {
                    studentsById[student.id] = student;
                }
            });

            setStudents(sortStudentsByRollNumber(Object.values(studentsById)));
            setMarks(combinedMarks);
            setShowReport(true);
        } catch (err) {
            console.error(err);
            alert("Unable to generate marksheet.");
        }
    };

    const printReport = () => {
        if (!reportRef.current) return;

        html2canvas(reportRef.current, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const printWindow = window.open("", "_blank", "width=900,height=700");
                if (!printWindow) return;

                printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Marksheet</title>
                        <style>
                          body { margin: 0; padding: 0; text-align: center;
                            -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                          img { max-width: 100%; height: auto; page-break-after: avoid; }
                          @page { size: A4 landscape; margin: 10mm; }
                        </style>
                      </head>
                      <body><img src="${imgData}" alt="Marksheet Snapshot" /></body>
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
            })
            .catch((err) => {
                alert("Error generating print preview: " + err.message);
            });
    };

    const goBack = () => setShowReport(false);
    const selectedClass = classes.find((c) => String(c.id) === String(classId));
    const selectedSection = sections.find((s) => String(s.id) === String(sectionId));
    const className = selectedClass?.name ?? "";
    const sectionName = selectedSection?.name ?? "";
    const classNo = extractClassNumber(className);

    const getTemplate = () => {
        if (classNo <= 4) return 1;
        if (classNo <= 8) return 2;
        if (classNo <= 10) return 3;
        return 4;
    };

    const templateProps = {
        students, marks, examType, academicYear, className, sectionName
    };

    return (
        <div className="container">
            {!showReport ? (
                <>
                    <Dropdown label="Class" options={classes} value={classId} onChange={setClassId} />
                    <Dropdown label="Section" options={sections} value={sectionId} onChange={setSectionId} />

                    <div className="form-group">
                        <label>Academic Year</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="2025-2026"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                        />
                    </div>

                    <Dropdown label="Exam Type" options={EXAMS} value={examType} onChange={setExamType} />

                    <button className="save-button" onClick={generateMarksheet}>
                        Generate Marksheet
                    </button>
                </>
            ) : (
                <>
                    <div ref={reportRef}>
                        {getTemplate() === 1 && <MarkSheetTemplate1 {...templateProps} />}
                        {getTemplate() === 2 && <MarkSheetTemplate2 {...templateProps} />}
                        {getTemplate() === 3 && <MarkSheetTemplate3 {...templateProps} />}
                        {getTemplate() === 4 && <MarkSheetTemplate4 {...templateProps} />}
                    </div>

                    <div className="report-footer">
                        <button className="save-button" style={{ marginRight: "10px" }} onClick={printReport}>
                            Print Marksheet
                        </button>
                        <button className="save-button" onClick={goBack}>Back</button>
                    </div>
                </>
            )}
        </div>
    );
}
