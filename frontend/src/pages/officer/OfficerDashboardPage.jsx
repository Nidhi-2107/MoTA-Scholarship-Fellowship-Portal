import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api';
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Building,
  Users,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function OfficerDashboardPage() {
  const [stats, setStats] = useState({
    totalApplications: 1420,
    submittedApplications: 340,
    scrutinyApplications: 128,
    verifiedApplications: 820,
    approvedApplications: 780,
    deficientApplications: 45,
    disbursedApplications: 650,
  });

  const chartData = [
    { scheme: 'NFST', pending: 42, approved: 180 },
    { scheme: 'NOS', pending: 18, approved: 60 },
    { scheme: 'TCES', pending: 35, approved: 240 },
    { scheme: 'PMS-ST', pending: 85, approved: 420 },
    { scheme: 'Pre-Matric', pending: 20, approved: 150 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Officer Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,103,31,0.2)',
            color: '#FF671F',
            border: '1px solid rgba(255,103,31,0.4)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            <ShieldCheck size={14} /> Ministry Scrutiny Officer Console
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
            Officer Workspace & Verification Queue
          </h1>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>
            Review applicant documents, execute automated rule verification, and approve disbursements.
          </p>
        </div>

        <Link
          to="/officer/applications"
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #FF671F 0%, #FF8533 100%)',
            color: '#fff',
            fontWeight: 700,
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
          }}
        >
          Open Scrutiny Queue <ArrowRight size={18} />
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Pending Officer Scrutiny</div>
          <div className="stat-value" style={{ color: '#FF671F' }}>128</div>
          <div style={{ fontSize: '0.8rem', color: '#C2410C', marginTop: '4px' }}>
            Awaiting verification
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Deficiencies Flagged</div>
          <div className="stat-value" style={{ color: '#DC2626' }}>45</div>
          <div style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '4px' }}>
            Returned to applicant
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Approved & Sanctioned</div>
          <div className="stat-value" style={{ color: '#16A34A' }}>780</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', marginTop: '4px' }}>
            Ready for PFMS DBT batch
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total Beneficiaries Disbursed</div>
          <div className="stat-value" style={{ color: '#0A369D' }}>650</div>
          <div style={{ fontSize: '0.8rem', color: '#0A369D', marginTop: '4px' }}>
            ₹18.42 Cr disbursed
          </div>
        </div>
      </div>

      {/* Scheme Workload Chart */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>
              Pending Scrutiny vs Approved by Scheme
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Central Sector & Sponsored MoTA Schemes (Academic Year 2026-27)
            </p>
          </div>
        </div>

        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="scheme" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#1E293B',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                }}
              />
              <Bar dataKey="pending" name="Pending Scrutiny" fill="#FF671F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approved" name="Approved" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
