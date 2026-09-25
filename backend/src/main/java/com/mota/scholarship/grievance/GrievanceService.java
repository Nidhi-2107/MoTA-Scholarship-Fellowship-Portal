package com.mota.scholarship.grievance;

import com.mota.scholarship.common.ResourceNotFoundException;
import com.mota.scholarship.user.User;
import com.mota.scholarship.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final UserRepository userRepository;

    @Transactional
    public GrievanceDtos.GrievanceDto createGrievance(GrievanceDtos.CreateGrievanceRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String ticketNumber = "GRV-" + java.time.Year.now().getValue() + "-"
                + String.format("%06d", new Random().nextInt(999999));

        Grievance grievance = Grievance.builder()
                .ticketNumber(ticketNumber)
                .user(user)
                .applicationId(request.getApplicationId())
                .category(request.getCategory())
                .subject(request.getSubject())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .status("OPEN")
                .build();

        return toDto(grievanceRepository.save(grievance));
    }

    @Transactional
    public GrievanceDtos.GrievanceDto updateGrievance(UUID id, GrievanceDtos.UpdateGrievanceRequest request, String officerUsername) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));

        if (request.getStatus() != null) grievance.setStatus(request.getStatus());
        if (request.getResolutionRemarks() != null) grievance.setResolutionRemarks(request.getResolutionRemarks());
        if (request.getAssignedTo() != null) grievance.setAssignedTo(request.getAssignedTo());
        if (request.getPriority() != null) grievance.setPriority(request.getPriority());

        if ("RESOLVED".equals(request.getStatus()) || "CLOSED".equals(request.getStatus())) {
            grievance.setResolvedAt(Instant.now());
        }

        return toDto(grievanceRepository.save(grievance));
    }

    @Transactional(readOnly = true)
    public List<GrievanceDtos.GrievanceDto> getMyGrievances(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return grievanceRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<GrievanceDtos.GrievanceDto> getAllGrievances(Pageable pageable) {
        return grievanceRepository.findAll(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public GrievanceDtos.GrievanceDto getGrievanceById(UUID id) {
        return toDto(grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found")));
    }

    private GrievanceDtos.GrievanceDto toDto(Grievance g) {
        return GrievanceDtos.GrievanceDto.builder()
                .id(g.getId())
                .ticketNumber(g.getTicketNumber())
                .category(g.getCategory())
                .subject(g.getSubject())
                .description(g.getDescription())
                .status(g.getStatus())
                .priority(g.getPriority())
                .assignedTo(g.getAssignedTo())
                .resolutionRemarks(g.getResolutionRemarks())
                .resolvedAt(g.getResolvedAt())
                .createdAt(g.getCreatedAt())
                .updatedAt(g.getUpdatedAt())
                .applicationId(g.getApplicationId())
                .applicantName(g.getUser().getFullName())
                .applicantEmail(g.getUser().getEmail())
                .build();
    }
}
