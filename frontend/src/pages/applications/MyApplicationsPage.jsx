import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Plus,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getMy();
      setApplications(res.data?.data || []);
    } catch {
      // Mock fallback if API fails
      setApplications([
        {
          id: 'b1111111-1111-1111-1111-111111111111',
          applicationNumber: 'APP/2026/NFST/00142',
          schemeCode: 'NFST',
          schemeName: 'National Fellowship and Scholarship for Higher Education of ST Students',
          submissionDate: '2026-08-15T10:30:00Z',
          status: 'OFFICER_SCRUTINY',
          academicYear: '2026-2027',
        },
        {
          id: 'b2222222-2222-2222-2222-222222222222',
          applicationNumber: 'APP/2026/TCES/00098',
          schemeCode: 'TCES',
          schemeName: 'Top Class Education Scheme for Scheduled Tribe Students',
          submissionDate: '2026-07-20T14:15:00Z',
          status: 'SANCTIONED',
          academicYear: '2026-2027',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: { label: 'Draft', class: 'badge-draft' },
      SUBMITTED: { label: 'Submitted', class: 'badge-submitted' },
      OFFICER_SCRUTINY: { label: 'In Officer Scrutiny', class: 'badge-scrutiny' },
      ELIGIBILITY_VERIFIED: { label: 'Eligibility Verified', class: 'badge-verified' },
      APPROVED: { label: 'Approved', class: 'badge-approved' },
      SANCTIONED: { label: 'Sanctioned', class: 'badge-approved' },
      DISBURSED: { label: 'Direct Benefit Disbursed', class: 'badge-disbursed' },
      DEFICIENT: { label: 'Deficiency Noted', class: 'badge-deficient' },
    };
    const b = badges[status] || { label: status, class: 'badge-draft' };
    return <span className={`badge ${b.class}`}>{b.label}</span>;
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filter === 'ALL' || app.status === filter;
    const matchesSearch =
      app.applicationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      app.schemeName?.toLowerCase().includes(search.toLowerCase()) ||
      app.schemeCode?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
            My Applications
          </h1>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>
            Track the end-to-end verification, scrutiny, and DBT disbursement lifecycle.
          </p>
        </div>

        <Link
          to="/schemes"
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={18} /> Apply for New Scheme
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'OFFICER_SCRUTINY', label: 'In Scrutiny' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'DEFICIENT', label: 'Deficiencies' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="btn"
              style={{
                background: filter === tab.id ? '#0A369D' : '#FFFFFF',
                color: filter === tab.id ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search by app no. or scheme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          Loading your applications...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748B' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem auto', color: '#CBD5E1' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
            No applications match your filter
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
            You haven't filed any applications under this category yet.
          </p>
          <Link to="/schemes" className="btn btn-primary">
            Explore Available Schemes
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
                  <th style={{ padding: '1rem' }}>Application Number</th>
                  <th style={{ padding: '1rem' }}>Scheme & Academic Year</th>
                  <th style={{ padding: '1rem' }}>Submitted On</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>
                      {app.applicationNumber}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{app.schemeName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>AY {app.academicYear || '2026-27'}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>
                      {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Draft'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(app.status)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Link
                        to={`/applications/${app.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        Track & View <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
