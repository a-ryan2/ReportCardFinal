package com.trying.report.repository;

import com.trying.report.entity.ReportCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportCardRepository extends JpaRepository<ReportCard, Long> {

    Optional<ReportCard> findByStudentId(Long studentId);

    Optional<ReportCard> findByStudentIdAndClassIdAndSectionIdAndAcademicYear(
            Long studentId, Long classId, Long sectionId, String academicYear);

    List<ReportCard> findByClassIdAndSectionIdAndAcademicYear(Long classId, Long sectionId, String academicYear);
}
