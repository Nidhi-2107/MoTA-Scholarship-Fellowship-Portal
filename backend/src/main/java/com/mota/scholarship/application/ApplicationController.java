package com.mota.scholarship.application;

import com.mota.scholarship.common.ApiResponse;
import com.mota.scholarship.rules.RuleEvaluationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // ======== Applicant Endpoints ========

    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ApplicationDtos.ApplicationDto>> createDraft(
            @RequestBody ApplicationDtos.CreateApplicationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Draft application created",
                applicationService.createDraftApplication(request, authentication.getName())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ApplicationDtos.ApplicationDto>> updateApplication(
            @PathVariable UUID id,
            @RequestBody ApplicationDtos.UpdateApplicationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Application updated",
                applicationService.updateApplication(id, request, authentication.getName())));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<ApplicationDtos.ApplicationDto>> submitApplication(
            @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Application submitted successfully",
                applicationService.submitApplication(id, authentication.getName())));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<List<ApplicationDtos.ApplicationDto>>> getMyApplications(
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Success",
                applicationService.getMyApplications(authentication.getName())));
    }

    // ======== Officer / Admin Endpoints ========

    @GetMapping
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SCRUTINY_OFFICER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<ApplicationDtos.ApplicationDto>>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submissionDate").descending());
        return ResponseEntity.ok(ApiResponse.success(
                "Success",
                applicationService.getAllApplications(pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ApplicationDtos.ApplicationDto>> getApplicationById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Success",
                applicationService.getApplicationById(id)));
    }

    @PostMapping("/{id}/eligibility-check")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SCRUTINY_OFFICER', 'SUPER_ADMIN', 'APPLICANT')")
    public ResponseEntity<ApiResponse<RuleEvaluationDto>> runEligibilityCheck(
            @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Eligibility check completed",
                applicationService.runEligibilityCheck(id, authentication.getName())));
    }

    @PostMapping("/{id}/action")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SCRUTINY_OFFICER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDtos.ApplicationDto>> officerAction(
            @PathVariable UUID id,
            @RequestBody ApplicationDtos.OfficerActionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Action performed successfully",
                applicationService.officerAction(id, request, authentication.getName())));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SCRUTINY_OFFICER', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDtos.DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(
                "Success",
                applicationService.getDashboardStats()));
    }
}
