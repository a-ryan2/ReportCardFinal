
package com.trying.report.repository;

import com.trying.report.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByDateBetweenAndStudentClassEntityIdAndStudentSectionId(LocalDate start, LocalDate end, Long classId, Long sectionId);
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
}
