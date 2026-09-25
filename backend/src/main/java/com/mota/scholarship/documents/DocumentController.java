package com.mota.scholarship.documents;

import com.mota.scholarship.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/documents", "/api/documents"})
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {

        DocumentDto doc = documentService.uploadDocument(userDetails.getUsername(), documentType, file);
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", doc));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getMyDocuments(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<DocumentDto> docs = documentService.getUserDocuments(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable UUID id) {
        Document doc = documentService.getDocumentById(id);
        byte[] data = documentService.downloadDocumentBytes(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getMimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(data);
    }
}
