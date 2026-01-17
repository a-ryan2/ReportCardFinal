package com.trying.report.repository;


import com.trying.report.entity.ClassAdmin;
import com.trying.report.entity.User;
import com.trying.report.entity.ClassEntity;
import com.trying.report.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassAdminRepository extends JpaRepository<ClassAdmin, Long> {

    List<ClassAdmin> findByUser(User user);

    Optional<ClassAdmin> findByUserAndClassEntityAndSection(User user, ClassEntity classEntity, Section section);

    List<ClassAdmin> findByUserId(Long userId);

}
