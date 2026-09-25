package com.mota.scholarship.auth;

import com.mota.scholarship.applicant.ApplicantProfile;
import com.mota.scholarship.applicant.ApplicantProfileRepository;
import com.mota.scholarship.common.BadRequestException;
import com.mota.scholarship.common.ResourceNotFoundException;
import com.mota.scholarship.common.UnauthorizedException;
import com.mota.scholarship.config.JwtTokenProvider;
import com.mota.scholarship.user.Role;
import com.mota.scholarship.user.RoleRepository;
import com.mota.scholarship.user.User;
import com.mota.scholarship.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final OtpService otpService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate via AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(role)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number '" + request.getMobile() + "' is already registered");
        }

        // Verify registration OTP if provided
        if (request.getOtpCode() != null && !request.getOtpCode().isBlank()) {
            otpService.verifyOtp(request.getMobile(), "REGISTRATION", request.getOtpCode());
        }

        Role applicantRole = roleRepository.findById("ROLE_APPLICANT")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .id("ROLE_APPLICANT")
                        .name("Applicant")
                        .description("Default Applicant Role")
                        .build()));

        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(applicantRole)
                .isActive(true)
                .isVerified(true)
                .build();

        user = userRepository.save(user);

        // Create default empty profile for the new applicant
        ApplicantProfile profile = ApplicantProfile.builder()
                .user(user)
                .dateOfBirth(LocalDate.of(2003, 1, 1))
                .gender("Not Specified")
                .stCasteName("Scheduled Tribe")
                .pvtgStatus(false)
                .disabilityStatus(false)
                .addressLine("To be completed in profile")
                .stateCode("IN")
                .stateName("Not Specified")
                .districtName("Not Specified")
                .pinCode("000000")
                .familyAnnualIncome(BigDecimal.ZERO)
                .dbtEnabled(false)
                .otrStatus("NOT_LINKED")
                .build();

        applicantProfileRepository.save(profile);

        String token = tokenProvider.generateTokenFromUsername(user.getUsername(), "ROLE_APPLICANT");
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role("ROLE_APPLICANT")
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String username = tokenProvider.getUsernameFromRefreshToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for refresh token"));

        String newToken = tokenProvider.generateTokenFromUsername(user.getUsername(), user.getRole().getId());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole().getId())
                .build();
    }
}
