import React from 'react';
import { motion } from 'framer-motion';

export default function ECGLine({ className = '', opacity = 0.25, height = 80 }) {
  return (
    <div
      className={`w-full overflow-hidden pointer-events-none select-none relative ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0" />
            <stop offset="20%" stopColor="#0284C7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="ecgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>

          {/* Mask for traveling beam */}
          <mask id="travelingMask">
            <motion.rect
              x="0"
              y="0"
              width="240"
              height="120"
              fill="url(#ecgGlow)"
              animate={{
                x: [-300, 1300],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </mask>
        </defs>

        {/* 1. Base Static Low-Opacity ECG Track */}
        <path
          d="M 0,60 L 180,60 L 200,60 L 215,48 L 225,72 L 235,20 L 248,100 L 258,52 L 268,64 L 278,60 L 480,60 L 500,60 L 515,48 L 525,72 L 535,20 L 548,100 L 558,52 L 568,64 L 578,60 L 780,60 L 800,60 L 815,48 L 825,72 L 835,20 L 848,100 L 858,52 L 868,64 L 878,60 L 1080,60 L 1100,60 L 1115,48 L 1125,72 L 1135,20 L 1148,100 L 1158,52 L 1168,64 L 1178,60 L 1200,60"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-400/20 dark:text-cyan-500/15"
          style={{ opacity }}
        />

        {/* 2. Traveling Glowing ECG Pulse */}
        <path
          d="M 0,60 L 180,60 L 200,60 L 215,48 L 225,72 L 235,20 L 248,100 L 258,52 L 268,64 L 278,60 L 480,60 L 500,60 L 515,48 L 525,72 L 535,20 L 548,100 L 558,52 L 568,64 L 578,60 L 780,60 L 800,60 L 815,48 L 825,72 L 835,20 L 848,100 L 858,52 L 868,64 L 878,60 L 1080,60 L 1100,60 L 1115,48 L 1125,72 L 1135,20 L 1148,100 L 1158,52 L 1168,64 L 1178,60 L 1200,60"
          stroke="url(#ecgGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#travelingMask)"
          className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]"
        />
      </svg>
    </div>
  );
}
