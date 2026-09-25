package com.mota.scholarship.applicant;

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
public class ApplicantProfileDto {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String mobile;
    private LocalDate dateOfBirth;
    private String gender;
    private String aadhaarMasked;
    private String stCasteName;
    private Boolean pvtgStatus;
    private Boolean disabilityStatus;
    private String addressLine;
    private String stateCode;
    private String stateName;
    private String districtName;
    private String pinCode;
    private BigDecimal familyAnnualIncome;
    private String bankAccountMasked;
    private String ifscCode;
    private String bankName;
    private Boolean dbtEnabled;
    private String otrNumber;
    private String otrStatus;
    private List<ApplicantEducationDto> educations;
}
