package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "marks",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"student_id", "subject_id", "exam_type_id", "term_id", "academicYear"}
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(optional = false)
    @JoinColumn(name = "exam_type_id", nullable = false)
    private ExamType examType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private Term term;

    @Column(nullable = false)
    private Integer totalMarks;

    @Column(nullable = false)
    private Integer marksObtained;

    // Example: "2025-26" or "2025"
    @Column(nullable = false, length = 20)
    private String academicYear;

    // These are stored as plain IDs (no foreign key)
    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;
}
