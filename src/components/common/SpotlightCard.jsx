import React, { useRef } from "react";

/**
 * SpotlightCard - Interactive 3D Perspective Tilt & Radial Cursor Spotlight Event
 * Features smooth spring-back on mouse leave and dynamic cursor tracking.
 */
export const SpotlightCard = ({
  children,
  className = "",
  dark = false,
  maxTilt = 7, // Max rotation degrees
  scale = 1.015,
  onClick,
  style = {},
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS variables for radial spotlight
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={cardRef}
      className={`pt-spotlight-card ${dark ? "pt-spotlight-card-dark" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
    >
      <div className="pt-spotlight-card-content">{children}</div>
    </div>
  );
};

export default SpotlightCard;

