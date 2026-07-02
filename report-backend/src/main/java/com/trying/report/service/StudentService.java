package com.trying.report.service;

import com.trying.report.entity.ClassEntity;
import com.trying.report.entity.Section;
import com.trying.report.entity.Stream;
import com.trying.report.entity.Student;
import com.trying.report.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassService classService;

    @Autowired
    private SectionService sectionService;

    @Autowired
    private StreamService streamService;

    public List<Student> findByClassAndSection(Long classId, Long sectionId, String academicYear) {
        return studentRepository.findByClassEntityIdAndSectionIdAndAcademicYear(classId, sectionId, academicYear);
    }

    public List<Student> findByClassSectionAndStream(Long classId, Long sectionId, Long streamId, String academicYear) {
        return studentRepository.findByClassEntityIdAndSectionIdAndStreamIdAndAcademicYear(classId, sectionId, streamId, academicYear);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Student save(Student student) {
        // Validate mandatory fields
        if (student.getAdmissionNo() == null || student.getAdmissionNo().trim().isEmpty() ||
                student.getFirstName() == null || student.getFirstName().trim().isEmpty() ||
                student.getMotherName() == null || student.getFatherName() == null ||
                student.getRollNumber() == null ||
                student.getAcademicYear() == null || student.getAcademicYear().trim().isEmpty()) {
            throw new IllegalArgumentException("Mandatory fields are missing.");
        }

        // ✅ Only check SRN uniqueness if provided
        if (student.getSrn() != null && !student.getSrn().trim().isEmpty()) {
            boolean srnExists = studentRepository.existsBySrn(student.getSrn());
            if (srnExists && (student.getId() == null ||
                    !studentRepository.findById(student.getId())
                            .map(s -> s.getSrn() != null && s.getSrn().equals(student.getSrn()))
                            .orElse(false))) {
                throw new IllegalArgumentException("SRN already exists.");
            }
        }

        boolean admissionExists = studentRepository.existsByAdmissionNo(student.getAdmissionNo());

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

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // ✅ BULK PROMOTION
    @org.springframework.transaction.annotation.Transactional
    public void promoteStudents(

            List<Long> studentIds,

            Long targetClassId,

            Long targetSectionId,

            String targetAcademicYear,

            Long targetStreamId) {

        ClassEntity targetClass = classService.findById(targetClassId);

        Section targetSection = sectionService.findById(targetSectionId);

        Stream targetStream = null;

        // ✅ Stream required only for class 11 & 12
        if (
                targetClass.getName().equals("11") ||
                        targetClass.getName().equals("12")
        ) {

            if (targetStreamId == null) {

                throw new RuntimeException(
                        "Stream is required for class 11 and 12"
                );
            }

            targetStream = streamService.findAll()
                    .stream()
                    .filter(s -> s.getId().equals(targetStreamId))
                    .findFirst()
                    .orElseThrow(() ->
                            new RuntimeException("Invalid stream selected"));
        }

        List<Student> students =
                studentRepository.findAllById(studentIds);

        for (Student student : students) {

            // ✅ IMPORTANT FIX:
            // Do NOT create new student row.
            // Keep same admission number/student identity.
            // Only update current class/session info.

            student.setClassEntity(targetClass);

            student.setSection(targetSection);

            student.setAcademicYear(targetAcademicYear);

            // ✅ For classes 1-10 remove stream
            if (
                    targetClass.getName().equals("11") ||
                            targetClass.getName().equals("12")
            ) {

                student.setStream(targetStream);

            } else {

                student.setStream(null);
            }
        }

        // ✅ IMPORTANT
        studentRepository.saveAll(students);
    }
}