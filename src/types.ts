export type ShiftCode = 'DAY' | 'NIGHT' | 'FULL' | 'MORNING' | 'EVENING' | 'OFF' | 'VACATION' | 'SICK';

export interface ShiftDefinition {
  code: ShiftCode;
  name: string;
  shortLabel: string;
  badgeText: string;
  startTime: string;
  endTime: string;
  hours: number;
  rateMultiplier: number;
  // Visual classes matching reference
  bgClassLight: string;
  bgClassDark: string;
  textClassLight: string;
  textClassDark: string;
  borderClassLight: string;
  borderClassDark: string;
  shadowStyle: string;
  iconName: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  hourlyRate: number; // in rubles
  avatarColor: string;
  phone: string;
  email: string;
  monthlyTargetHours: number;
  notes?: string;
}

export interface ShiftRecord {
  id: string;
  employeeId: string;
  dateStr: string; // YYYY-MM-DD
  shiftCode: ShiftCode;
  customHours?: number;
  note?: string;
  isSwap?: boolean;
  swappedWithEmployeeId?: string;
}

export type ViewTab = 'schedule' | 'employees' | 'stats' | 'generator' | 'print';

export type ThemeMode = 'light' | 'dark';

export interface ScheduleFilter {
  department: string;
  searchQuery: string;
  shiftFilter: string;
}

export type GenerationPattern = '2_2' | '1_3' | '1_2' | '5_2' | '4_brigade';
