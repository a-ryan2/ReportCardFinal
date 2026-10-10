import React from "react";
import MarkSheetTable from "./MarkSheetTable";

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
            "MATHEMATICS",
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

export default function MarkSheetTemplate4({ students = [], ...props }) {
    const streamValue = students[0]?.stream;
    const stream = typeof streamValue === "string"
        ? streamValue.toUpperCase()
        : streamValue?.name?.toUpperCase() || "";

    return <MarkSheetTable {...props} students={students} subjects={getSubjects(stream)} />;
}
