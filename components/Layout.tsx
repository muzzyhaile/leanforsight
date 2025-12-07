import React, { useState } from 'react';
import { IconBrain } from './Icons';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  isAuthenticated: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout, isAuthenticated }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${
        isLanding 
          ? 'bg-slate-950/80 border-white/10 text-white backdrop-blur-md' 
          : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
              isLanding ? 'bg-gradient-to-br from-foresight-ram to-foresight-sprint text-white group-hover:scale-110' : 'bg-gradient-to-br from-foresight-ram to-foresight-sprint text-white'
            }`}>
              <IconBrain className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className={`text-lg sm:text-xl font-bold tracking-tight ${isLanding ? 'text-white' : 'text-slate-900'}`}>
              Lean<span className={isLanding ? 'text-slate-400' : 'text-slate-500'}>Foresight</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6 lg:gap-8">
            {!isLanding && (
               <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
            )}
            
            {isAuthenticated && (
               <Link to="/projects" className={`text-sm font-medium transition-colors ${isLanding ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Projects</Link>
            )}

            {isAuthenticated ? (
              <button 
                onClick={onLogout}
                className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  isLanding 
                  ? 'bg-white text-slate-950 hover:bg-slate-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                onClick={() => window.location.hash = '#auth'}
              >
                Get Started
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className={`w-6 h-6 ${isLanding ? 'text-white' : 'text-slate-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`sm:hidden border-t ${isLanding ? 'bg-slate-950/95 border-white/10' : 'bg-white border-slate-200'}`}>
            <nav className="flex flex-col px-4 py-4 space-y-3">
              {!isLanding && (
                <Link 
                  to="/" 
                  className={`py-2 text-base font-medium ${isLanding ? 'text-slate-300' : 'text-slate-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              )}
              
              {isAuthenticated && (
                <Link 
                  to="/projects" 
                  className={`py-2 text-base font-medium ${isLanding ? 'text-slate-300' : 'text-slate-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </Link>
              )}

              {isAuthenticated ? (
                <button 
                  onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}
                  className="py-2 text-base font-medium text-red-500 text-left"
                >
                  Sign Out
                </button>
              ) : (
                <button 
                  className={`mt-2 w-full py-3 rounded-xl text-base font-bold ${
                    isLanding 
                    ? 'bg-white text-slate-950' 
                    : 'bg-slate-900 text-white'
                  }`}
                  onClick={() => { window.location.hash = '#auth'; setMobileMenuOpen(false); }}
                >
                  Get Started
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer for fixed header if not on landing */}
      {!isLanding && <div className="h-16 sm:h-20"></div>}

      <main className="flex-grow flex flex-col">
        {children}
      </main>

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