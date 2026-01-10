package com.trying.report.controller;

import com.trying.report.entity.ClassAdmin;
import com.trying.report.entity.ClassEntity;
import com.trying.report.entity.Section;
import com.trying.report.entity.User;
import com.trying.report.service.ClassAdminService;
import com.trying.report.service.UserService;
import com.trying.report.service.ClassService;
import com.trying.report.service.SectionService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class-admin")
@RequiredArgsConstructor
public class ClassAdminController {

    private final ClassAdminService classAdminService;
    private final UserService userService;
    private final ClassService classEntityService;
    private final SectionService sectionService;

    // Assign / Create
    @PostMapping
    public ResponseEntity<ClassAdmin> assignClassAdmin(@RequestBody AssignRequest request) {
        User user = userService.findById(request.getUserId());
        ClassEntity classEntity = classEntityService.findById(request.getClassId());
        Section section = sectionService.findById(request.getSectionId());

        ClassAdmin ca = classAdminService.assignClassAdmin(user, classEntity, section);
        return ResponseEntity.ok(ca);
    }

    // Read all
    @GetMapping
    public ResponseEntity<List<ClassAdmin>> getAll() {
        return ResponseEntity.ok(classAdminService.findAll());
    }

    // Read by id
    @GetMapping("/{id}")
    public ResponseEntity<ClassAdmin> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classAdminService.findById(id));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ClassAdmin> update(@PathVariable Long id, @RequestBody AssignRequest request) {
        ClassAdmin ca = classAdminService.findById(id);
        ca.setUser(userService.findById(request.getUserId()));
        ca.setClassEntity(classEntityService.findById(request.getClassId()));
        ca.setSection(sectionService.findById(request.getSectionId()));
        return ResponseEntity.ok(classAdminService.update(ca));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        classAdminService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class AssignRequest {
        private Long userId;
        private Long classId;
        private Long sectionId;
    }
}
