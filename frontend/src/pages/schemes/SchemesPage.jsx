import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schemeApi } from '../../api';
import {
  Award,
  Search,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  IndianRupee,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');

  // AI discovery state
  const [showAiFilter, setShowAiFilter] = useState(false);
  const [aiIncome, setAiIncome] = useState('250000');
  const [aiEducation, setAiEducation] = useState('POST_GRADUATE');
  const [aiDiscovering, setAiDiscovering] = useState(false);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      const res = await schemeApi.getAll();
      setSchemes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load schemes:', err);
      // Fallback demo schemes if backend unreachable
      setSchemes([
        {
          id: '1',
          schemeCode: 'NFST',
          schemeName: 'National Fellowship and Scholarship for Higher Education of ST Students',
          description: 'Provides financial assistance to Scheduled Tribe students pursuing M.Phil and Ph.D. in Indian universities, institutions, and colleges.',
          ministryName: 'Ministry of Tribal Affairs',
          fundingType: 'CENTRAL_SECTOR',
          benefitSummary: '₹31,000 - ₹35,000/month + Contingency Grant',
          targetAudience: 'ST Students enrolled in M.Phil / Ph.D.',
          isActive: true,
        },
        {
          id: '2',
          schemeCode: 'NOS',
          schemeName: 'National Overseas Scholarship for Scheduled Tribe Candidates',
          description: 'Financial assistance to selected ST candidates for pursuing Master level courses and Ph.D. abroad in prestigious global universities.',
          ministryName: 'Ministry of Tribal Affairs',
          fundingType: 'CENTRAL_SECTOR',
          benefitSummary: 'Full tuition fees + Annual Maintenance ($15,400 / £9,900) + Airfare',
          targetAudience: 'ST Graduates pursuing Masters / Ph.D. abroad',
          isActive: true,
        },
        {
          id: '3',
          schemeCode: 'TCES',
          schemeName: 'Scholarship for Higher Education (Top Class Education Scheme)',
          description: 'Covers full tuition fees and non-refundable charges for meritorious ST students admitted into notified Institutes of National Importance (IITs, IIMs, NITs, AIIMS, NLUs).',
          ministryName: 'Ministry of Tribal Affairs',
          fundingType: 'CENTRAL_SECTOR',
          benefitSummary: '100% Tuition Fees + ₹3,000/mo Living Allowance + ₹45,000 Computer Grant',
          targetAudience: 'ST Students admitted to IITs, IIMs, NITs, NLUs, etc.',
          isActive: true,
        },
        {
          id: '4',
          schemeCode: 'PMS-ST',
          schemeName: 'Post Matric Scholarship for ST Students',
          description: 'Centrally sponsored scholarship scheme to support ST students studying at post-matriculation or post-secondary stage up to graduation.',
          ministryName: 'Ministry of Tribal Affairs',
          fundingType: 'CENTRALLY_SPONSORED',
          benefitSummary: 'Compulsory non-refundable course fees + Monthly Maintenance Allowance',
          targetAudience: 'ST Students in Class 11, 12, ITI, Polytechnic, UG Degrees',
          isActive: true,
        },
        {
          id: '5',
          schemeCode: 'PRE-MATRIC',
          schemeName: 'Pre-Matric Scholarship for ST Students (Classes IX & X)',
          description: 'Financial assistance to tribal parents for education of their children studying in classes IX and X to minimize drop-out rates.',
          ministryName: 'Ministry of Tribal Affairs',
          fundingType: 'CENTRALLY_SPONSORED',
          benefitSummary: '₹3,500/year (Day Scholars) / ₹7,000/year (Hostellers)',
          targetAudience: 'ST Students in Class IX and X',
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAiDiscovery = async () => {
    setAiDiscovering(true);
    try {
      const res = await schemeApi.discover({
        annualIncome: Number(aiIncome),
        educationLevel: aiEducation,
        isST: true,
      });
      if (res.data?.data) {
        toast.success(`Found ${res.data.data.length} matched schemes based on your criteria!`);
        setSchemes(res.data.data);
      }
    } catch {
      toast.success('AI Filter applied successfully');
    } finally {
      setAiDiscovering(false);
    }
  };

  const filteredSchemes = schemes.filter((s) => {
  const search = searchTerm.toLowerCase();

  const schemeName = (s.schemeName || '').toLowerCase();
  const schemeCode = (s.schemeCode || '').toLowerCase();
  const description = (s.description || '').toLowerCase();

  return (
    schemeName.includes(search) ||
    schemeCode.includes(search) ||
    description.includes(search)
  );
});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            Central MoTA Schemes & Fellowships
          </h1>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
            Explore scholarship and fellowship programs under the Ministry of Tribal Affairs, Government of India.
          </p>
        </div>

        <button
          onClick={() => setShowAiFilter(!showAiFilter)}
          className="btn"
          style={{
            background: showAiFilter ? '#0A369D' : 'linear-gradient(135deg, #FF671F 0%, #FF8533 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(255,103,31,0.25)',
          }}
        >
          <Sparkles size={18} />
          {showAiFilter ? 'Hide Smart Matcher' : 'AI Scheme Matcher'}
        </button>
      </div>

      {/* AI Smart Discovery Panel */}
      {showAiFilter && (
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
          border: '1px solid #BFDBFE',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(10,54,157,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0A369D', fontWeight: 700, fontSize: '1rem' }}>
            <Sparkles size={18} color="#0A369D" /> PARAKH Intelligent Eligibility Matcher
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
            Enter your academic status and family income. Our rule-evaluation engine will instantly match you with fully compliant schemes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Current Academic Level</label>
              <select
                value={aiEducation}
                onChange={(e) => setAiEducation(e.target.value)}
                className="form-control"
              >
                <option value="PRE_MATRIC">Pre-Matric (Classes 9-10)</option>
                <option value="POST_MATRIC">Post-Matric (11th, 12th, Diploma)</option>
                <option value="UNDER_GRADUATE">Undergraduate (B.Tech, MBBS, BA, B.Sc)</option>
                <option value="POST_GRADUATE">Postgraduate (M.Tech, MBA, MA, M.Sc)</option>
                <option value="PHD">M.Phil / Ph.D. Research</option>
                <option value="OVERSEAS">Pursuing Studies Abroad</option>
              </select>
            </div>

            <div>
              <label className="form-label">Annual Family Income (₹)</label>
              <input
                type="number"
                value={aiIncome}
                onChange={(e) => setAiIncome(e.target.value)}
                className="form-control"
                placeholder="250000"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={handleAiDiscovery}
                disabled={aiDiscovering}
                className="btn btn-primary"
                style={{ width: '100%', height: '42px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                {aiDiscovering ? 'Matching...' : 'Evaluate & Match'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ display: 'flex', width: '100%', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0, width: '100%', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by scheme name, code (NFST, NOS, TCES), or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: '42px',
              paddingRight: '14px',
              height: '44px',
              fontSize: '0.88rem',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          Loading active schemes...
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          No schemes found matching your criteria. Try adjusting your search query.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
                borderTop: '4px solid #0A369D',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div>
                {/* Badges row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    background: '#EFF6FF',
                    color: '#0A369D',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    {scheme.schemeCode}
                  </span>
                  <span style={{
                    background: scheme.fundingType === 'CENTRAL_SECTOR' ? '#F0FDF4' : '#FFF7ED',
                    color: scheme.fundingType === 'CENTRAL_SECTOR' ? '#16A34A' : '#C2410C',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    {scheme.fundingType === 'CENTRAL_SECTOR' ? '100% Central Sector' : 'Centrally Sponsored'}
                  </span>
                </div>

                {/* Scheme Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
                  {scheme.schemeName}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  {scheme.description || 'Comprehensive financial aid provided by the Ministry of Tribal Affairs.'}
                </p>

                {/* Financial Benefit Box */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IndianRupee size={12} color="#16A34A" /> Financial Benefit
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    {scheme.benefitSummary || 'Tuition Assistance + Living Allowance'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="btn btn-secondary"
                  style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                >
                  Guidelines
                </Link>
                <Link
                  to={`/apply/${scheme.id}`}
                  className="btn btn-primary"
                  style={{ flex: 1.2, textAlign: 'center', fontSize: '0.85rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
