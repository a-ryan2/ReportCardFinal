
package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
