import React from 'react';
import { IconBrain } from './Icons';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  isAuthenticated: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout, isAuthenticated }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-foresight-ram to-foresight-sprint p-2 rounded-lg text-white">
              <IconBrain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Lean<span className="text-slate-500">Foresight</span></span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">Methodology</Link>
            {isAuthenticated && (
               <Link to="/projects" className="text-sm font-medium text-slate-900">Projects</Link>
            )}
            {isAuthenticated ? (
              <button 
                onClick={onLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            ) : (
              <button 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                onClick={() => window.location.hash = '#auth'}
              >
                Get Started
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 LeanForesight. Based on the RAM Methodology.</p>
        </div>
      </footer>
    </div>
  );
};
