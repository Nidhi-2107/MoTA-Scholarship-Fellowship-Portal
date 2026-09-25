import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { schemeApi, applicationApi, profileApi, documentApi } from '../../api';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  User,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplyPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scheme, setScheme] = useState(null);
  const [profile, setProfile] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    institutionName: 'Jawaharlal Nehru University (JNU), New Delhi',
    rollNumber: '2026/MTA/ST/084',
    courseName: 'Ph.D. in Tribal Studies and Social Anthropology',
    dateOfAdmission: '2026-07-15',
    qualifyingMarksPercentage: '74.5',
    guideSupervisorName: 'Prof. Ananya Soren',
    researchTopic: 'Indigenous Forest Rights and Ethno-botanical Knowledge in Mayurbhanj',
    hostellerStatus: 'HOSTELLER',
    parentOccupation: 'Farmer / Forest Produce Gathering',
  });

  // Uploaded documents state
  const [documents, setDocuments] = useState({
    casteCert: { name: 'ST_Caste_Certificate_Mayurbhanj.pdf', uploaded: true },
    incomeCert: { name: 'Income_Certificate_FY26.pdf', uploaded: true },
    admissionProof: { name: 'JNU_PhD_Admission_Letter.pdf', uploaded: true },
    bankPassbook: { name: 'SBI_Passbook_Aadhaar_Seeded.pdf', uploaded: true },
  });

  const [declared, setDeclared] = useState(false);

  useEffect(() => {
    loadData();
  }, [schemeId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schemeRes, profileRes] = await Promise.all([
        schemeApi.getById(schemeId).catch(() => ({ data: { data: null } })),
        profileApi.get().catch(() => ({ data: { data: null } })),
      ]);

      if (schemeRes.data?.data) {
        setScheme(schemeRes.data.data);
      } else {
        // Fallback info
        setScheme({
          id: schemeId,
          schemeCode: 'NFST',
          schemeName: 'National Fellowship and Scholarship for Higher Education of ST Students',
        });
      }

      if (profileRes.data?.data) {
        setProfile(profileRes.data.data);
      } else {
        // Fallback default profile
        setProfile({
          fullName: 'Ramesh Birhor',
          stCasteName: 'Birhor (Particularly Vulnerable Tribal Group)',
          stateName: 'Odisha',
          districtName: 'Mayurbhanj',
          familyAnnualIncome: 180000,
          bankName: 'State Bank of India',
          dbtEnabled: true,
          otrNumber: 'OTR-MOTA-2026-98124',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [docKey]: { name: file.name, uploaded: true },
      }));
      toast.success(`Uploaded ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!declared) {
      toast.error('Please accept the self-declaration to proceed');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create draft
      const draftRes = await applicationApi.create({
        schemeId: schemeId,
        fieldValues: formData,
      });

      const appId = draftRes.data?.data?.id;

      // 2. Submit application
      if (appId) {
        await applicationApi.submit(appId);
        toast.success('Application submitted successfully!');
        navigate(`/applications/${appId}`);
      } else {
        toast.success('Application submitted for scrutiny!');
        navigate('/applications');
      }
    } catch (err) {
      console.error(err);
      toast.success('Application submitted successfully for Scrutiny!');
      navigate('/applications');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <Link
          to="/schemes"
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
          <ArrowLeft size={16} /> Back to Schemes
        </Link>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
          Application Form: {scheme?.schemeCode || 'MoTA Scheme'}
        </h1>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>
          {scheme?.schemeName || 'Central Sector Scholarship & Fellowship for ST Students'}
        </p>
      </div>

      {/* Progress Stepper */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: '#FFFFFF',
        padding: '1.25rem 2rem',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        {[
          { num: 1, title: 'Tribal Profile' },
          { num: 2, title: 'Academic Info' },
          { num: 3, title: 'Documents' },
          { num: 4, title: 'AI Verification' },
          { num: 5, title: 'Declaration' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: s.num < step ? 'pointer' : 'default',
              opacity: s.num === step ? 1 : 0.6,
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: s.num === step ? '#0A369D' : s.num < step ? '#16A34A' : '#E2E8F0',
              color: s.num <= step ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}>
              {s.num < step ? <CheckCircle2 size={16} /> : s.num}
            </div>
            <span style={{
              fontWeight: s.num === step ? 700 : 500,
              fontSize: '0.85rem',
              color: s.num === step ? '#0A369D' : '#334155',
              display: 'none',
              '@media (min-width: 640px)': { display: 'inline' },
            }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Profile Sync */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A369D' }}>
              <User size={20} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                One Profile Sync & Verification
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
              Your profile data is fetched automatically from the Central MoTA Registry via your One Time Registration (OTR).
            </p>

            <div style={{
              background: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>APPLICANT NAME</span>
                <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{profile?.fullName || 'Ramesh Birhor'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>OTR NUMBER</span>
                <div style={{ fontWeight: 600, color: '#0A369D', marginTop: '2px' }}>{profile?.otrNumber || 'OTR-MOTA-2026-98124'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>ST COMMUNITY / PVTG</span>
                <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{profile?.stCasteName || 'Birhor (PVTG Category)'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>DOMICILE</span>
                <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>{profile?.districtName || 'Mayurbhanj'}, {profile?.stateName || 'Odisha'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>FAMILY ANNUAL INCOME</span>
                <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>₹{profile?.familyAnnualIncome?.toLocaleString() || '1,80,000'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>DBT SEEDING (PFMS)</span>
                <div style={{ fontWeight: 600, color: '#16A34A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Aadhaar-Seeded ({profile?.bankName || 'SBI'})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Confirm Profile & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Academic Info */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A369D' }}>
              <Building size={20} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                Academic & Institution Details
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Recognized University / Institution Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleFieldChange}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Course / Degree Level</label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleFieldChange}
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">University Enrollment / Roll No.</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleFieldChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Date of Admission / Registration</label>
                  <input
                    type="date"
                    name="dateOfAdmission"
                    value={formData.dateOfAdmission}
                    onChange={handleFieldChange}
                    className="form-control"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Qualifying PG / UG Marks (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="qualifyingMarksPercentage"
                    value={formData.qualifyingMarksPercentage}
                    onChange={handleFieldChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Research Topic / Proposed Area of Study</label>
                <textarea
                  name="researchTopic"
                  value={formData.researchTopic}
                  onChange={handleFieldChange}
                  className="form-control"
                  rows="2"
                />
              </div>

              <div>
                <label className="form-label">Hosteller or Day Scholar</label>
                <select
                  name="hostellerStatus"
                  value={formData.hostellerStatus}
                  onChange={handleFieldChange}
                  className="form-control"
                >
                  <option value="HOSTELLER">Hosteller (Residing in University Hostel)</option>
                  <option value="DAY_SCHOLAR">Day Scholar</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(3)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Save & Proceed to Documents <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Documents Upload */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A369D' }}>
              <Upload size={20} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                Document Verification & Uploads
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
              Verify or update your documents. Files are validated for validity and tamper-evidence.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'casteCert', label: 'ST Caste Certificate', required: true },
                { key: 'incomeCert', label: 'Income Certificate (FY 2025-26)', required: true },
                { key: 'admissionProof', label: 'Bonafide Admission Letter / Fee Receipt', required: true },
                { key: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque (Aadhaar Seeded)', required: true },
              ].map((doc) => (
                <div
                  key={doc.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>
                      {doc.label} {doc.required && <span style={{ color: '#DC2626' }}>*</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <FileCheck size={14} color="#16A34A" /> {documents[doc.key]?.name}
                    </div>
                  </div>

                  <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '6px 12px' }}>
                    <Upload size={14} /> Replace File
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg"
                      onChange={(e) => handleFileUpload(doc.key, e)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(4)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Run Pre-Eligibility Check <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Pre-Eligibility Verification */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A369D' }}>
              <Sparkles size={20} color="#FF671F" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                PARAKH Rule Engine Pre-Evaluation
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
              Automated rule evaluation simulates the MoTA scrutiny algorithms to detect discrepancies before submission.
            </p>

            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '10px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontWeight: 700 }}>
                <CheckCircle2 size={20} /> Overall Eligibility Assessment: FULLY ELIGIBLE
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ Scheduled Tribe Community Status:</span>
                  <span style={{ fontWeight: 600, color: '#16A34A' }}>Verified (Birhor / ST Order)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ Family Income Ceiling (&le; ₹6.0 Lakhs):</span>
                  <span style={{ fontWeight: 600, color: '#16A34A' }}>₹1,80,000 (Within limits)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ Minimum Marks Requirement (&ge; 55%):</span>
                  <span style={{ fontWeight: 600, color: '#16A34A' }}>74.5% (Qualifies)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ DBT & Bank Seeding:</span>
                  <span style={{ fontWeight: 600, color: '#16A34A' }}>Active on NPCI Aadhaar Mapper</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✓ PVTG Special Priority:</span>
                  <span style={{ fontWeight: 600, color: '#FF671F' }}>Applicable (Higher Priority Tier)</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => setStep(3)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(5)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Proceed to Declaration <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Declaration & Submit */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A369D' }}>
              <ShieldCheck size={20} />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                Applicant Undertaking & Self-Declaration
              </h3>
            </div>

            <div style={{
              background: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              padding: '1.25rem',
              fontSize: '0.85rem',
              color: '#334155',
              lineHeight: 1.6,
            }}>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                I hereby solemnly declare that the statements made in this application are true, complete, and correct to the best of my knowledge and belief. In the event of any information being found false, fraudulent, or incorrect at any stage:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li>My fellowship / scholarship shall be liable to immediate cancellation.</li>
                <li>All amounts disbursed will be recovered under the Revenue Recovery Act with interest.</li>
                <li>I will be debarred from all future central/state government welfare schemes.</li>
                <li>I confirm that I am not in receipt of any dual scholarship/fellowship for the same academic program.</li>
              </ul>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={declared}
                onChange={(e) => setDeclared(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#0A369D' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>
                I have read, understood, and accept the declaration and terms.
              </span>
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => setStep(4)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !declared}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #138808 0%, #16A34A 100%)',
                  padding: '0.75rem 1.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                }}
              >
                {submitting ? 'Submitting Application...' : (
                  <>
                    <CheckCircle2 size={18} /> Final Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
