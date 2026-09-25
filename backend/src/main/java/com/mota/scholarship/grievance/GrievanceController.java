package com.mota.scholarship.grievance;

import com.mota.scholarship.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/grievances")
@RequiredArgsConstructor
public class GrievanceController {

    private final GrievanceService grievanceService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<GrievanceDtos.GrievanceDto>> createGrievance(
            @RequestBody GrievanceDtos.CreateGrievanceRequest request, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                "Grievance submitted", grievanceService.createGrievance(request, auth.getName())));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<GrievanceDtos.GrievanceDto>>> getMyGrievances(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                "Success", grievanceService.getMyGrievances(auth.getName())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<GrievanceDtos.GrievanceDto>> getGrievance(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Success", grievanceService.getGrievanceById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<GrievanceDtos.GrievanceDto>>> getAllGrievances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                "Success", grievanceService.getAllGrievances(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<GrievanceDtos.GrievanceDto>> updateGrievance(
            @PathVariable UUID id,
            @RequestBody GrievanceDtos.UpdateGrievanceRequest request, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                "Grievance updated", grievanceService.updateGrievance(id, request, auth.getName())));
    }
}
