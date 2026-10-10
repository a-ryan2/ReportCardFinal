import React from "react";
import AryaVidyaMandirLogo from "./AryaVidyaMandirLogo.png";
import "./MarkSheetTemplate.css";

const readMaxMarks = (mark) => {
    const value = Number(mark?.totalMarks);
    return Number.isFinite(value) && value >= 0 ? value : 0;
};

const getMarkValue = (mark) => {
    if (!mark) return "";
    if (mark.isCoScholastic) return mark.grade ?? "";
    return mark.marksObtained ?? "";
};

const normalizeSubject = (subject) => subject.toUpperCase().trim();

export default function MarkSheetTable({
    students = [],
    marks = [],
    examType,
    academicYear,
    className = "",
    sectionName = "",
    subjects = [],
    template1 = false
}) {
    const getSubjectMark = (studentId, subject) => {
        const lookup = subject === "SCIENCE / EVS"
            ? "SCIENCE"
            : subject === "SOCIAL SCIENCE"
                ? "SST"
                : subject;

        return marks.find((mark) =>
            mark.student?.id === studentId &&
            normalizeSubject(mark.subject?.name || "") === normalizeSubject(lookup)
        ) || {};
    };

    const getSubjectMax = (subject) => {
        const mark = marks.find((item) =>
            normalizeSubject(item.subject?.name || "") === normalizeSubject(
                subject === "SCIENCE / EVS" ? "SCIENCE" :
                subject === "SOCIAL SCIENCE" ? "SST" : subject
            ) && !item.isCoScholastic
        );
        return readMaxMarks(mark);
    };

    const getStudentTotals = (student) => {
        let obtained = 0;
        let maximum = 0;

        subjects.forEach((subject) => {
            const mark = getSubjectMark(student.id, subject);
            if (mark && !mark.isCoScholastic) {
                const raw = mark.marksObtained;
                if (raw !== null && raw !== undefined && raw !== "") {
                    const numeric = Number(raw);
                    if (Number.isFinite(numeric)) obtained += numeric;
                }
            }

            // Include the subject's maximum even if this student has no mark entry.
            maximum += getSubjectMax(subject);
        });

        const percentage = maximum > 0 ? (obtained / maximum) * 100 : null;
        return { obtained, maximum, percentage };
    };

    return (
        <div className="marksheet">
            <div className="school-title">
                <img src={AryaVidyaMandirLogo} alt="School Logo" className="school-logo" />
                <span>ARYA VIDYA MANDIR SR. SEC SCHOOL</span>
            </div>

            <div className="school-subtitle">
                Milk Plant Road, Ballabgarh, Faridabad &nbsp;|&nbsp;
                Ph. No: <span className="num">2247066</span>
                <br />
                Affiliation No: <span className="num">530888</span>
                &nbsp;|&nbsp; Affiliated to CBSE
            </div>

            <h3>Class Marksheet</h3>

            <div className="header-row">
                <div>Class: <b>{className || "—"}</b></div>
                <div>Section: <b>{sectionName || "—"}</b></div>
                <div>Academic Year: <b>{academicYear}</b></div>
                <div>Exam: <b>{examType}</b></div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Roll</th>
                        <th>Admission No.</th>
                        <th>Name</th>
                        <th>Father's Name</th>
                        {subjects.map((subject) => (
                            <th key={subject}>
                                <div>{subject}</div>
                                <small>(Max: {getSubjectMax(subject) || "—"})</small>
                            </th>
                        ))}
                        <th>Total</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => {
                        const totals = getStudentTotals(student);
                        return (
                            <tr key={student.id}>
                                <td>{student.rollNumber}</td>
                                <td>{student.admissionNo || "—"}</td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.fatherName || "—"}</td>
                                {subjects.map((subject) => {
                                    const mark = getSubjectMark(student.id, subject);
                                    const value = getMarkValue(mark);
                                    return (
                                        <td key={subject}>
                                            {value === 0 || value === "0" ? "" : value}
                                        </td>
                                    );
                                })}
                                <td><b>{totals.obtained}</b></td>
                                <td>
                                    <b>
                                        {totals.percentage === null
                                            ? "—"
                                            : `${totals.percentage.toFixed(2)}%`}
                                    </b>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
