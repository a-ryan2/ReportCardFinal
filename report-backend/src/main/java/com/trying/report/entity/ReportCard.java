package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_card", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "class_id", "section_id", "academic_year"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks = 0;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks = 0;

    @Column(name = "percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage = BigDecimal.ZERO;

    @Column(name = "total_attendance", nullable = false, precision = 5, scale = 2)
    private BigDecimal totalAttendance = BigDecimal.ZERO;

    @Column(name = "rank")
    private Integer rank;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;



    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    /**
     * Calculate percentage safely
     */
    public void calculatePercentage() {
        if (maxMarks != null && maxMarks > 0 && totalMarks != null) {
            this.percentage = new BigDecimal(totalMarks)
                    .divide(new BigDecimal(maxMarks), 2, BigDecimal.ROUND_HALF_UP)
                    .multiply(new BigDecimal(100));
        } else {
            this.percentage = BigDecimal.ZERO;
        }
    }

    /**
     * Set total attendance with validation (0-100)
     */
    public void setTotalAttendanceSafe(BigDecimal attendance) {
        if (attendance != null) {
            if (attendance.compareTo(BigDecimal.ZERO) < 0) {
                this.totalAttendance = BigDecimal.ZERO;
            } else if (attendance.compareTo(new BigDecimal(100)) > 0) {
                this.totalAttendance = new BigDecimal(100);
            } else {
                this.totalAttendance = attendance.setScale(2, BigDecimal.ROUND_HALF_UP);
            }
        } else {
            this.totalAttendance = BigDecimal.ZERO;
        }
    }
}
