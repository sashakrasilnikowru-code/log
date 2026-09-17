import React from 'react';
import { Employee, ShiftRecord } from '../types';
import { SHIFT_DEFINITIONS, WEEKDAY_NAMES_RU } from '../data/initialData';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { TealJellyButton, PurpleJellyButton, GlassPanel } from './GlassControls';

interface PrintViewProps {
  employees: Employee[];
  records: ShiftRecord[];
  currentYear: number;
  currentMonth: number;
  monthName: string;
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  employees,
  records,
  currentYear,
  currentMonth,
  monthName,
  onBack,
}) => {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['ФИО', 'Должность', 'Отдел', ...days.map((d) => `${d} ${monthName.slice(0, 3)}`), 'Всего часов', 'Смен'];
    const rows = employees.map((emp) => {
      let totalHours = 0;
      let shiftCount = 0;
      const dayValues = days.map((day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = records.find((r) => r.employeeId === emp.id && r.dateStr === dateStr);
        const code = record?.shiftCode || 'OFF';
        const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
        const hours = record?.customHours !== undefined ? record.customHours : def.hours;
        if (code !== 'OFF') {
          totalHours += hours;
          shiftCount++;
          return `${def.shortLabel} (${hours}ч)`;
        }
        return 'В';
      });

      return [
        `"${emp.name}"`,
        `"${emp.role}"`,
        `"${emp.department}"`,
        ...dayValues,
        totalHours,
        shiftCount,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `График_смен_${monthName}_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <GlassPanel className="p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-white/10 hover:bg-white border border-white/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Вернуться к графику</span>
        </button>

        <div className="flex items-center gap-2.5">
          <TealJellyButton onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            <span>Экспорт в Excel (CSV)</span>
          </TealJellyButton>

          <PurpleJellyButton onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            <span>Печать графика (PDF)</span>
          </PurpleJellyButton>
        </div>
      </GlassPanel>

      {/* Printable Sheet */}
      <div className="p-8 bg-white text-slate-900 rounded-2xl shadow-xl print:p-0 print:shadow-none print:rounded-none">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wide">
              График сменности и дежурств персонала
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Период: {monthName} {currentYear} года • ООО "Служба круглосуточного мониторинга"
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold">УТВЕРЖДАЮ:</div>
            <div className="text-slate-600">Руководитель оперативного отдела</div>
            <div className="mt-4 border-b border-slate-400 w-36 ml-auto"></div>
            <div className="text-[10px] text-slate-400 mt-0.5">(подпись / дата)</div>
          </div>
        </div>

        {/* Schedule Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1.5 font-bold w-36">Сотрудник</th>
                <th className="border border-slate-300 p-1.5 font-bold w-24">Должность</th>
                {days.map((day) => {
                  const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  return (
                    <th
                      key={day}
                      className={`border border-slate-300 p-1 text-center font-bold ${
                        isWeekend ? 'bg-amber-100/70 text-amber-950' : ''
                      }`}
                    >
                      <div>{day}</div>
                      <div className="text-[9px] font-normal text-slate-500">
                        {WEEKDAY_NAMES_RU[dayOfWeek]}
                      </div>
                    </th>
                  );
                })}
                <th className="border border-slate-300 p-1.5 text-center font-bold">Часы</th>
                <th className="border border-slate-300 p-1.5 text-center font-bold">Смен</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                let totalHours = 0;
                let shiftCount = 0;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-1.5 font-medium whitespace-nowrap">
                      {emp.name}
                    </td>
                    <td className="border border-slate-300 p-1.5 text-[10px] text-slate-600">
                      {emp.role}
                    </td>
                    {days.map((day) => {
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const record = records.find((r) => r.employeeId === emp.id && r.dateStr === dateStr);
                      const code = record?.shiftCode || 'OFF';
                      const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
                      const hours = record?.customHours !== undefined ? record.customHours : def.hours;

                      if (code !== 'OFF') {
                        totalHours += hours;
                        shiftCount++;
                      }

                      return (
                        <td
                          key={day}
                          className={`border border-slate-300 p-0.5 text-center font-bold ${
                            code === 'DAY'
                              ? 'bg-teal-50 text-teal-800'
                              : code === 'NIGHT'
                              ? 'bg-purple-50 text-purple-800'
                              : code === 'FULL'
                              ? 'bg-amber-50 text-amber-800'
                              : code === 'VACATION'
                              ? 'bg-emerald-50 text-emerald-800'
                              : code === 'SICK'
                              ? 'bg-rose-50 text-rose-800'
                              : 'text-slate-300'
                          }`}
                        >
                          {def.shortLabel}
                        </td>
                      );
                    })}
                    <td className="border border-slate-300 p-1.5 text-center font-bold">
                      {totalHours}
                    </td>
                    <td className="border border-slate-300 p-1.5 text-center">
                      {shiftCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="font-bold text-slate-900">Обозначения:</span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-teal-700">Д</strong> — Дневная смена (08:00–20:00, 11ч)
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-purple-700">Н</strong> — Ночная смена (20:00–08:00, 11ч)
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-amber-700">С</strong> — Суточная смена (24ч)
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-emerald-700">ОТП</strong> — Очередной отпуск
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-rose-700">БОЛ</strong> — Больничный лист
          </span>
          <span className="inline-flex items-center gap-1">
            <strong className="text-slate-500">В</strong> — Выходной день
          </span>
        </div>
      </div>
    </div>
  );
};
