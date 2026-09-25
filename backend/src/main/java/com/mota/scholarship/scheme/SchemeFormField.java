package com.mota.scholarship.scheme;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "scheme_form_fields")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeFormField {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_version_id", nullable = false)
    private SchemeVersion schemeVersion;

    @Column(name = "field_name", nullable = false, length = 100)
    private String fieldName;

    @Column(nullable = false, length = 200)
    private String label;

    @Column(name = "field_type", nullable = false, length = 30)
    private String fieldType; // text, number, date, dropdown, radio, checkbox, textarea, file

    @Column(name = "is_required")
    @Builder.Default
    private Boolean isRequired = true;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson; // JSON array for dropdowns / radios

    @Column(length = 150)
    private String placeholder;

    @Column(name = "validation_regex", length = 255)
    private String validationRegex;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "section_name", length = 100)
    @Builder.Default
    private String sectionName = "General";
}
