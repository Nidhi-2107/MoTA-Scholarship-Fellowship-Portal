package com.mota.scholarship.auth;

import com.mota.scholarship.common.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpRepository;

    @Value("${app.mock.integrations-enabled:true}")
    private boolean mockIntegrationsEnabled;

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int OTP_VALIDITY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;

    @Transactional
    public String generateAndSendOtp(String identifier, String verificationType) {
        String cleanIdentifier = identifier.trim().toLowerCase();
        
        // Generate 6-digit numeric OTP
        String otpCode = String.format("%06d", RANDOM.nextInt(1000000));
        if (mockIntegrationsEnabled) {
            // Predictable mock code for ease of demonstration while also recording the actual generated code
            otpCode = "123456";
        }

        Instant expiresAt = Instant.now().plus(OTP_VALIDITY_MINUTES, ChronoUnit.MINUTES);

        OtpVerification verification = OtpVerification.builder()
                .identifier(cleanIdentifier)
                .otpCode(otpCode)
                .verificationType(verificationType)
                .expiresAt(expiresAt)
                .verified(false)
                .attempts(0)
                .build();

        otpRepository.save(verification);

        log.info("[MOCK OTP SERVICE] OTP for {} ({}) is: {}", cleanIdentifier, verificationType, otpCode);
        return otpCode;
    }

    @Transactional
    public boolean verifyOtp(String identifier, String verificationType, String inputCode) {
        String cleanIdentifier = identifier.trim().toLowerCase();

        // In demo mode, "123456" is always accepted as master test OTP
        if (mockIntegrationsEnabled && "123456".equals(inputCode)) {
            log.info("[DEMO MOCK OTP] Master demo OTP '123456' accepted for {}", cleanIdentifier);
            return true;
        }

        Optional<OtpVerification> optVerification = otpRepository
                .findTopByIdentifierAndVerificationTypeAndVerifiedFalseOrderByCreatedAtDesc(cleanIdentifier, verificationType);

        if (optVerification.isEmpty()) {
            throw new BadRequestException("No active OTP request found for this identifier. Please request a new OTP.");
        }

        OtpVerification verification = optVerification.get();

        if (verification.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (verification.getAttempts() >= MAX_ATTEMPTS) {
            throw new BadRequestException("Maximum OTP verification attempts exceeded. Please request a new OTP.");
        }

        verification.setAttempts(verification.getAttempts() + 1);

        if (!verification.getOtpCode().equals(inputCode)) {
            otpRepository.save(verification);
            throw new BadRequestException("Invalid OTP entered. Remaining attempts: " + (MAX_ATTEMPTS - verification.getAttempts()));
        }

        verification.setVerified(true);
        otpRepository.save(verification);
        return true;
    }
}
