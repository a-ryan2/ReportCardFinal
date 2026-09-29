import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

import Dropdown from "./Dropdown";

import {
    fetchClasses,
    fetchSections,
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

export default function Marksheet() {

    const reportRef = useRef();

    const [classes,setClasses]=useState([]);
    const [sections,setSections]=useState([]);

    const [classId,setClassId]=useState("");
    const [sectionId,setSectionId]=useState("");
    const [academicYear,setAcademicYear]=useState("");
    const [examType,setExamType]=useState("");

    const [students,setStudents]=useState([]);
    const [marks,setMarks]=useState([]);

    const [showReport,setShowReport]=useState(false);

    useEffect(()=>{

        fetchClasses().then(setClasses);

        fetchSections().then(setSections);


    },[]);

    const generateMarksheet = async () => {
        if (!classId || !sectionId || !academicYear || !examType) {
            alert("Please complete all selections.");
            return;
        }

        try {
            const data = await fetchMarksByClassSection(
                classId,
                sectionId,
                academicYear
            );

            const filteredMarks = (data || []).filter((m) => {
                const name = m.examType?.name?.toUpperCase().trim() || "";

                const term =
                    m.term?.name?.toUpperCase().trim() ||
                    m.term?.toUpperCase().trim() ||
                    "";

                if (examType === "PT1") {
                    return (
                        name === "PT" &&
                        term === "TERM-1"
                    );
                }

                if (examType === "PT2") {
                    return (
                        name === "PT" &&
                        term === "TERM-2"
                    );
                }

                if (examType === "HALF_YEARLY") {
                    return (
                        name === "HALF YEARLY / ANNUAL" &&
                        term === "TERM-1"
                    );
                }

                if (examType === "FINAL") {
                    return (
                        name === "HALF YEARLY / ANNUAL" &&
                        term === "TERM-2"
                    );
                }

                return false;
            });

            const termId =
                examType === "PT1" || examType === "HALF_YEARLY"
                    ? 1
                    : 2;

            const coScholasticData =
                await fetchCoScholasticMarksByClassSectionTerm(
                    classId,
                    sectionId,
                    termId,
                    academicYear
                );

            const combinedMarks = [...filteredMarks];

            (coScholasticData || []).forEach((co) => {

                const studentId = co.student?.id;

                if (!studentId) {
                    return;
                }

                const coSubjects = [
                    {
                        name: "G.K.",
                        value: co.gk
                    },
                    {
                        name: "COMPUTER",
                        value: co.computer
                    },
                    {
                        name: "MORAL SCIENCE",
                        value: co.moralScience
                    }
                ];

                coSubjects.forEach(({ name, value }) => {

                    if (
                        value === null ||
                        value === undefined ||
                        value === ""
                    ) {
                        return;
                    }

                    const scholasticExists = filteredMarks.some(
                        m =>
                            m.student?.id === studentId &&
                            m.subject?.name?.toUpperCase() === name
                    );

                    if (!scholasticExists) {
                        combinedMarks.push({
                            student: co.student,
                            subject: {
                                name
                            },
                            grade: value,
                            isCoScholastic: true
                        });
                    }
                });
            });

            const uniqueStudents = Object.values(
                combinedMarks.reduce((acc, mark) => {
                    const student = mark.student;

                    if (student?.id && !acc[student.id]) {
                        acc[student.id] = student;
                    }

                    return acc;
                }, {})
            );

            setStudents(uniqueStudents);
            setMarks(combinedMarks);
            setShowReport(true);

        } catch (err) {
            console.error(err);
            alert("Unable to generate marksheet.");
        }
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

                        <title>Print Marksheet</title>

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
                            alt="Marksheet Snapshot"
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

    const selectedClass =
        classes.find(c=>c.id==classId);

    const classNo =
        extractClassNumber(selectedClass?.name);

    const getTemplate=()=>{

        if(classNo<=4)
            return 1;

        if(classNo<=8)
            return 2;

        if(classNo<=10)
            return 3;

        return 4;

    };

    return(

<div className="container">

{
!showReport ?

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

{/* Academic Year Text Field */}
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

<Dropdown
label="Exam Type"
options={EXAMS}
value={examType}
onChange={setExamType}
/>

<button
className="save-button"
onClick={generateMarksheet}
>

Generate Marksheet

</button>

</>

:

<>

<div ref={reportRef}>

{
getTemplate()==1 &&
<MarkSheetTemplate1
students={students}
marks={marks}
examType={examType}
academicYear={academicYear}
/>
}

{
getTemplate()==2 &&
<MarkSheetTemplate2
students={students}
marks={marks}
examType={examType}
academicYear={academicYear}
/>
}

{
getTemplate()==3 &&
<MarkSheetTemplate3
students={students}
marks={marks}
examType={examType}
academicYear={academicYear}
/>
}

{
getTemplate()==4 &&
<MarkSheetTemplate4
students={students}
marks={marks}
examType={examType}
academicYear={academicYear}
/>
}

</div>

<div className="report-footer">

<button
    className="save-button"
    style={{ marginRight: '10px' }}
    onClick={printReport}
>
    Print Marksheet
</button>

<button
    className="save-button"
    onClick={goBack}
>
    Back
</button>

</div>

</>

}

</div>

    );

}