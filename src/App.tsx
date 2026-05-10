import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UnitDetail from './components/UnitDetail';
import Chat from './components/Chat';
import TeacherDashboard from './components/TeacherDashboard';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import RoleSelection from './components/RoleSelection';
import AIChat from './components/AIChat';
import BottomNav from './components/BottomNav';
import WritingCorrector from './components/WritingCorrector';
import ErrorReview from './components/ErrorReview';
import DictationTool from './components/DictationTool';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';

const AppContent: React.FC = () => {
  const { user, userData, loading, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get('view');

  const isMasterEmail = user?.email === 'garciahellen872@gmail.com' || user?.email === 'segahunter71@gmail.com';
  const isMissingRole = !userData || userData.role === null || userData.role === undefined || userData.role === "";

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyber-indigo border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-slate-200 selection:bg-cyber-indigo selection:text-white pb-20 md:pb-0">
      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route 
          path="*" 
          element={
            !user ? (
              <Login />
            ) : isMissingRole ? (
              <RoleSelection />
            ) : (
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        userData?.role === 'teacher' && viewParam !== 'student' 
                          ? <Navigate to="/teacher" replace /> 
                          : <Dashboard />
                      } 
                    />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/unit/:unitId" element={<UnitDetail />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/ai-teacher" element={<AIChat />} />
                    <Route path="/writing-corrector" element={<WritingCorrector />} />
                    <Route path="/error-review" element={<ErrorReview />} />
                    <Route path="/dictation" element={<DictationTool />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <BottomNav />
              </>
            )
          }
        />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <AppContent />
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
