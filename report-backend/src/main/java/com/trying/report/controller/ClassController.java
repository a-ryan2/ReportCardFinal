
package com.trying.report.controller;

import com.trying.report.entity.ClassEntity;
import com.trying.report.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @PostMapping()
    public ClassEntity saveClass(@RequestBody ClassEntity classEntity) {
        return classService.save(classEntity);
    }

    @GetMapping()
    public List<ClassEntity> getAllClasses() {
        return classService.findAll();
    }

    // Delete a class
    @DeleteMapping("/{id}")
    public void deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
    }
}
