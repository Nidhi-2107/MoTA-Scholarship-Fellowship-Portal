-- ==============================================================================
-- MoTA Scholarship & Fellowship Operating System: Seed Rules & Config (V4)
-- Dynamic Form Fields, Document Requirements, Rules, Conditions, Knowledge Base
-- ==============================================================================

-- 1. Dynamic Form Fields (Post-Matric Scheme)
INSERT IGNORE INTO scheme_form_fields (id, scheme_version_id, field_name, label, field_type, is_required, options_json, placeholder, display_order, section_name) VALUES
('44444444-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'scholarship_type', 'Application Nature', 'dropdown', TRUE, '["FRESH", "RENEWAL"]', 'Select Application Nature', 1, 'Academic Details'),
('44444444-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'current_course_group', 'Course Classification Group', 'dropdown', TRUE, '["GROUP_1_DEGREE_ENGINEERING_MEDICAL", "GROUP_2_POST_GRADUATE_PROFESSIONAL", "GROUP_3_UNDER_GRADUATE_GENERAL", "GROUP_4_CLASS_XI_XII_DIPLOMA"]', 'Select Course Group', 2, 'Academic Details'),
('44444444-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202', 'day_scholar_hosteller', 'Residence Status', 'radio', TRUE, '["DAY_SCHOLAR", "HOSTELLER"]', 'Select Day Scholar or Hosteller', 3, 'Academic Details'),
('44444444-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222202', 'hostel_name', 'Hostel Name (if Hosteller)', 'text', FALSE, NULL, 'Enter hostel name and address', 4, 'Academic Details'),
('44444444-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222202', 'tuition_fee_claimed', 'Annual Non-Refundable Tuition Fee (INR)', 'number', TRUE, NULL, 'e.g. 45000', 5, 'Fee & Banking Details'),
('44444444-1111-1111-1111-111111111106', '22222222-2222-2222-2222-222222222202', 'other_compulsory_fee', 'Other Compulsory Fee (Library, Exam, Lab)', 'number', FALSE, NULL, 'e.g. 5000', 6, 'Fee & Banking Details'),
('44444444-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222202', 'dbt_bank_consent', 'I give consent for direct Aadhaar-seeded DBT disbursement', 'checkbox', TRUE, NULL, NULL, 7, 'Consent & Declaration');

-- Dynamic Form Fields (NFST Fellowship Scheme)
INSERT IGNORE INTO scheme_form_fields (id, scheme_version_id, field_name, label, field_type, is_required, options_json, placeholder, display_order, section_name) VALUES
('44444444-1111-1111-1111-111111111108', '22222222-2222-2222-2222-222222222204', 'fellowship_stream', 'Research Discipline Stream', 'dropdown', TRUE, '["SCIENCES", "HUMANITIES_SOCIAL_SCIENCES", "ENGINEERING_TECHNOLOGY"]', 'Select Discipline', 1, 'Research Details'),
('44444444-1111-1111-1111-111111111109', '22222222-2222-2222-2222-222222222204', 'phd_registration_date', 'Date of Ph.D / M.Phil Registration', 'date', TRUE, NULL, 'Select registration date', 2, 'Research Details'),
('44444444-1111-1111-1111-111111111110', '22222222-2222-2222-2222-222222222204', 'research_topic', 'Ph.D Research Topic Title', 'textarea', TRUE, NULL, 'Enter full approved title of research synopsis', 3, 'Research Details'),
('44444444-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222204', 'research_guide_name', 'Research Supervisor / Guide Name', 'text', TRUE, NULL, 'Prof. Dr. ...', 4, 'Research Details'),
('44444444-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222204', 'ugc_net_cleared', 'Have you qualified UGC-NET / CSIR-NET / GATE?', 'radio', TRUE, '["YES", "NO"]', NULL, 5, 'Eligibility Details');

-- Dynamic Form Fields (NOS Overseas Scheme)
INSERT IGNORE INTO scheme_form_fields (id, scheme_version_id, field_name, label, field_type, is_required, options_json, placeholder, display_order, section_name) VALUES
('44444444-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222205', 'foreign_university_name', 'Foreign University Name', 'text', TRUE, NULL, 'e.g. University of Oxford', 1, 'Overseas Study Details'),
('44444444-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222205', 'destination_country', 'Country of Destination', 'dropdown', TRUE, '["UNITED_STATES", "UNITED_KINGDOM", "AUSTRALIA", "CANADA", "GERMANY", "OTHER"]', 'Select Country', 2, 'Overseas Study Details'),
('44444444-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222205', 'qs_world_ranking', 'Latest QS World University Ranking', 'number', TRUE, NULL, 'e.g. 45', 3, 'Overseas Study Details'),
('44444444-1111-1111-1111-111111111116', '22222222-2222-2222-2222-222222222205', 'course_level', 'Degree Level Abroad', 'dropdown', TRUE, '["MASTERS", "PHD", "POST_DOCTORAL"]', 'Select Degree', 4, 'Overseas Study Details'),
('44444444-1111-1111-1111-111111111117', '22222222-2222-2222-2222-222222222205', 'qualifying_degree_marks', 'Percentage in Qualifying Indian Degree', 'number', TRUE, NULL, 'Min 55% required, e.g. 68.5', 5, 'Academic Merit');

-- 2. Document Requirements (Post-Matric)
INSERT IGNORE INTO scheme_document_requirements (id, scheme_version_id, document_type, name, description, is_mandatory, max_size_mb, allowed_formats) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', 'ST_CASTE_CERTIFICATE', 'Scheduled Tribe (ST) Community Certificate', 'Valid caste certificate issued by competent revenue authority (Tahsildar / SDO / District Magistrate)', TRUE, 5, 'PDF,JPG,PNG'),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 'INCOME_CERTIFICATE', 'Competent Authority Income Certificate', 'Current financial year family income certificate (or Form 16 / salary certificate)', TRUE, 5, 'PDF,JPG,PNG'),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', 'QUALIFYING_MARKSHEET', 'Previous Qualifying Examination Marksheet', 'Marksheet of Class 10 / 12 / Last semester examination passed', TRUE, 5, 'PDF,JPG,PNG'),
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'FEE_RECEIPT', 'Current Year Course Fee Receipt / Admission Proof', 'Official fee receipt issued by college/institute showing non-refundable tuition fees', TRUE, 5, 'PDF,JPG,PNG');

