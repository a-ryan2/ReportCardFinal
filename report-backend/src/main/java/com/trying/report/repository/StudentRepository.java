package com.trying.report.repository;

import com.trying.report.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Existing
    List<Student> findByClassEntityIdAndSectionIdAndAcademicYear(Long classId, Long sectionId, String academicYear);

    // ✅ New (optional stream filter)
    List<Student> findByClassEntityIdAndSectionIdAndStreamIdAndAcademicYear(Long classId, Long sectionId, Long streamId, String academicYear);

    boolean existsByClassEntityIdAndSectionIdAndRollNumber(Long classId, Long sectionId, String rollNumber);

    boolean existsBySrn(String srn);

    boolean existsByAdmissionNo(String admissionNo);

    // ✅ NEW: Find student using admission number
    Optional<Student> findByAdmissionNo(String admissionNo);
}