import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import ConfirmEmail from './pages/ConfirmEmail';
import Admin from './pages/Admin';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <div className="container-max mt-4">
            <AdBanner type="top" className="my-0" />
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
            <Route path="/p/:briefId" element={<ErrorBoundary><PublicBrief /></ErrorBoundary>} />
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
  );
}
