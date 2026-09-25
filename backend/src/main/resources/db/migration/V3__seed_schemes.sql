-- ==============================================================================
-- MoTA Scholarship & Fellowship Operating System: Seed Official Schemes (V3)
-- Official Ministry of Tribal Affairs (MoTA) Schemes and Academic Versions
-- ==============================================================================

-- 1. Official Schemes
INSERT IGNORE INTO schemes (id, code, name, category, objective, ministry, portal_url, is_active)
VALUES
(
    '11111111-1111-1111-1111-111111111101',
    'PRE_MATRIC_ST',
    'Pre-Matric Scholarship Scheme for ST Students',
    'PRE_MATRIC',
    'To support parents of ST children for education of their wards studying in classes IX and X so that the incidence of drop-out, especially in the transition from the elementary to the secondary stage, is minimized.',
    'Ministry of Tribal Affairs',
    'https://tribal.nic.in/ScholarshiP.aspx',
    TRUE
),
(
    '11111111-1111-1111-1111-111111111102',
    'POST_MATRIC_ST',
    'Post-Matric Scholarship Scheme for ST Students',
    'POST_MATRIC',
    'To provide financial assistance to Scheduled Tribe students studying at post-matriculation or post-secondary stage to enable them to complete their higher education.',
    'Ministry of Tribal Affairs',
    'https://dbttribal.gov.in/AllScheme.aspx',
    TRUE
),
(
    '11111111-1111-1111-1111-111111111103',
    'TOP_CLASS_ST',
    'National Scholarship for Higher Education (Top Class Education) for ST Students',
    'TOP_CLASS',
    'To encourage meritorious ST students to pursue quality higher education in top-tier institutions (IITs, IIMs, NITs, AIIMS, NLUs, etc.) identified by MoTA by providing full tuition fees and living stipends.',
    'Ministry of Tribal Affairs',
    'https://tribal.nic.in/ScholarshiP.aspx',
    TRUE
),
(
    '11111111-1111-1111-1111-111111111104',
    'NFST_FELLOWSHIP',
    'National Fellowship for ST Students (M.Phil / Ph.D)',
    'FELLOWSHIP',
    'To provide financial assistance to ST candidates to pursue higher education leading to degrees such as M.Phil. and Ph.D. in Sciences, Humanities, and Social Sciences in Indian Universities/Institutions.',
    'Ministry of Tribal Affairs',
    'https://fellowship.tribal.gov.in',
    TRUE
),
(
    '11111111-1111-1111-1111-111111111105',
    'NOS_OVERSEAS',
    'National Overseas Scholarship Scheme for ST Candidates',
    'OVERSEAS',
    'To provide financial assistance to selected ST candidates who pursue Master level courses and Ph.D. abroad in accredited foreign universities ranked in QS top 500.',
    'Ministry of Tribal Affairs',
    'https://overseas.tribal.gov.in',
    TRUE
);

-- 2. Scheme Versions (Academic Year 2025-2026)
INSERT IGNORE INTO scheme_versions (id, scheme_id, academic_year, version_number, is_active, effective_from, effective_to, income_ceiling, benefits_summary, rules_summary)
VALUES
(
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    '2025-2026',
    1,
    TRUE,
    '2025-04-01',
    '2026-03-31',
    250000.00,
    'Day Scholars: Rs. 3,500/year; Hostellers: Rs. 7,000/year. Direct Bank Transfer (DBT) to beneficiary account.',
    'Applicant must belong to Scheduled Tribe community, study in Class IX or X in a recognized school, family annual income not exceeding Rs. 2.50 Lakh.'
),
(
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111102',
    '2025-2026',
    1,
    TRUE,
    '2025-04-01',
    '2026-03-31',
    250000.00,
    'Maintenance allowance up to Rs. 13,500/year depending on course group + compulsory non-refundable fees reimbursed.',
    'Scheduled Tribe student, enrolled in Post-Matric course (XI, XII, Diploma, UG, PG), annual family income <= Rs. 2.50 Lakh.'
),
(
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111103',
    '2025-2026',
    1,
    TRUE,
    '2025-04-01',
    '2026-03-31',
    600000.00,
    'Full tuition fee and non-refundable charges + living expenses Rs. 3,000/month + books allowance Rs. 5,000/year + computer allowance Rs. 45,000 one-time.',
    'ST student admitted to notified institutions (IIT, IIM, NIT, AIIMS, etc.), family income <= Rs. 6.00 Lakh per annum.'
),
(
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111104',
    '2025-2026',
    1,
    TRUE,
    '2025-04-01',
    '2026-03-31',
    NULL,
    'JRF: Rs. 37,000/month + HRA; SRF: Rs. 42,000/month + HRA + contingency allowance Rs. 20,500/year.',
    'ST candidate enrolled in regular M.Phil / Ph.D program in recognized UGC/AICTE university. Cleared UGC-NET or direct selection committee merit.'
),
(
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111105',
    '2025-2026',
    1,
    TRUE,
    '2025-04-01',
    '2026-03-31',
    800000.00,
    'Annual maintenance: 15,400 USD (USA) / 9,900 GBP (UK) + full tuition fees + contingency + economy airfare + visa fees.',
    'ST candidate possessing 55% marks in qualifying degree, unconditional offer from top 500 QS ranked foreign university, family income <= Rs. 8.00 Lakh.'
);
