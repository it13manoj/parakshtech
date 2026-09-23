import React, { useEffect, useState } from "react";

/**
 * CursorGlow - Interactive Ambient Mouse Follower Graphic
 * Casts a subtle neon radial glow behind elements as the user navigates.
 */
export const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on pointer-capable devices (mouse/trackpad, not touch)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rafId;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Smooth lerp animation loop
    const loop = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "480px",
        height: "480px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245, 32, 41, 0.08) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)",
        transform: `translate3d(${pos.x - 240}px, ${pos.y - 240}px, 0)`,
        pointerEvents: "none",
        zIndex: 9998,
        transition: "opacity 0.3s ease",
        filter: "blur(20px)",
      }}
    />
  );
};

export default CursorGlow;

