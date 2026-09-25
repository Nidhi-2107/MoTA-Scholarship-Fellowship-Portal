package com.mota.scholarship.scheme;

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
@Table(name = "schemes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // PRE_MATRIC, POST_MATRIC, TOP_CLASS, FELLOWSHIP, OVERSEAS

    @Column(nullable = false, columnDefinition = "TEXT")
    private String objective;

    @Column(length = 150)
    @Builder.Default
    private String ministry = "Ministry of Tribal Affairs";

    @Column(name = "portal_url", length = 255)
    private String portalUrl;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SchemeVersion> versions = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public boolean isActive() {
        return Boolean.TRUE.equals(isActive);
    }

    public String getSchemeCode() {
        return code;
    }

    public String getSchemeName() {
        return name;
    }
}
