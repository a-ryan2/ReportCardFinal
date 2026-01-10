package com.trying.report.repository;

import com.trying.report.entity.Stream;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StreamRepository extends JpaRepository<Stream, Long> {
    boolean existsByName(String name);
}
