package com.mota.scholarship.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UUID userId;
    private String username;
    private String fullName;
    private String email;
    private String mobile;
    private String role;
}
