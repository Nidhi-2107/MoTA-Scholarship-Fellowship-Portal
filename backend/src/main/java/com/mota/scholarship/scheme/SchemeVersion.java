package com.mota.scholarship.scheme;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "scheme_versions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"scheme_id", "academic_year", "version_number"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to", nullable = false)
    private LocalDate effectiveTo;

    @Column(name = "income_ceiling", precision = 12, scale = 2)
    private BigDecimal incomeCeiling;

    @Column(name = "benefits_summary", columnDefinition = "TEXT")
    private String benefitsSummary;

    @Column(name = "rules_summary", columnDefinition = "TEXT")
    private String rulesSummary;

    @OneToMany(mappedBy = "schemeVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<SchemeFormField> formFields = new ArrayList<>();

    @OneToMany(mappedBy = "schemeVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SchemeDocumentRequirement> documentRequirements = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
