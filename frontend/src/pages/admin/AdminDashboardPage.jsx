import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Award,
  Sliders,
  TrendingUp,
  Activity,
  IndianRupee,
  Building2,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const chartData = [
    { month: 'Apr', amount: 3.2 },
    { month: 'May', amount: 5.4 },
    { month: 'Jun', amount: 8.1 },
    { month: 'Jul', amount: 12.6 },
    { month: 'Aug', amount: 15.8 },
    { month: 'Sep', amount: 18.4 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1E38 0%, #1E293B 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#FFFFFF',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.15)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          <ShieldAlert size={14} color="#FFD700" /> Ministry Super Admin Operations
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
          PARAKH 2.0 National Administrative Console
        </h1>
        <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>
          Cross-scheme governance, dynamic rule engine configurations, PFMS payment integration status, and security audit logs.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total ST Beneficiaries</div>
          <div className="stat-value">24,580</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={14} /> +18.4% YoY Growth
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total DBT Disbursed</div>
          <div className="stat-value" style={{ color: '#16A34A' }}>₹18.4 Cr</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
            100% PFMS Aadhaar Mapper Success
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Avg. Scrutiny Turnaround</div>
          <div className="stat-value" style={{ color: '#0A369D' }}>3.2 Days</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', marginTop: '4px' }}>
            Down from 45 days (Legacy)
          </div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>CPGRAMS Grievance Disposal</div>
          <div className="stat-value" style={{ color: '#FF671F' }}>97.8%</div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
            Within Citizen Charter SLA
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
          Monthly Direct Benefit Transfer Disbursal (₹ in Crores)
        </h3>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748B' }}>
          Real-time tracking of automated electronic transfer to tribal beneficiaries
        </p>

        <div style={{ height: '260px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDbt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} unit=" Cr" />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorDbt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: '#EFF6FF', color: '#0A369D', borderRadius: '8px' }}>
              <Sliders size={20} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
              Dynamic Rule Engine
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
            Configure and publish eligibility rules without modifying backend code. Set income ceilings, age limits, and marks criteria.
          </p>
          <span style={{ fontSize: '0.8rem', color: '#0A369D', fontWeight: 600 }}>Active (5 Schemes Configured)</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: '#FFF7ED', color: '#FF671F', borderRadius: '8px' }}>
              <Users size={20} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
              Role-Based Access Control
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
            Manage permissions across Central Ministry, State Nodal Officers, and University Scrutiny desks.
          </p>
          <span style={{ fontSize: '0.8rem', color: '#FF671F', fontWeight: 600 }}>RBAC Enforcement Active</span>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: '#F0FDF4', color: '#16A34A', borderRadius: '8px' }}>
              <Activity size={20} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
              Interoperability Connectors
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
            Live status of DigiLocker API, NPCI Aadhaar Mapper, AISHE (Ministry of Education), and PFMS gateways.
          </p>
          <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>All Systems Nominal</span>
        </div>
      </div>
    </div>
  );
}
