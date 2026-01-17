package com.trying.report.service;

import com.trying.report.entity.ClassAdmin;
import com.trying.report.entity.ClassEntity;
import com.trying.report.entity.Section;
import com.trying.report.entity.User;
import com.trying.report.repository.ClassAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassAdminService {

    private final ClassAdminRepository classAdminRepository;

    public ClassAdmin assignClassAdmin(User user, ClassEntity classEntity, Section section) {
        ClassAdmin ca = new ClassAdmin();
        ca.setUser(user);
        ca.setClassEntity(classEntity);
        ca.setSection(section);
        return classAdminRepository.save(ca);
    }

    public List<ClassAdmin> findAll() {
        return classAdminRepository.findAll();
    }

    public ClassAdmin findById(Long id) {
        return classAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ClassAdmin not found with id: " + id));
    }

    public List<ClassAdmin> findByUserId(Long userId) {
        return classAdminRepository.findByUserId(userId);
    }

    public ClassAdmin update(ClassAdmin classAdmin) {
        return classAdminRepository.save(classAdmin);
    }

    public void delete(Long id) {
        classAdminRepository.deleteById(id);
    }
}
