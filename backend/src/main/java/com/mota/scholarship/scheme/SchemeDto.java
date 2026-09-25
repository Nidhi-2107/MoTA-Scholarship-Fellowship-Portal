package com.mota.scholarship.scheme;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDto {
    private UUID id;
    private String code;
    private String name;
    private String category;
    private String objective;
    private String ministry;
    private String portalUrl;
    private Boolean isActive;
    private SchemeVersionDto currentVersion;
    private List<SchemeVersionDto> versions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SchemeVersionDto {
        private UUID id;
        private UUID schemeId;
        private String academicYear;
        private Integer versionNumber;
        private Boolean isActive;
        private LocalDate effectiveFrom;
        private LocalDate effectiveTo;
        private BigDecimal incomeCeiling;
        private String benefitsSummary;
        private String rulesSummary;
        private List<SchemeFormFieldDto> formFields;
        private List<SchemeDocumentRequirementDto> documentRequirements;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SchemeFormFieldDto {
        private UUID id;
        private String fieldName;
        private String label;
        private String fieldType;
        private Boolean isRequired;
        private String optionsJson;
        private String placeholder;
        private String validationRegex;
        private Integer displayOrder;
        private String sectionName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SchemeDocumentRequirementDto {
        private UUID id;
        private String documentType;
        private String name;
        private String description;
        private Boolean isMandatory;
        private Integer maxSizeMb;
        private String allowedFormats;
    }
}
