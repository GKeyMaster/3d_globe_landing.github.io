"use client";

import { motion } from "framer-motion";

export function SwanLogo({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D6B25E" stopOpacity="1" />
          <stop offset="100%" stopColor="#F1E3B1" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Left Swan */}
      <motion.g
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 1, delay: 0.2 },
          },
        }}
      >
        <motion.path
          d="M 50 100 Q 40 60, 60 50 Q 80 40, 100 50 Q 90 70, 85 90 Q 80 110, 70 120 Q 60 130, 50 120 Z"
          fill="url(#goldGradient)"
          stroke="#D6B25E"
          strokeWidth="2"
          filter="url(#glow)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.5, ease: "easeInOut" },
            },
          }}
        />
        {/* Left Swan neck/head */}
        <motion.path
          d="M 60 50 Q 55 35, 50 25 Q 48 20, 50 15"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1, delay: 0.5, ease: "easeInOut" },
            },
          }}
        />
        <motion.circle
          cx="50"
          cy="15"
          r="4"
          fill="#D6B25E"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, delay: 1.5 },
            },
          }}
        />
      </motion.g>

      {/* Right Swan */}
      <motion.g
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 1, delay: 0.4 },
          },
        }}
      >
        <motion.path
          d="M 150 100 Q 160 60, 140 50 Q 120 40, 100 50 Q 110 70, 115 90 Q 120 110, 130 120 Q 140 130, 150 120 Z"
          fill="url(#goldGradient)"
          stroke="#D6B25E"
          strokeWidth="2"
          filter="url(#glow)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.5, delay: 0.2, ease: "easeInOut" },
            },
          }}
        />
        {/* Right Swan neck/head */}
        <motion.path
          d="M 140 50 Q 145 35, 150 25 Q 152 20, 150 15"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1, delay: 0.7, ease: "easeInOut" },
            },
          }}
        />
        <motion.circle
          cx="150"
          cy="15"
          r="4"
          fill="#D6B25E"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, delay: 1.7 },
            },
          }}
        />
      </motion.g>

      {/* Heart shape formed by swans */}
      <motion.path
        d="M 100 50 Q 70 80, 50 100 Q 50 130, 100 160 Q 150 130, 150 100 Q 130 80, 100 50 Z"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        opacity="0.4"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 0.4,
            transition: { duration: 2, delay: 1, ease: "easeInOut" },
          },
        }}
      />
    </motion.svg>
  );
}

