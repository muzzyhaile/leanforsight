import React from 'react';
import { Link } from 'react-router-dom';

export const MobileMenu = ({ isOpen, isLanding, isAuthenticated, onClose, onLogout, onLoginClick }) => {
  if (!isOpen) return null;

  return (
    <div className={`sm:hidden border-t ${isLanding ? 'bg-slate-950/95 border-white/10' : 'bg-white border-slate-200'}`}>
      <nav className="flex flex-col px-4 py-4 space-y-3">
        {!isLanding && (
          <Link
            to="/"
            className={`py-2 text-base font-medium ${isLanding ? 'text-slate-300' : 'text-slate-600'}`}
            onClick={onClose}
          >
            Home
          </Link>
        )}

        {isAuthenticated && (
          <Link
            to="/projects"
            className={`py-2 text-base font-medium ${isLanding ? 'text-slate-300' : 'text-slate-600'}`}
            onClick={onClose}
          >
            Projects
          </Link>
        )}

        {isAuthenticated ? (
          <button
            onClick={() => {
              onLogout?.();
              onClose();
            }}
            className="py-2 text-base font-medium text-red-500 text-left"
          >
            Sign Out
          </button>
        ) : (
          <button
            className={`mt-2 w-full py-3 rounded-xl text-base font-bold ${
              isLanding ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
            }`}
            onClick={() => {
              onLoginClick();
              onClose();
            }}
          >
            Get Started
          </button>
        )}
      </nav>
    </div>
  );
};
