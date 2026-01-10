
package com.trying.report.controller;

import com.trying.report.entity.Attendance;
import com.trying.report.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping ()
    public List<Attendance> getAttendance(@RequestParam String start, @RequestParam String end, @RequestParam Long classId, @RequestParam Long sectionId) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return attendanceService.findByDateRangeAndClassSection(startDate, endDate, classId, sectionId);
    }


    @PostMapping()
    public Attendance saveAttendance(@RequestBody Attendance attendance) {
        return attendanceService.saveOrUpdate(attendance);
    }
}
