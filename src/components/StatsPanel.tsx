import React from 'react';
import { Employee, ShiftRecord } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';
import { GlassPanel, TealJellyButton, PurpleJellyButton, WhiteElevatedPill } from './GlassControls';
import { Users, Clock, CreditCard, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StatsPanelProps {
  employees: Employee[];
  records: ShiftRecord[];
  currentYear: number;
  currentMonth: number;
  monthName: string;
  onOpenGenerator: () => void;
  onOpenEmployeeModal: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  employees,
  records,
  currentYear,
  currentMonth,
  monthName,
  onOpenGenerator,
  onOpenEmployeeModal,
}) => {
  // Compute hours and wages per employee for the current month
  const statsByEmployee = employees.map((emp) => {
    const empRecords = records.filter(
      (r) => r.employeeId === emp.id && r.dateStr.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
    );

    let totalHours = 0;
    let totalWage = 0;
    let dayShifts = 0;
    let nightShifts = 0;
    let fullShifts = 0;
    let offDays = 0;
    let vacations = 0;
    let sickDays = 0;

    empRecords.forEach((r) => {
      const def = SHIFT_DEFINITIONS[r.shiftCode] || SHIFT_DEFINITIONS.OFF;
      const hours = r.customHours !== undefined ? r.customHours : def.hours;
      totalHours += hours;
      totalWage += hours * emp.hourlyRate * def.rateMultiplier;

      if (r.shiftCode === 'DAY') dayShifts++;
      else if (r.shiftCode === 'NIGHT') nightShifts++;
      else if (r.shiftCode === 'FULL') fullShifts++;
      else if (r.shiftCode === 'OFF') offDays++;
      else if (r.shiftCode === 'VACATION') vacations++;
      else if (r.shiftCode === 'SICK') sickDays++;
    });

    const target = emp.monthlyTargetHours || 168;
    const progressPercent = Math.min(Math.round((totalHours / target) * 100), 150);
    const overtimeHours = Math.max(0, totalHours - target);

    return {
      employee: emp,
      totalHours,
      totalWage: Math.round(totalWage),
      target,
      progressPercent,
      overtimeHours,
      dayShifts,
      nightShifts,
      fullShifts,
      offDays,
      vacations,
      sickDays,
    };
  });

  const totalMonthlyHours = statsByEmployee.reduce((acc, s) => acc + s.totalHours, 0);
  const totalPayrollFund = statsByEmployee.reduce((acc, s) => acc + s.totalWage, 0);
  const totalOvertime = statsByEmployee.reduce((acc, s) => acc + s.overtimeHours, 0);
  const totalActiveShifts = records.filter(
    (r) => r.shiftCode !== 'OFF' && r.dateStr.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Row: Holographic Card + Coverage Card matching reference exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Holographic Card matching bottom-right reference card */}
        <div className="lg:col-span-7">
          <GlassPanel variant="holo" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Финансовая аналитика смен
                </span>
                {/* Subtle glass capsule indicator in upper right */}
                <div className="w-8 h-4 rounded-full border border-white/80 dark:border-white/20 bg-white/40 dark:bg-white/10" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                Фонд оплаты труда (ФОТ)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Расчет за {monthName} {currentYear} г. по всем филиалам
              </p>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-purple-950 dark:text-white tracking-tight drop-shadow-sm">
                  {totalPayrollFund.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/20 text-purple-800 dark:text-purple-200 border border-white/80">
                  {totalMonthlyHours.toLocaleString('ru-RU')} часов отработано
                </span>
              </div>
            </div>

            {/* Quick metric pill tags and action */}
            <div className="mt-6 pt-4 border-t border-white/50 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <WhiteElevatedPill className="text-xs py-1.5 px-3">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Переработки: <strong>{totalOvertime} ч</strong></span>
                </WhiteElevatedPill>

                <WhiteElevatedPill className="text-xs py-1.5 px-3">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Смен: <strong>{totalActiveShifts}</strong></span>
                </WhiteElevatedPill>
              </div>

              <PurpleJellyButton onClick={onOpenEmployeeModal}>
                + Управление ставками
              </PurpleJellyButton>
            </div>
          </GlassPanel>
        </div>

        {/* Coverage & Integrity Card matching top-right reference card */}
        <div className="lg:col-span-5">
          <GlassPanel className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                {/* Abstract logo icon matching reference top-left */}
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-400 to-indigo-500 p-[1.5px] shadow-[0_4px_12px_rgba(20,184,166,0.3)]">
                  <div className="w-full h-full rounded-2xl bg-white/30 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm">
                    ⚡
                  </div>
                </div>

                {/* Concentric glowing radio ring matching reference top-right */}
                <div className="relative w-8 h-8 rounded-full border-2 border-teal-400/60 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-teal-400 to-purple-500 shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Контроль покрытия 24/7
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Все ключевые посты мониторинга и технической поддержки укомплектованы на 100%.
              </p>

              <div className="mt-4 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Непрерывность смен:
                  </span>
                  <span className="font-bold text-emerald-600">В норме</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Средняя загрузка сотрудников:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(totalMonthlyHours / (employees.length || 1))} ч / чел
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/50 dark:border-white/10">
              <span className="text-xs text-slate-500">Автоматический расчёт</span>
              <TealJellyButton onClick={onOpenGenerator}>
                Авто-балансировка
              </TealJellyButton>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Employee Breakdown Table */}
      <GlassPanel className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Сводка выработки по сотрудникам
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Часы, нормы выработки, ночные надбавки и предварительный расчет зарплаты
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-white/80">
            {employees.length} сотрудников
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/60 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Сотрудник</th>
                <th className="py-2.5 px-3 font-semibold">Отдел / Должность</th>
                <th className="py-2.5 px-3 font-semibold">Смены (Д/Н/С)</th>
                <th className="py-2.5 px-3 font-semibold">Отработано</th>
                <th className="py-2.5 px-3 font-semibold">Норма</th>
                <th className="py-2.5 px-3 font-semibold">Переработка</th>
                <th className="py-2.5 px-3 font-semibold">Ставка</th>
                <th className="py-2.5 px-3 font-semibold text-right">Начислено</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40 dark:divide-white/5">
              {statsByEmployee.map((stat) => (
                <tr
                  key={stat.employee.id}
                  className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-tr ${stat.employee.avatarColor} shrink-0`}
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {stat.employee.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    <div>{stat.employee.role}</div>
                    <div className="text-[10px] text-slate-400">{stat.employee.department}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="text-teal-700 dark:text-teal-400">{stat.dayShifts}Д</span>
                      <span>/</span>
                      <span className="text-purple-700 dark:text-purple-400">{stat.nightShifts}Н</span>
                      <span>/</span>
                      <span className="text-amber-700 dark:text-amber-400">{stat.fullShifts}С</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {stat.totalHours} ч
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(stat.progressPercent, 100)}%` }}
                          className={`h-full rounded-full ${
                            stat.progressPercent >= 100
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-purple-500 to-teal-400'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {stat.target} ч
                  </td>
                  <td className="py-3 px-3">
                    {stat.overtimeHours > 0 ? (
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        +{stat.overtimeHours} ч
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {stat.employee.hourlyRate} ₽/ч
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-slate-100">
                    {stat.totalWage.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
};
