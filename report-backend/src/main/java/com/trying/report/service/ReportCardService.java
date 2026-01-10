package com.trying.report.service;

import com.trying.report.entity.ReportCard;
import com.trying.report.repository.ReportCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReportCardService {

    @Autowired
    private ReportCardRepository reportCardRepository;

    /**
     * Saves or updates a report card entry for a student.
     * Automatically recalculates ranks within the same class & section.
     */
    @Transactional
    public ReportCard saveOrUpdate(ReportCard reportCard) {
        // ✅ Automatically determine academic year (March to March rule)
        if (reportCard.getAcademicYear() == null || reportCard.getAcademicYear().isBlank()) {
            reportCard.setAcademicYear(getCurrentAcademicYear());
        }

        Optional<ReportCard> existing = reportCardRepository
                .findByStudentIdAndClassIdAndSectionIdAndAcademicYear(
                        reportCard.getStudentId(),
                        reportCard.getClassId(),
                        reportCard.getSectionId(),
                        reportCard.getAcademicYear()
                );

        ReportCard saved;
        if (existing.isPresent()) {
            // Update existing record
            ReportCard existingCard = existing.get();
            existingCard.setTotalMarks(reportCard.getTotalMarks());
            existingCard.setMaxMarks(reportCard.getMaxMarks());
            existingCard.setPercentage(reportCard.getPercentage());
            existingCard.setTotalAttendance(reportCard.getTotalAttendance());
            existingCard.setAcademicYear(reportCard.getAcademicYear());
            existingCard.setUpdatedAt(LocalDateTime.now());
            saved = reportCardRepository.save(existingCard);
        } else {
            // Create a new report card record
            reportCard.setCreatedAt(LocalDateTime.now());
            reportCard.setUpdatedAt(LocalDateTime.now());
            saved = reportCardRepository.save(reportCard);
        }

        // ✅ Recalculate ranks for this class & section only
        recalculateRanks(reportCard.getClassId(), reportCard.getSectionId(), reportCard.getAcademicYear());

        return saved;
    }

    public List<ReportCard> findAll() {
        return reportCardRepository.findAll();
    }

    public Optional<ReportCard> findByStudentId(Long studentId) {
        return reportCardRepository.findByStudentId(studentId);
    }

    /**
     * ✅ Recalculate ranks for all students in the same class-section.
     * Students with the same percentage share the same rank.
     */
    @Transactional
    public void recalculateRanks(Long classId, Long sectionId, String academicYear) {
        List<ReportCard> cards = reportCardRepository.findByClassIdAndSectionIdAndAcademicYear(classId, sectionId, academicYear);

        // Sort descending by percentage, then ascending by studentId for stable ordering
        cards.sort(Comparator
                .comparing((ReportCard rc) -> rc.getPercentage() == null ? BigDecimal.ZERO : rc.getPercentage())
                .reversed()
                .thenComparing(ReportCard::getStudentId));

        int rank = 1;
        double lastPercentage = -1.0;

        for (int i = 0; i < cards.size(); i++) {
            ReportCard rc = cards.get(i);
            double currentPercent = rc.getPercentage() == null ? 0.0 : rc.getPercentage().doubleValue();

            if (Double.compare(currentPercent, lastPercentage) == 0) {
                // Same percentage → same rank
                rc.setRank(rank);
            } else {
                // New percentage → next rank
                rank = i + 1;
                rc.setRank(rank);
                lastPercentage = currentPercent;
            }

            rc.setUpdatedAt(LocalDateTime.now());
        }

        reportCardRepository.saveAll(cards);
    }

    /**
     * ✅ Determine the academic year string (March → next year March)
     * Example:
     *   - If current month >= March (3), academic year = 2024–2025
     *   - If before March, academic year = 2023–2024
     */
    private String getCurrentAcademicYear() {
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int startYear, endYear;

        if (now.getMonthValue() >= 3) {
            startYear = year;
            endYear = year + 1;
        } else {
            startYear = year - 1;
            endYear = year;
        }

        // Convert to short form: 2024–2025 → "24–25"
        String shortStart = String.valueOf(startYear).substring(2);
        String shortEnd = String.valueOf(endYear).substring(2);
        return shortStart + "-" + shortEnd;
    }
}
