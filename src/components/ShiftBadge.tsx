import React from 'react';
import { ShiftCode } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';

interface ShiftBadgeProps {
  shiftCode: ShiftCode;
  customHours?: number;
  isSwap?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const ShiftBadge: React.FC<ShiftBadgeProps> = ({
  shiftCode,
  customHours,
  isSwap,
  onClick,
  size = 'md',
  compact = false,
}) => {
  const def = SHIFT_DEFINITIONS[shiftCode] || SHIFT_DEFINITIONS.OFF;
  const isOff = shiftCode === 'OFF';

  let badgeClasses = '';
  if (shiftCode === 'DAY') {
    badgeClasses = 'pill-teal text-white';
  } else if (shiftCode === 'NIGHT') {
    badgeClasses = 'pill-purple text-white';
  } else if (shiftCode === 'FULL') {
    badgeClasses = 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_3px_10px_rgba(245,158,11,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.7)]';
  } else if (shiftCode === 'MORNING') {
    badgeClasses = 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_3px_10px_rgba(14,165,233,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.7)]';
  } else if (shiftCode === 'EVENING') {
    badgeClasses = 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_3px_10px_rgba(99,102,241,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.7)]';
  } else if (shiftCode === 'VACATION') {
    badgeClasses = 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-[0_3px_10px_rgba(16,185,129,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.7)]';
  } else if (shiftCode === 'SICK') {
    badgeClasses = 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-[0_3px_10px_rgba(244,63,94,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.7)]';
  } else {
    // OFF
    badgeClasses = 'bg-slate-200/40 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-300/40 dark:border-white/10 hover:bg-slate-200/60 dark:hover:bg-white/10';
  }

  const hoursDisplay = customHours !== undefined ? customHours : def.hours;

  return (
    <div
      onClick={onClick}
      title={`${def.name} (${def.startTime} - ${def.endTime}, ${hoursDisplay} ч)${isSwap ? ' • Замена' : ''}`}
      className={`relative group inline-flex items-center justify-center font-bold transition-all duration-150 rounded-full select-none cursor-pointer active:scale-95 ${badgeClasses} ${
        compact
          ? 'w-7 h-7 text-xs'
          : size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-4 py-1.5 text-sm'
          : 'px-2.5 py-1 text-xs'
      }`}
    >
      {/* Specular highlight for non-off badges */}
      {!isOff && (
        <span className="absolute inset-x-1.5 top-0.5 h-[35%] rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      )}

      {/* Badge label */}
      <span className="relative z-10 flex items-center gap-1">
        <span>{compact ? def.shortLabel : def.shortLabel}</span>
        {!compact && !isOff && (
          <span className="text-[10px] opacity-80 font-normal">
            {hoursDisplay}ч
          </span>
        )}
      </span>

      {/* Swap indicator dot */}
      {isSwap && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white shadow-sm" />
      )}
    </div>
  );
};
