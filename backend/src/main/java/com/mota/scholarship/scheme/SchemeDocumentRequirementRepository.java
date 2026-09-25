package com.mota.scholarship.scheme;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchemeDocumentRequirementRepository extends JpaRepository<SchemeDocumentRequirement, UUID> {
    List<SchemeDocumentRequirement> findBySchemeVersionId(UUID schemeVersionId);
}
