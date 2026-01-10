package com.trying.report.repository;

import com.trying.report.entity.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TermRepository extends JpaRepository<Term, Long> {
    // You can add custom queries if needed later
}
