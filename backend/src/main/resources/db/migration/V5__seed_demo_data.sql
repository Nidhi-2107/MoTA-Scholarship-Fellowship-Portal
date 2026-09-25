-- ==============================================================================
-- MoTA Scholarship & Fellowship Operating System: Demo Data (V5)
-- Seed Demo Accounts, ST Applicants, Diverse Lifecycle Applications
-- NOTE: This is DEMO DATA only - clearly marked for SIH prototype
-- ==============================================================================

-- 1. Demo Officer & Admin Users (BCrypt hash for "Demo@123")
INSERT IGNORE INTO users (id, username, email, mobile, password_hash, full_name, role_id, is_active, is_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'applicant', 'applicant@tribal.gov.in', '9876543210', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Rahul Ramesh Munda', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'institute_officer', 'nodal.officer@nitb.ac.in', '9876543211', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Prof. Arvind Kumar (NIT Bhopal)', 'ROLE_INSTITUTE_OFFICER', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'scrutiny_officer', 'scrutiny.mota@tribal.gov.in', '9876543212', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Sunita Tekam (Scrutiny Officer)', 'ROLE_SCRUTINY_OFFICER', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'district_officer', 'dwo.mandla@mp.gov.in', '9876543213', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Rajesh Markam (DWO Mandla)', 'ROLE_DISTRICT_OFFICER', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'state_officer', 'state.welfare@mp.gov.in', '9876543214', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Dr. Hemant Bhil (MP State Welfare)', 'ROLE_STATE_OFFICER', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'mota_officer', 'director.scholarship@mota.gov.in', '9876543215', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Vikramaditya Gond (Director MoTA)', 'ROLE_MOTA_OFFICER', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'selection_committee', 'committee.nfst@tribal.gov.in', '9876543216', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Prof. K. Minz (Selection Committee)', 'ROLE_SELECTION_COMMITTEE', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'admin', 'admin@mota.gov.in', '9876543217', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'MoTA Portal Administrator', 'ROLE_ADMIN', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', 'super_admin', 'superadmin@mota.gov.in', '9876543218', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'National Super Administrator', 'ROLE_SUPER_ADMIN', TRUE, TRUE);

-- Additional demo applicants
INSERT IGNORE INTO users (id, username, email, mobile, password_hash, full_name, role_id, is_active, is_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', 'priya_gond', 'priya.gond@demo.gov.in', '9812345601', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Priya Gond', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', 'anil_bhil', 'anil.bhil@demo.gov.in', '9812345602', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Anil Bhil', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', 'mamata_oraon', 'mamata.oraon@demo.gov.in', '9812345603', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Mamata Oraon', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa13', 'vikas_meena', 'vikas.meena@demo.gov.in', '9812345604', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Vikas Meena', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa14', 'sunil_santhal', 'sunil.santhal@demo.gov.in', '9812345605', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Sunil Santhal', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa15', 'anita_bodo', 'anita.bodo@demo.gov.in', '9812345606', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Anita Bodo', 'ROLE_APPLICANT', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa16', 'kavita_baiga', 'kavita.baiga@demo.gov.in', '9812345607', '$2a$10$NXpJjH/y6nQOlkKQHflvsuV2FSbNJGHbyTJTk3ragyk7E0wuHKhc2', 'Kavita Baiga (PVTG)', 'ROLE_APPLICANT', TRUE, TRUE);

-- 2. Primary demo applicant profile (Rahul Munda)
INSERT IGNORE INTO applicant_profiles (id, user_id, date_of_birth, gender, aadhaar_masked, st_caste_name, pvtg_status, disability_status, address_line, state_code, state_name, district_name, pin_code, family_annual_income, bank_account_masked, ifsc_code, bank_name, dbt_enabled, otr_number, otr_status) VALUES
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '2003-07-15',
    'Male',
    'XXXXXXXX4812',
    'Munda (Scheduled Tribe)',
    FALSE,
    FALSE,
    'Village Khunti, Post Torpa, Ward 4',
    'JH',
    'Jharkhand',
    'Khunti',
    '835227',
    185000.00,
    'XXXXXX9824',
    'SBIN0001234',
    'State Bank of India',
    TRUE,
    'OTR-2025-JH-882910',
    'VERIFIED'
);

