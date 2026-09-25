package com.mota.scholarship.scheme;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "scheme_document_requirements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDocumentRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_version_id", nullable = false)
    private SchemeVersion schemeVersion;

    @Column(name = "document_type", nullable = false, length = 50)
    private String documentType; // ST_CASTE_CERTIFICATE, INCOME_CERTIFICATE, QUALIFYING_MARKSHEET, FEE_RECEIPT, RESEARCH_PROPOSAL

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_mandatory")
    @Builder.Default
    private Boolean isMandatory = true;

    @Column(name = "max_size_mb")
    @Builder.Default
    private Integer maxSizeMb = 5;

    @Column(name = "allowed_formats", length = 100)
    @Builder.Default
    private String allowedFormats = "PDF,JPG,JPEG,PNG";
}
