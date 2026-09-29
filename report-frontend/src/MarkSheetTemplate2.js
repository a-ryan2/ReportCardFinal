import React from "react";
import AryaVidyaMandirLogo from "./AryaVidyaMandirLogo.png";
import "./MarkSheetTemplate.css";

const SUBJECTS = [
  "ENGLISH",
  "HINDI",
  "MATHEMATICS",
  "SCIENCE",
  "SOCIAL SCIENCE",
  "SANSKRIT",
  "COMPUTER"
];

export default function MarkSheetTemplate2({
  students = [],
  marks = [],
  examType,
  academicYear
}) {

    const getExamMark = (mark) => {

      return mark.marksObtained ?? "";
    };

    const getSubjectMark = (studentId, subject) => {

      return (
        marks.find(
          m =>
            m.student?.id === studentId &&
            m.subject?.name?.toUpperCase() === subject
        ) || {}
      );
    };

  return (

<div className="marksheet">

<div className="school-title">

<img
    src={AryaVidyaMandirLogo}
    alt="School Logo"
    className="school-logo"
/>

<span>ARYA VIDYA MANDIR SR. SEC SCHOOL</span>

</div>

<div className="school-subtitle">

Milk Plant Road, Ballabgarh, Faridabad &nbsp;|&nbsp;
Ph. No: <span className="num">2247066</span>

<br />

Affiliation No: <span className="num">530888</span>
&nbsp;|&nbsp; Affiliated to CBSE

</div>

<h3>

Class Marksheet

</h3>

<div className="header-row">

<div>

Academic Year : <b>{academicYear}</b>

</div>

<div>

Exam : <b>{examType}</b>

</div>

</div>

<table>

<thead>

<tr>

<th>Roll</th>

<th>Name</th>

{

SUBJECTS.map(subject=>

<th key={subject}>{subject}</th>

)

}

<th>Total</th>

</tr>

</thead>

<tbody>

{

students.map(student=>{

let total=0;

return(

<tr key={student.id}>

<td>{student.rollNumber}</td>

<td>

{student.firstName} {student.lastName}

</td>

{

SUBJECTS.map(subject=>{

const mark=getSubjectMark(student.id,subject);

const value=Number(getExamMark(mark)||0);

total+=value;

return(

<td key={subject}>

{value||""}

</td>

);

})

}

<td>

<b>{total}</b>

</td>

</tr>

);

})

}

</tbody>

</table>

</div>

  );
}

