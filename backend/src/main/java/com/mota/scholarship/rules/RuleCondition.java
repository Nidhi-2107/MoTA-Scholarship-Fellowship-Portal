package com.mota.scholarship.rules;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "rule_conditions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = false)
    private Rule rule;

    @Column(name = "field_path", nullable = false, length = 100)
    private String fieldPath; // e.g. profile.familyAnnualIncome, profile.category, education.marksPercentage

    @Column(nullable = false, length = 20)
    private String operator; // =, ==, !=, >, <, >=, <=, IN, NOT_IN, CONTAINS, BETWEEN

    @Column(name = "expected_value", nullable = false, columnDefinition = "TEXT")
    private String expectedValue;

    @Column(name = "value_type", length = 30)
    @Builder.Default
    private String valueType = "STRING"; // NUMBER, STRING, BOOLEAN
}
