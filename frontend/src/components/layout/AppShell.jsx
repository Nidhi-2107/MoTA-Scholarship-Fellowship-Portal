import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GovHeader from './GovHeader';
import GovFooter from './GovFooter';
import Chatbot from '../chatbot/Chatbot';
import {
  LayoutDashboard, BookOpen, FileText, User, AlertCircle,
  Shield, ClipboardList, ChevronRight
} from 'lucide-react';

export default function AppShell() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="gov-app-shell">
      {/* 1. Official Government Header */}
      <GovHeader />

      {/* 2. Sub-Navigation Ribbon (only on inner portal pages, not on home page) */}
      {!isHome && isAuthenticated && (
        <div className="gov-portal-ribbon">
          <div className="gov-container flex items-center justify-between py-2.5">
            {/* Breadcrumb path */}
            <div className="gov-breadcrumb flex items-center gap-1.5 text-xs text-gray-600">
              <NavLink to="/" className="hover:text-blue-700">Home</NavLink>
              <ChevronRight size={13} className="text-gray-400" />
              <span className="font-semibold text-blue-900 capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>

            {/* Quick Portal Switcher Pills */}
            <nav className="gov-subnav-links flex items-center gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/schemes"
                className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
              >
                <BookOpen size={14} />
                <span>Schemes</span>
              </NavLink>

              {hasRole('APPLICANT') && (
                <>
                  <NavLink
                    to="/applications"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <FileText size={14} />
                    <span>Applications</span>
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <User size={14} />
                    <span>One Profile</span>
                  </NavLink>
                  <NavLink
                    to="/grievances"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <AlertCircle size={14} />
                    <span>Grievances</span>
                  </NavLink>
                </>
              )}

              {hasRole('INSTITUTE_OFFICER', 'SCRUTINY_OFFICER', 'DISTRICT_OFFICER', 'STATE_OFFICER', 'MOTA_OFFICER', 'SELECTION_COMMITTEE') && (
                <>
                  <NavLink
                    to="/officer"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <ClipboardList size={14} />
                    <span>Scrutiny Queue</span>
                  </NavLink>
                  <NavLink
                    to="/officer/applications"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <FileText size={14} />
                    <span>All Applications</span>
                  </NavLink>
                </>
              )}

              {hasRole('ADMIN', 'SUPER_ADMIN') && (
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <Shield size={14} />
                    <span>Admin Telemetry</span>
                  </NavLink>
                  <NavLink
                    to="/officer/applications"
                    className={({ isActive }) => `gov-subnav-pill ${isActive ? 'active' : ''}`}
                  >
                    <FileText size={14} />
                    <span>Applications</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* 3. Main Outlet Container */}
      <main className={`gov-main-viewport ${isHome ? 'is-home' : ''}`}>
        <Outlet />
      </main>

      {/* 4. Official Government Footer */}
      <GovFooter />

      {/* 5. Floating MoTA AI Assistant */}
      <Chatbot />
    </div>
  );
}
