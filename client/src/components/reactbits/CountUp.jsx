import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CountUp({
  to = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [count, setCount] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) {
      setCount(to);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const currentVal = Math.floor(easeOutQuad * to);

      setCount(currentVal);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(to);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [to, duration, shouldReduce]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
