import React, { useEffect, useRef } from "react";

/**
 * CursorGlow - High-Performance Interactive Ambient Mouse Follower
 * Uses direct DOM transforms (Zero React re-renders) and is 100% disabled
 * on touch/mobile devices to prevent touch scroll interference.
 */
export const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    // Completely disable on mobile and touch-only devices
    if (
      typeof window === "undefined" ||
      window.innerWidth < 1024 ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches
    ) {
      return;
    }

    const glowEl = glowRef.current;
    if (!glowEl) return;

    let rafId = null;
    let targetX = -300;
    let targetY = -300;
    let currentX = -300;
    let currentY = -300;
    let isMoving = false;

    const loop = () => {
      // Lerp movement
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (glowEl) {
        glowEl.style.transform = `translate3d(${currentX - 240}px, ${currentY - 240}px, 0)`;
      }

      // Stop loop if practically reached destination to save CPU
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        rafId = requestAnimationFrame(loop);
      } else {
        isMoving = false;
      }
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (glowEl) {
        glowEl.style.opacity = "1";
      }
      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const handleMouseLeave = () => {
      if (glowEl) {
        glowEl.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Return null on touch/mobile devices
  if (
    typeof window !== "undefined" &&
    (window.innerWidth < 1024 || window.matchMedia("(hover: none), (pointer: coarse)").matches)
  ) {
    return null;
  }

  return (
    <div
      ref={glowRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "480px",
        height: "480px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(245, 32, 41, 0.08) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)",
        transform: "translate3d(-300px, -300px, 0)",
        pointerEvents: "none",
        zIndex: 9998,
        opacity: 0,
        transition: "opacity 0.4s ease",
        filter: "blur(20px)",
        willChange: "transform",
      }}
    />
  );
};

export default CursorGlow;

