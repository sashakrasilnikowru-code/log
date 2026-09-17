import React from 'react';
import { Minus, Square, X, Sun, Moon, Calendar, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';

interface TitleBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenGenerator: () => void;
  onOpenEmployeeModal: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  theme,
  onToggleTheme,
  onOpenGenerator,
  onOpenEmployeeModal,
}) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2.5 select-none border-b border-white/50 dark:border-white/10 bg-white/30 dark:bg-slate-900/40 backdrop-blur-md rounded-t-[26px]">
      {/* Left: App Identity & Window Glyph */}
      <div className="flex items-center gap-3">
        {/* Glowing glass logo bubble */}
        <div className="relative w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 via-teal-400 to-indigo-500 p-[1px] shadow-[0_2px_10px_rgba(124,58,237,0.4)] flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-white/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
            График смен
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 border border-purple-400/30">
            ShiftFlow Studio
          </span>
          <span className="hidden md:inline-block text-xs text-slate-400 dark:text-slate-500">
            • Windows Desktop v2.4
          </span>
        </div>
      </div>

      {/* Center: Quick Action Shortcuts */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenGenerator}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/60 dark:border-white/15 transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Генератор циклов (2/2, 1/3)</span>
        </button>

        <button
          type="button"
          onClick={onOpenEmployeeModal}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/60 dark:border-white/15 transition-all shadow-sm cursor-pointer"
        >
          <span className="text-purple-600 dark:text-purple-400 font-bold">+</span>
          <span>Добавить сотрудника</span>
        </button>
      </div>

      {/* Right: Theme Toggle & Windows Window Controls */}
      <div className="flex items-center gap-2">
        {/* Light/Dark Theme Switcher */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/60 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-white/80 dark:border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all cursor-pointer mr-1"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-purple-700 transition-transform duration-200 hover:rotate-12" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          )}
        </button>

        {/* Windows 11 Window Controls */}
        <div className="flex items-center rounded-lg overflow-hidden border border-slate-200/40 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 shadow-inner">
          <button
            type="button"
            title="Свернуть"
            onClick={() => {}}
            className="w-8 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title={isMaximized ? 'Восстановить' : 'Развернуть'}
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-8 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            type="button"
            title="Закрыть"
            onClick={() => {}}
            className="w-9 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
