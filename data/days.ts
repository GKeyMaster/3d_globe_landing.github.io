import { DateTime } from "luxon";
import { START_DATE, UNLOCK_HOUR, UNLOCK_MINUTE, TIMEZONE } from "@/config/valentine";

export type DayItem =
  | { type: "text"; value: string }
  | { type: "image"; src: string; alt: string }
  | { type: "audio"; src: string; label: string }
  | { type: "song"; title: string; artist: string; link?: string };

export interface DayData {
  dayNumber: number;
  dateISO: string;
  title: string;
  subtitle: string;
  items: DayItem[];
}

function getUnlockDate(dayNumber: number): DateTime {
  return START_DATE.plus({ days: dayNumber - 1 });
}

function getPlaceholderImage(seed: number): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${((seed * 7) % 256).toString(16).padStart(2, '0')}${((seed * 11) % 256).toString(16).padStart(2, '0')}${((seed * 13) % 256).toString(16).padStart(2, '0')};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${((seed * 17) % 256).toString(16).padStart(2, '0')}${((seed * 19) % 256).toString(16).padStart(2, '0')}${((seed * 23) % 256).toString(16).padStart(2, '0')};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad${seed})" opacity="0.3"/>
      <circle cx="200" cy="200" r="80" fill="none" stroke="#D6B25E" stroke-width="2" opacity="0.5"/>
    </svg>`
  )}`;
}

