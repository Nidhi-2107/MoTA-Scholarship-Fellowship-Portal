package com.mota.scholarship.scheme;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchemeVersionRepository extends JpaRepository<SchemeVersion, UUID> {
    Optional<SchemeVersion> findBySchemeIdAndAcademicYearAndIsActiveTrue(UUID schemeId, String academicYear);
    Optional<SchemeVersion> findFirstBySchemeCodeAndIsActiveTrueOrderByEffectiveFromDesc(String schemeCode);
    List<SchemeVersion> findBySchemeIdOrderByAcademicYearDesc(UUID schemeId);
    List<SchemeVersion> findByIsActiveTrue();
    Optional<SchemeVersion> findTopBySchemeIdAndIsActiveTrueOrderByVersionNumberDesc(UUID schemeId);
}
