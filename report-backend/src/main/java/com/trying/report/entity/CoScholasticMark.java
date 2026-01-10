package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "co_scholastic_marks")
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
}
