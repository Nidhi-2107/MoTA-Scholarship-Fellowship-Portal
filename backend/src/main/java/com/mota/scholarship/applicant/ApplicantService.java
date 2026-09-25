package com.mota.scholarship.applicant;

import com.mota.scholarship.common.ResourceNotFoundException;
import com.mota.scholarship.user.User;
import com.mota.scholarship.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicantService {

    private final ApplicantProfileRepository profileRepository;
    private final ApplicantEducationRepository educationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ApplicantProfileDto getProfileByUsername(String username) {
        ApplicantProfile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant profile not found for user: " + username));
        return mapToDto(profile);
    }

    @Transactional
    public ApplicantProfileDto updateProfile(String username, ApplicantProfileDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        ApplicantProfile profile = profileRepository.findByUserUsername(username)
                .orElseGet(() -> ApplicantProfile.builder().user(user).build());

        if (dto.getDateOfBirth() != null) profile.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getAadhaarMasked() != null) profile.setAadhaarMasked(dto.getAadhaarMasked());
        if (dto.getStCasteName() != null) profile.setStCasteName(dto.getStCasteName());
        if (dto.getPvtgStatus() != null) profile.setPvtgStatus(dto.getPvtgStatus());
        if (dto.getDisabilityStatus() != null) profile.setDisabilityStatus(dto.getDisabilityStatus());
        if (dto.getAddressLine() != null) profile.setAddressLine(dto.getAddressLine());
        if (dto.getStateCode() != null) profile.setStateCode(dto.getStateCode());
        if (dto.getStateName() != null) profile.setStateName(dto.getStateName());
        if (dto.getDistrictName() != null) profile.setDistrictName(dto.getDistrictName());
        if (dto.getPinCode() != null) profile.setPinCode(dto.getPinCode());
        if (dto.getFamilyAnnualIncome() != null) profile.setFamilyAnnualIncome(dto.getFamilyAnnualIncome());
        if (dto.getBankAccountMasked() != null) profile.setBankAccountMasked(dto.getBankAccountMasked());
        if (dto.getIfscCode() != null) profile.setIfscCode(dto.getIfscCode());
        if (dto.getBankName() != null) profile.setBankName(dto.getBankName());
        if (dto.getDbtEnabled() != null) profile.setDbtEnabled(dto.getDbtEnabled());

        profile = profileRepository.save(profile);

        // Update education if provided
        if (dto.getEducations() != null && !dto.getEducations().isEmpty()) {
            educationRepository.deleteAll(educationRepository.findByProfileIdOrderByPassingYearDesc(profile.getId()));
            ApplicantProfile finalProfile = profile;
            List<ApplicantEducation> educations = dto.getEducations().stream().map(e -> ApplicantEducation.builder()
                    .profile(finalProfile)
                    .educationLevel(e.getEducationLevel())
                    .institutionName(e.getInstitutionName())
                    .institutionCode(e.getInstitutionCode())
                    .universityBoard(e.getUniversityBoard())
                    .courseName(e.getCourseName())
                    .passingYear(e.getPassingYear())
                    .marksPercentage(e.getMarksPercentage())
                    .cgpa(e.getCgpa())
                    .rollNumber(e.getRollNumber())
                    .isCurrent(e.getIsCurrent() != null && e.getIsCurrent())
                    .build()).collect(Collectors.toList());
            educationRepository.saveAll(educations);
        }

        return getProfileByUsername(username);
    }

    @Transactional
    public ApplicantProfileDto linkMockOtr(String username, String mockOtrNumber) {
        ApplicantProfile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found: " + username));

        profile.setOtrNumber(mockOtrNumber != null && !mockOtrNumber.isBlank() ? mockOtrNumber : "OTR-2025-DEMO-" + System.currentTimeMillis() % 100000);
        profile.setOtrStatus("VERIFIED");
        profileRepository.save(profile);

        log.info("[MOCK NSP OTR] Successfully linked OTR reference {} for user {}", profile.getOtrNumber(), username);
        return mapToDto(profile);
    }

    private ApplicantProfileDto mapToDto(ApplicantProfile profile) {
        List<ApplicantEducation> educations = educationRepository.findByProfileIdOrderByPassingYearDesc(profile.getId());
        List<ApplicantEducationDto> eduDtos = educations.stream().map(e -> ApplicantEducationDto.builder()
                .id(e.getId())
                .educationLevel(e.getEducationLevel())
                .institutionName(e.getInstitutionName())
                .institutionCode(e.getInstitutionCode())
                .universityBoard(e.getUniversityBoard())
                .courseName(e.getCourseName())
                .passingYear(e.getPassingYear())
                .marksPercentage(e.getMarksPercentage())
                .cgpa(e.getCgpa())
                .rollNumber(e.getRollNumber())
                .isCurrent(e.getIsCurrent())
                .build()).collect(Collectors.toList());

        return ApplicantProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .mobile(profile.getUser().getMobile())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .aadhaarMasked(profile.getAadhaarMasked())
                .stCasteName(profile.getStCasteName())
                .pvtgStatus(profile.getPvtgStatus())
                .disabilityStatus(profile.getDisabilityStatus())
                .addressLine(profile.getAddressLine())
                .stateCode(profile.getStateCode())
                .stateName(profile.getStateName())
                .districtName(profile.getDistrictName())
                .pinCode(profile.getPinCode())
                .familyAnnualIncome(profile.getFamilyAnnualIncome())
                .bankAccountMasked(profile.getBankAccountMasked())
                .ifscCode(profile.getIfscCode())
                .bankName(profile.getBankName())
                .dbtEnabled(profile.getDbtEnabled())
                .otrNumber(profile.getOtrNumber())
                .otrStatus(profile.getOtrStatus())
                .educations(eduDtos)
                .build();
    }
}
