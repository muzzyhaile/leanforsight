import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { Navigation } from './Navigation.jsx';
import { MobileMenu } from './MobileMenu.jsx';

export const Layout = ({ children, onLogout, isAuthenticated }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLoginClick = () => {
    window.location.hash = '#auth';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header
        className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${
          isLanding
            ? 'bg-slate-950/80 border-white/10 text-white backdrop-blur-md'
            : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Logo isLanding={isLanding} />

          <Navigation
            isLanding={isLanding}
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
            onLoginClick={handleLoginClick}
          />

          <button className="sm:hidden p-2 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg className={`w-6 h-6 ${isLanding ? 'text-white' : 'text-slate-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          isLanding={isLanding}
          isAuthenticated={isAuthenticated}
          onClose={() => setMobileMenuOpen(false)}
          onLogout={onLogout}
          onLoginClick={handleLoginClick}
        />
      </header>

      {!isLanding && <div className="h-16 sm:h-20"></div>}

      <main className="flex-grow flex flex-col">{children}</main>

      {!isLanding && (
        <footer className="bg-white border-t border-slate-200 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>© 2024 LeanForesight. Based on the RAM Methodology.</p>
          </div>
        </footer>
      )}
      {isLanding && (
        <footer className="bg-slate-950 border-t border-white/10 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2024 LeanForesight. Based on the RAM Methodology.</p>
          </div>
        </footer>
      )}
    </div>
  );
};