-- Additional profiles
INSERT IGNORE INTO applicant_profiles (id, user_id, date_of_birth, gender, aadhaar_masked, st_caste_name, pvtg_status, disability_status, address_line, state_code, state_name, district_name, pin_code, family_annual_income, bank_account_masked, ifsc_code, bank_name, dbt_enabled, otr_number, otr_status) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', '2004-03-21', 'Female', 'XXXXXXXX1942', 'Gond', FALSE, FALSE, 'Dindori Ward 2', 'MP', 'Madhya Pradesh', 'Dindori', '481880', 140000.00, 'XXXXXX4411', 'PUNB0192800', 'Punjab National Bank', TRUE, 'OTR-2025-MP-102941', 'VERIFIED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11', '2002-11-09', 'Male', 'XXXXXXXX8821', 'Bhil', FALSE, FALSE, 'Jhabua Tehsil, House 88', 'MP', 'Madhya Pradesh', 'Jhabua', '457661', 220000.00, 'XXXXXX5522', 'BARB0JHABUA', 'Bank of Baroda', TRUE, 'OTR-2025-MP-394812', 'VERIFIED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', '2001-05-18', 'Female', 'XXXXXXXX7711', 'Oraon', FALSE, FALSE, 'Sundargarh Village Sector 3', 'OD', 'Odisha', 'Sundargarh', '770001', 195000.00, 'XXXXXX9912', 'UBIN0543210', 'Union Bank of India', TRUE, 'OTR-2025-OD-772911', 'VERIFIED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa13', '2003-08-30', 'Male', 'XXXXXXXX3312', 'Meena', FALSE, FALSE, 'Dausa Rural, Post Bandikui', 'RJ', 'Rajasthan', 'Dausa', '303313', 240000.00, 'XXXXXX1190', 'CNRB0002910', 'Canara Bank', TRUE, 'OTR-2025-RJ-491029', 'VERIFIED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa14', '2000-02-14', 'Male', 'XXXXXXXX9081', 'Santhal', FALSE, FALSE, 'Dumka Near Tribal Ashram', 'JH', 'Jharkhand', 'Dumka', '814101', 160000.00, 'XXXXXX2941', 'SBIN0004910', 'State Bank of India', TRUE, 'OTR-2025-JH-559102', 'VERIFIED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa15', '2002-12-05', 'Female', 'XXXXXXXX6619', 'Bodo', FALSE, FALSE, 'Kokrajhar Ward 7', 'AS', 'Assam', 'Kokrajhar', '783370', 175000.00, 'XXXXXX8812', 'HDFC0001290', 'HDFC Bank', TRUE, 'OTR-2025-AS-194821', 'VERIFIED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa16', '2003-09-12', 'Female', 'XXXXXXXX4420', 'Baiga (PVTG)', TRUE, FALSE, 'Baiga Chak Village, Samnapur', 'MP', 'Madhya Pradesh', 'Dindori', '481778', 85000.00, 'XXXXXX6633', 'CBIN0281920', 'Central Bank of India', TRUE, 'OTR-2025-MP-994820', 'VERIFIED');

