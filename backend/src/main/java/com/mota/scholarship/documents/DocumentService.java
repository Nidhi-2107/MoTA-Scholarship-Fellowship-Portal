package com.mota.scholarship.documents;

import com.mota.scholarship.common.ResourceNotFoundException;
import com.mota.scholarship.user.User;
import com.mota.scholarship.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileValidationService fileValidationService;
    private final FileStorageService fileStorageService;

    @Transactional
    public DocumentDto uploadDocument(String username, String documentType, MultipartFile file) {
        // 1. Validate file (5MB, MIME, extension, magic bytes)
        fileValidationService.validateFile(file);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        try {
            byte[] fileBytes = file.getBytes();

            // Compute SHA-256 checksum
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String sha256 = HexFormat.of().formatHex(digest.digest(fileBytes));

            // Determine appropriate subfolder based on document type
            String subFolder = resolveSubFolder(documentType);

            // Store in local filesystem storage
            String storageKey = fileStorageService.store(fileBytes, file.getOriginalFilename(), subFolder);

            Document doc = Document.builder()
                    .user(user)
                    .documentType(documentType)
                    .fileName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .mimeType(file.getContentType())
                    .storageKey(storageKey)
                    .storageBucket("local-filesystem")
                    .sha256Hash(sha256)
                    .build();

            doc = documentRepository.save(doc);

            log.info("Document successfully uploaded & recorded in MySQL: id={}, type={}, path={}",
                    doc.getId(), doc.getDocumentType(), storageKey);
            return mapToDto(doc);
        } catch (Exception e) {
            log.error("Failed to process document upload: {}", e.getMessage());
            throw new RuntimeException("Document processing error: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<DocumentDto> getUserDocuments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return documentRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Document getDocumentById(UUID id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public byte[] downloadDocumentBytes(UUID id) {
        Document doc = getDocumentById(id);
        return fileStorageService.retrieve(doc.getStorageKey());
    }

    public DocumentDto mapToDto(Document doc) {
        String downloadUrl = fileStorageService.generatePreviewUrl(doc.getStorageKey());
        return DocumentDto.builder()
                .id(doc.getId())
                .userId(doc.getUser().getId())
                .documentType(doc.getDocumentType())
                .fileName(doc.getFileName())
                .fileSize(doc.getFileSize())
                .mimeType(doc.getMimeType())
                .downloadUrl(downloadUrl)
                .sha256Hash(doc.getSha256Hash())
                .createdAt(doc.getCreatedAt())
                .build();
    }

    private String resolveSubFolder(String documentType) {
        if (documentType == null) return "documents/other";
        String type = documentType.toUpperCase();
        if (type.contains("INCOME")) return "documents/income";
        if (type.contains("CASTE") || type.contains("TRIBE")) return "documents/caste";
        if (type.contains("AADHAAR") || type.contains("IDENTITY")) return "documents/identity";
        if (type.contains("MARKSHEET") || type.contains("DEGREE") || type.contains("EDUCATION")) return "documents/education";
        if (type.contains("ADMISSION") || type.contains("FEE") || type.contains("BONAFIDE")) return "documents/admission";
        if (type.contains("RESEARCH") || type.contains("PROPOSAL")) return "documents/research";
        return "documents/applications";
    }
}
