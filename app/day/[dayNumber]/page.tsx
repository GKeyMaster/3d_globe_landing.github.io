"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { daysData } from "@/data/days";
import { isDayUnlocked, getTimeUntilUnlock, formatUnlockTime } from "@/lib/unlock";
import { RevealPanel } from "@/components/RevealPanel";
import { SwanLogo } from "@/components/SwanLogo";
import Link from "next/link";

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const dayNumber = parseInt(params.dayNumber as string, 10);
  const [timeUntil, setTimeUntil] = useState(getTimeUntilUnlock(dayNumber));

  const day = daysData.find((d) => d.dayNumber === dayNumber);
  const unlocked = isDayUnlocked(dayNumber);

  useEffect(() => {
    if (!day) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setTimeUntil(getTimeUntilUnlock(dayNumber));
    }, 1000);

    return () => clearInterval(interval);
  }, [dayNumber, day, router]);

  if (!day) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 md:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 md:mb-10 lg:mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-soft-gold/70 hover:text-gold transition-colors mb-5 md:mb-6 font-body text-sm tap-target leading-relaxed group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
            <SwanLogo className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0" />
            <div>
              <div className="font-heading text-xl md:text-2xl lg:text-4xl text-gold mb-1 md:mb-2 leading-tight tracking-tight">
                Day {day.dayNumber}
              </div>
              <div className="font-body text-soft-gold/60 text-xs md:text-sm leading-normal">
                {new Date(day.dateISO).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-3 md:mb-4 leading-tight tracking-tight">
            {day.title}
          </h1>
          <p className="font-body text-base md:text-lg lg:text-xl text-soft-gold/80 leading-relaxed">
            {day.subtitle}
          </p>
        </header>

        {unlocked ? (
          <RevealPanel items={day.items} dayNumber={day.dayNumber} />
        ) : (
          <motion.div
            className="text-center py-12 md:py-16 lg:py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <svg
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 md:mb-6 text-gold/40"
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
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white mb-3 md:mb-4 leading-tight tracking-tight">
              Coming Soon
            </h2>
            <p className="font-body text-base md:text-lg text-soft-gold/70 mb-6 md:mb-8 leading-relaxed">
              Unlocks {formatUnlockTime(day.dayNumber)}
            </p>
            <div className="bg-near-black border border-gold/20 rounded-lg p-6 md:p-8 max-w-md mx-auto">
              <p className="font-body text-xs md:text-sm text-soft-gold/50 mb-4 md:mb-5 leading-relaxed">
                Unlocks in
              </p>
              <div className="flex justify-center gap-3 md:gap-4">
                {timeUntil.days > 0 && (
                  <div>
                    <div className="font-heading text-2xl md:text-3xl text-gold leading-none tracking-tight">
                      {timeUntil.days}
                    </div>
                    <div className="font-body text-xs text-soft-gold/50 mt-1 leading-normal">days</div>
                  </div>
                )}
                <div>
                  <div className="font-heading text-2xl md:text-3xl text-gold leading-none tracking-tight">
                    {String(timeUntil.hours).padStart(2, "0")}
                  </div>
                  <div className="font-body text-xs text-soft-gold/50 mt-1 leading-normal">hours</div>
                </div>
                <div>
                  <div className="font-heading text-2xl md:text-3xl text-gold leading-none tracking-tight">
                    {String(timeUntil.minutes).padStart(2, "0")}
                  </div>
                  <div className="font-body text-xs text-soft-gold/50 mt-1 leading-normal">minutes</div>
                </div>
                <div>
                  <div className="font-heading text-2xl md:text-3xl text-gold leading-none tracking-tight">
                    {String(timeUntil.seconds).padStart(2, "0")}
                  </div>
                  <div className="font-body text-xs text-soft-gold/50 mt-1 leading-normal">seconds</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

