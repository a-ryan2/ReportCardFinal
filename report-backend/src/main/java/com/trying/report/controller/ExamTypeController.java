
package com.trying.report.controller;

import com.trying.report.entity.ExamType;
import com.trying.report.service.ExamTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam_types")
public class ExamTypeController {

    @Autowired
    private ExamTypeService examTypeService;

    @PostMapping()
    public ExamType saveExamType(@RequestBody ExamType examType) {
        return examTypeService.save(examType);
    }

    @GetMapping()
    public List<ExamType> getAllExamTypes() {
        return examTypeService.findAll();
    }
}
