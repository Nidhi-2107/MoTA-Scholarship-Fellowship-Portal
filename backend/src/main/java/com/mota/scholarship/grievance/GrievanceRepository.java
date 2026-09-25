package com.mota.scholarship.grievance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GrievanceRepository extends JpaRepository<Grievance, UUID> {
    List<Grievance> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Page<Grievance> findByStatus(String status, Pageable pageable);
    Optional<Grievance> findByTicketNumber(String ticketNumber);
    long countByStatus(String status);
}
