import React from 'react';
import { Employee, ShiftRecord } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';
import { GlassPanel, PurpleJellyButton, WhiteElevatedPill } from './GlassControls';
import { Plus, Edit2, Trash2, Phone, Mail, Clock, CreditCard } from 'lucide-react';

interface EmployeeManagerProps {
  employees: Employee[];
  records: ShiftRecord[];
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees,
  records,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Штат сотрудников и специалистов
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Управление персоналом смен, почасовыми ставками и плановой нормой выработки
          </p>
        </div>

        <PurpleJellyButton onClick={onAddEmployee}>
          <Plus className="w-4 h-4" />
          <span>Добавить сотрудника</span>
        </PurpleJellyButton>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => {
          // Calculate total shifts in current records
          const empRecords = records.filter((r) => r.employeeId === emp.id && r.shiftCode !== 'OFF');
          const totalHours = empRecords.reduce((acc, r) => {
            const def = SHIFT_DEFINITIONS[r.shiftCode] || SHIFT_DEFINITIONS.OFF;
            return acc + (r.customHours !== undefined ? r.customHours : def.hours);
          }, 0);

          return (
            <GlassPanel key={emp.id} className="p-5 flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${emp.avatarColor} shadow-md flex items-center justify-center text-white font-extrabold text-base`}
                    >
                      {emp.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {emp.name}
                      </h3>
                      <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                        {emp.role}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {emp.department}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditEmployee(emp)}
                      className="p-1.5 rounded-lg bg-white/60 dark:bg-white/10 hover:bg-white text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Редактировать"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Удалить сотрудника ${emp.name}?`)) {
                          onDeleteEmployee(emp.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/60 dark:bg-white/10 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Pills */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                      Почасовая ставка:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {emp.hourlyRate} ₽/час
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      Норма часов:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {emp.monthlyTargetHours} ч/мес
                    </span>
                  </div>

                  {emp.phone && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1 border-t border-white/40 dark:border-white/5">
                      <Phone className="w-3 h-3" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Note */}
              {emp.notes && (
                <div className="mt-3 p-2 rounded-xl bg-white/40 dark:bg-white/5 text-[11px] text-slate-600 dark:text-slate-300 italic">
                  "{emp.notes}"
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
