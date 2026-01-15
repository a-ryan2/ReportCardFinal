package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = true)
    private String lastName;

    @Column(nullable = true)
    private String srn;

    @Column(nullable = false, unique = true)
    private String admissionNo;

    @Column(nullable = false)   
    private String rollNumber;

    @Column(nullable = false)
    private String motherName;

    @Column(nullable = false)
    private String fatherName;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    // ✅ Optional stream link for Class 11–12
    @ManyToOne
    @JoinColumn(name = "stream_id", nullable = true)
    private Stream stream;

    private LocalDate dateOfBirth;
}
