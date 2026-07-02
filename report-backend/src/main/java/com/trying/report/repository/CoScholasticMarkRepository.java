package com.trying.report.repository;

import com.trying.report.entity.CoScholasticMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoScholasticMarkRepository extends JpaRepository<CoScholasticMark, Long> {

    List<CoScholasticMark> findByStudentIdAndTermId(Long studentId, Long termId);

    List<CoScholasticMark> findByStudentIdAndTermIdAndAcademicYear(Long studentId, Long termId, String academicYear);

    List<CoScholasticMark> findByTermIdAndClassIdAndSectionIdAndAcademicYear(Long termId, Long classId, Long sectionId, String academicYear);

    Optional<CoScholasticMark> findByStudentIdAndTermIdAndAcademicYearAndClassIdAndSectionId(Long studentId, Long termId, String academicYear, Long classId, Long sectionId);
}