package com.mota.scholarship.scheme;

import com.mota.scholarship.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/schemes", "/api/schemes"})
@RequiredArgsConstructor
public class SchemeController {

    private final SchemeService schemeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchemeDto>>> getAllSchemes() {
        List<SchemeDto> schemes = schemeService.getAllActiveSchemes();
        return ResponseEntity.ok(ApiResponse.success(schemes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchemeDto>> getSchemeById(@PathVariable UUID id) {
        SchemeDto scheme = schemeService.getSchemeById(id);
        return ResponseEntity.ok(ApiResponse.success(scheme));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<SchemeDto>> getSchemeByCode(@PathVariable String code) {
        SchemeDto scheme = schemeService.getSchemeByCode(code);
        return ResponseEntity.ok(ApiResponse.success(scheme));
    }

    @GetMapping("/versions/{versionId}")
    public ResponseEntity<ApiResponse<SchemeDto.SchemeVersionDto>> getSchemeVersion(@PathVariable UUID versionId) {
        SchemeDto.SchemeVersionDto version = schemeService.getSchemeVersion(versionId);
        return ResponseEntity.ok(ApiResponse.success(version));
    }

    @PostMapping("/discover")
    public ResponseEntity<ApiResponse<List<SchemeDiscoveryResultDto>>> discoverSchemes(@RequestBody SchemeDiscoveryRequest request) {
        List<SchemeDiscoveryResultDto> matches = schemeService.discoverSchemes(request);
        return ResponseEntity.ok(ApiResponse.success("Discovered " + matches.size() + " applicable schemes", matches));
    }
}
