"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { TARGET_COUNTDOWN_DATETIME, TIMEZONE } from "@/config/valentine";

export function CountdownHero() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = DateTime.now().setZone(TIMEZONE);
      const target = TARGET_COUNTDOWN_DATETIME;
      
      if (now >= target) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diff = target.diff(now, ["days", "hours", "minutes", "seconds"]);
      setTimeLeft({
        days: Math.floor(diff.days),
        hours: Math.floor(diff.hours),
        minutes: Math.floor(diff.minutes),
        seconds: Math.floor(diff.seconds),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) {
    return (
      <div className="text-center py-20">
        <div className="text-gold font-heading text-2xl">Loading...</div>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="text-center py-6 md:py-8 lg:py-10">
      <motion.h1
        className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-2 md:mb-3 leading-tight tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Until Valentine&apos;s Day
      </motion.h1>
      <motion.p
        className="font-body text-soft-gold text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        February 14, 2026 at 4:44 AM EST
      </motion.p>

      <div className="flex flex-wrap justify-center gap-3 md:gap-6 lg:gap-8">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 blur-xl rounded-lg" />
              <div className="relative bg-near-black border border-gold/30 rounded-lg px-5 py-3 md:px-7 md:py-5 lg:px-8 lg:py-6 min-w-[70px] md:min-w-[90px] lg:min-w-[100px]">
                <motion.div
                  key={unit.value}
                  className="font-heading text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-gold leading-none tracking-tight"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.div>
              </div>
            </div>
            <div className="mt-2 md:mt-3 font-body text-xs md:text-sm lg:text-base text-soft-gold/80 uppercase tracking-wide">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

