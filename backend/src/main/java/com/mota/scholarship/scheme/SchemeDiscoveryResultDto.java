package com.mota.scholarship.scheme;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDiscoveryResultDto {
    private UUID schemeId;
    private UUID schemeVersionId;
    private String schemeCode;
    private String schemeName;
    private String category;
    private String applicabilityStatus; // POTENTIALLY_APPLICABLE, CONDITIONAL_MATCH, NOT_APPLICABLE
    private List<String> matchingReasons;
    private List<String> missingInformation;
    private List<String> eligibilityConditions;
    private List<String> requiredDocuments;
    private String applicationRoute; // "Central Portal (NSP / MoTA)", "State Tribal Welfare Portal", "Overseas MoTA Desk"
    private String officialSourceUrl;
    private String academicYear;
    private Integer ruleVersion;
    private String disclaimer;
}
