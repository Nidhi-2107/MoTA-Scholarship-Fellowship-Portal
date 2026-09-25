import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LogIn, User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight,
  HelpCircle, Phone, Mail, Award, CheckCircle2, ChevronRight, Home
} from 'lucide-react';

export default function LoginPage() {
  const { login, isOfficer, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: 'applicant',
    password: 'Demo@123'
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState('APPLICANT');
  const [rememberMe, setRememberMe] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectLabel, setRedirectLabel] = useState('');

  const demoAccounts = [
    {
      role: 'APPLICANT',
      title: 'Student / Applicant',
      name: 'Rahul Ramesh Munda',
      email: 'applicant',
      password: 'Demo@123',
      badge: 'ST Scholar'
    },
    {
      role: 'SCRUTINY_OFFICER',
      title: 'Scrutiny Officer',
      name: 'Sunita Tekam',
      email: 'scrutiny_officer',
      password: 'Demo@123',
      badge: 'Scrutiny Officer'
    },
    {
      role: 'ADMIN',
      title: 'Portal Administrator',
      name: 'MoTA Portal Administrator',
      email: 'admin',
      password: 'Demo@123',
      badge: 'Ministry Admin'
    }
  ];

  const handleSelectRole = (acc) => {
    setSelectedRole(acc.role);
    setForm({ email: acc.email, password: acc.password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter both Email/Mobile and Password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user?.fullName ? user.fullName.split(' ')[0] : 'Scholar'}!`);

      // Use the returned user's role for immediate redirect
      const userRole = user?.role || '';
      let redirectPath = '/dashboard';
      let redirectLabel = 'Applicant Dashboard';

      if (userRole === 'INSTITUTE_OFFICER' || userRole === 'SCRUTINY_OFFICER' || userRole === 'DISTRICT_OFFICER' || userRole === 'STATE_OFFICER' || userRole === 'MOTA_OFFICER' || userRole === 'SELECTION_COMMITTEE') {
        redirectPath = '/officer';
        redirectLabel = 'Officer Console';
      } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        redirectPath = '/admin';
        redirectLabel = 'Admin Console';
      }

      setRedirectLabel(redirectLabel);
      setRedirecting(true);

      // Brief pause for toast to be visible, then redirect
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please verify your Email and Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gov-auth-page-wrapper">
      {/* 1. Official Government Header Bar */}
      <header className="gov-auth-top-header">
        <div className="gov-container flex items-center justify-between">
          <Link to="/" className="gov-brand-cluster flex items-center gap-3">
            <img
              src="/emblem.svg"
              alt="State Emblem of India"
              className="gov-emblem-img"
              width="44"
              height="58"
            />
            <div className="gov-portal-titles">
              <h1 className="gov-portal-main-title">National Scholarship Assistance Portal</h1>
              <p className="gov-portal-sub-title">Government Scholarship Services</p>
            </div>
          </Link>

          <Link to="/" className="gov-auth-back-link flex items-center gap-1.5">
            <Home size={15} />
            <span>Back to Portal Home</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Authentication Content */}
      <main className="gov-auth-main-content">
        <div className="gov-container">
          <div className="gov-auth-layout-grid">
            {/* Left: Login Form Card */}
            <div className="gov-auth-card">
              <div className="gov-auth-card-header">
                <div className="gov-auth-badge">
                  <ShieldCheck size={16} />
                  <span>Secure Citizen & Officer Login</span>
                </div>
                <h2 className="gov-auth-title">Sign In to Your Account</h2>
                <p className="gov-auth-subtitle">
                  Access scholarship applications, track DBT disbursements, and manage profile records.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="gov-role-selector-tabs">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    className={`gov-role-tab-btn ${selectedRole === acc.role ? 'active' : ''}`}
                    onClick={() => handleSelectRole(acc)}
                  >
                    <span className="role-label">{acc.title}</span>
                    <span className="role-sub-pill">{acc.badge}</span>
                  </button>
                ))}
              </div>

              {/* 1-Click Fast Fill Notification */}
              <div className="gov-demo-fill-notice">
                <span className="notice-icon">⚡</span>
                <span className="notice-text">
                  Testing demo credentials loaded for: <strong>{demoAccounts.find(d => d.role === selectedRole)?.name}</strong>
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="gov-auth-form">
                <div className="gov-input-group">
                  <label className="gov-label" htmlFor="login-email">
                    Registered Email or Mobile No. <span className="req">*</span>
                  </label>
                  <div className="gov-input-container">
                    <User size={17} className="gov-field-icon" />
                    <input
                      id="login-email"
                      type="text"
                      className="gov-input-field"
                      placeholder="e.g. arjun.tribal@example.com or mobile"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="gov-input-group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="gov-label" htmlFor="login-pw">
                      Password <span className="req">*</span>
                    </label>
                    <a href="#reset-pin" className="gov-forgot-link">
                      Forgot Password / Reset PIN?
                    </a>
                  </div>
                  <div className="gov-input-container">
                    <Lock size={17} className="gov-field-icon" />
                    <input
                      id="login-pw"
                      type={showPw ? 'text' : 'password'}
                      className="gov-input-field pr-10"
                      placeholder="Enter your confidential password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="gov-pw-toggle"
                      onClick={() => setShowPw(!showPw)}
                      title={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="gov-options-row flex items-center justify-between">
                  <label className="gov-checkbox-label flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="gov-checkbox"
                    />
                    <span>Remember me on this authorized browser</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="gov-btn-submit-login"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="gov-auth-spinner" />
                      <span>Authenticating Credentials...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn size={18} />
                      <span>Sign In to Portal</span>
                    </span>
                  )}
                </button>
              </form>

              {/* OTR Registration Callout */}
              <div className="gov-auth-register-footer">
                <p className="register-prompt">
                  New student or looking to apply for 2025-26 schemes?
                </p>
                <Link to="/register" className="gov-btn-register-cta">
                  <span>Register for New Scholarship (One Time Registration)</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right: Official Portal Advisory & Guidelines Panel */}
            <div className="gov-auth-info-panel">
              {/* DigiLocker & DBT Notice Card */}
              <div className="gov-info-card card-accent">
                <div className="gov-info-header flex items-center gap-2.5">
                  <div className="gov-info-icon-badge">
                    <CheckCircle2 size={20} className="text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="gov-info-card-title">National Scholarship Directives</h4>
                    <p className="gov-info-card-sub">Key Guidelines for 2025-2026 Academic Year</p>
                  </div>
                </div>

                <ul className="gov-info-points-list">
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span>
                      <strong>One Time Registration (OTR):</strong> Single digital ID valid for multiple central and state schemes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span>
                      <strong>Aadhaar-Seeded Bank Account:</strong> Ensure your bank account is linked to NPCI mapper for DBT stipends.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span>
                      <strong>DigiLocker Verification:</strong> Caste, Income, and Academic marksheets can be auto-fetched instantly.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span>
                      <strong>Real-Time Tracking:</strong> Inspect every scrutiny step from Institute verification to DBT disbursement.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Need Help Helpline Card */}
              <div className="gov-info-card card-support">
                <div className="gov-info-header flex items-center gap-2.5">
                  <div className="gov-info-icon-badge badge-blue">
                    <HelpCircle size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <h4 className="gov-info-card-title">Citizen Helpdesk & Support</h4>
                    <p className="gov-info-card-sub">Assistance for login or technical issues</p>
                  </div>
                </div>

                <div className="gov-support-meta-list">
                  <div className="gov-support-meta-item flex items-center gap-2.5">
                    <Phone size={15} className="text-blue-700" />
                    <div>
                      <span className="text-xs text-gray-500">Toll Free Helpline:</span>
                      <p className="font-bold text-sm text-gray-900">1800-123-4567</p>
                    </div>
                  </div>

                  <div className="gov-support-meta-item flex items-center gap-2.5">
                    <Mail size={15} className="text-blue-700" />
                    <div>
                      <span className="text-xs text-gray-500">Technical Support Email:</span>
                      <p className="font-semibold text-xs text-blue-700">support@scholarship.gov.in</p>
                    </div>
                  </div>
                </div>

                <div className="gov-secure-badge-footer flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>256-bit SSL encrypted government payment & identity gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Official Copyright Footer */}
      <footer className="gov-auth-footer">
        <div className="gov-container text-center">
          <p className="gov-footer-copyright-text">
            © 2025 National Scholarship Assistance Portal. All Rights Reserved. | Owned by Department of Higher Education, Government of India.
          </p>
        </div>
      </footer>

      {/* Redirect Overlay */}
      {redirecting && (
        <div className="gov-redirect-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          flexDirection: 'column',
          gap: 16
        }}>
          <div className="gov-redirect-spinner" />
          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
            Redirecting to {redirectLabel}...
          </div>
        </div>
      )}
    </div>
  );
}
