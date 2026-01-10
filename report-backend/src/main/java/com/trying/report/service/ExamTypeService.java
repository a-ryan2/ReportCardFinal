
package com.trying.report.service;

import com.trying.report.entity.ExamType;
import com.trying.report.repository.ExamTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamTypeService {

    @Autowired
    private ExamTypeRepository examTypeRepository;

    public List<ExamType> findAll() {
        return examTypeRepository.findAll();
    }

    public ExamType save(ExamType examType){
        return examTypeRepository.save(examType);
    }

}