-- Document Requirements (NFST Fellowship)
INSERT IGNORE INTO scheme_document_requirements (id, scheme_version_id, document_type, name, description, is_mandatory, max_size_mb, allowed_formats) VALUES
('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222204', 'ST_CASTE_CERTIFICATE', 'Scheduled Tribe Certificate', 'Competent revenue authority ST certificate', TRUE, 5, 'PDF,JPG,PNG'),
('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222204', 'RESEARCH_PROPOSAL', 'Ph.D Research Synopsis / Proposal', 'Detailed research proposal approved by university departmental research committee (DRC)', TRUE, 5, 'PDF'),
('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222204', 'PHD_REGISTRATION_LETTER', 'University Ph.D / M.Phil Admission & Registration Letter', 'Official joining/registration certificate signed by Registrar / Dean', TRUE, 5, 'PDF,JPG,PNG');

-- 3. Deterministic Rules & Rule Conditions (Post-Matric)
INSERT IGNORE INTO rules (id, scheme_version_id, rule_code, name, description, logic_operator, error_message, priority, is_active) VALUES
('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222202', 'RULE_PM_INCOME_CEILING', 'Family Income Compliance', 'Family annual income must not exceed Rs. 2,50,000 as per MoTA guidelines', 'AND', 'Family annual income exceeds scheme threshold of Rs. 2,50,000', 1, TRUE),
('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222202', 'RULE_PM_ST_CATEGORY', 'Scheduled Tribe Category Mandate', 'Candidate must belong to recognized Scheduled Tribe community', 'AND', 'Applicant community is not recognized as Scheduled Tribe', 2, TRUE),
('44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222202', 'RULE_PM_BANK_DBT', 'Aadhaar-Seeded DBT Account', 'Applicant bank account must be DBT active for scholarship transfer', 'AND', 'Applicant bank account is not flagged as DBT enabled', 3, TRUE);

