"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { isDayUnlocked, getTimeUntilUnlock, formatUnlockTime } from "@/lib/unlock";
import { DayData } from "@/data/days";

interface DayCardProps {
  day: DayData;
  index: number;
}

export function DayCard({ day, index }: DayCardProps) {
  const unlocked = isDayUnlocked(day.dayNumber);
  const timeUntil = getTimeUntilUnlock(day.dayNumber);

  const cardContent = (
    <motion.div
      className={`relative group ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={unlocked ? { y: -3, scale: 1.01 } : {}}
      whileTap={unlocked ? { scale: 0.99 } : {}}
      role={unlocked ? "link" : "presentation"}
      aria-label={unlocked ? `View Day ${day.dayNumber}: ${day.title}` : `Day ${day.dayNumber} will unlock soon`}
    >
      <div className={`absolute -inset-0.5 bg-gold/0 ${unlocked ? "group-hover:bg-gold/20" : ""} rounded-lg blur-lg transition-all duration-500 opacity-0 ${unlocked ? "group-hover:opacity-100" : ""}`} />

      <div className={`relative bg-near-black border rounded-lg p-5 md:p-6 lg:p-8 transition-all duration-500 h-full flex flex-col ${
        unlocked 
          ? "border-gold/25 group-hover:border-gold/50 group-hover:shadow-[0_0_15px_rgba(214,178,94,0.15)]" 
          : "border-gold/15"
      }`}>
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="font-heading text-xl md:text-2xl lg:text-3xl text-gold leading-tight tracking-tight">
            Day {day.dayNumber}
          </div>
          <div className="text-lg md:text-xl flex-shrink-0 ml-3">
            {unlocked ? (
              <span className="text-gold inline-block">✨</span>
            ) : (
              <svg
                className="w-5 h-5 text-gold/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>
        </div>

        <h3 className="font-heading text-lg md:text-xl lg:text-2xl text-white mb-2 leading-tight tracking-tight">
          {day.title}
        </h3>

        <p className="font-body text-xs md:text-sm text-soft-gold/70 mb-3 md:mb-4 leading-relaxed">
          {day.subtitle}
        </p>

        <p className="font-body text-xs text-soft-gold/50 mb-4 leading-normal tracking-normal">
          {new Date(day.dateISO).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-auto pt-4 border-t border-gold/10">
          {unlocked ? (
            <p className="font-body text-xs md:text-sm text-gold leading-normal">
              {day.items.length} {day.items.length === 1 ? "item" : "items"}
            </p>
          ) : (
            <div>
              <p className="font-body text-xs text-soft-gold/50 mb-1.5 leading-relaxed tracking-normal">
                Unlocks {formatUnlockTime(day.dayNumber)}
              </p>
              <p className="font-body text-xs text-gold/80 leading-normal tracking-normal">
                {timeUntil.days > 0 && `${timeUntil.days}d `}
                {timeUntil.hours > 0 && `${timeUntil.hours}h `}
                {timeUntil.minutes > 0 && `${timeUntil.minutes}m `}
                remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (unlocked) {
    return (
      <Link href={`/day/${day.dayNumber}`} className="block h-full tap-target">
        {cardContent}
      </Link>
    );
  }

  return <div className="h-full cursor-not-allowed">{cardContent}</div>;
}

