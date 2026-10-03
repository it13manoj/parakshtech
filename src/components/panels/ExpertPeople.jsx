import React, { useEffect, useState, useMemo } from "react";
import API from "../../Config/API";
import axios from "axios";
import SpotlightCard from "../common/SpotlightCard";

export const ExpertPeople = () => {
  const [sectionContent, setSectionContent] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackTeam = useMemo(
    () => [
      {
        id: "fb-1",
        title: "Pinki Sharma",
        heading: "Founder & CEO",
        images: "1767717571698.png",
        bio: "Visionary leader driving engineering excellence, enterprise architectures, and strategic digital solutions.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
          twitter: "https://twitter.com/parakshtech",
        },
      },
      {
        id: "fb-2",
        title: "Alok Kumar",
        heading: "Engineering Manager",
        images: "1767717132322.jpeg",
        bio: "Overseeing mission-critical product lifecycles, Agile delivery pipelines, and cloud reliability.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
        },
      },
      {
        id: "fb-3",
        title: "Manoj Sharma",
        heading: "Senior Software Developer",
        images: "1790769179046-28178-20241116-204225.jpg",
        bio: "Specializing in full-stack cloud applications, high-performance APIs, and reactive frontend experiences.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
          github: "https://github.com",
        },
      },
      {
        id: "fb-4",
        title: "Vikki Kumar",
        heading: "Software Developer",
        images: "1767886813013.jpeg",
        bio: "Passionate engineer focusing on modern scalable systems, microservices, and interactive UI engineering.",
        social: {
          linkedin: "https://www.linkedin.com/company/parakshtech",
        },
      },
    ],
    []
  );

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live team members from database
    axios
      .get(`${API.BASE_URL}team`)
      .then((res) => {
        if (!isMounted) return;
        if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          // Normalize Team model fields: name -> title, designation -> heading
          const valid = res.data.data
            .filter(
              (m) =>
                m &&
                m.name &&
                m.name.trim() !== "Expert People" &&
                m.name.trim() !== "Nikki Kumari" &&
                (m.isActive === true || m.isActive === 1 || m.isActive === "1" || m.isActive === undefined)
            )
            .map((m) => {
              let parsedSocial = {};
              try {
                if (typeof m.social === "object" && m.social !== null) {
                  parsedSocial = m.social;
                } else if (typeof m.social === "string") {
                  parsedSocial = JSON.parse(m.social);
                }
              } catch {
                parsedSocial = {};
              }

              return {
                id: m.id,
                title: m.name,
                heading: m.designation,
                images: m.image,
                bio: m.bio,
                social: parsedSocial,
                order: Number(m.order) || 0,
              };
            });

          if (valid.length > 0) {
            setTeamMembers(valid);
          } else {
            setTeamMembers(fallbackTeam);
          }
        } else {
          setTeamMembers(fallbackTeam);
        }
      })
      .catch(() => {
        if (isMounted) setTeamMembers(fallbackTeam);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // 2. Fetch section heading if available
    axios
      .get(`${API.BASE_URL}content/team`)
      .then((res) => {
        if (isMounted && res.data?.success && res.data.data) {
          setSectionContent(res.data.data);
        }
      })
      .catch(() => {
        // Fallback to legacy home-hero section
        axios
          .get(`${API.BASE_URL}home-hero/ExpertPeople`)
          .then((legacyRes) => {
            if (isMounted && legacyRes?.data?.data?.length) {
              setSectionContent(legacyRes.data.data[0]);
            }
          })
          .catch(() => {});
      });

    return () => {
      isMounted = false;
    };
  }, [fallbackTeam]);

  // Helper to resolve image URL
  const resolveImage = (img) => {
    if (!img || typeof img !== "string") return null;
    const clean = img.trim();
    if (!clean) return null;
    if (
      clean.startsWith("http://") ||
      clean.startsWith("https://") ||
      clean.startsWith("data:") ||
      clean.startsWith("blob:")
    ) {
      return clean;
    }
    if (clean.startsWith("/")) {
      return clean;
    }
    return `${API.BASE_URL_IMAGES}${clean}`;
  };

  const displayList = teamMembers.length > 0 ? teamMembers : fallbackTeam;

  return (
    <section className="py-5" id="team" style={{ background: "#0b0f19", position: "relative" }}>
      {/* Background glow accent */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(245, 32, 41, 0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(50px)",
        }}
      />

      <div className="container py-lg-5 py-4" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "720px" }}>
          <span
            className="pt-badge-live"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "99px",
              background: "rgba(245, 32, 41, 0.12)",
              color: "var(--pt-primary)",
              border: "1px solid rgba(245, 32, 41, 0.25)",
              fontSize: "0.82rem",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--pt-primary)",
                boxShadow: "0 0 10px var(--pt-primary)",
              }}
            />
            {sectionContent?.title || "Leadership & Talent"}
          </span>

          <h2
            className="fw-bold mb-3 display-6"
            style={{
              color: "#ffffff",
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            {sectionContent?.heading || "Meet the Engineers & Architects Behind ParakshTech"}
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.6 }}>
            {sectionContent?.contents ||
              "Seasoned technologists obsessed with writing clean code, building resilient infrastructure, and solving hard problems."}
          </p>
        </div>

        {/* Team Cards Grid */}
        {loading ? (
          <div className="text-center py-5" style={{ color: "#94a3b8" }}>
            <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block" style={{ color: "var(--pt-primary)" }} />
            Loading team profiles...
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {displayList.map((member, idx) => {
              const imgSrc = resolveImage(member.images);
              const fallbackAvatar =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

              return (
                <div key={member.id || idx} className="col-lg-3 col-md-6 col-sm-10">
                  <SpotlightCard
                    className="p-3 text-center h-100 pt-team-card"
                    maxTilt={8}
                    style={{
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.3s ease, border-color 0.3s ease",
                    }}
                  >
                    <div>
                      {/* Member Photo */}
                      <div
                        className="position-relative mb-3 overflow-hidden rounded-3 pt-team-photo-wrap"
                        style={{
                          background: "#0f172a",
                          width: "100%",
                          aspectRatio: "1 / 1",
                          borderRadius: "12px",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <img
                          src={imgSrc || fallbackAvatar}
                          alt={member.title || "Team Member"}
                          className="img-fluid rounded-3"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            transition: "transform 0.4s ease",
                          }}
                          onError={(e) => {
                            if (e.currentTarget.src !== fallbackAvatar) {
                              e.currentTarget.src = fallbackAvatar;
                            }
                          }}
                        />
                      </div>

                      {/* Name & Role */}
                      <h4
                        className="fw-bold mb-1"
                        style={{
                          fontSize: "1.2rem",
                          color: "#ffffff",
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {member.title}
                      </h4>

                      <p
                        className="mb-2"
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: "600",
                          color: "var(--pt-primary)",
                        }}
                      >
                        {member.heading}
                      </p>

                      {/* Bio */}
                      {member.bio && (
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "0.82rem",
                            lineHeight: "1.5",
                            marginBottom: "14px",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {/* Social Channels */}
                    {member.social && (
                      <div
                        className="d-flex gap-2 justify-content-center pt-3"
                        style={{
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          marginTop: "auto",
                        }}
                      >
                        {typeof member.social.linkedin === "string" &&
                          member.social.linkedin.trim() &&
                          member.social.linkedin !== "#" && (
                            <a
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="LinkedIn"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#60a5fa",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.85rem",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <i className="fab fa-linkedin-in" />
                            </a>
                          )}

                        {typeof member.social.github === "string" &&
                          member.social.github.trim() &&
                          member.social.github !== "#" && (
                            <a
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="GitHub"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#cbd5e1",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.85rem",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <i className="fab fa-github" />
                            </a>
                          )}

                        {typeof member.social.twitter === "string" &&
                          member.social.twitter.trim() &&
                          member.social.twitter !== "#" && (
                            <a
                              href={member.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Twitter / X"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#38bdf8",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.85rem",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <i className="fab fa-twitter" />
                            </a>
                          )}
                      </div>
                    )}
                  </SpotlightCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpertPeople;