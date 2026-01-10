
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
            @RequestParam(required = false) Long streamId) {

        if (streamId != null) {
            return studentService.findByClassSectionAndStream(classId, sectionId, streamId);
        } else {
            return studentService.findByClassAndSection(classId, sectionId);
        }
    }

    // Delete a student
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}
