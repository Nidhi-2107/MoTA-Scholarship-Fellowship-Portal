import { Link } from 'react-router-dom';
import { Award, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: '#EFF6FF',
          color: '#0A369D',
          marginBottom: '1.25rem',
        }}>
          <Award size={32} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', margin: '0 0 0.75rem 0' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
          The requested resource does not exist on the PARAKH 2.0 MoTA Scholarship Operating System.
        </p>

        <Link
          to="/dashboard"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
