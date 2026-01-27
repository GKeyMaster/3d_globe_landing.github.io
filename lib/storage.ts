const STORAGE_KEY = "valentine-revealed-days";

export function getRevealedDays(): Set<number> {
  if (typeof window === "undefined") return new Set();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const parsed = JSON.parse(stored) as number[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export function setDayRevealed(dayNumber: number): void {
  if (typeof window === "undefined") return;
  
  try {
    const revealed = getRevealedDays();
    revealed.add(dayNumber);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(revealed)));
  } catch {
    // Ignore storage errors
  }
}

export function isDayRevealed(dayNumber: number): boolean {
  return getRevealedDays().has(dayNumber);
}

