package com.trying.report.service;

import com.trying.report.entity.ClassEntity;
import com.trying.report.entity.Holiday;
import com.trying.report.repository.ClassRepository;
import com.trying.report.repository.HolidayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class HolidayService {

    @Autowired
    private HolidayRepository holidayRepository;

    @Autowired
    private ClassRepository classRepository;

    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAll();
    }

    public List<Holiday> findHolidaysBetween(LocalDate start, LocalDate end) {
        return holidayRepository.findByFromDateBetweenOrToDateBetween(start, end, start, end);
    }

    public Holiday saveHoliday(Holiday holiday, Set<Long> classIds) {
        if (classIds != null && !classIds.isEmpty()) {
            Set<ClassEntity> classEntities = new HashSet<>(classRepository.findAllById(classIds));
            holiday.setClasses(classEntities);
        }
        return holidayRepository.save(holiday);
    }

    public Holiday updateHoliday(Holiday holiday, Set<Long> classIds) {
        Holiday existing = holidayRepository.findById(holiday.getId())
                .orElseThrow(() -> new RuntimeException("Holiday not found with id " + holiday.getId()));

        existing.setDescription(holiday.getDescription());
        existing.setFromDate(holiday.getFromDate());
        existing.setToDate(holiday.getToDate());

        Set<ClassEntity> classes = new HashSet<>(classRepository.findAllById(classIds));
        existing.setClasses(classes);

        return holidayRepository.save(existing);
    }


    public void deleteHoliday(Long id) {
        holidayRepository.deleteById(id);
    }
}
