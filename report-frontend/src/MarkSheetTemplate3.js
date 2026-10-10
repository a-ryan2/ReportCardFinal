import React from "react";
import MarkSheetTable from "./MarkSheetTable";

export default function MarkSheetTemplate3(props) {
    const match = String(props.className || "").match(/\d+/);
    const classNo = match ? Number(match[0]) : null;

    const subjects = [
        "ENGLISH",
        "HINDI",
        "MATHEMATICS",
        "SST",
        "SCIENCE",

        ...(classNo === 9 ? ["SANSKRIT"] : []),

        "COMPUTER"
    ];

    return (
        <MarkSheetTable
            {...props}
            subjects={subjects}
        />
    );
}
