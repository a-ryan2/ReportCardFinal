package com.trying.report.controller;

import com.trying.report.entity.CoScholasticMark;
import com.trying.report.service.CoScholasticMarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/co-scholastic")
@CrossOrigin("*")
public class CoScholasticMarkController {

    @Autowired
    private CoScholasticMarkService service;

    // Get marks for a student + term
    @GetMapping("/student/{studentId}/term/{termId}")
    public List<CoScholasticMark> getByStudentTerm(@PathVariable Long studentId, @PathVariable Long termId) {
        return service.getByStudentAndTerm(studentId, termId);
    }

    // Get all marks for class + section + term
    @GetMapping("/class/{classId}/section/{sectionId}/term/{termId}")
    public List<CoScholasticMark> getByClassSectionTerm(
            @PathVariable Long classId,
            @PathVariable Long sectionId,
            @PathVariable Long termId
    ) {
        return service.getByClassSectionTerm(classId, sectionId, termId);
    }

    // Save or update co-scholastic marks
    @PostMapping
    public CoScholasticMark save(@RequestBody CoScholasticMark mark) {
        return service.save(mark);
    }
}
