-- ==============================================================================
-- MoTA Scholarship & Fellowship Operating System: Seed Roles (V2)
-- ==============================================================================

INSERT IGNORE INTO roles (id, name, description) VALUES
('ROLE_APPLICANT', 'Applicant', 'Scheduled Tribe student applying for scholarships/fellowships'),
('ROLE_INSTITUTE_OFFICER', 'Institute Nodal Officer', 'Verifies student enrollment, course details, and fee structure at institute level'),
('ROLE_SCRUTINY_OFFICER', 'Scrutiny Officer', 'Performs document verification, deficiency checks, and evidence review'),
('ROLE_DISTRICT_OFFICER', 'District Welfare Officer', 'Oversees district-level quota and scrutiny escalations'),
('ROLE_STATE_OFFICER', 'State Welfare Officer', 'Manages state scholarship portal syncing and state verification'),
('ROLE_MOTA_OFFICER', 'Ministry Officer', 'Central Ministry of Tribal Affairs administrator for sanction and policy'),
('ROLE_SELECTION_COMMITTEE', 'Selection Committee Member', 'Evaluates NFST/NOS research proposals and merit rankings'),
('ROLE_ADMIN', 'Platform Administrator', 'Manages scheme configurations, rules, workflows, and integrations'),
('ROLE_SUPER_ADMIN', 'Super Administrator', 'Full root access to all system audit, security, and administrative modules');
