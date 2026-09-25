package com.mota.scholarship.documents;

public interface StorageService {
    String uploadFile(String bucket, String key, byte[] content, String contentType);
    byte[] downloadFile(String bucket, String key);
    String generatePresignedUrl(String bucket, String key);
}
