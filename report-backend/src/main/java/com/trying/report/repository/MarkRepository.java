package com.trying.report.repository;

import com.trying.report.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarkRepository extends JpaRepository<Mark, Long> {

    List<Mark> findByStudentId(Long studentId);

    // ✅ Historical-safe query
    List<Mark> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

    List<Mark> findByClassIdAndSectionIdAndSubjectIdAndExamTypeIdAndTermId(
            Long classId,
            Long sectionId,
            Long subjectId,
            Long examTypeId,
            Long termId
    );

    List<Mark> findByClassIdAndSectionIdAndAcademicYear(
            Long classId,
            Long sectionId,
            String academicYear
    );

    Optional<Mark> findByStudentIdAndSubjectIdAndExamTypeIdAndTermIdAndClassIdAndSectionIdAndAcademicYear(
            Long studentId,
            Long subjectId,
            Long examTypeId,
            Long termId,
            Long classId,
            Long sectionId,
            String academicYear
    );

    List<Mark> findByClassIdAndSectionId(Long classId, Long sectionId);
}