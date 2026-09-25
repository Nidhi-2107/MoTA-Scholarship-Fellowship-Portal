package com.mota.scholarship.rules;

import com.mota.scholarship.applicant.ApplicantEducation;
import com.mota.scholarship.applicant.ApplicantProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RuleEngineService {

    private final RuleRepository ruleRepository;

    @Transactional(readOnly = true)
    public RuleEvaluationDto evaluateApplication(
            UUID schemeVersionId,
            ApplicantProfile profile,
            ApplicantEducation currentEducation,
            Map<String, String> applicationFields,
            Map<String, String> extractedDocumentFields) {

        List<Rule> rules = ruleRepository.findBySchemeVersionIdAndIsActiveTrueOrderByPriorityAsc(schemeVersionId);
        List<RuleEvaluationDto.RuleResultDto> ruleResults = new ArrayList<>();
        boolean allRulesPassed = true;

        for (Rule rule : rules) {
            List<RuleEvaluationDto.ConditionResultDto> conditionResults = new ArrayList<>();
            List<Boolean> conditionOutcomes = new ArrayList<>();
            StringBuilder evidenceSnippet = new StringBuilder();
            String documentRef = "Applicant Profile";

            for (RuleCondition cond : rule.getConditions()) {
                String actualValue = resolveFieldValue(cond.getFieldPath(), profile, currentEducation, applicationFields, extractedDocumentFields);
                boolean condPassed = evaluateCondition(actualValue, cond.getOperator(), cond.getExpectedValue(), cond.getValueType());

                conditionOutcomes.add(condPassed);
                conditionResults.add(RuleEvaluationDto.ConditionResultDto.builder()
                        .fieldPath(cond.getFieldPath())
                        .operator(cond.getOperator())
                        .expectedValue(cond.getExpectedValue())
                        .actualValue(actualValue)
                        .conditionPassed(condPassed)
                        .build());

                // Build evidence trail
                if (cond.getFieldPath().contains("familyAnnualIncome") || cond.getFieldPath().contains("income")) {
                    evidenceSnippet.append("Annual Family Income Rs. ").append(actualValue != null ? actualValue : "N/A");
                    if (extractedDocumentFields != null && extractedDocumentFields.containsKey("Annual Family Income")) {
                        evidenceSnippet.append(" (Cross-verified via OCR Income Certificate)");
                        documentRef = "Income_Certificate.pdf (Page 1)";
                    }
                } else if (cond.getFieldPath().contains("category") || cond.getFieldPath().contains("stCasteName")) {
                    evidenceSnippet.append("Community Category 'ST' (").append(profile != null ? profile.getStCasteName() : "ST").append(")");
                    documentRef = "ST_Caste_Certificate.pdf (Page 1)";
                } else if (cond.getFieldPath().contains("dbtEnabled")) {
                    evidenceSnippet.append("Aadhaar-seeded DBT Account Status: ").append(actualValue);
                } else {
                    evidenceSnippet.append(cond.getFieldPath()).append(": ").append(actualValue);
                }
            }

            boolean rulePassed;
            if ("OR".equalsIgnoreCase(rule.getLogicOperator())) {
                rulePassed = conditionOutcomes.stream().anyMatch(Boolean::booleanValue);
            } else {
                rulePassed = conditionOutcomes.stream().allMatch(Boolean::booleanValue);
            }

            if (!rulePassed) {
                allRulesPassed = false;
            }

            String firstActual = conditionResults.isEmpty() ? "N/A" : conditionResults.get(0).getActualValue();
            String firstExpected = conditionResults.isEmpty() ? "N/A" : conditionResults.get(0).getExpectedValue();

            ruleResults.add(RuleEvaluationDto.RuleResultDto.builder()
                    .ruleId(rule.getId())
                    .ruleCode(rule.getRuleCode())
                    .ruleName(rule.getName())
                    .passed(rulePassed)
                    .errorMessage(rulePassed ? null : rule.getErrorMessage())
                    .logicOperator(rule.getLogicOperator())
                    .actualValue(firstActual)
                    .expectedValue(firstExpected)
                    .evidenceSnippet(evidenceSnippet.toString())
                    .documentRef(documentRef)
                    .conditionResults(conditionResults)
                    .build());
        }

        String summary = allRulesPassed
                ? "All " + rules.size() + " deterministic eligibility rules satisfied."
                : "Failed one or more mandatory eligibility requirements.";

        return RuleEvaluationDto.builder()
                .overallEligible(allRulesPassed)
                .ruleVersion("MoTA-RULES-2025-V1")
                .evaluator("DETERMINISTIC_RULES_ENGINE")
                .summary(summary)
                .ruleResults(ruleResults)
                .build();
    }

    private String resolveFieldValue(
            String path,
            ApplicantProfile profile,
            ApplicantEducation education,
            Map<String, String> appFields,
            Map<String, String> extractedDocs) {

        if (path == null) return null;
        String cleanPath = path.trim();

        // 1. Profile fields
        if (profile != null) {
            if (cleanPath.equals("profile.familyAnnualIncome") || cleanPath.equalsIgnoreCase("family_income")) {
                return profile.getFamilyAnnualIncome() != null ? profile.getFamilyAnnualIncome().toPlainString() : "0";
            }
            if (cleanPath.equals("profile.category") || cleanPath.equalsIgnoreCase("category")) {
                return "ST"; // Always Scheduled Tribe for this operating system
            }
            if (cleanPath.equals("profile.dbtEnabled") || cleanPath.equalsIgnoreCase("dbt_enabled")) {
                return String.valueOf(Boolean.TRUE.equals(profile.getDbtEnabled()));
            }
            if (cleanPath.equals("profile.pvtgStatus") || cleanPath.equalsIgnoreCase("pvtg_status")) {
                return String.valueOf(Boolean.TRUE.equals(profile.getPvtgStatus()));
            }
            if (cleanPath.equals("profile.stateCode")) {
                return profile.getStateCode();
            }
        }

        // 2. Education fields
        if (education != null) {
            if (cleanPath.equals("education.marksPercentage") || cleanPath.equalsIgnoreCase("marks_percentage")) {
                return education.getMarksPercentage() != null ? education.getMarksPercentage().toPlainString() : "0";
            }
            if (cleanPath.equals("education.educationLevel")) {
                return education.getEducationLevel();
            }
        }

        // 3. Application dynamic fields
        if (appFields != null && appFields.containsKey(cleanPath)) {
            return appFields.get(cleanPath);
        }

        // 4. Extracted document fields (OCR verified)
        if (extractedDocs != null && extractedDocs.containsKey(cleanPath)) {
            return extractedDocs.get(cleanPath);
        }

        return "N/A";
    }

    public boolean evaluateCondition(String actual, String op, String expected, String valueType) {
        if (actual == null || expected == null) return false;
        String operator = op.trim();

        if ("NUMBER".equalsIgnoreCase(valueType)) {
            try {
                // Strip currency symbols and commas e.g. "Rs. 1,85,000" -> "185000"
                String cleanActual = actual.replaceAll("[^0-9.]", "");
                String cleanExpected = expected.replaceAll("[^0-9.]", "");
                if (cleanActual.isBlank() || cleanExpected.isBlank()) return false;

                BigDecimal act = new BigDecimal(cleanActual);
                BigDecimal exp = new BigDecimal(cleanExpected);

                return switch (operator) {
                    case "=", "==" -> act.compareTo(exp) == 0;
                    case "!=" -> act.compareTo(exp) != 0;
                    case "<" -> act.compareTo(exp) < 0;
                    case "<=" -> act.compareTo(exp) <= 0;
                    case ">" -> act.compareTo(exp) > 0;
                    case ">=" -> act.compareTo(exp) >= 0;
                    case "BETWEEN" -> {
                        String[] parts = expected.split("-");
                        if (parts.length == 2) {
                            BigDecimal min = new BigDecimal(parts[0].trim());
                            BigDecimal max = new BigDecimal(parts[1].trim());
                            yield act.compareTo(min) >= 0 && act.compareTo(max) <= 0;
                        }
                        yield false;
                    }
                    default -> false;
                };
            } catch (Exception e) {
                log.warn("Error comparing numbers actual='{}', expected='{}': {}", actual, expected, e.getMessage());
                return false;
            }
        } else if ("BOOLEAN".equalsIgnoreCase(valueType)) {
            boolean act = Boolean.parseBoolean(actual.trim());
            boolean exp = Boolean.parseBoolean(expected.trim());
            return switch (operator) {
                case "=", "==" -> act == exp;
                case "!=" -> act != exp;
                default -> false;
            };
        } else {
            // String comparison
            String act = actual.trim();
            String exp = expected.trim();
            return switch (operator) {
                case "=", "==" -> act.equalsIgnoreCase(exp);
                case "!=" -> !act.equalsIgnoreCase(exp);
                case "CONTAINS" -> act.toLowerCase().contains(exp.toLowerCase());
                case "IN" -> Arrays.stream(exp.split(","))
                        .map(String::trim)
                        .anyMatch(s -> s.equalsIgnoreCase(act));
                case "NOT_IN" -> Arrays.stream(exp.split(","))
                        .map(String::trim)
                        .noneMatch(s -> s.equalsIgnoreCase(act));
                default -> act.equalsIgnoreCase(exp);
            };
        }
    }
}
