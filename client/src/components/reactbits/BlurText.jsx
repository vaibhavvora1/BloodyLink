import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function BlurText({
  text = '',
  className = '',
  delay = 0.08,
  duration = 0.5
}) {
  const shouldReduce = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`d-inline-flex flex-wrap gap-2 ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration,
            delay: index * delay,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="d-inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
