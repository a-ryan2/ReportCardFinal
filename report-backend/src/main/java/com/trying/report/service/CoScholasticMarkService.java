package com.trying.report.service;

import com.trying.report.entity.CoScholasticMark;
import com.trying.report.repository.CoScholasticMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;

@Service
public class CoScholasticMarkService {

    @Autowired
    private CoScholasticMarkRepository repo;

    public List<CoScholasticMark> getByStudentAndTerm(Long studentId, Long termId) {
        return repo.findByStudentIdAndTermId(studentId, termId);
    }

    public List<CoScholasticMark> getByClassSectionTerm(Long classId, Long sectionId, Long termId) {
        return repo.findByTermIdAndStudent_ClassEntity_IdAndStudent_Section_Id(termId, classId, sectionId);
    }

    public CoScholasticMark save(CoScholasticMark mark) {
        if (mark.getAcademicYear() == null || mark.getAcademicYear().isEmpty()) {
            mark.setAcademicYear(String.valueOf(Year.now().getValue()));
        }
        return repo.save(mark);
    }
}
