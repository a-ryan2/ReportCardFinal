package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "co_scholastic_marks", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "term_id", "academic_year", "class_id", "section_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoScholasticMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "term_id")
    private Term term;

    private String regularityPunctuality;
    private String sincerity;
    private String behaviourValues;
    private String respectfulnessRules;
    private String attitudeTeachers;
    private String attitudeClassmates;

    private String artEducation;
    private String workEducation;
    private String healthPhysicalEducation;

    @Column(length = 500)
    private String classTeacherRemarks;

    @Column(length = 20, nullable = false)
    private String academicYear;

    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    private String gk;
    private String computer;
    private String moral_science;


}
