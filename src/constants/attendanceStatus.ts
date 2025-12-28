export const ATTENDANCE_STATUS = {
  ABSENT: 'absent',
  PRESENT: 'present',
} as const;

export type AttendanceStatus = 'absent' | 'present';

export const ATTENDANCE_STATUS_VALUES = ['absent', 'present'];
