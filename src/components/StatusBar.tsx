import React, { useState, useEffect } from 'react';
import { CheckCircle2, Users, Clock, HelpCircle, HardDrive } from 'lucide-react';

interface StatusBarProps {
  employeeCount: number;
  totalShiftsCount: number;
  totalHours: number;
  isSaved?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  employeeCount,
  totalShiftsCount,
  totalHours,
  isSaved = true,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex items-center justify-between px-4 py-1.5 text-[11px] select-none border-t border-white/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/50 backdrop-blur-md rounded-b-[26px] text-slate-600 dark:text-slate-400">
      {/* Left: Storage & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-medium">
          <HardDrive className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="text-slate-700 dark:text-slate-300">Локальное хранилище:</span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Синхронизировано
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 border-l border-slate-300/40 dark:border-white/10 pl-3">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Сотрудников: <strong>{employeeCount}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Смен: <strong>{totalShiftsCount}</strong> ({totalHours} ч)</span>
          </div>
        </div>
      </div>

      {/* Center: Quick hint */}
      <div className="hidden lg:flex items-center gap-1.5 text-slate-500">
        <HelpCircle className="w-3 h-3" />
        <span>Подсказка: кликните по любой ячейке для быстрой смены или настройки часов</span>
      </div>

      {/* Right: Windows Clock */}
      <div className="flex items-center gap-3">
        <span className="px-2 py-0.5 rounded bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-mono font-medium">
          {timeStr}
        </span>
        <span className="hidden sm:inline-block text-[10px] text-slate-400">
          RU • Windows 11 Fluent
        </span>
      </div>
    </footer>
  );
};
