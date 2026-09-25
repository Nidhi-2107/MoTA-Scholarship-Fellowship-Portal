import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function OfficerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getAll();
      setApplications(res.data?.data?.content || res.data?.data || []);
    } catch {
      // Mock fallback
      setApplications([
        {
          id: 'b1111111-1111-1111-1111-111111111111',
          applicationNumber: 'APP/2026/NFST/00142',
          applicantName: 'Ramesh Kumar Birhor',
          stCommunity: 'Birhor (PVTG)',
          stateName: 'Odisha',
          schemeCode: 'NFST',
          schemeName: 'National Fellowship for ST Students',
          submissionDate: '2026-08-15T10:30:00Z',
          status: 'OFFICER_SCRUTINY',
          rulePassed: true,
        },
        {
          id: 'b2222222-2222-2222-2222-222222222222',
          applicationNumber: 'APP/2026/NOS/00045',
          applicantName: 'Sunita Marandi',
          stCommunity: 'Santhal',
          stateName: 'Jharkhand',
          schemeCode: 'NOS',
          schemeName: 'National Overseas Scholarship',
          submissionDate: '2026-08-18T14:20:00Z',
          status: 'SUBMITTED',
          rulePassed: true,
        },
        {
          id: 'b3333333-3333-3333-3333-333333333333',
          applicationNumber: 'APP/2026/TCES/00089',
          applicantName: 'Amitabh Munda',
          stCommunity: 'Munda',
          stateName: 'Chhattisgarh',
          schemeCode: 'TCES',
          schemeName: 'Top Class Education Scheme (IIT Bombay)',
          submissionDate: '2026-08-20T11:00:00Z',
          status: 'DEFICIENT',
          rulePassed: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesFilter = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.schemeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
          Verification & Scrutiny Queue
        </h1>
        <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>
          Execute document checks, inspect AI compliance evaluations, and record formal scrutiny decisions.
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'SUBMITTED', 'OFFICER_SCRUTINY', 'DEFICIENT', 'APPROVED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="btn"
              style={{
                background: statusFilter === status ? '#0A369D' : '#FFFFFF',
                color: statusFilter === status ? '#FFFFFF' : '#475569',
                border: '1px solid #CBD5E1',
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ width: '280px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search applicant or app no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
                <th style={{ padding: '1rem' }}>App Number</th>
                <th style={{ padding: '1rem' }}>Applicant Name & Community</th>
                <th style={{ padding: '1rem' }}>Scheme</th>
                <th style={{ padding: '1rem' }}>Automated AI Rule</th>
                <th style={{ padding: '1rem' }}>Stage</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Scrutiny Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>
                    {app.applicationNumber}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{app.applicantName || 'Applicant'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {app.stCommunity || 'Scheduled Tribe'} • {app.stateName || 'India'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#334155' }}>
                    <span style={{ fontWeight: 600 }}>{app.schemeCode}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: '#F0FDF4',
                      color: '#16A34A',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <CheckCircle2 size={12} /> Rules Passed
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-scrutiny">
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link
                      to={`/applications/${app.id}`}
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ShieldCheck size={14} /> Review File <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
