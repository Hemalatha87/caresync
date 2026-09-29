import React from 'react';
import { motion } from 'framer-motion';

export default function HeartbeatPulse({ children, className = '', scaleMax = 1.08, duration = 2.4 }) {
  return (
    <motion.div
      animate={{
        scale: [1, scaleMax, 1, scaleMax * 0.98, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.15, 0.3, 0.45, 1],
      }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </motion.div>
  );
}
