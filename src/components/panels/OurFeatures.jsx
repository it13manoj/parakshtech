import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import SpotlightCard from "../common/SpotlightCard";

export const OurFeatures = () => {
  const [ourfeaturesdata, setourfeaturesdata] = useState(null);
  const [ourfeaturesfet, setOurfeaturesFet] = useState(null);

  const fallbackSteps = [
    {
      step: "01",
      sub_heading: "Discovery & Solution Blueprint",
      sub_content: "We deeply audit your business goals, user personas, and technical architecture to formulate a battle-tested roadmap.",
      icon: "fas fa-compass",
    },
    {
      step: "02",
      sub_heading: "UI/UX & Interactive Design",
      sub_content: "Translating complex functional flows into intuitive, responsive, and visually stunning digital product experiences.",
      icon: "fas fa-layer-group",
    },
    {
      step: "03",
      sub_heading: "Agile Fullstack Development",
      sub_content: "Writing clean, modular, and type-safe code with automated testing, CI/CD pipelines, and continuous sprint reviews.",
      icon: "fas fa-laptop-code",
    },
    {
      step: "04",
      sub_heading: "Cloud Launch & Continuous Scale",
      sub_content: "Deploying across secure cloud infrastructure with real-time analytics, automated failovers, and ongoing feature iterations.",
      icon: "fas fa-rocket",
    },
  ];

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/OurFeatures`)
      .then((response) => {
        if (isMounted && response?.data?.data?.length) {
          setourfeaturesdata(response.data.data[0]);
          if (response.data.data.length > 1) {
            setOurfeaturesFet(response.data.data.slice(1));
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const featuresList = ourfeaturesfet && ourfeaturesfet.length > 0 ? ourfeaturesfet : fallbackSteps;

  return (
    <section className="py-5" id="features" style={{ background: "#ffffff", position: "relative" }}>
      <div className="container py-lg-5 py-4">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            {ourfeaturesdata?.title || "Engineering Workflow"}
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            {ourfeaturesdata?.heading || "How We Transform Ideas Into Market-Leading Products"}
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            A disciplined, transparent 4-stage engineering lifecycle designed for speed, security, and scalability.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {featuresList.map((row, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              <SpotlightCard className="p-4 h-100" maxTilt={8}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, rgba(245, 32, 41, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--pt-primary)",
                      fontSize: "1.25rem",
                    }}
                  >
                    {row.images ? (
                      <img
                        src={`${API.BASE_URL_IMAGES}${row.images}`}
                        alt={row.sub_heading}
                        style={{ width: "24px", height: "24px", objectFit: "contain" }}
                      />
                    ) : (
                      <i className={row.icon || "fas fa-star"}></i>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "800",
                      color: "#e2e8f0",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.step || `0${idx + 1}`}
                  </span>
                </div>

                <h4 className="fw-bold mb-2" style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                  {row?.sub_heading || row?.title}
                </h4>

                <p
                  className="text-muted mb-0"
                  style={{ fontSize: "0.88rem", lineHeight: "1.65" }}
                  dangerouslySetInnerHTML={{ __html: row?.sub_content || row?.contents }}
                ></p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFeatures;