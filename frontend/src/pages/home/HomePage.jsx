import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, GraduationCap, FileText, CheckCircle2, ChevronRight,
  Megaphone, ClipboardList, Link2, Star, Phone, Mail, Clock,
  Calendar, Award, BookOpen, AlertCircle, HelpCircle, Folder,
  Check, ArrowRight, UserCheck, Users, Info
} from 'lucide-react';
import { schemeApi, applicationApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const res = await schemeApi.getAll().catch(() => ({ data: { data: [] } }));
      setSchemes(res.data?.data || []);

      if (isAuthenticated) {
        const appsRes = await applicationApi.getMy().catch(() => ({ data: { data: [] } }));
        setUserApplications(appsRes.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/schemes');
    }
  };

  // Popular scholarships accurately matching the reference image
  const popularCards = [
    {
      id: schemes[0]?.id || '1',
      title: 'Post Matric Scholarship (General)',
      desc: 'For students pursuing higher education after 10th/12th.',
      eligibility: '12th Passed | Family Income: < ₹2.5 Lakh',
      lastDate: '30 Apr 2025',
      accentColor: '#ea580c', // Orange
      icon: GraduationCap,
    },
    {
      id: schemes[1]?.id || '2',
      title: 'Academic Merit Scholarship',
      desc: 'For meritorious students in undergraduate programs.',
      eligibility: '12th / UG | Min. Percentage: 80%',
      lastDate: '15 May 2025',
      accentColor: '#2563eb', // Blue
      icon: Award,
    },
    {
      id: schemes[2]?.id || '3',
      title: 'SC/ST Scholarship',
      desc: 'For SC/ST students pursuing higher education.',
      eligibility: 'SC/ST Category | Family Income: < ₹2.5 Lakh',
      lastDate: '31 May 2025',
      accentColor: '#059669', // Teal / Green
      icon: Users,
    },
    {
      id: schemes[3]?.id || '4',
      title: 'National Fellowship for ST',
      desc: 'For ST candidates pursuing M.Phil / Ph.D research programs.',
      eligibility: 'M.Phil / Ph.D | UGC-NET or Selection Committee Merit',
      lastDate: '31 Jul 2025',
      accentColor: '#7c3aed', // Violet
      icon: Award,
    },
  ];

  return (
    <div className="gov-home-container" id="main-content">
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="gov-hero-section">
        <div className="gov-container">
          <div className="gov-hero-grid">
            {/* Left Content */}
            <div className="gov-hero-left">
              <h2 className="gov-hero-heading">
                Find, apply and track scholarships in one place
              </h2>
              <p className="gov-hero-subtitle">
                Empowering students with access to education and a brighter future.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="gov-hero-search-form">
                <div className="gov-search-input-box">
                  <Search size={18} className="gov-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search scholarships, schemes and services..."
                    className="gov-search-input"
                  />
                  <button type="submit" className="gov-btn-search">
                    Search
                  </button>
                </div>
              </form>

              {/* 3 Prominent Action Pills */}
              <div className="gov-hero-action-pills">
                <Link to="/schemes" className="gov-pill-btn pill-blue">
                  <GraduationCap size={18} />
                  <span>Find Scholarships</span>
                </Link>
                <Link to="/applications" className="gov-pill-btn pill-green">
                  <FileText size={18} />
                  <span>Track Application</span>
                </Link>
                <Link to="/schemes" className="gov-pill-btn pill-orange">
                  <CheckCircle2 size={18} />
                  <span>Check Eligibility</span>
                </Link>
              </div>
            </div>

            {/* Right Banner: Photo + Overlay Card */}
            <div className="gov-hero-right">
              <div className="gov-hero-banner-frame">
                <img
                  src="/hero-students.jpg"
                  alt="Students on campus"
                  className="gov-hero-students-img"
                />
                <div className="gov-hero-dark-overlay">
                  <h3 className="gov-motto-title">Education builds a stronger India</h3>
                  <div className="gov-motto-divider" />
                  <p className="gov-motto-desc">
                    Together towards an inclusive and educated future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. QUICK ACTIONS (5 TILES) ==================== */}
      <section className="gov-quick-actions-section">
        <div className="gov-container">
          <div className="gov-quick-grid">
            {/* Tile 1: Scholarships */}
            <Link to="/schemes" className="gov-quick-card">
              <div className="gov-quick-icon-circle circle-purple">
                <GraduationCap size={22} />
              </div>
              <div className="gov-quick-card-content">
                <h4 className="gov-quick-card-title">Scholarships</h4>
                <p className="gov-quick-card-desc">Explore available scholarships and schemes.</p>
              </div>
              <ChevronRight size={18} className="gov-quick-arrow" />
            </Link>

            {/* Tile 2: My Applications */}
            <Link to="/applications" className="gov-quick-card">
              <div className="gov-quick-icon-circle circle-green">
                <FileText size={22} />
              </div>
              <div className="gov-quick-card-content">
                <h4 className="gov-quick-card-title">My Applications</h4>
                <p className="gov-quick-card-desc">View and manage your applications.</p>
              </div>
              <ChevronRight size={18} className="gov-quick-arrow" />
            </Link>

            {/* Tile 3: Documents */}
            <Link to="/profile" className="gov-quick-card">
              <div className="gov-quick-icon-circle circle-blue">
                <Folder size={22} />
              </div>
              <div className="gov-quick-card-content">
                <h4 className="gov-quick-card-title">Documents</h4>
                <p className="gov-quick-card-desc">Upload and manage required documents.</p>
              </div>
              <ChevronRight size={18} className="gov-quick-arrow" />
            </Link>

            {/* Tile 4: Grievances */}
            <Link to="/grievances" className="gov-quick-card">
              <div className="gov-quick-icon-circle circle-coral">
                <Megaphone size={22} />
              </div>
              <div className="gov-quick-card-content">
                <h4 className="gov-quick-card-title">Grievances</h4>
                <p className="gov-quick-card-desc">Raise and track your grievance requests.</p>
              </div>
              <ChevronRight size={18} className="gov-quick-arrow" />
            </Link>

            {/* Tile 5: Help & FAQs */}
            <a href="#faqs" className="gov-quick-card">
              <div className="gov-quick-icon-circle circle-violet">
                <HelpCircle size={22} />
              </div>
              <div className="gov-quick-card-content">
                <h4 className="gov-quick-card-title">Help & FAQs</h4>
                <p className="gov-quick-card-desc">Find answers to common questions.</p>
              </div>
              <ChevronRight size={18} className="gov-quick-arrow" />
            </a>
          </div>
        </div>
      </section>

      {/* ==================== 3. THREE-COLUMN DASHBOARD ==================== */}
      <section className="gov-dashboard-section">
        <div className="gov-container">
          <div className="gov-three-col-grid">
            {/* Column 1: Latest Announcements */}
            <div className="gov-panel-box">
              <div className="gov-panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone size={18} className="text-blue-700" />
                  <h3 className="gov-panel-title">Latest Announcements</h3>
                </div>
                <Link to="/schemes" className="gov-panel-link">View All</Link>
              </div>

              <div className="gov-announcements-list">
                <div className="gov-announcement-item">
                  <span className="gov-announcement-date">10 Apr 2025</span>
                  <span className="gov-announcement-sep">|</span>
                  <p className="gov-announcement-text">
                    Applications for Post Matric Scholarship 2025 are now open.
                  </p>
                </div>

                <div className="gov-announcement-item">
                  <span className="gov-announcement-date">05 Apr 2025</span>
                  <span className="gov-announcement-sep">|</span>
                  <p className="gov-announcement-text">
                    Document verification process has been updated.
                  </p>
                </div>

                <div className="gov-announcement-item">
                  <span className="gov-announcement-date">28 Mar 2025</span>
                  <span className="gov-announcement-sep">|</span>
                  <p className="gov-announcement-text">
                    New scholarship scheme for SC/ST students launched.
                  </p>
                </div>

                <div className="gov-announcement-item">
                  <span className="gov-announcement-date">15 Mar 2025</span>
                  <span className="gov-announcement-sep">|</span>
                  <p className="gov-announcement-text">
                    Portal maintenance scheduled on 20th March 2025 (10 AM - 2 PM).
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Application Status Tracker */}
            <div className="gov-panel-box">
              <div className="gov-panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-700" />
                  <h3 className="gov-panel-title">Application Status Tracker</h3>
                </div>
                <Link to="/applications" className="gov-panel-link">View All</Link>
              </div>

              <div className="gov-tracker-content">
                {/* 4-Step Stepper */}
                <div className="gov-stepper-wrapper">
                  <div className="gov-step-item completed">
                    <div className="gov-step-bubble bubble-success">
                      <Check size={14} />
                    </div>
                    <span className="gov-step-label">Submitted</span>
                    <span className="gov-step-sub">05 Apr 2025</span>
                  </div>

                  <div className="gov-step-line completed" />

                  <div className="gov-step-item active">
                    <div className="gov-step-bubble bubble-active">
                      <div className="gov-step-active-dot" />
                    </div>
                    <span className="gov-step-label">Under Review</span>
                    <span className="gov-step-sub">08 Apr 2025</span>
                  </div>

                  <div className="gov-step-line" />

                  <div className="gov-step-item">
                    <div className="gov-step-bubble">3</div>
                    <span className="gov-step-label">Eligible</span>
                  </div>

                  <div className="gov-step-line" />

                  <div className="gov-step-item">
                    <div className="gov-step-bubble">4</div>
                    <span className="gov-step-label">Disbursed</span>
                  </div>
                </div>

                {/* Status Notice Banner */}
                <div className="gov-status-notice-box">
                  <Info size={17} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="gov-status-notice-text">
                    Your application is currently under review. You will be notified once the status is updated.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Important Links */}
            <div className="gov-panel-box">
              <div className="gov-panel-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 size={18} className="text-blue-700" />
                  <h3 className="gov-panel-title">Important Links</h3>
                </div>
              </div>

              <div className="gov-links-menu">
                <a href="https://www.education.gov.in" target="_blank" rel="noreferrer" className="gov-link-row">
                  <span className="gov-chevron-bullet">›</span>
                  <span className="gov-link-title">Ministry of Education (Official Website)</span>
                  <ChevronRight size={14} className="gov-row-arrow" />
                </a>

                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="gov-link-row">
                  <span className="gov-chevron-bullet">›</span>
                  <span className="gov-link-title">National Portal for Higher Education</span>
                  <ChevronRight size={14} className="gov-row-arrow" />
                </a>

                <Link to="/schemes" className="gov-link-row">
                  <span className="gov-chevron-bullet">›</span>
                  <span className="gov-link-title">Scholarship Guidelines</span>
                  <ChevronRight size={14} className="gov-row-arrow" />
                </Link>

                <a href="#faqs" className="gov-link-row">
                  <span className="gov-chevron-bullet">›</span>
                  <span className="gov-link-title">Frequently Asked Questions</span>
                  <ChevronRight size={14} className="gov-row-arrow" />
                </a>

                <a href="#support-section" className="gov-link-row">
                  <span className="gov-chevron-bullet">›</span>
                  <span className="gov-link-title">Contact Directory</span>
                  <ChevronRight size={14} className="gov-row-arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. POPULAR SCHOLARSHIPS & NEED HELP ==================== */}
      <section className="gov-popular-section" id="schemes-section">
        <div className="gov-container">
          <div className="gov-popular-header flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-blue-700 fill-blue-700" />
              <h3 className="gov-section-title">Popular Scholarships</h3>
            </div>
            <Link to="/schemes" className="gov-panel-link">View All</Link>
          </div>

          <div className="gov-popular-grid">
            {/* 4 Cards (2x2 Grid) */}
            <div className="gov-cards-quad">
              {popularCards.map((sc, idx) => {
                const IconComponent = sc.icon;
                return (
                  <div
                    key={sc.title}
                    className="gov-scholarship-card"
                    style={{ borderTop: `4px solid ${sc.accentColor}` }}
                  >
                    <div className="gov-card-top flex items-center gap-2">
                      <div className="gov-card-icon-wrap" style={{ color: sc.accentColor }}>
                        <IconComponent size={20} />
                      </div>
                      <h4 className="gov-card-title">{sc.title}</h4>
                    </div>

                    <p className="gov-card-desc">{sc.desc}</p>

                    <div className="gov-card-eligibility">
                      <strong>Eligibility:</strong> {sc.eligibility}
                    </div>

                    <div className="gov-card-footer flex items-center justify-between">
                      <div className="gov-card-date flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={13} />
                        <span>Last Date: <strong>{sc.lastDate}</strong></span>
                      </div>
                      <Link
                        to={schemes[idx] ? `/schemes/${schemes[idx].id}` : '/schemes'}
                        className="gov-btn-card-action"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Need Help? Box */}
            <div className="gov-support-card" id="support-section">
              <div className="gov-support-header flex items-start gap-2.5">
                <div className="gov-support-icon-wrap">
                  <UserCheck size={22} className="text-blue-700" />
                </div>
                <div>
                  <h4 className="gov-support-title">Need Help? We are here for you!</h4>
                  <p className="gov-support-sub">
                    Contact our support team for any assistance related to scholarships, applications or technical issues.
                  </p>
                </div>
              </div>

              <div className="gov-support-lines">
                <div className="gov-support-line flex items-center gap-2.5">
                  <Phone size={16} className="text-blue-700 flex-shrink-0" />
                  <div>
                    <span className="support-label">Toll Free: </span>
                    <strong className="support-val">1800-123-4567</strong>
                  </div>
                </div>

                <div className="gov-support-line flex items-center gap-2.5">
                  <Mail size={16} className="text-blue-700 flex-shrink-0" />
                  <div>
                    <span className="support-label">Email: </span>
                    <span className="support-val text-blue-700 font-medium">support@scholarship.gov.in</span>
                  </div>
                </div>

                <div className="gov-support-line flex items-center gap-2.5">
                  <Clock size={16} className="text-blue-700 flex-shrink-0" />
                  <div>
                    <span className="support-label">Working Hours: </span>
                    <span className="support-val">9:00 AM – 6:00 PM (Mon – Fri)</span>
                  </div>
                </div>
              </div>

              <a
                href="mailto:support@scholarship.gov.in?subject=Scholarship%20Assistance%20Query"
                className="gov-btn-contact-us flex items-center justify-center gap-2"
              >
                <span>Contact Us</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. FAQS SECTION ==================== */}
      <section className="gov-faqs-section" id="faqs">
        <div className="gov-container">
          <div className="gov-panel-header mb-3">
            <h3 className="gov-section-title">Frequently Asked Questions (FAQs)</h3>
            <p className="text-xs text-gray-500">Quick answers to common queries regarding government scholarship schemes</p>
          </div>

          <div className="gov-faqs-grid">
            <div className="gov-faq-box">
              <h5 className="gov-faq-q">Q1. What is One Time Registration (OTR) in the portal?</h5>
              <p className="gov-faq-a">
                OTR is an Aadhaar-linked persistent student profile. Once verified, students do not need to re-upload certificates for subsequent scholarship applications.
              </p>
            </div>

            <div className="gov-faq-box">
              <h5 className="gov-faq-q">Q2. How is my bank account verified for Direct Benefit Transfer (DBT)?</h5>
              <p className="gov-faq-a">
                The portal checks your Aadhaar-seeded bank account status with the NPCI Mapper to ensure uninterrupted electronic stipend disbursement.
              </p>
            </div>

            <div className="gov-faq-box">
              <h5 className="gov-faq-q">Q3. What should I do if an officer marks a Document Deficiency?</h5>
              <p className="gov-faq-a">
                You will receive a notification with specific remarks. Simply login, navigate to "My Applications", and upload the rectified document scan.
              </p>
            </div>

            <div className="gov-faq-box">
              <h5 className="gov-faq-q">Q4. How do I track the current progress of my submitted application?</h5>
              <p className="gov-faq-a">
                Use the "Track Application" button or visit the "My Applications" dashboard tab to see real-time verification stages from scrutiny to DBT disbursement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
