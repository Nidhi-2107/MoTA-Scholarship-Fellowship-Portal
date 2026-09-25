package com.mota.scholarship;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class BcryptTest {
    @Test
    void testBcryptHash() {
        PasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String rawPassword = "Demo@123";
        
        // Generate the correct hash
        String correctHash = encoder.encode(rawPassword);
        System.out.println("Correct hash for 'Demo@123': " + correctHash);
        
        // Verify it matches
        boolean matches = encoder.matches(rawPassword, correctHash);
        System.out.println("Matches: " + matches);
        assertTrue(matches);
    }
}