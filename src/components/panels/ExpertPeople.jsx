import React, { useEffect, useState } from "react";
import API from "../../Config/API";
import axios from "axios";
import SpotlightCard from "../common/SpotlightCard";

export const ExpertPeople = () => {
  const [getweb, setweb] = useState(null);
  const [template, setTemplate] = useState(null);

  const fallbackTeam = [
    {
      title: "Manoj Sharma",
      heading: "Principal Cloud Architect & Founder",
      images: null,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      skills: ["Cloud Architecture", "Distributed Systems", "Strategy"],
    },
    {
      title: "Priya Verma",
      heading: "Lead Fullstack & DevOps Engineer",
      images: null,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      skills: ["React 19", "Node.js", "Kubernetes"],
    },
    {
      title: "Rahul Mehta",
      heading: "Head of AI & Machine Learning",
      images: null,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      skills: ["Deep Learning", "Python", "Data Engineering"],
    },
    {
      title: "Ananya Singh",
      heading: "Lead UI/UX & Design Systems",
      images: null,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      skills: ["Design Systems", "Prototyping", "User Research"],
    },
  ];

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/ExpertPeople`)
      .then((response) => {
        if (isMounted && response?.data?.data?.length) {
          setweb(response.data.data[0]);
          if (response.data.data.length > 1) {
            setTemplate(response.data.data.slice(1));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const teamList = template && template.length > 0 ? template : fallbackTeam;

  return (
    <section className="py-5" id="team" style={{ background: "#f8fafc" }}>
      <div className="container py-lg-5 py-4">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            {getweb?.title || "Leadership & Talent"}
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            {getweb?.heading || "Meet the Engineers & Architects Behind ParakshTech"}
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            Seasoned technologists obsessed with writing clean code, building resilient infrastructure, and solving hard problems.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {teamList.map((rows, idx) => (
            <div key={idx} className="col-lg-3 col-md-6 col-sm-10">
              <SpotlightCard className="p-3 text-center h-100" maxTilt={8}>
                <div className="position-relative mb-3 overflow-hidden rounded-3">
                  <img
                    src={
                      rows?.images
                        ? `${API.BASE_URL_IMAGES}${rows.images}`
                        : rows.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={rows?.title || "Team Member"}
                    className="img-fluid rounded-3"
                    style={{
                      height: "280px",
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />
                </div>

                <h4 className="fw-bold mb-1" style={{ fontSize: "1.2rem", color: "#0f172a" }}>
                  {rows?.title}
                </h4>

                <p
                  className="text-muted mb-3"
                  style={{ fontSize: "0.88rem", fontWeight: "500", color: "var(--pt-primary)" }}
                >
                  {rows?.heading}
                </p>

                {/* Skills tags */}
                {rows.skills && (
                  <div className="d-flex flex-wrap gap-1 justify-content-center pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    {rows.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "#e2e8f0",
                          color: "#334155",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertPeople;