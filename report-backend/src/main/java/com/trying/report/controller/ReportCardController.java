package com.trying.report.controller;

import com.trying.report.entity.ReportCard;
import com.trying.report.service.ReportCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/report-cards")
@CrossOrigin("*")
public class ReportCardController {

    @Autowired
    private ReportCardService reportCardService;

    /**
     * Save or update a report card entry.
     * Automatically recalculates ranks for the student's class & section.
     */
    @PostMapping
    public ReportCard saveOrUpdate(@RequestBody ReportCard reportCard) {
        return reportCardService.saveOrUpdate(reportCard);
    }

    /**
     * Get all report cards (for admin view, testing, etc.)
     */
    @GetMapping
    public List<ReportCard> getAll() {
        return reportCardService.findAll();
    }

    /**
     * Get a report card by studentId.
     * Useful for showing a student’s rank, attendance, percentage, etc.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ReportCard> getReportCardByStudent(@PathVariable Long studentId) {
        Optional<ReportCard> reportCard = reportCardService.findByStudentId(studentId);
        return reportCard.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
