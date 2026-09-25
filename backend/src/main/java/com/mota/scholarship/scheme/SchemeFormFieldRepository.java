package com.mota.scholarship.scheme;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchemeFormFieldRepository extends JpaRepository<SchemeFormField, UUID> {
    List<SchemeFormField> findBySchemeVersionIdOrderByDisplayOrderAsc(UUID schemeVersionId);
}
