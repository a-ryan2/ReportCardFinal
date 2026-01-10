package com.trying.report.repository;

import com.trying.report.entity.CoScholasticMark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CoScholasticMarkRepository extends JpaRepository<CoScholasticMark, Long> {
    List<CoScholasticMark> findByStudentIdAndTermId(Long studentId, Long termId);

    // Corrected query using 'classEntity' instead of 'class'
    List<CoScholasticMark> findByTermIdAndStudent_ClassEntity_IdAndStudent_Section_Id(
            Long termId, Long classId, Long sectionId
    );
}
