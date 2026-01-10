package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity; // Use your existing ClassEntity

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
}
