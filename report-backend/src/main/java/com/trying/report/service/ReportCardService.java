package com.trying.report.service;

import com.trying.report.entity.ReportCard;
import com.trying.report.repository.ReportCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReportCardService {

    @Autowired
    private ReportCardRepository reportCardRepository;

    @Transactional
    public ReportCard saveOrUpdate(ReportCard reportCard) {

        Optional<ReportCard> existing = reportCardRepository.findByStudentIdAndClassIdAndSectionIdAndAcademicYear(reportCard.getStudentId(), reportCard.getClassId(), reportCard.getSectionId(), reportCard.getAcademicYear());

        ReportCard saved;

        if (existing.isPresent()) {

            ReportCard existingCard = existing.get();

            existingCard.setTotalMarks(reportCard.getTotalMarks());
            existingCard.setMaxMarks(reportCard.getMaxMarks());
            existingCard.setPercentage(reportCard.getPercentage());
            existingCard.setTotalAttendance(reportCard.getTotalAttendance());
            existingCard.setAcademicYear(reportCard.getAcademicYear());
            existingCard.setUpdatedAt(LocalDateTime.now());

            saved = reportCardRepository.save(existingCard);

        } else {

            reportCard.setCreatedAt(LocalDateTime.now());
            reportCard.setUpdatedAt(LocalDateTime.now());

            saved = reportCardRepository.save(reportCard);
        }

        recalculateRanks(reportCard.getClassId(), reportCard.getSectionId(), reportCard.getAcademicYear());

        return saved;
    }

    public List<ReportCard> findAll() {
        return reportCardRepository.findAll();
    }

    public Optional<ReportCard> findByStudentId(Long studentId) {
        return reportCardRepository.findByStudentId(studentId);
    }

    @Transactional
    public void recalculateRanks(Long classId, Long sectionId, String academicYear) {

        List<ReportCard> cards = reportCardRepository.findByClassIdAndSectionIdAndAcademicYear(classId, sectionId, academicYear);

        cards.sort(Comparator.comparing((ReportCard rc) -> rc.getPercentage() == null ? BigDecimal.ZERO : rc.getPercentage()).reversed().thenComparing(ReportCard::getStudentId));

        int rank = 1;
        double lastPercentage = -1.0;

        for (int i = 0; i < cards.size(); i++) {

            ReportCard rc = cards.get(i);

            double currentPercent = rc.getPercentage() == null ? 0.0 : rc.getPercentage().doubleValue();

            if (Double.compare(currentPercent, lastPercentage) == 0) {

                rc.setRank(rank);

            } else {

                rank = i + 1;

                rc.setRank(rank);

                lastPercentage = currentPercent;
            }

            rc.setUpdatedAt(LocalDateTime.now());
        }

        reportCardRepository.saveAll(cards);
    }
}