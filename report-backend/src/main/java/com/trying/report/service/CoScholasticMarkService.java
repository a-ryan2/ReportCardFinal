package com.trying.report.service;

import com.trying.report.entity.CoScholasticMark;
import com.trying.report.repository.CoScholasticMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class CoScholasticMarkService {

    @Autowired
    private CoScholasticMarkRepository repo;

    public List<CoScholasticMark> getByStudentAndTerm(Long studentId, Long termId, String academicYear) {
        return repo.findByStudentIdAndTermIdAndAcademicYear(studentId, termId, academicYear);
    }

    public List<CoScholasticMark> getByClassSectionTerm(Long classId, Long sectionId, Long termId, String academicYear) {
        return repo.findByTermIdAndClassIdAndSectionIdAndAcademicYear(termId, classId, sectionId, academicYear);
    }

    public CoScholasticMark save(CoScholasticMark mark) {

        if (mark.getAcademicYear() == null || mark.getAcademicYear().isEmpty()) {
            mark.setAcademicYear(String.valueOf(Year.now().getValue()));
        }

        if (mark.getStudent() != null) {

            if (mark.getClassId() == null && mark.getStudent().getClassEntity() != null) {
                mark.setClassId(mark.getStudent().getClassEntity().getId());
            }

            if (mark.getSectionId() == null && mark.getStudent().getSection() != null) {
                mark.setSectionId(mark.getStudent().getSection().getId());
            }
        }

        Optional<CoScholasticMark> existing = repo.findByStudentIdAndTermIdAndAcademicYearAndClassIdAndSectionId(mark.getStudent().getId(), mark.getTerm().getId(), mark.getAcademicYear(), mark.getClassId(), mark.getSectionId());

        if (existing.isPresent()) {

            CoScholasticMark existingMark = existing.get();

            existingMark.setRegularityPunctuality(mark.getRegularityPunctuality());
            existingMark.setSincerity(mark.getSincerity());
            existingMark.setBehaviourValues(mark.getBehaviourValues());
            existingMark.setRespectfulnessRules(mark.getRespectfulnessRules());
            existingMark.setAttitudeTeachers(mark.getAttitudeTeachers());
            existingMark.setAttitudeClassmates(mark.getAttitudeClassmates());
            existingMark.setArtEducation(mark.getArtEducation());
            existingMark.setWorkEducation(mark.getWorkEducation());
            existingMark.setHealthPhysicalEducation(mark.getHealthPhysicalEducation());
            existingMark.setClassTeacherRemarks(mark.getClassTeacherRemarks());
            existingMark.setGk(mark.getGk());
            existingMark.setComputer(mark.getComputer());
            existingMark.setMoral_science(mark.getMoral_science());

            return repo.save(existingMark);
        }

        return repo.save(mark);
    }
}