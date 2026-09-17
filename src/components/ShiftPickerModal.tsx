import React, { useState } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { Employee, ShiftCode } from '../types';
import { SHIFT_DEFINITIONS, WEEKDAY_FULL_RU } from '../data/initialData';
import { PurpleJellyButton, GlassPanel } from './GlassControls';

interface ShiftPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  dateStr: string; // YYYY-MM-DD
  currentShiftCode: ShiftCode;
  currentHours?: number;
  currentNote?: string;
  currentIsSwap?: boolean;
  onSave: (shiftCode: ShiftCode, customHours?: number, note?: string, isSwap?: boolean) => void;
}

export const ShiftPickerModal: React.FC<ShiftPickerModalProps> = ({
  isOpen,
  onClose,
  employee,
  dateStr,
  currentShiftCode,
  currentHours,
  currentNote = '',
  currentIsSwap = false,
  onSave,
}) => {
  const [selectedCode, setSelectedCode] = useState<ShiftCode>(currentShiftCode);
  const [hours, setHours] = useState<number>(
    currentHours !== undefined ? currentHours : (SHIFT_DEFINITIONS[currentShiftCode]?.hours || 0)
  );
  const [note, setNote] = useState<string>(currentNote);
  const [isSwap, setIsSwap] = useState<boolean>(currentIsSwap);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedCode(currentShiftCode);
      setHours(currentHours !== undefined ? currentHours : (SHIFT_DEFINITIONS[currentShiftCode]?.hours || 0));
      setNote(currentNote || '');
      setIsSwap(currentIsSwap || false);
    }
  }, [isOpen, currentShiftCode, currentHours, currentNote, currentIsSwap]);

  if (!isOpen || !employee) return null;

  const dateObj = new Date(dateStr);
  const dayNum = dateObj.getDate();
  const weekdayName = WEEKDAY_FULL_RU[dateObj.getDay()];
  const monthName = dateObj.toLocaleString('ru-RU', { month: 'long' });

  const handleSelectCode = (code: ShiftCode) => {
    setSelectedCode(code);
    setHours(SHIFT_DEFINITIONS[code]?.hours || 0);
  };

  const handleApply = () => {
    onSave(selectedCode, hours, note.trim() || undefined, isSwap);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg">
        <GlassPanel variant="holo" className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/60 dark:border-white/10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Назначение смены
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {employee.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                {dayNum} {monthName}, {weekdayName} • {employee.role}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shift Choices */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Выберите тип смены:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(SHIFT_DEFINITIONS).map((shift) => {
                const isSelected = selectedCode === shift.code;
                return (
                  <button
                    key={shift.code}
                    type="button"
                    onClick={() => handleSelectCode(shift.code as ShiftCode)}
                    className={`relative p-2.5 rounded-xl text-left transition-all duration-150 border cursor-pointer ${
                      isSelected
                        ? 'bg-white/90 dark:bg-slate-800/90 border-purple-500 shadow-[0_4px_14px_rgba(124,58,237,0.3)] ring-2 ring-purple-400/40'
                        : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {shift.shortLabel}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {shift.hours > 0 ? `${shift.hours} ч` : '0 ч'}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                      {shift.name}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">
                      {shift.startTime !== '-' ? `${shift.startTime}–${shift.endTime}` : 'Нерабочий'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hours & Details adjustment */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Фактические часы:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400"
                />
                <span className="text-xs text-slate-500 font-medium">часов</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Особая отметка:
              </label>
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSwap}
                  onChange={(e) => setIsSwap(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-400"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Смена по замене (подмена)
                </span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Примечание к смене:
            </label>
            <input
              type="text"
              placeholder="Например: дежурство за Иванова, переработка..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Calculated pay preview for this shift */}
          {hours > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Оплата за смену:</span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {Math.round(hours * employee.hourlyRate * (SHIFT_DEFINITIONS[selectedCode]?.rateMultiplier || 1)).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-5 pt-3 border-t border-white/60 dark:border-white/10 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onSave('OFF', 0, undefined, false);
                onClose();
              }}
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              Сделать выходным
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Отмена
              </button>

              <PurpleJellyButton onClick={handleApply}>
                Сохранить смену
              </PurpleJellyButton>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
