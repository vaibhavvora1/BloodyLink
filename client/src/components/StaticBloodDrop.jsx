import React from 'react';

export default function StaticBloodDrop({ size = 260 }) {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 18px 24px rgba(179, 18, 43, 0.25))' }}
      >
        <defs>
          <linearGradient id="dropGradient" x1="20" y1="10" x2="80" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="50%" stopColor="#B3122B" />
            <stop offset="100%" stopColor="#6C091A" />
          </linearGradient>
          <radialGradient id="dropGlint" cx="35" cy="35" r="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M50 10 C50 10 20 55 20 80 C20 96.5685 33.4315 110 50 110 C66.5685 110 80 96.5685 80 80 C80 55 50 10 50 10 Z"
          fill="url(#dropGradient)"
        />
        <ellipse cx="38" cy="65" rx="8" ry="16" transform="rotate(-25 38 65)" fill="url(#dropGlint)" />
      </svg>
    </div>
  );
}
