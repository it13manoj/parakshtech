import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * SmoothScroll - Enterprise Inertial Smooth Scrolling System (powered by Lenis)
 * Delivers silky 60-120Hz momentum scrolling across mouse wheel, trackpad,
 * and devices while preserving native accessibility and anchor navigation.
 */
export const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Detect touch / mobile device
    const isTouchOnly =
      window.innerWidth < 1024 &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    // On mobile touch devices, use native hardware-accelerated GPU scrolling for maximum fluidity
    if (isTouchOnly) {
      window.lenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // When route changes, reset scroll to top
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
