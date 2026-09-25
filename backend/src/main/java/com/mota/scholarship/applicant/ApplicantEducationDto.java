package com.mota.scholarship.applicant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantEducationDto {
    private UUID id;
    private String educationLevel;
    private String institutionName;
    private String institutionCode;
    private String universityBoard;
    private String courseName;
    private Integer passingYear;
    private BigDecimal marksPercentage;
    private BigDecimal cgpa;
    private String rollNumber;
    private Boolean isCurrent;
}
