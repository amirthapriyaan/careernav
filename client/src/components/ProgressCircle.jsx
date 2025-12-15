import React from "react";

export default function ProgressCircle({ size = 100, value = 0 }) {
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(100, value));
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle
          r={radius}
          cx="0"
          cy="0"
          fill="none"
          stroke="#eee"
          strokeWidth="6"
        />
        <circle
          r={radius}
          cx="0"
          cy="0"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize={size / 6}
          fontWeight="600"
          fill="#111"
          color="white"
        >
          {percent}%
        </text>
      </g>
    </svg>
  );
}
