import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SchemesPage from './pages/schemes/SchemesPage';
import SchemeDetailPage from './pages/schemes/SchemeDetailPage';
import ApplyPage from './pages/apply/ApplyPage';
import MyApplicationsPage from './pages/applications/MyApplicationsPage';
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage';
import ProfilePage from './pages/profile/ProfilePage';
import GrievancesPage from './pages/grievances/GrievancesPage';
import OfficerDashboardPage from './pages/officer/OfficerDashboardPage';
import OfficerApplicationsPage from './pages/officer/OfficerApplicationsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000, refetchOnWindowFocus: false },
  },
});

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

import HomePage from './pages/home/HomePage';

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Main Gov Portal Layout */}
      <Route element={<AppShell />}>
        {/* Public Home & Schemes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailPage />} />

        {/* Protected - Applicant */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/apply/:schemeId" element={<ProtectedRoute roles={['APPLICANT']}><ApplyPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
        <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/grievances" element={<ProtectedRoute><GrievancesPage /></ProtectedRoute>} />

        {/* Officer routes */}
        <Route path="/officer" element={<ProtectedRoute roles={['INSTITUTE_OFFICER', 'SCRUTINY_OFFICER']}><OfficerDashboardPage /></ProtectedRoute>} />
        <Route path="/officer/applications" element={<ProtectedRoute roles={['INSTITUTE_OFFICER', 'SCRUTINY_OFFICER']}><OfficerApplicationsPage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
              error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
