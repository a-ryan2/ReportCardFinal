package com.trying.report.controller;

import com.trying.report.entity.Student;
import com.trying.report.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping()
    public Student saveStudent(@RequestBody Student student) {
        return studentService.save(student);
    }

    @GetMapping()
    public List<Student> getStudentsByClassSectionAndOptionalStream(
            @RequestParam Long classId,
            @RequestParam Long sectionId,
            @RequestParam String academicYear,
            @RequestParam(required = false) Long streamId) {

        if (streamId != null) {
            return studentService.findByClassSectionAndStream(classId, sectionId, streamId, academicYear);
        } else {
            return studentService.findByClassAndSection(classId, sectionId, academicYear);
        }
    }

    @PostMapping("/promote")
    public void promoteStudents(@RequestBody java.util.Map<String, Object> payload) {

        List<Integer> ids = (List<Integer>) payload.get("studentIds");

        List<Long> studentIds = ids.stream()
                .map(Long::valueOf)
                .toList();

        Long targetClassId =
                Long.valueOf(payload.get("targetClassId").toString());

        Long targetSectionId =
                Long.valueOf(payload.get("targetSectionId").toString());

        String targetAcademicYear =
                payload.get("targetAcademicYear").toString();

        Long targetStreamId = null;

        if (payload.get("targetStreamId") != null) {

            targetStreamId =
                    Long.valueOf(payload.get("targetStreamId").toString());
        }

        studentService.promoteStudents(
                studentIds,
                targetClassId,
                targetSectionId,
                targetAcademicYear,
                targetStreamId
        );
    }

    // Delete a student
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}