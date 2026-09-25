package com.mota.scholarship.auth;

import com.mota.scholarship.common.ApiResponse;
import com.mota.scholarship.user.User;
import com.mota.scholarship.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration completed successfully", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Map<String, String>>> sendOtp(@Valid @RequestBody OtpRequest request) {
        String code = otpService.generateAndSendOtp(request.getIdentifier(), request.getVerificationType());
        Map<String, String> data = new HashMap<>();
        data.put("identifier", request.getIdentifier());
        data.put("status", "SENT");
        data.put("demoOtp", code); // Included for evaluation transparency in demo mode
        return ResponseEntity.ok(ApiResponse.success("OTP sent successfully to " + request.getIdentifier(), data));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        boolean verified = otpService.verifyOtp(request.getIdentifier(), request.getVerificationType(), request.getOtpCode());
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", Collections.singletonMap("verified", verified)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/demo-accounts")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getDemoAccounts() {
        List<Map<String, String>> accounts = new ArrayList<>();
        
        accounts.add(Map.of("role", "Applicant (ST Student)", "username", "applicant", "password", "Demo@123", "name", "Rahul Ramesh Munda (Jharkhand)"));
        accounts.add(Map.of("role", "Institute Officer", "username", "institute_officer", "password", "Demo@123", "name", "Prof. Arvind Kumar (NIT Bhopal)"));
        accounts.add(Map.of("role", "Scrutiny Officer", "username", "scrutiny_officer", "password", "Demo@123", "name", "Sunita Tekam (MoTA Scrutiny Cell)"));
        accounts.add(Map.of("role", "District Officer", "username", "district_officer", "password", "Demo@123", "name", "Rajesh Markam (DWO Mandla MP)"));
        accounts.add(Map.of("role", "State Welfare Officer", "username", "state_officer", "password", "Demo@123", "name", "Dr. Hemant Bhil (MP State Portal)"));
        accounts.add(Map.of("role", "Ministry Officer", "username", "mota_officer", "password", "Demo@123", "name", "Vikramaditya Gond (MoTA Director)"));
        accounts.add(Map.of("role", "Selection Committee", "username", "selection_committee", "password", "Demo@123", "name", "Prof. K. Minz (NFST/NOS Panel)"));
        accounts.add(Map.of("role", "Platform Administrator", "username", "admin", "password", "Demo@123", "name", "MoTA Portal Administrator"));
        accounts.add(Map.of("role", "Super Administrator", "username", "super_admin", "password", "Demo@123", "name", "National Super Administrator"));

        return ResponseEntity.ok(ApiResponse.success("Demo credentials loaded (Password is Demo@123 for all)", accounts));
    }
}
