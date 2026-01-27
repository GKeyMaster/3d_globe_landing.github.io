import { DateTime } from "luxon";
import { START_DATE, UNLOCK_HOUR, UNLOCK_MINUTE, TIMEZONE } from "@/config/valentine";

export function getUnlockDateForDay(dayNumber: number): DateTime {
  return START_DATE.plus({ days: dayNumber - 1 });
}

export function isDayUnlocked(dayNumber: number): boolean {
  const unlockDate = getUnlockDateForDay(dayNumber);
  const now = DateTime.now().setZone(TIMEZONE);
  return now >= unlockDate;
}

export function getCurrentTimeInTimezone(): DateTime {
  return DateTime.now().setZone(TIMEZONE);
}

export function getTimeUntilUnlock(dayNumber: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
} {
  const unlockDate = getUnlockDateForDay(dayNumber);
  const now = DateTime.now().setZone(TIMEZONE);
  
  if (now >= unlockDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isUnlocked: true,
    };
  }

  const diff = unlockDate.diff(now, ["days", "hours", "minutes", "seconds"]);
  
  return {
    days: Math.floor(diff.days),
    hours: Math.floor(diff.hours),
    minutes: Math.floor(diff.minutes),
    seconds: Math.floor(diff.seconds),
    isUnlocked: false,
  };
}

export function formatUnlockTime(dayNumber: number): string {
  const unlockDate = getUnlockDateForDay(dayNumber);
  return unlockDate.toFormat("MMMM d, yyyy 'at' h:mm a ZZZZ");
}

