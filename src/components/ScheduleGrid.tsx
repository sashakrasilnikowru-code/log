import React, { useState, useMemo } from 'react';
import {
  Employee,
  ShiftRecord,
  ShiftCode,
} from '../types';
import {
  SHIFT_DEFINITIONS,
  MONTH_NAMES_RU,
  WEEKDAY_NAMES_RU,
} from '../data/initialData';
import { ShiftBadge } from './ShiftBadge';
import {
  FrostedPill,
  GlassSearchInput,
  WhiteElevatedPill,
  GlassBubbleSphere,
} from './GlassControls';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';

interface ScheduleGridProps {
  employees: Employee[];
  records: ShiftRecord[];
  currentYear: number;
  currentMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onCellClick: (employee: Employee, dateStr: string, currentShift: ShiftCode, customHours?: number, note?: string, isSwap?: boolean) => void;
  onQuickCycleShift: (employee: Employee, dateStr: string) => void;
  onOpenGenerator: () => void;
  onOpenEmployeeModal: () => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  employees,
  records,
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  onCellClick,
  onQuickCycleShift,
  onOpenGenerator,
  onOpenEmployeeModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [compactMode, setCompactMode] = useState(false);

  // Today's date calculations
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const currentDayNum = today.getDate();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department));
    return ['ALL', ...Array.from(set)];
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, departmentFilter]);

  // Daily coverage statistics (number of workers scheduled per day)
  const dailyCoverage = useMemo(() => {
    return days.map((day) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayRecords = records.filter(
        (r) => r.dateStr === dateStr && r.shiftCode !== 'OFF'
      );
      const dayShifts = dayRecords.filter((r) => r.shiftCode === 'DAY').length;
      const nightShifts = dayRecords.filter((r) => r.shiftCode === 'NIGHT').length;
      const fullShifts = dayRecords.filter((r) => r.shiftCode === 'FULL').length;

      return {
        day,
        total: dayRecords.length,
        dayShifts,
        nightShifts,
        fullShifts,
        isDeficit: dayRecords.length < 2, // warning if less than 2 staff on duty
      };
    });
  }, [days, records, currentYear, currentMonth]);

  return (
    <div className="space-y-4">
      {/* Top Filter & Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Month Navigator */}
        <div className="flex items-center gap-2">
          <WhiteElevatedPill className="py-1 px-2.5">
            <button
              type="button"
              onClick={onPrevMonth}
              title="Предыдущий месяц"
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 min-w-[120px] text-center">
              {MONTH_NAMES_RU[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={onNextMonth}
              title="Следующий месяц"
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </WhiteElevatedPill>

          <FrostedPill onClick={onToday} active={isCurrentMonth}>
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Сегодня</span>
          </FrostedPill>

          <GlassBubbleSphere size={32} label="Свет Liquid Glass" />
        </div>

        {/* Center: Search pill matching reference */}
        <div className="flex-1 max-w-xs">
          <GlassSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск сотрудника..."
          />
        </div>

        {/* Right: Department & Shift Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
            {departments.slice(0, 4).map((dept) => (
              <FrostedPill
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                active={departmentFilter === dept}
              >
                {departmentFilter === dept && <Check className="w-3 h-3 text-teal-600" />}
                <span>{dept === 'ALL' ? 'Все отделы' : dept}</span>
              </FrostedPill>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCompactMode(!compactMode)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/15 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            title="Переключить компактный вид ячеек"
          >
            {compactMode ? 'Стандартный вид' : 'Компактный'}
          </button>
        </div>
      </div>

      {/* Main Schedule Matrix (Liquid Glass Acrylic Table) */}
      <div className="relative rounded-2xl overflow-hidden glass-panel-light dark:glass-panel-dark border border-white/80 dark:border-white/15 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left select-none">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                {/* Employee info header */}
                <th className="sticky left-0 z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md py-3 px-3.5 text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[200px] border-r border-white/60 dark:border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <span>Сотрудник ({filteredEmployees.length})</span>
                    <button
                      type="button"
                      onClick={onOpenEmployeeModal}
                      className="text-purple-600 hover:text-purple-700 text-xs font-semibold cursor-pointer"
                      title="Добавить сотрудника"
                    >
                      + Добавить
                    </button>
                  </div>
                </th>

                {/* Day columns */}
                {days.map((day) => {
                  const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isCurrentDay = isCurrentMonth && day === currentDayNum;

                  return (
                    <th
                      key={day}
                      className={`py-2 px-1 text-center min-w-[38px] transition-colors border-r border-white/40 dark:border-white/5 ${
                        isCurrentDay
                          ? 'bg-purple-500/20 dark:bg-purple-400/20 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/50'
                          : isWeekend
                          ? 'bg-amber-500/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{day}</div>
                      <div className="text-[9px] font-medium opacity-70">
                        {WEEKDAY_NAMES_RU[dayOfWeek]}
                      </div>
                    </th>
                  );
                })}

                {/* Total hours column */}
                <th className="py-3 px-3 text-center text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[80px]">
                  Итого ч.
                </th>
              </tr>
            </thead>

            {/* Table Body (Employees & Shift cells) */}
            <tbody className="divide-y divide-white/40 dark:divide-white/5">
              {filteredEmployees.map((emp) => {
                // Calculate monthly hours for this employee
                const empRecords = records.filter(
                  (r) =>
                    r.employeeId === emp.id &&
                    r.dateStr.startsWith(
                      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
                    )
                );

                const totalHours = empRecords.reduce((acc, r) => {
                  const def = SHIFT_DEFINITIONS[r.shiftCode] || SHIFT_DEFINITIONS.OFF;
                  return acc + (r.customHours !== undefined ? r.customHours : def.hours);
                }, 0);

                const target = emp.monthlyTargetHours || 168;
                const progress = Math.min(Math.round((totalHours / target) * 100), 100);

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group"
                  >
                    {/* Sticky Employee Row Header */}
                    <td className="sticky left-0 z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md py-2.5 px-3.5 border-r border-white/60 dark:border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${emp.avatarColor} shadow-sm shrink-0 flex items-center justify-center text-[10px] font-bold text-white`}
                        >
                          {emp.name.slice(0, 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center justify-between">
                            <span>{emp.role}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {totalHours} / {target} ч
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Mini progress bar under employee card */}
                      <div className="w-full h-1 bg-slate-200/60 dark:bg-slate-700/60 rounded-full mt-1.5 overflow-hidden">
                        <div
                          style={{ width: `${progress}%` }}
                          className={`h-full rounded-full ${
                            progress >= 100 ? 'bg-emerald-500' : 'bg-purple-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Day Cells */}
                    {days.map((day) => {
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const record = records.find(
                        (r) => r.employeeId === emp.id && r.dateStr === dateStr
                      );
                      const shiftCode: ShiftCode = record?.shiftCode || 'OFF';
                      const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const isCurrentDay = isCurrentMonth && day === currentDayNum;

                      return (
                        <td
                          key={day}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            onQuickCycleShift(emp, dateStr);
                          }}
                          className={`p-1 text-center border-r border-white/30 dark:border-white/5 transition-colors cursor-pointer ${
                            isCurrentDay
                              ? 'bg-purple-500/10 dark:bg-purple-400/10'
                              : isWeekend
                              ? 'bg-amber-500/5 dark:bg-amber-400/5'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <ShiftBadge
                              shiftCode={shiftCode}
                              customHours={record?.customHours}
                              isSwap={record?.isSwap}
                              compact={compactMode}
                              onClick={() =>
                                onCellClick(
                                  emp,
                                  dateStr,
                                  shiftCode,
                                  record?.customHours,
                                  record?.note,
                                  record?.isSwap
                                )
                              }
                            />
                          </div>
                        </td>
                      );
                    })}

                    {/* Total Hours Cell */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                        {totalHours} ч
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Daily Coverage Summary Row */}
            <tfoot>
              <tr className="border-t-2 border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/60 backdrop-blur-md">
                <td className="sticky left-0 z-20 bg-white/90 dark:bg-slate-900/95 py-2.5 px-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 border-r border-white/60 dark:border-white/10 shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <span>Сотрудников на смене:</span>
                    <span className="text-[10px] text-slate-500">24/7</span>
                  </div>
                </td>

                {dailyCoverage.map((cov) => (
                  <td
                    key={cov.day}
                    className={`py-2 px-0.5 text-center text-[10px] font-bold border-r border-white/40 dark:border-white/5 ${
                      cov.isDeficit
                        ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                    title={`День ${cov.day}: ${cov.total} чел на смене (Дневная: ${cov.dayShifts}, Ночная: ${cov.nightShifts}, Сутки: ${cov.fullShifts})`}
                  >
                    {cov.total}
                  </td>
                ))}

                <td className="py-2 px-3 text-center text-xs font-bold text-slate-600 dark:text-slate-400">
                  -
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Legend & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/70 dark:border-white/10">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Типы смен:</span>
          {Object.values(SHIFT_DEFINITIONS).map((def) => (
            <div key={def.code} className="flex items-center gap-1.5">
              <ShiftBadge shiftCode={def.code} compact size="sm" />
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                {def.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Авто-заполнение 2/2 или 1/3</span>
          </button>
        </div>
      </div>
    </div>
  );
};
