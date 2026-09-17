import React, { useState } from 'react';
import { X, Sparkles, Check, RefreshCw } from 'lucide-react';
import { Employee, GenerationPattern, ShiftCode } from '../types';
import { TealJellyButton, GlassPanel } from './GlassControls';

interface ShiftGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  currentYear: number;
  currentMonth: number;
  onApplyPattern: (
    employeeIds: string[],
    pattern: GenerationPattern,
    startDayOffset: number,
    variant: string
  ) => void;
}

export const ShiftGeneratorModal: React.FC<ShiftGeneratorModalProps> = ({
  isOpen,
  onClose,
  employees,
  currentYear,
  currentMonth,
  onApplyPattern,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<GenerationPattern>('2_2');
  const [patternVariant, setPatternVariant] = useState<string>('day_night'); // 'day_night' (Д, Н, В, В) or 'two_day' (Д, Д, В, В)
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>(employees.map((e) => e.id));
  const [phaseOffset, setPhaseOffset] = useState<number>(0);

  if (!isOpen) return null;

  const toggleEmployee = (id: string) => {
    if (selectedEmpIds.includes(id)) {
      setSelectedEmpIds(selectedEmpIds.filter((e) => e !== id));
    } else {
      setSelectedEmpIds([...selectedEmpIds, id]);
    }
  };

  const selectAll = () => setSelectedEmpIds(employees.map((e) => e.id));
  const clearAll = () => setSelectedEmpIds([]);

  const handleGenerate = () => {
    if (selectedEmpIds.length === 0) return;
    onApplyPattern(selectedEmpIds, selectedPattern, phaseOffset, patternVariant);
    onClose();
  };

  // Preview cycle string
  const getCyclePreview = (): ShiftCode[] => {
    if (selectedPattern === '2_2') {
      return patternVariant === 'day_night'
        ? ['DAY', 'NIGHT', 'OFF', 'OFF']
        : ['DAY', 'DAY', 'OFF', 'OFF'];
    }
    if (selectedPattern === '1_3') {
      return ['FULL', 'OFF', 'OFF', 'OFF'];
    }
    if (selectedPattern === '1_2') {
      return ['FULL', 'OFF', 'OFF'];
    }
    if (selectedPattern === '5_2') {
      return ['MORNING', 'MORNING', 'MORNING', 'MORNING', 'MORNING', 'OFF', 'OFF'];
    }
    return ['DAY', 'NIGHT', 'OFF', 'OFF'];
  };

  const cyclePreview = getCyclePreview();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl">
        <GlassPanel variant="holo" className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/60 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 dark:bg-teal-400/20 text-teal-700 dark:text-teal-300 border border-teal-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Генератор цикличного графика
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Автоматическое заполнение смен по шаблону на весь месяц
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pattern Selection */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              1. Выберите рабочий график:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPattern('2_2')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === '2_2'
                    ? 'bg-white/90 dark:bg-slate-800/90 border-teal-500 shadow-md ring-2 ring-teal-400/40'
                    : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/60'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">2 через 2</div>
                <div className="text-[10px] text-slate-500 mt-1">2 раб / 2 вых (День/Ночь)</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPattern('1_3')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === '1_3'
                    ? 'bg-white/90 dark:bg-slate-800/90 border-teal-500 shadow-md ring-2 ring-teal-400/40'
                    : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/60'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">1 через 3 (Сутки)</div>
                <div className="text-[10px] text-slate-500 mt-1">Сутки / Трое дома</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPattern('1_2')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === '1_2'
                    ? 'bg-white/90 dark:bg-slate-800/90 border-teal-500 shadow-md ring-2 ring-teal-400/40'
                    : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/60'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">1 через 2</div>
                <div className="text-[10px] text-slate-500 mt-1">Сутки / Двое дома</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPattern('5_2')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPattern === '5_2'
                    ? 'bg-white/90 dark:bg-slate-800/90 border-teal-500 shadow-md ring-2 ring-teal-400/40'
                    : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/60'
                }`}
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">5 через 2</div>
                <div className="text-[10px] text-slate-500 mt-1">Пятидневка (8ч)</div>
              </button>
            </div>

            {/* Sub-variant for 2/2 */}
            {selectedPattern === '2_2' && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Вариант смен:
                </span>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="var22"
                    checked={patternVariant === 'day_night'}
                    onChange={() => setPatternVariant('day_night')}
                    className="text-teal-600"
                  />
                  <span>День + Ночь + 2 Вых</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="var22"
                    checked={patternVariant === 'two_day'}
                    onChange={() => setPatternVariant('two_day')}
                    className="text-teal-600"
                  />
                  <span>2 Дня + 2 Вых</span>
                </label>
              </div>
            )}
          </div>

          {/* Phase offset & Cycle Visual Preview */}
          <div className="mt-4 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Смещение фазы цикла (шаг чередования):
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                  Сдвиг: {phaseOffset} дн.
                </span>
                <button
                  type="button"
                  onClick={() => setPhaseOffset((prev) => (prev + 1) % cyclePreview.length)}
                  className="px-2 py-0.5 rounded-lg bg-white/80 dark:bg-white/10 text-xs font-medium hover:bg-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Сдвинуть</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {cyclePreview.map((code, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    code === 'DAY'
                      ? 'bg-teal-500/20 text-teal-800 dark:text-teal-200 border-teal-400/50'
                      : code === 'NIGHT'
                      ? 'bg-purple-500/20 text-purple-800 dark:text-purple-200 border-purple-400/50'
                      : code === 'FULL'
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-400/50'
                      : code === 'MORNING'
                      ? 'bg-sky-500/20 text-sky-800 dark:text-sky-200 border-sky-400/50'
                      : 'bg-slate-200/50 dark:bg-white/5 text-slate-500 border-slate-300/40'
                  }`}
                >
                  {code === 'DAY' ? 'ДЕНЬ' : code === 'NIGHT' ? 'НОЧЬ' : code === 'FULL' ? 'СУТКИ' : code === 'MORNING' ? 'УТРО' : 'ВЫХ'}
                </div>
              ))}
            </div>
          </div>

          {/* Employee Selection */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                3. Применить к сотрудникам ({selectedEmpIds.length} из {employees.length}):
              </label>
              <div className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-300">
                <button type="button" onClick={selectAll} className="hover:underline cursor-pointer">
                  Все
                </button>
                <span>•</span>
                <button type="button" onClick={clearAll} className="hover:underline cursor-pointer">
                  Снять
                </button>
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {employees.map((emp) => {
                const isChecked = selectedEmpIds.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-white/80 dark:bg-white/10 border-teal-400/70 shadow-sm'
                        : 'bg-white/20 dark:bg-white/5 border-transparent opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${emp.avatarColor}`} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {emp.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        ({emp.role})
                      </span>
                    </div>
                    {isChecked && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-white/60 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Отмена
            </button>

            <TealJellyButton
              onClick={handleGenerate}
              disabled={selectedEmpIds.length === 0}
            >
              Заполнить график
            </TealJellyButton>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
