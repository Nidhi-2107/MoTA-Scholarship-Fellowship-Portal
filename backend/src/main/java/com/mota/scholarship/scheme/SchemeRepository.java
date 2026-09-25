package com.mota.scholarship.scheme;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, UUID> {
    Optional<Scheme> findByCode(String code);
    List<Scheme> findByIsActiveTrue();
    List<Scheme> findByCategory(String category);
}
