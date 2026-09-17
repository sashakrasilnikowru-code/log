import React, { useState, useEffect } from 'react';
import {
  Employee,
  ShiftRecord,
  ShiftCode,
  ViewTab,
  ThemeMode,
  GenerationPattern,
} from './types';
import {
  INITIAL_EMPLOYEES,
  generateInitialSchedule,
  MONTH_NAMES_RU,
} from './data/initialData';
import { TitleBar } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';
import { ScheduleGrid } from './components/ScheduleGrid';
import { StatsPanel } from './components/StatsPanel';
import { EmployeeManager } from './components/EmployeeManager';
import { PrintView } from './components/PrintView';
import { ShiftPickerModal } from './components/ShiftPickerModal';
import { ShiftGeneratorModal } from './components/ShiftGeneratorModal';
import { EmployeeModal } from './components/EmployeeModal';
import {
  PurpleJellyButton,
  TealJellyButton,
  WhiteElevatedPill,
  GlassBubbleSphere,
} from './components/GlassControls';
import {
  Calendar as CalendarIcon,
  Users,
  BarChart3,
  Printer,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY_EMPLOYEES = 'shiftflow_employees_v1';
const STORAGE_KEY_RECORDS = 'shiftflow_records_v1';
const STORAGE_KEY_THEME = 'shiftflow_theme_v1';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Date state (default to September 2026 as per workspace reference)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 is September (0-indexed)

  // Employees state
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading employees from localStorage', e);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  // Shift Records state
  const [records, setRecords] = useState<ShiftRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading records from localStorage', e);
      }
    }
    return generateInitialSchedule(2026, 8);
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }, [records]);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ViewTab>('schedule');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Modals state
  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
    dateStr: string;
    currentShiftCode: ShiftCode;
    currentHours?: number;
    currentNote?: string;
    currentIsSwap?: boolean;
  }>({
    isOpen: false,
    employee: null,
    dateStr: '',
    currentShiftCode: 'OFF',
  });

  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [employeeModal, setEmployeeModal] = useState<{
    isOpen: boolean;
    employeeToEdit: Employee | null;
  }>({
    isOpen: false,
    employeeToEdit: null,
  });

  // Cell interaction handlers
  const handleCellClick = (
    employee: Employee,
    dateStr: string,
    currentShift: ShiftCode,
    customHours?: number,
    note?: string,
    isSwap?: boolean
  ) => {
    setPickerModal({
      isOpen: true,
      employee,
      dateStr,
      currentShiftCode: currentShift,
      currentHours: customHours,
      currentNote: note,
      currentIsSwap: isSwap,
    });
  };

  const handleSaveShift = (
    shiftCode: ShiftCode,
    customHours?: number,
    note?: string,
    isSwap?: boolean
  ) => {
    if (!pickerModal.employee || !pickerModal.dateStr) return;
    const { employee, dateStr } = pickerModal;

    setRecords((prev) => {
      const filtered = prev.filter(
        (r) => !(r.employeeId === employee.id && r.dateStr === dateStr)
      );
      if (shiftCode === 'OFF' && !note && !isSwap) {
        return filtered;
      }
      return [
        ...filtered,
        {
          id: `rec-${employee.id}-${dateStr}`,
          employeeId: employee.id,
          dateStr,
          shiftCode,
          customHours,
          note,
          isSwap,
        },
      ];
    });
  };

  // Quick cycle shift: DAY -> NIGHT -> FULL -> OFF
  const handleQuickCycleShift = (employee: Employee, dateStr: string) => {
    setRecords((prev) => {
      const existing = prev.find(
        (r) => r.employeeId === employee.id && r.dateStr === dateStr
      );
      let nextCode: ShiftCode = 'DAY';
      if (!existing || existing.shiftCode === 'OFF') {
        nextCode = 'DAY';
      } else if (existing.shiftCode === 'DAY') {
        nextCode = 'NIGHT';
      } else if (existing.shiftCode === 'NIGHT') {
        nextCode = 'FULL';
      } else {
        nextCode = 'OFF';
      }

      const filtered = prev.filter(
        (r) => !(r.employeeId === employee.id && r.dateStr === dateStr)
      );
      if (nextCode === 'OFF') return filtered;

      return [
        ...filtered,
        {
          id: `rec-${employee.id}-${dateStr}`,
          employeeId: employee.id,
          dateStr,
          shiftCode: nextCode,
        },
      ];
    });
  };

  // Apply pattern from generator
  const handleApplyPattern = (
    employeeIds: string[],
    pattern: GenerationPattern,
    startDayOffset: number,
    variant: string
  ) => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let cycle: ShiftCode[] = [];
    if (pattern === '2_2') {
      cycle =
        variant === 'day_night'
          ? ['DAY', 'NIGHT', 'OFF', 'OFF']
          : ['DAY', 'DAY', 'OFF', 'OFF'];
    } else if (pattern === '1_3') {
      cycle = ['FULL', 'OFF', 'OFF', 'OFF'];
    } else if (pattern === '1_2') {
      cycle = ['FULL', 'OFF', 'OFF'];
    } else if (pattern === '5_2') {
      cycle = ['MORNING', 'MORNING', 'MORNING', 'MORNING', 'MORNING', 'OFF', 'OFF'];
    }

    setRecords((prev) => {
      // Remove all records for these employees in current month
      const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
      const filtered = prev.filter(
        (r) =>
          !(
            employeeIds.includes(r.employeeId) &&
            r.dateStr.startsWith(currentMonthPrefix)
          )
      );

      const newRecords: ShiftRecord[] = [];
      employeeIds.forEach((empId, empIdx) => {
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          // Calculate cycle index with individual stagger for multiple employees
          const cycleIdx = (day - 1 + startDayOffset + empIdx * 2) % cycle.length;
          const shiftCode = cycle[cycleIdx];

          if (shiftCode !== 'OFF') {
            newRecords.push({
              id: `rec-${empId}-${dateStr}`,
              employeeId: empId,
              dateStr,
              shiftCode,
            });
          }
        }
      });

      return [...filtered, ...newRecords];
    });
  };

  // Employee CRUD
  const handleSaveEmployee = (emp: Employee) => {
    setEmployees((prev) => {
      const idx = prev.findIndex((e) => e.id === emp.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = emp;
        return copy;
      }
      return [...prev, emp];
    });
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
    setRecords((prev) => prev.filter((r) => r.employeeId !== empId));
  };

  // Reset to demo data
  const handleResetData = () => {
    if (window.confirm('Сбросить данные графика и сотрудников к начальным демонстрационным?')) {
      setEmployees(INITIAL_EMPLOYEES);
      setRecords(generateInitialSchedule(currentYear, currentMonth));
      localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
      localStorage.removeItem(STORAGE_KEY_RECORDS);
    }
  };

  // Calculate current month shifts and hours
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const currentMonthRecords = records.filter((r) =>
    r.dateStr.startsWith(currentMonthPrefix) && r.shiftCode !== 'OFF'
  );
  const totalMonthHours = currentMonthRecords.reduce((acc, r) => {
    const hours = r.customHours !== undefined ? r.customHours : (r.shiftCode === 'FULL' ? 22 : r.shiftCode === 'MORNING' || r.shiftCode === 'EVENING' ? 8 : 11);
    return acc + hours;
  }, 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#0f131a]' : 'bg-[#ede4db]'}`}>
      {/* Background Lighting & Sunlight Caustics matching reference image */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        {theme === 'light' ? (
          <>
            {/* Warm morning sunbeam from upper-left casting onto cream desk */}
            <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#fff6e8] via-[#fedbbd]/30 to-transparent blur-3xl opacity-80" />
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#fbcfe8]/20 via-[#c7d2fe]/20 to-transparent blur-3xl opacity-70" />
            {/* Angled soft window blind shadow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.06]" />
          </>
        ) : (
          <>
            {/* Deep dark obsidian glow with neon liquid highlights */}
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-950/40 via-purple-900/30 to-transparent blur-3xl opacity-60" />
            <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-teal-950/40 via-cyan-900/20 to-transparent blur-3xl opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-black/40" />
          </>
        )}
      </div>

      {/* Main Desktop Frame Layout */}
      <main className="relative z-10 p-2 sm:p-4 md:p-6 lg:p-8 max-w-[1460px] mx-auto min-h-screen flex flex-col justify-between">
        {/* The Floating Windows Liquid Glass Window */}
        <div
          className={`w-full rounded-[26px] flex flex-col transition-all duration-300 ${
            theme === 'dark' ? 'glass-window-dark' : 'glass-window-light'
          }`}
        >
          {/* Windows Title Bar */}
          <TitleBar
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenGenerator={() => setGeneratorModalOpen(true)}
            onOpenEmployeeModal={() =>
              setEmployeeModal({ isOpen: true, employeeToEdit: null })
            }
          />

          {/* Reference-Styled Tool Ribbon & View Navigation */}
          <nav className="p-4 sm:p-6 border-b border-white/50 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Tab Switcher (Styled as the segmented pill "Toast | Tabs" in reference) */}
            <div className="inline-flex items-center p-1 rounded-full bg-white/50 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)]">
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>График смен</span>
                </span>
                {activeTab === 'schedule' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('employees')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'employees'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Сотрудники ({employees.length})</span>
                </span>
                {activeTab === 'employees' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Аналитика & ФОТ</span>
                </span>
                {activeTab === 'stats' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('print')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'print'
                    ? 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Печать / Экспорт</span>
                </span>
                {activeTab === 'print' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-600" />
                )}
              </button>
            </div>

            {/* Right: Liquid Glass Action Elements matching reference ("secondary" & "Secondary" pills) */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Purple Jelly Button matching reference "secondary" */}
              <PurpleJellyButton
                onClick={() => setGeneratorModalOpen(true)}
              >
                <Sparkles className="w-4 h-4" />
                <span>Авто-график</span>
              </PurpleJellyButton>

              {/* Teal Jelly Button matching reference "Secondary" */}
              <TealJellyButton
                onClick={() => setEmployeeModal({ isOpen: true, employeeToEdit: null })}
              >
                <span>+ Сотрудник</span>
              </TealJellyButton>

              {/* Circular elevated white button with '+' matching reference */}
              <button
                type="button"
                onClick={() => setGeneratorModalOpen(true)}
                title="Быстрый мастер циклов"
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-base flex items-center justify-center pill-white-elevated transition-transform active:scale-90 cursor-pointer"
              >
                +
              </button>

              {/* Physical Glass Bubble Sphere matching reference */}
              <GlassBubbleSphere size={36} label="Сфера преломления" />

              {/* Reset demo data */}
              <button
                type="button"
                onClick={handleResetData}
                title="Сбросить к начальным данным"
                className="p-2 rounded-full bg-white/40 dark:bg-white/10 hover:bg-white/70 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </nav>

          {/* Window Body Content */}
          <div className="p-4 sm:p-6 flex-1">
            {activeTab === 'schedule' && (
              <ScheduleGrid
                employees={employees}
                records={records}
                currentYear={currentYear}
                currentMonth={currentMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                onCellClick={handleCellClick}
                onQuickCycleShift={handleQuickCycleShift}
                onOpenGenerator={() => setGeneratorModalOpen(true)}
                onOpenEmployeeModal={() =>
                  setEmployeeModal({ isOpen: true, employeeToEdit: null })
                }
              />
            )}

            {activeTab === 'employees' && (
              <EmployeeManager
                employees={employees}
                records={records}
                onAddEmployee={() =>
                  setEmployeeModal({ isOpen: true, employeeToEdit: null })
                }
                onEditEmployee={(emp) =>
                  setEmployeeModal({ isOpen: true, employeeToEdit: emp })
                }
                onDeleteEmployee={handleDeleteEmployee}
              />
            )}

            {activeTab === 'stats' && (
              <StatsPanel
                employees={employees}
                records={records}
                currentYear={currentYear}
                currentMonth={currentMonth}
                monthName={MONTH_NAMES_RU[currentMonth]}
                onOpenGenerator={() => setGeneratorModalOpen(true)}
                onOpenEmployeeModal={() =>
                  setEmployeeModal({ isOpen: true, employeeToEdit: null })
                }
              />
            )}

            {activeTab === 'print' && (
              <PrintView
                employees={employees}
                records={records}
                currentYear={currentYear}
                currentMonth={currentMonth}
                monthName={MONTH_NAMES_RU[currentMonth]}
                onBack={() => setActiveTab('schedule')}
              />
            )}
          </div>

          {/* Windows Status Bar */}
          <StatusBar
            employeeCount={employees.length}
            totalShiftsCount={currentMonthRecords.length}
            totalHours={totalMonthHours}
            isSaved={true}
          />
        </div>
      </main>

      {/* Interactive Modals */}
      <ShiftPickerModal
        isOpen={pickerModal.isOpen}
        onClose={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
        employee={pickerModal.employee}
        dateStr={pickerModal.dateStr}
        currentShiftCode={pickerModal.currentShiftCode}
        currentHours={pickerModal.currentHours}
        currentNote={pickerModal.currentNote}
        currentIsSwap={pickerModal.currentIsSwap}
        onSave={handleSaveShift}
      />

      <ShiftGeneratorModal
        isOpen={generatorModalOpen}
        onClose={() => setGeneratorModalOpen(false)}
        employees={employees}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onApplyPattern={handleApplyPattern}
      />

      <EmployeeModal
        isOpen={employeeModal.isOpen}
        onClose={() => setEmployeeModal({ isOpen: false, employeeToEdit: null })}
        employeeToEdit={employeeModal.employeeToEdit}
        onSave={handleSaveEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
}
