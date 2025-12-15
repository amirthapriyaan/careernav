// client/src/components/Spinner.jsx
import React from "react";
import "./spinner.css";

export default function Spinner({ size = 26, color = "var(--accent-2)" }) {
  return (
    <div
      className="spinner"
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent ${color} transparent`,
      }}
    />
  );
}
