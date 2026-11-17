/** Confirmações aceitas até 27/11/2026 23h59 (Brasília, UTC-3). */
export const ATTENDANCE_DEADLINE_ISO = "2026-11-28T03:00:00.000Z";
export function isAttendanceClosed(now: number = Date.now()) {
  return now >= Date.parse(ATTENDANCE_DEADLINE_ISO);
}
