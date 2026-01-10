package com.trying.report.controller;

import com.trying.report.entity.Term;
import com.trying.report.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terms")
@CrossOrigin(origins = "*")
public class TermController {

    @Autowired
    private TermService termService;

    @GetMapping
    public List<Term> getAllTerms() {
        return termService.findAll();
    }

    @GetMapping("/{id}")
    public Term getTermById(@PathVariable Long id) {
        return termService.findById(id);
    }
}
