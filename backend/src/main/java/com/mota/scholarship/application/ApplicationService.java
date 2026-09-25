package com.mota.scholarship.application;

import com.mota.scholarship.applicant.ApplicantProfile;
import com.mota.scholarship.applicant.ApplicantProfileRepository;
import com.mota.scholarship.common.BadRequestException;
import com.mota.scholarship.common.ResourceNotFoundException;
import com.mota.scholarship.documents.Document;
import com.mota.scholarship.documents.DocumentRepository;
import com.mota.scholarship.rules.RuleEvaluationDto;
import com.mota.scholarship.rules.RuleEngineService;
import com.mota.scholarship.scheme.*;
import com.mota.scholarship.user.User;
import com.mota.scholarship.user.UserRepository;
import com.mota.scholarship.workflow.ApplicationStatus;
import com.mota.scholarship.workflow.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository applicationDocumentRepository;
    private final ApplicantProfileRepository applicantProfileRepository;
    private final SchemeRepository schemeRepository;
    private final SchemeVersionRepository schemeVersionRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final WorkflowService workflowService;
    private final RuleEngineService ruleEngineService;

    @Transactional
    public ApplicationDtos.ApplicationDto createDraftApplication(ApplicationDtos.CreateApplicationRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Scheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        if (!scheme.isActive()) {
            throw new BadRequestException("Scheme is not currently accepting applications");
        }

        // Check for duplicate active application
        boolean hasDuplicate = applicationRepository.existsByUserIdAndSchemeVersionSchemeIdAndStatusNotIn(
                user.getId(), scheme.getId(), List.of("NOT_SELECTED", "REJECTED"));
        if (hasDuplicate) {
            throw new BadRequestException("You already have an active application for this scheme");
        }

        ApplicantProfile profile = applicantProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Please complete your applicant profile first"));

        SchemeVersion latestVersion = schemeVersionRepository
                .findTopBySchemeIdAndIsActiveTrueOrderByVersionNumberDesc(scheme.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No active scheme version found"));

        String appNumber = generateApplicationNumber(scheme.getSchemeCode());

        Application application = Application.builder()
                .applicationNumber(appNumber)
                .user(user)
                .applicantProfile(profile)
                .schemeVersion(latestVersion)
                .status("DRAFT")
                .currentStage("DRAFT")
                .build();

        // Save field values
        if (request.getFieldValues() != null) {
            List<ApplicationFieldValue> fieldValues = request.getFieldValues().entrySet().stream()
                    .map(e -> ApplicationFieldValue.builder()
                            .application(application)
                            .fieldName(e.getKey())
                            .fieldValue(e.getValue())
                            .build())
                    .collect(Collectors.toList());
            application.setFieldValues(fieldValues);
        }

        Application saved = applicationRepository.save(application);
        log.info("Draft application created: {} for user: {}", appNumber, username);
        return toDto(saved);
    }

    @Transactional
    public ApplicationDtos.ApplicationDto updateApplication(UUID applicationId, ApplicationDtos.UpdateApplicationRequest request, String username) {
        Application application = getApplicationForUser(applicationId, username);

        if (!List.of("DRAFT", "APPLICANT_RESUBMISSION").contains(application.getStatus())) {
            throw new BadRequestException("Application cannot be edited in current status: " + application.getStatus());
        }

        if (request.getFieldValues() != null) {
            application.getFieldValues().clear();
            request.getFieldValues().forEach((k, v) ->
                    application.getFieldValues().add(ApplicationFieldValue.builder()
                            .application(application)
                            .fieldName(k)
                            .fieldValue(v)
                            .build()));
        }

        if (request.getRemarks() != null) {
            application.setRemarks(request.getRemarks());
        }

        return toDto(applicationRepository.save(application));
    }

    @Transactional
    public ApplicationDtos.ApplicationDto submitApplication(UUID applicationId, String username) {
        Application application = getApplicationForUser(applicationId, username);

        if (!List.of("DRAFT", "APPLICANT_RESUBMISSION").contains(application.getStatus())) {
            throw new BadRequestException("Application is not in a submittable state");
        }

        String prevStatus = application.getStatus();
        application.setStatus("SUBMITTED");
        application.setCurrentStage("SUBMITTED");
        application.setSubmissionDate(Instant.now());

        Application saved = applicationRepository.save(application);
        workflowService.recordTransition(applicationId,
                ApplicationStatus.valueOf(prevStatus.equals("APPLICANT_RESUBMISSION") ? "APPLICANT_RESUBMISSION" : "DRAFT"),
                ApplicationStatus.SUBMITTED, username, "Application submitted by applicant");

        log.info("Application submitted: {}", applicationId);
        return toDto(saved);
    }

    @Transactional
    public RuleEvaluationDto runEligibilityCheck(UUID applicationId, String username) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        ApplicantProfile profile = application.getApplicantProfile();
        com.mota.scholarship.applicant.ApplicantEducation currentEdu =
                profile.getEducations().isEmpty() ? null : profile.getEducations().get(profile.getEducations().size() - 1);

        Map<String, String> fieldValues = application.getFieldValues().stream()
                .collect(Collectors.toMap(ApplicationFieldValue::getFieldName, ApplicationFieldValue::getFieldValue));

        RuleEvaluationDto result = ruleEngineService.evaluateApplication(
                application.getSchemeVersion().getId(), profile, currentEdu, fieldValues, Map.of());

        // Transition status
        if (result.isEligible()) {
            String prevStatus = application.getStatus();
            application.setStatus("ELIGIBILITY_VERIFIED");
            application.setCurrentStage("ELIGIBILITY_VERIFIED");
            applicationRepository.save(application);
            workflowService.recordTransition(applicationId,
                    ApplicationStatus.valueOf(prevStatus), ApplicationStatus.ELIGIBILITY_VERIFIED,
                    username != null ? username : "system", "Automated eligibility check passed");
        } else {
            String prevStatus = application.getStatus();
            application.setStatus("DEFICIENT");
            application.setCurrentStage("DEFICIENT");
            application.setRemarks("Eligibility check failed: " + result.getSummary());
            applicationRepository.save(application);
            workflowService.recordTransition(applicationId,
                    ApplicationStatus.valueOf(prevStatus), ApplicationStatus.DEFICIENT,
                    username != null ? username : "system", "Eligibility check failed");
        }

        return result;
    }

    @Transactional
    public ApplicationDtos.ApplicationDto officerAction(UUID applicationId, ApplicationDtos.OfficerActionRequest request, String officerUsername) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        ApplicationStatus current = ApplicationStatus.valueOf(application.getStatus());
        ApplicationStatus next;

        switch (request.getAction().toUpperCase()) {
            case "APPROVE" -> next = ApplicationStatus.APPROVED;
            case "SANCTION" -> next = ApplicationStatus.SANCTIONED;
            case "DISBURSE" -> next = ApplicationStatus.DISBURSED;
            case "REJECT" -> next = ApplicationStatus.NOT_SELECTED;
            case "DEFICIENCY" -> next = ApplicationStatus.DEFICIENT;
            case "FORWARD" -> next = ApplicationStatus.OFFICER_SCRUTINY;
            case "SCREENING" -> next = ApplicationStatus.SCREENING;
            case "SELECTION" -> next = ApplicationStatus.SELECTION;
            default -> throw new BadRequestException("Unknown action: " + request.getAction());
        }

        if (!workflowService.isTransitionAllowed(current, next)) {
            throw new BadRequestException("Transition from " + current + " to " + next + " is not allowed");
        }

        application.setStatus(next.name());
        application.setCurrentStage(next.name());
        application.setRemarks(request.getRemarks());

        Application saved = applicationRepository.save(application);
        workflowService.recordTransition(applicationId, current, next, officerUsername, request.getRemarks());
        log.info("Officer {} performed action {} on application {}", officerUsername, request.getAction(), applicationId);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDtos.ApplicationDto> getMyApplications(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return applicationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationDtos.ApplicationDto getApplicationById(UUID applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        return toDto(app);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationDtos.ApplicationDto> getAllApplications(Pageable pageable) {
        return applicationRepository.findAllSubmittedApplications(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public ApplicationDtos.DashboardStatsDto getDashboardStats() {
        return ApplicationDtos.DashboardStatsDto.builder()
                .totalApplications(applicationRepository.count())
                .draftApplications(applicationRepository.countByStatus("DRAFT"))
                .submittedApplications(applicationRepository.countByStatus("SUBMITTED"))
                .verifiedApplications(applicationRepository.countByStatus("ELIGIBILITY_VERIFIED"))
                .approvedApplications(applicationRepository.countByStatus("APPROVED"))
                .disbursedApplications(applicationRepository.countByStatus("DISBURSED"))
                .rejectedApplications(applicationRepository.countByStatus("NOT_SELECTED"))
                .deficientApplications(applicationRepository.countByStatus("DEFICIENT"))
                .build();
    }

    // --- Helpers ---

    private Application getApplicationForUser(UUID applicationId, String username) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!application.getUser().getEmail().equals(username)) {
            throw new BadRequestException("Access denied to application " + applicationId);
        }
        return application;
    }

    private String generateApplicationNumber(String schemeCode) {
        String year = String.valueOf(java.time.Year.now().getValue());
        String random = String.format("%06d", new Random().nextInt(999999));
        return "MOTA-" + schemeCode + "-" + year + "-" + random;
    }

    public ApplicationDtos.ApplicationDto toDto(Application a) {
        List<ApplicationDtos.FieldValueDto> fieldValues = a.getFieldValues() == null ? List.of() :
                a.getFieldValues().stream()
                        .map(f -> ApplicationDtos.FieldValueDto.builder()
                                .fieldName(f.getFieldName())
                                .fieldValue(f.getFieldValue())
                                .build())
                        .collect(Collectors.toList());

        List<ApplicationDtos.ApplicationDocumentDto> docs = a.getDocuments() == null ? List.of() :
                a.getDocuments().stream()
                        .map(d -> ApplicationDtos.ApplicationDocumentDto.builder()
                                .id(d.getId())
                                .documentType(d.getDocumentType())
                                .verificationStatus(d.getVerificationStatus())
                                .verificationRemarks(d.getVerificationRemarks())
                                .verifiedBy(d.getVerifiedBy())
                                .verifiedAt(d.getVerifiedAt())
                                .originalFilename(d.getDocument() != null ? d.getDocument().getOriginalFilename() : null)
                                .build())
                        .collect(Collectors.toList());

        return ApplicationDtos.ApplicationDto.builder()
                .id(a.getId())
                .applicationNumber(a.getApplicationNumber())
                .status(a.getStatus())
                .currentStage(a.getCurrentStage())
                .submissionDate(a.getSubmissionDate())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .remarks(a.getRemarks())
                .schemeName(a.getSchemeVersion() != null ? a.getSchemeVersion().getScheme().getSchemeName() : null)
                .schemeCode(a.getSchemeVersion() != null ? a.getSchemeVersion().getScheme().getSchemeCode() : null)
                .schemeId(a.getSchemeVersion() != null ? a.getSchemeVersion().getScheme().getId() : null)
                .applicantName(a.getApplicantProfile() != null ? a.getApplicantProfile().getFullName() : null)
                .applicantEmail(a.getUser() != null ? a.getUser().getEmail() : null)
                .applicantPhone(a.getApplicantProfile() != null ? a.getApplicantProfile().getMobile() : null)
                .fieldValues(fieldValues)
                .documents(docs)
                .build();
    }
}