-- 3. Education for primary applicant
INSERT IGNORE INTO applicant_educations (id, profile_id, education_level, institution_name, institution_code, university_board, course_name, passing_year, marks_percentage, roll_number, is_current) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccca1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'CLASS_XII', 'St. Xavier Higher Secondary School, Ranchi', 'JH-SCH-019', 'Jharkhand Academic Council (JAC)', 'Higher Secondary (Science)', 2023, 84.50, '230104819', FALSE),
('cccccccc-cccc-cccc-cccc-cccccccccca2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'UNDERGRADUATE', 'Maulana Azad National Institute of Technology (MANIT), Bhopal', 'MP-NIT-001', 'Autonomous / NIT', 'B.Tech in Computer Science & Engineering', 2027, 8.42, '231114088', TRUE);

-- 4. Sample Applications across Stages
-- Application 1: Rahul Munda (Post-Matric - OFFICER_SCRUTINY stage)
INSERT IGNORE INTO applications (id, application_number, user_id, applicant_profile_id, scheme_version_id, status, current_stage, submission_date, remarks) VALUES
(
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'PM-2025-00182',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '22222222-2222-2222-2222-222222222202',
    'AUTOMATED_VERIFICATION',
    'OFFICER_SCRUTINY',
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    'Automated checks passed 100%. Ready for Scrutiny Officer review.'
);

-- Application 2: Priya Gond (Pre-Matric - DEFICIENT stage)
INSERT IGNORE INTO applications (id, application_number, user_id, applicant_profile_id, scheme_version_id, status, current_stage, submission_date, remarks) VALUES
(
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    'PRE-2025-00491',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    '22222222-2222-2222-2222-222222222201',
    'DEFICIENT',
    'APPLICANT_RESUBMISSION',
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    'Income certificate stamp signature unreadable in OCR. Deficiency raised.'
);

-- Application 3: Mamata Oraon (Top Class Education - SANCTIONED)
INSERT IGNORE INTO applications (id, application_number, user_id, applicant_profile_id, scheme_version_id, status, current_stage, submission_date, remarks) VALUES
(
    'dddddddd-dddd-dddd-dddd-ddddddddddd3',
    'TC-2025-00088',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4',
    '22222222-2222-2222-2222-222222222203',
    'SANCTIONED',
    'DISBURSEMENT_PENDING',
    DATE_SUB(NOW(), INTERVAL 20 DAY),
    'Sanction order MoTA/TC/2025/ST-088 approved. Pushed to PFMS queue.'
);

-- Application 4: Sunil Santhal (NFST Fellowship - SELECTION_COMMITTEE)
INSERT IGNORE INTO applications (id, application_number, user_id, applicant_profile_id, scheme_version_id, status, current_stage, submission_date, remarks) VALUES
(
    'dddddddd-dddd-dddd-dddd-ddddddddddd4',
    'NFST-2025-00312',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa14',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6',
    '22222222-2222-2222-2222-222222222204',
    'SCREENING',
    'SELECTION_COMMITTEE',
    DATE_SUB(NOW(), INTERVAL 15 DAY),
    'Research proposal verified by DRC IIT Kharagpur. Awaiting Selection Committee scoring.'
);

-- Application 5: Vikas Meena (NOS Overseas - DOCUMENT_PROCESSING)
INSERT IGNORE INTO applications (id, application_number, user_id, applicant_profile_id, scheme_version_id, status, current_stage, submission_date, remarks) VALUES
(
    'dddddddd-dddd-dddd-dddd-ddddddddddd5',
    'NOS-2025-00045',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa13',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5',
    '22222222-2222-2222-2222-222222222205',
    'SUBMITTED',
    'DOCUMENT_PROCESSING',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    'Submitted with Oxford University unconditional offer letter. OCR extraction queued.'
);

-- Application 6: Kavita Baiga PVTG (Post-Matric - SELECTION stage)
INSERT IGNORE INTO applications (id, application_number, user_id, applicant_profile_id, scheme_version_id, status, current_stage, submission_date, remarks) VALUES
(
    'dddddddd-dddd-dddd-dddd-ddddddddddd6',
    'PM-2025-00210',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa16',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8',
    '22222222-2222-2222-2222-222222222202',
    'ELIGIBILITY_VERIFIED',
    'SELECTION',
    DATE_SUB(NOW(), INTERVAL 4 DAY),
    'PVTG candidate verified with high priority. Eligible for special state top-up.'
);

-- 5. Deficiency for Application 2
INSERT IGNORE INTO deficiencies (id, application_id, reason, severity, deadline, status, applicant_response) VALUES
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
    'dddddddd-dddd-dddd-dddd-ddddddddddd2',
    'Income Certificate issuing authority seal and issuing date are partially illegible in current upload. Please provide high-resolution scan or e-District copy.',
    'MEDIUM',
    DATE_ADD(CURDATE(), INTERVAL 10 DAY),
    'OPEN',
    NULL
);

-- 6. Sample Documents metadata for Application 1 (Rahul Munda)
INSERT IGNORE INTO documents (id, user_id, document_type, file_name, file_size, mime_type, storage_key, storage_bucket, sha256_hash) VALUES
(
    'ffffffff-ffff-ffff-ffff-ffffffffff01',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'INCOME_CERTIFICATE',
    'Income_Certificate_RahulMunda.pdf',
    842000,
    'application/pdf',
    'documents/income/Income_Certificate_RahulMunda_20250901.pdf',
    'uploads',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffff02',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'ST_CASTE_CERTIFICATE',
    'ST_Caste_Certificate_Munda.pdf',
    920000,
    'application/pdf',
    'documents/caste/ST_Caste_Certificate_Munda_20250901.pdf',
    'uploads',
    'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
);

