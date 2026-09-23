import React from "react";
import SpotlightCard from "../common/SpotlightCard";

/**
 * ContactQuickChannels - Interactive Direct Contact & High-Priority Discovery Cards
 * Gives prospective clients instant access to WhatsApp, phone, email, and discovery bookings.
 */
export const ContactQuickChannels = () => {
  const channels = [
    {
      title: "Instant WhatsApp Chat",
      subtitle: "Typical reply in < 5 mins",
      desc: "Connect directly with our solutions team for quick technical inquiries and pricing estimates.",
      icon: "fab fa-whatsapp",
      btnText: "Chat On WhatsApp",
      url: "https://wa.me/919296454675",
      accent: "#25d366",
      isLive: true,
    },
    {
      title: "Direct Architectural Hotline",
      subtitle: "+91 9296454675",
      desc: "Speak with a principal engineering architect regarding mission-critical systems and SLAs.",
      icon: "fas fa-phone-volume",
      btnText: "Call Now",
      url: "tel:+919296454675",
      accent: "var(--pt-primary)",
      isLive: false,
    },
    {
      title: "Priority Technical Inquiry",
      subtitle: "support@parakshtech.com",
      desc: "Send your technical specification or RFP. We provide detailed estimates within 24 hours.",
      icon: "fas fa-paper-plane",
      btnText: "Send Email",
      url: "mailto:support@parakshtech.com",
      accent: "var(--pt-accent-cyan)",
      isLive: false,
    },
    {
      title: "Mutual NDA & Discovery",
      subtitle: "Guaranteed Confidentiality",
      desc: "We sign strict non-disclosure agreements prior to reviewing any proprietary blueprints or code.",
      icon: "fas fa-file-contract",
      btnText: "Request NDA",
      url: "mailto:support@parakshtech.com?subject=NDA%20Request%20ParakshTech",
      accent: "var(--pt-secondary)",
      isLive: false,
    },
  ];

  return (
    <section className="py-5" style={{ background: "#f8fafc", position: "relative" }}>
      <div className="container py-lg-4 py-2">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            High-Priority Channels
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            Multiple Ways To Accelerate Your Project
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            Choose your preferred communication method to start a confidential technical discussion today.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {channels.map((ch, idx) => (
            <div key={idx} className="col-lg-3 col-sm-6">
              <SpotlightCard className="p-4 h-100 text-start" maxTilt={8}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: ch.accent,
                      fontSize: "1.3rem",
                    }}
                  >
                    <i className={ch.icon}></i>
                  </div>
                  {ch.isLive && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        background: "rgba(37, 211, 102, 0.15)",
                        color: "#25d366",
                      }}
                    >
                      ● ONLINE NOW
                    </span>
                  )}
                </div>

                <h4 className="fw-bold mb-1" style={{ fontSize: "1.15rem", color: "#0f172a" }}>
                  {ch.title}
                </h4>

                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: ch.accent,
                    marginBottom: "12px",
                  }}
                >
                  {ch.subtitle}
                </div>

                <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: "0.88rem", lineHeight: "1.6" }}>
                  {ch.desc}
                </p>

                <div className="pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-flex align-items-center gap-2 fw-semibold"
                    style={{
                      color: ch.accent,
                      textDecoration: "none",
                      fontSize: "0.92rem",
                    }}
                  >
                    <span>{ch.btnText}</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: "0.8rem" }}></i>
                  </a>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactQuickChannels;

