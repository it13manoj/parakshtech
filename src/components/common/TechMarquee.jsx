import React from "react";

/**
 * TechMarquee - Infinite Animated Tech Stack Ribbon
 * Seamlessly loops modern enterprise technologies with glowing badges.
 */
export const TechMarquee = () => {
  const techStack = [
    { name: "React 19", icon: "fab fa-react", color: "#61dafb" },
    { name: "Next.js", icon: "fas fa-layer-group", color: "#ffffff" },
    { name: "TypeScript", icon: "fas fa-code", color: "#3178c6" },
    { name: "Node.js", icon: "fab fa-node-js", color: "#68a063" },
    { name: "Python / AI", icon: "fab fa-python", color: "#ffd43b" },
    { name: "AWS Cloud", icon: "fab fa-aws", color: "#ff9900" },
    { name: "Docker", icon: "fab fa-docker", color: "#2496ed" },
    { name: "Kubernetes", icon: "fas fa-dharmachakra", color: "#326ce5" },
    { name: "GraphQL", icon: "fas fa-project-diagram", color: "#e535ab" },
    { name: "Flutter", icon: "fas fa-mobile-alt", color: "#02569b" },
    { name: "PostgreSQL", icon: "fas fa-database", color: "#336791" },
    { name: "Cybersecurity", icon: "fas fa-shield-alt", color: "var(--pt-primary)" },
  ];

  // Duplicate for seamless infinite loop
  const doubleList = [...techStack, ...techStack];

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #070a12 0%, #0d1322 50%, #070a12 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "20px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Edge gradient masks */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "120px",
          height: "100%",
          background: "linear-gradient(to right, #070a12, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "100%",
          background: "linear-gradient(to left, #070a12, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div className="pt-marquee-track">
        {doubleList.map((tech, idx) => (
          <div
            key={idx}
            className="pt-marquee-item d-flex align-items-center gap-2"
            style={{
              padding: "8px 20px",
              borderRadius: "99px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              color: "#f8fafc",
              fontSize: "0.92rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
              transition: "all 0.25s ease",
            }}
          >
            <i className={tech.icon} style={{ color: tech.color, fontSize: "1.1rem" }}></i>
            <span>{tech.name}</span>
          </div>
        ))}
      </div>

      <style>{`
        .pt-marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: pt-marquee-scroll 32s linear infinite;
        }
        .pt-marquee-track:hover {
          animation-play-state: paused;
        }
        .pt-marquee-item:hover {
          background: rgba(245, 32, 41, 0.15) !important;
          border-color: rgba(245, 32, 41, 0.4) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(245, 32, 41, 0.25);
        }
        @keyframes pt-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default TechMarquee;