-- Link documents to Application 1
INSERT IGNORE INTO application_documents (id, application_id, document_id, requirement_id, document_type, verification_status, is_current, submission_round) VALUES
('a1111111-1111-1111-1111-111111111101', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '33333333-3333-3333-3333-333333333302', 'INCOME_CERTIFICATE', 'VERIFIED', TRUE, 1),
('a1111111-1111-1111-1111-111111111102', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'ffffffff-ffff-ffff-ffff-ffffffffff02', '33333333-3333-3333-3333-333333333301', 'ST_CASTE_CERTIFICATE', 'VERIFIED', TRUE, 1);

-- Extracted OCR Fields from Income Certificate
INSERT IGNORE INTO document_extractions (id, document_id, field_name, extracted_value, confidence, page_number, extraction_method) VALUES
('77777777-7777-7777-7777-777777777701', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Annual Family Income', 'Rs. 1,85,000', 96.50, 1, 'TESSERACT_OCR + AI_PARSER'),
('77777777-7777-7777-7777-777777777702', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Certificate Number', 'JH/INC/2024/09841', 98.20, 1, 'TESSERACT_OCR'),
('77777777-7777-7777-7777-777777777703', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Issuing Authority', 'Circle Officer (CO), Khunti, Jharkhand', 94.00, 1, 'TESSERACT_OCR'),
('77777777-7777-7777-7777-777777777704', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Applicant Name', 'Rahul Ramesh Munda', 99.10, 1, 'TESSERACT_OCR'),
('77777777-7777-7777-7777-777777777705', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'Community Category', 'Scheduled Tribe (ST) - Munda', 97.80, 1, 'TESSERACT_OCR'),
('77777777-7777-7777-7777-777777777706', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'Caste Certificate Number', 'JH/CST/2021/48192', 99.40, 1, 'TESSERACT_OCR');

-- Document Verification Record
INSERT IGNORE INTO document_verifications (id, document_id, application_id, verification_status, ocr_raw_text, ai_findings, consistency_status, verified_by, remarks) VALUES
(
    '88888888-8888-8888-8888-888888888801',
    'ffffffff-ffff-ffff-ffff-ffffffffff01',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'VERIFIED',
    'GOVERNMENT OF JHARKHAND REVENUE DEPARTMENT. INCOME CERTIFICATE No. JH/INC/2024/09841. This is to certify that Rahul Ramesh Munda s/o Ramesh Munda residing at Village Khunti, Dist Khunti, has total annual family income of Rs. 1,85,000 (One Lakh Eighty Five Thousand Only). Issued under Digital Seal on 12-05-2024.',
    'AI Semantic Validation: Name matches profile (Rahul Ramesh Munda). Extracted income of Rs. 1,85,000 is safely within scheme ceiling of Rs. 2,50,000. Digital signature format conforms to Jharkhand Jharsewa portal.',
    'CONSISTENT',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'Income document authentic and clear.'
);

-- 7. Eligibility Result for Application 1
INSERT IGNORE INTO eligibility_results (id, application_id, is_eligible, evaluator, rule_version, detailed_findings) VALUES
(
    '11223344-5566-7788-9900-aabbccddeeff',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    TRUE,
    'DETERMINISTIC_RULE_ENGINE',
    'POST-MATRIC-2025-V1',
    'All 3 deterministic eligibility criteria satisfied. Evidence verified from Income_Certificate_RahulMunda.pdf and ST_Caste_Certificate_Munda.pdf.'
);

INSERT IGNORE INTO rule_evaluation_results (id, eligibility_result_id, rule_id, rule_name, input_value, expected_value, is_passed, evidence_snippet, document_ref) VALUES
('99999999-1111-1111-1111-111111111101', '11223344-5566-7788-9900-aabbccddeeff', '44444444-4444-4444-4444-444444444401', 'Family Income Compliance', '185000', '<= 250000', TRUE, 'Annual family income Rs. 1,85,000 verified from Circle Officer Khunti certificate.', 'Income_Certificate_RahulMunda.pdf (Page 1)'),
('99999999-1111-1111-1111-111111111102', '11223344-5566-7788-9900-aabbccddeeff', '44444444-4444-4444-4444-444444444402', 'Scheduled Tribe Category Mandate', 'ST', '== ST', TRUE, 'Community identified as Scheduled Tribe (Munda) verified from revenue certificate JH/CST/2021/48192.', 'ST_Caste_Certificate_Munda.pdf (Page 1)'),
('99999999-1111-1111-1111-111111111103', '11223344-5566-7788-9900-aabbccddeeff', '44444444-4444-4444-4444-444444444403', 'Aadhaar-Seeded DBT Account', 'true', '== true', TRUE, 'State Bank of India account XXXXXX9824 flagged active on NPCI Aadhaar mapper.', 'Profile Bank Record');

-- 8. Seed Integration Transactions (MOCK - DEMO DATA)
INSERT IGNORE INTO integration_transactions (id, system_name, external_reference, application_id, request_summary, response_summary, sync_status, retry_count) VALUES
('iiiiiiii-1111-1111-1111-111111111101', 'NSP', 'NSP-SYNC-2025-0918', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'Sync OTR Status for Rahul Munda', 'OTR-2025-JH-882910 is active and verified. [MOCK]', 'SUCCESS', 0),
('iiiiiiii-1111-1111-1111-111111111102', 'DIGILOCKER', 'DL-CONSENT-JH-9912', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'Fetch ST Caste Certificate from Jharkhand Jharsewa repository', 'Document URI dl://jh/caste/48192 verified with issuer digital signature. [MOCK]', 'SUCCESS', 0),
('iiiiiiii-1111-1111-1111-111111111103', 'MPTAAS', 'MPTAAS-ADAPTER-1049', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 'Query Pre-Matric status from Madhya Pradesh Tribal Portal', 'Application acknowledged by MPTAAS nodal system. [MOCK]', 'SUCCESS', 0),
('iiiiiiii-1111-1111-1111-111111111104', 'PFMS', 'PFMS-SANCTION-8801', 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 'Push Top Class Sanction Order TC-2025-00088 for DBT disbursement', 'Beneficiary account validated. Credit advice pending batch run. [MOCK]', 'SUCCESS', 0);

-- 9. Sample Grievance
INSERT IGNORE INTO grievances (id, ticket_number, user_id, application_id, category, subject, description, priority, status) VALUES
(
    'gggggggg-gggg-gggg-gggg-gggggggggg01',
    'GRV-2025-0012',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'Document Verification',
    'Inquiry regarding hostel fee reimbursement eligibility',
    'Sir, I have submitted the fee receipt for campus hostel. Kindly confirm if the living allowance portion is covered under Post-Matric scheme group 1.',
    'LOW',
    'IN_PROGRESS'
);

-- 10. Notifications
INSERT IGNORE INTO notifications (id, user_id, title, message, notification_type, is_read, reference_id) VALUES
('nnnnnnnn-1111-1111-1111-111111111101', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Automated Verification Completed', 'Your application PM-2025-00182 has passed automated eligibility checks and is now queued for officer scrutiny.', 'STATUS_UPDATE', FALSE, 'PM-2025-00182'),
('nnnnnnnn-1111-1111-1111-111111111102', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', 'Deficiency Action Required', 'A deficiency was flagged on Income Certificate for application PRE-2025-00491. Please upload a clear copy within 10 days.', 'DEFICIENCY_ALERT', FALSE, 'PRE-2025-00491'),
('nnnnnnnn-1111-1111-1111-111111111103', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa12', 'Scholarship Sanctioned!', 'Congratulations! Sanction Order MoTA/TC/2025/ST-088 has been issued for Top Class Education scholarship.', 'SANCTION_ALERT', FALSE, 'TC-2025-00088');

-- 11. Audit Logs
INSERT IGNORE INTO audit_logs (id, actor_username, actor_role, action, entity_type, entity_id, previous_state, new_state, ip_address) VALUES
('aaaaaaaa-1111-1111-1111-audit0000001', 'applicant', 'ROLE_APPLICANT', 'SUBMIT_APPLICATION', 'APPLICATION', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'DRAFT', 'SUBMITTED', '127.0.0.1'),
('aaaaaaaa-1111-1111-1111-audit0000002', 'system_rule_engine', 'SYSTEM', 'EVALUATE_RULES', 'APPLICATION', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'DOCUMENT_PROCESSING', 'AUTOMATED_VERIFICATION', '127.0.0.1'),
('aaaaaaaa-1111-1111-1111-audit0000003', 'scrutiny_officer', 'ROLE_SCRUTINY_OFFICER', 'RAISE_DEFICIENCY', 'APPLICATION', 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 'OFFICER_SCRUTINY', 'DEFICIENT', '127.0.0.1');
