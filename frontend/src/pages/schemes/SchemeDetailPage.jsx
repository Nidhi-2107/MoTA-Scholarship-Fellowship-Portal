import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { schemeApi } from '../../api';
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  FileText,
  IndianRupee,
  ShieldCheck,
  Building,
  HelpCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SchemeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemeDetails();
  }, [id]);

  const loadSchemeDetails = async () => {
    try {
      setLoading(true);
      const res = await schemeApi.getById(id);
      setScheme(res.data?.data);
    } catch {
      // Mock fallback if scheme detail endpoint is unavailable
      setScheme({
        id: id,
        schemeCode: 'NFST',
        schemeName: 'National Fellowship and Scholarship for Higher Education of ST Students',
        description: 'The National Fellowship and Scholarship for Higher Education of Scheduled Tribe (ST) students is a Central Sector Scheme formulated by the Ministry of Tribal Affairs to encourage tribal students to pursue higher studies leading to M.Phil and Ph.D. degrees in Science, Humanities, Social Science, and Engineering.',
        ministryName: 'Ministry of Tribal Affairs',
        fundingType: 'CENTRAL_SECTOR',
        financialYear: '2026-2027',
        benefitSummary: '₹31,000/mo (JRF) • ₹35,000/mo (SRF) + ₹10,000/yr Contingency + HRA',
        eligibilityCriteria: [
          'Candidate must belong to Scheduled Tribe (ST) as per Constitution Order.',
          'Candidate must have secured admission into a regular M.Phil/Ph.D. program in a recognized university (UGC/AICTE/INIs).',
          'Family annual income must not exceed ₹6.00 Lakhs per annum for scholarship component (No income ceiling for National Fellowship).',
          'Transgender, PVTG (Particularly Vulnerable Tribal Groups), and Persons with Disabilities (PwD) are given special priority reservation.',
          'Applicant must not be in receipt of any other fellowship/scholarship from UGC, CSIR, or central/state governments simultaneously.',
        ],
        requiredDocuments: [
          { name: 'ST Caste Certificate', desc: 'Issued by competent authority (Tehsildar / SDO / DM)' },
          { name: 'Family Income Certificate', desc: 'Valid income certificate for current financial year' },
          { name: 'M.Phil / Ph.D. Admission Letter', desc: 'Bonafide admission letter with roll number & date of registration' },
          { name: 'Postgraduate Marksheet & Degree', desc: 'Proof of qualifying PG examination' },
          { name: 'Aadhaar Card (eKYC Linked)', desc: 'Masked Aadhaar proof' },
          { name: 'Bank Passbook / Cancelled Cheque', desc: 'Aadhaar-seeded bank account for PFMS DBT transfer' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
        Loading scheme guidelines...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Back button */}
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
          }}
        >
          <ArrowLeft size={16} /> Back to Schemes Directory
        </Link>
      </div>

      {/* Hero Header */}
      <div className="card" style={{ padding: '2rem', borderTop: '4px solid #FF671F' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#EFF6FF', color: '#0A369D', fontWeight: 700, fontSize: '0.8rem', padding: '3px 8px', borderRadius: '6px' }}>
                {scheme?.schemeCode || 'MoTA SCHEME'}
              </span>
              <span style={{ background: '#F0FDF4', color: '#16A34A', fontWeight: 600, fontSize: '0.8rem', padding: '3px 8px', borderRadius: '6px' }}>
                Central Sector • 100% MoTA Funded
              </span>
              <span style={{ background: '#FFF7ED', color: '#C2410C', fontWeight: 600, fontSize: '0.8rem', padding: '3px 8px', borderRadius: '6px' }}>
                AY 2026-27 Open
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>
              {scheme?.schemeName}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {scheme?.description}
            </p>
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.5rem',
            minWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>FINANCIAL BENEFIT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A369D', marginTop: '4px' }}>
                {scheme?.benefitSummary || 'Stipend + Contingency + Tuition'}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>DISBURSAL MECHANISM</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <CheckCircle2 size={16} /> Direct Benefit Transfer (PFMS / DBT)
              </div>
            </div>

            <Link
              to={`/apply/${scheme?.id || id}`}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #FF671F 0%, #FF8533 100%)',
                border: 'none',
                boxShadow: '0 4px 14px rgba(255,103,31,0.3)',
              }}
            >
              Start Application <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Eligibility & Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Eligibility Section */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="#0A369D" /> Prescribed Eligibility Criteria
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(scheme?.eligibilityCriteria || [
                'Candidate must belong to Scheduled Tribe (ST) community.',
                'Candidate must be enrolled in an eligible accredited university.',
                'Aadhaar seeded bank account is required.',
              ]).map((crit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ color: '#16A34A', marginTop: '2px' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                    {crit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Required */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={22} color="#FF671F" /> Mandatory Verification Documents
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0' }}>
              Upload clear PDF scans (max 5MB each) or fetch directly via DigiLocker.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {(scheme?.requiredDocuments || [
                { name: 'Caste Certificate', desc: 'ST Community Certificate' },
                { name: 'Income Certificate', desc: 'Annual family income proof' },
                { name: 'Admission Proof', desc: 'University enrollment letter' },
                { name: 'Bank Details', desc: 'Passbook or cancelled cheque' },
              ]).map((doc, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', marginBottom: '2px' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {doc.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Timeline & Verification rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} color="#0A369D" /> Workflow Pipeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EFF6FF', color: '#0A369D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>Online Application Filing</div>
                  <div style={{ color: '#64748B' }}>Auto-populated via One Profile</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EFF6FF', color: '#0A369D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>AI Eligibility & Scrutiny</div>
                  <div style={{ color: '#64748B' }}>Rule-based compliance checking</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EFF6FF', color: '#0A369D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>Institute / Officer Verification</div>
                  <div style={{ color: '#64748B' }}>Bonafide confirmation</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>4</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#16A34A' }}>Sanction & DBT Disbursal</div>
                  <div style={{ color: '#64748B' }}>Direct transfer to bank via PFMS</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #0A369D 0%, #1952C7 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: '#FFFFFF',
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#FFD700" /> Have Questions?
            </h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.5 }}>
              Use the MoTA Virtual Assistant in the bottom right corner for immediate answers in tribal languages or English.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
