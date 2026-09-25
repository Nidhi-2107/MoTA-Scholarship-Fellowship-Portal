package com.mota.scholarship.documents;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file, String subFolder);
    String store(byte[] content, String fileName, String subFolder);
    byte[] retrieve(String storagePath);
    Resource getDownloadResource(String storagePath);
    boolean delete(String storagePath);
    boolean exists(String storagePath);
    String generatePreviewUrl(String storagePath);
}
