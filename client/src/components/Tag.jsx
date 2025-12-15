import React from "react";
import "../pages/profile.css";

export default function Tag({ text, tone = "neutral" }) {
  const cls = `tag ${tone}`;
  return <span className={cls}>{text}</span>;
}
