import React from "react";
import SpotlightCard from "../common/SpotlightCard";

export const SocialMedia = () => {
  const socials = [
    {
      name: "LinkedIn",
      handle: "@parakshtech",
      desc: "Follow enterprise product updates, case studies, and engineering careers.",
      icon: "fab fa-linkedin-in",
      color: "#0a66c2",
      url: "https://www.linkedin.com/company/parakshtech",
    },
    {
      name: "Facebook",
      handle: "@parakshtech",
      desc: "Join our community events, cultural milestones, and tech webinars.",
      icon: "fab fa-facebook-f",
      color: "#1877f2",
      url: "https://www.facebook.com/profile.php?id=61579256180141",
    },
    {
      name: "Instagram",
      handle: "@parakshtech",
      desc: "Behind-the-scenes engineering life, creative design showcases, and team stories.",
      icon: "fab fa-instagram",
      color: "#e1306c",
      url: "https://www.instagram.com/parakshtech/",
    },
    {
      name: "Direct Inquiry",
      handle: "support@parakshtech.com",
      desc: "Schedule a high-priority conversation with our principal architects.",
      icon: "fas fa-paper-plane",
      color: "var(--pt-primary)",
      url: "mailto:support@parakshtech.com",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container py-lg-4 py-2">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "650px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            Connect & Collaborate
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            Join Our Global Tech Community
          </h2>
          <p className="text-muted" style={{ fontSize: "1.02rem" }}>
            Stay tuned to architectural breakdowns, developer tutorials, and industry insights across our official channels.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {socials.map((item, idx) => (
            <div key={idx} className="col-lg-3 col-sm-6">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <SpotlightCard className="p-4 h-100 text-center" maxTilt={8}>
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "rgba(0, 0, 0, 0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      fontSize: "1.5rem",
                      transition: "transform 0.25s ease",
                    }}
                  >
                    <i className={item.icon}></i>
                  </div>
                  <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                    {item.name}
                  </h5>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--pt-primary)",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    {item.handle}
                  </div>
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.84rem", lineHeight: "1.5" }}
                  >
                    {item.desc}
                  </p>
                </SpotlightCard>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;