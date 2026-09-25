package com.mota.scholarship.applicant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "applicant_educations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private ApplicantProfile profile;

    @Column(name = "education_level", nullable = false, length = 50)
    private String educationLevel; // CLASS_IX, CLASS_X, CLASS_XII, UNDERGRADUATE, POSTGRADUATE, MPHIL_PHD

    @Column(name = "institution_name", nullable = false)
    private String institutionName;

    @Column(name = "institution_code", length = 50)
    private String institutionCode;

    @Column(name = "university_board", nullable = false, length = 200)
    private String universityBoard;

    @Column(name = "course_name", nullable = false, length = 150)
    private String courseName;

    @Column(name = "passing_year", nullable = false)
    private Integer passingYear;

    @Column(name = "marks_percentage", precision = 5, scale = 2)
    private BigDecimal marksPercentage;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "roll_number", length = 50)
    private String rollNumber;

    @Column(name = "is_current")
    @Builder.Default
    private Boolean isCurrent = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
