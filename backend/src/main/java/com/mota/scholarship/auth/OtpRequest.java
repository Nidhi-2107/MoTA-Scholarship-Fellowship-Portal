package com.mota.scholarship.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequest {

    @NotBlank(message = "Identifier (mobile or email) is required")
    private String identifier;

    @NotBlank(message = "Verification type is required")
    private String verificationType; // REGISTRATION, LOGIN, PASSWORD_RESET
}
