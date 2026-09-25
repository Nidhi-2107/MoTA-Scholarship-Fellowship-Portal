package com.mota.scholarship.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    private UUID id;
    private UUID userId;
    private String documentType;
    private String fileName;
    private Long fileSize;
    private String mimeType;
    private String downloadUrl;
    private String sha256Hash;
    private Instant createdAt;
}