-- Rule Conditions for Rule 1 (Income <= 250000)
INSERT IGNORE INTO rule_conditions (id, rule_id, field_path, operator, expected_value, value_type) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 'profile.familyAnnualIncome', '<=', '250000', 'NUMBER');

-- Rule Conditions for Rule 2 (Category == ST)
INSERT IGNORE INTO rule_conditions (id, rule_id, field_path, operator, expected_value, value_type) VALUES
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444402', 'profile.category', '==', 'ST', 'STRING');

-- Rule Conditions for Rule 3 (DBT == true)
INSERT IGNORE INTO rule_conditions (id, rule_id, field_path, operator, expected_value, value_type) VALUES
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444403', 'profile.dbtEnabled', '==', 'true', 'BOOLEAN');

-- 4. Seed Grounded Knowledge Base Documents for Chatbot
INSERT IGNORE INTO knowledge_documents (id, title, scheme_code, category, content, official_source_url, academic_year, is_active) VALUES
(
    '66666666-6666-6666-6666-666666666601',
    'Post-Matric ST Scholarship Income Guidelines 2025-26',
    'POST_MATRIC_ST',
    'ELIGIBILITY',
    'Under the Post-Matric Scholarship Scheme for Scheduled Tribe (ST) students, the family annual income from all sources must not exceed Rs. 2,50,000 (Rupees Two Lakh Fifty Thousand only). The income certificate must be issued by an authorized revenue authority such as Tahsildar, Sub-Divisional Magistrate (SDM), or District Magistrate. For government salaried employees, Form-16 accompanied by employer salary certificate is acceptable.',
    'https://dbttribal.gov.in/AllScheme.aspx',
    '2025-2026',
    TRUE
),
(
    '66666666-6666-6666-6666-666666666602',
    'One Time Registration (OTR) and DigiLocker Integration Guidance',
    'ALL_SCHEMES',
    'INTEGRATION',
    'The One Time Registration (OTR) is a unique 14-digit reference number assigned on the National Scholarship Portal. In our system, OTR verification can be completed via seamless DigiLocker consent, allowing instant verification of Caste and Income certificates without repeated manual document scanning.',
    'https://scholarships.gov.in',
    '2025-2026',
    TRUE
),
(
    '66666666-6666-6666-6666-666666666603',
    'Top Class Education for ST Students - Institute Notified List',
    'TOP_CLASS_ST',
    'BENEFITS',
    'Top Class Education Scheme covers 259 notified premier institutions including IITs, IIMs, NITs, AIIMS, and National Law Universities. It covers 100% of non-refundable tuition fees, living expenses of Rs. 3,000 per month, annual book grant of Rs. 5,000, and a one-time computer grant of Rs. 45,000.',
    'https://tribal.nic.in/ScholarshiP.aspx',
    '2025-2026',
    TRUE
),
(
    '66666666-6666-6666-6666-666666666604',
    'Deficiency Resolution & Document Resubmission Protocol',
    'ALL_SCHEMES',
    'DEFICIENCY',
    'If an automated consistency check or scrutiny officer flags a deficiency (such as blurred certificate or missing seal), the applicant is alerted via in-app notification and SMS. Applicants have 15 calendar days to resubmit the corrected document through the Deficiencies portal. Re-scrutiny occurs automatically within 48 hours.',
    'https://tribal.nic.in',
    '2025-2026',
    TRUE
),
(
    '66666666-6666-6666-6666-666666666605',
    'National Fellowship for ST Students (NFST) Eligibility & Disbursement',
    'NFST_FELLOWSHIP',
    'FELLOWSHIP',
    'NFST provides 750 fresh fellowships annually for M.Phil/Ph.D candidates. Selected scholars receive Junior Research Fellowship (JRF) of Rs. 37,000/month for initial 2 years and Senior Research Fellowship (SRF) of Rs. 42,000/month for remaining 3 years along with HRA and contingency grants disbursed directly via PFMS.',
    'https://fellowship.tribal.gov.in',
    '2025-2026',
    TRUE
);
