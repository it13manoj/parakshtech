import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../Config/API";
import { Link } from "react-router-dom";
import SpotlightCard from "../common/SpotlightCard";

export const Jobs = () => {
  const [jobs, setJobs] = useState(null);
  const [selectedDept, setSelectedDept] = useState("all");

  const fallbackJobs = [
    {
      id: "1",
      title: "Senior Fullstack Engineer (React 19 & Node.js)",
      department: "engineering",
      location: "Hybrid / Remote",
      type: "Full Time",
      experience: "4-6 Years",
      contents:
        "<p>We are seeking a senior engineer to design high-throughput microservices, optimize React single-page architectures, and mentor junior developers in agile development environments.</p>",
    },
    {
      id: "2",
      title: "Cloud Infrastructure & DevOps Architect",
      department: "cloud",
      location: "Remote",
      type: "Full Time",
      experience: "5+ Years",
      contents:
        "<p>Lead the architectural evolution of our multi-region Kubernetes deployments, Terraform infrastructure-as-code blueprints, and automated security audit pipelines on AWS/GCP.</p>",
    },
    {
      id: "3",
      title: "AI / Machine Learning Engineer",
      department: "ai",
      location: "Remote / Hybrid",
      type: "Full Time",
      experience: "3-5 Years",
      contents:
        "<p>Architect intelligent LLM pipelines, fine-tune models on domain-specific datasets, and construct high-performance vector retrieval architectures for client enterprises.</p>",
    },
    {
      id: "4",
      title: "Lead UI/UX Product Designer",
      department: "design",
      location: "Hybrid / Remote",
      type: "Full Time",
      experience: "3+ Years",
      contents:
        "<p>Define design systems, craft high-fidelity interactive prototypes in Figma, and collaborate with engineering leads to ensure pixel-perfect delivery across all web and mobile viewports.</p>",
    },
  ];

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API.BASE_URL}home-hero/Jobs`)
      .then((response) => {
        if (isMounted && response?.data?.data?.length) {
          setJobs(response.data.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const jobList = jobs && jobs.length > 0 ? jobs : fallbackJobs;

  const filteredJobs =
    selectedDept === "all"
      ? jobList
      : jobList.filter((j) => (j.department || "engineering") === selectedDept);

  return (
    <section className="py-5" id="careers-section" style={{ background: "#ffffff" }}>
      <div className="container py-lg-5 py-4">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: "700px" }}>
          <span className="pt-badge-live">
            <span className="pt-live-dot"></span>
            Career Opportunities
          </span>
          <h2 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
            Join Our High-Performance Engineering Team
          </h2>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            We offer competitive compensation, continuous learning stipends, remote flexibility, and the chance to build impactful technology.
          </p>

          {/* Department Filter Tabs */}
          <div className="pt-filter-tabs mt-4">
            <button
              className={`pt-filter-btn ${selectedDept === "all" ? "active" : ""}`}
              onClick={() => setSelectedDept("all")}
            >
              All Roles ({jobList.length})
            </button>
            <button
              className={`pt-filter-btn ${selectedDept === "engineering" ? "active" : ""}`}
              onClick={() => setSelectedDept("engineering")}
            >
              Engineering
            </button>
            <button
              className={`pt-filter-btn ${selectedDept === "cloud" ? "active" : ""}`}
              onClick={() => setSelectedDept("cloud")}
            >
              Cloud & DevOps
            </button>
            <button
              className={`pt-filter-btn ${selectedDept === "ai" ? "active" : ""}`}
              onClick={() => setSelectedDept("ai")}
            >
              AI & Data
            </button>
            <button
              className={`pt-filter-btn ${selectedDept === "design" ? "active" : ""}`}
              onClick={() => setSelectedDept("design")}
            >
              Product Design
            </button>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="d-flex flex-column gap-4">
          {filteredJobs.map((rows, idx) => (
            <SpotlightCard key={idx} className="p-4" maxTilt={4}>
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        background: "rgba(245, 32, 41, 0.1)",
                        color: "var(--pt-primary)",
                      }}
                    >
                      {rows.type || "Full Time"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        background: "#f1f5f9",
                        color: "#475569",
                      }}
                    >
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {rows.location || "Hybrid"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        padding: "3px 10px",
                        borderRadius: "99px",
                        background: "#f1f5f9",
                        color: "#475569",
                      }}
                    >
                      <i className="fas fa-briefcase me-1"></i>
                      {rows.experience || "3+ Years"}
                    </span>
                  </div>

                  <h3 className="fw-bold mb-2" style={{ fontSize: "1.35rem", color: "#0f172a" }}>
                    <Link
                      to={`/careers/job-detail/${rows?.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {rows?.title}
                    </Link>
                  </h3>

                  <div
                    className="text-muted mb-0"
                    style={{ fontSize: "0.93rem", lineHeight: "1.6" }}
                    dangerouslySetInnerHTML={{
                      __html: rows.contents?.split("</p>")[0] + "</p>",
                    }}
                  ></div>
                </div>

                <div className="col-lg-4 text-lg-end">
                  <Link
                    to={`/careers/job-detail/${rows?.id}`}
                    className="pt-btn-primary"
                    style={{ padding: "10px 24px", fontSize: "0.9rem" }}
                  >
                    <span>View Role & Apply</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Jobs;