import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { useAuth } from './context/AuthContext';

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Leads = lazy(() => import('./pages/leads/Leads'));
const Templates = lazy(() => import('./pages/templates/Templates'));
const TemplateEditor = lazy(() => import('./pages/templates/TemplateEditor'));
const Campaigns = lazy(() => import('./pages/campaigns/Campaigns'));
const CampaignDetail = lazy(() => import('./pages/campaigns/CampaignDetail'));
const Analytics = lazy(() => import('./pages/analytics/Analytics'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard\" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard\" replace /> : <Register />}
        />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard\" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/new" element={<TemplateEditor />} />
          <Route path="templates/edit/:id" element={<TemplateEditor />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;