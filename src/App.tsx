import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import { initGA, logPageView } from './lib/analytics';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import AdBanner from './components/AdBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Brief from './pages/Brief';
import BriefResult from './pages/BriefResult';
import PathDetail from './pages/PathDetail';
import Upgrade from './pages/Upgrade';
import Pricing from './pages/Pricing';
import PublicBrief from './pages/PublicBrief';
import TopicPage from './pages/TopicPage';
import BlogPost from './pages/BlogPost';
import BlogList from './pages/BlogList';
import ConfirmEmail from './pages/ConfirmEmail';
import Admin from './pages/Admin';
import AdminFeedback from './pages/AdminFeedback';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import InactivityHandler from './components/InactivityHandler';

// Initialize Analytics (replace with actual ID when ready)
initGA('G-XXXXXXXXXX');

export default function App() {
  useEffect(() => {
    logPageView();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <InactivityHandler />
        <Router>
          <ScrollToTop />
          <Layout>
            <div className="container-max mt-4">
              <AdBanner position="top" className="my-0" />
            </div>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/p/:briefId" element={<ErrorBoundary><PublicBrief /></ErrorBoundary>} />
            <Route path="/topics/:topic" element={<TopicPage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route 
              path="/dashboard" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/brief" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <Brief />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/brief/result" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <BriefResult />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/brief/:id" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <BriefResult />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/brief/:briefId/path/:pathType" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <PathDetail />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/upgrade" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <Upgrade />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  </HelmetProvider>
);
}
