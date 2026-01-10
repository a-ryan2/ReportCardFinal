
package com.trying.report.controller;

import com.trying.report.entity.Subject;
import com.trying.report.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping()
    public Subject saveSubject(@RequestBody Subject subject) {
        return subjectService.save(subject);
    }

    @GetMapping()
    public List<Subject> getAllSubjects() {
        return subjectService.findAll();
    }
}
