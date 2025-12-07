import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { User } from '../types';
import { IconBrain, IconGoogle, IconLoader } from '../components/Icons';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate network delay for realistic feel
    setTimeout(() => {
      const user = storageService.login('demo@leanforesight.com', 'Demo User');
      onLogin(user);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center">
        
        <div className="mx-auto h-20 w-20 bg-gradient-to-br from-foresight-ram to-foresight-sprint rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg transform -rotate-3">
          <IconBrain className="w-12 h-12" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
          Welcome to LeanForesight
        </h2>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto">
          Sign in to start your scenario planning and strategic foresight journey.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <IconLoader className="w-6 h-6 text-slate-400" />
            ) : (
              <>
                <IconGoogle className="w-6 h-6" />
                <span className="text-lg">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};