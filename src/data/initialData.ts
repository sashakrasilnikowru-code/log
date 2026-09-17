import { Employee, ShiftDefinition, ShiftRecord } from '../types';

export const SHIFT_DEFINITIONS: Record<string, ShiftDefinition> = {
  DAY: {
    code: 'DAY',
    name: 'Дневная смена',
    shortLabel: 'Д',
    badgeText: 'ДЕНЬ',
    startTime: '08:00',
    endTime: '20:00',
    hours: 11, // 12h minus 1h break
    rateMultiplier: 1.0,
    bgClassLight: 'pill-teal text-white',
    bgClassDark: 'pill-teal text-white',
    textClassLight: 'text-teal-900',
    textClassDark: 'text-teal-200',
    borderClassLight: 'border-teal-300/80',
    borderClassDark: 'border-teal-500/40',
    shadowStyle: 'shadow-[0_4px_14px_rgba(20,184,166,0.35)]',
    iconName: 'Sun',
  },
  NIGHT: {
    code: 'NIGHT',
    name: 'Ночная смена',
    shortLabel: 'Н',
    badgeText: 'НОЧЬ',
    startTime: '20:00',
    endTime: '08:00',
    hours: 11,
    rateMultiplier: 1.2, // 20% night bonus
    bgClassLight: 'pill-purple text-white',
    bgClassDark: 'pill-purple text-white',
    textClassLight: 'text-purple-900',
    textClassDark: 'text-purple-200',
    borderClassLight: 'border-purple-300/80',
    borderClassDark: 'border-purple-500/40',
    shadowStyle: 'shadow-[0_4px_14px_rgba(124,58,237,0.35)]',
    iconName: 'Moon',
  },
  FULL: {
    code: 'FULL',
    name: 'Сутки (24ч)',
    shortLabel: 'С',
    badgeText: '24Ч',
    startTime: '08:00',
    endTime: '08:00',
    hours: 22, // 24h minus 2h breaks
    rateMultiplier: 1.3,
    bgClassLight: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_4px_14px_rgba(245,158,11,0.4),inset_0_2px_2px_rgba(255,255,255,0.7)]',
    bgClassDark: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_4px_14px_rgba(245,158,11,0.5),inset_0_2px_2px_rgba(255,255,255,0.4)]',
    textClassLight: 'text-amber-900',
    textClassDark: 'text-amber-200',
    borderClassLight: 'border-amber-300/80',
    borderClassDark: 'border-amber-500/40',
    shadowStyle: 'shadow-[0_4px_14px_rgba(245,158,11,0.35)]',
    iconName: 'Clock',
  },
  MORNING: {
    code: 'MORNING',
    name: 'Утренняя',
    shortLabel: 'У',
    badgeText: 'УТРО',
    startTime: '08:00',
    endTime: '16:00',
    hours: 8,
    rateMultiplier: 1.0,
    bgClassLight: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-[0_4px_12px_rgba(14,165,233,0.35),inset_0_2px_2px_rgba(255,255,255,0.7)]',
    bgClassDark: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_4px_12px_rgba(14,165,233,0.4),inset_0_2px_2px_rgba(255,255,255,0.4)]',
    textClassLight: 'text-sky-900',
    textClassDark: 'text-sky-200',
    borderClassLight: 'border-sky-300/80',
    borderClassDark: 'border-sky-500/40',
    shadowStyle: 'shadow-[0_4px_12px_rgba(14,165,233,0.3)]',
    iconName: 'Sunrise',
  },
  EVENING: {
    code: 'EVENING',
    name: 'Вечерняя',
    shortLabel: 'В',
    badgeText: 'ВЕЧЕР',
    startTime: '16:00',
    endTime: '00:00',
    hours: 8,
    rateMultiplier: 1.1,
    bgClassLight: 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35),inset_0_2px_2px_rgba(255,255,255,0.7)]',
    bgClassDark: 'bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-[0_4px_12px_rgba(99,102,241,0.4),inset_0_2px_2px_rgba(255,255,255,0.4)]',
    textClassLight: 'text-indigo-900',
    textClassDark: 'text-indigo-200',
    borderClassLight: 'border-indigo-300/80',
    borderClassDark: 'border-indigo-500/40',
    shadowStyle: 'shadow-[0_4px_12px_rgba(99,102,241,0.3)]',
    iconName: 'Sunset',
  },
  OFF: {
    code: 'OFF',
    name: 'Выходной',
    shortLabel: 'ВЫХ',
    badgeText: 'ВЫХ',
    startTime: '-',
    endTime: '-',
    hours: 0,
    rateMultiplier: 0,
    bgClassLight: 'bg-white/40 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-white/10 shadow-[0_2px_4px_rgba(0,0,0,0.03)]',
    bgClassDark: 'bg-white/5 text-slate-500 border border-white/10 shadow-[0_2px_4px_rgba(0,0,0,0.3)]',
    textClassLight: 'text-slate-400',
    textClassDark: 'text-slate-500',
    borderClassLight: 'border-slate-200',
    borderClassDark: 'border-slate-700',
    shadowStyle: 'none',
    iconName: 'Coffee',
  },
  VACATION: {
    code: 'VACATION',
    name: 'Отпуск',
    shortLabel: 'ОТП',
    badgeText: 'ОТПУСК',
    startTime: '-',
    endTime: '-',
    hours: 8,
    rateMultiplier: 1.0,
    bgClassLight: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.35),inset_0_2px_2px_rgba(255,255,255,0.7)]',
    bgClassDark: 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-[0_4px_12px_rgba(16,185,129,0.4),inset_0_2px_2px_rgba(255,255,255,0.4)]',
    textClassLight: 'text-emerald-900',
    textClassDark: 'text-emerald-200',
    borderClassLight: 'border-emerald-300/80',
    borderClassDark: 'border-emerald-500/40',
    shadowStyle: 'shadow-[0_4px_12px_rgba(16,185,129,0.3)]',
    iconName: 'Palmtree',
  },
  SICK: {
    code: 'SICK',
    name: 'Больничный',
    shortLabel: 'БОЛ',
    badgeText: 'БОЛЬН',
    startTime: '-',
    endTime: '-',
    hours: 0,
    rateMultiplier: 0.8,
    bgClassLight: 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-[0_4px_12px_rgba(244,63,94,0.35),inset_0_2px_2px_rgba(255,255,255,0.7)]',
    bgClassDark: 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-[0_4px_12px_rgba(244,63,94,0.4),inset_0_2px_2px_rgba(255,255,255,0.4)]',
    textClassLight: 'text-rose-900',
    textClassDark: 'text-rose-200',
    borderClassLight: 'border-rose-300/80',
    borderClassDark: 'border-rose-500/40',
    shadowStyle: 'shadow-[0_4px_12px_rgba(244,63,94,0.3)]',
    iconName: 'Activity',
  },
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Александр Смирнов',
    role: 'Старший дежурный',
    department: 'Оперативный отдел',
    hourlyRate: 520,
    avatarColor: 'from-purple-500 to-indigo-600',
    phone: '+7 (916) 244-18-90',
    email: 'smirnov.a@shiftflow.ru',
    monthlyTargetHours: 168,
    notes: 'Ответственный за смену №1',
  },
  {
    id: 'emp-2',
    name: 'Елена Васильева',
    role: 'Диспетчер мониторинга',
    department: 'Оперативный отдел',
    hourlyRate: 460,
    avatarColor: 'from-teal-400 to-emerald-600',
    phone: '+7 (925) 311-89-45',
    email: 'vasilieva.e@shiftflow.ru',
    monthlyTargetHours: 168,
    notes: 'Предпочитает дневные смены',
  },
  {
    id: 'emp-3',
    name: 'Михаил Кузнецов',
    role: 'Дежурный инженер',
    department: 'Техподдержка 24/7',
    hourlyRate: 500,
    avatarColor: 'from-amber-400 to-orange-500',
    phone: '+7 (903) 782-55-12',
    email: 'kuznetsov.m@shiftflow.ru',
    monthlyTargetHours: 160,
    notes: 'Смена 1/3 (сутки)',
  },
  {
    id: 'emp-4',
    name: 'Анна Морозова',
    role: 'Оператор техподдержки',
    department: 'Техподдержка 24/7',
    hourlyRate: 420,
    avatarColor: 'from-pink-500 to-rose-600',
    phone: '+7 (985) 901-34-78',
    email: 'morozova.a@shiftflow.ru',
    monthlyTargetHours: 160,
    notes: 'Смена 2/2',
  },
  {
    id: 'emp-5',
    name: 'Дмитрий Соколов',
    role: 'Инженер сетей',
    department: 'Сетевой центр',
    hourlyRate: 540,
    avatarColor: 'from-blue-500 to-cyan-600',
    phone: '+7 (916) 433-21-99',
    email: 'sokolov.d@shiftflow.ru',
    monthlyTargetHours: 168,
    notes: 'Ночные смены без ограничений',
  },
  {
    id: 'emp-6',
    name: 'Ольга Федорова',
    role: 'Специалист контроля',
    department: 'Оперативный отдел',
    hourlyRate: 440,
    avatarColor: 'from-fuchsia-500 to-purple-600',
    phone: '+7 (926) 777-12-30',
    email: 'fedorova.o@shiftflow.ru',
    monthlyTargetHours: 160,
    notes: 'График 2 через 2',
  },
  {
    id: 'emp-7',
    name: 'Иван Попов',
    role: 'Младший оператор',
    department: 'Техподдержка 24/7',
    hourlyRate: 380,
    avatarColor: 'from-emerald-400 to-teal-600',
    phone: '+7 (999) 812-40-55',
    email: 'popov.i@shiftflow.ru',
    monthlyTargetHours: 152,
    notes: 'Стажёр',
  },
  {
    id: 'emp-8',
    name: 'Мария Лебедева',
    role: 'Координатор смен',
    department: 'Управление сервисом',
    hourlyRate: 490,
    avatarColor: 'from-violet-500 to-fuchsia-500',
    phone: '+7 (905) 554-32-11',
    email: 'lebedeva.m@shiftflow.ru',
    monthlyTargetHours: 168,
    notes: 'График 5/2',
  },
];

