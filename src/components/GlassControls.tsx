import React from 'react';

// Purple Jelly Pill Button matching the reference "secondary" button
export const PurpleJellyButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}> = ({ children, onClick, className = '', id, disabled }) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed pill-purple ${className}`}
    >
      {/* Glossy top specular reflection */}
      <span className="absolute inset-x-3 top-1 h-[35%] rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

// Teal Jelly Pill Button matching the reference "Secondary" button
export const TealJellyButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}> = ({ children, onClick, className = '', id, disabled }) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed pill-teal ${className}`}
    >
      {/* Glossy top specular reflection */}
      <span className="absolute inset-x-3 top-1 h-[35%] rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

// White elevated tactile pill button/container matching reference "Create workspace"
export const WhiteElevatedPill: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  id?: string;
}> = ({ children, onClick, className = '', id }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-medium text-sm text-slate-800 dark:text-slate-100 pill-white-elevated transition-all duration-200 ${onClick ? 'cursor-pointer hover:opacity-95 active:scale-98' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// Frosted Glass Capsule / Pill matching reference "Workspace ✓"
export const FrostedPill: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  id?: string;
}> = ({ children, onClick, active, className = '', id }) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
        active
          ? 'bg-white/90 dark:bg-white/20 text-purple-900 dark:text-purple-100 shadow-[0_4px_16px_rgba(124,58,237,0.25),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-purple-300/60 dark:border-purple-400/40'
          : 'bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border border-white/70 dark:border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1.5px_rgba(255,255,255,0.8)]'
      } ${className}`}
    >
      {children}
    </button>
  );
};

// Translucent Acrylic Glass Panel / Card
export const GlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'holo';
}> = ({ children, className = '', id, variant = 'default' }) => {
  const panelClass = variant === 'holo'
    ? 'glass-holo-light dark:glass-holo-dark'
    : 'glass-panel-light dark:glass-panel-dark';

  return (
    <div
      id={id}
      className={`relative rounded-2xl overflow-hidden ${panelClass} ${className}`}
    >
      {/* Subtle corner iridescent flare matching reference */}
      {variant === 'holo' && (
        <>
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/40 via-fuchsia-400/30 to-transparent blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400/30 via-pink-400/20 to-transparent blur-lg pointer-events-none" />
        </>
      )}
      {children}
    </div>
  );
};

// Physical Glass Bubble Sphere matching reference
export const GlassBubbleSphere: React.FC<{
  size?: number;
  className?: string;
  label?: string;
}> = ({ size = 36, className = '', label }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full glass-sphere flex items-center justify-center shrink-0 cursor-default select-none group ${className}`}
      title={label || 'Liquid Glass Node'}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-white/80 blur-[0.5px] -translate-y-1 -translate-x-1" />
      {label && (
        <span className="absolute -bottom-5 text-[10px] font-semibold text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </div>
  );
};

// Liquid Glass Slider Toggle with circular knob containing '+' icon matching reference
export const GlassToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}> = ({ checked, onChange, label, id }) => {
  return (
    <div className="inline-flex items-center gap-2.5">
      {label && (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 select-none">
          {label}
        </span>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 cursor-pointer border ${
          checked
            ? 'bg-gradient-to-r from-purple-500/80 to-teal-400/80 border-purple-300/80 shadow-[0_2px_12px_rgba(124,58,237,0.35),inset_0_1px_2px_rgba(255,255,255,0.8)]'
            : 'bg-white/40 dark:bg-white/10 border-white/60 dark:border-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]'
        }`}
      >
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-100 text-purple-700 font-bold text-xs shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] transform transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          +
        </span>
      </button>
    </div>
  );
};

// Search / Text Input Pill matching reference
export const GlassSearchInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}> = ({ value, onChange, placeholder = 'Search...', id, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center w-full max-w-sm rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1.5px_1px_rgba(255,255,255,0.9)] px-4 py-2 ${className}`}
    >
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none pr-8"
      />
      <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};
