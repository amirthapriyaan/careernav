import React from "react";

export default function ProgressRing({
  size = 100,
  stroke = 8,
  value = 0,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(100, value));
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle
          r={radius}
          fill="none"
          stroke="#eee"
          strokeWidth={stroke}
        />
        <circle
          r={radius}
          fill="none"
          stroke="#06b6d4"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90)"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize={size / 6}
          fontWeight="600"
        >
          {Math.round(percent)}%
        </text>
      </g>
    </svg>
  );
}
