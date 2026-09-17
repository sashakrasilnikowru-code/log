import React, { useState } from 'react';
import { X, UserPlus, UserCheck, Trash2 } from 'lucide-react';
import { Employee } from '../types';
import { PurpleJellyButton, GlassPanel } from './GlassControls';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
  onSave: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
}

const AVATAR_GRADIENTS = [
  'from-purple-500 to-indigo-600',
  'from-teal-400 to-emerald-600',
  'from-amber-400 to-orange-500',
  'from-pink-500 to-rose-600',
  'from-blue-500 to-cyan-600',
  'from-fuchsia-500 to-purple-600',
  'from-emerald-400 to-teal-600',
  'from-violet-500 to-fuchsia-500',
];

const DEPARTMENTS = [
  'Оперативный отдел',
  'Техподдержка 24/7',
  'Сетевой центр',
  'Управление сервисом',
  'Охрана и безопасность',
  'Складской комплекс',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [hourlyRate, setHourlyRate] = useState<number>(450);
  const [monthlyTargetHours, setMonthlyTargetHours] = useState<number>(168);
  const [phone, setPhone] = useState('+7 ');
  const [email, setEmail] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_GRADIENTS[0]);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setRole(employeeToEdit.role);
      setDepartment(employeeToEdit.department);
      setHourlyRate(employeeToEdit.hourlyRate);
      setMonthlyTargetHours(employeeToEdit.monthlyTargetHours);
      setPhone(employeeToEdit.phone);
      setEmail(employeeToEdit.email);
      setAvatarColor(employeeToEdit.avatarColor);
      setNotes(employeeToEdit.notes || '');
    } else {
      setName('');
      setRole('Дежурный специалист');
      setDepartment(DEPARTMENTS[0]);
      setHourlyRate(450);
      setMonthlyTargetHours(168);
      setPhone('+7 ');
      setEmail('');
      setAvatarColor(AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)]);
      setNotes('');
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newOrUpdated: Employee = {
      id: employeeToEdit ? employeeToEdit.id : `emp-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Специалист',
      department,
      hourlyRate: Number(hourlyRate) || 400,
      monthlyTargetHours: Number(monthlyTargetHours) || 168,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@shiftflow.ru`,
      avatarColor,
      notes: notes.trim(),
    };

    onSave(newOrUpdated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg">
        <GlassPanel variant="holo" className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/60 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/30">
                {employeeToEdit ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {employeeToEdit ? 'Редактировать сотрудника' : 'Новый сотрудник'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Параметры смены, почасовая ставка и норма часов
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

          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ФИО сотрудника *
              </label>
              <input
                type="text"
                required
                placeholder="Иванов Иван Иванович"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Role & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Должность
                </label>
                <input
                  type="text"
                  placeholder="Старший дежурный"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Отдел / Подразделение
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rates & Monthly Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ставка в час (₽/час)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Норма часов в месяц (норма)
                </label>
                <input
                  type="number"
                  min="40"
                  max="300"
                  value={monthlyTargetHours}
                  onChange={(e) => setMonthlyTargetHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-white/15 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Color Avatar Tag */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Цветовой маркер профиля:
              </label>
              <div className="flex items-center gap-2">
                {AVATAR_GRADIENTS.map((grad, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarColor(grad)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} transition-all duration-150 cursor-pointer ${
                      avatarColor === grad
                        ? 'ring-3 ring-offset-2 ring-purple-500 scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-3 border-t border-white/60 dark:border-white/10 flex items-center justify-between">
              {employeeToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Удалить сотрудника ${employeeToEdit.name}?`)) {
                      onDelete(employeeToEdit.id);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Удалить</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <PurpleJellyButton onClick={() => {}}>
                  {employeeToEdit ? 'Сохранить' : 'Добавить'}
                </PurpleJellyButton>
              </div>
            </div>
          </form>
        </GlassPanel>
      </div>
    </div>
  );
};
