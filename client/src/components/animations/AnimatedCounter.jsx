import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 1.8 }) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView || !value) return;

    // Parse the value string, e.g. "10K+", "500+", "25K+", "20+"
    const match = String(value).match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(match[1], 10);
    const suffix = match[2] || '';

    let start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Smooth easeOutQuad
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeOut * targetNum);

      setDisplayValue(`${currentVal}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {displayValue}
    </span>
  );
}
