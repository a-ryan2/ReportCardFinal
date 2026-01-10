
package com.trying.report.service;

import com.trying.report.entity.Attendance;
import com.trying.report.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> findByDateRangeAndClassSection(LocalDate start, LocalDate end, Long classId, Long sectionId) {
        return attendanceRepository.findByDateBetweenAndStudentClassEntityIdAndStudentSectionId(start, end, classId, sectionId);
    }

    public List<Attendance> findByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public Attendance saveOrUpdate(Attendance attendance) {
        // Check if attendance for student + date already exists
        Attendance existing = attendanceRepository
                .findByStudentIdAndDate(attendance.getStudent().getId(), attendance.getDate())
                .orElse(null);

        if (existing != null) {
            existing.setStatus(attendance.getStatus());
            return attendanceRepository.save(existing);
        } else {
            return attendanceRepository.save(attendance);
        }
    }
}
