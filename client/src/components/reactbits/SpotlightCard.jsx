import React, { useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(179, 18, 43, 0.08)'
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, opacity: 0 });
  const shouldReduce = useReducedMotion();

  const handleMouseMove = (e) => {
    if (shouldReduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`premium-card position-relative overflow-hidden ${className}`}
    >
      {!shouldReduce && (
        <div
          className="position-absolute pointer-events-none"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
            opacity: position.opacity,
            transition: 'opacity 250ms ease'
          }}
          aria-hidden="true"
        />
      )}
      <div className="position-relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
