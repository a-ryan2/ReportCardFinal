package com.trying.report.service;

import com.trying.report.entity.Term;
import com.trying.report.repository.TermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TermService {

    @Autowired
    private TermRepository termRepository;

    public List<Term> findAll() {
        return termRepository.findAll();
    }

    public Term findById(Long id) {
        return termRepository.findById(id).orElse(null);
    }
}
