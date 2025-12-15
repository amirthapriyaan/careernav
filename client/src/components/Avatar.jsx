
import React from "react";
import PropTypes from "prop-types";
import "./avatar.css";

export default function Avatar({
  name = "",
  size = 36,
  src = null,
  className = "",
}) {
  const initials = (() => {
    if (src || !name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  const style = {
    width: size,
    height: size,
    fontSize: Math.max(12, Math.floor(size * 0.42)),
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        className={`avatar-img ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`avatar avatar--initials ${className}`}
      style={style}
      aria-hidden
    >
      {initials}
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  src: PropTypes.string,
  className: PropTypes.string,
};
