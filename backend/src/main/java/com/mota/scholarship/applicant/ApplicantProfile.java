package com.mota.scholarship.applicant;

import com.mota.scholarship.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "applicant_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(name = "aadhaar_masked", length = 20)
    private String aadhaarMasked;

    @Column(name = "st_caste_name", nullable = false, length = 100)
    private String stCasteName;

    @Column(name = "pvtg_status")
    @Builder.Default
    private Boolean pvtgStatus = false;

    @Column(name = "disability_status")
    @Builder.Default
    private Boolean disabilityStatus = false;

    @Column(name = "address_line", nullable = false, columnDefinition = "TEXT")
    private String addressLine;

    @Column(name = "state_code", nullable = false, length = 10)
    private String stateCode;

    @Column(name = "state_name", nullable = false, length = 100)
    private String stateName;

    @Column(name = "district_name", nullable = false, length = 100)
    private String districtName;

    @Column(name = "pin_code", nullable = false, length = 10)
    private String pinCode;

    @Column(name = "family_annual_income", nullable = false, precision = 12, scale = 2)
    private BigDecimal familyAnnualIncome;

    @Column(name = "bank_account_masked", length = 30)
    private String bankAccountMasked;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "dbt_enabled")
    @Builder.Default
    private Boolean dbtEnabled = false;

    @Column(name = "otr_number", length = 50)
    private String otrNumber;

    @Column(name = "otr_status", length = 30)
    @Builder.Default
    private String otrStatus = "NOT_LINKED"; // NOT_LINKED, PENDING, VERIFIED, FAILED, EXPIRED

    public String getOtrNumber() {
        return otrNumber;
    }

    public void setOtrNumber(String otrNumber) {
        this.otrNumber = otrNumber;
    }

    public String getOtrStatus() {
        return otrStatus;
    }

    public void setOtrStatus(String otrStatus) {
        this.otrStatus = otrStatus;
    }

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplicantEducation> educations = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public String getFullName() {
        return user != null ? user.getFullName() : null;
    }

    public String getMobile() {
        return user != null ? user.getMobile() : null;
    }
}
