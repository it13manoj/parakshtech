import React, { useEffect, useRef } from "react";

/**
 * TechNetworkCanvas - High-Performance Particle & Constellation Graph
 * Optimized with:
 * - IntersectionObserver to automatically freeze RAF loop when scrolled out of view
 * - Auto mobile throttling (lightweight particle count, disabled mouse listeners)
 * - Passive listeners to guarantee 100% butter-smooth mobile scrolling
 */
export const TechNetworkCanvas = ({
  className = "pt-canvas-bg",
  particleCount = 50,
  particleColor = "rgba(245, 32, 41, 0.45)",
  secondaryColor = "rgba(99, 102, 241, 0.4)",
  lineColor = "rgba(245, 32, 41, 0.12)",
  maxDistance = 120,
  interactive = true,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(hover: none), (pointer: coarse)").matches);

    // On mobile, drastically reduce workload to preserve 60-120fps touch scrolling
    const effectiveCount = isMobile ? Math.min(16, particleCount) : particleCount;
    const effectiveDistance = isMobile ? 65 : maxDistance;

    let animationFrameId = null;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const mouse = {
      x: null,
      y: null,
      radius: 140,
    };

    // Responsive resize handler with RAF debounce
    let resizeRaf = null;
    const handleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (!canvas || !canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Mouse events only enabled on desktop pointer devices
    const handleMouseMove = (e) => {
      if (isMobile) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const targetElement = canvas.parentElement || canvas;
    if (interactive && !isMobile) {
      targetElement.addEventListener("mousemove", handleMouseMove, { passive: true });
      targetElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // Particle object factory
    const particles = [];
    for (let i = 0; i < effectiveCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.6),
        vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.6),
        radius: Math.random() * 1.8 + 1,
        color: i % 3 === 0 ? secondaryColor : particleColor,
      });
    }

    // Main animation loop
    const animate = () => {
      if (!isVisible) {
        animationFrameId = null;
        return; // Stop animation loop when scrolled offscreen
      }

      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive mouse interaction (Desktop only)
        if (!isMobile && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 2;
            p.y -= (dy / dist) * force * 2;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(245, 32, 41, ${0.25 * (1 - dist / mouse.radius)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect adjacent particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < effectiveDistance) {
            const alpha = 1 - dist / effectiveDistance;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${(alpha * 0.22).toFixed(2)})`);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to freeze canvas when scrolled out of view
    let observer = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", handleResize);
      if (interactive && !isMobile) {
        targetElement.removeEventListener("mousemove", handleMouseMove);
        targetElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [particleCount, particleColor, secondaryColor, lineColor, maxDistance, interactive]);

  return <canvas ref={canvasRef} className={className} style={{ pointerEvents: "none" }} />;
};

export default TechNetworkCanvas;

