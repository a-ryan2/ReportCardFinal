package com.trying.report.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "term")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Term {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
