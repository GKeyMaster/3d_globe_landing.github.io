import { DateTime } from "luxon";

export const UNLOCK_HOUR = 4;
export const UNLOCK_MINUTE = 44;
export const TIMEZONE = "America/New_York";

export const START_DATE = DateTime.fromObject(
  {
    year: 2026,
    month: 1,
    day: 31,
    hour: UNLOCK_HOUR,
    minute: UNLOCK_MINUTE,
  },
  { zone: TIMEZONE }
);

export const END_DATE = DateTime.fromObject(
  {
    year: 2026,
    month: 2,
    day: 14,
    hour: UNLOCK_HOUR,
    minute: UNLOCK_MINUTE,
  },
  { zone: TIMEZONE }
);

export const TARGET_COUNTDOWN_DATETIME = END_DATE;

export const TOTAL_DAYS = 15;

