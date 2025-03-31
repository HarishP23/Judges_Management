package com.culturalfest.judges.repository;

import com.culturalfest.judges.model.Judge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JudgeRepository extends JpaRepository<Judge, Long> {
    boolean existsByEmail(String email);
} 