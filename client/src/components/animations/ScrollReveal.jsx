import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 25,
  duration = 0.5,
  once = true,
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance };
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
