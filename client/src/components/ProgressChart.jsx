import React from "react";

export default function ProgressChart({
  data = [],
  width = 320,
  height = 120,
}) {
  const max = 100;
  const gap = 8;
  const safeCount = Math.max(1, data.length);
  const barWidth = Math.floor(width / safeCount) - gap;

  return (
    <svg width={width} height={height}>
      {data.map((item, index) => {
        const barHeight = (item.value / max) * (height - 40);
        const x = index * (barWidth + gap) + 20;
        const y = height - barHeight - 20;

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill="#60a5fa"
            />
            <text
              x={x + barWidth / 2}
              y={height - 6}
              fontSize="10"
              textAnchor="middle"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
