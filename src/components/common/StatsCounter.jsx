import React, { useEffect, useState, useRef } from "react";

/**
 * StatsCounter - Animated Interactive Metrics Section
 * Numbers smoothly count up when entering viewport with glowing tech visuals.
 */
export const StatsCounter = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    projects: 0,
    satisfaction: 0,
    experience: 0,
    engineers: 0,
  });

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts({
              projects: Math.floor(ease * 5),
              satisfaction: +(ease * 99.8).toFixed(1),
              experience: Math.floor(ease * 10),
              engineers: Math.floor(ease * 10),
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const stats = [
    {
      value: `${counts.projects}+`,
      label: "Enterprise Projects Delivered",
      icon: "fas fa-rocket",
      accent: "var(--pt-primary)",
    },
    {
      value: `${counts.satisfaction}%`,
      label: "Client Retention Rate",
      icon: "fas fa-award",
      accent: "var(--pt-accent-cyan)",
    },
    {
      value: `${counts.experience}+`,
      label: "Years Engineering Excellence",
      icon: "fas fa-history",
      accent: "var(--pt-secondary)",
    },
    {
      value: `${counts.engineers}+`,
      label: "Expert Tech Specialists",
      icon: "fas fa-users-cog",
      accent: "#10b981",
    },
  ];

  return (
    <section ref={sectionRef} className="pt-stats-section">
      <div className="container">
        <div className="row g-4 align-items-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-lg-3 col-sm-6">
              <div className="pt-stat-item">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: stat.accent,
                    fontSize: "1.4rem",
                    marginBottom: "16px",
                  }}
                >
                  <i className={stat.icon}></i>
                </div>
                <div className="pt-stat-number">{stat.value}</div>
                <div className="pt-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;

