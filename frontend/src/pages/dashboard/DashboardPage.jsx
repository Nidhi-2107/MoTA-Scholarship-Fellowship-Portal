import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationApi, schemeApi } from '../../api';
import {
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  FileCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { user, isOfficer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // If user is officer or admin, redirect to specialized dashboard
  useEffect(() => {
    if (isOfficer) navigate('/officer');
    else if (isAdmin) navigate('/admin');
  }, [isOfficer, isAdmin, navigate]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [appsRes, schemesRes] = await Promise.all([
        applicationApi.getMy().catch(() => ({ data: { data: [] } })),
        schemeApi.getAll().catch(() => ({ data: { data: [] } })),
      ]);
      setApplications(appsRes.data?.data || []);
      setSchemes(schemesRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: { label: 'Draft', class: 'badge-draft' },
      SUBMITTED: { label: 'Submitted', class: 'badge-submitted' },
      OFFICER_SCRUTINY: { label: 'Scrutiny', class: 'badge-scrutiny' },
      ELIGIBILITY_VERIFIED: { label: 'Eligible', class: 'badge-verified' },
      APPROVED: { label: 'Approved', class: 'badge-approved' },
      SANCTIONED: { label: 'Sanctioned', class: 'badge-approved' },
      DISBURSED: { label: 'Disbursed', class: 'badge-disbursed' },
      DEFICIENT: { label: 'Deficiency Noted', class: 'badge-deficient' },
    };
    const b = badges[status] || { label: status, class: 'badge-draft' };
    return <span className={`badge ${b.class}`}>{b.label}</span>;
  };

  // Chart data
  const pipelineData = [
    { name: 'Draft', count: applications.filter(a => a.status === 'DRAFT').length || 1 },
    { name: 'Submitted', count: applications.filter(a => a.status === 'SUBMITTED').length || 1 },
    { name: 'Scrutiny', count: applications.filter(a => a.status === 'OFFICER_SCRUTINY').length || 0 },
    { name: 'Approved', count: applications.filter(a => ['APPROVED', 'SANCTIONED', 'DISBURSED'].includes(a.status)).length || 1 },
  ];

  const pieData = [
    { name: 'Higher Education', value: 45, color: '#0A369D' },
    { name: 'National Fellowship', value: 30, color: '#FF671F' },
    { name: 'Top Class Education', value: 25, color: '#138808' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A369D 0%, #1952C7 60%, #0F2D6B 100%)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(10,54,157,0.3)',
      }}>
        <div style={{
          position: 'absolute',
          right: '-5%',
          top: '-20%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,103,31,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={14} color="#FFD700" />
            <span>AI-Assisted Operating System for Scheduled Tribes</span>
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Welcome, {user?.fullName || 'Applicant'}!
          </h1>
          <p style={{ margin: '0 0 1.5rem 0', color: '#E2E8F0', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Empowering tribal education through automated eligibility discovery, DigiLocker e-verification, and direct benefit transfer (DBT).
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
            <Link to="/schemes" className="btn" style={{
              background: '#FF671F',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              padding: '0.625rem 1.25rem',
            }}>
              Discover Schemes <ArrowRight size={16} />
            </Link>
            <Link to="/profile" className="btn" style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(6px)',
              fontWeight: 600,
              padding: '0.625rem 1.25rem',
            }}>
              One Profile Sync
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
      }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>My Applications</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#EFF6FF', color: '#0A369D' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className="stat-value">{applications.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={14} /> Active Academic Year 2026-27
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>MoTA Schemes Open</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#FFF7ED', color: '#FF671F' }}>
              <Award size={20} />
            </div>
          </div>
          <div className="stat-value">{schemes.length || 5}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
            100% Fully Central Sector Funded
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>Action Required</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#FEF2F2', color: '#DC2626' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="stat-value">
            {applications.filter(a => a.status === 'DEFICIENT').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '4px' }}>
            {applications.filter(a => a.status === 'DEFICIENT').length > 0 ? 'Document deficiency to re-upload' : 'All applications clear'}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>OTR Sync Status</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#F0FDF4', color: '#16A34A' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.25rem', color: '#16A34A' }}>
            Active & Verified
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
            Aadhaar eKYC + DigiLocker Connected
          </div>
        </div>
      </div>

      {/* Analytics Visualizer Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                Application Pipeline Stage
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                Automated workflow tracker across scrutinies
              </p>
            </div>
          </div>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1E293B',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.85rem',
                  }}
                />
                <Bar dataKey="count" fill="#0A369D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#0F172A' }}>
            Scheme Allocation
          </h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748B' }}>
            MoTA Fellowships & Scholarships
          </p>
          <div style={{ height: '180px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {pieData.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color }} />
                  <span>{p.name}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table & Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Applications */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
              My Applications
            </h3>
            <Link to="/applications" style={{ fontSize: '0.85rem', color: '#0A369D', fontWeight: 600, textDecoration: 'none' }}>
              View All &rarr;
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
              <FileCheck size={40} style={{ margin: '0 auto 0.75rem auto', color: '#CBD5E1' }} />
              <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>No applications filed yet</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                Discover Central Sector schemes suited to your profile and apply in one click.
              </p>
              <Link to="/schemes" className="btn btn-primary" style={{ display: 'inline-flex', gap: '6px' }}>
                Explore Open Schemes
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>App Number</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Scheme</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#0F172A' }}>
                        {app.applicationNumber}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                        {app.schemeName || 'National Fellowship for ST'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {getStatusBadge(app.status)}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <Link
                          to={`/applications/${app.id}`}
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Official MoTA Notices & Deadlines */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#FF671F" /> Important MoTA Updates
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: '#FFF7ED',
              borderLeft: '4px solid #FF671F',
              borderRadius: '6px',
              padding: '0.75rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C2410C', marginBottom: '2px' }}>
                National Overseas Scholarship (NOS)
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#7C2D12' }}>
                Portal open for 2026-27 intake. Ensure passport and unconditional offer letter are uploaded.
              </p>
            </div>

            <div style={{
              background: '#EFF6FF',
              borderLeft: '4px solid #0A369D',
              borderRadius: '6px',
              padding: '0.75rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0A369D', marginBottom: '2px' }}>
                Aadhaar-Seeded Bank Account (DBT)
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#1E3A8A' }}>
                Scholarship funds are directly credited via PFMS. Ensure your bank account has active DBT mapping.
              </p>
            </div>

            <div style={{
              background: '#F0FDF4',
              borderLeft: '4px solid #138808',
              borderRadius: '6px',
              padding: '0.75rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#138808', marginBottom: '2px' }}>
                Grievance Redressal (CPGRAMS / PARAKH)
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#14532D' }}>
                Have questions or payment delays? Raise an instant ticket via the Grievances tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
