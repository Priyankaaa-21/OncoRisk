import React, { useState, useEffect } from 'react';
import DisclaimerBanner from './components/DisclaimerBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import AuthModal from './components/AuthModal';

import LandingPage from './pages/LandingPage';
import AssessmentSelectorPage from './pages/AssessmentSelectorPage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import ResultsPage from './pages/ResultsPage';
import ModelMetricsPage from './pages/ModelMetricsPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import ClinicFinderPage from './pages/ClinicFinderPage';
import EducationHubPage from './pages/EducationHubPage';
import UserDashboardPage from './pages/UserDashboardPage';

import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedCancer, setSelectedCancer] = useState('breast');
  const [currentResult, setCurrentResult] = useState(null);

  // User state
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Accessibility & Theme States
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('oncorisk_theme') === 'dark';
  });
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Sync Dark Mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('oncorisk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('oncorisk_theme', 'light');
    }
  }, [darkMode]);

  // Sync Accessibility Classes to <html>
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  // Check login on startup
  useEffect(() => {
    const token = localStorage.getItem('oncorisk_token');
    if (token) {
      api.getProfile()
        .then((profile) => setUser(profile))
        .catch(() => {
          localStorage.removeItem('oncorisk_token');
          setUser(null);
        });
    }
  }, []);

  const handleSelectCancer = (cancerId) => {
    setSelectedCancer(cancerId);
    setCurrentPage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = (result, cancerId) => {
    setCurrentResult(result);
    setSelectedCancer(cancerId);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewExplanation = async (assessmentId) => {
    try {
      const data = await api.getExplanation(assessmentId);
      setCurrentResult(data);
      setSelectedCancer(data.cancer_type);
      setCurrentPage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load assessment breakdown:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('oncorisk_token');
    setUser(null);
    if (currentPage === 'dashboard') {
      setCurrentPage('landing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      
      {/* Persistent Medical Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Primary Top Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        largeText={largeText}
        setLargeText={setLargeText}
      />

      {/* Main Page Content Router */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onSelectCancer={handleSelectCancer}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'selector' && (
          <AssessmentSelectorPage
            onSelectCancer={handleSelectCancer}
          />
        )}

        {currentPage === 'form' && (
          <AssessmentFormPage
            cancerType={selectedCancer}
            onBack={() => setCurrentPage('selector')}
            onSubmitSuccess={handleFormSuccess}
          />
        )}

        {currentPage === 'results' && (
          <ResultsPage
            result={currentResult}
            cancerType={selectedCancer}
            onReset={() => setCurrentPage('selector')}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}

        {currentPage === 'metrics' && (
          <ModelMetricsPage />
        )}

        {currentPage === 'symptoms' && (
          <SymptomCheckerPage
            onStartAssessment={handleSelectCancer}
          />
        )}

        {currentPage === 'clinics' && (
          <ClinicFinderPage />
        )}

        {currentPage === 'education' && (
          <EducationHubPage
            onStartAssessment={handleSelectCancer}
          />
        )}

        {currentPage === 'dashboard' && (
          <UserDashboardPage
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            onViewExplanation={handleViewExplanation}
            onNavigate={(p) => setCurrentPage(p)}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer onNavigate={(p) => setCurrentPage(p)} />

      {/* Floating AI Health Assistant (RAG Chatbot) */}
      <ChatbotWidget />

      {/* Auth Modal (Sign In / Register / Demo) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