export const daysData: DayData[] = [
  {
    dayNumber: 1,
    dateISO: getUnlockDate(1).toISODate()!,
    title: "Reasons I Love You",
    subtitle: "Forty-four beautiful reasons",
    items: Array.from({ length: 44 }, (_, i) => ({
      type: "text" as const,
      value: `Reason ${i + 1}: Your smile lights up my world in ways words cannot capture.`,
    })),
  },
  {
    dayNumber: 2,
    dateISO: getUnlockDate(2).toISODate()!,
    title: "33 Reasons Why You're Different",
    subtitle: "What makes you uniquely you",
    items: Array.from({ length: 33 }, (_, i) => ({
      type: "text" as const,
      value: `Reason ${i + 1}: The way you see the world is unlike anyone else I've ever known.`,
    })),
  },
  {
    dayNumber: 3,
    dateISO: getUnlockDate(3).toISODate()!,
    title: "Things That Make Me Smile",
    subtitle: "Moments and memories",
    items: [
      ...Array.from({ length: 20 }, (_, i) => ({
        type: "text" as const,
        value: `Memory ${i + 1}: That time we laughed until we cried.`,
      })),
      ...Array.from({ length: 6 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(300 + i),
        alt: `Photo memory ${i + 1}`,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        type: "audio" as const,
        src: "#",
        label: `Voice message ${i + 1}`,
      })),
    ],
  },
  {
    dayNumber: 4,
    dateISO: getUnlockDate(4).toISODate()!,
    title: "Pictures That Remind Me of You",
    subtitle: "A visual journey of us",
    items: Array.from({ length: 36 }, (_, i) => ({
      type: "image" as const,
      src: getPlaceholderImage(400 + i),
      alt: `Photo ${i + 1}`,
    })),
  },

  {
    dayNumber: 5,
    dateISO: getUnlockDate(5).toISODate()!,
    title: "Songs That Remind Me of Us",
    subtitle: "Our soundtrack",
    items: [
      ...Array.from({ length: 20 }, (_, i) => ({
        type: "song" as const,
        title: `Song ${i + 1}`,
        artist: "Artist Name",
        link: "#",
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        type: "text" as const,
        value: `Why this song matters: Memory ${i + 1}`,
      })),
    ],
  },

  {
    dayNumber: 6,
    dateISO: getUnlockDate(6).toISODate()!,
    title: "Dreams We Share",
    subtitle: "Our future together",
    items: [
      ...Array.from({ length: 15 }, (_, i) => ({
        type: "text" as const,
        value: `Dream ${i + 1}: A beautiful future we'll build together.`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(500 + i),
        alt: `Dream visualization ${i + 1}`,
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        type: "audio" as const,
        src: "#",
        label: `Voice note ${i + 1}`,
      })),
    ],
  },

  {
    dayNumber: 7,
    dateISO: getUnlockDate(7).toISODate()!,
    title: "Moments That Defined Us",
    subtitle: "Turning points in our story",
    items: [
      ...Array.from({ length: 20 }, (_, i) => ({
        type: "text" as const,
        value: `Moment ${i + 1}: A moment that changed everything.`,
      })),
      ...Array.from({ length: 11 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(600 + i),
        alt: `Moment ${i + 1}`,
      })),
    ],
  },

  {
    dayNumber: 8,
    dateISO: getUnlockDate(8).toISODate()!,
    title: "Things I Want to Tell You",
    subtitle: "Words from my heart",
    items: Array.from({ length: 29 }, (_, i) => ({
      type: "text" as const,
      value: `Thought ${i + 1}: Something I've been meaning to say.`,
    })),
  },

  {
    dayNumber: 9,
    dateISO: getUnlockDate(9).toISODate()!,
    title: "Our Visual Story",
    subtitle: "Captured moments",
    items: [
      ...Array.from({ length: 20 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(700 + i),
        alt: `Photo ${i + 1}`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        type: "song" as const,
        title: `Song ${i + 1}`,
        artist: "Artist Name",
        link: "#",
      })),
    ],
  },

  {
    dayNumber: 10,
    dateISO: getUnlockDate(10).toISODate()!,
    title: "Voice Messages from My Heart",
    subtitle: "Hear my words",
    items: [
      ...Array.from({ length: 20 }, (_, i) => ({
        type: "text" as const,
        value: `Message ${i + 1}: Words that come from deep within.`,
      })),
      ...Array.from({ length: 11 }, (_, i) => ({
        type: "audio" as const,
        src: "#",
        label: `Voice message ${i + 1}`,
      })),
    ],
  },

  {
    dayNumber: 11,
    dateISO: getUnlockDate(11).toISODate()!,
    title: "Places We'll Go",
    subtitle: "Adventures ahead",
    items: [
      ...Array.from({ length: 15 }, (_, i) => ({
        type: "text" as const,
        value: `Place ${i + 1}: A destination we'll explore together.`,
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(800 + i),
        alt: `Destination ${i + 1}`,
      })),
    ],
  },

  {
    dayNumber: 12,
    dateISO: getUnlockDate(12).toISODate()!,
    title: "Promises I Make to You",
    subtitle: "Commitments from my soul",
    items: Array.from({ length: 29 }, (_, i) => ({
      type: "text" as const,
      value: `Promise ${i + 1}: A promise I'll keep forever.`,
    })),
  },

  {
    dayNumber: 13,
    dateISO: getUnlockDate(13).toISODate()!,
    title: "Gratitude for You",
    subtitle: "Thankful moments",
    items: [
      ...Array.from({ length: 18 }, (_, i) => ({
        type: "text" as const,
        value: `Gratitude ${i + 1}: Something I'm endlessly grateful for.`,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(900 + i),
        alt: `Grateful moment ${i + 1}`,
      })),
    ],
  },

  {
    dayNumber: 14,
    dateISO: getUnlockDate(14).toISODate()!,
    title: "Almost There",
    subtitle: "The final day before",
    items: [
      ...Array.from({ length: 20 }, (_, i) => ({
        type: "text" as const,
        value: `Reflection ${i + 1}: Thoughts as we approach this special day.`,
      })),
      ...Array.from({ length: 7 }, (_, i) => ({
        type: "image" as const,
        src: getPlaceholderImage(1000 + i),
        alt: `Final memory ${i + 1}`,
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        type: "song" as const,
        title: `Special song ${i + 1}`,
        artist: "Artist Name",
        link: "#",
      })),
    ],
  },

  {
    dayNumber: 15,
    dateISO: getUnlockDate(15).toISODate()!,
    title: "The Final Reveal",
    subtitle: "Happy Valentine's Day",
    items: [
      {
        type: "text" as const,
        value: "This is the most special day. You mean everything to me. Happy Valentine's Day, my love. ❤️",
      },
    ],
  },
];

const totalItems = daysData.reduce((sum, day) => sum + day.items.length, 0);
if (totalItems !== 444) {
  console.warn(`Expected 444 items, but found ${totalItems}`);
}

