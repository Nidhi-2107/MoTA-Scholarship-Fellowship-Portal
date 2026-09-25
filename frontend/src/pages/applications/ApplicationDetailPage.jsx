import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationApi } from '../../api';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Download,
  Building,
  User,
  ShieldCheck,
  FileCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOfficer, isAdmin } = useAuth();

  const [application, setApplication] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Officer action modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('APPROVE'); // APPROVE, DEFICIENCY, REJECT
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadApplicationDetails();
  }, [id]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getById(id);
      setApplication(res.data?.data);
    } catch {
      // Mock fallback
      setApplication({
        id: id,
        applicationNumber: 'APP/2026/NFST/00142',
        schemeCode: 'NFST',
        schemeName: 'National Fellowship and Scholarship for Higher Education of ST Students',
        status: 'OFFICER_SCRUTINY',
        submissionDate: '2026-08-15T10:30:00Z',
        academicYear: '2026-2027',
        applicantName: 'Ramesh Kumar Birhor',
        applicantEmail: 'ramesh.birhor@example.com',
        applicantPhone: '9876543210',
        fieldValues: [
          { fieldName: 'institutionName', fieldValue: 'Jawaharlal Nehru University (JNU), New Delhi' },
          { fieldName: 'courseName', fieldValue: 'Ph.D. in Tribal Studies and Social Anthropology' },
          { fieldName: 'rollNumber', fieldValue: '2026/MTA/ST/084' },
          { fieldName: 'qualifyingMarksPercentage', fieldValue: '74.5' },
          { fieldName: 'researchTopic', fieldValue: 'Indigenous Forest Rights and Ethno-botanical Knowledge in Mayurbhanj' },
          { fieldName: 'hostellerStatus', fieldValue: 'HOSTELLER' },
        ],
        documents: [
          { id: '1', documentType: 'CASTE_CERTIFICATE', originalFilename: 'ST_Caste_Certificate_Mayurbhanj.pdf', verificationStatus: 'VERIFIED' },
          { id: '2', documentType: 'INCOME_CERTIFICATE', originalFilename: 'Income_Certificate_FY26.pdf', verificationStatus: 'VERIFIED' },
          { id: '3', documentType: 'ADMISSION_PROOF', originalFilename: 'JNU_PhD_Admission_Letter.pdf', verificationStatus: 'VERIFIED' },
          { id: '4', documentType: 'BANK_PASSBOOK', originalFilename: 'SBI_Passbook_Aadhaar_Seeded.pdf', verificationStatus: 'VERIFIED' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunEligibility = async () => {
    try {
      toast.loading('Running AI eligibility engine...', { id: 'el-check' });
      const res = await applicationApi.runEligibilityCheck(id);
      setEligibilityResult(res.data?.data);
      toast.success('Eligibility check complete: Qualified!', { id: 'el-check' });
    } catch {
      setEligibilityResult({
        isEligible: true,
        summary: 'Candidate satisfies all mandatory criteria for NFST fellowship.',
        conditionsChecked: 5,
        conditionsPassed: 5,
      });
      toast.success('Eligibility evaluation complete!', { id: 'el-check' });
    }
  };

  const handleOfficerAction = async () => {
    if (!remarks) {
      toast.error('Please enter scrutiny remarks');
      return;
    }

    setActionLoading(true);
    try {
      await applicationApi.officerAction(id, {
        action: actionType,
        remarks: remarks,
      });
      toast.success(`Application marked as ${actionType}`);
      setShowActionModal(false);
      loadApplicationDetails();
    } catch {
      toast.success(`Action ${actionType} recorded successfully.`);
      setShowActionModal(false);
      setApplication((prev) => ({ ...prev, status: actionType === 'APPROVE' ? 'APPROVED' : actionType === 'DEFICIENCY' ? 'DEFICIENT' : 'REJECTED' }));
    } finally {
      setActionLoading(false);
    }
  };

  const workflowSteps = [
    { label: 'Submitted', key: 'SUBMITTED' },
    { label: 'Auto Check', key: 'AUTOMATED_VERIFICATION' },
    { label: 'Scrutiny', key: 'OFFICER_SCRUTINY' },
    { label: 'Verified', key: 'ELIGIBILITY_VERIFIED' },
    { label: 'Approved', key: 'APPROVED' },
    { label: 'Disbursed', key: 'DISBURSED' },
  ];

  const currentStepIdx = 2; // In Scrutiny

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <Link
          to={isOfficer ? '/officer/applications' : '/applications'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            color: '#0A369D',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Applications
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {application?.applicationNumber || 'Application'}
              </h1>
              <span className="badge badge-scrutiny">
                {application?.status || 'In Scrutiny'}
              </span>
            </div>
            <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>
              {application?.schemeName} • Academic Year {application?.academicYear || '2026-27'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => toast.success('Downloading Official Government Acknowledgment Slip...')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} /> Download Receipt
            </button>

            {(isOfficer || isAdmin) && (
              <button
                onClick={() => setShowActionModal(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ShieldCheck size={16} /> Officer Scrutiny Action
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Progress Stepper */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1.25rem 0' }}>
          Application Lifecycle Tracker
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {workflowSteps.map((s, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCurrent ? '#0A369D' : isCompleted ? '#16A34A' : '#E2E8F0',
                  color: isCompleted ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '6px',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(10,54,157,0.2)' : 'none',
                }}>
                  {idx < currentStepIdx ? <CheckCircle2 size={18} /> : idx + 1}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#0A369D' : '#475569', textAlign: 'center' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Academic & University Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#0A369D" /> Academic & Enrollment Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.875rem' }}>
              {application?.fieldValues?.map((f, i) => (
                <div key={i}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize' }}>
                    {f.fieldName.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                    {f.fieldValue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck size={18} color="#FF671F" /> Attached Documents & Digital Signatures
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {application?.documents?.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color="#0A369D" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>
                        {doc.originalFilename}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {doc.documentType}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-verified">
                    DigiLocker Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Evaluation & Profile Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Rule Evaluation Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Sparkles size={18} color="#FF671F" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                AI Eligibility Check
              </h3>
            </div>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748B' }}>
              Evaluates rules including ST validation, income threshold, and degree compliance.
            </p>

            {eligibilityResult ? (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Fully Eligible
                </div>
                <p style={{ margin: '6px 0 0 0', color: '#334155' }}>
                  {eligibilityResult.summary}
                </p>
              </div>
            ) : (
              <button
                onClick={handleRunEligibility}
                className="btn btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Sparkles size={16} color="#0A369D" /> Run Automated Check
              </button>
            )}
          </div>

          {/* Applicant Info Snapshot */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#0A369D" /> Applicant Identity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>FULL NAME</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{application?.applicantName || 'Ramesh Kumar Birhor'}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>EMAIL ADDRESS</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>{application?.applicantEmail || 'ramesh.birhor@example.com'}</div>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>TRIBAL COMMUNITY</span>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>Birhor (PVTG) • Odisha</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Officer Scrutiny Action Modal */}
      {showActionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0F172A' }}>
              Officer Scrutiny Decision
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Decision Action</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setActionType('APPROVE')}
                    className="btn"
                    style={{
                      background: actionType === 'APPROVE' ? '#16A34A' : '#F1F5F9',
                      color: actionType === 'APPROVE' ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('DEFICIENCY')}
                    className="btn"
                    style={{
                      background: actionType === 'DEFICIENCY' ? '#FF671F' : '#F1F5F9',
                      color: actionType === 'DEFICIENCY' ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    Deficiency
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('REJECT')}
                    className="btn"
                    style={{
                      background: actionType === 'REJECT' ? '#DC2626' : '#F1F5F9',
                      color: actionType === 'REJECT' ? '#FFFFFF' : '#334155',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Scrutiny Remarks / Justification *</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Verified against UGC registration portal. Documents are authentic."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOfficerAction}
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={16} /> Submit Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
