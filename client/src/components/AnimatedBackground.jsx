import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* 1. Refined Gradient Blobs (Blue / Cyan Theme) */}
      <motion.div
        animate={{
          x: [0, 25, 0, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.06, 0.98, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-brand-500/12 to-cyan-400/8 dark:from-brand-600/15 dark:to-cyan-500/10 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -30, 15, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.96, 1.05, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-cyan-500/10 to-brand-400/8 dark:from-cyan-500/15 dark:to-brand-500/10 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -15, 20, 0],
          scale: [1, 1.04, 0.98, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tr from-brand-600/10 to-sky-400/8 dark:from-brand-700/15 dark:to-sky-500/10 blur-3xl"
      />

      {/* 2. Floating Healthcare Decorative Elements (Medical + & Soft Particles) */}
      {/* Medical Cross 1 */}
      <motion.div
        animate={{
          y: [0, -22, 0],
          rotate: [0, 12, 0],
          opacity: [0.3, 0.65, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 right-[18%] hidden md:block text-brand-400/30 dark:text-cyan-400/20"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
        </svg>
      </motion.div>

      {/* Medical Cross 2 */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -14, 0],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[60%] left-14 hidden lg:block text-cyan-400/25 dark:text-brand-400/20"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
        </svg>
      </motion.div>

      {/* Floating Glowing Particle Dot 1 */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-44 left-[22%] w-2.5 h-2.5 rounded-full bg-cyan-400/40 dark:bg-cyan-300/30 blur-[1px]"
      />

      {/* Floating Glowing Particle Dot 2 */}
      <motion.div
        animate={{
          y: [0, 16, 0],
          x: [0, -12, 0],
          opacity: [0.25, 0.6, 0.25],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-3/4 right-[25%] w-3 h-3 rounded-full bg-brand-400/35 dark:bg-brand-300/30 blur-[1px]"
      />

      {/* Floating Glowing Particle Dot 3 */}
      <motion.div
        animate={{
          y: [0, -14, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/2 right-[10%] w-2 h-2 rounded-full bg-sky-400/40 dark:bg-cyan-400/30 blur-[0.5px]"
      />

      {/* 3. Subtle Clean Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#38bdf805_1px,transparent_1px),linear-gradient(to_bottom,#38bdf805_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
}
