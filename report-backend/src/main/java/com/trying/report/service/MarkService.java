package com.trying.report.service;

import com.trying.report.entity.Mark;
import com.trying.report.repository.MarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class MarkService {

    @Autowired
    private MarkRepository markRepository;

    public List<Mark> findByStudentId(Long studentId) {
        return markRepository.findByStudentId(studentId);
    }

    public List<Mark> findByClassSectionSubjectExamTerm(Long classId, Long sectionId, Long subjectId, Long examTypeId, Long termId) {
        return markRepository.findByClassIdAndSectionIdAndSubjectIdAndExamTypeIdAndTermId(classId, sectionId, subjectId, examTypeId, termId);
    }

    public Mark save(Mark mark) {
        // Ensure academic year is always filled
        if (mark.getAcademicYear() == null || mark.getAcademicYear().isEmpty()) {
            mark.setAcademicYear(String.valueOf(Year.now().getValue()));
        }

        // Check if record already exists for the same student, subject, exam, term, class, section, and academic year
        Optional<Mark> existing = markRepository.findByStudentIdAndSubjectIdAndExamTypeIdAndTermIdAndClassIdAndSectionIdAndAcademicYear(
                mark.getStudent().getId(),
                mark.getSubject().getId(),
                mark.getExamType().getId(),
                mark.getTerm().getId(),
                mark.getClassId(),
                mark.getSectionId(),
                mark.getAcademicYear()
        );

        if (existing.isPresent()) {
            Mark existingMark = existing.get();
            existingMark.setTotalMarks(mark.getTotalMarks());
            existingMark.setMarksObtained(mark.getMarksObtained());
            existingMark.setAbsent(mark.getAbsent()); // ✅ NEW
            return markRepository.save(existingMark);
        } else {
            return markRepository.save(mark);
        }
    }
}
