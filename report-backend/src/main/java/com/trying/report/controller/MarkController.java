package com.trying.report.controller;

import com.trying.report.entity.Mark;
import com.trying.report.service.MarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "*")
public class MarkController {

    @Autowired
    private MarkService markService;

    // Get all marks for one student
    @GetMapping("/student/{studentId}")
    public List<Mark> getMarksByStudent(
            @PathVariable Long studentId,
            @RequestParam(required = false) String academicYear
    ) {

        if (academicYear != null && !academicYear.isEmpty()) {
            return markService.findByStudentIdAndAcademicYear(
                    studentId,
                    academicYear
            );
        }

        return markService.findByStudentId(studentId);
    }

    // ✅ NEW: historical-safe report card fetch
    @GetMapping("/student/{studentId}/academicYear/{academicYear}")
    public List<Mark> getMarksByStudentAndAcademicYear(
            @PathVariable Long studentId,
            @PathVariable String academicYear
    ) {
        return markService.findByStudentIdAndAcademicYear(studentId, academicYear);
    }

    // Get all marks for a class/section/subject/exam/term combination
    @GetMapping("/class/{classId}/section/{sectionId}/subject/{subjectId}/exam/{examTypeId}/term/{termId}")
    public List<Mark> getMarksByClassSectionSubjectExamTerm(
            @PathVariable Long classId,
            @PathVariable Long sectionId,
            @PathVariable Long subjectId,
            @PathVariable Long examTypeId,
            @PathVariable Long termId
    ) {
        return markService.findByClassSectionSubjectExamTerm(classId, sectionId, subjectId, examTypeId, termId);
    }

    // Save or update a single mark entry
    @PostMapping
    public Mark saveMark(@RequestBody Mark mark) {
        Mark saved = markService.save(mark);
        return saved;
    }

    @GetMapping("/class/{classId}/section/{sectionId}")
    public List<Mark> getMarksByClassAndSection(
            @PathVariable Long classId,
            @PathVariable Long sectionId
    ) {
        return markService.findByClassIdAndSectionId(classId, sectionId);
    }

    @GetMapping("/class/{classId}/section/{sectionId}/academicYear/{academicYear}")
    public List<Mark> getMarksByClassSectionAndAcademicYear(
            @PathVariable Long classId,
            @PathVariable Long sectionId,
            @PathVariable String academicYear
    ) {
        return markService.findByClassSectionAndAcademicYear(
                classId,
                sectionId,
                academicYear
        );
    }
}