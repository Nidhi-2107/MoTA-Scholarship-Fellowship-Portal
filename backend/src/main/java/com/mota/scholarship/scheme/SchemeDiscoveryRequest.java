package com.mota.scholarship.scheme;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDiscoveryRequest {
    private String educationLevel; // CLASS_IX, CLASS_X, CLASS_XII, UNDERGRADUATE, POSTGRADUATE, MPHIL_PHD
    private String courseName;
    private String institutionName;
    private String academicYear;
    private String stateCode;
    private String districtName;
    private BigDecimal familyAnnualIncome;
    private String category; // ST, SC, OBC, GENERAL
    private Boolean isResearchEnrolled; // For NFST
    private Boolean isOverseasEnrolled; // For NOS
    private BigDecimal marksPercentage;
}
