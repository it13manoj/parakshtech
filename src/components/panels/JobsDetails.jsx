import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API from "../../Config/API";
import { CareerHero } from "./Hero";
import SpotlightCard from "../common/SpotlightCard";

function JobsDetails() {
  const [template, setTemplate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    email: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
  });
  const { id } = useParams();

  const fallbackJob = {
    title: "Senior Fullstack Engineer (React & Cloud Architecture)",
    type: "Full Time",
    location: "Hybrid / Remote (India)",
    experience: "4-6 Years",
    contents: `
      <h4>Role Overview</h4>
      <p>As a Senior Fullstack Engineer at ParakshTech, you will lead the architecture, implementation, and optimization of critical client-facing web applications. You'll work closely with product stakeholders, cloud architects, and UI/UX designers to translate requirements into scalable code.</p>
      
      <h4>Core Responsibilities</h4>
      <ul>
        <li>Architect and deploy modular React 19 frontend applications and Node.js microservices.</li>
        <li>Participate in peer code reviews, CI/CD pipeline improvements, and sprint estimations.</li>
        <li>Optimize application load times, web vitals, and database query latency.</li>
        <li>Mentor associate engineers and champion clean code paradigms.</li>
      </ul>

      <h4>Key Requirements</h4>
      <ul>
        <li>4+ years of professional fullstack engineering experience with React, TypeScript, and Node.js.</li>
        <li>Solid understanding of RESTful APIs, GraphQL, and microservice communications.</li>
        <li>Experience deploying on cloud providers (AWS, GCP, or Azure) using Docker containers.</li>
        <li>Familiarity with automated testing frameworks (Jest, React Testing Library, Cypress).</li>
      </ul>
    `,
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      axios
        .get(`${API.BASE_URL}jobs/details/${id}`)
        .then((res) => {
          if (isMounted && res?.data?.data) {
            setTemplate(res.data.data);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const jobData = template || fallbackJob;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <CareerHero />
      <section className="py-5" id="job-detail-view" style={{ background: "#ffffff" }}>
        <div className="container py-lg-5 py-3">
          <div className="row g-5">
            {/* Job Details Column */}
            <div className="col-lg-7">
              <Link
                to="/careers"
                className="d-inline-flex align-items-center gap-2 mb-3 text-muted text-decoration-none"
                style={{ fontSize: "0.9rem" }}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Back to All Open Roles</span>
              </Link>

              <h1 className="fw-bold mb-3 display-6" style={{ color: "#0f172a" }}>
                {jobData.title}
              </h1>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill">
                  {jobData.type || "Full Time"}
                </span>
                <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill">
                  {jobData.location || "Hybrid / Remote"}
                </span>
                <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
                  {jobData.experience || "3+ Years Experience"}
                </span>
              </div>

              <div
                className="text-muted job-body"
                style={{ lineHeight: "1.8", fontSize: "1rem" }}
                dangerouslySetInnerHTML={{ __html: jobData.contents }}
              ></div>
            </div>

            {/* Application Form Column */}
            <div className="col-lg-5">
              <div className="sticky-top" style={{ top: "100px" }}>
                <SpotlightCard className="p-4 shadow-lg" maxTilt={5}>
                  <h4 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                    Apply For This Position
                  </h4>
                  <p className="text-muted mb-4" style={{ fontSize: "0.88rem" }}>
                    Submit your application directly to our engineering leadership.
                  </p>

                  {submitted ? (
                    <div className="alert alert-success p-4 rounded-3 text-center">
                      <div className="mb-2" style={{ fontSize: "2rem", color: "#10b981" }}>
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <h5 className="fw-bold">Application Received!</h5>
                      <p className="small mb-0 text-muted">
                        Thank you for your interest. Our talent team will review your profile and reach out within 3 business days.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Full Name *</label>
                        <input
                          type="text"
                          required
                          className="pt-form-control-custom"
                          placeholder="Your legal name"
                          value={applicantForm.name}
                          onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Work Email *</label>
                        <input
                          type="email"
                          required
                          className="pt-form-control-custom"
                          placeholder="name@example.com"
                          value={applicantForm.email}
                          onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          className="pt-form-control-custom"
                          placeholder="https://linkedin.com/in/..."
                          value={applicantForm.linkedin}
                          onChange={(e) => setApplicantForm({ ...applicantForm, linkedin: e.target.value })}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold">GitHub / Portfolio URL</label>
                        <input
                          type="url"
                          className="pt-form-control-custom"
                          placeholder="https://github.com/..."
                          value={applicantForm.portfolio}
                          onChange={(e) => setApplicantForm({ ...applicantForm, portfolio: e.target.value })}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-semibold">Short Note / Pitch</label>
                        <textarea
                          rows="3"
                          className="pt-form-control-custom"
                          placeholder="Why are you excited to join ParakshTech?"
                          value={applicantForm.coverLetter}
                          onChange={(e) => setApplicantForm({ ...applicantForm, coverLetter: e.target.value })}
                        ></textarea>
                      </div>

                      <button type="submit" className="pt-btn-primary w-100 justify-content-center">
                        <span>Submit Application</span>
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </form>
                  )}
                </SpotlightCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default JobsDetails;
