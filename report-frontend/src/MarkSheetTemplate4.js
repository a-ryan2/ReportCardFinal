import React from "react";
import AryaVidyaMandirLogo from "./AryaVidyaMandirLogo.png";
import "./MarkSheetTemplate.css";

const getSubjects = (stream) => {

  if (stream === "NON-MEDICAL") {

    return [

      "ENGLISH",

      "MATHEMATICS",

      "PHYSICS",

      "CHEMISTRY",

      "PHY. EDU.",

      "COMP. SCIENCE"

    ];

  }

  if (stream === "COMMERCE") {

    return [

      "ENGLISH",

      "BUSINESS STUDIES",

      "ACCOUNTANCY",

      "ECONOMICS",

      "PHY. EDU.",

      "COMP. SCIENCE"

    ];

  }

  return [

    "ENGLISH",

    "PHYSICS",

    "CHEMISTRY",

    "BIOLOGY",

    "MATHEMATICS",

    "PHY. EDU.",

    "COMP. SCIENCE"

  ];

};

export default function MarkSheetTemplate4({
  students = [],
  marks = [],
  examType,
  academicYear
}) {

  const streamValue = students[0]?.stream;

  const stream =
    typeof streamValue === "string"
      ? streamValue.toUpperCase()
      : streamValue?.name?.toUpperCase() || "";

  const SUBJECTS = getSubjects(stream);

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
