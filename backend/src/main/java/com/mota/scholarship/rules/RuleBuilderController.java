package com.mota.scholarship.rules;

import com.mota.scholarship.common.ApiResponse;
import com.mota.scholarship.common.ResourceNotFoundException;
import com.mota.scholarship.scheme.SchemeVersion;
import com.mota.scholarship.scheme.SchemeVersionRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/v1/rules", "/api/rules"})
@RequiredArgsConstructor
public class RuleBuilderController {

    private final RuleRepository ruleRepository;
    private final SchemeVersionRepository schemeVersionRepository;
    private final RuleEngineService ruleEngineService;

    @GetMapping("/version/{schemeVersionId}")
    public ResponseEntity<ApiResponse<List<Rule>>> getRulesByVersion(@PathVariable UUID schemeVersionId) {
        List<Rule> rules = ruleRepository.findBySchemeVersionIdAndIsActiveTrueOrderByPriorityAsc(schemeVersionId);
        return ResponseEntity.ok(ApiResponse.success(rules));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_MOTA_OFFICER')")
    public ResponseEntity<ApiResponse<Rule>> createRule(@RequestBody RuleCreateRequest request) {
        SchemeVersion version = schemeVersionRepository.findById(request.getSchemeVersionId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme version not found: " + request.getSchemeVersionId()));

        Rule rule = Rule.builder()
                .schemeVersion(version)
                .ruleCode(request.getRuleCode())
                .name(request.getName())
                .description(request.getDescription())
                .logicOperator(request.getLogicOperator() != null ? request.getLogicOperator() : "AND")
                .errorMessage(request.getErrorMessage())
                .priority(request.getPriority() != null ? request.getPriority() : 1)
                .isActive(true)
                .build();

        if (request.getConditions() != null) {
            Rule finalRule = rule;
            List<RuleCondition> conditions = request.getConditions().stream().map(c -> RuleCondition.builder()
                    .rule(finalRule)
                    .fieldPath(c.getFieldPath())
                    .operator(c.getOperator())
                    .expectedValue(c.getExpectedValue())
                    .valueType(c.getValueType() != null ? c.getValueType() : "STRING")
                    .build()).collect(Collectors.toList());
            rule.setConditions(conditions);
        }

        rule = ruleRepository.save(rule);
        return ResponseEntity.ok(ApiResponse.success("Rule created successfully in Scheme Studio", rule));
    }

    @PostMapping("/test-condition")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testCondition(@RequestBody ConditionTestRequest req) {
        boolean passed = ruleEngineService.evaluateCondition(req.getActualValue(), req.getOperator(), req.getExpectedValue(), req.getValueType());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "passed", passed,
                "operator", req.getOperator(),
                "actualValue", req.getActualValue(),
                "expectedValue", req.getExpectedValue()
        )));
    }

    @Data
    public static class RuleCreateRequest {
        private UUID schemeVersionId;
        private String ruleCode;
        private String name;
        private String description;
        private String logicOperator;
        private String errorMessage;
        private Integer priority;
        private List<ConditionCreateRequest> conditions;
    }

    @Data
    public static class ConditionCreateRequest {
        private String fieldPath;
        private String operator;
        private String expectedValue;
        private String valueType;
    }

    @Data
    public static class ConditionTestRequest {
        private String actualValue;
        private String operator;
        private String expectedValue;
        private String valueType;
    }
}
