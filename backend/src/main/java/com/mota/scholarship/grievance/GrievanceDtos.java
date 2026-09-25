package com.mota.scholarship.grievance;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

public class GrievanceDtos {

    @Data
    @Builder
    public static class GrievanceDto {
        private UUID id;
        private String ticketNumber;
        private String category;
        private String subject;
        private String description;
        private String status;
        private String priority;
        private String assignedTo;
        private String resolutionRemarks;
        private Instant resolvedAt;
        private Instant createdAt;
        private Instant updatedAt;
        private UUID applicationId;
        private String applicantName;
        private String applicantEmail;
    }

    @Data
    public static class CreateGrievanceRequest {
        private String category;
        private String subject;
        private String description;
        private UUID applicationId;
        private String priority;
    }

    @Data
    public static class UpdateGrievanceRequest {
        private String status;
        private String resolutionRemarks;
        private String assignedTo;
        private String priority;
    }
}
