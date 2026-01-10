package com.trying.report.repository;

import com.trying.report.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByFromDateBetweenOrToDateBetween(LocalDate start, LocalDate end, LocalDate start2, LocalDate end2);
}
