package com.mota.scholarship.workflow;

import com.mota.scholarship.common.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowService {

    private final WorkflowTransitionRepository transitionRepository;

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(ApplicationStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(ApplicationStatus.DRAFT, Set.of(ApplicationStatus.SUBMITTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SUBMITTED, Set.of(ApplicationStatus.DOCUMENT_PROCESSING, ApplicationStatus.AUTOMATED_VERIFICATION));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.DOCUMENT_PROCESSING, Set.of(ApplicationStatus.AUTOMATED_VERIFICATION, ApplicationStatus.DEFICIENT));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.AUTOMATED_VERIFICATION, Set.of(ApplicationStatus.DEFICIENT, ApplicationStatus.OFFICER_SCRUTINY, ApplicationStatus.ELIGIBILITY_VERIFIED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.DEFICIENT, Set.of(ApplicationStatus.APPLICANT_RESUBMISSION));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.APPLICANT_RESUBMISSION, Set.of(ApplicationStatus.DOCUMENT_PROCESSING, ApplicationStatus.AUTOMATED_VERIFICATION, ApplicationStatus.OFFICER_SCRUTINY));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.OFFICER_SCRUTINY, Set.of(ApplicationStatus.ELIGIBILITY_VERIFIED, ApplicationStatus.DEFICIENT, ApplicationStatus.NOT_SELECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.ELIGIBILITY_VERIFIED, Set.of(ApplicationStatus.SCREENING, ApplicationStatus.SELECTION, ApplicationStatus.APPROVED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SCREENING, Set.of(ApplicationStatus.SELECTION, ApplicationStatus.NOT_SELECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SELECTION, Set.of(ApplicationStatus.APPROVED, ApplicationStatus.NOT_SELECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.APPROVED, Set.of(ApplicationStatus.SANCTIONED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SANCTIONED, Set.of(ApplicationStatus.DISBURSED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.DISBURSED, Collections.emptySet());
        ALLOWED_TRANSITIONS.put(ApplicationStatus.NOT_SELECTED, Collections.emptySet());
    }

    public boolean isTransitionAllowed(ApplicationStatus current, ApplicationStatus next) {
        if (current == next) return true;
        Set<ApplicationStatus> allowed = ALLOWED_TRANSITIONS.get(current);
        return allowed != null && allowed.contains(next);
    }

    @Transactional
    public void recordTransition(UUID applicationId, ApplicationStatus from, ApplicationStatus to, String actor, String remarks) {
        if (!isTransitionAllowed(from, to)) {
            log.warn("Non-standard workflow transition requested from {} to {} for application {}", from, to, applicationId);
        }

        WorkflowTransition transition = WorkflowTransition.builder()
                .applicationId(applicationId)
                .fromStatus(from.name())
                .toStatus(to.name())
                .transitionedBy(actor)
                .remarks(remarks)
                .build();

        transitionRepository.save(transition);
        log.info("Application {} transitioned: {} -> {} by {}", applicationId, from, to, actor);
    }

    public List<WorkflowTransition> getTransitions(UUID applicationId) {
        return transitionRepository.findByApplicationIdOrderByCreatedAtAsc(applicationId);
    }
}
