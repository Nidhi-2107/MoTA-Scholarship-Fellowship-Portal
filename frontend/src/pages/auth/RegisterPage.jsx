import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight,
  ArrowLeft, CheckCircle2, Award, Home, HelpCircle, FileText
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(1); // 1: Personal & Login, 2: Domicile & Category Details

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    stCasteName: 'Santhal',
    socialCategory: 'ST',
    isPvtg: false,
    hasDisability: false,
    stateName: 'Odisha',
    districtName: 'Mayurbhanj',
    annualIncome: '180000',
    aadhaarConsent: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      toast.error('Please fill in all mandatory account fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.aadhaarConsent) {
      toast.error('Consent for Aadhaar/DBT validation is required for government scholarship disbursement');
      return;
    }

     setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        username: formData.email.split('@')[0],
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
      };

      const res = await authApi.register(payload);
      if (res.data?.success) {
        toast.success('Registration successful! Please log in with your credentials.');
        navigate('/login');
      } else {
        toast.error(res.data?.message || 'Registration failed. Please check inputs.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check inputs and try again.');
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
            {/* Left: Registration Wizard */}
            <div className="gov-auth-card">
              <div className="gov-auth-card-header">
                <div className="gov-auth-badge">
                  <ShieldCheck size={16} />
                  <span>One Time Registration (OTR) Portal</span>
                </div>
                <h2 className="gov-auth-title">Citizen Student Registration</h2>
                <p className="gov-auth-subtitle">
                  Create your unified student digital profile to apply for all Central and State government scholarships.
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="gov-reg-stepper-bar flex items-center justify-between mb-5">
                <div className={`gov-reg-step ${step >= 1 ? 'active' : ''}`}>
                  <span className="step-num">1</span>
                  <span className="step-text">Personal & Credentials</span>
                </div>
                <div className="step-divider" />
                <div className={`gov-reg-step ${step >= 2 ? 'active' : ''}`}>
                  <span className="step-num">2</span>
                  <span className="step-text">Category & Domicile</span>
                </div>
              </div>

              {step === 1 ? (
                /* Step 1: Personal & Credentials */
                <form onSubmit={handleNext} className="gov-auth-form">
                  <div className="gov-input-group">
                    <label className="gov-label" htmlFor="reg-name">
                      Full Legal Name (as per Aadhaar / 10th Certificate) <span className="req">*</span>
                    </label>
                    <div className="gov-input-container">
                      <User size={17} className="gov-field-icon" />
                      <input
                        id="reg-name"
                        type="text"
                        name="fullName"
                        className="gov-input-field"
                        placeholder="e.g. Priya Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="gov-two-col-inputs">
                    <div className="gov-input-group">
                      <label className="gov-label" htmlFor="reg-email">
                        Email Address <span className="req">*</span>
                      </label>
                      <div className="gov-input-container">
                        <Mail size={17} className="gov-field-icon" />
                        <input
                          id="reg-email"
                          type="email"
                          name="email"
                          className="gov-input-field"
                          placeholder="student@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="gov-input-group">
                      <label className="gov-label" htmlFor="reg-phone">
                        Aadhaar Linked Mobile No. <span className="req">*</span>
                      </label>
                      <div className="gov-input-container">
                        <Phone size={17} className="gov-field-icon" />
                        <input
                          id="reg-phone"
                          type="tel"
                          name="phone"
                          className="gov-input-field"
                          placeholder="e.g. 9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="gov-two-col-inputs">
                    <div className="gov-input-group">
                      <label className="gov-label" htmlFor="reg-pw">
                        Create Password <span className="req">*</span>
                      </label>
                      <div className="gov-input-container">
                        <Lock size={17} className="gov-field-icon" />
                        <input
                          id="reg-pw"
                          type={showPw ? 'text' : 'password'}
                          name="password"
                          className="gov-input-field pr-10"
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="gov-pw-toggle"
                          onClick={() => setShowPw(!showPw)}
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="gov-input-group">
                      <label className="gov-label" htmlFor="reg-cpw">
                        Confirm Password <span className="req">*</span>
                      </label>
                      <div className="gov-input-container">
                        <Lock size={17} className="gov-field-icon" />
                        <input
                          id="reg-cpw"
                          type={showPw ? 'text' : 'password'}
                          name="confirmPassword"
                          className="gov-input-field"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="gov-btn-submit-login">
                    <span className="flex items-center justify-center gap-2">
                      <span>Proceed to Step 2 (Category & Domicile)</span>
                      <ArrowRight size={17} />
                    </span>
                  </button>
                </form>
              ) : (
                /* Step 2: Category & Domicile */
                <form onSubmit={handleRegister} className="gov-auth-form">
                  <div className="gov-two-col-inputs">
                    <div className="gov-input-group">
                      <label className="gov-label">
                        Social Category <span className="req">*</span>
                      </label>
                      <select
                        name="socialCategory"
                        value={formData.socialCategory}
                        onChange={handleChange}
                        className="gov-select-field"
                      >
                        <option value="ST">Scheduled Tribe (ST)</option>
                        <option value="SC">Scheduled Caste (SC)</option>
                        <option value="OBC">Other Backward Classes (OBC)</option>
                        <option value="EWS">Economically Weaker Section (EWS)</option>
                        <option value="GENERAL">General</option>
                      </select>
                    </div>

                    <div className="gov-input-group">
                      <label className="gov-label">
                        Community / Tribe Name
                      </label>
                      <input
                        type="text"
                        name="stCasteName"
                        className="gov-input-field"
                        placeholder="e.g. Santhal, Munda, Gond, Bhil"
                        value={formData.stCasteName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="gov-two-col-inputs">
                    <div className="gov-input-group">
                      <label className="gov-label">
                        Domicile State <span className="req">*</span>
                      </label>
                      <select
                        name="stateName"
                        value={formData.stateName}
                        onChange={handleChange}
                        className="gov-select-field"
                      >
                        <option value="Odisha">Odisha</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Assam">Assam</option>
                        <option value="Other">Other State / UT</option>
                      </select>
                    </div>

                    <div className="gov-input-group">
                      <label className="gov-label">
                        Annual Family Income (₹) <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        name="annualIncome"
                        className="gov-input-field"
                        placeholder="e.g. 180000"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Special Vulnerability Checkboxes */}
                  <div className="gov-checkbox-group-box">
                    <label className="gov-checkbox-label flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="isPvtg"
                        checked={formData.isPvtg}
                        onChange={handleChange}
                        className="gov-checkbox"
                      />
                      <span>Belongs to Particularly Vulnerable Tribal Group (PVTG)</span>
                    </label>

                    <label className="gov-checkbox-label flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        name="hasDisability"
                        checked={formData.hasDisability}
                        onChange={handleChange}
                        className="gov-checkbox"
                      />
                      <span>Person with Benchmark Disability (PwD &ge; 40%)</span>
                    </label>

                    <label className="gov-checkbox-label flex items-center gap-2 text-xs text-blue-900 bg-blue-50 p-2.5 rounded border border-blue-200">
                      <input
                        type="checkbox"
                        name="aadhaarConsent"
                        checked={formData.aadhaarConsent}
                        onChange={handleChange}
                        className="gov-checkbox"
                        required
                      />
                      <span>
                        I hereby provide consent to use my Aadhaar details for DBT stipend authentication via NPCI mapper.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="gov-btn-back-step flex items-center gap-1.5"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="gov-btn-submit-login flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Creating OTR Account...' : 'Complete One Time Registration'}
                    </button>
                  </div>
                </form>
              )}

              {/* Back to Login Link */}
              <div className="gov-auth-register-footer">
                <p className="register-prompt">
                  Already registered on the National Scholarship Portal?
                </p>
                <Link to="/login" className="gov-btn-register-cta">
                  <span>Sign In to Existing Account</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right: OTR Benefits & Advisory */}
            <div className="gov-auth-info-panel">
              <div className="gov-info-card card-accent">
                <div className="gov-info-header flex items-center gap-2.5">
                  <div className="gov-info-icon-badge">
                    <Award size={20} className="text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="gov-info-card-title">Why One Time Registration (OTR)?</h4>
                    <p className="gov-info-card-sub">Simplified, Paperless Citizen Access</p>
                  </div>
                </div>

                <ul className="gov-info-points-list">
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span><strong>Lifelong Student ID:</strong> Use your OTR registration number across school, undergraduate, and post-graduate studies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span><strong>Automated Verification:</strong> Verified DigiLocker records mean zero physical document submissions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span><strong>Direct Benefit Transfer:</strong> Scholarships credited directly into Aadhaar-seeded accounts via PFMS.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="point-bullet">✓</span>
                    <span><strong>SMS & Email Alerts:</strong> Receive tracking updates at every scrutiny milestone.</span>
                  </li>
                </ul>
              </div>

              <div className="gov-info-card card-support">
                <div className="gov-info-header flex items-center gap-2.5">
                  <div className="gov-info-icon-badge badge-blue">
                    <HelpCircle size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <h4 className="gov-info-card-title">Registration Support Desk</h4>
                    <p className="gov-info-card-sub">Assistance for OTP or verification issues</p>
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
                      <span className="text-xs text-gray-500">Official Email:</span>
                      <p className="font-semibold text-xs text-blue-700">support@scholarship.gov.in</p>
                    </div>
                  </div>
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
    </div>
  );
}
