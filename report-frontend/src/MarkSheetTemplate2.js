import React from "react";
import MarkSheetTable from "./MarkSheetTable";

const SUBJECTS = [
    "ENGLISH",
    "HINDI",
    "MATHEMATICS",
    "SCIENCE",
    "SOCIAL SCIENCE",
    "SANSKRIT",
    "COMPUTER"
];

export default function MarkSheetTemplate2(props) {
    return <MarkSheetTable {...props} subjects={SUBJECTS} />;
}
