import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = ({ isLanding, isAuthenticated, onLogout, onLoginClick }) => {
  return (
    <nav className="hidden sm:flex items-center gap-6 lg:gap-8">
      {!isLanding && (
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Home
        </Link>
      )}

      {isAuthenticated && (
        <Link
          to="/projects"
          className={`text-sm font-medium transition-colors ${
            isLanding ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Projects
        </Link>
      )}

      {isAuthenticated ? (
        <button onClick={onLogout} className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
          Sign Out
        </button>
      ) : (
        <button
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            isLanding ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          onClick={onLoginClick}
        >
          Get Started
        </button>
      )}
    </nav>
  );
};
