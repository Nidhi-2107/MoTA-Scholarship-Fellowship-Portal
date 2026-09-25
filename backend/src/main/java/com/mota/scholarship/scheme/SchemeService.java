package com.mota.scholarship.scheme;

import com.mota.scholarship.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchemeService {

    private final SchemeRepository schemeRepository;
    private final SchemeVersionRepository schemeVersionRepository;
    private final SchemeFormFieldRepository formFieldRepository;
    private final SchemeDocumentRequirementRepository documentRequirementRepository;

    @Transactional(readOnly = true)
    public List<SchemeDto> getAllActiveSchemes() {
        return schemeRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SchemeDto getSchemeById(UUID id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with ID: " + id));
        return mapToDto(scheme);
    }

    @Transactional(readOnly = true)
    public SchemeDto getSchemeByCode(String code) {
        Scheme scheme = schemeRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found with code: " + code));
        return mapToDto(scheme);
    }

    @Transactional(readOnly = true)
    public SchemeDto.SchemeVersionDto getSchemeVersion(UUID versionId) {
        SchemeVersion version = schemeVersionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme version not found: " + versionId));
        return mapVersionToDto(version);
    }

    @Transactional(readOnly = true)
    public List<SchemeDiscoveryResultDto> discoverSchemes(SchemeDiscoveryRequest req) {
        List<SchemeDiscoveryResultDto> results = new ArrayList<>();
        List<SchemeVersion> activeVersions = schemeVersionRepository.findByIsActiveTrue();

        for (SchemeVersion sv : activeVersions) {
            Scheme scheme = sv.getScheme();
            List<String> matchingReasons = new ArrayList<>();
            List<String> missingInfo = new ArrayList<>();
            List<String> eligibilityConditions = new ArrayList<>();
            List<String> requiredDocs = sv.getDocumentRequirements().stream()
                    .map(SchemeDocumentRequirement::getName)
                    .collect(Collectors.toList());

            boolean isSt = req.getCategory() == null || req.getCategory().equalsIgnoreCase("ST");
            if (isSt) {
                matchingReasons.add("Belongs to Scheduled Tribe (ST) target community");
            } else {
                missingInfo.add("Scheme is exclusively reserved for Scheduled Tribe candidates");
            }

            BigDecimal income = req.getFamilyAnnualIncome();
            if (sv.getIncomeCeiling() != null) {
                eligibilityConditions.add("Annual Family Income must be ≤ ₹" + sv.getIncomeCeiling());
                if (income != null) {
                    if (income.compareTo(sv.getIncomeCeiling()) <= 0) {
                        matchingReasons.add("Family income (₹" + income + ") is compliant with ceiling of ₹" + sv.getIncomeCeiling());
                    } else {
                        missingInfo.add("Reported family income (₹" + income + ") exceeds threshold of ₹" + sv.getIncomeCeiling());
                    }
                } else {
                    missingInfo.add("Income certificate / family income value pending input");
                }
            } else {
                matchingReasons.add("No restrictive annual income ceiling (Merit/Research grant)");
            }

            String appRoute = "Central Portal (MoTA / NSP)";
            String status = "POTENTIALLY_APPLICABLE";

            // Category specific discovery heuristics
            switch (scheme.getCategory()) {
                case "PRE_MATRIC":
                    eligibilityConditions.add("Enrolled in Class IX or Class X in a recognized school");
                    if ("CLASS_IX".equalsIgnoreCase(req.getEducationLevel()) || "CLASS_X".equalsIgnoreCase(req.getEducationLevel())) {
                        matchingReasons.add("Candidate is enrolled in secondary classes IX/X");
                    } else if (req.getEducationLevel() != null) {
                        status = "NOT_APPLICABLE";
                    }
                    appRoute = "State Tribal Welfare Department Portal / School Verification";
                    break;

                case "POST_MATRIC":
                    eligibilityConditions.add("Pursuing Post-Matriculation studies (XI, XII, ITI, Diploma, UG, PG)");
                    if (req.getEducationLevel() != null && !req.getEducationLevel().startsWith("CLASS_IX") && !req.getEducationLevel().startsWith("CLASS_X")) {
                        matchingReasons.add("Student is pursuing eligible Post-Secondary / College education");
                    }
                    appRoute = "State Scholarship Portal (MPTAAS / MahaDBT / Odisha) or National Scholarship Portal";
                    break;

                case "TOP_CLASS":
                    eligibilityConditions.add("Secured admission in one of the 259 notified premier institutions (IIT/IIM/NIT/AIIMS)");
                    if (req.getInstitutionName() != null && (req.getInstitutionName().toUpperCase().contains("IIT") ||
                            req.getInstitutionName().toUpperCase().contains("NIT") ||
                            req.getInstitutionName().toUpperCase().contains("IIM") ||
                            req.getInstitutionName().toUpperCase().contains("AIIMS") ||
                            req.getInstitutionName().toUpperCase().contains("MANIT"))) {
                        matchingReasons.add("Institute appears in MoTA notified Top Class institution list");
                    } else {
                        missingInfo.add("Institute admission letter to notified premier institution required");
                    }
                    appRoute = "National Scholarship Portal / MoTA Central Scrutiny Desk";
                    break;

                case "FELLOWSHIP":
                    eligibilityConditions.add("Regular enrollment in Indian University M.Phil / Ph.D program");
                    eligibilityConditions.add("Cleared UGC-NET or subject screening panel");
                    if (Boolean.TRUE.equals(req.getIsResearchEnrolled()) || "MPHIL_PHD".equalsIgnoreCase(req.getEducationLevel())) {
                        matchingReasons.add("Active M.Phil / Ph.D research scholar");
                    } else {
                        missingInfo.add("Ph.D registration and synopsis approval details required");
                    }
                    appRoute = "National Fellowship for ST Students (NFST) Central Portal";
                    break;

                case "OVERSEAS":
                    eligibilityConditions.add("Admission letter from top 500 QS ranked foreign university");
                    eligibilityConditions.add("Minimum 55% aggregate in qualifying graduation/post-graduation");
                    if (Boolean.TRUE.equals(req.getIsOverseasEnrolled())) {
                        matchingReasons.add("Possesses overseas university offer");
                    } else {
                        missingInfo.add("Unconditional offer from accredited QS Top 500 university required");
                    }
                    appRoute = "National Overseas Scholarship (NOS) Portal";
                    break;
            }

            if (!isSt) {
                status = "NOT_APPLICABLE";
            } else if (!missingInfo.isEmpty() && status.equals("POTENTIALLY_APPLICABLE")) {
                status = "CONDITIONAL_MATCH";
            }

            results.add(SchemeDiscoveryResultDto.builder()
                    .schemeId(scheme.getId())
                    .schemeVersionId(sv.getId())
                    .schemeCode(scheme.getCode())
                    .schemeName(scheme.getName())
                    .category(scheme.getCategory())
                    .applicabilityStatus(status)
                    .matchingReasons(matchingReasons)
                    .missingInformation(missingInfo)
                    .eligibilityConditions(eligibilityConditions)
                    .requiredDocuments(requiredDocs)
                    .applicationRoute(appRoute)
                    .officialSourceUrl(scheme.getPortalUrl())
                    .academicYear(sv.getAcademicYear())
                    .ruleVersion(sv.getVersionNumber())
                    .disclaimer("Preliminary match only. Official sanction is contingent on deterministic document verification and competent officer scrutiny.")
                    .build());
        }

        return results;
    }

    private SchemeDto mapToDto(Scheme scheme) {
        List<SchemeVersion> versions = schemeVersionRepository.findBySchemeIdOrderByAcademicYearDesc(scheme.getId());
        List<SchemeDto.SchemeVersionDto> versionDtos = versions.stream().map(this::mapVersionToDto).collect(Collectors.toList());
        SchemeDto.SchemeVersionDto currentVersion = versionDtos.isEmpty() ? null : versionDtos.get(0);

        return SchemeDto.builder()
                .id(scheme.getId())
                .code(scheme.getCode())
                .name(scheme.getName())
                .category(scheme.getCategory())
                .objective(scheme.getObjective())
                .ministry(scheme.getMinistry())
                .portalUrl(scheme.getPortalUrl())
                .isActive(scheme.getIsActive())
                .currentVersion(currentVersion)
                .versions(versionDtos)
                .build();
    }

    private SchemeDto.SchemeVersionDto mapVersionToDto(SchemeVersion version) {
        List<SchemeFormField> formFields = formFieldRepository.findBySchemeVersionIdOrderByDisplayOrderAsc(version.getId());
        List<SchemeDocumentRequirement> docReqs = documentRequirementRepository.findBySchemeVersionId(version.getId());

        List<SchemeDto.SchemeFormFieldDto> fieldDtos = formFields.stream().map(f -> SchemeDto.SchemeFormFieldDto.builder()
                .id(f.getId())
                .fieldName(f.getFieldName())
                .label(f.getLabel())
                .fieldType(f.getFieldType())
                .isRequired(f.getIsRequired())
                .optionsJson(f.getOptionsJson())
                .placeholder(f.getPlaceholder())
                .validationRegex(f.getValidationRegex())
                .displayOrder(f.getDisplayOrder())
                .sectionName(f.getSectionName())
                .build()).collect(Collectors.toList());

        List<SchemeDto.SchemeDocumentRequirementDto> docDtos = docReqs.stream().map(d -> SchemeDto.SchemeDocumentRequirementDto.builder()
                .id(d.getId())
                .documentType(d.getDocumentType())
                .name(d.getName())
                .description(d.getDescription())
                .isMandatory(d.getIsMandatory())
                .maxSizeMb(d.getMaxSizeMb())
                .allowedFormats(d.getAllowedFormats())
                .build()).collect(Collectors.toList());

        return SchemeDto.SchemeVersionDto.builder()
                .id(version.getId())
                .schemeId(version.getScheme().getId())
                .academicYear(version.getAcademicYear())
                .versionNumber(version.getVersionNumber())
                .isActive(version.getIsActive())
                .effectiveFrom(version.getEffectiveFrom())
                .effectiveTo(version.getEffectiveTo())
                .incomeCeiling(version.getIncomeCeiling())
                .benefitsSummary(version.getBenefitsSummary())
                .rulesSummary(version.getRulesSummary())
                .formFields(fieldDtos)
                .documentRequirements(docDtos)
                .build();
    }
}
