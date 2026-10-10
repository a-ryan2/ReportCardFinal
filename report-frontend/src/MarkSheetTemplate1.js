import React from "react";
import MarkSheetTable from "./MarkSheetTable";

const SUBJECTS = [
    "ENGLISH",
    "HINDI",
    "MATHEMATICS",
    "SCIENCE / EVS",
    "SOCIAL SCIENCE",
    "G.K.",
    "COMPUTER",
    "MORAL SCIENCE"
];

export default function MarkSheetTemplate1(props) {
    return <MarkSheetTable {...props} subjects={SUBJECTS} template1 />;
}
