package com.trying.report.service;

import com.trying.report.entity.Student;
import com.trying.report.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> findByClassAndSection(Long classId, Long sectionId) {
        return studentRepository.findByClassEntityIdAndSectionId(classId, sectionId);
    }

    public List<Student> findByClassSectionAndStream(Long classId, Long sectionId, Long streamId) {
        return studentRepository.findByClassEntityIdAndSectionIdAndStreamId(classId, sectionId, streamId);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Student save(Student student) {
        // Validate mandatory fields
        if (student.getSrn() == null || student.getSrn().trim().isEmpty() ||
                student.getAdmissionNo() == null || student.getAdmissionNo().trim().isEmpty() ||
                student.getFirstName() == null || student.getLastName() == null ||
                student.getMotherName() == null || student.getFatherName() == null ||
                student.getRollNumber() == null) {
            throw new IllegalArgumentException("All fields are mandatory.");
        }

        // Check duplicates
        boolean srnExists = studentRepository.existsBySrn(student.getSrn());
        boolean admissionExists = studentRepository.existsByAdmissionNo(student.getAdmissionNo());

        if (srnExists && (student.getId() == null ||
                !studentRepository.findById(student.getId())
                        .map(s -> s.getSrn().equals(student.getSrn()))
                        .orElse(false))) {
            throw new IllegalArgumentException("SRN already exists.");
        }

        if (admissionExists && (student.getId() == null ||
                !studentRepository.findById(student.getId())
                        .map(s -> s.getAdmissionNo().equals(student.getAdmissionNo()))
                        .orElse(false))) {
            throw new IllegalArgumentException("Admission Number already exists.");
        }

        boolean rollExists = studentRepository.existsByClassEntityIdAndSectionIdAndRollNumber(
                student.getClassEntity().getId(),
                student.getSection().getId(),
                student.getRollNumber()
        );

        if (rollExists && (student.getId() == null ||
                !studentRepository.findById(student.getId())
                        .map(s -> s.getRollNumber().equals(student.getRollNumber()))
                        .orElse(false))) {
            throw new IllegalArgumentException("Roll number already exists in this class and section.");
        }

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id){
        studentRepository.deleteById(id);
    }
}
