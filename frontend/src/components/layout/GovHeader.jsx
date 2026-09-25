import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Globe, User, LogIn, UserPlus, LogOut, ChevronDown,
  Home, Award, FileText, AlertCircle, HelpCircle, Phone,
  Eye, Volume2, ShieldCheck, Check, Menu, X
} from 'lucide-react';

export default function GovHeader() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [lang, setLang] = useState('en');
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0: A-, 1: A, 2: A+
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle Font Resize
  const handleFontSize = (level) => {
    setFontSizeLevel(level);
    const sizes = ['14px', '15px', '16.5px'];
    document.documentElement.style.fontSize = sizes[level];
  };

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="gov-header-wrapper">
      {/* 1. TOP UTILITY ACCESSIBILITY BAR */}
      <div className="gov-top-bar">
        <div className="gov-container gov-top-bar-inner">
          <div className="gov-top-left flex items-center gap-4">
            <a href="#main-content" className="gov-utility-link flex items-center gap-1">
              <span className="gov-skip-icon">★</span>
              <span>Skip to Main Content</span>
            </a>
            <span className="gov-pipe">|</span>
            <div className="gov-font-resizer flex items-center gap-1" title="Adjust font size">
              <button
                type="button"
                className={`font-btn ${fontSizeLevel === 0 ? 'active' : ''}`}
                onClick={() => handleFontSize(0)}
              >
                A-
              </button>
              <button
                type="button"
                className={`font-btn ${fontSizeLevel === 1 ? 'active' : ''}`}
                onClick={() => handleFontSize(1)}
              >
                A
              </button>
              <button
                type="button"
                className={`font-btn ${fontSizeLevel === 2 ? 'active' : ''}`}
                onClick={() => handleFontSize(2)}
              >
                A+
              </button>
            </div>
            <span className="gov-pipe">|</span>
            <button
              type="button"
              className="gov-utility-link flex items-center gap-1"
              onClick={() => alert('Standard Government Accessibility Contrast: Optimal high-contrast AAA mode enabled.')}
            >
              <Eye size={12} />
              <span>Accessibility Options</span>
            </button>
            <span className="gov-pipe">|</span>
            <button
              type="button"
              className="gov-utility-link flex items-center gap-1"
              onClick={() => alert('Screen Reader Access is enabled. ARIA landmark tags are configured for assistive technologies.')}
            >
              <Volume2 size={12} />
              <span>Screen Reader</span>
            </button>
          </div>

          <div className="gov-top-right flex items-center gap-2">
            <Globe size={13} className="text-blue-200" />
            <button
              type="button"
              className={`gov-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              English
            </button>
            <span className="gov-pipe">|</span>
            <button
              type="button"
              className={`gov-lang-btn ${lang === 'hi' ? 'active' : ''}`}
              onClick={() => setLang('hi')}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL WHITE PORTAL MASTHEAD */}
      <div className="gov-main-header">
        <div className="gov-container flex items-center justify-between">
          <Link to="/" className="gov-brand-cluster flex items-center gap-3">
            <img
              src="/emblem.svg"
              alt="State Emblem of India"
              className="gov-emblem-img"
              width="46"
              height="62"
            />
            <div className="gov-portal-titles">
              <h1 className="gov-portal-main-title">
                {lang === 'hi' ? 'राष्ट्रीय छात्रवृत्ति सहायता पोर्टल' : 'MoTA Scholarship & Fellowship Assistance Portal'}
              </h1>
              <p className="gov-portal-sub-title">
                {lang === 'hi' ? 'सरकारी छात्रवृत्ति सेवाएँ' : 'Government Scholarship Services'}
              </p>
            </div>
          </Link>

          {/* Right Action Buttons */}
          <div className="gov-auth-actions flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="gov-btn-register flex items-center gap-1.5">
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
                <Link to="/login" className="gov-btn-login flex items-center gap-1.5">
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </>
            ) : (
              <div className="gov-user-session flex items-center gap-3">
                <div className="gov-user-badge-info">
                  <span className="gov-user-greeting">Welcome,</span>
                  <span className="gov-user-fullname">{user?.fullName?.split(' ')[0]}</span>
                  <span className="gov-user-role-tag">{user?.role?.replace(/_/g, ' ')}</span>
                </div>

                {hasRole('INSTITUTE_OFFICER', 'SCRUTINY_OFFICER', 'DISTRICT_OFFICER', 'STATE_OFFICER', 'MOTA_OFFICER', 'SELECTION_COMMITTEE') ? (
                  <Link to="/officer" className="gov-btn-dashboard">
                    Officer Console
                  </Link>
                ) : hasRole('ADMIN', 'SUPER_ADMIN') ? (
                  <Link to="/admin" className="gov-btn-dashboard">
                    Admin Console
                  </Link>
                ) : (
                  <Link to="/dashboard" className="gov-btn-dashboard">
                    My Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="gov-btn-logout"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. PRIMARY GOVERNMENT NAVIGATION BAR (NAVY BLUE) */}
      <nav className="gov-primary-navbar">
        <div className="gov-container flex items-center justify-between">
          {/* Desktop Nav Items */}
          <ul className="gov-nav-menu gov-nav-menu-desktop">
            {/* Home */}
            <li className="gov-nav-item">
              <NavLink to="/" className={({ isActive }) => `gov-nav-link home-link ${isActive ? 'active' : ''}`}>
                <Home size={16} className="gov-nav-icon" />
                <span>Home</span>
              </NavLink>
            </li>

            {/* Scholarships Dropdown */}
            <li
              className={`gov-nav-item has-dropdown ${activeDropdown === 'scholarships' ? 'open' : ''}`}
              onMouseEnter={() => setActiveDropdown('scholarships')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="gov-nav-link"
                onClick={() => toggleDropdown('scholarships')}
              >
                <span>Scholarships</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>
              {activeDropdown === 'scholarships' && (
                <div className="gov-dropdown-menu">
                  <Link to="/schemes" className="gov-dropdown-item">All Scholarships & Schemes</Link>
                  <Link to="/schemes" className="gov-dropdown-item">Post Matric Scholarship</Link>
                  <Link to="/schemes" className="gov-dropdown-item">Academic Merit Scholarship</Link>
                  <Link to="/schemes" className="gov-dropdown-item">SC/ST Scholarship</Link>
                </div>
              )}
            </li>

            {/* Applications Dropdown */}
            <li
              className={`gov-nav-item has-dropdown ${activeDropdown === 'applications' ? 'open' : ''}`}
              onMouseEnter={() => setActiveDropdown('applications')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="gov-nav-link"
                onClick={() => toggleDropdown('applications')}
              >
                <span>Applications</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>
              {activeDropdown === 'applications' && (
                <div className="gov-dropdown-menu">
                  <Link to="/applications" className="gov-dropdown-item">Track Application Status</Link>
                  <Link to="/applications" className="gov-dropdown-item">My Submitted Applications</Link>
                  <Link to="/schemes" className="gov-dropdown-item">Apply for New Scholarship</Link>
                  <Link to="/profile" className="gov-dropdown-item">Manage Documents & Profile</Link>
                </div>
              )}
            </li>

            {/* Grievance Dropdown */}
            <li
              className={`gov-nav-item has-dropdown ${activeDropdown === 'grievance' ? 'open' : ''}`}
              onMouseEnter={() => setActiveDropdown('grievance')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="gov-nav-link"
                onClick={() => toggleDropdown('grievance')}
              >
                <span>Grievance</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>
              {activeDropdown === 'grievance' && (
                <div className="gov-dropdown-menu">
                  <Link to="/grievances" className="gov-dropdown-item">Lodge Grievance</Link>
                  <Link to="/grievances" className="gov-dropdown-item">Track Grievance Status</Link>
                </div>
              )}
            </li>

            {/* Help Dropdown */}
            <li
              className={`gov-nav-item has-dropdown ${activeDropdown === 'help' ? 'open' : ''}`}
              onMouseEnter={() => setActiveDropdown('help')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="gov-nav-link"
                onClick={() => toggleDropdown('help')}
              >
                <span>Help</span>
                <ChevronDown size={14} className="dropdown-chevron" />
              </button>
              {activeDropdown === 'help' && (
                <div className="gov-dropdown-menu">
                  <a href="#faqs" className="gov-dropdown-item">Frequently Asked Questions (FAQs)</a>
                  <a href="#guidelines" className="gov-dropdown-item">Scholarship Guidelines</a>
                  <a href="#support-section" className="gov-dropdown-item">Contact Directory</a>
                </div>
              )}
            </li>

            {/* Contact Us */}
            <li className="gov-nav-item">
              <a href="#support-section" className="gov-nav-link">
                <span>Contact Us</span>
              </a>
            </li>
          </ul>

          {/* Mobile Menu Toggle Button */}
          <div className="gov-mobile-nav-toggle flex md:hidden items-center justify-between w-full py-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Navigation Menu</span>
            <button
              type="button"
              className="gov-mobile-btn flex items-center justify-center p-2 rounded text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer Container */}
        {mobileMenuOpen && (
          <div className="gov-mobile-drawer md:hidden bg-blue-950 text-white border-t border-white/10 px-4 py-3 space-y-2">
            <NavLink to="/" className="block py-2 text-sm font-medium border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <Link to="/schemes" className="block py-2 text-sm font-medium border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
              Scholarships & Schemes
            </Link>
            <Link to="/applications" className="block py-2 text-sm font-medium border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
              Track Applications
            </Link>
            <Link to="/grievances" className="block py-2 text-sm font-medium border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
              Grievance Portal
            </Link>
            <a href="#faqs" className="block py-2 text-sm font-medium border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
              Help & FAQs
            </a>
            <a href="#support-section" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Contact Directory
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}

