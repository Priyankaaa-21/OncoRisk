import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  BarChart3,
  Stethoscope,
  MapPin,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  History,
  Lock
} from 'lucide-react';
import AccessibilityBar from './AccessibilityBar';

export default function Navbar({
  currentPage,
  setCurrentPage,
  user,
  onOpenAuth,
  onLogout,
  darkMode,
  setDarkMode,
  highContrast,
  setHighContrast,
  largeText,
  setLargeText,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'selector', label: 'Check My Risk', highlight: true },
    { id: 'metrics', label: 'Model Performance', icon: BarChart3 },
    { id: 'symptoms', label: 'Symptom Checker', icon: Stethoscope },
    { id: 'clinics', label: 'Screening Centers', icon: MapPin },
    { id: 'education', label: 'Educational Hub', icon: BookOpen },
  ];

  const handleNav = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setUserDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
            aria-label="OncoRisk Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600 dark:from-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
                OncoRisk
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-slate-500 dark:text-slate-400">
                Early Screening AI
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="ml-1 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-medium text-sm shadow-sm shadow-teal-500/25 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    Check My Risk
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    active
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Accessibility + Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <AccessibilityBar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              largeText={largeText}
              setLargeText={setLargeText}
            />

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Auth Dropdown or Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-expanded={userDropdown}
                  aria-label="User menu"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user.full_name || 'My Account'}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <History className="w-4 h-4 text-teal-600" />
                      Risk History & Trends
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Demo</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <AccessibilityBar
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              largeText={largeText}
              setLargeText={setLargeText}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
                currentPage === item.id
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">Start</span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <History className="w-4 h-4 text-teal-600" />
                  My Assessments & Trends
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({user.email})
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-center py-2.5 rounded-xl bg-teal-600 text-white font-medium text-sm shadow"
              >
                Sign In / Access Demo Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
