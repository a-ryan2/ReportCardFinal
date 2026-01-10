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
    public List<Mark> getMarksByStudent(@PathVariable Long studentId) {
        return markService.findByStudentId(studentId);
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
        return markService.save(mark);
    }
}
