package com.mota.scholarship.applicant;

import com.mota.scholarship.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/applicants", "/api/applicants"})
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ApplicantProfileDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        ApplicantProfileDto profile = applicantService.getProfileByUsername(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ApplicantProfileDto>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ApplicantProfileDto dto) {
        ApplicantProfileDto updated = applicantService.updateProfile(userDetails.getUsername(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/otr/link")
    public ResponseEntity<ApiResponse<ApplicantProfileDto>> linkOtr(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) Map<String, String> body) {
        String mockOtr = body != null ? body.get("otrNumber") : null;
        ApplicantProfileDto updated = applicantService.linkMockOtr(userDetails.getUsername(), mockOtr);
        return ResponseEntity.ok(ApiResponse.success("OTR linked and verified successfully (DEMO / MOCK)", updated));
    }
}
