package com.mota.scholarship.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ApplicationDtos {

    @Data
    @Builder
    public static class ApplicationDto {
        private UUID id;
        private String applicationNumber;
        private String status;
        private String currentStage;
        private Instant submissionDate;
        private Instant createdAt;
        private Instant updatedAt;
        private String remarks;
        private String schemeName;
        private String schemeCode;
        private UUID schemeId;
        private String applicantName;
        private String applicantEmail;
        private String applicantPhone;
        private List<FieldValueDto> fieldValues;
        private List<ApplicationDocumentDto> documents;
    }

    @Data
    @Builder
    public static class ApplicationDocumentDto {
        private UUID id;
        private String documentType;
        private String verificationStatus;
        private String verificationRemarks;
        private String verifiedBy;
        private Instant verifiedAt;
        private String documentUrl;
        private String originalFilename;
    }

    @Data
    @Builder
    public static class FieldValueDto {
        private String fieldName;
        private String fieldValue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateApplicationRequest {
        private UUID schemeId;
        private Map<String, String> fieldValues;

        public UUID getSchemeId() {
            return schemeId;
        }

        public void setSchemeId(UUID schemeId) {
            this.schemeId = schemeId;
        }

        public Map<String, String> getFieldValues() {
            return fieldValues;
        }

        public void setFieldValues(Map<String, String> fieldValues) {
            this.fieldValues = fieldValues;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateApplicationRequest {
        private Map<String, String> fieldValues;
        private String remarks;

        public Map<String, String> getFieldValues() {
            return fieldValues;
        }

        public void setFieldValues(Map<String, String> fieldValues) {
            this.fieldValues = fieldValues;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OfficerActionRequest {
        private String action;   // APPROVE, REJECT, DEFICIENCY, FORWARD
        private String remarks;
        private List<String> deficientDocumentTypes;

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public List<String> getDeficientDocumentTypes() {
            return deficientDocumentTypes;
        }

        public void setDeficientDocumentTypes(List<String> deficientDocumentTypes) {
            this.deficientDocumentTypes = deficientDocumentTypes;
        }
    }

    @Data
    @Builder
    public static class DashboardStatsDto {
        private long totalApplications;
        private long draftApplications;
        private long submittedApplications;
        private long verifiedApplications;
        private long approvedApplications;
        private long disbursedApplications;
        private long rejectedApplications;
        private long deficientApplications;
    }
}
