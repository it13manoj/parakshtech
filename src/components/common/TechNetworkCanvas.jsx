import React, { useEffect, useRef } from "react";

/**
 * TechNetworkCanvas - Interactive Particle & Constellation Graph Canvas
 * Reacts to mouse move, repulsion, and distance-based dynamic linking.
 */
export const TechNetworkCanvas = ({
  className = "pt-canvas-bg",
  particleCount = 65,
  particleColor = "rgba(245, 32, 41, 0.45)",
  secondaryColor = "rgba(99, 102, 241, 0.4)",
  lineColor = "rgba(245, 32, 41, 0.12)",
  maxDistance = 140,
  interactive = true,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const mouse = {
      x: null,
      y: null,
      radius: 160,
    };

    // Responsive resize handler
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse events on parent or canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const targetElement = canvas.parentElement || canvas;
    if (interactive) {
      targetElement.addEventListener("mousemove", handleMouseMove);
      targetElement.addEventListener("mouseleave", handleMouseLeave);
    }

    // Particle object factory
    const particles = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 12000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.2,
        color: i % 3 === 0 ? secondaryColor : particleColor,
      });
    }

    // Main animation loop
    const animate = () => {
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

        // Interactive mouse interaction
        if (interactive && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Gentle repulsive force
            const force = (mouse.radius - dist) / mouse.radius;
            const fx = (dx / dist) * force * 2.5;
            const fy = (dy / dist) * force * 2.5;
            p.x -= fx;
            p.y -= fy;

            // Draw line to mouse
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(245, 32, 41, ${0.3 * (1 - dist / mouse.radius)})`;
            ctx.lineWidth = 0.9;
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

          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${(alpha * 0.25).toFixed(2)})`);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        targetElement.removeEventListener("mousemove", handleMouseMove);
        targetElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [particleCount, particleColor, secondaryColor, lineColor, maxDistance, interactive]);

  return <canvas ref={canvasRef} className={className} />;
};

export default TechNetworkCanvas;

