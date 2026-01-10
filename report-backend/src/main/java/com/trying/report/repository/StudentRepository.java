package com.trying.report.repository;

import com.trying.report.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Existing
    List<Student> findByClassEntityIdAndSectionId(Long classId, Long sectionId);

    // ✅ New (optional stream filter)
    List<Student> findByClassEntityIdAndSectionIdAndStreamId(Long classId, Long sectionId, Long streamId);

    boolean existsByClassEntityIdAndSectionIdAndRollNumber(Long classId, Long sectionId, String rollNumber);

    boolean existsBySrn(String srn);
    boolean existsByAdmissionNo(String admissionNo);
}
