package com.mota.scholarship.applicant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicantEducationRepository extends JpaRepository<ApplicantEducation, UUID> {
    List<ApplicantEducation> findByProfileIdOrderByPassingYearDesc(UUID profileId);
}
