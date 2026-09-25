package com.mota.scholarship.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Optional<Application> findByApplicationNumber(String applicationNumber);

    List<Application> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Page<Application> findByStatus(String status, Pageable pageable);

    Page<Application> findByCurrentStage(String currentStage, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.schemeVersion.scheme.id = :schemeId ORDER BY a.createdAt DESC")
    Page<Application> findBySchemeId(@Param("schemeId") UUID schemeId, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status")
    long countByStatus(@Param("status") String status);

    boolean existsByUserIdAndSchemeVersionSchemeIdAndStatusNotIn(UUID userId, UUID schemeId, List<String> statuses);

    @Query("SELECT a FROM Application a WHERE a.status NOT IN ('DRAFT') ORDER BY a.submissionDate DESC")
    Page<Application> findAllSubmittedApplications(Pageable pageable);
}
