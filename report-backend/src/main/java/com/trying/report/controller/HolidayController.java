package com.trying.report.controller;

import com.trying.report.entity.Holiday;
import com.trying.report.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/holidays")
@CrossOrigin
public class HolidayController {

    @Autowired
    private HolidayService holidayService;

    @GetMapping
    public List<Holiday> getAllHolidays() {
        return holidayService.getAllHolidays();
    }

    @GetMapping("/range")
    public List<Holiday> getHolidaysBetween(@RequestParam String start, @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return holidayService.findHolidaysBetween(startDate, endDate);
    }

    @PostMapping
    public Holiday createHoliday(@RequestBody Map<String, Object> body) {
        Holiday holiday = new Holiday();
        holiday.setDescription((String) body.get("description"));
        holiday.setFromDate(LocalDate.parse((String) body.get("fromDate")));
        holiday.setToDate(LocalDate.parse((String) body.get("toDate")));

        Set<Long> classIds = ((List<Integer>) body.get("classIds"))
                .stream()
                .map(Long::valueOf)
                .collect(java.util.stream.Collectors.toSet());

        return holidayService.saveHoliday(holiday, classIds);
    }

    @PutMapping("/{id}")
    public Holiday updateHoliday(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Holiday holiday = new Holiday();
        holiday.setId(id);
        holiday.setDescription((String) body.get("description"));
        holiday.setFromDate(LocalDate.parse((String) body.get("fromDate")));
        holiday.setToDate(LocalDate.parse((String) body.get("toDate")));

        Set<Long> classIds = ((List<Integer>) body.get("classIds"))
                .stream()
                .map(Long::valueOf)
                .collect(java.util.stream.Collectors.toSet());

        return holidayService.updateHoliday(holiday, classIds);
    }

    @DeleteMapping("/{id}")
    public void deleteHoliday(@PathVariable Long id) {
        holidayService.deleteHoliday(id);
    }
}