// Generate seed schedule for a given year & month
export function generateInitialSchedule(year: number, month: number): ShiftRecord[] {
  const records: ShiftRecord[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  INITIAL_EMPLOYEES.forEach((emp, empIndex) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(year, month, day).getDay(); // 0 is Sunday, 6 is Saturday

      let shiftCode: ShiftDefinition['code'] = 'OFF';

      if (emp.id === 'emp-8') {
        // 5/2 schedule
        shiftCode = (dayOfWeek === 0 || dayOfWeek === 6) ? 'OFF' : 'MORNING';
      } else if (emp.id === 'emp-3') {
        // 1/3 сутки через трое
        const cycle = (day + empIndex * 2) % 4;
        shiftCode = cycle === 0 ? 'FULL' : 'OFF';
      } else {
        // 2/2 cycle: Day, Night, Off, Off
        const cycle = (day + empIndex * 3) % 4;
        if (cycle === 0) shiftCode = 'DAY';
        else if (cycle === 1) shiftCode = 'NIGHT';
        else shiftCode = 'OFF';

        // Add 1 vacation / sick leave for realism
        if (emp.id === 'emp-4' && day >= 10 && day <= 14) {
          shiftCode = 'VACATION';
        }
        if (emp.id === 'emp-7' && day >= 18 && day <= 20) {
          shiftCode = 'SICK';
        }
      }

      records.push({
        id: `rec-${emp.id}-${dateStr}`,
        employeeId: emp.id,
        dateStr,
        shiftCode,
      });
    }
  });

  return records;
}

export const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const WEEKDAY_NAMES_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
export const WEEKDAY_FULL_RU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
