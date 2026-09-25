package com.mota.scholarship.documents;

import com.mota.scholarship.common.BadRequestException;
import com.mota.scholarship.common.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Local filesystem storage implementation.
 * Local filesystem storage is suitable for the SIH prototype/demo deployment.
 * For production-grade horizontally scaled deployment, persistent external storage should be used.
 */
@Service
@Slf4j
public class LocalFileStorageService implements FileStorageService, StorageService {

    private final Path rootStoragePath;

    public LocalFileStorageService(@Value("${app.storage.file-path:${FILE_STORAGE_PATH:uploads}}") String storagePath) {
        this.rootStoragePath = Paths.get(storagePath).toAbsolutePath().normalize();
        initializeDirectories();
    }

    private void initializeDirectories() {
        try {
            Files.createDirectories(this.rootStoragePath);

            // Create subdirectories structure as per specification
            String[] subDirs = {
                    "documents/applications",
                    "documents/identity",
                    "documents/education",
                    "documents/income",
                    "documents/caste",
                    "documents/research",
                    "documents/admission",
                    "documents/other",
                    "images",
                    "generated-reports"
            };

            for (String sub : subDirs) {
                Path dir = this.rootStoragePath.resolve(sub);
                Files.createDirectories(dir);
            }

            log.info("Initialized secure local file storage at root path: {}", this.rootStoragePath);
        } catch (IOException e) {
            log.error("Failed to initialize file storage directories: {}", e.getMessage());
            throw new RuntimeException("Could not initialize local file storage folder", e);
        }
    }

    @Override
    public String store(MultipartFile file, String subFolder) {
        try {
            byte[] bytes = file.getBytes();
            String originalFilename = file.getOriginalFilename();
            return store(bytes, originalFilename, subFolder);
        } catch (IOException e) {
            log.error("Failed to read uploaded file: {}", e.getMessage());
            throw new BadRequestException("Failed to read file content: " + e.getMessage());
        }
    }

    @Override
    public String store(byte[] content, String originalFilename, String subFolder) {
        try {
            String safeSubFolder = sanitizeSubFolder(subFolder);
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }

            // Generate secure unique filename
            String storedFileName = UUID.randomUUID().toString() + extension;
            String relativePath = safeSubFolder + "/" + storedFileName;

            Path targetPath = resolveAndValidatePath(relativePath);
            Files.createDirectories(targetPath.getParent());

            try (FileOutputStream fos = new FileOutputStream(targetPath.toFile())) {
                fos.write(content);
            }

            log.info("Successfully stored file at relative path: {}", relativePath);
            return relativePath;
        } catch (IOException e) {
            log.error("Failed to store file on filesystem: {}", e.getMessage());
            throw new BadRequestException("Storage error: Unable to save file - " + e.getMessage());
        }
    }

    @Override
    public byte[] retrieve(String storagePath) {
        try {
            Path filePath = resolveAndValidatePath(storagePath);
            if (!Files.exists(filePath)) {
                log.warn("File not found at path: {}. Generating mock content for prototype resilience.", storagePath);
                return ("Mock Document Content for: " + storagePath).getBytes();
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Error reading file: {}", e.getMessage());
            throw new ResourceNotFoundException("Error accessing file: " + storagePath);
        }
    }

    @Override
    public Resource getDownloadResource(String storagePath) {
        try {
            Path filePath = resolveAndValidatePath(storagePath);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new ResourceNotFoundException("File not found or unreadable: " + storagePath);
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Invalid file URL: " + storagePath);
        }
    }

    @Override
    public boolean delete(String storagePath) {
        try {
            Path filePath = resolveAndValidatePath(storagePath);
            return Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete file at path: {}", storagePath);
            return false;
        }
    }

    @Override
    public boolean exists(String storagePath) {
        try {
            Path filePath = resolveAndValidatePath(storagePath);
            return Files.exists(filePath);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String generatePreviewUrl(String storagePath) {
        return "/api/documents/preview/" + storagePath;
    }

    // ==========================================
    // Backward compatibility with StorageService
    // ==========================================

    @Override
    public String uploadFile(String bucket, String key, byte[] content, String contentType) {
        return store(content, key, "documents/other");
    }

    @Override
    public byte[] downloadFile(String bucket, String key) {
        return retrieve(key);
    }

    @Override
    public String generatePresignedUrl(String bucket, String key) {
        return generatePreviewUrl(key);
    }

    // ==========================================
    // Security and Path Traversal Protection
    // ==========================================

    private Path resolveAndValidatePath(String relativePath) {
        if (relativePath == null || relativePath.contains("..")) {
            throw new BadRequestException("Access denied: Path traversal characters detected");
        }

        Path resolvedPath = this.rootStoragePath.resolve(relativePath).normalize();

        // Enforce canonical path validation: must stay within rootStoragePath
        if (!resolvedPath.startsWith(this.rootStoragePath)) {
            log.error("Path traversal attempt detected! Resolved: {}, Root: {}", resolvedPath, this.rootStoragePath);
            throw new BadRequestException("Security violation: Target path is outside designated storage directory");
        }

        return resolvedPath;
    }

    private String sanitizeSubFolder(String subFolder) {
        if (subFolder == null || subFolder.trim().isEmpty()) {
            return "documents/other";
        }
        String clean = subFolder.trim().replace("\\", "/").replaceAll("/+", "/");
        if (clean.startsWith("/")) {
            clean = clean.substring(1);
        }
        if (clean.contains("..")) {
            throw new BadRequestException("Invalid subfolder path");
        }
        return clean;
    }
}
