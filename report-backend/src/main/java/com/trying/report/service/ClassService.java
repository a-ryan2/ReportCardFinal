
package com.trying.report.service;

import com.trying.report.entity.Attendance;
import com.trying.report.entity.ClassEntity;
import com.trying.report.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    public List<ClassEntity> findAll() {
        return classRepository.findAll();
    }

    public ClassEntity save(ClassEntity classEntity) {
        return classRepository.save(classEntity);
    }

    public void deleteClass(Long id){
        classRepository.deleteById(id);
    }

    public ClassEntity findById(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found with id: " + id));
    }
}
