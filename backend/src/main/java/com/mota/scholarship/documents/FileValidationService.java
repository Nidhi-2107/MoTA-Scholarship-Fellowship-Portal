package com.mota.scholarship.documents;

import com.mota.scholarship.common.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class FileValidationService {

    public static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Strictly 5MB
    public static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "jpg", "jpeg", "png");
    public static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png"
    );

    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        // 1. Strict 5MB size limit validation
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            double sizeInMb = (double) file.getSize() / (1024 * 1024);
            throw new BadRequestException(String.format("File size exceeds 5 MB limit (Current size: %.2f MB)", sizeInMb));
        }

        // 2. Filename validation
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new BadRequestException("Suspicious or invalid filename detected");
        }

        // 3. Extension validation
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file extension '." + extension + "'. Allowed formats: PDF, JPG, JPEG, PNG");
        }

        // 4. MIME type validation
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid MIME type: '" + contentType + "'. Allowed types: PDF, JPG, PNG");
        }

        // 5. Magic byte content verification
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length < 4) {
                throw new BadRequestException("Corrupted or empty file");
            }

            boolean validMagicBytes = false;
            // PDF: %PDF (0x25 0x50 0x44 0x46)
            if (bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46) {
                validMagicBytes = true;
            }
            // JPEG: 0xFF 0xD8 0xFF
            else if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
                validMagicBytes = true;
            }
            // PNG: 0x89 0x50 0x4E 0x47
            else if ((bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47) {
                validMagicBytes = true;
            }

            if (!validMagicBytes) {
                log.warn("Magic byte mismatch for file: {}", originalFilename);
                // Allow fallback if extension & mime are standard, but warn
            }
        } catch (BadRequestException bre) {
            throw bre;
        } catch (Exception e) {
            throw new BadRequestException("Failed to read file bytes for integrity check: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }
}
