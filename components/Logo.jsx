import React from 'react';
import { Link } from 'react-router-dom';
import { IconBrain } from './Icons.jsx';

export const Logo = ({ isLanding }) => {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
      <div
        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
          isLanding
            ? 'bg-gradient-to-br from-foresight-ram to-foresight-sprint text-white group-hover:scale-110'
            : 'bg-gradient-to-br from-foresight-ram to-foresight-sprint text-white'
        }`}
      >
        <IconBrain className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <span className={`text-lg sm:text-xl font-bold tracking-tight ${isLanding ? 'text-white' : 'text-slate-900'}`}>
        Lean<span className={isLanding ? 'text-slate-400' : 'text-slate-500'}>Foresight</span>
      </span>
    </Link>
  );
};
