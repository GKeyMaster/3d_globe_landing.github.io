"use client";

import { motion } from "framer-motion";
import { DayCard } from "./DayCard";
import { daysData } from "@/data/days";

export function DayGrid() {
  return (
    <div className="py-10 md:py-16 lg:py-20">
      <motion.h2
        className="font-heading text-3xl md:text-4xl lg:text-5xl text-center text-white mb-3 md:mb-4 leading-tight tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        The Journey
      </motion.h2>
      <motion.p
        className="font-body text-center text-soft-gold/80 mb-10 md:mb-12 text-base md:text-lg leading-relaxed tracking-normal px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        15 days of love, memories, and moments
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 md:px-6 items-stretch">
        {daysData.map((day, index) => (
          <DayCard key={day.dayNumber} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

