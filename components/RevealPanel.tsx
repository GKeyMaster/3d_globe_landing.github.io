"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DayItem } from "@/data/days";
import { isDayRevealed, setDayRevealed } from "@/lib/storage";

interface RevealPanelProps {
  items: DayItem[];
  dayNumber: number;
}

export function RevealPanel({ items, dayNumber }: RevealPanelProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedItems, setRevealedItems] = useState<number[]>([]);

  useEffect(() => {
    if (isDayRevealed(dayNumber)) {
      setIsRevealed(true);
      setRevealedItems(items.map((_, i) => i));
    }
  }, [dayNumber, items]);

  const handleReveal = () => {
    setIsRevealed(true);
    setDayRevealed(dayNumber);

    items.forEach((_, index) => {
      setTimeout(() => {
        setRevealedItems((prev) => [...prev, index]);
      }, index * 50);
    });
  };

  const renderItem = (item: DayItem, index: number) => {
    const isVisible = revealedItems.includes(index);

    switch (item.type) {
      case "text":
        return (
          <motion.div
            key={index}
            className="bg-near-black border border-gold/20 rounded-lg p-6 md:p-8 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-white text-base md:text-lg leading-relaxed tracking-normal">
              {item.value}
            </p>
          </motion.div>
        );

      case "image":
        return (
          <motion.div
            key={index}
            className="mb-4 rounded-lg overflow-hidden border border-gold/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square bg-near-black">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <p className="font-body text-soft-gold/70 text-sm p-4 bg-near-black">
              {item.alt}
            </p>
          </motion.div>
        );

      case "audio":
        return (
          <motion.div
            key={index}
            className="bg-near-black border border-gold/20 rounded-lg p-6 md:p-8 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 tap-target">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-gold"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-white font-medium leading-relaxed">{item.label}</p>
                <p className="font-body text-soft-gold/60 text-sm leading-normal">Audio message</p>
              </div>
            </div>
          </motion.div>
        );

      case "song":
        return (
          <motion.div
            key={index}
            className="bg-near-black border border-gold/20 rounded-lg p-6 md:p-8 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 tap-target">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-gold"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-white font-medium leading-relaxed">{item.title}</p>
                <p className="font-body text-soft-gold/60 text-sm leading-normal">{item.artist}</p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8 md:py-12">
      <AnimatePresence>
        {!isRevealed ? (
          <motion.div
            key="reveal-button"
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.button
              onClick={handleReveal}
              className="relative group px-8 md:px-12 py-5 md:py-6 bg-near-black border-2 border-gold rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black tap-target min-w-[140px]"
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(214, 178, 94, 0.3)" }}
              whileTap={{ scale: 0.97 }}
              aria-label="Reveal today's content"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "linear",
                }}
              />
              <span className="relative font-heading text-xl md:text-2xl lg:text-3xl text-gold z-10 leading-tight tracking-tight">
                Reveal
              </span>
            </motion.button>
            <p className="mt-4 md:mt-5 font-body text-soft-gold/60 text-xs md:text-sm leading-relaxed tracking-normal">
              Tap to reveal today&apos;s content
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="revealed-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto">
              {items.map((item, index) => renderItem(item, index))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

