package com.mota.scholarship.rules;

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
public class RuleEvaluationDto {
    private boolean overallEligible;
    private String ruleVersion;
    private String evaluator;
    private String summary;
    private List<RuleResultDto> ruleResults;

    public boolean isEligible() {
        return overallEligible;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RuleResultDto {
        private UUID ruleId;
        private String ruleCode;
        private String ruleName;
        private boolean passed;
        private String errorMessage;
        private String logicOperator;
        private String actualValue;
        private String expectedValue;
        private String evidenceSnippet;
        private String documentRef;
        private List<ConditionResultDto> conditionResults;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConditionResultDto {
        private String fieldPath;
        private String operator;
        private String expectedValue;
        private String actualValue;
        private boolean conditionPassed;
    }
}
