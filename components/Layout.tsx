import React from 'react';
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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${
        isLanding 
          ? 'bg-slate-950/80 border-white/10 text-white backdrop-blur-md' 
          : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isLanding ? 'bg-gradient-to-br from-foresight-ram to-foresight-sprint text-white group-hover:scale-110' : 'bg-gradient-to-br from-foresight-ram to-foresight-sprint text-white'
            }`}>
              <IconBrain className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isLanding ? 'text-white' : 'text-slate-900'}`}>
              Lean<span className={isLanding ? 'text-slate-400' : 'text-slate-500'}>Foresight</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-8">
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
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
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
        </div>
      </header>
      
      {/* Spacer for fixed header if not on landing */}
      {!isLanding && <div className="h-20"></div>}

      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {!isLanding && (
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>© 2024 LeanForesight. Based on the RAM Methodology.</p>
          </div>
        </footer>
      )}
      {isLanding && (
        <footer className="bg-slate-950 border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2024 LeanForesight. Based on the RAM Methodology.</p>
          </div>
        </footer>
      )}
    </div>
  );
};