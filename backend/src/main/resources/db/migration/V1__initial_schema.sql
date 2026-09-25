-- ==============================================================================
-- MoTA Scholarship & Fellowship Operating System: Initial Database Schema (V1)
-- MySQL 8.0 DDL Script with CHAR(36) UUID identifiers, indexes, and audit columns
-- ==============================================================================

-- 1. Roles
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_users_username (username),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. OTP Verifications
CREATE TABLE IF NOT EXISTS otp_verifications (
    id CHAR(36) PRIMARY KEY,
    identifier VARCHAR(150) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    verification_type VARCHAR(30) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_otp_identifier (identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Applicant Profiles
CREATE TABLE IF NOT EXISTS applicant_profiles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    aadhaar_masked VARCHAR(20),
    st_caste_name VARCHAR(100) NOT NULL,
    pvtg_status BOOLEAN DEFAULT FALSE,
    disability_status BOOLEAN DEFAULT FALSE,
    address_line TEXT NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    family_annual_income DECIMAL(12, 2) NOT NULL,
    bank_account_masked VARCHAR(30),
    ifsc_code VARCHAR(20),
    bank_name VARCHAR(100),
    dbt_enabled BOOLEAN DEFAULT FALSE,
    otr_number VARCHAR(50),
    otr_status VARCHAR(30) DEFAULT 'NOT_LINKED',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Applicant Educations
CREATE TABLE IF NOT EXISTS applicant_educations (
    id CHAR(36) PRIMARY KEY,
    profile_id CHAR(36) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    institution_code VARCHAR(50),
    university_board VARCHAR(200) NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    passing_year INT NOT NULL,
    marks_percentage DECIMAL(5, 2),
    cgpa DECIMAL(4, 2),
    roll_number VARCHAR(50),
    is_current BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (profile_id) REFERENCES applicant_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Schemes
CREATE TABLE IF NOT EXISTS schemes (
    id CHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    objective TEXT NOT NULL,
    ministry VARCHAR(150) DEFAULT 'Ministry of Tribal Affairs',
    portal_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Scheme Versions
CREATE TABLE IF NOT EXISTS scheme_versions (
    id CHAR(36) PRIMARY KEY,
    scheme_id CHAR(36) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    version_number INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_to DATE NOT NULL,
    income_ceiling DECIMAL(12, 2),
    benefits_summary TEXT,
    rules_summary TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uk_scheme_version (scheme_id, academic_year, version_number),
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Scheme Form Fields
CREATE TABLE IF NOT EXISTS scheme_form_fields (
    id CHAR(36) PRIMARY KEY,
    scheme_version_id CHAR(36) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    label VARCHAR(200) NOT NULL,
    field_type VARCHAR(30) NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    options_json TEXT,
    placeholder VARCHAR(150),
    validation_regex VARCHAR(255),
    display_order INT DEFAULT 0,
    section_name VARCHAR(100) DEFAULT 'General',
    FOREIGN KEY (scheme_version_id) REFERENCES scheme_versions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Scheme Document Requirements
CREATE TABLE IF NOT EXISTS scheme_document_requirements (
    id CHAR(36) PRIMARY KEY,
    scheme_version_id CHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    max_size_mb INT DEFAULT 5,
    allowed_formats VARCHAR(100) DEFAULT 'PDF,JPG,JPEG,PNG',
    FOREIGN KEY (scheme_version_id) REFERENCES scheme_versions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Rules
CREATE TABLE IF NOT EXISTS rules (
    id CHAR(36) PRIMARY KEY,
    scheme_version_id CHAR(36) NOT NULL,
    rule_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    logic_operator VARCHAR(10) DEFAULT 'AND',
    error_message TEXT NOT NULL,
    priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (scheme_version_id) REFERENCES scheme_versions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Rule Conditions
CREATE TABLE IF NOT EXISTS rule_conditions (
    id CHAR(36) PRIMARY KEY,
    rule_id CHAR(36) NOT NULL,
    field_path VARCHAR(100) NOT NULL,
    operator VARCHAR(20) NOT NULL,
    expected_value TEXT NOT NULL,
    value_type VARCHAR(30) DEFAULT 'STRING',
    FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Applications
CREATE TABLE IF NOT EXISTS applications (
    id CHAR(36) PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    applicant_profile_id CHAR(36) NOT NULL,
    scheme_version_id CHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    current_stage VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    submission_date DATETIME(6),
    remarks TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (applicant_profile_id) REFERENCES applicant_profiles(id),
    FOREIGN KEY (scheme_version_id) REFERENCES scheme_versions(id),
    INDEX idx_applications_app_number (application_number),
    INDEX idx_applications_user (user_id),
    INDEX idx_applications_status (status),
    INDEX idx_applications_stage (current_stage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Application Field Values
CREATE TABLE IF NOT EXISTS application_field_values (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Documents (Metadata for local filesystem storage)
CREATE TABLE IF NOT EXISTS documents (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    storage_bucket VARCHAR(100) NOT NULL DEFAULT 'uploads',
    sha256_hash VARCHAR(64),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_documents_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Application Documents
CREATE TABLE IF NOT EXISTS application_documents (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    document_id CHAR(36),
    requirement_id CHAR(36),
    document_type VARCHAR(100) NOT NULL DEFAULT 'SUPPORTING_DOCUMENT',
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    verification_remarks TEXT,
    verified_by VARCHAR(100),
    verified_at DATETIME(6),
    is_current BOOLEAN DEFAULT TRUE,
    submission_round INT DEFAULT 1,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL,
    FOREIGN KEY (requirement_id) REFERENCES scheme_document_requirements(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Document Extractions (OCR / AI extracted key-values)
CREATE TABLE IF NOT EXISTS document_extractions (
    id CHAR(36) PRIMARY KEY,
    document_id CHAR(36) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    extracted_value TEXT,
    confidence DECIMAL(5, 2),
    page_number INT DEFAULT 1,
    extraction_method VARCHAR(50) DEFAULT 'TESSERACT_OCR',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Document Verifications
CREATE TABLE IF NOT EXISTS document_verifications (
    id CHAR(36) PRIMARY KEY,
    document_id CHAR(36) NOT NULL,
    application_id CHAR(36) NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    ocr_raw_text TEXT,
    ai_findings TEXT,
    consistency_status VARCHAR(50) DEFAULT 'CONSISTENT',
    verified_by CHAR(36),
    verified_at DATETIME(6),
    remarks TEXT,
    manual_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Eligibility Results
CREATE TABLE IF NOT EXISTS eligibility_results (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    is_eligible BOOLEAN NOT NULL,
    evaluated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    evaluator VARCHAR(100) DEFAULT 'DETERMINISTIC_RULE_ENGINE',
    rule_version VARCHAR(50),
    detailed_findings TEXT,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Rule Evaluation Results
CREATE TABLE IF NOT EXISTS rule_evaluation_results (
    id CHAR(36) PRIMARY KEY,
    eligibility_result_id CHAR(36) NOT NULL,
    rule_id CHAR(36),
    rule_name VARCHAR(200) NOT NULL,
    input_value TEXT,
    expected_value TEXT,
    is_passed BOOLEAN NOT NULL,
    evidence_snippet TEXT,
    document_ref VARCHAR(255),
    FOREIGN KEY (eligibility_result_id) REFERENCES eligibility_results(id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Deficiencies
CREATE TABLE IF NOT EXISTS deficiencies (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    document_id CHAR(36),
    reason TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    deadline DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN',
    applicant_response TEXT,
    resolution_remarks TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    resolved_at DATETIME(6),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL,
    INDEX idx_deficiencies_app (application_id),
    INDEX idx_deficiencies_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Workflow Transitions (State Machine Audit)
CREATE TABLE IF NOT EXISTS workflow_transitions (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    from_status VARCHAR(50) NOT NULL,
    to_status VARCHAR(50) NOT NULL,
    transitioned_by VARCHAR(100) NOT NULL,
    remarks TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Selection Rounds
CREATE TABLE IF NOT EXISTS selection_rounds (
    id CHAR(36) PRIMARY KEY,
    scheme_version_id CHAR(36) NOT NULL,
    round_name VARCHAR(150) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    available_seats INT DEFAULT 100,
    status VARCHAR(30) DEFAULT 'OPEN',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (scheme_version_id) REFERENCES scheme_versions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. Selection Results
CREATE TABLE IF NOT EXISTS selection_results (
    id CHAR(36) PRIMARY KEY,
    selection_round_id CHAR(36) NOT NULL,
    application_id CHAR(36) NOT NULL,
    merit_score DECIMAL(5, 2),
    selection_status VARCHAR(50) NOT NULL,
    sanction_order_number VARCHAR(100),
    sanction_amount DECIMAL(12, 2),
    decision_notes TEXT,
    decided_by CHAR(36),
    decided_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (selection_round_id) REFERENCES selection_rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (decided_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. Grievances
CREATE TABLE IF NOT EXISTS grievances (
    id CHAR(36) PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    application_id CHAR(36),
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    assigned_to VARCHAR(100),
    resolution_remarks TEXT,
    resolved_at DATETIME(6),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_grievances_user (user_id),
    INDEX idx_grievances_ticket (ticket_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'IN_APP',
    is_read BOOLEAN DEFAULT FALSE,
    reference_id VARCHAR(100),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id CHAR(36) PRIMARY KEY,
    actor_username VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    previous_state TEXT,
    new_state TEXT,
    ip_address VARCHAR(50),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_audit_logs_actor (actor_username),
    INDEX idx_audit_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 27. Integration Transactions
CREATE TABLE IF NOT EXISTS integration_transactions (
    id CHAR(36) PRIMARY KEY,
    system_name VARCHAR(50) NOT NULL,
    external_reference VARCHAR(150),
    application_id CHAR(36),
    request_summary TEXT,
    response_summary TEXT,
    sync_status VARCHAR(30) NOT NULL,
    retry_count INT DEFAULT 0,
    last_synced_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_integration_tx_system (system_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 28. Knowledge Documents (Chatbot Context)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    scheme_code VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    official_source_url VARCHAR(500),
    academic_year VARCHAR(20) DEFAULT '2025-2026',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 29. Chatbot Conversations & Messages
CREATE TABLE IF NOT EXISTS chat_conversations (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    session_id VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
    id CHAR(36) PRIMARY KEY,
    conversation_id CHAR(36) NOT NULL,
    sender_type VARCHAR(20) NOT NULL,
    message_text TEXT NOT NULL,
    context_retrieved TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
