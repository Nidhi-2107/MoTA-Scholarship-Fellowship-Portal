package com.mota.scholarship.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, UUID> {
    List<ApplicationDocument> findByApplicationId(UUID applicationId);
    List<ApplicationDocument> findByApplicationIdAndVerificationStatus(UUID applicationId, String verificationStatus);
}
