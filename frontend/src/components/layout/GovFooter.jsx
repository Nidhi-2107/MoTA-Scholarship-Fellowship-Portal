import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, ShieldCheck, ExternalLink, Globe } from 'lucide-react';

export default function GovFooter() {
  return (
    <footer className="gov-footer-wrapper">
      {/* Decorative Tricolor Top Accent Line */}
      <div className="gov-footer-tricolor-bar">
        <div className="bar-orange" />
        <div className="bar-white" />
        <div className="bar-green" />
      </div>

      <div className="gov-footer-main">
        <div className="gov-container">
          <div className="gov-footer-grid">
            {/* Column 1: About Portal & Emblem */}
            <div className="gov-footer-col">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/emblem.svg"
                  alt="State Emblem of India"
                  className="gov-footer-emblem"
                  width="36"
                  height="48"
                />
                <div>
                  <h4 className="gov-footer-brand-title">National Scholarship</h4>
                  <p className="gov-footer-brand-sub">Assistance Portal</p>
                </div>
              </div>
              <p className="gov-footer-about-text">
                Direct Benefit Transfer (DBT) powered single-window platform ensuring transparent, equitable, and timely scholarship disbursement to students nationwide.
              </p>
              <div className="gov-footer-gov-badge flex items-center gap-2 mt-3">
                <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">MoTA & MeitY Compliant Portal</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="gov-footer-col">
              <h4 className="gov-footer-col-title">Quick Navigation</h4>
              <ul className="gov-footer-links-list">
                <li><Link to="/schemes" className="gov-footer-link">All Schemes & Scholarships</Link></li>
                <li><Link to="/applications" className="gov-footer-link">Track Application Status</Link></li>
                <li><Link to="/profile" className="gov-footer-link">Student One Profile (OTR)</Link></li>
                <li><Link to="/grievances" className="gov-footer-link">Lodge Grievance / Appeal</Link></li>
                <li><a href="#faqs" className="gov-footer-link">Frequently Asked Questions</a></li>
              </ul>
            </div>

            {/* Column 3: Citizen Helpline & Support */}
            <div className="gov-footer-col">
              <h4 className="gov-footer-col-title">Help & Support</h4>
              <div className="gov-footer-contact-items">
                <div className="gov-footer-contact-item flex items-start gap-2.5">
                  <Phone size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Toll Free Support</span>
                    <strong className="text-sm text-white">1800-123-4567</strong>
                  </div>
                </div>

                <div className="gov-footer-contact-item flex items-start gap-2.5">
                  <Mail size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Email Assistance</span>
                    <span className="text-xs text-blue-300 font-medium">helpdesk-scholarship@gov.in</span>
                  </div>
                </div>

                <div className="gov-footer-contact-item flex items-start gap-2.5">
                  <Clock size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Helpdesk Hours</span>
                    <span className="text-xs text-gray-300">09:00 AM to 06:00 PM (Mon - Sat)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Official Portals & Policy Links */}
            <div className="gov-footer-col">
              <h4 className="gov-footer-col-title">Government Portals</h4>
              <ul className="gov-footer-links-list">
                <li>
                  <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="gov-footer-external-link">
                    <span>National Portal of India</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="gov-footer-external-link">
                    <span>National Scholarship Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer" className="gov-footer-external-link">
                    <span>Digital India Initiative</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://tribal.gov.in" target="_blank" rel="noreferrer" className="gov-footer-external-link">
                    <span>Ministry of Tribal Affairs</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-footer Legal Links Bar */}
          <div className="gov-footer-legal-bar">
            <div className="gov-footer-policy-links flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
              <a href="#privacy" className="gov-legal-link">Privacy Policy</a>
              <span className="gov-footer-dot">•</span>
              <a href="#terms" className="gov-legal-link">Terms & Conditions</a>
              <span className="gov-footer-dot">•</span>
              <a href="#copyright-policy" className="gov-legal-link">Copyright Policy</a>
              <span className="gov-footer-dot">•</span>
              <a href="#hyperlink-policy" className="gov-legal-link">Hyperlinking Policy</a>
              <span className="gov-footer-dot">•</span>
              <a href="#accessibility" className="gov-legal-link">Accessibility Statement</a>
              <span className="gov-footer-dot">•</span>
              <a href="#disclaimer" className="gov-legal-link">Disclaimer</a>
              <span className="gov-footer-dot">•</span>
              <a href="#sitemap" className="gov-legal-link">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Technical Strip */}
      <div className="gov-footer-bottom">
        <div className="gov-container flex items-center justify-between flex-wrap gap-3">
          <p className="gov-footer-copyright-text">
            © 2025 National Scholarship Assistance Portal (Parakh 2.0). All Rights Reserved.
            <span className="block sm:inline sm:ml-2 text-gray-400">
              Designed & Developed for Department of Higher Education & Ministry of Tribal Affairs, Govt. of India.
            </span>
          </p>

          <div className="gov-footer-meta-stamps flex items-center gap-4 text-xs text-gray-400">
            <span>Last Updated: <strong>25 Sep 2025</strong></span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Visitors: <strong>1,482,920</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

