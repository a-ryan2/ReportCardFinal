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

    @GetMapping("/student/{studentId}/term/{termId}")
    public List<CoScholasticMark> getByStudentTerm(@PathVariable Long studentId, @PathVariable Long termId, @RequestParam String academicYear) {
        return service.getByStudentAndTerm(studentId, termId, academicYear);
    }

    @GetMapping("/class/{classId}/section/{sectionId}/term/{termId}")
    public List<CoScholasticMark> getByClassSectionTerm(@PathVariable Long classId, @PathVariable Long sectionId, @PathVariable Long termId, @RequestParam String academicYear) {
        return service.getByClassSectionTerm(classId, sectionId, termId, academicYear);
    }

    @PostMapping
    public CoScholasticMark save(@RequestBody CoScholasticMark mark) {
        return service.save(mark);
    }
}