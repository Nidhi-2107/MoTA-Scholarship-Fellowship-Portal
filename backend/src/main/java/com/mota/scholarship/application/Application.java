package com.mota.scholarship.application;

import com.mota.scholarship.applicant.ApplicantProfile;
import com.mota.scholarship.scheme.SchemeVersion;
import com.mota.scholarship.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "application_number", nullable = false, unique = true, length = 50)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_profile_id", nullable = false)
    private ApplicantProfile applicantProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_version_id", nullable = false)
    private SchemeVersion schemeVersion;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "current_stage", nullable = false, length = 50)
    @Builder.Default
    private String currentStage = "DRAFT";

    @Column(name = "submission_date")
    private Instant submissionDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplicationFieldValue> fieldValues = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplicationDocument> documents = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
